import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import FuzzySearch from 'fuzzy-search'
import { getPayload } from 'payload'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 1000,
    ...(query
      ? {
        }
      : {}),
  })
  const postsWithTypes = posts.docs.map(doc => {
    return { ...doc, relationTo: doc.doc?.relationTo };
  })

  const searcher = new FuzzySearch(postsWithTypes, ['title'])

  const result = searcher.search(query);

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose max-w-none">
          <h1 className="sr-only">Search</h1>
          <Search />
        </div>
      </div>

      {result.length > 0 ? (
        <CollectionArchive posts={result} />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Custer Chamber of Commerce Search`,
  }
}
