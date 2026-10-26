import configPromise from '@payload-config'
import { connection } from 'next/server'
import { getPayload } from 'payload'

import { Media } from '@/components/Media'
import type { HelpWantedBlock as HelpWantedBlockProps } from '@/payload-types'
import { validateHelpWantedLink } from '@/utilities/helpWantedValidation'

export async function HelpWantedBlock({ id, heading, description }: HelpWantedBlockProps) {
  // Fetch on each request so approvals, unpublishing, and deletions appear immediately.
  await connection()

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
    <section id={id ? `block-${id}` : undefined} className="container py-10">
      {(heading || description) && (
        <div className="mb-6 max-w-3xl">
          {heading && <h2 className="text-2xl font-semibold mb-2">{heading}</h2>}
          {description && <p className="whitespace-pre-line">{description}</p>}
        </div>
      )}
      {listings.length === 0 ? (
        <p>No help wanted listings are currently available.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <article key={listing.id} className="border rounded overflow-hidden">
              {listing.image && typeof listing.image === 'object' && (
                <Media resource={listing.image} imgClassName="w-full h-auto" />
              )}
              <div className="p-6 flex flex-col gap-4">
                <h3 className="text-2xl">{listing.title}</h3>
                <p className="whitespace-pre-wrap break-words">{listing.description}</p>
                {validateHelpWantedLink(listing.link) === true && (
                  <a href={listing.link} className="text-brand-blue underline break-words">
                    {listing.linkLabel}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
