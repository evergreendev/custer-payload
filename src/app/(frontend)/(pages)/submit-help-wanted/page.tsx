'use client'

import React, { useActionState } from 'react'
import { createHelpWanted } from './actions'

export default function Page() {
  const [state, formAction, pending] = useActionState(createHelpWanted, { message: '', error: '' })

  return (
    <div className="pt-24 pb-24">
      <h1 className="text-4xl mb-12 container">Submit a Help Wanted Listing</h1>
      <div className="container mb-16">
        {state.error && (
          <div role="alert" className="text-red-800 font-bold mb-4">
            {state.error}
          </div>
        )}
        {state.message ? (
          <h2 role="status" className="text-3xl">
            {state.message}
          </h2>
        ) : (
          <form
            action={formAction}
            className="flex flex-wrap w-full bg-blue-50 max-w-screen-lg p-8 mx-auto rounded"
          >
            <fieldset disabled={pending} className="flex flex-col gap-8 w-full">
              <p>Submit your listing for review by the Chamber before it is published.</p>
              <div className="flex flex-col gap-2">
                <label htmlFor="title">Title:</label>
                <input required id="title" name="title" type="text" className="p-2 rounded" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="image">Image (optional, up to 30MB):</label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="p-2 rounded"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="description">Description:</label>
                <textarea
                  required
                  id="description"
                  name="description"
                  rows={6}
                  className="p-2 rounded"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="link">Link:</label>
                <input
                  required
                  id="link"
                  name="link"
                  type="url"
                  placeholder="https://"
                  className="p-2 rounded"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="linkLabel">Link label:</label>
                <input
                  required
                  id="linkLabel"
                  name="linkLabel"
                  type="text"
                  placeholder="Apply Now"
                  className="p-2 rounded"
                />
              </div>
              <button type="submit" className="self-start disabled:opacity-50">
                {pending ? 'Submitting…' : 'Submit'}
              </button>
            </fieldset>
          </form>
        )}
      </div>
    </div>
  )
}
