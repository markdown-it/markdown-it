Migration to v5
===============

v5 has the same external API as v4, only internals were changed. Some external
plugins may need update (all plugins from `markdown-it` github organization are
up to date).


## For users

External API did not change.

- If you use `markdown-it` with plugins, make sure to update them.


## For plugin developers

- added `stateBlock.sCount` to calculate indents instead of `stateBlock.tShift`, it only differs if tabs are present:
  - `stateBlock.tShift` is used to calculate a number of *characters* (tab is 1 character)
  - `stateBlock.sCount` is used to calculate the block *offset* (tab is 1-4 characters depending on position)
- added `stateInline.ruler2` and `stateInline.delimiters` needed to parse emphasis-like markup better
  - emphasis-like tags now can't be skipped with `stateInline.skipToken`, they treat a sequence of markers (e.g. `***`) as a token instead
  - `stateInline.delimiters` is linked with `stateInline.tokens`, so truncating/splicing `stateInline.tokens` may break things
