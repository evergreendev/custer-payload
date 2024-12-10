import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import { PostHero } from '@/heros/PostHero'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const members = await payload.find({
    collection: 'members',
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
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/members/category/' + slug
  const category = await queryPostBySlug({ slug })

  if (!category) return <PayloadRedirects url={url} />

  const members = await queryMembersByCategory({ id: category.id })

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
              className="lg:grid text-slate-950 lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[1fr]"
              content={category.content}
              enableGutter={false}
            />
          )}
        </div>
        {members && <RelatedPosts relationTo="members" docs={members} />}
      </div>
    </article>
  )
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

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

const queryMembersByCategory = cache(async ({ id }: { id: number }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'members',
    draft,
    limit: 100,
    overrideAccess: draft,
    where: {
      'categories.id': {
        contains: id,
      },
    },
  })

  return result.docs || null
})
