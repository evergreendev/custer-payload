import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Member } from '@/payload-types'

export const revalidateNewsletter: CollectionAfterChangeHook<Member> = ({
                                                                  doc,
                                                                  previousDoc,
                                                                  req: { payload },
                                                                }) => {
  if (doc._status === 'published') {
    const path = `/newsletter/${doc.slug}`

    payload.logger.info(`Revalidating member at path: ${path}`)

    revalidatePath(path)
    revalidatePath('/newsletters')
  }

  // If the post was previously published, we need to revalidate the old path
  if (previousDoc._status === 'published' && doc._status !== 'published') {
    const oldPath = `/newsletter/${previousDoc.slug}`

    payload.logger.info(`Revalidating old member at path: ${oldPath}`)

    revalidatePath(oldPath)
  }

  return doc
}
