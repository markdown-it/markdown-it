1.2.0 / WIP
------------------

- Added `<ins>` rule.
- Added `<mark>` rule.
- Added presets support (default, commonmark, full).
- Exposed `.configure()` method to load rules & options config with one command.


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