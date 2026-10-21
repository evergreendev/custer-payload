import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { Media } from '@/components/Media'
import { validateHelpWantedLink } from '@/utilities/helpWantedValidation'

// Always reflect approvals, edits, unpublishing, and deletions immediately.
export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Help Wanted | Custer Chamber of Commerce' }

export default async function HelpWantedPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs: listings } = await payload.find({
    collection: 'help-wanted',
    draft: false,
    overrideAccess: false,
    where: { _status: { equals: 'published' } },
    depth: 1,
    pagination: false,
    sort: '-createdAt',
  })

  return (
    <article className="pb-16">
      <div className="bg-brand-red p-8 text-white">
        <h1 className="font-display text-6xl text-center">Help Wanted</h1>
      </div>
      <div className="bg-brand-blue border-b-2 border-b-blue-950 p-2 text-white text-center text-xl font-bold hover:bg-brand-blue/90">
        <Link href="/submit-help-wanted">Submit a Help Wanted Listing</Link>
      </div>
      <div className="container py-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {listings.length === 0 && <p>No help wanted listings are currently available.</p>}
        {listings.map((listing) => (
          <section key={listing.id} className="border rounded overflow-hidden">
            {listing.image && typeof listing.image === 'object' && (
              <Media resource={listing.image} imgClassName="w-full h-auto" />
            )}
            <div className="p-6 flex flex-col gap-4">
              <h2 className="text-2xl">{listing.title}</h2>
              <p className="whitespace-pre-wrap break-words">{listing.description}</p>
              {validateHelpWantedLink(listing.link) === true && (
                <a href={listing.link} className="text-brand-blue underline break-words">
                  {listing.linkLabel}
                </a>
              )}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
