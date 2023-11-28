#!/usr/bin/env node
/*eslint no-console:0*/

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const fs        = require('fs')
const util      = require('util')
const Benchmark = require('benchmark')
const ansi      = require('ansi')
const cursor    = ansi(process.stdout)

const IMPLS = []

for (const name of fs.readdirSync(new URL('./implementations', import.meta.url)).sort()) {
  const filepath = new URL(`./implementations/${name}/index.mjs`, import.meta.url)
  const code = (await import(filepath))

  IMPLS.push({
    name: name,
    code: code
  })
}

const SAMPLES = []

fs.readdirSync(new URL('./samples', import.meta.url)).sort().forEach(sample => {
  const filepath = new URL(`./samples/${sample}`, import.meta.url)

  const content = {}

  content.string = fs.readFileSync(filepath, 'utf8')

  const title = `(${content.string.length} bytes)`

  function onComplete () { cursor.write('\n') }

  const suite = new Benchmark.Suite(
    title,
    {
      onStart: () => { console.log('\nSample: %s %s', sample, title) },
      onComplete: onComplete
    }
  )

  IMPLS.forEach(function (impl) {
    suite.add(
      impl.name,
      {
        onCycle: function onCycle (event) {
          cursor.horizontalAbsolute()
          cursor.eraseLine()
          cursor.write(' > ' + event.target)
        },
        onComplete: onComplete,
        fn: function () { impl.code.run(content.string) }
      }
    )
  })

  SAMPLES.push({
    name: sample.split('.')[0],
    title: title,
    content: content,
    suite: suite
  })
})


function select (patterns) {
  const result = []

  if (!(patterns instanceof Array)) {
    patterns = [patterns]
  }

  function checkName (name) {
    return patterns.length === 0 || patterns.some(function (regexp) {
      return regexp.test(name)
    })
  }

  SAMPLES.forEach(function (sample) {
    if (checkName(sample.name)) {
      result.push(sample)
    }
  })

  return result
}


function run (files) {
  const selected = select(files)

  if (selected.length > 0) {
    console.log('Selected samples: (%d of %d)', selected.length, SAMPLES.length)
    selected.forEach(function (sample) {
      console.log(' > %s', sample.name)
    })
  } else {
    console.log('There isn\'t any sample matches any of these patterns: %s', util.inspect(files))
  }

  selected.forEach(function (sample) {
    sample.suite.run()
  })
}

run(process.argv.slice(2).map(source => new RegExp(source, 'i')))
