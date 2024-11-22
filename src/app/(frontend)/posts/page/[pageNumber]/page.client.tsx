'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React from 'react'

const PageClient: React.FC = () => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()

  return <React.Fragment />
}

export default PageClient
