import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

import type { Footer, Post, SiteOption } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import LatestCarousel, { type LatestCard } from './LatestCarousel'

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const siteOptions: SiteOption = (await getCachedGlobal('siteOptions', 1)()) as SiteOption
  const siteLogo = siteOptions.siteLogoLight ? siteOptions.siteLogoLight : siteOptions.siteLogo

  const navItems = footer?.navItems || []

  // Fetch latest posts (published)
  const payload = await getPayload({ config: configPromise })
  const latest = await payload.find({
    collection: 'posts',
    limit: 12,
    depth: 1,
    where: {
      _status: { equals: 'published' },
    },
    sort: '-publishedAt',
  })
  const latestPosts = latest.docs as Post[]
  const latestCards: LatestCard[] = latestPosts.map((post: any, idx: number) => ({
    id: post.id ?? idx,
    slug: post.slug ?? null,
    title: post.title ?? null,
    imgUrl: typeof post.featuredImage !== 'number' ? post.featuredImage?.url ?? null : null,
  }))

  return (
    <footer className="border-t border-border bg-brand-red text-white">
      <div className="container prose-a:text-white py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        {typeof siteLogo !== 'number' && (
          <Link className="flex items-center" href="/">
            <Image src={siteLogo?.url || ''} alt="Description" width={200} height={200} />
          </Link>
        )}
        {siteOptions.contactInfo && <RichText enableGutter={false} className="prose ml-2" content={siteOptions.contactInfo} />}

        <div className="flex flex-col">
          <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center self-center">
            <nav className="flex flex-col md:flex-row gap-4">
              {navItems.map(({ link }, i) => {
                return <CMSLink className="text-white" key={i} {...link} />
              })}
            </nav>
          </div>
          {latestPosts.length > 0 && (
            <div>
              <div className="container py-6">
                <div className="-mx-2 px-2">
                  <h2 className="font-bold mb-2">Spotlight</h2>
                  <LatestCarousel items={latestCards} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
