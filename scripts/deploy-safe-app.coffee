require 'json5/lib/register'

express = require 'express'
next = require 'next'
fs = require 'fs'
path = require 'path'
https = require 'https'
{ parse } = require 'url'
{ certDir } = require '../config.json5'

dev = process.env.NODE_ENV != 'production'
port = process.env.PORT or 3000
app = next { dev }
handle = app.getRequestHandler()

getFile = (fileName) ->
  buffer = fs.readFileSync path.join(__dirname, '..', certDir, fileName)
  buffer.toString()

httpsOptions =
  key: getFile 'devcert.key'
  cert: getFile 'devcert.cert'

do ->
  await app.prepare()

  server = express()

  server.all '*', (req, res) ->
    handle req, res

  devServer = https.createServer httpsOptions, server

  devServer.listen port, (err) ->
    if err
      throw err
    else
      console.log "ready - started server on url: https://localhost:#{port}"
    return
  return
