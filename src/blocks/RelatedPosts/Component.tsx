import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Member, Post, Page, Event } from '@/payload-types'

import { Card } from '@/components/Card'
import Image from 'next/image'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[] | Member[] | Page[] | Event[]
  relationTo?: 'posts' | 'members' | 'pages' | 'events'
  introContent?: any
  noBackground?: boolean
  showInfo?: boolean | null
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent, relationTo, noBackground, showInfo } = props

  return (
    <div className={clsx('container', className)}>
      {introContent && <RichText content={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 items-stretch">
        {docs?.map((doc, index) => {
          if (!doc.meta || typeof doc === 'string') return null

          if (doc._status === 'draft') {
            return (
              <div
                className="flex flex-col overflow-hidden justify-center items-center bg-red-300 text-red-900 text-3xl font-bold text-center"
                key={doc.id}
              >
                <div>{doc.title} Page is not published and will not show to the public</div>
              </div>
            )
          }

          let imageToUse = doc.meta.image
          return (
            <>
              {showInfo ? (
                <div className={'col lg:col-span-2 mb-8 text-lg border-t border-b border-gray-500'}>
                  <h2 className="font-bold">{doc.title}</h2>
                  <div className="flex gap-2 items-start">
                    {imageToUse && typeof imageToUse !== 'string' && (
                      <Image
                        className="w-40 hidden sm:block"
                        src={imageToUse.url}
                        alt={imageToUse.alt}
                        width={imageToUse.width || 0}
                        height={imageToUse.height || 0}
                      />
                    )}
                    <div className="grow">
                      {doc.address && <address>{doc.address}</address>}
                      {doc.phone && <p>{doc.phone}</p>}
                      {doc.website && (
                        <p>
                          <a href={doc.website}>{doc.website}</a>
                        </p>
                      )}
                      {doc.content && <RichText enableGutter={false} content={doc.content} />}
                    </div>
                  </div>
                </div>
              ) : (
                <Card
                  noBackground={noBackground}
                  key={index}
                  doc={doc}
                  relationTo={relationTo ? relationTo : 'posts'}
                  showCategories
                />
              )}
            </>
          )
        })}
      </div>
    </div>
  )
}
