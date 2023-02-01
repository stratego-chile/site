import type { Method } from 'axios'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const endpoint = <T = any>(
  methods: Array<Method>,
  request: NextApiRequest,
  response: NextApiResponse<T>,
  handler: NextApiHandler<T>
): unknown | Promise<unknown> => {
  if (String(request.method).toUpperCase() === 'OPTIONS') {
    return response.status(200).setHeader('Allow', methods.join(', ')).end()
  } else if (
    !methods.includes(String(request.method).toUpperCase() as Method)
  ) {
    return response
      .status(405)
      .json({ status: 'ERROR', message: 'Method not allowed' } as any)
  } else {
    try {
      return handler(request, response)
    } catch (error) {
      return response.status(500).json({
        status: 'ERROR',
        message: 'Unexpected error',
        trace: error || undefined,
      } as any)
    }
  }
}

export default endpoint
