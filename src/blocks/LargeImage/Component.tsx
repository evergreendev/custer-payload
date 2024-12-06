import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

type Props = Extract<Page['layout'][0], { blockType: 'largeImage' }>

export const LargeImage: React.FC<
  Props & {
    id?: string
  }
> = (props) => {
  const { backgroundImage, content, links, type } = props

  return (
    <>
      {links && links[0] ? (
        <CMSLink
          className={`
      flex relative min-h-[90vh] flex-wrap gap-8 md:flex-row md:justify-center md:items-center md:content-center pb-24`}
          {...{ ...links[0].link, label: undefined }}
          appearance="inline"
        >
          {content && (
            <RichText
              className="mb-4 z-10 w-full px-14 prose-h3:text-4xl text-inherit text-center prose-xl prose-h2:text-7xl prose-h3:mb-0 prose-h2:mb-4 prose-h2:font-display prose-h2:font-bold"
              content={content}
              enableGutter={false}
            />
          )}
          <Media fill imgClassName="-z-10 object-cover object-center" resource={backgroundImage} />

          <div className="absolute inset-0 bg-black bg-opacity-10 z-0"></div>
        </CMSLink>
      ) : (
        <div
          className={`
      flex relative min-h-[90vh] flex-wrap gap-8 md:flex-row md:justify-center md:items-center md:content-center pb-24`}
        >
          {content && (
            <RichText
              className={
                `mb-4 z-10 w-full px-14 prose-h3:text-4xl text-inherit text-center prose-xl prose-h2:text-7xl prose-h3:mb-0 prose-h2:mb-4 prose-h2:font-display prose-h2:font-bold
                ${type === 'boxedText' ? "p-12 prose-p:text-3xl bg-black/45 w-auto prose-p:max-w-prose prose-h3:mt-0" : ""}
                `
              }
              content={content}
              enableGutter={false}
            />
          )}
          <Media fill imgClassName="-z-10 object-cover object-center" resource={backgroundImage} />

          <div className="absolute inset-0 bg-black bg-opacity-10 z-0"></div>
        </div>
      )}
    </>
  )
}
