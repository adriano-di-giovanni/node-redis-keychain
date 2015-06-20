'use strict';

// core deps
var
  util = require('util');

// file deps
var
  mixin = require('./mixin');

var
  Proxy = require('./Proxy');

function HyperLogLogProxy() {
  Proxy.apply(this, arguments);
}

util.inherits(HyperLogLogProxy, Proxy);

HyperLogLogProxy.type = 'hyperloglog';

mixin(HyperLogLogProxy);

module.exports = HyperLogLogProxy;
