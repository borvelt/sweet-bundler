const path = require('path')
const installPackage = require('./install-package')
const {
  __,
  cleanPackageName,
  toCamelCase,
  unlink,
  writeFile,
  readFile,
  renameFile,
  generateQuestions,
  deleteFolderRecursive,
} = require('./functions')

//==============================================================================
const packageJSON = path.join(__dirname, '..', 'package.json')
const licenseFile = path.join(__dirname, '..', 'LICENSE')
const readMeFile = path.join(__dirname, '..', 'README.md')
const webpack = {
  dev: path.join(__dirname, '..', 'webpack.config', 'dev.js'),
  dist: path.join(__dirname, '..', 'webpack.config', 'dist.js'),
  web: path.join(__dirname, '..', 'webpack.config', 'web.js'),
}
const Questions = {
  Author: {
    name: 'What is your project Author Name? ',
    email: [
      'What is your project Author Email address? ',
      { func: 'questionEMail' },
    ],
  },
  Project: {
    name: [
      'Please Input your Project Name: ',
      {
        validation: {
          limit: /^[a-z0-9._-]+$/,
          limitMessage:
            'Sorry, $<lastInput> is not valid project name, It should contain letters and numbers.',
        },
      },
    ],
    description: 'And brief description: ',
    repository: 'What is your project repository? ',
    keywords: 'Set some keywords for your project (separate with ,): ',
  },
}
//==============================================================================
installPackage([
  'readline-sync',
  'object-maker',
  'lodash.flattendeep',
  'lodash.merge',
])
  .then(({ readlineSync, objectMaker, lodashFlattendeep, lodashMerge }) => {
    let ans = generateQuestions({ readlineSync, objectMaker }, Questions)
    const info = lodashFlattendeep(ans).reduce((acc, cur) =>
      lodashMerge(acc, cur),
    )
    //***************************************************************
    __('Start Cleaning Project...')
    Promise.all([
      unlink(licenseFile),
      unlink(readMeFile),
      unlink(packageJSON),
      unlink(webpack.dev),
      unlink(webpack.dist),
      unlink(webpack.web),
    ]).then(
      () => {
        __('Cleaning Done.')
        __('Start Creating Configuration Files.')
        const createReadMe = writeFile(
          readMeFile,
          `# ${info.Project.name}

_${info.Project.description}_

*Write your own project README*`,
        )
          .then(() => {
            __('Template ReadME file created...')
          })
          .catch(error => __(error.toString()))

        const createLicense = readFile(path.join(__dirname, 'LICENSE.dist'))
          .then(success => {
            const newContent = success
              .toString()
              .replace('{%year%}', new Date().getFullYear())
              .replace('{%author.email%}', info.Author.email)
            writeFile(licenseFile, newContent)
              .then(() => __('LICENSE file configured...'))
              .catch(error => __(error.toString()))
          })
          .catch(error => __(error.toString()))

        const createWebpackDev = readFile(path.join(__dirname, 'dev.js.dist'))
          .then(success => {
            const newContent = success
              .toString()
              .replace('{%project.name%}', info.Project.name)
            writeFile(webpack.dev, newContent)
              .then(() => __('webpack dev file configured...'))
              .catch(error => __(error.toString()))
          })
          .catch(error => __(error.toString()))

        const createWebpackDist = readFile(path.join(__dirname, 'dist.js.dist'))
          .then(content => {
            const newContent = content
              .toString()
              .replace(
                /{%project.libraryName%}/g,
                toCamelCase(cleanPackageName(info.Project.name)),
              )
            writeFile(webpack.dist, newContent)
              .then(() => __('webpack dist file configured...'))
              .catch(error => __(error.toString()))
          })
          .catch(error => __(error.toString()))
        const createWebpackWeb = readFile(path.join(__dirname, 'web.js.dist'))
          .then(content => {
            const newContent = content
              .toString()
              .replace('{%project.name%}', info.Project.name)
            writeFile(webpack.web, newContent)
              .then(() => __('webpack web file configured...'))
              .catch(error => __(error.toString()))
          })
          .catch(error => __(error.toString()))
        const createPackageJSON = readFile(
          path.join(__dirname, 'package.json.dist'),
        )
          .then(content => {
            info.Project.keywords = info.Project.keywords
              .split(',')
              .filter(k => k.length > 0)
              .map(k => `"${k.trim()}"`)
              .join(',')
            const newContent = content
              .toString()
              .replace('{%project.name%}', info.Project.name)
              .replace('{%project.description%}', info.Project.description)
              .replace('{%project.repository%}', info.Project.repository)
              .replace('{%project.keywords%}', info.Project.keywords)
              .replace('{%author.name%}', info.Author.name)
              .replace('{%author.email%}', info.Author.email)
            writeFile(packageJSON, newContent)
              .then(() => __('package.json file configured...'))
              .catch(error => __(error.toString()))
          })
          .catch(error => __(error.toString()))
        Promise.all([
          createLicense,
          createReadMe,
          createWebpackDev,
          createWebpackDist,
          createWebpackWeb,
          createPackageJSON,
        ])
          .then(() => {
            renameFile(
              path.join(__dirname, '..', 'setup'),
              path.join(__dirname, '..', '.setup'),
            )
              .then(() => __('renaming setup folder done.'))
              .catch(error => __(error.toString()))
          })
          .catch(error => __(error.toString()))
        __('Cleaning git repository...')
        deleteFolderRecursive(path.join(__dirname, '..', '.git'))
      },
      error => __(error),
    )
  })
  .catch(error => {
    __(error)
  })
//==============================================================================
