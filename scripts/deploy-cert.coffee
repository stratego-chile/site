require 'json5/lib/register'

devcert = require 'devcert'
fs = require 'fs'
path = require 'path'

{ certDir, devDomainName } = require '../config.json5'

destinationFolder = path.join __dirname, '..', certDir

if not fs.existsSync destinationFolder
  fs.mkdirSync destinationFolder

domains = devDomainName

devcert
  .certificateFor domains, { getCaPath: true }
  .then ({ key, cert, caPath }) ->
    fs.writeFileSync path.join(destinationFolder, 'devcert.key'),
      key
    fs.writeFileSync path.join(destinationFolder, 'devcert.cert'), cert
    fs.writeFileSync path.join(destinationFolder, '.capath'),
      caPath
    return
  .catch console.error
