#!/usr/bin/env node

import shell from 'shelljs'
import { readFileSync, writeFileSync } from 'fs'

function escape (input) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    // .replaceAll("'", '&#039;');
}

shell.rm('-rf', 'demo')
shell.mkdir('demo')

shell.cp('support/demo_template/README.md', 'demo/')
shell.cp('support/demo_template/index.css', 'demo/')

// Read html template and inject escaped sample
const html = readFileSync('support/demo_template/index.html', 'utf8')
const sample = readFileSync('support/demo_template/sample.md', 'utf8')

const output = html.replace('<!--SAMPLE-->', escape(sample))
writeFileSync('demo/index.html', output)

shell.exec('node_modules/.bin/rollup -c support/demo_template/rollup.config.mjs')
