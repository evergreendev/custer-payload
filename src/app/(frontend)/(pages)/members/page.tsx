import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import React, { cache, Suspense } from 'react'

import PageClient from './page.client'
import { getPayload } from 'payload'
import Filter from '@/blocks/RelatedPosts/Filter'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import Pagination from '@/blocks/ParamPagination'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const members = await payload.find({
    collection: 'categories',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  return members.docs.map(({ slug }) => {
    return { slug }
  })
}

type Args = {
  searchParams: Promise<{
    ["active-filters"]?: string,
    page: string
  }>
}

export default async function Post({searchParams: searchParamsPromise}:Args) {
  const searchParams = await searchParamsPromise;
  const activeFilters = searchParams['active-filters']||"";
  const page = searchParams['page']||"1";

  const url = '/members/category/'
  const categories = await queryCategories();

  const members = await queryMembers(parseInt(page),activeFilters)

  return (
    <article className="pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <div className="flex flex-col items-center gap-4 pt-8">
        {members && (
          <Suspense>

            <Filter filters={categories?.map((category) => {
              return {
                property: 'categories',
                label: category.title,
                value: category.id,
              }
            })}/>
            <RelatedPosts showInfo={true} relationTo="members" docs={members.docs} />
            <Pagination totalPages={members.totalPages}/>
          </Suspense>
        )}
      </div>
    </article>
  )
}

const queryCategories = cache(async () => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    draft,
    limit: 1000,
    overrideAccess: draft,
  })

  return result.docs || null
})

const queryMembers = cache(async (page:number, activeFilters:string) => {
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config: configPromise })

  if (!activeFilters){
    const result = await payload.find({
      collection: 'members',
      draft,
      page: page,
      sort: 'title',
      limit: 5,
      overrideAccess: draft,
    })

    return result || null
  }
  const activeFiltersArr =     decodeURI(activeFilters || '')
    .split(',')
    .map((item) => item.split('|'))
    .map((item) => {
      return {
        property: item[0],
        value: parseInt(item[1]),
        label: '',
      }
    })

  const result = await payload.find({
    collection: 'members',
    draft,
    page: page,
    limit: 5,
    sort: 'title',
    where: {
      or: activeFiltersArr.map(filter => {
        return {
          [filter.property + ".id"]:{
            contains: filter.value
          }
        }
      })
    },
    overrideAccess: draft,
  })

  return result || null


})
