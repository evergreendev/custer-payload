import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Category } from '@/payload-types'

export const revalidateCategory: CollectionAfterChangeHook<Category> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
    const path = doc.slug === 'home' ? '/' : `/categories/${doc.slug}`

    payload.logger.info(`Revalidating event at path: ${path}`)

    revalidatePath(path)

  return doc
}
