'use client'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import React, { useEffect } from 'react'
import { Member } from '@/payload-types'
import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  posts: Member[]
  filters: {
    property: string
    value: any
    label: string
  }[],
  showInfo?: boolean|null
}

const FilteredPosts = ({ posts, filters,showInfo }: Props) => {
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
  const [activePosts, setActivePosts] = React.useState(posts)


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

  useEffect(() => {
    if (activeFilters.length === 0)
      setActivePosts(posts) //Show all post if there are no filters
    else
      setActivePosts(
        posts.filter((post) => {
          return activeFilters.find((filter) => {
            const propertyIsArray = Array.isArray(post[filter.property])

            if (propertyIsArray) {
              return post[filter.property].find((post) => {
                return post.id === filter.value
              })
            } else {
              return (post[filter.property] = filter.value)
            }
          })
        }),
      )
  }, [activeFilters, posts])

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
        updatedFilters = activeFilters.concat([currentFilter])
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
        filters.length > 0 && <div className="z-30 p-2 bg-background flex w-full overflow-x-auto max-w-screen-lg mx-auto gap-2 text-lg sticky top-0">
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
      <RelatedPosts showInfo={showInfo} relationTo="members" docs={activePosts} />
    </>
  )
}

export default FilteredPosts
