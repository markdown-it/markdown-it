# markdown-it

[![CI](https://github.com/markdown-it/markdown-it/actions/workflows/ci.yml/badge.svg)](https://github.com/markdown-it/markdown-it/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/markdown-it.svg?style=flat)](https://www.npmjs.org/package/markdown-it)
[![Coverage Status](https://coveralls.io/repos/markdown-it/markdown-it/badge.svg?branch=master&service=github)](https://coveralls.io/github/markdown-it/markdown-it?branch=master)

> Markdown parser done right. Fast and easy to extend.

__[Live demo](https://markdown-it.github.io)__

- Follows the [CommonMark spec](http://spec.commonmark.org/) + adds syntax extensions & sugar (URL autolinking, typographer).
- Configurable syntax! You can add new rules and even replace existing ones.
- High speed.
- Safe by default.
- Community-written __[plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin)__
  and [other packages](https://www.npmjs.org/browse/keyword/markdown-it) on npm.


> [!NOTE]
> If you are upgrading to v15, see the [migration guide](docs/migration/migration_v15.md).

### [Documentation >>](https://markdown-it.github.io/markdown-it/)


##### Install (node.js):

```bash
npm install markdown-it
```

For a quick look at `dist/` folder contents, see <https://unpkg.com/markdown-it/>.
For browser you can use unpkg.com, esm.sh or any other CDN, which mirror npm
registry.


##### Usage

```js
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()
const result = md.render('# markdown-it rulezz!')
```

[More usage examples](docs/usage.md).
