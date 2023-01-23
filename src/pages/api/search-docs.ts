import { Server as IOServer, type Socket } from 'socket.io'
import type { Server as HTTPServer } from 'http'
import type { NextApiRequest, NextApiResponse, PageConfig } from 'next'
import type { Socket as NetSocket } from 'net'
import type { ExtendedError } from 'socket.io/dist/namespace'
import type { DefaultEventsMap } from 'socket.io/dist/typed-events'

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

const accessMiddleware = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError) => void
) => {
  const { token } = socket.handshake.auth
  if (token === process.env.DOCS_SEARCH_TOKEN) return next()
  return next(new Error('Authentication error'))
}

const handler = (
  _request: NextApiRequest,
  response: NextApiResponseWithSocket
) => {
  if (!response.socket.server.io) {
    const io = new IOServer(response.socket.server)

    io.use(accessMiddleware)

    io.on('connection', (socket) => {
      socket.on('search-docs', () => {
        socket.emit(
          'search-results',
          ...[
            // TODO: Docs index with i18n support
          ]
        )
      })
    })

    response.socket.server.io = io
  }
  response.end()
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

export default handler
