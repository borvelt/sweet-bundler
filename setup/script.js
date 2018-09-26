const path = require('path')
const installPackage = require('./install-package')
const {
  __,
  webpackConfigFile,
  toKebabsCase,
  toCamelCase,
  unlink,
  writeFile,
  readFile,
  renameFile,
  deleteFolderRecursive,
} = require('./functions')

//==============================================================================
const packageJSON = path.join(__dirname, '..', 'package.json')
const licenseFile = path.join(__dirname, '..', 'LICENSE')
const readMeFile = path.join(__dirname, '..', 'README.md')
const webpack = {
  dev: webpackConfigFile('dev'),
  dist: webpackConfigFile('dist'),
  web: webpackConfigFile('web'),
}
const info = {
  Author: {
    name: '',
    email: '',
  },
  Project: {
    name: '',
    description: '',
    repository: '',
    license: '',
  },
}
const Questions = {
  Author: {
    name: 'What is your project Author Name? ',
    email: 'What is your project Author Email address? ',
  },
  Project: {
    name: 'Please Input your Project Name: ',
    description: 'And brief description: ',
    repository: 'What is your project repository? ',
    license: 'Under lisence (ISC): ',
  },
}
//==============================================================================
installPackage(['readline-sync'])
  .then(({ readlineSync }) => {
    info.Author.name = readlineSync.question(Questions.Author.name)
    info.Author.email = readlineSync.questionEMail(Questions.Author.email)
    info.Project.name = readlineSync.question(Questions.Project.name, {
      limit: /^[a-z0-9\._ \-]+$/,
      limitMessage:
        'Sorry, $<lastInput> is not valid project name, It should contain letters and numbers.',
    })
    info.Project.description = readlineSync.question(
      Questions.Project.description,
    )
    info.Project.repository = readlineSync.question(
      Questions.Project.repository,
    )
    info.Project.license = readlineSync.question(Questions.Project.license, {
      defaultInput: 'ISC',
    })
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
                toCamelCase(toKebabsCase(info.Project.name)),
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
            const newContent = content
              .toString()
              .replace('{%project.name%}', toKebabsCase(info.Project.name))
              .replace('{%project.description%}', info.Project.description)
              .replace('{%project.repository%}', info.Project.repository)
              .replace('{%project.license%}', info.Project.license)
              .replace('{%author.name%}', info.Author.name)
              .replace('{%author.email%}', info.Author.email)
            writeFile(packageJSON, newContent)
              .then(() => __('package.json file configured...'))
              .catch(error => __(error.toString()))
          })
          .catch(error => __(error.toString()))
        Promise.all([
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
        __('Cleaning gir repository...')
        deleteFolderRecursive(path.join(__dirname, '..', '.git'))
      },
      error => __(error),
    )
  })
  .catch(error => {
    __(error.stderr)
  })
//==============================================================================
