# Sweet Bundler

_Make webpack bundler and babel sweety lovey_

## Getting Started
```bash
$ git clone https://github.com/borvelt/sweet-bundler.git [project-name]
```
## Setup
Run Setup script:
```bash
$ cd [project-name]
$ node setup/script.js
```
Setup script will ask you some questions about your project and then generate required configurations.

After setup successfully done you can use it and then install node modules
```bash 
$ npm install
```
Here we have three type of webpack confgurations *dev*, *dist*, *web*
- dev

  webpack configurations for development mode, it have hot module reloading.

- web

  This configuration is in production mode. it has caching and source maps.

- dist

  dist configuration provided to make a javacsript library, you can publish in npmjs.

See `scripts` in `package.json` to run commands.

## Typescript
You can write typescript codes along your javascript codes and then pack and run them. Dont worry about typescript linting, it has been configured.

## Prettier
Prittier CLI is a tool to prettify all of your codes but it some linters rules (like eslint or tslint) has conflict with prettier rules. I resolved this problem and you can just focus on your codes.

## Test
Write your test in `__tests__` subdirectory in src.
Test cases will check with `jest`

``` bash
$ npm test
```
## Licence
ISC
