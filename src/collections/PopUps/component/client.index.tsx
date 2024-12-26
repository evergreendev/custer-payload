'use client'
import { usePathname } from 'next/navigation'
import { PopUp } from '@/payload-types'
import Image from 'next/image'
import { CMSLink } from '@/components/Link'
import React from 'react'

interface PopUpClientProps {
  popUps: PopUp[]
}

const PopUpClient = ({ popUps }: PopUpClientProps) => {
  const pathname = usePathname()
  const filteredPopups = popUps.filter((popUp) => {
    if (popUp.showOnAllPages) return true
    return popUp.pages?.find((x) => {
      if (typeof x.value === 'number') return false

      return x.value.slug === pathname
    })
  })
  if (!filteredPopups[0]) {
    return null
  }

  return (
    <div className="fixed bottom-0 right-4 bg-gray-100 shadow-lg">
      <h2 className="text-2xl p-3 text-center">{filteredPopups[0].headerText}</h2>
      {filteredPopups[0].headerImage &&
        typeof filteredPopups[0].headerImage !== 'number' && (
          <Image
            className="w-full"
            src={filteredPopups[0].headerImage.url || ''}
            alt={filteredPopups[0].headerImage.alt || ''}
            width={filteredPopups[0].headerImage.width || 0}
            height={filteredPopups[0].headerImage.height || 0}
          />
        )}
      <div className="flex gap-8 w-full items-center">
        {(filteredPopups[0].links || []).map(({ link }, i) => {
          return <CMSLink className="grow" key={i} size="lg" {...link} />
        })}
      </div>
    </div>
  )
}

export default PopUpClient
