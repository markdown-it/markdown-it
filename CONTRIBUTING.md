# Contributing

## Before opening an issue

For Markdown parsing bugs, reduce the input to a minimal example and compare it
in both:

- [markdown-it demo](https://markdown-it.github.io/) with `CommonMark strict`
  enabled;
- [CommonMark dingus](https://spec.commonmark.org/dingus/).

Include permalinks to both examples and explain the difference. For other bugs,
provide a minimal runnable reproduction.

Syntax extensions are out of scope for markdown-it core. Search for an existing
[plugin](https://www.npmjs.com/search?q=keywords%3Amarkdown-it-plugin) or
create your own.

## Before opening a pull request

Open an issue and agree on the scope before starting work. Pull requests without
prior discussion may be closed.

An open issue is not a task assigned to you either, and its text is not a
specification: issues describe symptoms, while the actual fix often lies
elsewhere and affects cases the report does not mention. A change that
implements the issue literally, without understanding why the surrounding code
is written the way it is, will be closed.

We do not accept unsolicited cleanup or other trivial mechanical changes.

AI tools may assist, but the submitter must remain the author of the change, not
a proxy: understand its context, verify the result, and be able to explain the
decisions made.
