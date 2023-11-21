import { createDocsDBConnection } from '@stratego/helpers/docs-db.helper'
import { Locales, type Locale } from '@stratego/lib/locales'
import { defaultLocale } from '@stratego/locales'
import { checkCaptchaToken } from '@stratego/pages/api/(captcha)'
import endpoint from '@stratego/pages/api/(endpoint)'
import {
  DocsArticleSchema,
  DocsArticleRef,
} from '@stratego/schemas/docs-article'
import { StatusCodes } from 'http-status-codes'
import type { NextApiHandler } from 'next'

const handle: NextApiHandler<
  Stratego.Common.ResponseBody<DocsArticleRef | undefined>
> = async (...hooks) => {
  endpoint(['GET'], ...hooks, async (request, response) => {
    const captchaToken = request.headers.authorization

    if (!captchaToken || !(await checkCaptchaToken(captchaToken)))
      throw new Error('Captcha token invalid')

    const localeHeader = request.headers['accept-language']

    const locale =
      localeHeader && Locales.has(localeHeader as Locale)
        ? (localeHeader as Locale)
        : defaultLocale

    const { id } = request.query

    if (!(typeof id === 'string')) throw new TypeError('"id" is undefined')

    const connection = await createDocsDBConnection()

    let docRef =
      (await connection.findOne({
        refId: id,
      })) ?? undefined

    if (!DocsArticleSchema.safeParse(docRef)) docRef = undefined

    response.status(docRef ? StatusCodes.OK : StatusCodes.NOT_FOUND).json({
      status: 'OK',
      result: docRef
        ? {
            id: docRef.refId,
            title: docRef.title[locale]!,
            locale: docRef.availableLocales[
              docRef.availableLocales.indexOf(locale)
            ] as Locale,
          }
        : undefined,
    })
  })
}

export default handle
