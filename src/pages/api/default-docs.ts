import { NextApiHandler } from 'next'
import { i18n } from 'next-i18next'

const ALLOWED_METHODS = ['OPTIONS', 'GET']

const handler: NextApiHandler<
  Array<{ id: number | string; title: string }> | ResponseBody<undefined>
> = async (request, response) => {
  if (!ALLOWED_METHODS.includes(String(request.method).toUpperCase())) {
    response
      .status(405)
      .json({ status: 'ERROR', message: 'Method not allowed' })
  } else if (request.method === 'OPTIONS') {
    response
      .status(200)
      .setHeader('Allow', ALLOWED_METHODS.slice(1).join(', '))
      .end()
  } else {
    response.status(200).json([
      {
        id: 'information-security',
        title: String(i18n?.t('docs:articles.default.informationSecurity')),
      },
    ])
  }
}

export default handler
