'use client'
import type { Metadata } from 'next/types'

import React, { useActionState } from 'react'
import PageClient from './page.client'
import { createEvent } from '@/app/(frontend)/(pages)/submit-event/actions'

const initialState = {
  message: '',
}

export default function Page() {
  const [state, formAction] = useActionState(createEvent, initialState)

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <h1 className="text-4xl mb-12 container">Submit Your Event</h1>
      <div className="container mb-16">
        {state.message ? (
          <h2 className="text-3xl">{state.message}</h2>
        ) : (
          <form
            className={`flex flex-wrap w-full bg-blue-50 max-w-screen-lg p-8 mx-auto rounded`}
            action={formAction}
          >
            <div className="flex flex-wrap gap-8 w-full">
              <div className="flex gap-2 items-center">
                <label htmlFor="event-start">Event Start: </label>
                <input className="p-2 rounded" name="event-start" type="date" />
              </div>
              <div className="flex gap-2 items-center">
                <label htmlFor="event-end">Event End: </label>
                <input className="p-2 rounded" name="event-start" type="date" />
              </div>
              <div className="flex gap-2 items-center w-full">
                <label htmlFor="image">Image: </label>
                <input className="p-2 rounded" name="image" type="file" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="title">Title: </label>
                <input className="p-2 rounded grow" name="title" type="text" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="location">Location: </label>
                <input className="p-2 rounded grow" name="location" type="text" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="details">Details: </label>
                <textarea className="p-2 rounded grow" name="details" />
              </div>
              <button>Submit</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
