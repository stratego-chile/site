import BootstrapStyles from '!!raw-loader!bootstrap/dist/css/bootstrap.min.css'
import format from '@stdlib/string/format'
import { defaultLocale, localesList } from '@stratego/locales'
import defaultTranslation from '@stratego/mail/i18n/es-CL.json'
import { checkCaptchaToken } from '@stratego/pages/api/(captcha)'
import endpoint from '@stratego/pages/api/(endpoint)'
import template from '@stratego/templates/contact.pug'
import type { Method } from 'axios'
import type { NextApiHandler } from 'next'
import mailer, { type SendMailOptions } from 'nodemailer'
import { type LocalsObject } from 'pug'

const ALLOWED_METHODS: Array<Method> = ['POST']

const handler: NextApiHandler<Stratego.Common.ResponseBody<undefined>> = async (
  ...hooks
) => {
  endpoint(ALLOWED_METHODS, ...hooks, async (request, response) => {
    const captchaToken = request.headers.authorization

    if (!captchaToken || !(await checkCaptchaToken(captchaToken)))
      return response
        .status(403)
        .json({ status: 'ERROR', message: 'Captcha token invalid' })

    const providedLocale =
      'accept-language' in request.headers &&
      (request.headers['accept-language']! as Stratego.Common.Locale)

    const locale =
      providedLocale && providedLocale in localesList
        ? providedLocale
        : (defaultLocale as Stratego.Common.Locale)

    // Prevents the unnecessary import of unused locales
    const translation: typeof defaultTranslation =
      locale === (defaultLocale as Stratego.Common.Locale)
        ? defaultTranslation
        : (await import(`@stratego/mail/i18n/${locale}.json`)).default

    const formData = request.body as Partial<{
      name: string
      surname: string
      phonePrefix: string
      phoneNumber: string
      businessName: string
      email: string
      message: string
    }>

    ;[
      'name',
      'surname',
      'phonePrefix',
      'phoneNumber',
      'email',
      'message',
    ].forEach((keyName) => {
      if (!(keyName in formData))
        throw new ReferenceError(`"${keyName}" is undefined`)
    })

    const {
      businessName,
      email,
      message,
      name,
      phoneNumber,
      phonePrefix,
      surname,
    } = formData as Required<typeof formData>

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
  })
}

export default handler
