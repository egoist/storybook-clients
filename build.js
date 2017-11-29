const path = require('path')
const fs = require('fs-extra')
const Pkg = require('update-pkg')

;(async () => {
  const client = process.argv[2] || 'react'
  const root = `node_modules/@storybook/${client}`
  const clientRoot = path.join(root, 'dist/client')
  const clientTarget = path.join('packages', `storybook-${client}`, 'lib')
  await fs.copy(clientRoot, clientTarget)

  const rootPkg = new Pkg(root)
  const deps = Object.keys(rootPkg.data.dependencies).filter(name => {
    if (
      name.startsWith('babel-') ||
      name.includes('webpack') ||
      name.endsWith('-loader') ||
      name.startsWith('postcss-')
    ) return false

    const blacklist = new Set([
      'airbnb-js-shims',
      'autoprefixer',
      'chalk',
      'commander',
      'configstore',
      'express',
      'find-cache-dir',
      'global',
      'json-stringify-safe',
      'json5',
      'request',
      'uuid',
      'shelljs',
      'serve-favicon'
    ])

    return !blacklist.has(name)
  }).reduce((res, name) => {
    res[name] = rootPkg.data.dependencies[name]
    return res
  }, {})

  const reactDeps = {
    react: '^16.0.0',
    'react-dom': '^16.0.0'
  }

  if (client === 'vue') {
    Object.assign(deps, reactDeps)
  }

  const clientPkg = new Pkg(path.join('packages', `storybook-${client}`))
  clientPkg.set('dependencies', deps)
  if (client === 'react') {
    clientPkg.set('peerDependencies', reactDeps)
  }
  await clientPkg.save()
})()
