"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export type LatestCard = {
  id?: string | number
  slug?: string | null
  title?: string | null
  imgUrl?: string | null
}

type Props = {
  items: LatestCard[]
  className?: string
}

export default function LatestCarousel({ items, className }: Props) {
  const [index, setIndex] = React.useState(0)
  const [itemsPerView, setItemsPerView] = React.useState(1)
  const [isHovering, setIsHovering] = React.useState(false)

  // Determine items per view based on viewport (no dependencies)
  React.useEffect(() => {
    const compute = () => {
      if (window.matchMedia('(min-width: 768px)').matches) return 3
      if (window.matchMedia('(min-width: 640px)').matches) return 2
      return 1
    }
    const apply = () => setItemsPerView(compute())
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])

  const maxIndex = Math.max(0, items.length - itemsPerView)

  const goTo = (i: number) => {
    if (items.length === 0) return
    // Looping carousel
    if (i < 0) setIndex(maxIndex)
    else if (i > maxIndex) setIndex(0)
    else setIndex(i)
  }

  // Autoplay every 5s, pause on hover
  React.useEffect(() => {
    if (items.length <= itemsPerView) return
    if (isHovering) return
    const t = setInterval(() => goTo(index + 1), 5000)
    return () => clearInterval(t)
  }, [index, items.length, itemsPerView, isHovering])

  const pct = itemsPerView > 0 ? 100 / itemsPerView : 100
  const translate = -(index * pct)

  return (
    <div className={className} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <div className="relative">
        {/* Track */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out will-change-transform"
            style={{ transform: `translateX(${translate}%)` }}
            aria-live="polite"
          >
            {items.map((post, idx) => (
              <div key={(post.id ?? idx) as React.Key} style={{ width: `${pct}%` }} className="shrink-0 px-2">
                <Link href={post.slug ? `/posts/${post.slug}` : '#'} className="block focus:outline-none focus:ring-2 focus:ring-white/70 rounded">
                  <div className="rounded overflow-hidden transition">
                    <div className="relative aspect-square w-2/3 mx-auto">
                      {post.imgUrl ? (
                        <Image src={post.imgUrl} alt={post.title || 'Post image'} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-white/10" />
                      )}
                    </div>
                    <div className="p-3">
                      <div className="line-clamp-2 font-semibold text-white">{post.title}</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        {items.length > itemsPerView && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => goTo(index - 1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M12.293 15.707a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 0-1.414l5-5A1 1 0 1 1 12.293 5.293L8.586 9l3.707 3.707a1 1 0 0 1 0 1.414z"/></svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => goTo(index + 1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M7.707 4.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5A1 1 0 0 1 7.707 14.707L11.414 11 7.707 7.293a1 1 0 0 1 0-1.414z"/></svg>
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {items.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
