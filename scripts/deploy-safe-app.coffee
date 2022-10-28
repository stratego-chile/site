require 'json5/lib/register'

{ createServer: createHttpsServer } = require 'https'
next = require 'next'
fs = require 'fs'
path = require 'path'
chalk = require 'chalk'

{ certDir, devDomainName } = require '../config.json5'

dev = process.env.NODE_ENV != 'production'
app = next { dev }
handle = app.getRequestHandler()
PORT = process.env.PORT || 3000

if not fs.existsSync './certs/.capath'
  macOsCommand = chalk.greenBright 'sudo yarn cert'
  linuxCommand = chalk.greenBright 'yarn cert'

  console.error(
    chalk.red '\nError: Missing SSL certificates\n\n',
    'To fix this error, run the command below:\n',
    "→ MacOS: #{macOsCommand}\n",
    "→ Linux: #{linuxCommand}\n\n"
  )

  process.exit()

app
  .prepare()
  .then ->
    server = createHttpsServer(
      {
        key: fs.readFileSync(
          path.join(__dirname, '..', certDir, 'devcert.key')
        ),
        cert: fs.readFileSync(
          path.join(__dirname, '..', certDir, 'devcert.cert')
        )
      },
      (req, res) -> handle(req, res)
    )

    return server.listen PORT, (err) ->
      if err
        throw err
      console.log "> Ready on https://#{devDomainName}:3000"
  .catch (err) ->
    console.error err
