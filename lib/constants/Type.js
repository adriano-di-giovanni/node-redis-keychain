'use strict';

// module deps
var
  Type = require('node-redis-commands').Type;

var
  types = Object.keys(Type).map(function (key) {
    return Type[key];
  });

module.exports = {

  validate: function (type) {
    return types.indexOf(type) !== -1;
  }
};
