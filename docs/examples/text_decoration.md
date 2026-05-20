# Adding New Text Decorators

A step-by-step example of adding a new text decoration style via **inline rules**.

## Goal

Text surrounded by double-carets (e.g. `^^like this^^`) will be given the `<small>` tag in the output HTML.

## Inline Rules

Markdown-It processes inline sequences of text in **two** passes, each with their own list of rules:

- Tokenization
- Post Processing

The Tokenization phase is responsible for **identifying** inline markers, like `**` (bold/strong text) or `^^` (our new "small text" delimiter).
It is unaware of marker nesting, or whether markers form matched pairs.

The Post Processing phase handles **matching** pairs of tokens.
This phase holds a lot of hidden complexity.
Base Markdown supports a single asterisk for italics/emphasis, double asterisk for bold/strong text, and triple asterisk for both styles combined.
Even if a new plugin isn't implementing such a nuanced delimiter, an awareness of the complexity helps the developer inject code in the proper locations.

> [!IMPORTANT]
> Every matched-pair inline marker should provide **both** a tokenization and post-processing rule.

## Entry Point

The new rule will be named `smalltext`.
The plugin entry point will look like the following:

```typescript
export default function smalltext_plugin(md: MarkdownIt) {
  md.inline.ruler.after("emphasis", "smalltext", smalltext_tokenize)
  md.inline.ruler2.after("emphasis", "smalltext", smalltext_postProcess)
}

function smalltext_tokenize(state: StateInline, silent: boolean) {
  return false
}

function smalltext_postProcess(state: StateInline) {
  return false
}
```

Note the use of `ruler2` to register the post-processing step.
This pattern is unique to matched-pair inline marker rules:
it isn't seen anywhere else in the library (e.g. for block or core rules).

## Tokenization

All that needs to happen here is identifying the string `^^`,
adding a Token to `state.tokens`,
and adding a Delimiter to `state.delimiters`.

> [!TIP]
> A `delimiter` points to a token and provides extra information:
>
> - whether that token is a valid choice for opening or closing styled text
> - a pointer to the matching end token
> - information about how many characters the token is (useful for disambiguating italics and bold)
>
> Most of this information is used in the `balance_pairs` post-processing rule.
> So long as the `delimiters` array is constructed well in the tokenization phase,
> the developer doesn't need to worry about the complexity within `balance_pairs`.

```typescript
function smalltext_tokenize(state: StateInline, silent: boolean) {
  const start = state.pos
  const marker = state.src.charCodeAt(start)

  if (silent) {
    return false
  }

  if (marker !== 0x5e /* ^ */) {
    return false
  }

  const scanned = state.scanDelims(state.pos, true)
  let len = scanned.length
  const ch = String.fromCharCode(marker)

  if (len < 2) {
    return false
  }

  let token

  if (len % 2) {
    token = state.push("text", "", 0)
    token.content = ch
    len--
  }

  for (let i = 0; i < len; i += 2) {
    token = state.push("text", "", 0)
    token.content = ch + ch

    state.delimiters.push({
      marker,
      length: 0, // disable "rule of 3" length checks meant for emphasis
      token: state.tokens.length - 1,
      end: -1, // This pointer is filled in by the core balance_pairs post-processing rule
      open: scanned.can_open,
      close: scanned.can_close,
      jump: 0
    })
  }

  state.pos += scanned.length

  return true
}
```

Note the `scanDelims` call.
It handles determining whether a given sequence of characters (`^` in this case) can start or end an inline styling sequence.

A single caret will have no meaning in this plugin,
so much of the complexity in this rule is removed:

- For an odd-numbered length of carets, the first caret is added as plain text
- The `length` property of the delimiters is always set to zero, skipping unnecessary logic in the `balance_pairs` rule

Note also that **no matching was attempted in the tokenization phase**.
The `end` property is always set to `-1`.
The `balance_pairs` rule does all the heavy lifting later on, behind the scenes.

## Post Processing

### Grunt Work

The main logic of this rule will go into a utility function, called `postProcess`.
The top-level rule function gets a confusing bit of grunt work:

```typescript
function smalltext_postProcess(state: StateInline) {
  const tokens_meta = state.tokens_meta
  const max = state.tokens_meta.length

  postProcess(state, state.delimiters)

  for (let curr = 0; curr < max; curr++) {
    if (tokens_meta[curr]?.delimiters) {
      postProcess(state, tokens_meta[curr]?.delimiters || [])
    }
  }

  // post-process return value is unused
  return false
}

function postProcess(state: StateInline, delimiters: StateInline.Delimiter[]) {
  return
}
```

> [!TIP]
> What is `tokens_meta`?
>
> Every time a token with a positive `nesting` value is pushed to the inline state's tokens (i.e. an opening tag),
> the inline state does the following:
>
> - throws the current `delimiters` array onto a stack
> - creates a new, empty `delimiters` array, exposing it as `state.delimiters`
> - gives the open-tag token a `token_meta` object with the new `delimiters` array
> - *also* stores the `token_meta` object in `state.tokens_meta`
>
> The intrepid reader will notice that in the tokenization rule, **the created delimiters were likely being pushed to different arrays** throughout execution.
>
> Now, in post-processing, each `delimiters` array will only hold delimiters at matching nesting levels.
>
> If the details of this implementation are of interest, check out [the source](https://github.com/markdown-it/markdown-it/blob/0fe7ccb4b7f30236fb05f623be6924961d296d3d/lib/rules_inline/state_inline.mjs#L60).

### Main Logic

As previously mentioned, `balance_pairs` took care of building out and cleaning up the delimiter data.
This post-processing rule will mainly read the data and add tokens as appropriate:

```typescript
function postProcess(state: StateInline, delimiters: StateInline.Delimiter[]) {
  let token
  const loneMarkers = []
  const max = delimiters.length

  for (let i = 0; i < max; i++) {
    const startDelim = delimiters[i]

    if (startDelim.marker !== 0x5e /* ^ */) {
      continue
    }

    // balance_pairs wrote the appropriate `end` pointer value here.
    // If it's still -1, there was a balancing problem,
    // and the delimiter can be ignored.
    if (startDelim.end === -1) {
      continue
    }

    const endDelim = delimiters[startDelim.end]

    token = state.tokens[startDelim.token]
    token.type = "smalltext_open"
    token.tag = "small"
    token.nesting = 1
    token.markup = "^^"
    token.content = ""

    token = state.tokens[endDelim.token]
    token.type = "smalltext_close"
    token.tag = "small"
    token.nesting = -1
    token.markup = "^^"
    token.content = ""

    if (
      state.tokens[endDelim.token - 1].type === "text" &&
      state.tokens[endDelim.token - 1].content === "^"
    ) {
      loneMarkers.push(endDelim.token - 1)
    }
  }

  // If a marker sequence has an odd number of characters, it is split
  // like this: `^^^^^` -> `^` + `^^` + `^^`, leaving one marker at the
  // start of the sequence.
  //
  // So, we have to move all those markers after subsequent closing tags.
  //
  while (loneMarkers.length) {
    const i = loneMarkers.pop() || 0
    let j = i + 1

    while (j < state.tokens.length && state.tokens[j].type === "smalltext_close") {
      j++
    }

    j--

    if (i !== j) {
      token = state.tokens[j]
      state.tokens[j] = state.tokens[i]
      state.tokens[i] = token
    }
  }
}
```

The lone-marker handling is a point of interest.
While a five- or seven-character sequence of carets is unlikely,
it could still be matched with a different string of carets elsewhere in the line of text.
Due to how tokenization runs,
both the opening **and** closing sequences are split leaving the lone caret at the start:

```
^^^^^^^hey this text would actually be small^^^^^^^

gets parsed somewhat like this:

^ ^^ ^^ ^^ hey this text would actually be small ^ ^^ ^^ ^^
| |     |                                        | |  |
| |     opening tag                              | |  open and close
| open and close                                 | balanced closing tag
lone caret                                       lone caret
```

Because the very first caret in the opening sequence is *not* placed within the `<small>` tags,
neither should the first caret in the closing sequence.
The end of the post-processing rule handles that edge case.

## Conclusion

That's everything!

This rule is almost a verbatim copy of the [strikethrough rule](https://github.com/markdown-it/markdown-it/blob/0fe7ccb4b7f30236fb05f623be6924961d296d3d/lib/rules_inline/strikethrough.mjs) in the core library.
If a full-on emphasis-style rule is desired, the [source code](https://github.com/markdown-it/markdown-it/blob/0fe7ccb4b7f30236fb05f623be6924961d296d3d/lib/rules_inline/emphasis.mjs) isn't much longer,
thanks in large part to the heavy lifting that [balance_pairs](https://github.com/markdown-it/markdown-it/blob/0fe7ccb4b7f30236fb05f623be6924961d296d3d/lib/rules_inline/balance_pairs.mjs) accomplishes.

> [!CAUTION]
>
> If the plugin being developed is a "standalone" inline element without a open/close pair
> (think about links `[text](url)` or images `![alt text](source "title")`),
> **the post-processing infrastructure can be safely ignored**!
> Markdown parsing is complicated enough.
> Please don't introduce any unnecessary complexity!

