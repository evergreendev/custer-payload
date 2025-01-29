import type { Metadata } from 'next'

import { cn } from 'src/utilities/cn'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Playball, Roboto_Condensed } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import {GoogleAnalytics} from '@next/third-parties/google'
import './globals.css'
import PopUp from '@/collections/PopUps/component'

const playball = Playball({
  subsets:['latin'],
  weight: ["400"],
  variable: "--font-playball",
  display: "swap"
})

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ["400", "100", "200", "300", "500", "900"],
  variable: "--font-roboto",
  display: "swap"
})

export default async function RootLayout({ children }: { children: React.ReactNode, params: any }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable, playball.variable, robotoCondensed.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <LivePreviewListener />
          {children}
          <Footer />
          <PopUp/>
        </Providers>
      </body>
    <GoogleAnalytics gaId="G-7KBVJ8N50K"/>
    </html>
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
