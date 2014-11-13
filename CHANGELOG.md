1.4.1 / 2014-11-13
------------------

- Moved links decode/encode from renderer to parser.
- Added missed validator call for scoped urls in links.
- Handle exceptions in `decoreURI` (regression).


1.4.0 / 2014-11-09
------------------

- Added `core` chain, to better organize code and improve pluggability.
- Added `renderInline()` and `parseInline()` methods.
- Added abbreviations support.
- Fixed problem with tables, having single column.
- Fixed rendered rules rewrite for inline tags.
- Changed internal api (ruler, inline, block classes).
- Removed typographer chain (rules moved to `core`).
- Removed all typographer options. Quote chars defs moved to `options.quotes`.


1.3.0 / 2014-10-29
------------------

- Fixed problem with minified & mangled browser version.
- Changed ruler API.


1.2.2 / 2014-10-29
------------------

- Fixed regression from 1.2.1 for data without tailing `\n`.
- Fixed blockquote line ranges.
- Added subscript/superscript support.
- Updated CommonMark spec and updated implementation.
- Other minor changes.


1.2.1 / 2014-10-28
------------------

- Fixed speed degradation when linkifier enabled.
- Added coverage reports.
- Added debug view to demo (show internal representation)
- Other minor optimizations and cleanup.


1.2.0 / 2014-10-26
------------------

- Added `<ins>` rule.
- Added `<mark>` rule.
- Added presets support (default, commonmark, full).
- Exposed `.configure()` method to load rules & options config with one command.
- Moved html escaping to renderer.


1.1.2 / 2014-10-23
------------------

- Fixed speed regression.
- Use base64 encoding for permalinks (workaround for github).
- Improved default link validator.
- Updated cache storage logic for inline parser.


1.1.1 / 2014-10-22
------------------

- Fixed `Ruler.after()` method.
- Fixed linkification.
- Simplified loose/tight rendering.
- Refactored inline parser. No close coupled code in rules anymore.


1.1.0 / 2014-10-20
------------------

- Code refactoring, bugfixes, API update.
- Added source lines info to block nodes.


1.0.0 / 2014-10-16
------------------

- First release.