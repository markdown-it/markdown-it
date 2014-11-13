'use strict';


var replaceEntities = require('../common/utils').replaceEntities;


module.exports = function normalizeLink(url) {
  return encodeURI(decodeURI(replaceEntities(url)));
};
