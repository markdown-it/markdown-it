'use strict';


var replaceEntities = require('../common/utils').replaceEntities;


module.exports = function normalizeLink(url) {
  var normalized = replaceEntities(url);

  // We don't care much about result of mailformed URIs,
  // but shoud not throw exception.
  try {
    normalized = decodeURI(normalized);
  } catch (__) {}

  return encodeURI(normalized);
};
