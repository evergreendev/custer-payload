import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import { XLogo } from '@/components/icons/XLogo'
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { getPayload } from 'payload'

// Resolve member slugs on request instead of enumerating them during every build.
// Keep rendering automatic so draft previews and cookie-based popups still work.

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/members/' + slug
  const member = await queryPostBySlug({ slug })
  const socialIconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: XLogo,
    youtube: Youtube,
  }

  if (!member) return <PayloadRedirects url={url} />

  const socials = (member.socials ? Object.entries(member.socials) : []).filter((x) => {
    return x[1] !== '' && x[1]
  })


  return (
    <article className="pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <PostHero post={member} showPublishedAt={false} />

      <div className="flex flex-col items-center gap-4 pt-8 text-slate-950">
        <div className="container gap-3 lg:mx-0 lg:grid lg:grid-cols-[2fr_48rem_1fr] grid-rows-[1fr]">
          <div className="flex flex-col items-start gap-4">
            {member.address && (
              <div className="flex justify-center items-center gap-2 text-xl font-bold">
                <MapPin className="size-5 shrink-0 ml-2 text-brand-blue" aria-hidden="true" />
                {member.address}
              </div>
            )}
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="flex justify-center items-center gap-2 text-xl font-bold"
              >
                <Phone className="size-5 shrink-0 ml-2 text-brand-blue" aria-hidden="true" />
                {member.phone}
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex justify-center items-center gap-2 text-xl font-bold"
              >
                <Mail className="size-5 shrink-0 ml-2 text-brand-blue" aria-hidden="true" />
                {member.email}
              </a>
            )}
            {member.website && (
              <a
                className="flex justify-center items-center gap-2 text-xl font-bold"
                href={member.website}
              >
                <Globe className="size-5 shrink-0 ml-2 text-brand-blue" aria-hidden="true" />
                Visit Website
              </a>
            )}
            {socials.length > 0 && (
              <div className="flex justify-center items-center gap-2 text-xl font-bold">
                {socials.map(([key, value]) => {
                  const Icon = socialIconMap[key]
                  if (!Icon) return null

                  return (
                    <a aria-label={`Follow ${member.title} on ${key === 'twitter' ? 'X' : key}`} href={value || ''} key={key}>
                      <Icon
                        className="size-10 ml-2 text-brand-blue"
                        aria-hidden="true"
                      />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
          {
            member.content &&
            <RichText
              className={
                'lg:grid text-slate-950 text-xl lg:grid-cols-subgrid col-start-2 col-span-1 grid-rows-[1fr]'
              }
              content={member.content}
              enableGutter={false}
            />
          }
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const member = await queryPostBySlug({ slug })

  return generateMeta({ doc: member })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'members',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
