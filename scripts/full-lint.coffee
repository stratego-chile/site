{
  packageManager: providedPackageManager,
  scripts,
} = require '../package.json'
childProcess = require 'child_process'

do ->
  try
    VERSION_SEPARATOR = '@'
    KNOWN_PKG_MANAGERS = [
      'npm'
      'yarn'
      'pnpm'
    ]
    DEFAULT_PKG_MANAGER = KNOWN_PKG_MANAGERS[0]

    packageManager =  do ->
      providedPackageManager = String providedPackageManager || ''
      if /^([a-z]*)(@\d+(\.\d+){2})?$/i.test providedPackageManager
        if providedPackageManager.includes(VERSION_SEPARATOR)
          providedPackageManager = providedPackageManager
            .split(VERSION_SEPARATOR)[0]
        if KNOWN_PKG_MANAGERS.includes providedPackageManager
          return providedPackageManager
      return DEFAULT_PKG_MANAGER

    execList = Object.keys(scripts)
      .filter((key) -> /^(lint:)([\w|-]*)$/i.test key)

    onExit = ($childProcess) ->
      new Promise (resolve, reject) ->
        $childProcess.once 'exit', (code) ->
          if code is 0
            resolve undefined
          else
            reject new Error 'Exit with error code: ' + code
        $childProcess.once 'error', (err) ->
          reject err

    for command in execList
      execution = childProcess.spawn packageManager,
        ['run', command], {
          stdio: [process.stdin, process.stdout, process.stderr]
        }
      await onExit execution
  catch
    process.exit 1
  return
