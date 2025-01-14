'use server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Media } from '@/payload-types'
import { file } from 'tmp-promise'
import fs from 'fs/promises'
import { Buffer } from 'buffer'

function fileIsAccepted(fileType: string, allowedTypes: ("Images" | "Video" | "PDF" | "WordDocs")[]): boolean {
  const allowedFileDict = {
    Images: "image/jpeg,image/png,image/gif,image/webp",
    Video: "video/mp4,video/mpeg,video/ogg,video/webm",
    PDF: "application/pdf",
    WordDocs: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  }
  for (let i = 0; i < allowedTypes.length; i++) {
    if ((allowedFileDict[allowedTypes[i] as keyof {}] as string).includes(fileType)) {
      return true;
    }
  }

  return false;
}

export async function createEvent(  prevState: {
                               message: string;
                               error: string;
                             },
                             formData: FormData,) {
  const title = formData.get('title');
  const eventStart = formData.get('event-start') as string|null;
  const eventEnd = formData.get('event-end') as string|null;
  const image = formData.get('image') as File|null;
  const location = formData.get('location') as string|null;
  const details = formData.get('details') as string|null;


  if (!title || typeof title !== 'string') {
    return { ...prevState, message: "", error: "Title is required" }
  }

  if(image && !fileIsAccepted(image.type, ["Images"])){
    return { ...prevState, message:"", error: "Uploaded file must be an image" }
  }
  const maxFileSize = 30 * 1000000;

  if (image && image?.size > maxFileSize) {
    return { ...prevState, message:"", error: "Your image is too large to be uploaded. Please try again with a file smaller than 30MB" }
  }

const payload = await getPayload({ config: configPromise })

  let uploadedImage: null | Media = null

  if (image) {
    const {fd, path, cleanup} = await file();
    try {
      const buffer = await image.arrayBuffer();
      // @ts-ignore
      await fs.writeFile(path, Buffer.from(buffer));

      uploadedImage = await payload.create({
        collection: 'media',
        draft: false,
        overrideAccess: true,
        data: {
          alt: "",
        },
        filePath: path,
      })

      await cleanup();

    } catch (e) {
      console.log(e);
      await cleanup();
    }
  }

  await payload.create({
    collection: 'events', // required
    data: {
      // required
      title: title,
      startDate: eventStart||null,
      endDate: eventEnd||null,
      multiDayEvent: !!eventEnd,
      location: location,
      featuredImage: uploadedImage,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: details||" ",
                  version: 0,
                },
              ],
              version: 0,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 0,
        },
      },
    },
    fallbackLocale: false,
    overrideAccess: true,
    showHiddenFields: false,
  })

  return {
    message: "Thank you for your submission. After being reviewed it will be published.",
    error: ""
  }
}
