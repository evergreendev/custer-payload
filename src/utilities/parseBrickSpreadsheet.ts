import ExcelJS from 'exceljs'
import { BRICK_COLUMN_COUNT, BRICK_PANELS, BRICK_ROWS } from './bricks'

export type ImportedBrick = {
  title: string
  panel: 'north-west' | 'north-east'
  row: string
  column: number
}

export const MAX_BRICK_SPREADSHEET_BYTES = 5 * 1024 * 1024

export async function parseBrickSpreadsheet(buffer: ArrayBuffer) {
  const workbook = new ExcelJS.Workbook()
  try {
    await workbook.xlsx.load(buffer)
  } catch {
    throw new Error('Unable to read this file. Upload a valid .xlsx workbook.')
  }

  const bricks: ImportedBrick[] = []
  const locations = new Map<string, number>()
  let duplicates = 0

  for (const sheet of workbook.worksheets) {
    const panel = BRICK_PANELS.find(
      (option) => option.label.toLowerCase() === sheet.name.trim().toLowerCase(),
    )
    if (!panel) {
      throw new Error(`Unknown sheet "${sheet.name}". Use North West or North East.`)
    }

    const text = (cell: ExcelJS.Cell) => {
      if (cell.type === ExcelJS.ValueType.Formula || cell.type === ExcelJS.ValueType.Error) {
        throw new Error(
          `${sheet.name}!${cell.address}: use text or numbers, not formulas or errors.`,
        )
      }
      if (cell.isMerged && cell.text.trim()) {
        throw new Error(
          `${sheet.name}!${cell.address}: unmerge cells to give each brick a location.`,
        )
      }
      return cell.text.trim()
    }

    const columns = new Map<number, number>()
    const usedColumns = new Set<number>()
    sheet.getRow(1).eachCell((cell, index) => {
      const value = text(cell)
      if (!value || index === 1) return
      const column = Number(value)
      if (!Number.isInteger(column) || column < 1 || column > BRICK_COLUMN_COUNT) {
        throw new Error(
          `${sheet.name}!${cell.address}: column headers must be numbers from 1 to 50.`,
        )
      }
      if (usedColumns.has(column)) {
        throw new Error(`${sheet.name}: column header ${column} is repeated.`)
      }
      usedColumns.add(column)
      columns.set(index, column)
    })
    if (!columns.size)
      throw new Error(`${sheet.name}: put numbered column headers in the first row.`)

    sheet.eachRow((sheetRow, index) => {
      if (index === 1) return
      const row = text(sheetRow.getCell(1)).toUpperCase()
      sheetRow.eachCell((cell, cellIndex) => {
        if (cellIndex === 1) return
        const title = text(cell)
        if (!title) return
        if (!BRICK_ROWS.includes(row)) {
          throw new Error(`${sheet.name}!A${index}: row labels must be A through N.`)
        }
        const column = columns.get(cellIndex)
        if (!column) {
          throw new Error(
            `${sheet.name}!${cell.address}: this brick has no numbered column header.`,
          )
        }
        const key = `${panel.value}:${row}:${column}`
        const existingIndex = locations.get(key)
        if (existingIndex !== undefined) {
          duplicates++
          bricks[existingIndex].title = title
          return
        }
        locations.set(key, bricks.length)
        bricks.push({ title, panel: panel.value as ImportedBrick['panel'], row, column })
      })
      if (row && !BRICK_ROWS.includes(row)) {
        throw new Error(`${sheet.name}!A${index}: row labels must be A through N.`)
      }
    })
  }

  if (!bricks.length)
    throw new Error('No bricks found. Enter a name or inscription in the grid cells.')
  return { bricks, duplicates }
}
