import template from '@stratego/mail/templates/contact.pug'
import type { NextApiHandler } from 'next'
import BootstrapStyles from '!!raw-loader!bootstrap/dist/css/bootstrap.min.css'
import mailer, { type SendMailOptions } from 'nodemailer'
import { i18n } from '@stratego/../next-i18next.config'
import { type LocalsObject } from 'pug'
import { format } from '@stdlib/string'
import axios from 'axios'

const ALLOWED_METHODS = ['OPTIONS', 'POST']

const checkCaptchaToken = async (token: string) => {
  const destinationURL = new URL(process.env.CAPTCHA_VERIFIER_API)

  destinationURL.searchParams.append('secret', process.env.CAPTCHA_SECRET)
  destinationURL.searchParams.append('response', token)

  const { data } = await axios.post<{
    success: boolean
    score: number
    action: string
    challenge_ts: string
    hostname: string
    'error-codes'?: string[]
  }>(destinationURL.toString(), undefined, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json; charset=utf-8',
    },
  })

  return data.success && data.score > parseFloat(process.env.CAPTCHA_MIN_SCORE)
}

const handler: NextApiHandler<ResponseBody<undefined>> = async (
  request,
  response
) => {
  const captchaToken = request.headers.authorization

  if (!ALLOWED_METHODS.includes(request.method!)) {
    response
      .status(405)
      .json({ status: 'ERROR', message: 'Method not allowed' })
  } else {
    if (request.method === 'OPTIONS') {
      response.status(200).end()
    } else if (!captchaToken || !(await checkCaptchaToken(captchaToken))) {
      response
        .status(403)
        .json({ status: 'ERROR', message: 'Captcha token invalid' })
    } else {
      try {
        const locale =
          'accept-language' in request.headers
            ? request.headers['accept-language']!
            : i18n.defaultLocale

        const translation = (
          await (async () => {
            switch (locale) {
              case 'en-US':
                return await import('@stratego/mail/i18n/en-US.json')
              case 'pt-BR':
                return await import('@stratego/mail/i18n/pt-BR.json')
              default:
                return await import('@stratego/mail/i18n/es-CL.json')
            }
          })()
        ).default

        const {
          businessName,
          email,
          message,
          name,
          phoneNumber,
          phonePrefix,
          surname,
        } = request.body as Partial<{
          name: string
          surname: string
          phonePrefix: string
          phoneNumber: string
          businessName: string
          email: string
          message: string
        }>

        const locals: LocalsObject = {
          locale,
          cssStyles: BootstrapStyles,
          title: translation.title,
          message: {
            title: format(translation.subTitle, name, surname),
            contactData: [
              format(translation.orgName, businessName),
              format(translation.email, email),
              format(translation.phoneNumber, phonePrefix, phoneNumber),
            ],
            content: [translation.message, message],
            footer: translation.footer,
          },
        }

        const compiledTemplate = template(locals)

        const mailTransporter = mailer.createTransport({
          host: process.env.MAILER_HOST,
          port: parseInt(process.env.MAILER_PORT),
          secure: true,
          auth: {
            type: process.env.MAILER_TYPE,
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS,
          },
        })

        const mailOptions: SendMailOptions = {
          from: process.env.MAILER_FROM,
          to: process.env.MAILER_TO,
          encoding: 'utf-8',
          subject: locals.title,
          text: `
            # ${locals.message.title}

            ${locals.message.contactData[0]}

            ${locals.message.contactData[1]}

            ${locals.message.contactData[2]}

            ${locals.message.content[0]}
            ${locals.message.content[1]}

            ${locals.message.footer}
          `,
          html: compiledTemplate,
        }

        await mailTransporter.sendMail(mailOptions)

        response.status(200).json({
          status: 'OK',
        })
      } catch (error) {
        response.status(500).json({
          status: 'ERROR',
          message: 'Unexpected error',
          trace: error || undefined,
        })
      }
    }
  }
}

export default handler
