'use client'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import React, { useEffect } from 'react'
import { Member } from '@/payload-types'

type Props = {
  posts: Member[]
  filters: {
    property: string
    value: any
    label: string
  }[]
}

const FilteredPosts = ({ posts, filters }: Props) => {
  const [activeFilters, setActiveFilters] = React.useState<
    {
      property: string
      value: any
      label: string
    }[]
  >([])
  const [activePosts, setActivePosts] = React.useState(posts);

  useEffect(() => {
    if (activeFilters.length === 0) setActivePosts(posts);//Show all post if there are no filters
    else setActivePosts(posts.filter(post => {
      return activeFilters.find(filter => {
        const propertyIsArray = Array.isArray(post[filter.property]);

        if (propertyIsArray){
          return post[filter.property].find(post => {
            return post.id === filter.value;
          });
        } else {
          return post[filter.property] = filter.value;
        }
      })
    }));

  }, [activeFilters, posts])


  const handleFilterChange = (property: string, value: string) => {
    const foundFilter = activeFilters.find(
      (filter) => filter.property === property && filter.value === value,
    )

    if (foundFilter) {
      setActiveFilters(
        activeFilters.filter((filter) => filter.property !== property || filter.value !== value),
      )
    } else {
      const currentFilter = filters.find((filter) => {
        return filter.property === property && filter.value === value
      })
      if (currentFilter) {
        setActiveFilters(activeFilters.concat([currentFilter]))
      }
    }
  }

  return (
    <>
      <div className="flex w-full overflow-x-auto max-w-screen-lg mx-auto gap-2 text-lg sticky-top">
        <p>filter:</p>
        {filters.map(({ property, value, label }, index) => (
          <button
            onClick={() => handleFilterChange(property, value)}
            className={`
            rounded-full
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
            }}
          >
            clear
          </button>
        )}
      </div>
      <RelatedPosts relationTo="members" docs={activePosts} />
    </>
  )
}

export default FilteredPosts
