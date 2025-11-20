import React from 'react'
import type { Page } from '@/payload-types'
import BrickFinder from '@/components/Bricks/BrickFinder'

type Props = Extract<Page['layout'][0], { blockType: 'brickFinder' }>

const BrickFinderBlockComponent: React.FC<Props> = (props) => {
  const { heading, description } = props

  return (
    <section className="container py-10">
      {(heading || description) && (
        <div className="mb-6 max-w-3xl">
          {heading && <h2 className="text-2xl font-semibold mb-2">{heading}</h2>}
          {description && (
            <p className="text-gray-700 whitespace-pre-line">{description}</p>
          )}
        </div>
      )}
      {/* Client component renders the interactive finder */}
      <BrickFinder />
    </section>
  )
}

export default BrickFinderBlockComponent
