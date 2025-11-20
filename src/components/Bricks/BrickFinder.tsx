"use client"

import React, { useEffect, useMemo, useState } from 'react'

type Brick = {
  id: string
  title: string
  panel: string
  row: string // 'A' - 'M'
  column: number // 1 - 10
}

type ApiResponse = {
  docs: Brick[]
  totalDocs: number
}

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function useDebouncedValue<T>(value: T, delay = 300) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}

const ROWS = Array.from({ length: 13 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i))
const COLS = Array.from({ length: 10 }, (_, i) => i + 1)

export default function BrickFinder() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Brick[]>([])
  const [selected, setSelected] = useState<Brick | null>(null)
  const debounced = useDebouncedValue(query, 300)

  useEffect(() => {
    let active = true
    async function run() {
      if (!debounced || debounced.length < 2) {
        setResults([])
        setSelected(null)
        return
      }
      setLoading(true)
      try {
        const params = new URLSearchParams()
        // Payload `like` operator for title
        params.set('where[title][like]', debounced)
        params.set('limit', '10')
        const res = await fetch(`/api/bricks?${params.toString()}`, {
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('Failed to fetch bricks')
        const data: ApiResponse = await res.json()
        if (!active) return
        setResults(data.docs)
        if (data.docs.length > 0) setSelected(data.docs[0])
      } catch (e) {
        if (active) {
          console.error(e)
          setResults([])
          setSelected(null)
        }
      } finally {
        active = false
        setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [debounced])

  const grid = useMemo(() => {
    // Build a 13x10 grid and mark selected location
    const map = new Map<string, Brick>()
    if (selected) {
      map.set(`${selected.row}-${selected.column}`, selected)
    }
    return { map }
  }, [selected])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <label htmlFor="brick-search" className="block text-sm font-medium text-gray-700">
          Search for a brick by title
        </label>
        <input
          id="brick-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter brick title..."
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {loading && <p className="mt-2 text-sm text-gray-500">Searching…</p>}
      </div>

      {results.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-2">Select a result:</p>
          <div className="flex flex-wrap gap-2">
            {results.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelected(b)}
                className={classNames(
                  'px-3 py-1.5 rounded border text-sm',
                  selected?.id === b.id
                    ? 'bg-brand-red text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                )}
                title={`${b.title} — ${formatPanel(b.panel)} Row ${b.row}, Col ${b.column}`}
              >
                {b.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Location</h3>
            <p className="text-sm text-gray-600">
              Panel: <strong>{formatPanel(selected.panel)}</strong> · Row: <strong>{selected.row}</strong> · Column: <strong>{selected.column}</strong>
            </p>
          </div>

          <div className="overflow-auto">
            <div className="inline-grid grid-cols-[auto_repeat(10,max-content)] gap-1">
              {/* Column headers */}
              <div />
              {COLS.map((c) => (
                <div key={`h-${c}`} className="text-xs text-gray-600 text-center px-1">
                  {c}
                </div>
              ))}
              {ROWS.map((r) => (
                <React.Fragment key={`row-${r}`}>
                  <div className="text-xs text-gray-600 pr-2 flex items-center justify-end">{r}</div>
                  {COLS.map((c) => {
                    const key = `${r}-${c}`
                    const isTarget = grid.map.has(key)
                    return (
                      <div
                        key={key}
                        className={classNames(
                          'h-8 w-12 sm:h-6 sm:w-14 border rounded-sm flex items-center justify-center text-[10px] sm:text-xs',
                          isTarget ? 'bg-black text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-200'
                        )}
                        aria-label={`Row ${r} Column ${c}${isTarget ? ' (selected)' : ''}`}
                      >
                        {isTarget ? '★' : ''}
                      </div>
                    )
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatPanel(value: string) {
  switch (value) {
    case 'panel-1-e':
      return 'Panel 1 E'
    case 'panel-2-e':
      return 'Panel 2 E'
    case 'panel-3-e':
      return 'Panel 3 E'
    case 'panel-4-e':
      return 'Panel 4 E'
    case 'panel-5-e':
      return 'Panel 5 E'
    case 'panel-1-w':
      return 'Panel 1 W'
    case 'panel-2-w':
      return 'Panel 2 W'
    case 'panel-3-w':
      return 'Panel 3 W'
    case 'panel-4-w':
      return 'Panel 4 W'
    case 'panel-5-w':
      return 'Panel 5 W'
    default:
      return value
  }
}
