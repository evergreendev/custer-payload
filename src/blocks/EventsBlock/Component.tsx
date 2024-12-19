import type { Events as EventBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import Link from 'next/link'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'

export const EventsBlock: React.FC<
  EventBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, limit: limitFromProps, content, limitEventsShown } = props

  const limit = limitEventsShown ? limitFromProps || 3 : 100

  const payload = await getPayload({ config: configPromise })

  const dateObj = new Date()

  const fetchedEvents = await payload.find({
    collection: 'events',
    sort: 'startDate',
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
    depth: 1,
    limit,
  })

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
        <RelatedPosts relationTo="events" docs={fetchedEvents.docs} />
        <div className="flex items-center mt-4">
          <Link className="text-center text-xl mx-auto" href="/events">
            See All Events
          </Link>
        </div>
      </div>
    </div>
  )
}
