import type { Events as EventBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import Link from 'next/link'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

export const EventsBlock: React.FC<
  EventBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, limit: limitFromProps, content, limitEventsShown } = props

  const limit = limitEventsShown ? limitFromProps || 3 : 100

  const payload = await getPayload({ config: configPromise })

  const dateObj = new Date()

  const fetchEvents = unstable_cache(async () => {

    const { isEnabled: draft } = await draftMode()

    console.log(draft);

    return await payload.find({
      collection: 'events',
      draft,
      sort: 'startDate',
      where: {
        and: [
          {
            or: [
              {
                startDate: { greater_than_equal: dateObj },
              },
              {
                endDate: { greater_than_equal: dateObj },
              },
            ],
          },
          draft ? {} : {
            _status: { equals: "published"}
          }
        ]

      },
      depth: 1,
      limit,
    })
  },[],{
    tags: ['event_block']
  })

  const events = await fetchEvents();

  return (
    <div id={`block-${id}`}>
      {content && (
        <div className="text-center bg-brand-red text-white p-4 mb-6 w-full">
          <RichText
            className="mb-4 max-w-prose px-14 text-inherit prose-2xl prose-h2:font-display prose-h2:font-bold"
            content={content}
            enableGutter={false}
          />
        </div>
      )}
      <div className="p-4">
        <RelatedPosts relationTo="events" docs={events.docs} />
        <div className="flex items-center mt-4">
          <Link className="text-center text-xl mx-auto" href="/events">
            See All Events
          </Link>
        </div>
      </div>
    </div>
  )
}
