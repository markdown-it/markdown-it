// Process [links](<to> "stuff")

'use strict';


var skipSpaces = require('../helpers').skipSpaces;

//
// Parse link label
//
// this function assumes that first character ("[") already matches;
// returns the end of the label
function parseLinkLabel(state, start) {
  var level, rules, len, found, marker, i, ok,
      labelEnd = -1,
      max = state.posMax,
      oldPos = state.pos,
      oldLength = state.tokens.length,
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
      if (rules[i].name !== 'emphasis' && rules[i].name !== 'links') {
        ok = rules[i](state);
      }
      if (ok) { break; }
    }

    if (!ok) { state.pending += state.src[state.pos++]; }
  }

  if (found) { labelEnd = state.pos; }

  // restore old state
  state.pos = oldPos;
  state.tokens.length = oldLength;
  state.pending = oldPending;

  return labelEnd;
}

//
// Parse link destination
//
// on success it returns a string and updates state.pos;
// on failure it returns null
function parseLinkDestination(state, pos) {
  var code, level,
      max = state.posMax,
      href = '';

  if (state.src.charCodeAt(pos) === 0x3C /* < */) {
    pos++;
    while (pos < max) {
      code = state.src.charCodeAt(pos);
      if (code === 0x0A /* \n */) { return null; }
      if (code === 0x3E /* > */) {
        state.pos = pos + 1;
        return href;
      }
      if (code === 0x5C /* \ */ && pos + 1 < max) {
        pos++;
        href += state.src[pos++];
        continue;
      }

      href += state.src[pos++];
    }

    // no closing '>'
    return null;
  }

  // this should be ... } else { ... branch

  level = 0;
  while (pos < max) {
    code = state.src.charCodeAt(pos);

    if (code === 0x20) { break; }

    // ascii control characters
    if (code < 0x20 || code === 0x7F) { break; }

    if (code === 0x5C /* \ */ && pos + 1 < max) {
      pos++;
      href += state.src[pos++];
      continue;
    }

    if (code === 0x28 /* ( */) {
      level++;
      if (level > 1) { break; }
    }

    if (code === 0x29 /* ) */) {
      level--;
      if (level < 0) { break; }
    }

    href += state.src[pos++];
  }

  if (!href.length) { return null; }

  state.pos = pos;
  return href;
}

//
// Parse link title
//
// on success it returns a string and updates state.pos;
// on failure it returns null
function parseLinkTitle(state, pos) {
  var title, code,
      max = state.posMax,
      marker = state.src.charCodeAt(pos);

  if (marker !== 0x22 /* " */ && marker !== 0x27 /* ' */ && marker !== 0x28 /* ( */) { return null; }

  pos++;
  title = '';

  // if opening marker is "(", switch it to closing marker ")"
  if (marker === 0x28) { marker = 0x29; }

  while (pos < max) {
    code = state.src.charCodeAt(pos);
    if (code === marker) {
      state.pos = pos + 1;
      return title;
    }
    if (code === 0x5C /* \ */ && pos + 1 < max) {
      pos++;
      title += state.src[pos++];
      continue;
    }

    title += state.src[pos++];
  }

  return null;
}

function normalizeReference(str) {
  return str.trim().replace(/\s+/g, ' ').toLowerCase();
}

function links(state) {
  var labelStart,
      labelEnd,
      label,
      href,
      title,
      pos,
      ref,
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

  labelStart = start + 1;
  labelEnd = parseLinkLabel(state, start);

  // parser failed to find ']', so it's not a valid link
  if (pos < 0) { return false; }

  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
    //
    // Inline link
    //

    // [link](  <href>  "title"  )
    //        ^^ skipping these spaces
    pos++;
    if ((pos = skipSpaces(state, pos)) >= max) { return false; }

    // [link](  <href>  "title"  )
    //          ^^^^^^ parsing link destination
    start = pos;
    href = parseLinkDestination(state, pos);
    if (href !== null) {
      pos = state.pos;
    } else {
      href = '';
    }

    // [link](  <href>  "title"  )
    //                ^^ skipping these spaces
    start = pos;
    pos = skipSpaces(state, pos);

    // [link](  <href>  "title"  )
    //                  ^^^^^^^ parsing link title
    if (pos < max && start !== pos && (title = parseLinkTitle(state, pos)) !== null) {
      pos = state.pos;

      // [link](  <href>  "title"  )
      //                         ^^ skipping these spaces
      pos = skipSpaces(state, pos);
    } else {
      title = '';
    }

    if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
      state.pos = labelStart - 1;
      return false;
    }
    pos++;
  } else {
    //
    // Link reference
    //

    // [foo]  [bar]
    //      ^^ optional whitespace (can include newlines)
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (code !== 0x20 && code !== 0x0A) { break; }
    }

    if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
      start = pos + 1;
      pos = parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = start - 1;
      }
    }

    // covers label === '' and label === undefined
    // (collapsed reference link and shortcut reference link respectively)
    if (!label) { label = state.src.slice(labelStart, labelEnd); }

    ref = state.env.references[normalizeReference(label)];
    if (!ref) {
      state.pos = labelStart - 1;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }

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

  state.pos = pos;
  state.posMax = max;
  return true;
}

module.exports = links;
module.exports.parseLinkLabel = parseLinkLabel;
module.exports.parseLinkDestination = parseLinkDestination;
module.exports.parseLinkTitle = parseLinkTitle;
module.exports.normalizeReference = normalizeReference;
