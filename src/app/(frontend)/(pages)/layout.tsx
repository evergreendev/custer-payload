import type { Metadata } from 'next'

import React from 'react'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import '../globals.css'
import { Header } from '@/Header/Component'

export default async function RootLayout({ children }: { children: React.ReactNode, params: any }) {

  return (
    <section>
      <Header centerNav={false}/>
      {children}
    </section>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
