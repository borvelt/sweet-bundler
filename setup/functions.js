const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const renameFile = promisify(fs.rename)
const __ = console.log

const webpackConfigFile = config =>
  path.join(__dirname, '..', 'webpack.config', `${config}.js`)

const isNull = input => input === null

const toKebabsCase = string =>
  string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_.]+/g, '-')
    .toLowerCase()

const isError = input => {
  if (!isNull(input)) {
    throw new Error(input)
  }
}

const unlink = path =>
  new Promise(resolve =>
    fs.unlink(path, error => {
      try {
        isError(error)
        resolve(true)
        __(`${path} removed.`)
      } catch (e) {
        resolve(false)
        __(`${path} not Found.`)
      }
    }),
  )

const toCamelCase = string => string.replace(/(-\w)/g, m => m[1].toUpperCase())

const deleteFolderRecursive = path => {
  var files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(file => {
      var curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

exports.__ = __
exports.isNull = isNull
exports.toKebabsCase = toKebabsCase
exports.isError = isError
exports.unlink = unlink
exports.webpackConfigFile = webpackConfigFile
exports.toCamelCase = toCamelCase
exports.writeFile = writeFile
exports.readFile = readFile
exports.renameFile = renameFile
exports.deleteFolderRecursive = deleteFolderRecursive
