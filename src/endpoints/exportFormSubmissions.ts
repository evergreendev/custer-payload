import type { Endpoint, Where } from 'payload'
import { mergeListSearchAndWhere } from 'payload/shared'
import type { FormSubmission } from '@/payload-types'

function csvCell(value: string | number) {
  const text = String(value)
  // Spreadsheet apps can evaluate untrusted text as formulas, including in headers.
  const safeText = /^[\t\r\n]|^\s*[=+@-]/u.test(text) ? `'${text}` : text
  return `"${safeText.replaceAll('"', '""')}"`
}

export const exportFormSubmissions: Endpoint = {
  path: '/export',
  method: 'post',
  handler: async (req) => {
    if (!req.user || req.user.collection !== 'users') {
      return Response.json({ error: 'Sign in to export form submissions.' }, { status: 401 })
    }

    const selection = await req.json?.().catch(() => null)
    let selectedWhere: Where
    if (selection?.mode === 'allMatching') {
      if (
        selection.where !== undefined &&
        (!selection.where || typeof selection.where !== 'object' || Array.isArray(selection.where))
      ) {
        return Response.json({ error: 'Invalid submission filters.' }, { status: 400 })
      }

      selectedWhere = mergeListSearchAndWhere({
        collectionConfig: req.payload.collections['form-submissions'].config,
        search: typeof selection.search === 'string' ? selection.search : undefined,
        where: selection.where,
      })
    } else if (
      selection?.mode === 'selected' &&
      Array.isArray(selection.ids) &&
      selection.ids.length > 0 &&
      selection.ids.every((id: unknown) => typeof id === 'number' && Number.isSafeInteger(id) && id > 0)
    ) {
      selectedWhere = { id: { in: selection.ids } }
    } else {
      return Response.json({ error: 'Select at least one submission to export.' }, { status: 400 })
    }

    const submissions: FormSubmission[] = []
    const fieldNames = new Set<string>()
    let lastID: number | undefined

    for (;;) {
      const { docs, hasNextPage } = await req.payload.find({
        collection: 'form-submissions',
        depth: 1,
        limit: 250,
        overrideAccess: false,
        req,
        sort: 'id',
        where:
          lastID === undefined
            ? selectedWhere
            : { and: [selectedWhere, { id: { greater_than: lastID } }] },
      })

      for (const submission of docs) {
        submissions.push(submission)
        for (const { field } of submission.submissionData ?? []) {
          fieldNames.add(field)
        }
      }

      if (!hasNextPage || docs.length === 0) break
      lastID = docs[docs.length - 1].id
    }

    const fields = [...fieldNames]
    const header = ['Submission ID', 'Form ID', 'Form title', 'Submitted at (UTC)']
    const rows = [[...header, ...fields.map((field) => `Field: ${field}`)].map(csvCell).join(',')]

    for (const submission of submissions) {
      const values = new Map<string, string[]>()
      for (const { field, value } of submission.submissionData ?? []) {
        const previous = values.get(field)
        if (previous) previous.push(value)
        else values.set(field, [value])
      }

      const form = submission.form
      rows.push(
        [
          submission.id,
          typeof form === 'object' ? (form?.id ?? '') : form,
          typeof form === 'object' ? (form?.title ?? '') : '',
          submission.createdAt,
          ...fields.map((field) => values.get(field)?.join('\n') ?? ''),
        ]
          .map(csvCell)
          .join(','),
      )
    }

    return new Response(`\uFEFF${rows.join('\r\n')}\r\n`, {
      headers: {
        'Cache-Control': 'private, no-store',
        'Content-Disposition': 'attachment; filename="form-submissions.csv"',
        'Content-Type': 'text/csv; charset=utf-8',
      },
    })
  },
}
