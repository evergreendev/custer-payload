'use client'
import React from 'react'

type Props = {
  html: string
}

export const HTMLEmbed: React.FC<Props> = ({ html }) => {
  return <div></div>;

/*  if (!html) return null

  return (
    <div
      className="html-embed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )*/
}
