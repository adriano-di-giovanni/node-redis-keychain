'use strict';

// core deps
var
  util = require('util');

// file deps
var
  mixin = require('./mixin');

var
  Proxy = require('./Proxy');

function ListProxy() {
  Proxy.apply(this, arguments);
}

util.inherits(ListProxy, Proxy);

ListProxy.type = 'list';

mixin(ListProxy);

module.exports = ListProxy;
