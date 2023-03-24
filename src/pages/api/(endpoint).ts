import type { Method } from 'axios'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const endpoint = <T = any>(
  methods: Array<Method>,
  request: NextApiRequest,
  response: NextApiResponse<T>,
  handler: NextApiHandler<T>
): unknown | Promise<unknown> => {
  if (String(request.method).toUpperCase() === 'OPTIONS') {
    return response
      .status(StatusCodes.OK)
      .setHeader('Allow', methods.join(', '))
      .end()
  } else if (
    !methods.includes(String(request.method).toUpperCase() as Method)
  ) {
    return response.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      status: 'ERROR',
      message: getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED),
    } as any)
  } else {
    try {
      return handler(request, response)
    } catch (error) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'ERROR',
        message: 'Unexpected error',
        trace: error,
      } as any)
    }
  }
}

export default endpoint
