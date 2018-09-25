const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { __, toCamelCase } = require('./functions')

module.exports = async packagesNames => {
  const packages = {}
  for (let packageName of packagesNames) {
    try {
      packages[toCamelCase(packageName)] = require(packageName)
    } catch (e) {
      __('Installing required packages... [take a while please be patient]')
      __(`Installing ${packageName}...`)
      await exec(`npm install ${packageName}`)
      __(`${packageName} installed successfully`)
      packages[toCamelCase(packageName)] = require(packageName)
    }
  }
  return packages
}
