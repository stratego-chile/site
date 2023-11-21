import { isSerializable } from '@stratego/helpers/assert.helper'
import { createDocsDBConnection } from '@stratego/helpers/docs-db.helper'
import { Locale } from '@stratego/lib/locales'
import { defaultLocale } from '@stratego/locales'
import { checkCaptchaToken } from '@stratego/pages/api/(captcha)'
import endpoint from '@stratego/pages/api/(endpoint)'
import {
  DocsArticleType,
  type DocsArticleRef,
} from '@stratego/schemas/docs-article'
import { StatusCodes } from 'http-status-codes'
import type { NextApiHandler } from 'next'

type SearchRequest = Exclusive<
  {
    searchCriteria: string
    default?: never
  },
  {
    searchCriteria?: never
    default: boolean
  }
>

const handle: NextApiHandler<
  Stratego.Common.ResponseBody<{
    foundArticles: Array<DocsArticleRef>
    defaultMode: boolean
  }>
> = async (...hooks) => {
  endpoint(['POST'], ...hooks, async (request, response) => {
    if (!isSerializable(request.body)) throw new TypeError('Wrong payload')

    const captchaToken = request.headers.authorization

    if (!captchaToken || !(await checkCaptchaToken(captchaToken)))
      throw new Error('Captcha token invalid')

    const searchRequest = request.body as Partial<SearchRequest>

    const localeHeader = request.headers['accept-language']

    const locale = (localeHeader as Locale) ?? defaultLocale

    if (!('searchCriteria' in searchRequest) && !('default' in searchRequest))
      throw new TypeError('"searchCriteria" or "default" are undefined')

    const { searchCriteria = '', default: isDefault } =
      searchRequest as SearchRequest

    const connection = await createDocsDBConnection()

    const results = await connection
      .find(
        isDefault
          ? {
              type: DocsArticleType.Default,
            }
          : {
              $and: [
                {
                  type: {
                    $ne: DocsArticleType.Default,
                  },
                },
                {
                  $or: [
                    {
                      tags: {
                        $regex: new RegExp(searchCriteria, 'i'),
                      },
                    },
                    {
                      title: {
                        [locale]: {
                          $regex: new RegExp(searchCriteria, 'i'),
                        },
                      },
                    },
                  ],
                },
              ],
            }
      )
      .toArray()

    const docs = results
      .filter(({ availableLocales }) => availableLocales.includes(locale))
      .map(
        (doc) =>
          ({
            id: doc.refId,
            title: doc.title[locale]!,
            locale: doc.availableLocales[
              doc.availableLocales.indexOf(locale)
            ] as Locale,
          }) satisfies DocsArticleRef
      )

    response.status(StatusCodes.OK).json({
      status: 'OK',
      result: {
        foundArticles: docs,
        defaultMode: !!isDefault,
      },
    })
  })
}

export default handle
