const fs = require('fs')
const { promisify } = require('util')

const writeFile = promisify(fs.writeFile)

const readFile = promisify(fs.readFile)

const renameFile = promisify(fs.rename)

const __ = console.log

const isNull = x => x === null

const isObject = x => typeof x === typeof null

const toKebabsCase = string =>
  string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_.]+/g, '-')
    .toLowerCase()

const isError = x => {
  if (!isNull(x)) {
    throw new Error(x)
  }
}

const isString = x => typeof x === typeof ''

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

const cleanPackageName = string =>
  string
    .replace(/\./g, '-')
    .replace(/@/g, '-')
    .replace(/\//g, '-')
    .replace(/_/g, '-')

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

const generateQuestions = (libs, questions, path = []) => {
  if (Array.isArray(questions) || isString(questions)) {
    let question = questions
    let exec = libs.readlineSync.question
    let validation = {}
    if (Array.isArray(questions)) {
      question = questions[0]
      if (isObject(questions[1])) {
        if (questions[1].func in libs.readlineSync) {
          exec = libs.readlineSync[questions[1].func]
        }
        if (isObject(questions[1].validation)) {
          validation = questions[1].validation
        }
      }
    }
    return libs.objectMaker.default(path.join('.'), exec(question, validation))
  }
  return Object.keys(questions).map(q => {
    path.push(q)
    const ans = generateQuestions(libs, questions[q], path)
    path.pop()
    return ans
  })
}

exports.__ = __
exports.isNull = isNull
exports.toKebabsCase = toKebabsCase
exports.isError = isError
exports.unlink = unlink
exports.toCamelCase = toCamelCase
exports.writeFile = writeFile
exports.readFile = readFile
exports.renameFile = renameFile
exports.deleteFolderRecursive = deleteFolderRecursive
exports.generateQuestions = generateQuestions
exports.cleanPackageName = cleanPackageName
exports.isObject = isObject
exports.isString = isString
