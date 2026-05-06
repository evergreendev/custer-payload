import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import React from 'react'

import PageClient from './page.client'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Ad from '@/components/Ad'
import type { AdSpot, Ad as AdType } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const members = await payload.find({
    collection: 'events',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  return members.docs.map(({ slug }) => {
    return { slug }
  })
}

export default async function Post() {
  const events = await queryEvents();
  const url = "/events";
  const adSpots: AdSpot = (await getCachedGlobal('adSpots', 2)()) as AdSpot;
  const featuredEvents = events?.filter((event) => event.featuredEvent) || []

  if (!events) return <PayloadRedirects url={url} />

  return (
    <article className="pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />
      <div className="bg-brand-red p-8 text-white">
        <h1 className="font-display text-6xl text-center">Upcoming Events</h1>
      </div>
      <div className="bg-brand-blue border-b-2 border-b-blue-950 p-2 text-white text-center text-xl font-bold hover:bg-brand-blue/90">
        <Link href="/submit-event">
          <h2>Submit a Community Event</h2>
        </Link>
      </div>

      {adSpots.eventsPageAdSpot && (
        <div className="container mx-auto mt-4">
          <Ad ad={adSpots.eventsPageAdSpot.value as AdType} />
        </div>
      )}

      <div className="flex flex-col items-center gap-12 pt-8">
        {featuredEvents.length > 0 && (
          <section className="w-full">
            <div className="container mb-4">
              <h2 className="font-sans text-4xl text-blue-950">Featured Events</h2>
            </div>
            <RelatedPosts relationTo="events" docs={featuredEvents} />
          </section>
        )}

        <section className="w-full">
          <div className="container mb-4">
            <h2 className="font-sans text-4xl text-blue-950">All Events</h2>
          </div>
          <RelatedPosts relationTo="events" docs={events} />
        </section>
      </div>
    </article>
  )
}

const queryEvents = unstable_cache(async () => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const dateObj = new Date();

  const result = await payload.find({
    collection: 'events',
    draft,
    limit: 100,
    sort: 'startDate',
    overrideAccess: draft,
    where: {
      or: [
        {
          startDate: { greater_than_equal: dateObj },
        },
        {
          endDate: { greater_than_equal: dateObj },
        },
      ],
    },
  })

  return result.docs || null
},[],{tags: ['event_block'], revalidate: 43200})
