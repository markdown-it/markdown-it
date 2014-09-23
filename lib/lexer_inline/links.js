// Process [links](<to> "stuff")

'use strict';


var skipSpaces = require('../helpers').skipSpaces;


module.exports = function links(state) {
  var oldLength,
      oldPending,
      level,
      rules,
      len,
      i,
      ok,
      found,
      labelStart,
      labelEnd,
      href,
      title,
      pos,
      code,
      isImage = false,
      max = state.posMax,
      start = state.pos,
      marker = state.src.charCodeAt(start);

  if (marker === 0x21/* ! */) {
    isImage = true;
    marker = state.src.charCodeAt(++start);
  }

  if (marker !== 0x5B/* [ */) { return false; }

  //
  // Parse link label
  //
  oldLength = state.tokens.length;
  oldPending = state.pending;

  state.pos = start + 1;
  level = 1;
  rules = state.lexer.rules;
  len = rules.length;

  while (state.pos < max) {
    marker = state.src.charCodeAt(state.pos);
    if (marker === 0x5B /* [ */) {
      level++;
    } else if (marker === 0x5D /* ] */) {
      level--;
      if (level === 0) {
        found = true;
        break;
      }
    }

    for (i = 0; i < len; i++) {
      // skip emphasis because it has lower priority, compare:
      //  [foo *bar]()*
      //  [foo `bar]()`
      if (rules[i].name !== 'emphasis' && rules[i] !== links) {
        ok = rules[i](state);
      }
      if (ok) { break; }
    }

    if (!ok) { state.pending += state.src[state.pos++]; }
  }

  // restore old state
  labelStart = start + 1;
  labelEnd = state.pos;
  state.pos = start;
  state.tokens.length = oldLength;
  state.pending = oldPending;

  // parser failed to find ']', so it's not a valid link
  if (!found) { return false; }

  //
  // Parse link destination and title
  //
  pos = labelEnd + 1;
  href = title = '';
  if (pos >= max || state.src.charCodeAt(pos) !== 0x28/* ( */) { return false; }

  // [link](  <href>  "title"  )
  //        ^^ skipping these spaces
  pos++;
  if ((pos = skipSpaces(state, pos)) >= max) { return false; }

  // [link](  <href>  "title"  )
  //          ^^^^^^ parsing link destination
  if (state.src.charCodeAt(pos) === 0x3C /* < */) {
    pos++;
    while (pos < max) {
      code = state.src.charCodeAt(pos);
      if (code === 0x0A /* \n */) { return false; }
      if (code === 0x3E /* > */) {
        pos++;
        break;
      }
      if (code === 0x5C /* \ */) {
        pos++;
        href += state.src[pos++];
        continue;
      }

      href += state.src[pos++];
    }
  } else {
    level = 0;
    while (pos < max) {
      code = state.src.charCodeAt(pos);

      if (code === 0x20) { break; }

      // ascii control characters
      if (code < 0x20 || code === 0x7F) { return false; }

      if (code === 0x5C /* \ */) {
        pos++;
        href += state.src[pos++];
        continue;
      }

      if (code === 0x28 /* ( */) {
        level++;
        if (level > 1) { return false; }
      }

      if (code === 0x29 /* ) */) {
        level--;
        if (level < 0) {
          break;
        }
      }

      href += state.src[pos++];
    }
  }

  // [link](  <href>  "title"  )
  //                ^^ skipping these spaces
  start = pos;
  if ((pos = skipSpaces(state, pos)) >= max) { return false; }

  // [link](  <href>  "title"  )
  //                  ^^^^^^^ parsing link title
  marker = state.src.charCodeAt(pos);
  if (start !== pos) {
    if (marker === 0x22 /* " */ || marker === 0x27 /* ' */ || marker === 0x28 /* ( */) {
      pos++;

      // if opening marker is "(", switch it to closing marker ")"
      if (marker === 0x28) { marker = 0x29; }

      while (pos < max) {
        code = state.src.charCodeAt(pos);
        if (code === marker) {
          pos++;
          break;
        }
        if (code === 0x5C /* \ */) {
          pos++;
          title += state.src[pos++];
          continue;
        }

        title += state.src[pos++];
      }
    }
  }

  // [link](  <href>  "title"  )
  //                         ^^ skipping these spaces
  if ((pos = skipSpaces(state, pos)) >= max) { return false; }
  if (state.src.charCodeAt(pos) !== 0x29/* ) */) { return false; }

  //
  // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //
  state.pos = labelStart;
  state.posMax = labelEnd;
  if (state.pending) { state.pushPending(); }

  if (isImage) {
    state.push({ type: 'image',
                 src: href,
                 title: title,
                 alt: state.src.substr(labelStart, labelEnd - labelStart) });
  } else {
    state.push({ type: 'link_open', href: href, title: title });
    state.lexer.tokenize(state);
    state.push({ type: 'link_close' });
  }

  state.pos = pos + 1;
  state.posMax = max;
  return true;
};
