require 'json5/lib/register'

next = require 'next'
fs = require 'fs'
path = require 'path'

{ certDir } = require '../config.json5'
{ createServer } = require 'https'
{ parse } = require 'url'

port = 3000
dev = process.env.NODE_ENV != 'production'
app = next { dev }
handle = app.getRequestHandler()

getFile = (fileName) ->
  fs.readFileSync path.join(__dirname, '..', certDir, fileName)

httpsOptions =
  key: getFile 'devcert.key'
  cert: getFile 'devcert.cert'

app.prepare().then ->
  createServer httpsOptions, (req, res) ->
    handle req, res, (parse req.url, true)
    return
  .listen port, (err) ->
    if err
      throw err
    else
      console.log "ready - started server on url: https://localhost:#{port}"
    return
  return
