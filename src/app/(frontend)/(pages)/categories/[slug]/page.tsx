import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import React, { cache, Suspense } from 'react'
import RichText from '@/components/RichText'

import { PostHero } from '@/heros/PostHero'
import PageClient from './page.client'
import { getPayload } from 'payload'
import Pagination from '@/blocks/ParamPagination'
import Filter from '@/blocks/RelatedPosts/Filter'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'

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
  params: Promise<{
    slug?: string
  }>
  searchParams: Promise<{
    ['active-filters']?: string
    page: string
  }>
}

export default async function Post({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/members/category/' + slug
  const category = await queryPostBySlug({ slug })
  const searchParams = await searchParamsPromise
  const activeFilters = searchParams['active-filters'] || ''
  const page = searchParams['page'] || '1'

  if (!category) return <PayloadRedirects url={url} />

  const childCategories = await queryByParentId({ parentId: category.id })
  console.log(childCategories);

  const members = await queryMembersByCategory({
    page: parseInt(page),
    ids: [category.id].concat(childCategories?.map((cat) => cat.id)),
    activeFilters: activeFilters,
    limit: category.showMemberInfo ? 5 : 9
  })

  return (
    <article className="pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <PostHero post={category} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container lg:mx-0 lg:grid lg:grid-cols-[1fr_48rem_1fr] grid-rows-[1fr]">
          {category.content && (
            <RichText
              className="lg:grid text-slate-950 text-xl lg:grid-cols-subgrid col-start-2 col-span-1 grid-rows-[1fr]"
              content={category.content}
              enableGutter={false}
            />
          )}
        </div>
        {members && (
          <Suspense>
            <Filter
              filters={childCategories?.map((category) => {
                return {
                  property: 'categories',
                  label: category.title,
                  value: category.id,
                }
              })}
            />
            <Pagination totalPages={members.totalPages} />
            <RelatedPosts showInfo={category.showMemberInfo} relationTo="members" docs={members.docs} />
            <Pagination totalPages={members.totalPages} />
          </Suspense>
        )}
      </div>
    </article>
  )
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        contains: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryByParentId = cache(async ({ parentId }: { parentId: number }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    draft,
    limit: 100,
    overrideAccess: draft,
    where: {
      parent: {
        equals: parentId,
      },
    },
  })

  return result.docs || null
})

const queryMembersByCategory = cache(async ({ page, ids, activeFilters, limit }: { page: number, ids: number[], activeFilters: string, limit: number }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  if(!activeFilters) {
    const result = await payload.find({
      collection: 'members',
      draft,
      page: page,
      pagination: false,
      sort: "title",
      overrideAccess: draft,
      where: {
        or: ids.map((id) => {
          return {
            'categories.id': {
              contains: id,
            },
          }
        }),
      },
    })

    return result || null
  }

  const activeFiltersArr = decodeURI(activeFilters || '')
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
    limit: limit,
    sort: 'title',
    where: {
      or: activeFiltersArr.map((filter) => {
        return {
          [filter.property + '.id']: {
            contains: filter.value,
          },
        }
      }),
    },
    overrideAccess: draft,
  })

  return result || null
})
