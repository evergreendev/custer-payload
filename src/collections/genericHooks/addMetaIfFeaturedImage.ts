import type { CollectionBeforeChangeHook } from 'payload'

import type { Member } from '@/payload-types'

export const addMetaIfFeaturedImage: CollectionBeforeChangeHook<Member> = ({
 data
}) => {
  if (data.featuredImage && !data.meta?.image && !data.keepExistingMetaImage) {
    return {
      ...data,
      meta: {
        ...data.meta,
        image: data.featuredImage,
      },
    }
  }

  return data
}
