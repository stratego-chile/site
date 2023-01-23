import axios from 'axios'

export const checkCaptchaToken = async (token: string) => {
  const destinationURL = new URL(process.env.CAPTCHA_VERIFIER_API)

  destinationURL.searchParams.append('secret', process.env.CAPTCHA_SECRET)
  destinationURL.searchParams.append('response', token)

  const { data } = await axios.post<{
    success: boolean
    score: number
    action: string
    challenge_ts: string
    hostname: string
    'error-codes'?: string[]
  }>(destinationURL.toString(), undefined, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json; charset=utf-8',
    },
  })

  return data.success && data.score > parseFloat(process.env.CAPTCHA_MIN_SCORE)
}
