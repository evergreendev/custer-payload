import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Category, Post, Event, Member } from '@/payload-types'

import { Media } from '@/components/Media'
import EventHeroSection from '@/heros/PostHero/EventHeroSection'

export const PostHero: React.FC<{
  post: Post | Category | Event | Member
  showPublishedAt?: boolean
}> = ({ post, showPublishedAt = true }) => {
  const { meta: { image: metaImage } = {}, title } = post

  // Get mobile featured image if available
  const mobileImage = 'mobileFeaturedImage' in post && post.mobileFeaturedImage
    ? post.mobileFeaturedImage
    : metaImage

  return (
    <div className="relative flex items-end overflow-hidden">
      <div className="z-10 w-full relative lg:grid lg:grid-cols-[1fr_48rem] text-white">
        <div
          className={`col-start-1 col-span-1 ${metaImage ? 'md:col-start-2' : 'pt-8'} md:col-span-2`}
        >
          <div className="flex flex-col items-start bg-brand-red bg-opacity-70 p-4 md:p-4">
            {'startDate' in post && <EventHeroSection event={post} />}
            <h1 className={`${metaImage ? 'mb-6' : 'mb-0'} text-3xl md:text-5xl lg:text-6xl`}>
              {title}
            </h1>
            {'location' in post && <h2 className="text-2xl">{post.location}</h2>}
          </div>

          {
            ('author' in post && post.author)||(showPublishedAt && 'publishedAt' in post && post.publishedAt) &&
            <div className="flex flex-col gap-2 mt-3">
              {'author' in post && post.author && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm">by: {post.author}</p>
                </div>
              )}
              {showPublishedAt && 'publishedAt' in post && post.publishedAt && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Date Published</p>
                  <time dateTime={post.publishedAt}>{formatDateTime(post.publishedAt)}</time>
                </div>
              )}
            </div>
          }
        </div>
      </div>

      {typeof mobileImage !== 'number' && mobileImage?.width && mobileImage.width > 1000 && (
        <div className="md:hidden min-h-[80vh] select-none">
          {mobileImage && typeof mobileImage !== 'string' && (
            <Media fill imgClassName="-z-10 object-cover" resource={mobileImage} />
          )}
          <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
        </div>
      )}
      {typeof mobileImage !== 'number' && mobileImage?.width && mobileImage.width < 1000 && (
        <div
          style={{ height: typeof mobileImage !== 'number' ? mobileImage.height || 0 : 0 }}
          className="md:hidden select-none overflow-hidden w-0"
        >
          <>
            <Media
              imgClassName="-z-10 object-cover left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute max-w-full"
              resource={mobileImage}
            />
            <Media fill imgClassName="-z-20 object-cover absolute blur-sm" resource={mobileImage} />
          </>
          <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
        </div>
      )}

      {typeof metaImage !== 'number' && metaImage?.width && metaImage.width > 1000 && (
        <div className="hidden md:block min-h-[80vh] select-none">
          {metaImage && typeof metaImage !== 'string' && (
            <Media fill imgClassName="-z-10 object-cover" resource={metaImage} />
          )}
          <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
        </div>
      )}
      {typeof metaImage !== 'number' && metaImage?.width && metaImage.width < 1000 && (
        <div
          style={{ height: typeof metaImage !== 'number' ? metaImage.height || 0 : 0 }}
          className="hidden md:block select-none overflow-hidden w-0"
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

      {/* Fallback if no images */}
      {!mobileImage && !metaImage && (
        <div className="min-h-[10vh]">
          <div className="select-none bg-brand-red w-full absolute inset-0"></div>
        </div>
      )}
    </div>
  )
}
