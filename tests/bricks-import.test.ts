import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'
import ExcelJS from 'exceljs'
import type { PayloadRequest } from 'payload'
import { parseBrickSpreadsheet } from '../src/utilities/parseBrickSpreadsheet'
import { importBricks } from '../src/endpoints/importBricks'

async function workbookFile(setup?: (workbook: ExcelJS.Workbook) => void) {
  const workbook = new ExcelJS.Workbook()
  const west = workbook.addWorksheet('North West')
  west.addRow(['', 1, 50])
  west.addRow(['A', 'Same name', 'Same name'])
  west.addRow(['N', 'Last row'])
  const east = workbook.addWorksheet('North East')
  east.addRow(['', 1, 50])
  east.addRow(['A', 'East brick'])
  setup?.(workbook)
  return new File([await workbook.xlsx.writeBuffer()], 'bricks.xlsx')
}

function request(file: File, query: unknown, authenticated = true) {
  const form = new FormData()
  form.set('file', file)
  return {
    user: authenticated ? { id: 1, collection: 'users' } : null,
    formData: async () => form,
    payload: { db: { pool: { query } }, logger: { error: () => {} } },
  } as unknown as PayloadRequest
}

test('reads both panels, row N and column 50; preserves repeated names', async () => {
  const result = await parseBrickSpreadsheet(await (await workbookFile()).arrayBuffer())
  assert.equal(result.bricks.length, 4)
  assert.deepEqual(result.bricks[1], {
    title: 'Same name',
    panel: 'north-west',
    row: 'A',
    column: 50,
  })
  assert.equal(result.bricks[2].row, 'N')
  assert.equal(result.bricks[3].panel, 'north-east')
})

test('ignores blank cells and uses the last inscription for repeated coordinates', async () => {
  const file = await workbookFile((book) => {
    book.getWorksheet('North West')!.addRow(['A', 'Replacement name', ''])
    book.getWorksheet('North East')!.getCell('B2').value = null
  })
  const result = await parseBrickSpreadsheet(await file.arrayBuffer())
  assert.equal(result.bricks.length, 3)
  assert.equal(result.duplicates, 1)
  assert.equal(result.bricks[0].title, 'Replacement name')
})

test('rejects bad headers, sheets, rows, formulas and missing headers before saving', async () => {
  const invalid: Array<(book: ExcelJS.Workbook) => void> = [
    (book) => {
      book.getWorksheet(1)!.getCell('B1').value = 51
    },
    (book) => {
      book.getWorksheet(1)!.getCell('B1').value = 1.5
    },
    (book) => {
      book.getWorksheet(1)!.getCell('C1').value = 1
    },
    (book) => {
      book.getWorksheet(1)!.getCell('B1').value = null
    },
    (book) => {
      book.getWorksheet(1)!.getCell('A2').value = 'O'
    },
    (book) => {
      book.getWorksheet(1)!.getCell('B2').value = { formula: '1+1', result: 2 }
    },
    (book) => {
      book.addWorksheet('Other')
    },
    (book) => {
      book.getWorksheet(1)!.mergeCells('B2:C2')
    },
  ]
  for (const setup of invalid) {
    const file = await workbookFile(setup)
    const response = await importBricks.handler(request(file, () => assert.fail('Must not write')))
    assert.equal(response.status, 400)
  }
})

test('requires authentication and rejects corrupt workbooks', async () => {
  const file = new File(['not a workbook'], 'bricks.xlsx')
  const noWrite = () => assert.fail('Must not write')
  assert.equal((await importBricks.handler(request(file, noWrite, false))).status, 401)
  assert.equal((await importBricks.handler(request(file, noWrite))).status, 400)
})

test('reports a failed atomic upsert without claiming any bricks were changed', async () => {
  const response = await importBricks.handler(
    request(await workbookFile(), async () => {
      throw new Error('Database unavailable')
    }),
  )
  assert.equal(response.status, 500)
  assert.match((await response.json()).error, /No bricks were created or updated/)
})

test(
  'Postgres: repeat uploads update matching locations and create new ones',
  {
    skip: !process.env.DATABASE_URI,
  },
  async () => {
    const require = createRequire(import.meta.url)
    const adapterRequire = createRequire(require.resolve('@payloadcms/db-postgres'))
    const { Client } = adapterRequire('pg')
    const client = new Client({ connectionString: process.env.DATABASE_URI })
    await client.connect()
    try {
      // A session-local table shadows the real bricks table; no real records are changed.
      await client.query(`CREATE TEMP TABLE bricks (
      id serial PRIMARY KEY, title text NOT NULL, panel text NOT NULL,
      row text NOT NULL, "column" integer NOT NULL,
      created_at timestamptz NOT NULL, updated_at timestamptz NOT NULL,
      UNIQUE (panel, row, "column")
    )`)
      const query = client.query.bind(client)
      const file = await workbookFile()
      const first = await importBricks.handler(request(file, query))
      assert.deepEqual(await first.json(), { created: 4, updated: 0 })
      const original = (await client.query('SELECT id, created_at FROM bricks ORDER BY id')).rows
      await client.query("UPDATE bricks SET updated_at = '2000-01-01'")
      const second = await importBricks.handler(request(file, query))
      assert.deepEqual(await second.json(), { created: 0, updated: 4 })
      const changed = await workbookFile((book) => {
        book.getWorksheet(1)!.getCell('B2').value = 'Changed inscription'
      })
      assert.deepEqual(await (await importBricks.handler(request(changed, query))).json(), {
        created: 0,
        updated: 4,
      })
      const saved = await client.query(
        'SELECT id, title, created_at, updated_at FROM bricks ORDER BY id',
      )
      assert.deepEqual(
        saved.rows.map(({ id, created_at }: { id: number; created_at: Date }) => ({
          id,
          created_at,
        })),
        original,
      )
      assert.ok(
        saved.rows.every((row: { updated_at: Date }) => row.updated_at.getUTCFullYear() > 2000),
      )
      assert.deepEqual(
        saved.rows.map((row: { title: string }) => row.title),
        ['Changed inscription', 'Same name', 'Last row', 'East brick'],
      )
      const extended = await workbookFile((book) => {
        book.getWorksheet('North East')!.addRow(['N', '', "O'NEIL"])
      })
      const mixed = await importBricks.handler(request(extended, query))
      assert.deepEqual(await mixed.json(), { created: 1, updated: 4 })
      assert.equal(
        (await client.query('SELECT count(*)::int AS count FROM bricks')).rows[0].count,
        5,
      )
      const blank = await workbookFile((book) => {
        book.getWorksheet('North West')!.getCell('B2').value = null
      })
      assert.deepEqual(await (await importBricks.handler(request(blank, query))).json(), {
        created: 0,
        updated: 3,
      })
      assert.equal(
        (
          await client.query(
            "SELECT title FROM bricks WHERE panel = 'north-west' AND row = 'A' AND \"column\" = 1",
          )
        ).rows[0].title,
        'Same name',
      )
    } finally {
      await client.end()
    }
  },
)
