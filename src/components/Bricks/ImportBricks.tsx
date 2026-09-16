'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button, useConfig } from '@payloadcms/ui'

export default function ImportBricks() {
  const router = useRouter()
  const { config } = useConfig()
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!file || busy) return
    setBusy(true)
    setMessage('')
    setError('')
    try {
      const form = new FormData()
      form.set('file', file)
      const response = await fetch(`${config.routes.api}/bricks/import`, {
        method: 'POST',
        body: form,
        credentials: 'same-origin',
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Import failed. Please try again.')
      setMessage(`Created ${result.created} bricks. Updated ${result.updated} existing bricks.`)
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Import failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section
      style={{
        marginBottom: '24px',
        padding: '20px',
        border: '1px solid var(--theme-elevation-150)',
      }}
    >
      <h2>Import brick spreadsheet</h2>
      <p>
        Upload an .xlsx workbook with sheets named North West and North East. Put column numbers
        (1–50) in the first row, row letters (A–N) in the first column, and brick inscriptions in
        the grid. Matching panel/row/column locations are updated; new locations are created. Blank
        cells are skipped.
      </p>
      <form onSubmit={upload}>
        <label htmlFor="brick-spreadsheet">Spreadsheet (maximum 5 MB)</label>{' '}
        <input
          id="brick-spreadsheet"
          type="file"
          accept=".xlsx"
          disabled={busy}
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null)
            setMessage('')
            setError('')
          }}
        />{' '}
        <Button type="submit" disabled={!file || busy}>
          {busy ? 'Importing…' : 'Import bricks'}
        </Button>
      </form>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
    </section>
  )
}
