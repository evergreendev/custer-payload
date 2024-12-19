import type { Post, ArchiveBlock as ArchiveBlockProps, Page, Member } from '@/payload-types'

import configPromise from '@payload-config'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'
import { getPayload } from 'payload'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs, relationTo} = props

  const limit = limitFromProps || 3

  let posts: (Post & {relationTo: 'posts' | 'members' | 'pages' | undefined
  } | Member & {relationTo: 'posts' | 'members' | 'pages' | undefined
  } | Page & {relationTo: 'posts' | 'members' | 'pages' | undefined
  })[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: relationTo||'posts',
      depth: 1,
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs.map(doc => {
      return {...doc, relationTo: relationTo||"posts"}
    })
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return { ...post.value, relationTo: post.relationTo||"posts" }
      }) as (Post & {relationTo: 'posts' | 'members' | 'pages' | undefined
      } | Member & {relationTo: 'posts' | 'members' | 'pages' | undefined
      } | Page & {relationTo: 'posts' | 'members' | 'pages' | undefined
      })[]

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className="py-16 bg-amber-50" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16 text-brand-blueBright text-center">
          <RichText className="mb-4 max-w-prose px-14 text-inherit prose-xl prose-h2:text-7xl prose-h2:mb-4 prose-h2:font-display prose-h2:font-bold" content={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts}/>
    </div>
  )
}
