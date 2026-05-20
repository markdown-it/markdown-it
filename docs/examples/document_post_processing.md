# Document-Wide Post Processing

An overview of how to tweak and augment the token stream just before rendering.

## Goal

The output document will be surrounded by `<section>` tags. Second-level headings (`h2`) will also trigger section breaks (i.e. `</section><section>`) immediately preceding the heading.

## Core Rules

The top-level rule pipeline turning raw Markdown into a token array consists of **core rules**.
The *block* and *inline* rule pipelines are run within a single "wrapper" rule in the core pipeline.
The wrapper rules appear relatively early in the [core pipeline](https://github.com/markdown-it/markdown-it/blob/0fe7ccb4b7f30236fb05f623be6924961d296d3d/lib/parser_core.mjs#L19).

```javascript
const _rules = [
  ['normalize',      r_normalize],
  ['block',          r_block],
  ['inline',         r_inline],
  ['linkify',        r_linkify],
  ['replacements',   r_replacements],
  ['smartquotes',    r_smartquotes],
  ['text_join',      r_text_join]
]
```

Core rules typically do *not* scan through the source text or interpret Markdown syntax.
Rather, they usually modify or augment the token stream after an initial pass over the Markdown is complete.

> [!NOTE]
> The `normalize` rule is an exception.
> It modifies the raw markdown (`state.src`),
> *normalizing* (as the name implies) idiosyncrasies like platform-specific newlines and null characters.

Core rules can do much more,
but "post-processing" tasks are the most common use case.

## Entry Point

The new rule will be called `sectionize`.
The plugin entry point will look like the following:

```typescript
export default function sectionize_plugin(md: MarkdownIt) {
  md.core.ruler.push("sectionize", sectionize)
}

function sectionize(state: StateCore) {
  return
}
```

The new rule is pushed to the very end of the core pipeline.
While there are valid reasons to insert plugin rules elsewhere in the pipeline,
pushing to the end is a good default choice.

> [!IMPORTANT]
> When in doubt, always put plugin rules at the end of the pipeline.
> This strategy minimizes the potential of breaking other rules' assumptions about state.

In this case specifically, surrounding the document with `<section>` tags will **increase the nesting level** of every other token in the document.
Certain rules might iterate over the token stream and keep a running-total nesting level,
making assumptions about nesting level zero (for example).
Placing the new rule at the very end keeps it from affecting those other rules.

## Section Insertion Logic

Because we will be inserting tokens into the token array,
we will iterate *backwards* over the existing array so that our index pointer isn't affected by the insertions.

```typescript
function sectionize(state: StateCore) {
  const slugs: Record<string, boolean> = {}
  const toProcess: Array<{ slug: string; anchor: Token; target: Token }> = []

  // Iterate backwards since we're splicing elements into the array
  for (let i = state.tokens.length - 1; i >= 0; i--) {
    const token = state.tokens[i]

    if (token.type === "heading_open" && token.tag === "h2") {
      const { open, close } = getSectionPair(state)
      state.tokens.splice(i, 0, close, open)
    }
  }

  // ...The plugin isn't quite done yet
}

function getSectionPair(state: StateCore) {
  const open = new state.Token("section_open", "section", 1)
  open.block = true
  const close = new state.Token("section_close", "section", -1)
  close.block = true

  return { open, close }
}
```

At this point, the tokens array now has a `</section><section>` pair immediately preceding each `<h2>`.
However, the document itself is not yet wrapped in an overarching section.

There are two cases to consider:

- The document originally started with a `h2`, so it now starts with `</section>`
- The document did not start with a `h2`

Both cases are addressed with just a few lines of code:

```typescript
function sectionize(state: StateCore) {
  // ...iteration logic from above

  if (state.tokens[0].type === "section_close") {
    state.tokens.push(state.tokens.shift()!)
  } else {
    const { open, close } = getSectionPair(state)
    state.tokens.unshift(open)
    state.tokens.push(close)
  }
}
```

## Conclusion

That's right: simple augmentation tasks like sectionization are straightforward to implement with core rule plugins.
No traversal of `state.src` is required,
because this rule is running *after* all of the block and inline rule sets.

With a careful selection of rule positioning (defaulting to the end of the pipeline when in doubt),
post-processing rules are some of the simplest to write.
