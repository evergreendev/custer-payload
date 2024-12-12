'use client'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Member, Page, Post } from '@/payload-types'

import { Media } from '@/components/Media'

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: Post|Member|Page
  relationTo?: 'posts'| 'members' | 'pages'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = (doc && "categories" in doc) && doc.categories && Array.isArray(doc.categories) && doc.categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = relationTo === "pages" ? `/${slug}` : `/${relationTo}/${slug}`
  let imageToUse = metaImage;
  if (doc && 'hero' in doc) {
    imageToUse = metaImage || doc && 'hero' in doc ? doc.hero.media : null
  }

  return (
    <article
      className={cn(
        'border flex flex-col border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full flex justify-center">
        {!imageToUse && <div className="aspect-video w-full bg-brand-blueBright/20" />}
        {imageToUse && typeof imageToUse !== 'string' && <Media resource={imageToUse} size="360px" />}
      </div>
      <div className="p-4 mt-auto">
        {showCategories && hasCategories && (
          <div className="uppercase text-sm mb-4">
            {showCategories && hasCategories && (
              <div>
                {hasCategories &&
                  doc.categories?.map((category, index) => {
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
          <div className="prose text-white">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  )
}
