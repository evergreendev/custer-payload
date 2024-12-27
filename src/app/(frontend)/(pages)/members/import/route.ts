import configPromise from '@payload-config'
import config from '@payload-config'
import { getPayload } from 'payload'
//import { promises as fs, PathLike } from 'fs'
import { createWriteStream, PathLike } from 'fs'
import { Readable } from 'stream'
import { headers as getHeaders } from 'next/headers'
import { Media } from '@/payload-types'
import { HTMLToJSON, JSONType } from 'html-to-json-parser'
import { IS_BOLD, IS_UNDERLINE } from 'lexical'
import ObjectIdImport from 'bson-objectid'
const ObjectId = (ObjectIdImport as any).default

const path = require('path')

let csvToJson = require('convert-csv-to-json')
const jsdom = require('jsdom')

const logUser = async () => {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user, permissions } = await payload.auth({ headers })

  return user
}

async function download(url: string, outputFile: PathLike) {
  return new Promise<string>(async (resolve, reject) => {
    try {
      if (!url) return
      if (!url.includes('http')) {
        url = 'https://custersd.com' + url
      }
      //const response = await axios({ url:url, method: 'GET', responseType: 'arraybuffer' })
      const response = await fetch(url)
      if (!response || !response.headers || !response.body) return

      // @ts-ignore
      const imgType = response.headers.get('Content-Type').split('/')?.[1]

      let writer = createWriteStream(outputFile + '.' + imgType)
      // @ts-ignore
      Readable.fromWeb(response.body).pipe(writer)

      writer.on('finish', () => {
        resolve(outputFile + '.' + imgType)
        return outputFile + '.' + imgType
      })
    } catch (error) {
      console.log(url, error)
      reject(null)
    }
  })
}

/*async function download(url: string, outputFile: PathLike | fs.FileHandle) {
  try{
    if (!url) return;
    if(!url.includes('http')) {
      url = "https://custersd.com"+url;
    }
    //const response = await axios({ url:url, method: 'GET', responseType: 'arraybuffer' })
    const response = await fetch(url);
    if (!response || !response.headers) return;

    // @ts-ignore
    const imgType = response.headers.get('Content-Type').split("/")?.[1];
    console.log(imgType);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = new Int32Array(arrayBuffer);

    //await fs.writeFile(outputFile+'.'+"jpg", buffer)
    await fs.writeFile(outputFile+'.'+imgType, buffer)

    return outputFile+'.'+imgType;
  } catch (error) {
    console.log(url, error);
  }
}*/

const htmlToRoot = async (
  curr?:
    | {
        attributes: any
        type: string
        content: any[]
      }
    | string,
  format?: number,
) => {
  console.log(curr)
  if (!curr) return

  if (typeof curr === 'string') {
    return {
      type: 'text',
      text: curr,
      format: format||"",
      version: 0,
    }
  }
  switch (curr.type) {
    case 'br':
      return {
        type: 'linebreak',
        version: 0,
      }
    case 'img':
      const tmpFile =
        process.cwd() +
        `/src/app/imports/${curr.attributes.src.split('/')[2].replaceAll('/', '-').replaceAll('\\', '-')}`
      let image = ''
      image = await download(curr.attributes.src, tmpFile)
      const user = await logUser()
      const payload = await getPayload({ config: configPromise })
      let uploadedImage: Media
      uploadedImage = await payload.create({
        user: user,
        collection: 'media',
        draft: false,
        overrideAccess: false,
        data: {
          alt: curr.attributes.src.split('/')[2],
        },
        filePath: image,
      })
      return uploadedImage
        ? {
            type: 'block',
            fields: {
              id: new ObjectId().toHexString(),
              media: uploadedImage.id,
              position: 'default',
              blockName: '',
              blockType: 'mediaBlock',
            },
            format: '',
            version: 2,
          }
        : {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: ' ',
                version: 0,
              },
            ],
            version: 0,
          }
    case 'blockquote':
      return {
        type: 'quote',
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, format))),
      }
    case 'p':
      return {
        type: 'paragraph',
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, format))),
      }
    case 'strong':
      return {
        type: 'paragraph',
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, IS_BOLD))),
      }
    case 'u':
      return {
        type: 'paragraph',
        children: !curr.content ? [] :await Promise.all(
          curr.content?.map(async (x) => await htmlToRoot(x, IS_UNDERLINE)),
        ),
      }
    case 'ul': {
      return {
        type: 'list',
        tag: 'ul',
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, format))),
      }
    }
    case 'ol': {
      return {
        type: 'list',
        tag: 'ol',
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, format))),
      }
    }
    case 'li': {
      return {
        type: 'listitem',
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, format))),
      }
    }
    case 'h1':
      return {
        type: 'heading',
        tag: 'h1',
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, format))),
      }
    case 'h2':
      return {
        type: 'heading',
        tag: 'h2',
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, format))),
      }
    case 'h3':
      return {
        type: 'heading',
        tag: 'h3',
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, format))),
      }
    case 'h4':
      return {
        type: 'heading',
        tag: 'h4',
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, format))),
      }
    case 'h5':
      return {
        type: 'heading',
        tag: 'h5',
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, format))),
      }
    case 'h6':
      return {
        type: 'heading',
        tag: 'h6',
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, format))),
      }
    case 'a':
      return {
        type: 'link',
        fields: {
          newTab: false,
          doc: null,
          linkType: 'custom',
          url: curr.attributes.href,
        },
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, format))),
      }
    case 'span':
      return {
        type: 'paragraph',
        children: !curr.content ? [] : await Promise.all(curr.content?.map(async (x) => await htmlToRoot(x, format))),
      }
    default:
      return {
        type: 'text',
        text: ' ',
        version: 0,
      }
  }
}

export async function GET() {
  let json = csvToJson
    .fieldDelimiter(',')
    .supportQuotedField(true)
    .getJsonFromCsv(process.cwd() + '/src/app/imports/members.csv')

  const user = await logUser()
  const payload = await getPayload({ config: configPromise })

  async function getOrCreateCategory(title: string) {
    try {
      console.log("here2")
      const foundCategory = await payload.find({
        collection: 'categories',
        limit: 1,
        where: {
          title: {
            equals: title,
          },
        },
      })
      console.log("found category");

      if (foundCategory.docs.length > 0) {
        return foundCategory.docs[0].id
      } else {
        console.log("creating Cat");
        const createdCat = await payload.create({
          collection: 'categories',
          user: user,
          data: {
            title: title,
          },
        })
        console.log("cat created");

        return createdCat?.id
      }
    } catch (e) {
      console.error(e, title)
      return 0
    }
  }

  for (const item of json) {
    try {
      const slugToFind = item.Name?.replaceAll(' ', '-')

      const existingMember = await payload.find({
        collection: 'members',
        limit: 1,
        pagination: false,
        where: {
          title: { equals: item.Name },
        },
      })

      if (existingMember.docs.length > 0) {
        const memberId = existingMember.docs[0].id
        const response = await fetch(`https://www.custersd.com/${slugToFind}`)
        const body = await response.text()

        if (!body) continue

        console.log("search Image")
        const foundImage = await payload.find({
          collection: 'media',
          limit: 1,
          where: {
            alt: { equals: item.Name },
          },
        })
        console.log("found image")

        if (foundImage.docs.length === 0) {
          const dom = new jsdom.JSDOM(body)
          const imageSrc = dom.window.document.querySelector('.content img')?.src

          let uploadedImage: null | Media = null

          if (imageSrc) {
            const tmpFile =
              process.cwd() +
              `/src/app/imports/${slugToFind.replaceAll('/', '-').replaceAll('\\', '-')}`
            let image = ''

            try {
              image = await download(imageSrc, tmpFile)
            } catch (e) {
              console.log(e)
            }

            if (image) {
              try {
                uploadedImage = await payload.create({
                  user: user,
                  collection: 'media',
                  draft: false,
                  overrideAccess: false,
                  data: {
                    alt: item.Name,
                  },
                  filePath: image,
                })
              } catch (e) {
                console.log(e)
              }

              try {
                await payload.update({
                  collection: 'members',
                  id: memberId,
                  data: {
                    meta: {
                      image: uploadedImage,
                    },
                  },
                  user: user,
                })
              } catch (e) {
                console.log(e)
              }
            }
          }
        }
      } else {
        const response = await fetch(`https://www.custersd.com/${slugToFind}`)
        if (response.status !== 200) {
          console.log(slugToFind, 'NOT FOUND')
          const categories = await Promise.all(
            item.Category.trim()
              .split(',')
              .filter((item: string) => item !== '')
              .map(async (item: string): Promise<number> => {
                return await getOrCreateCategory(item.trim())
              }),
          )
          await payload.create({
            data: {
              title: item.Name,
              content: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: ' ',
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
              categories: categories,
              address: item.Address2 ? item.Address + '\n' + item.Address2 : item.Address,
              phone: item['Phone#'],
              website: item.Website,
              email: item.Email,
            },
            user: user,
            collection: 'members',
            draft: false,
            overrideAccess: false,
          })
        } else {
          const body = await response.text()
          if (!body) continue

          const categories = await Promise.all(
            item.Category.trim()
              .split(',')
              .filter((item: string) => item !== '')
              .map(async (item: string): Promise<number> => {
                return await getOrCreateCategory(item.trim())
              }),
          )
          const dom = new jsdom.JSDOM(body)
          const imageSrc = dom.window.document.querySelector('.content img')?.src
          const nodes =
            dom.window.document.querySelectorAll('.content span')[1].outerHTML || '<p> </p>'
          let result = await HTMLToJSON(nodes.replaceAll('&nbsp;', '<br/>'))

          let uploadedImage: null | Media = null

          if (imageSrc) {
            const tmpFile =
              process.cwd() +
              `/src/app/imports/${slugToFind.replaceAll('/', '-').replaceAll('\\', '-')}`
            let image = ''

            try {
              image = await download(imageSrc, tmpFile)
            } catch (e) {
              console.log(e)
            }

            if (image) {
              try {
                uploadedImage = await payload.create({
                  user: user,
                  collection: 'media',
                  draft: false,
                  overrideAccess: false,
                  data: {
                    alt: item.Name,
                  },
                  filePath: image,
                })
              } catch (e) {
                console.log(e)
              }
            }
          }

          try {
            await payload.create({
              data: {
                title: item.Name,
                meta: {
                  image: uploadedImage,
                },
                content: {
                  root: {
                    type: 'root',
                    children: [await htmlToRoot(result)],
                    direction: null,
                    format: '',
                    indent: 0,
                    version: 0,
                  },
                },
                address: item.Address2 ? item.Address + '\n' + item.Address2 : item.Address,
                phone: item['Phone#'],
                website: item.Website,
                categories: categories,
                email: item.Email || '',
              },
              user: user,
              collection: 'members',
              draft: false,
              overrideAccess: false,
            })
          } catch (e) {
            console.log(e)
          }
        }
      }
    } catch (e) {
      console.log(item.Name + ' Failed')
      console.log(e)
    }
  }

  /*
   */
}
