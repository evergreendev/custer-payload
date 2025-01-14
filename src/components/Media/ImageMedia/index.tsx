'use client'

import type { StaticImageData } from 'next/image'

import { cn } from 'src/utilities/cn'
import NextImage from 'next/image'
import React from 'react'

import type { Props as MediaProps } from '../types'

import cssVariables from '@/cssVariables'
import RichText from '@/components/RichText'

const { breakpoints } = cssVariables

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
  } = props

  const [isLoading, setIsLoading] = React.useState(true)

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''
  let caption:null
    | {
        [k: string]: unknown
        root: {
          type: string
          children: { type: string; version: number; [k: string]: unknown }[]
          direction: ('ltr' | 'rtl') | null
          format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
          indent: number
          version: number
        }
      } = null;

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      caption: captionFromResource,
      filename: fullFilename,
      height: fullHeight,
      url,
      width: fullWidth,
    } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource || ""
    caption = captionFromResource || null;

    src = `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value}px`)
        .join(', ')

  return (
    <>
      <NextImage
        alt={alt || ''}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height : undefined}
        onClick={onClick}
        onLoad={() => {
          setIsLoading(false)
          if (typeof onLoadFromProps === 'function') {
            onLoadFromProps()
          }
        }}
        priority={priority}
        quality={90}
        sizes={sizes}
        src={src}
        width={!fill ? width : undefined}
      />
      {caption ? (
        <RichText
          className={cn(imgClassName)+' mb-0 text-white bg-opacity-5 bg-black absolute bottom-0 p-1 right-0'}
          content={caption}
          enableGutter={false}
        />
      ) : null}
    </>
  )
}
