
'use strict';

//
// Parse link label
//
// this function assumes that first character ("[") already matches;
// returns the end of the label
function parseLinkLabel(state, start) {
  var level, found, marker,
      labelEnd = -1,
      max = state.posMax,
      oldPos = state.pos,
      oldFlag = state.isInLabel;

  if (state.isInLabel) { return -1; }

  if (state.labelUnmatchedScopes) {
    state.labelUnmatchedScopes--;
    return -1;
  }

  state.pos = start + 1;
  state.isInLabel = true;
  level = 1;

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

    state.parser.skipToken(state);
  }

  if (found) {
    labelEnd = state.pos;
    state.labelUnmatchedScopes = 0;
  } else {
    state.labelUnmatchedScopes = level - 1;
  }

  // restore old state
  state.pos = oldPos;
  state.isInLabel = oldFlag;

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
      if (code === 0x0A /* \n */) { return false; }
      if (code === 0x3E /* > */) {
        state.pos = pos + 1;
        state.linkContent = href;
        return true;
      }
      if (code === 0x5C /* \ */ && pos + 1 < max) {
        pos++;
        href += state.src[pos++];
        continue;
      }

      href += state.src[pos++];
    }

    // no closing '>'
    return false;
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

  if (!href.length) { return false; }

  if (!state.parser.validateLink(href)) { return false; }

  state.pos = pos;
  state.linkContent = href;
  return true;
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

  if (marker !== 0x22 /* " */ && marker !== 0x27 /* ' */ && marker !== 0x28 /* ( */) { return false; }

  pos++;
  title = '';

  // if opening marker is "(", switch it to closing marker ")"
  if (marker === 0x28) { marker = 0x29; }

  while (pos < max) {
    code = state.src.charCodeAt(pos);
    if (code === marker) {
      state.pos = pos + 1;
      state.linkContent = title;
      return true;
    }
    if (code === 0x5C /* \ */ && pos + 1 < max) {
      pos++;
      title += state.src[pos++];
      continue;
    }

    title += state.src[pos++];
  }

  return false;
}

function normalizeReference(str) {
  return str.trim().replace(/\s+/g, ' ').toLowerCase();
}

module.exports.parseLinkLabel = parseLinkLabel;
module.exports.parseLinkDestination = parseLinkDestination;
module.exports.parseLinkTitle = parseLinkTitle;
module.exports.normalizeReference = normalizeReference;
