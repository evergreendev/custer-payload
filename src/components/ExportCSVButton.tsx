'use client'
import React, { useState } from 'react'
import { useSelection, useConfig } from '@payloadcms/ui'

export const ExportCSVButton = ()=> {
  const [isLoading, setIsLoading] = useState(false)
  const { selected, selectedIDs, count } = useSelection()
  const { config } = useConfig()

  const handleExport = async () => {
    if (isLoading || count === 0) return <></>

    setIsLoading(true)


    try {
      const selectedIds =
        Array.isArray(selectedIDs) && selectedIDs.length > 0
          ? selectedIDs
          : Array.from(selected.entries())
              .filter(([, isSelected]) => isSelected)
              .map(([id]) => id)

      if (selectedIds.length === 0) {
        throw new Error('No rows selected')
      }

      const response = await fetch(`${config.serverURL}/api/export-form-submissions`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedIds }),
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `form-submissions-${new Date().toISOString()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Error exporting CSV')
    } finally {
      setIsLoading(false)
    }
  }

  if (count === 0) return <></>

  return (
    <div style={{ marginBottom: '20px' }}>
      <button
        onClick={handleExport}
        disabled={isLoading}
        type="button"
        className="btn btn--style-primary"
      >
        {isLoading ? 'Exporting...' : `Export ${count} to CSV`}
      </button>
    </div>
  )
}
