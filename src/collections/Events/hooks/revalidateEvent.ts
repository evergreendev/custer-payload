import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '@/payload-types'

export const revalidateEvent: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = doc.slug === 'home' ? '/' : `/events/${doc.slug}`

    payload.logger.info(`Revalidating event at path: ${path}`)

    revalidatePath(path)
    revalidateTag("event_block")
    revalidatePath("/events")
  }

  // If the page was previously published, we need to revalidate the old path
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

    payload.logger.info(`Revalidating old event at path: ${oldPath}`)

    revalidatePath(oldPath)
  }

  return doc
}
