'use client'
import { usePathname } from 'next/navigation'
import { PopUp } from '@/payload-types'
import Image from 'next/image'
import { CMSLink } from '@/components/Link'
import React, { useEffect } from 'react'
import { ChevronUp, X } from 'lucide-react'
import { setBannerCookie } from '@/collections/PopUps/component/setBannerCookie'

interface PopUpClientProps {
  popUps: PopUp[]
}

const PopUpClient = ({ popUps }: PopUpClientProps) => {
  const pathname = usePathname();
  useEffect(() => {
    setTimeout(() => setShowPopup(true), 1000)
  }, [])
  const [showPopup, setShowPopup] = React.useState(false)
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
    <div
      className={`fixed z-30 max-w-full min-w-64 bottom-0 right-0 sm:right-8 bg-gray-100 shadow-lg duration-700 transition-transform ${showPopup ? '' : 'translate-y-full'}`}
    >
      <form
        action={() => {
          if(!showPopup){
            setBannerCookie(filteredPopups[0].id)
          }
        }}
      >
        <button
          aria-label={showPopup ? 'Collapse popup' : 'Expand popup'}
          aria-expanded={showPopup}
          onClick={() => setShowPopup(!showPopup)}
          className="sm:translate-x-1/2 -translate-y-1/2 size-9 rounded-full absolute top-0 right-0 bg-brand-blue sm:bg-opacity-50 hover:bg-opacity-100 p-1"
        >
          {showPopup ? (
            <X className="mx-auto size-4 text-white" aria-hidden="true" />
          ) : (
            <ChevronUp className="mx-auto size-4 text-white" aria-hidden="true" />
          )}
        </button>
      </form>
      <h2 className="text-2xl p-3 text-center">{filteredPopups[0].headerText}</h2>
      {filteredPopups[0].headerImage && typeof filteredPopups[0].headerImage !== 'number' && (
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
