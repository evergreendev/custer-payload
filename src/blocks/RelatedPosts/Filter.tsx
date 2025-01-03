'use client'
import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  filters: {
    property: string
    value: any
    label: string
  }[],
}

const Filter = ({filters}: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filterParams = searchParams.get('active-filters')

  const handleUpdateQueryParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set(key, value)
    router.push(`?${newParams.toString()}`, { scroll: false })
  }
  const [activeFilters, setActiveFilters] = React.useState<
    {
      property: string
      value: any
      label: string
    }[]
  >([])


  useEffect(() => {
    if(!filterParams) return;
    setActiveFilters(decodeURI(filterParams || '')
      .split(',')
      .map((item) => item.split('|'))
      .map((item) => {
        return {
          property: item[0],
          value: parseInt(item[1]),
          label: '',
        }
      }))
  }, [])

  const handleFilterChange = (property: string, value: string) => {
    const foundFilter = activeFilters.find(
      (filter) => filter.property === property && filter.value === value,
    )
    let updatedFilters: {
      property: string
      value: any
      label: string
    }[] = []
    if (foundFilter) {
      updatedFilters = activeFilters.filter(
        (filter) => filter.property !== property || filter.value !== value,
      )
    } else {
      const currentFilter = filters.find((filter) => {
        return filter.property === property && filter.value === value
      })
      if (currentFilter) {
        //updatedFilters = activeFilters.concat([currentFilter])
        updatedFilters = [currentFilter];
      }
    }

    setActiveFilters(updatedFilters)

    handleUpdateQueryParam(
      'active-filters',
      updatedFilters
        .map((filter) => filter.property + '|' + filter.value + '|' + filter.label)
        .join(','),
    )
  }

  return (
    <>
      {
        filters.length > 0 && <div className="z-30 p-2 bg-background flex lg:flex-wrap w-full overflow-x-auto max-w-screen-lg mx-auto gap-2 text-lg">
          <p>filter:</p>
          {filters.map(({ property, value, label }) => (
            <button
              onClick={() => handleFilterChange(property, value)}
              className={`
            rounded-full
            whitespace-nowrap
            px-2
            ${
                activeFilters.find((filter) => filter.property === property && filter.value === value)
                  ? 'border-blue-950 border-2 bg-brand-blue text-white'
                  : 'border-gray-100 border-2 text-gray-600'
              }
            `}
              key={property + value}
            >
              {label}
            </button>
          ))}
          {activeFilters.length > 0 && (
            <button
              onClick={() => {
                setActiveFilters([])
                handleUpdateQueryParam('active-filters', '')
              }}
            >
              clear
            </button>
          )}
        </div>
      }
    </>
  )
}

export default Filter
