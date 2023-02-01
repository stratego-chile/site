import type { NextApiHandler } from 'next'
import type { Method } from 'axios'
import Pusher from 'pusher'
import endpoint from '@stratego/pages/api/(endpoint)'

const ALLOWED_METHODS: Array<Method> = ['POST']

const handler: NextApiHandler = async (...hooks) => {
  endpoint(ALLOWED_METHODS, ...hooks, async (request, response) => {
    const eventData = JSON.parse(request.body) as Partial<{
      channelName: string
      eventName: string
      data: string
    }>

    ;['channelName', 'eventName', 'data'].forEach((keyName) => {
      if (!Object.hasOwn(eventData, keyName)) {
        throw new Error(`"${keyName}" is undefined`)
      }
    })

    const { channelName, eventName, data } = eventData as Required<
      typeof eventData
    >

    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_APP_KEY,
      cluster: process.env.PUSHER_APP_CLUSTER,
      secret: process.env.PUSHER_APP_SECRET,
      useTLS: true,
    })

    const triggerResponse = await new Promise<Pusher.Response>(
      (resolve, reject) => {
        pusher
          .trigger(channelName, eventName, data)
          .then(resolve)
          .catch((error) => {
            console.log(error)
            reject(error)
          })
      }
    )

    response.status(triggerResponse.status).end()
  })
}

export default handler
