'use strict';

// file deps
var
  HashProxy = require('../proxies/HashProxy'),
  HyperLogLogProxy = require('../proxies/HyperLogLogProxy'),
  ListProxy = require('../proxies/ListProxy'),
  SetProxy = require('../proxies/SetProxy'),
  SortedSetProxy = require('../proxies/SortedSetProxy'),
  StringProxy = require('../proxies/StringProxy'),

  raise = require('../functions/raise');

var
  ProxyFactory = {};

ProxyFactory.create = function (key) {

  var
    type = key.type,
    Proxy;

  switch (type) {
    case 'hash':
      Proxy = HashProxy;
      break;
    case 'hyperloglog':
      Proxy = HyperLogLogProxy;
      break;
    case 'list':
      Proxy = ListProxy;
      break;
    case 'set':
      Proxy = SetProxy;
      break;
    case 'zset':
      Proxy = SortedSetProxy;
      break;
    case 'string':
      Proxy = StringProxy;
      break;
    default:
      raise(TypeError, 'Missing or invalid type,', type);
  }

  return new Proxy(key);
};

module.exports = ProxyFactory;
