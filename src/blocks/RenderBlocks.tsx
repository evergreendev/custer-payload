import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ButtonGroup } from '@/blocks/ButtonGroup/Component'
import { Header } from '@/blocks/Header/Component'
import { ImageText } from '@/blocks/ImageText/Component'
import { Seasons } from '@/blocks/Seasons/Component'
import { LargeImage } from '@/blocks/LargeImage/Component'
import { EventsBlock } from '@/blocks/EventsBlock/Component'
import IFrameBlock from '@/blocks/IFrame/Component'
import FormWrapper from '@/blocks/Form/FormWrapper'
import BrickFinderBlockComponent from '@/blocks/BrickFinder/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormWrapper,
  mediaBlock: MediaBlock,
  buttonGroup: ButtonGroup,
  header: Header,
  imageText: ImageText,
  seasons: Seasons,
  largeImage: LargeImage,
  events: EventsBlock,
  IFrame: IFrameBlock,
  brickFinder: BrickFinderBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div key={index}>
                  {/* @ts-expect-error */}
                  <Block {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
