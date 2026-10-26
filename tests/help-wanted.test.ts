import assert from 'node:assert/strict'
import test from 'node:test'
import type { Payload } from 'payload'

import { HelpWanted } from '../src/collections/HelpWanted'
import { submitHelpWanted } from '../src/utilities/submitHelpWanted'
import { submissionNotificationRecipients } from '../src/utilities/submissionNotifications'

function submission() {
  const data = new FormData()
  data.set('title', '  Front Desk Associate  ')
  data.set('description', 'Join our team.\nWeekend shifts available.')
  data.set('link', 'https://example.com/jobs')
  data.set('linkLabel', 'Apply Now')
  return data
}

function mockPayload(options: { failCreate?: boolean; failEmail?: boolean } = {}) {
  const creates: any[] = []
  const emails: any[] = []
  const errors: any[] = []
  const payload = {
    create: async (args: any) => {
      creates.push(args)
      if (options.failCreate) throw new Error('Save failed')
      return { id: args.collection === 'media' ? 12 : 34 }
    },
    sendEmail: async (args: any) => {
      emails.push(args)
      if (options.failEmail) throw new Error('Email failed')
    },
    logger: { error: (...args: any[]) => errors.push(args) },
  } as unknown as Pick<Payload, 'create' | 'sendEmail' | 'logger'>
  return { payload, creates, emails, errors }
}

test('public submissions always save a draft and notify the event reviewers', async () => {
  const mock = mockPayload()
  const form = submission()
  form.set('_status', 'published')
  const result = await submitHelpWanted(form, async () => mock.payload)
  assert.equal(result.error, '')
  assert.match(result.message, /reviewed/)
  assert.equal(mock.creates.length, 1)
  assert.equal(mock.creates[0].collection, 'help-wanted')
  assert.equal(mock.creates[0].draft, true)
  assert.deepEqual(mock.creates[0].data, {
    title: 'Front Desk Associate',
    description: 'Join our team.\nWeekend shifts available.',
    link: 'https://example.com/jobs',
    linkLabel: 'Apply Now',
    image: undefined,
    _status: 'draft',
  })
  assert.equal(mock.emails[0].to, submissionNotificationRecipients)
  assert.match(mock.emails[0].html, /\/admin\/collections\/help-wanted\/34/)
})

test('uploads the image and attaches its ID to the draft', async () => {
  const mock = mockPayload()
  const form = submission()
  form.set('image', new File(['image data'], 'job.png', { type: 'image/png' }))
  const result = await submitHelpWanted(form, async () => mock.payload)
  assert.equal(result.error, '')
  assert.equal(mock.creates[0].collection, 'media')
  assert.equal(mock.creates[0].file.name, 'job.png')
  assert.equal(mock.creates[0].file.mimetype, 'image/png')
  assert.equal(mock.creates[0].file.data.toString(), 'image data')
  assert.equal(mock.creates[1].data.image, 12)
})

test('treats an empty file input as no image', async () => {
  const mock = mockPayload()
  const form = submission()
  form.set('image', new File([], '', { type: 'application/octet-stream' }))
  assert.equal((await submitHelpWanted(form, async () => mock.payload)).error, '')
  assert.equal(mock.creates.length, 1)
})

test('rejects missing fields, unsafe links, invalid files, and oversized images before saving', async () => {
  const invalid = [
    ...['title', 'description', 'link', 'linkLabel'].map(
      (name) => (form: FormData) => form.set(name, '  '),
    ),
    ...['javascript:alert(1)', 'data:text/html,test', '/jobs', 'not a URL'].map(
      (url) => (form: FormData) => form.set('link', url),
    ),
    (form: FormData) =>
      form.set('image', new File(['PDF'], 'job.pdf', { type: 'application/pdf' })),
    (form: FormData) =>
      form.set(
        'image',
        new File([new Uint8Array(30 * 1000000 + 1)], 'job.png', { type: 'image/png' }),
      ),
  ]
  for (const change of invalid) {
    const form = submission()
    change(form)
    const result = await submitHelpWanted(form, async () => {
      assert.fail('Invalid submissions must not initialize Payload')
    })
    assert.ok(result.error)
    assert.equal(result.message, '')
  }
})

test('failed saves return an error without notifying reviewers', async () => {
  const mock = mockPayload({ failCreate: true })
  const result = await submitHelpWanted(submission(), async () => mock.payload)
  assert.ok(result.error)
  assert.equal(mock.emails.length, 0)
})

test('notification failures are logged without asking users to resubmit saved drafts', async () => {
  const mock = mockPayload({ failEmail: true })
  const result = await submitHelpWanted(submission(), async () => mock.payload)
  assert.equal(result.error, '')
  assert.equal(mock.creates.length, 1)
  assert.equal(mock.errors.length, 1)
  assert.equal(mock.errors[0][0].listingID, 34)
})

test('anonymous readers only see published listings and cannot modify listings', async () => {
  const anonymous = { req: { user: null } } as any
  const staff = { req: { user: { id: 1 } } } as any
  const access = HelpWanted.access!
  assert.deepEqual(await access.read!(anonymous), { _status: { equals: 'published' } })
  assert.equal(await access.read!(staff), true)
  for (const operation of ['create', 'update', 'delete'] as const) {
    assert.equal(await access[operation]!(anonymous), false)
    assert.equal(await access[operation]!(staff), true)
  }
})
