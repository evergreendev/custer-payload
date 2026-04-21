import type { Endpoint } from 'payload'

type SubmissionDataEntry = {
  field?: string
  value?: unknown
}

type FormSubmissionDoc = {
  id: number | string
  form?:
    | {
        title?: string
      }
    | number
    | string
  createdAt?: string
  submissionData?: SubmissionDataEntry[]
}

const toCSVCell = (value: unknown): string => {
  const stringValue = String(value ?? '').replace(/"/g, '""')

  return `"${stringValue}"`
}

export const exportFormSubmissionsEndpoint: Endpoint = {
  path: '/export-form-submissions',
  method: 'post',
  handler: async (req) => {
    try {
      if (!req || !req.payload) {
        return Response.json(
          {
            success: false,
            message: 'Invalid request or payload',
          },
          { status: 400 },
        )
      }
      const body = (await req.json?.()) as { ids?: unknown }
      const ids = body?.ids

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return Response.json(
          {
            success: false,
            message: 'Selection is required',
          },
          { status: 400 },
        )
      }

      const submissions = await req.payload.find({
        collection: 'form-submissions',
        where: {
          id: {
            in: ids,
          },
        },
        limit: 1000,
        req,
      })

      if (!submissions.docs || submissions.docs.length === 0) {
        return Response.json(
          {
            success: false,
            message: 'No submissions found',
          },
          { status: 404 },
        )
      }

      const docs = submissions.docs as FormSubmissionDoc[]
      const fieldNames = new Set<string>()

      docs.forEach((doc) => {
        if (doc.submissionData && Array.isArray(doc.submissionData)) {
          doc.submissionData.forEach((data) => {
            if (data?.field) {
              fieldNames.add(data.field)
            }
          })
        }
      })

      const headers = ['id', 'form', 'createdAt', ...Array.from(fieldNames)]

      const csvRows = docs.map((doc) => {
        const rowData: Record<string, unknown> = {
          id: doc.id,
          form: typeof doc.form === 'object' ? doc.form?.title : doc.form,
          createdAt: doc.createdAt,
        }

        if (doc.submissionData && Array.isArray(doc.submissionData)) {
          doc.submissionData.forEach((data) => {
            if (data?.field) {
              rowData[data.field] = data.value
            }
          })
        }

        return headers.map((header) => toCSVCell(rowData[header])).join(',')
      })

      const csvContent = [headers.join(','), ...csvRows].join('\n')

      return new Response(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=form-submissions.csv',
        },
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'An error occurred while exporting submissions'

      req.payload.logger.error({
        err: `Error in export form submissions endpoint: ${message}`,
      })

      return Response.json(
        {
          success: false,
          message,
        },
        { status: 500 },
      )
    }
  },
}
