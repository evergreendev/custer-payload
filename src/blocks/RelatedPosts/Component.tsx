import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Member, Post } from '@/payload-types'

import { Card } from '@/components/Card'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]|Member[]
  relationTo?: 'posts' | 'members' | 'pages'
  introContent?: any
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent, relationTo } = props

  return (
    <div className={clsx('container', className)}>
      {introContent && <RichText content={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <Card key={index} doc={doc} relationTo={relationTo ? relationTo : 'posts'} showCategories />
        })}
      </div>
    </div>
  )
}
