var _ = require("underscore");

/*
 * Filter state.
 */
var wares = {};

/*
 * Add filter of a type on a certain filetype.
 */
var set = function(type, filetype, handler) {
  wares[type] = wares[type] || [];
  wares[type].push({
    filetype: filetype,
    handler: handler
  });
};

/*
 * Get filter of a type matching a filetype.
 */
var get = function(type, filetype) {
  var typed = wares[type];
  var match = _.find(typed, function(m) {
    return m.filetype === filetype;
  });
  if (match) return match.handler;
  return function() {};
};

/*
 * Get or set filters
 */
module.exports = function(type, filetype, handler) {
  return handler ?
    set(type, filetype, handler) :
    get(type, filetype);
};

/*
 * Check if a type of filter exists for a filetype.
 */
module.exports.has = function(type, filetype) {
  return !!_.find(wares[type], function(m) {
    return m.filetype === filetype;
  });
};