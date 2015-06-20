'use strict';

// core deps
var
  util = require('util');

// file deps
var
  mixin = require('./mixin');

var
  Proxy = require('./Proxy');

function StringProxy() {
  Proxy.apply(this, arguments);
}

util.inherits(StringProxy, Proxy);

StringProxy.type = 'string';

mixin(StringProxy);

module.exports = StringProxy;
