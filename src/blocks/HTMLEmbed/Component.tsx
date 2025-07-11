import React from 'react'

export type HTMLEmbedBlockProps = {
  html: string
  blockType: 'htmlEmbed'
}

type Props = HTMLEmbedBlockProps & {
  className?: string
}

export const HTMLEmbedBlock: React.FC<Props> = ({ className, html }) => {
  return (
    <div className={[className, 'not-prose'].filter(Boolean).join(' ')}>
      {/*<HTMLEmbed html={html} />*/}
    </div>
  )
}
