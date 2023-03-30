import BootstrapStyles from '!!raw-loader!bootstrap/dist/css/bootstrap.min.css'
import format from '@stdlib/string/format'
import { defaultLocale, localesList } from '@stratego/locales'
import { checkCaptchaToken } from '@stratego/pages/api/(captcha)'
import endpoint from '@stratego/pages/api/(endpoint)'
import template from '@stratego/templates/contact.pug'
import { StatusCodes } from 'http-status-codes'
import i18next from 'i18next'
import i18nextBackend from 'i18next-fs-backend'
import type { NextApiHandler } from 'next'
import mailer, { type SendMailOptions } from 'nodemailer'
import path from 'path'
import type { LocalsObject } from 'pug'

const handler: NextApiHandler<Stratego.Common.ResponseBody<undefined>> = async (
  ...hooks
) => {
  endpoint(['POST'], ...hooks, async (request, response) => {
    const captchaToken = request.headers.authorization

    if (!captchaToken || !(await checkCaptchaToken(captchaToken)))
      return response
        .status(StatusCodes.FORBIDDEN)
        .json({ status: 'ERROR', message: 'Captcha token invalid' })

    const locale = ((providedLocale) => {
      return (
        providedLocale &&
        localesList.includes(providedLocale as Stratego.Common.Locale)
          ? providedLocale
          : defaultLocale
      ) as Stratego.Common.Locale
    })(request.headers['accept-language'] as string | undefined)

    const getTranslation = await i18next.use(i18nextBackend).init({
      lng: locale,
      ns: 'mail',
      backend: {
        loadPath: path.join(
          process.cwd(),
          '/public/locales/{{lng}}/{{ns}}.json'
        ),
      },
    })

    const translation: Record<string, string> = getTranslation('mail:contact', {
      returnObjects: true,
      lng: locale,
    })

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

    response.status(StatusCodes.OK).json({
      status: 'OK',
    })
  })
}

export default handler
