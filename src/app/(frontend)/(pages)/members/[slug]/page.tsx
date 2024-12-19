import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLocationDot,
  faPhone,
  faEnvelope,
  faGlobe,
} from '@awesome.me/kit-45560c6e49/icons/classic/solid'
import {
  faFacebookSquare,
  faInstagramSquare,
  faSquareXTwitter,
  faYoutubeSquare,
} from '@awesome.me/kit-45560c6e49/icons/classic/brands'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const members = await payload.find({
    collection: 'members',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  return members.docs.map(({ slug }) => {
    return { slug }
  })
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/members/' + slug
  const member = await queryPostBySlug({ slug })
  const socialIconMap = {
    facebook: faFacebookSquare,
    instagram: faInstagramSquare,
    twitter: faSquareXTwitter,
    youtube: faYoutubeSquare,
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
        <div className="container lg:mx-0 lg:grid lg:grid-cols-[1fr_48rem_1fr] grid-rows-[1fr]">
          <div className="flex flex-col items-start gap-4">
            {member.address && (
              <div className="flex justify-center items-center gap-2 text-xl font-bold">
                <FontAwesomeIcon className="size-5 ml-2 text-brand-blue" icon={faLocationDot} />
                {member.address}
              </div>
            )}
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="flex justify-center items-center gap-2 text-xl font-bold"
              >
                <FontAwesomeIcon className="size-5 ml-2 text-brand-blue" icon={faPhone} />
                {member.phone}
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex justify-center items-center gap-2 text-xl font-bold"
              >
                <FontAwesomeIcon className="size-5 ml-2 text-brand-blue" icon={faEnvelope} />
                {member.email}
              </a>
            )}
            {member.website && (
              <a className="flex justify-center items-center gap-2 text-xl font-bold" href={member.website}>
                <FontAwesomeIcon className="size-5 ml-2 text-brand-blue" icon={faGlobe} />
                Visit Website
              </a>
            )}
            {socials.length > 0 && (
              <div className="flex justify-center items-center gap-2 text-xl font-bold">
                {socials.map(([key, value]) => {
                  return (
                    <a aria-label={`Follow ${member.title} on ${key}`} href={value || ''} key={key}>
                      <FontAwesomeIcon className="size-10 ml-2 text-brand-blue" icon={socialIconMap[key]} />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
          <RichText
            className={
              'lg:grid text-slate-950 text-xl lg:grid-cols-subgrid col-start-2 col-span-1 grid-rows-[1fr]'
            }
            content={member.content}
            enableGutter={false}
          />
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

  const payload = await getPayloadHMR({ config: configPromise })

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
