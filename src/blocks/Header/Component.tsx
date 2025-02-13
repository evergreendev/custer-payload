import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

type Props = Extract<Page['layout'][0], { blockType: 'header' }>

export const Header: React.FC<
  Props & {
  id?: string
}
> = ({ links, introContent, backgroundImage, type}) => {
  return (
    <div
      className={
        `${type === "tall" ? "min-h-screen" : "min-h-[45vh]"} flex relative flex-wrap gap-8 md:flex-row md:justify-between md:items-center py-7`
      }
    >
      {backgroundImage ? (
        <Media fill imgClassName="-z-10 object-cover object-center" resource={backgroundImage} />
      ) : (
        ''
      )}
      <div className="container flex flex-col items-center">
        <div className="max-w-[48rem] flex items-center text-white">
          {introContent && (
            <RichText
              className="mb-4 text-center prose-xl prose-h2:font-normal prose-h2:text-6xl prose-h3:mb-0"
              content={introContent}
              enableGutter={false}
            />
          )}
        </div>
        <div className="flex gap-8 w-full items-center justify-center">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />
          })}
        </div>
      </div>
    </div>
  )
}
