'use strict';

// core deps
var
  util = require('util');

// file deps
var
  mixin = require('./mixin');

var
  Proxy = require('./Proxy');

function SetProxy() {
  Proxy.apply(this, arguments);
}

util.inherits(SetProxy, Proxy);

SetProxy.type = 'set';

mixin(SetProxy);

module.exports = SetProxy;
