import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import markdownit from '../../src/index.ts'

describe('code spans', function () {
  // https://github.com/markdown-it/markdown-it/issues/1217
  // CommonMark 4.8 drops leading spaces or tabs from each line of a
  // paragraph before inline parsing; a code span that wraps must not
  // keep that indentation in its content.
  it('strips indentation after a wrapped line break', function () {
    const md = markdownit('commonmark')
    assert.strictEqual(
      md.render('Use `git commit\n   --amend` here\n'),
      '<p>Use <code>git commit --amend</code> here</p>\n'
    )
    assert.strictEqual(
      md.render('Use `git commit\n\t--amend` here\n'),
      '<p>Use <code>git commit --amend</code> here</p>\n'
    )
  })
})
