import type { Email, FormattedEmail, PluginConfig } from '../types'
import { replaceDoubleCurlys } from '../utilities/replaceDoubleCurlys'
import { serialize } from '../utilities/serializeRichText'

const sendEmail = async (beforeChangeData: any): Promise<any> => {
  const { operation, data } = beforeChangeData

  console.log(data);

  if (operation === 'create') {
    const {
      data: { id: formSubmissionID },
      req: { payload, locale },
    } = beforeChangeData

    const { form: formID, submissionData } = data || {}

    try {
      const form = await payload.findByID({
        id: formID,
        collection: 'forms',
        locale,
      })

      const { emails } = form

      if (emails && emails.length) {
        const formattedEmails: FormattedEmail[] = emails.map(
          (email: Email): FormattedEmail | null => {
            const {
              message,
              subject,
              emailTo,
              cc: emailCC,
              bcc: emailBCC,
              emailFrom,
              replyTo: emailReplyTo,
            } = email

            const to = replaceDoubleCurlys(emailTo, submissionData)
            const cc = emailCC ? replaceDoubleCurlys(emailCC, submissionData) : ''
            const bcc = emailBCC ? replaceDoubleCurlys(emailBCC, submissionData) : ''
            const from = replaceDoubleCurlys(emailFrom, submissionData)
            const replyTo = replaceDoubleCurlys(emailReplyTo || emailFrom, submissionData)
            const attachments: { filename: string; path: string }[] = [];

            for (let i = 0; i < submissionData.length; i++) {
              const curr = submissionData[i].value;
              const fileNameArr = curr.split('pload:-')

              if (fileNameArr.length > 1 && fileNameArr[1] !== "") {
                attachments.push({
                  filename: fileNameArr[1],
                  path: process.env.NODE_ENV === "production" ? "./dist/" + "user-uploaded-documents/" + fileNameArr[1] : "./public/" + "user-uploaded-documents/" + fileNameArr[1],
                })
              }
            }

            return {
              to,
              from,
              cc,
              bcc,
              replyTo,
              subject: replaceDoubleCurlys(subject, submissionData),
              html: `<div>${serialize(message, submissionData)}</div>`,
              attachments: attachments
            }
          },
        )

        let emailsToSend = formattedEmails


        // const log = emailsToSend.map(({ html, ...rest }) => ({ ...rest }))

        await Promise.all(
          emailsToSend.map(async email => {
            const { to } = email
            try {
              const emailPromise = await payload.sendEmail(email)
              return emailPromise
            } catch (err: unknown) {
              payload.logger.error({
                err: `Error while sending email to address: ${to}. Email not sent: ${err}`,
              })
            }
          }),
        )
      } else {
        payload.logger.info({ msg: 'No emails to send.' })
      }
    } catch (err: unknown) {
      const msg = `Error while sending one or more emails in form submission id: ${formSubmissionID}.`
      payload.logger.error({ err: msg })
    }
  }

  return data
}

export default sendEmail
