'use client'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Member, Page, Post, Event } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/dateToPretty'
import { getHoursFromSchedule } from '@/heros/PostHero/EventHeroSection'

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: Post | Member | Page | Event
  relationTo?: 'posts' | 'members' | 'pages' | 'events'
  showCategories?: boolean
  title?: string
  noBackground?: boolean | undefined
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps, noBackground } = props

  const { slug, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories =
    doc &&
    'categories' in doc &&
    doc.categories &&
    Array.isArray(doc.categories) &&
    doc.categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = relationTo === 'pages' ? `/${slug}` : `/${relationTo}/${slug}`
  let imageToUse = metaImage
  if (doc && 'hero' in doc) {
    imageToUse = metaImage || (doc && 'hero' in doc) ? doc.hero.media : null
  }

  return (
    <article
      className={cn(
        ` flex flex-col ${noBackground ? 'text-slate-950 text-center' : 'text-blue-950'}  rounded-lg overflow-hidden ${noBackground ? 'bg-transparent' : 'shadow border bg-blue-50 border-border'} hover:cursor-pointer relative`,
        className,
      )}
      ref={card.ref}
    >
      <div className="relative flex justify-center aspect-video w-full overflow-hidden">
        {!imageToUse && <div className="aspect-video w-full bg-brand-blueBright/20" />}
        {imageToUse && typeof imageToUse !== 'string' && (
          <Media
            fill
            imgClassName="z-20 aspect-video w-full object-contain"
            resource={imageToUse}
            size="360px"
          />
        )}
        {imageToUse && typeof imageToUse !== 'string' && (
          <Media
            fill
            imgClassName="z-10 object-cover absolute blur-sm inset-0 opacity-50"
            resource={imageToUse}
          />
        )}
      </div>
      <div className="p-4 mb-auto">
        {showCategories && hasCategories && (
          <div className="uppercase text-sm mb-4">
            {showCategories && hasCategories && (
              <div>
                {hasCategories &&
                  doc.categories
                    ?.filter(
                      (category) => typeof category === 'number' || !category.hideInCategoryList,
                    )
                    ?.map((category, index) => {
                      if (typeof category === 'object') {
                        const { title: titleFromCategory } = category

                        const categoryTitle = titleFromCategory || 'Untitled category'

                        const isLast = index === (doc?.categories?.length || 0) - 1

                        return (
                          <Fragment key={index}>
                            {categoryTitle}
                            {!isLast && <Fragment>, &nbsp;</Fragment>}
                          </Fragment>
                        )
                      }

                      return null
                    })}
              </div>
            )}
          </div>
        )}
        {titleToUse && (
          <div className={`prose`}>
            <h2>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h2>
          </div>
        )}
        {doc && 'location' in doc && doc.location && <div className="text-sm">{doc.location}</div>}
        {doc && ('startDate' in doc || 'startTime' in doc) && (
          <div className="absolute top-0 left-2 flex flex-col border border-border bg-brand-blue bg-opacity-95 p-2 z-30 text-white">
            {doc && 'startDate' in doc && doc.startDate && (
              <div className="flex text-lg">{formatDateTime(doc.startDate, doc.endDate)}</div>
            )}
            {doc && 'startTime' in doc && doc.startTime && (
              <div className="">{getHoursFromSchedule(doc.startTime, doc.endTime)}</div>
            )}
          </div>
        )}

        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  )
}
