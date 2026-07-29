---
name: Bug report
about: Report a reproducible problem in markdown-it
title: ''
labels: ''
assignees: ''

---

Before opening this issue, reduce the problem to a minimal example.

For Markdown parsing bugs, compare the same input in:

- [markdown-it demo](https://markdown-it.github.io/) with `CommonMark strict`
  enabled;
- [CommonMark dingus](https://spec.commonmark.org/dingus/).

Both permalinks are required for parsing bugs. For other bugs, provide a minimal
runnable reproduction. Issues without a reproducible example may be closed.

Syntax extensions are not accepted in markdown-it core. Search for an existing
[plugin](https://www.npmjs.com/search?q=keywords%3Amarkdown-it-plugin) or
[create your own](https://github.com/markdown-it/markdown-it/blob/master/docs/development.md).

## Description

<!-- Briefly describe the problem. -->

## Reproduction

### markdown-it demo

<!-- Required for parsing bugs: paste the permalink. -->

### CommonMark dingus

<!-- Required for parsing bugs: paste the permalink. -->

### Other reproduction

<!-- For non-parsing bugs, paste minimal runnable code. -->

## Expected result

## Actual result

## Environment

<!-- markdown-it version, runtime and relevant options. -->
