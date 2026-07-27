---
title: Benchmark
category: Documents
---

# Benchmark

Here is the result of readme parse at MB Pro Retina 2013 (2.4 GHz):

```bash
npm run benchmark-deps
benchmark/benchmark.mjs readme

Selected samples: (1 of 28)
 > README

Sample: README.md (7774 bytes)
 > commonmark-reference x 1,222 ops/sec ±0.96% (97 runs sampled)
 > current x 743 ops/sec ±0.84% (97 runs sampled)
 > current-commonmark x 1,568 ops/sec ±0.84% (98 runs sampled)
 > marked x 1,587 ops/sec ±4.31% (93 runs sampled)
```

> [!NOTE]
>
> CommonMark version runs with [simplified link normalizers](https://github.com/markdown-it/markdown-it/blob/master/benchmark/implementations/current-commonmark/index.mjs)
> for more "honest" compare. Difference is ≈1.5×.

As you can see, `markdown-it` doesn't pay with speed for its flexibility.
Slowdown of "full" version caused by additional features not available in
other implementations.
