'use strict';

// core deps
var
  util = require('util');

var
  slice = Array.prototype.slice;

module.exports = function raise(ErrorObject) {
  throw new ErrorObject(util.format.apply(util, slice.call(arguments, 1)));
};
