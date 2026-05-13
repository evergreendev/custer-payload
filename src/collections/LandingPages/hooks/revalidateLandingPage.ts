import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { LandingPage } from '@/payload-types'

export const revalidateLandingPage: CollectionAfterChangeHook<LandingPage> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = `/landing-page/${doc.slug}`

    payload.logger.info(`Revalidating landing page at path: ${path}`)

    revalidatePath(path)
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = `/landing-page/${previousDoc.slug}`

    payload.logger.info(`Revalidating old landing page at path: ${oldPath}`)

    revalidatePath(oldPath)
  }

  return doc
}
