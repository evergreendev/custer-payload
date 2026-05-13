import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { getPayload } from 'payload'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const landingPages = await payload.find({
    collection: 'landing-pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  return landingPages.docs.map(({ slug }) => {
    return { slug }
  })
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function LandingPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/landing-page/' + slug
  const landingPage = await queryLandingPageBySlug({ slug })

  if (!landingPage) return <PayloadRedirects url={url} />

  return (
    <article className="pb-16">
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      <PostHero post={landingPage} showPublishedAt={false} />

      <div className="flex flex-col items-center gap-4 pt-8 text-slate-950">
        <div className="container lg:mx-0 lg:grid lg:grid-cols-[1fr_48rem_1fr] grid-rows-[1fr]">
          <RichText
            className="lg:grid text-slate-950 text-xl lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[1fr]"
            content={landingPage.content}
            enableGutter={false}
          />
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const landingPage = await queryLandingPageBySlug({ slug })

  return generateMeta({ doc: landingPage })
}

const queryLandingPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'landing-pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
