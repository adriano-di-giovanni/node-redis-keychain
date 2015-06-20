'use strict';

// core deps
var
  util = require('util');

// file deps
var
  mixin = require('./mixin');

var
  Proxy = require('./Proxy');

function HashProxy() {
  Proxy.apply(this, arguments);
}

util.inherits(HashProxy, Proxy);

HashProxy.type = 'hash';

mixin(HashProxy);

module.exports = HashProxy;
