import assert from 'node:assert'
import { describe, it } from 'node:test'
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'

if (!isMainThread) {
  const { default: md } = await import('../../src/index.ts')
  parentPort.postMessage(md(workerData.opts).render(workerData.str))
  process.exit(0)
}

function test_pattern (str, mdOpts) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(fileURLToPath(import.meta.url), {
      workerData: { str, opts: mdOpts }
    })
    const timer = setTimeout(() => {
      worker.terminate()
      reject(new Error('Terminated (timeout exceeded)'))
    }, 5000)
    worker.on('message', val => { clearTimeout(timer); resolve(val) })
    worker.on('error', err => { clearTimeout(timer); reject(err) })
  })
}

describe('Pathological sequences speed', () => {
  it('Integrity check', async () => {
    assert.strictEqual(
      await test_pattern('foo'),
      '<p>foo</p>\n'
    )
  })

  // Ported from cmark, https://github.com/commonmark/cmark/blob/master/test/pathological_tests.py
  describe('Cmark', () => {
    it('nested inlines', async () => {
      await test_pattern('*'.repeat(60000) + 'a' + '*'.repeat(60000))
    })

    it('nested strong emph', async () => {
      await test_pattern('*a **a '.repeat(5000) + 'b' + ' a** a*'.repeat(5000))
    })

    it('many emph closers with no openers', async () => {
      await test_pattern('a_ '.repeat(30000))
    })

    it('many emph openers with no closers', async () => {
      await test_pattern('_a '.repeat(30000))
    })

    it('many link closers with no openers', async () => {
      await test_pattern('a]'.repeat(10000))
    })

    it('many link openers with no closers', async () => {
      await test_pattern('[a'.repeat(10000))
    })

    it('mismatched openers and closers', async () => {
      await test_pattern('*a_ '.repeat(50000))
    })

    it('commonmark/cmark#389', async () => {
      await test_pattern('*a '.repeat(20000) + '_a*_ '.repeat(20000))
    })

    it('openers and closers multiple of 3', async () => {
      await test_pattern('a**b' + ('c* '.repeat(50000)))
    })

    it('link openers and emph closers', async () => {
      await test_pattern('[ a_'.repeat(10000))
    })

    it('pattern [ (]( repeated', async () => {
      await test_pattern('[ (]('.repeat(40000))
    })

    it('pattern ![[]() repeated', async () => {
      await test_pattern('![[]()'.repeat(20000))
    })

    it('nested brackets', async () => {
      await test_pattern('['.repeat(20000) + 'a' + ']'.repeat(20000))
    })

    it('nested block quotes', async () => {
      await test_pattern('> '.repeat(50000) + 'a')
    })

    it('deeply nested lists', async () => {
      await test_pattern(Array(1000).fill(0).map(function (_, x) { return '  '.repeat(x) + '* a\n' }).join(''))
    })

    it('U+0000 in input', async () => {
      await test_pattern('abc\u0000de\u0000'.repeat(100000))
    })

    it('backticks', async () => {
      await test_pattern(Array(3000).fill(0).map(function (_, x) { return 'e' + '`'.repeat(x) }).join(''))
    })

    it('unclosed links A', async () => {
      await test_pattern('[a](<b'.repeat(30000))
    })

    it('unclosed links B', async () => {
      await test_pattern('[a](b'.repeat(30000))
    })

    it('unclosed <!--', async () => {
      await test_pattern('</' + '<!--'.repeat(100000))
    })

    it('empty lines in deeply nested lists', async () => {
      await test_pattern('- '.repeat(30000) + 'x' + '\n'.repeat(30000))
    })

    it('empty lines in deeply nested lists in blockquote', async () => {
      await test_pattern('> ' + '- '.repeat(30000) + 'x\n' + '>\n'.repeat(30000))
    })

    it('emph in deep blockquote', async () => {
      await test_pattern('>'.repeat(100000) + 'a*'.repeat(100000))
    })
  })

  describe('Markdown-it', () => {
    it('emphasis **_* pattern', async () => {
      await test_pattern('**_* '.repeat(50000))
    })

    it('backtick ``\\``\\`` pattern', async () => {
      await test_pattern('``\\'.repeat(50000))
    })

    it('autolinks <<<<...<<> pattern', async () => {
      await test_pattern('<'.repeat(400000) + '>')
    })

    it('hardbreak whitespaces pattern', async () => {
      await test_pattern('x' + ' '.repeat(150000) + 'x  \nx')
    })

    it('linkify-it wrapper trailing asterisks pattern', async () => {
      await test_pattern(
        'https://test.com?' + '*'.repeat(70000) + 'a',
        { linkify: true }
      )
    })

    it('a lot of smartquotes', async () => {
      await test_pattern('"'.repeat(160000), { typographer: true })
    })
  })
})
