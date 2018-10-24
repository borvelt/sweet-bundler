const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { __, toCamelCase, cleanPackageName } = require('./functions')

module.exports = async packagesNames => {
  const packages = {}
  for (let packageName of packagesNames) {
    console.log('packageName', packageName)
    try {
      packages[
        toCamelCase(cleanPackageName(packageName))
      ] = require(packageName)
    } catch (e) {
      __('Installing required packages... [take a while please be patient]')
      __(`Installing ${packageName}...`)
      await exec(`npm install ${packageName} --no-save`)
      __(`${packageName} installed successfully`)
      packages[
        toCamelCase(cleanPackageName(packageName))
      ] = require(packageName)
    }
  }
  return packages
}
