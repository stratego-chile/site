require 'json5/lib/register'

{ createServer } = require 'https'
{ parse } = require 'url'
next = require 'next'
fs = require 'fs'
path = require 'path'
{ certDir } = require '../config.json5'

port = 3000
dev = process.env.NODE_ENV != 'production'
app = next { dev }
handle = app.getRequestHandler()

httpsOptions = {
	key: fs.readFileSync(
		path.join(__dirname, '..', certDir, 'devcert.key')
	)
	cert: fs.readFileSync(
		path.join(__dirname, '..', certDir, 'devcert.cert')
	)
}

app
	.prepare()
	.then ->
		return createServer httpsOptions, (req, res) ->
			parsedUrl = parse req.url, true
			handle req, res, parsedUrl
			return
		.listen port,
			(err) ->
				if err
					throw err
				console.log("ready - started server on url: https://localhost:#{port}")
