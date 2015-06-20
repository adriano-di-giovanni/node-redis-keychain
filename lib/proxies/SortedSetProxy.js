'use strict';

// core deps
var
  util = require('util');

// file deps
var
  mixin = require('./mixin');

var
  Proxy = require('./Proxy');

function SortedSetProxy() {
  Proxy.apply(this, arguments);
}

util.inherits(SortedSetProxy, Proxy);

SortedSetProxy.type = 'zset';

mixin(SortedSetProxy);

module.exports = SortedSetProxy;
