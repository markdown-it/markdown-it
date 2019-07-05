// For each opening emphasis-like marker find a matching closing one
//
'use strict';


module.exports = function link_pairs(state) {
  var i, j, lastDelim, currDelim,
      delimiters = state.delimiters,
      max = state.delimiters.length;

  for (i = 0; i < max; i++) {
    lastDelim = delimiters[i];

    if (!lastDelim.close) { continue; }

    j = i - lastDelim.jump - 1;

    while (j >= 0) {
      currDelim = delimiters[j];

      if (currDelim.open &&
          currDelim.marker === lastDelim.marker &&
          currDelim.end < 0 &&
          currDelim.level === lastDelim.level) {

        var odd_match = false;

        // typeofs are for backward compatibility with plugins
        if ((currDelim.close || lastDelim.open) &&
            typeof currDelim.length !== 'undefined' &&
            typeof lastDelim.length !== 'undefined') {

          // from spec:
          // sum of the lengths [...] must not be a multiple of 3
          // unless both lengths are multiples of 3
          if ((currDelim.length + lastDelim.length) % 3 === 0) {
            if (currDelim.length % 3 !== 0 || lastDelim.length % 3 !== 0) {
              odd_match = true;
            }
          }
        }

        if (!odd_match) {
          lastDelim.jump = i - j;
          lastDelim.open = false;
          currDelim.end  = i;
          currDelim.jump = 0;
          break;
        }
      }

      j -= currDelim.jump + 1;
    }
  }
};
