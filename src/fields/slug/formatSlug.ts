import type { CollectionSlug, FieldHook } from 'payload'


export const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

async function isTitleFound(slug: string, collection: CollectionSlug, id: string, payload: any) {
  const titleFound = await payload.find({
    collection,
    where: {
      slug: {
        equals: slug,
      },
      id: {
        not_equals: id,
      },
    },
  });

  if (titleFound.docs.length > 0) return true;
  return false;
}

async function getUniqueSlug(slug: string, collection: any, id: string, payload: any) {
  let i = 2;
  let isFound = await isTitleFound(slug, collection, id, payload);
  const regex = /^.*-\d+$/;

  while (isFound) {
    if (regex.test(slug)) {
      const match = slug.match(regex);
      if (match) {
        i = parseInt(<string>match[0].split("-").pop()) + 1;
      }
      slug = slug.replace(/\d+$/, "");
      slug += `${i}`;
    } else {
      slug += `-${i}`;
    }
    isFound = await isTitleFound(slug, collection, id, payload);
  }

  return slug;
}

export const formatSlugHook =
  ( fallback: string): FieldHook =>
  ({ data, operation, originalDoc, value, req, collection }) => {
  const {id} = originalDoc;
    if (typeof value === 'string') {
      return getUniqueSlug(formatSlug(value),collection?.slug, id, req.payload);
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackData = data?.[fallback] || data?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return getUniqueSlug(formatSlug(fallbackData),collection?.slug, id,req.payload);
      }
    }

    return value
  }
