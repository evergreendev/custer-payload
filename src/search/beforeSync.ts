import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ originalDoc, searchDoc, payload }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { slug, id, categories, title, meta } = originalDoc

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    title: title || meta?.title,
    slug,
    meta: {
      ...meta,
      title: meta?.title || title,
      image: meta?.image?.id || meta?.image,
      description: meta?.description,
      keywords: meta?.keywords,
    },
    categories: [],
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    // get full categories and keep a flattened copy of their most important properties
    try {
      const mappedCategories = await Promise.all(
        categories.map(async (category) => {
          if (typeof category === 'object' && category !== null) {
            return {
              relationTo: 'categories',
              id: category.id,
              title: category.title,
            }
          }

          // If it's just an ID, try to fetch the category to get the title
          try {
            const fullCategory = await payload.findByID({
              collection: 'categories',
              id: category,
              depth: 0,
            })

            return {
              relationTo: 'categories',
              id: category,
              title: fullCategory?.title,
            }
          } catch (fetchErr) {
            return {
              relationTo: 'categories',
              id: category,
            }
          }
        }),
      )

      modifiedDoc.categories = mappedCategories
    } catch (err) {
      console.error(
        `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
      )
    }
  }

  return modifiedDoc
}
