import type { Endpoint } from 'payload'
import {
  MAX_BRICK_SPREADSHEET_BYTES,
  parseBrickSpreadsheet,
} from '../utilities/parseBrickSpreadsheet'

export const importBricks: Endpoint = {
  path: '/import',
  method: 'post',
  handler: async (req) => {
    if (!req.user || req.user.collection !== 'users') {
      return Response.json({ error: 'Sign in to import bricks.' }, { status: 401 })
    }

    let parsed: Awaited<ReturnType<typeof parseBrickSpreadsheet>>
    try {
      if (!req.formData) throw new Error('Upload an .xlsx spreadsheet.')
      const form = await req.formData()
      const file = form.get('file')
      if (!(file instanceof File) || !file.name.toLowerCase().endsWith('.xlsx')) {
        throw new Error('Upload an .xlsx spreadsheet.')
      }
      if (!file.size || file.size > MAX_BRICK_SPREADSHEET_BYTES) {
        throw new Error('The spreadsheet must be between 1 byte and 5 MB.')
      }
      parsed = await parseBrickSpreadsheet(await file.arrayBuffer())
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : 'Unable to read the spreadsheet.' },
        { status: 400 },
      )
    }

    try {
      // One atomic statement: concurrent uploads are protected by the collection's
      // compound unique index. Updates preserve the brick ID and creation date.
      const values: (string | number)[] = []
      const rows = parsed.bricks.map((brick) => {
        const offset = values.length
        values.push(brick.title, brick.panel, brick.row, brick.column)
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, NOW(), NOW())`
      })
      const result = await req.payload.db.pool.query(
        `INSERT INTO "bricks" ("title", "panel", "row", "column", "created_at", "updated_at")
         VALUES ${rows.join(', ')}
         ON CONFLICT ("panel", "row", "column") DO UPDATE
         SET "title" = EXCLUDED."title", "updated_at" = EXCLUDED."updated_at"
         RETURNING (xmax = 0) AS "created"`,
        values,
      )
      const created = result.rows.filter((row: { created: boolean }) => row.created).length
      return Response.json({
        created,
        updated: parsed.bricks.length - created,
      })
    } catch (error) {
      req.payload.logger.error({ err: error, msg: 'Brick spreadsheet import failed' })
      return Response.json(
        {
          error: 'Unable to save the bricks. No bricks were created or updated. Please try again.',
        },
        { status: 500 },
      )
    }
  },
}
