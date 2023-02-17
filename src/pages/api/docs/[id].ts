import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { defaultLocale } from '@stratego/locales'
import { checkCaptchaToken } from '@stratego/pages/api/(captcha)'
import endpoint from '@stratego/pages/api/(endpoint)'
import type { Method } from 'axios'
import type { NextApiHandler } from 'next'

const ALLOWED_METHODS: Array<Method> = ['GET']

const handle: NextApiHandler<DocumentationPostRef | undefined> = async (
  ...hooks
) => {
  endpoint(ALLOWED_METHODS, ...hooks, async (request, response) => {
    const captchaToken = request.headers.authorization

    if (!captchaToken || !(await checkCaptchaToken(captchaToken)))
      throw new Error('Captcha token invalid')

    const locale = request.headers['accept-language'] as
      | AvailableLocales
      | undefined

    const { id } = request.query

    if (!(typeof id === 'string')) throw new TypeError('"id" is undefined')

    const dynamoClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.DOCS_DYNAMODB_ACCESS_KEY_ID,
        secretAccessKey: process.env.DOCS_DYNAMODB_SECRET_ACCESS_KEY,
      },
    })

    const { Items: items } = await dynamoClient.send(
      new QueryCommand({
        TableName: process.env.DOCS_DYNAMODB_TABLE,
        KeyConditionExpression: 'refId = :refId',
        ExpressionAttributeValues: {
          ':refId': { S: id },
        },
      })
    )

    const item = items?.at(0) ?? undefined

    const docRef = item ? (unmarshall(item) as DocumentationPost) : undefined

    response.status(200).json(
      docRef?.availableLocales.includes(locale ?? defaultLocale)
        ? {
            id: docRef.refId,
            title:
              (locale && docRef.title[locale]) ?? docRef.title[defaultLocale]!,
            locale:
              docRef.availableLocales[
                docRef.availableLocales.indexOf(locale ?? defaultLocale)
              ],
          }
        : undefined
    )
  })
}

export default handle