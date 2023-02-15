import type { NextApiHandler } from 'next'
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { isSerializable, isSimilar } from '@stratego/helpers/assert.helper'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { defaultLocale } from '@stratego/locales'
import endpoint from './(endpoint)'
import type { Method } from 'axios'

type DocumentationPost<T = string> = {
  refId: string
  type: T extends 'default' ? T : string
  availableLocales: Array<AvailableLocales>
  title: Record<AvailableLocales, string>
  tags: Array<string>
}

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

const ALLOWED_METHODS: Array<Method> = ['POST']

const handle: NextApiHandler = async (...hooks) => {
  endpoint(ALLOWED_METHODS, ...hooks, async (request, response) => {
    if (!isSerializable(request.body)) throw new TypeError('Wrong payload')

    const searchRequest = JSON.parse(request.body) as Partial<SearchRequest>

    const locale = request.headers['accept-language'] as AvailableLocales

    if (!('searchCriteria' in searchRequest) && !('default' in searchRequest))
      throw new TypeError('"searchCriteria" or "default" is undefined')

    const { searchCriteria, default: isDefault } =
      searchRequest as SearchRequest

    const dynamoClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.DOCS_DYNAMODB_ACCESS_KEY_ID,
        secretAccessKey: process.env.DOCS_DYNAMODB_SECRET_ACCESS_KEY,
      },
    })

    const { Items: items } = await dynamoClient.send(
      new ScanCommand({
        TableName: process.env.DOCS_DYNAMODB_TABLE,
      })
    )

    const docs: Array<DocumentationPost> = (($items) => {
      if (!isDefault) {
        const parsedCriteria = (searchCriteria ?? '').split(' ')

        return $items.filter(({ tags }) =>
          tags.some((tag) =>
            parsedCriteria.some((fragment) =>
              isSimilar(fragment.toLowerCase(), tag.toLowerCase())
            )
          )
        )
      }
      return $items.filter(({ type }) => type === 'default')
    })((items ?? []).map((item) => unmarshall(item) as DocumentationPost))

    response.status(200).json({
      foundArticles: docs
        .filter(({ availableLocales }) =>
          availableLocales.includes(locale ?? defaultLocale)
        )
        .map(({ refId, title }) => ({
          id: refId,
          title: title[locale] ?? title[defaultLocale],
        })),
      defaultMode: !!isDefault,
    })
  })
}

export default handle
