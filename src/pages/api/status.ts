import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseBody } from '@stratego/types'

const Handler = (
  _req: NextApiRequest,
  res: NextApiResponse<ResponseBody<string>>
) => {
  res.status(200).json({ value: 'Application under development' })
}

export default Handler
