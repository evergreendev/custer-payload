import type { Events as EventBlockProps, Event } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import React from 'react'
import RichText from '@/components/RichText'

const HorizontalEvents = ({events}:{events:Event[]}) => {

  return events.map((event) => {
    return <div key={event.id}>{event.title}</div>
  })
}

const VerticalEvents = ({events}:{events:Event[]}) => {
  return events.map((event) => {
    return <div key={event.id}>{event.title}</div>
  })
}

export const EventsBlock: React.FC<
  EventBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, limit: limitFromProps, content, limitEventsShown, type } = props

  const limit = limitEventsShown ? limitFromProps || 3 : 100

  const payload = await getPayloadHMR({ config: configPromise })

  const fetchedEvents = await payload.find({
    collection: 'events',
    sort: 'startDate',
    depth: 1,
    limit,
  })


  return (
    <div className="py-16 bg-brand-red text-white" id={`block-${id}`}>
      {content && (
        <div className="container mb-16 text-white text-center">
          <RichText
            className="mb-4 max-w-prose px-14 text-inherit prose-xl prose-h2:text-3xl prose-h2:mb-4 prose-h2:font-display prose-h2:font-bold"
            content={content}
            enableGutter={false}
          />
        </div>
      )}
      {
        type === "horizontal" ? <HorizontalEvents events={fetchedEvents.docs}/> : <VerticalEvents events={fetchedEvents.docs}/>
      }
    </div>
  )
}
