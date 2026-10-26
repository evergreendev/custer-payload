import { Buffer } from 'node:buffer'
import type { Payload } from 'payload'

import { validateHelpWantedLink } from './helpWantedValidation'
import { submissionNotificationRecipients } from './submissionNotifications'

type SubmissionPayload = Pick<Payload, 'create' | 'sendEmail' | 'logger'>

export async function submitHelpWanted(
  formData: FormData,
  getSubmissionPayload: () => Promise<SubmissionPayload>,
) {
  const readText = (name: string) => {
    const value = formData.get(name)
    return typeof value === 'string' ? value.trim() : ''
  }
  const title = readText('title')
  const description = readText('description')
  const link = readText('link')
  const linkLabel = readText('linkLabel')

  if (!title || !description || !link || !linkLabel) {
    return { message: '', error: 'Title, description, link, and link label are required.' }
  }
  const linkValidation = validateHelpWantedLink(link)
  if (linkValidation !== true) return { message: '', error: linkValidation }

  const image = formData.get('image')
  if (typeof image === 'string' && image) {
    return { message: '', error: 'Uploaded file must be an image.' }
  }
  const imageFile = image && typeof image !== 'string' && image.size > 0 ? image : null
  if (
    imageFile &&
    !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(imageFile.type)
  ) {
    return { message: '', error: 'Uploaded file must be a JPEG, PNG, GIF, or WebP image.' }
  }
  if (imageFile && imageFile.size > 30 * 1000000) {
    return { message: '', error: 'Please upload an image smaller than 30MB.' }
  }

  const payload = await getSubmissionPayload()
  let imageID: number | undefined
  let listingID: number
  try {
    if (imageFile) {
      const image = await payload.create({
        collection: 'media',
        overrideAccess: true,
        data: { alt: title },
        file: {
          data: Buffer.from(await imageFile.arrayBuffer()),
          mimetype: imageFile.type,
          name: imageFile.name,
          size: imageFile.size,
        },
      })
      imageID = image.id
    }
    const listing = await payload.create({
      collection: 'help-wanted',
      overrideAccess: true,
      draft: true,
      data: { title, description, link, linkLabel, image: imageID, _status: 'draft' },
    })
    listingID = listing.id
  } catch (error) {
    payload.logger.error({ err: error }, 'Unable to save help wanted submission')
    return { message: '', error: 'Unable to save your submission. Please try again.' }
  }

  try {
    await payload.sendEmail({
      to: submissionNotificationRecipients,
      subject: 'New Help Wanted Submission',
      html: `<p>Please check the new help wanted submission: <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/help-wanted/${listingID}">Link to Help Wanted Listing</a></p>`,
    })
  } catch (error) {
    // The draft is already saved; avoid encouraging duplicate submissions.
    payload.logger.error(
      { err: error, listingID },
      'Unable to send help wanted review notification',
    )
  }

  return {
    message: 'Thank you for your submission. After being reviewed it will be published.',
    error: '',
  }
}
