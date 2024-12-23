import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Category, Post, Event } from '@/payload-types'

import { Media } from '@/components/Media'
import EventHeroSection from '@/heros/PostHero/EventHeroSection'

export const PostHero: React.FC<{
  post: Post | Category | Event
  showPublishedAt?: boolean
}> = ({ post, showPublishedAt = true }) => {
  const { meta: { image: metaImage } = {}, title } = post

  return (
    <div className="relative flex items-end overflow-hidden">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="flex flex-col items-start">
            {'startDate' in post && <EventHeroSection event={post} />}
            <h1 className={`${metaImage ? 'mb-6':'mb-0'} text-3xl md:text-5xl lg:text-6xl`}>{title}</h1>
            {'location' in post && <h2 className="text-2xl">{post.location}</h2>}
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            <div className="flex flex-col gap-4"></div>
            {showPublishedAt && 'publishedAt' in post && post.publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Published</p>

                <time dateTime={post.publishedAt}>{formatDateTime(post.publishedAt)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
      {typeof metaImage !== 'number' && metaImage?.width && metaImage.width > 1000 && (
        <div className="min-h-[80vh] select-none">
          {metaImage && typeof metaImage !== 'string' && (
            <Media fill imgClassName="-z-10 object-cover" resource={metaImage} />
          )}
          <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
        </div>
      )}
      {typeof metaImage !== 'number' && metaImage?.width && metaImage.width < 1000 && (
        <div
          style={{ height: typeof metaImage !== 'number' ? metaImage.height || 0 : 0 }}
          className="select-none overflow-hidden w-0"
        >
          <>
            <Media
              imgClassName="-z-10 object-cover left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute max-w-full"
              resource={metaImage}
            />
            <Media fill imgClassName="-z-20 object-cover absolute blur-sm" resource={metaImage} />
          </>
          <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
        </div>
      )}
      {!metaImage && (
        <div className="min-h-[10vh]">
          <div className="select-none bg-brand-red w-full absolute inset-0"></div>
        </div>
      )}
    </div>
  )
}
