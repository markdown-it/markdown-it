'use strict';


const needle = require('needle');
const assert = require('assert');
const crypto = require('crypto');
const Worker = require('jest-worker').default;


async function test_pattern(str) {
  const worker = new Worker(require.resolve('./pathological_worker.js'), {
    numWorkers: 1,
    enableWorkerThreads: true
  });

  let result;

  try {
    result = await Promise.race([
      worker.render(str),

      new Promise(function (resolve, reject){
        setTimeout(() => { reject(new Error('Terminated (timeout exceeded)')); }, 3000);
      })
    ]);
  } catch (e) {
    throw e;
  } finally {
    await worker.end();
  }

  return result;
}


describe('Pathological sequences speed', () => {

  it('Integrity check', async () => {
    assert.strictEqual(
      await test_pattern('foo'),
      '<p>foo</p>\n'
    );
  });

  // Ported from cmark, https://github.com/commonmark/cmark/blob/master/test/pathological_tests.py
  describe('Cmark', () => {

    it('verify original source crc', async () => {
      /* eslint-disable  max-len */
      const src = await needle('get', 'https://raw.githubusercontent.com/commonmark/cmark/master/test/pathological_tests.py');
      const src_md5 = crypto.createHash('md5').update(src.body).digest('hex');

      assert.strictEqual(
        src_md5,
        require('./pathological.json').md5,
        'CRC or cmark pathological tests hanged. Verify and update pathological.json'
      );
    });

    it('nested strong emph', async () => {
      await test_pattern('*a **a '.repeat(5000) + 'b' + ' a** a*'.repeat(5000));
    });

    it('many emph closers with no openers', async () => {
      await test_pattern('a_ '.repeat(30000));
    });

    it('many emph openers with no closers', async () => {
      await test_pattern('_a '.repeat(30000));
    });

    it('many link closers with no openers', async () => {
      await test_pattern('a]'.repeat(10000));
    });

    it('many link openers with no closers', async () => {
      await test_pattern('[a'.repeat(10000));
    });

    it('mismatched openers and closers', async () => {
      await test_pattern('*a_ '.repeat(50000));
    });

    it('openers and closers multiple of 3', async () => {
      await test_pattern('a**b' + ('c* '.repeat(50000)));
    });

    it('link openers and emph closers', async () => {
      await test_pattern('[ a_'.repeat(10000));
    });

    it('pattern [ (]( repeated', async () => {
      await test_pattern('[ (]('.repeat(40000));
    });

    it('nested brackets', async () => {
      await test_pattern('['.repeat(20000) + 'a' + ']'.repeat(20000));
    });

    it('nested block quotes', async () => {
      await test_pattern('> '.repeat(50000) + 'a');
    });

    it('deeply nested lists', async () => {
      await test_pattern(Array(1000).fill(0).map(function (_, x) { return '  '.repeat(x) + '* a\n'; }).join(''));
    });

    it('backticks', async () => {
      await test_pattern(Array(3000).fill(0).map(function (_, x) { return 'e' + '`'.repeat(x); }).join(''));
    });

    it('unclosed links A', async () => {
      await test_pattern('[a](<b'.repeat(30000));
    });

    it('unclosed links B', async () => {
      await test_pattern('[a](b'.repeat(30000));
    });
  });

  describe('Markdown-it', () => {
    it('emphasis **_* pattern', async () => {
      await test_pattern('**_* '.repeat(50000));
    });

    it('backtick ``\\``\\`` pattern', async () => {
      await test_pattern('``\\'.repeat(50000));
    });

    it('autolinks <<<<...<<> pattern', async () => {
      await test_pattern('<'.repeat(400000) + '>');
    });
  });
});
