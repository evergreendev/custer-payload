import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Page } from '@/payload-types'

export const revalidateCategory: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = doc.slug === 'home' ? '/' : `/categories/${doc.slug}`

    payload.logger.info(`Revalidating event at path: ${path}`)

    revalidatePath(path)
  }

  // If the page was previously published, we need to revalidate the old path
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

    payload.logger.info(`Revalidating old event at path: ${oldPath}`)

    revalidatePath(oldPath)
  }

  return doc
}
