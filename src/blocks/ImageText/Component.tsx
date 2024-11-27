import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import Image from 'next/image'

type Props = Extract<Page['layout'][0], { blockType: 'imageText' }>

const LeftCol: React.FC<
  Props & {
    id?: string
  }
> = ({ content, type, images }) => {
  return (
    <div>
      {type === 'twoImage' && images?.[0]?.image && typeof images?.[0].image !== 'number' && (
        <div className="mb-5">
          <Image
            alt={images?.[0].image.alt}
            src={images?.[0].image.url || ''}
            width={images?.[0].image.width || 0}
            height={images?.[0].image.height || 0}
          />
          {images[0]?.links?.[0] && (
            <CMSLink {...images[0]?.links?.[0].link} size="clear" appearance="full" />
          )}
        </div>
      )}
      {content && (
        <RichText
          className="mb-4 max-w-prose px-14 text-inherit prose-xl prose-h2:font-normal prose-h2:text-6xl prose-h3:mb-0"
          content={content}
          enableGutter={false}
        />
      )}
    </div>
  )
}

const RightCol: React.FC<
  Props & {
    id?: string
  }
> = ({ image, images, type }) => {
  const currImg = type === 'twoImage' ? images?.[1].image : image?.image
  return (
    <div>
      {currImg && typeof currImg !== 'number' && (
        <Image
          alt={currImg.alt}
          src={currImg.url || ''}
          width={currImg.width || 0}
          height={currImg.height || 0}
        />
      )}
    </div>
  )
}

export const ImageText: React.FC<
  Props & {
    id?: string
  }
> = (props) => {
  const { reverseColumns, backgroundImage, type, background, content, image, images } = props
  const backgroundClasses = {
    white: 'bg-yellow-50 text-gray-800',
    red: 'bg-brand-red text-white',
    blue: 'bg-brand-blue text-white',
  }

  return (
    <div
      className={`${background && background !== 'image' ? backgroundClasses[background] : ''} flex relative flex-wrap gap-8 md:flex-row md:justify-between md:items-center pt-40 pb-20`}
    >
      {background === 'image' && backgroundImage ? (
        <Media fill imgClassName="-z-10 object-cover object-center" resource={backgroundImage} />
      ) : (
        ''
      )}
      <div className="flex w-full gap-5 max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-start w-6/12">
          {!reverseColumns ? <LeftCol {...props} /> : <RightCol {...props} />}
        </div>
        <div className="flex flex-col items-end w-6/12">
          {!reverseColumns ? <RightCol {...props} /> : <LeftCol {...props} />}
        </div>
      </div>
    </div>
  )
}
