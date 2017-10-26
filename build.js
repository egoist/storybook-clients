const path = require('path')
const majo = require('majo')
const konan = require('konan')
const parsePackageName = require('parse-package-name')
const Pkg = require('update-pkg')
const fs = require('fs-extra')

const type = process.argv[2] || 'react'

const root = `node_modules/@storybook/${type}`
const source = `node_modules/@storybook/${type}/dist/client`

;(async () => {
  let deps

  await majo().source(`**/*.{vue,js}`, { baseDir: source })
  .use(ctx => {
    deps = Object.keys(ctx.files).map(filename => {
      if (filename.endsWith('.vue')) return []
      const { strings } = konan(ctx.fileContents(filename))
      return strings
        .filter(v => !v.startsWith('.'))
        .map(v => parsePackageName(v).name)
    }).reduce((res, next) => res.concat(next), [])

    deps = [...new Set(deps)]
  })
  .dest(`packages/storybook-${type}/lib`)

  const _pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json')))

  const pkg = new Pkg(path.resolve(`packages/storybook-${type}`))
  pkg.set('dependencies', deps.reduce((res, name) => {
    res[name] = _pkg.dependencies[name]
    return res
  }, {}))
  pkg.set('files', ['lib'])
  pkg.set('main', 'lib/index.js')
  pkg.set('name', `storybook-${type}`)
  await pkg.save()
})()
