import type { Events as EventBlockProps, Event } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import Link from 'next/link'
import { formatDateTime } from '@/utilities/dateToPretty'

const HorizontalEvents = ({ events }: { events: Event[] }) => {
  return (
    <div className={`flex flex-wrap w-full max-w-screen-xl gap-2 justify-center mx-auto`}>
      {events.map((event) => {
        const { image: metaImage } = event.meta || {}
        return (
          <Link
            href={`/events/${event.slug}`}
            key={event.id}
            className={`bg-white text-slate-950 w-3/12 relative`}
          >
            {event.startDate && (
              <div className="bg-brand-blueBright text-white px-4 py-2 font-bold text-2xl mb-2 absolute top-0 left-4 z-10">
                {formatDateTime(event.startDate, event.endDate)}
              </div>
            )}
            <div className="relative w-full flex justify-center">
              {!metaImage && <div className="aspect-video w-full bg-brand-blueBright/20" />}
              {metaImage && typeof metaImage !== 'number' && (
                <Media
                  imgClassName="w-full aspect-video object-cover"
                  resource={metaImage}
                  size="360px"
                />
              )}
            </div>
            <div className="w-full p-4">
              <h2 className="text-2xl">{event.title}</h2>
              {event.location && <h3 className="">{event.location}</h3>}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

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
    <div className="py-8 px-4 bg-brand-red text-white" id={`block-${id}`}>
      {content && (
        <div className="container text-white text-center">
          <RichText
            className="mb-4 max-w-prose px-14 text-inherit prose-xl prose-h2:text-3xl prose-h2:mb-4 prose-h2:font-display prose-h2:font-bold"
            content={content}
            enableGutter={false}
          />
        </div>
      )}
      <HorizontalEvents events={fetchedEvents.docs} />
      <div className="flex items-center mt-4">
        <Link className="text-center text-xl mx-auto" href="/events">
          See All Events
        </Link>
      </div>
    </div>
  )
}
