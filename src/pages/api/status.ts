import type { NextApiRequest, NextApiResponse } from 'next'

const Handler = (
  _req: NextApiRequest,
  res: NextApiResponse<ResponseBody<string>>
) => {
  res.status(200).json({ result: 'Application under development' })
}

export default Handler
