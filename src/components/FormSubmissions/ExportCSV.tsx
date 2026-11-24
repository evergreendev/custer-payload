'use client'

import { Button, toast, useConfig, useListQuery, useSelection } from '@payloadcms/ui'
import { useState } from 'react'

export default function ExportCSV() {
  const { config } = useConfig()
  const { query } = useListQuery()
  const { selectAll, selectedIDs, totalDocs } = useSelection()
  const [exporting, setExporting] = useState(false)
  const allMatching = selectAll === 'allAvailable'
  const count = allMatching ? (totalDocs ?? 0) : selectedIDs.length

  async function exportSelection() {
    if (count === 0 || exporting) return
    setExporting(true)

    try {
      const response = await fetch(`${config.routes.api}/form-submissions/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          allMatching
            ? { mode: 'allMatching', where: query.where, search: query.search }
            : { mode: 'selected', ids: selectedIDs },
        ),
      })
      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.error || 'Unable to export the selected submissions.')
      }

      const url = URL.createObjectURL(await response.blob())
      const download = document.createElement('a')
      download.href = url
      download.download = 'form-submissions.csv'
      download.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to export the selected submissions.',
      )
    } finally {
      setExporting(false)
    }
  }

  return (
    <Button
      buttonStyle="secondary"
      disabled={count === 0 || exporting}
      onClick={exportSelection}
      size="small"
    >
      {exporting ? 'Exporting…' : 'Export selected as CSV'}
    </Button>
  )
}
