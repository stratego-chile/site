import type { NextApiHandler } from 'next'
import type { Method } from 'axios'
import endpoint from '@stratego/pages/api/(endpoint)'

const ALLOWED_METHODS: Array<Method> = ['GET']

const handler: NextApiHandler<
  Array<{ id: number | string; title: string }> | ResponseBody<undefined>
> = async (...hooks) => {
  endpoint(ALLOWED_METHODS, ...hooks, (_request, response) => {
    response.status(200).json([
      {
        id: 'information-security',
        title: 'docs:articles.default.informationSecurity',
      },
    ])
  })
}

export default handler
