'use strict';

// module deps
var
  _ = require('underscore');

// file deps
var
  raise = require('../functions/raise');

function Client(alias, instance) {
  _initAlias.call(this, alias);
  _initInstance.call(this, instance);
}

Object.defineProperty(Client.prototype, 'alias', {
  get: function () {
    return this._alias;
  }
});

Object.defineProperty(Client.prototype, 'instance', {
  get: function () {
    return this._instance;
  }
});

function _initAlias(alias) {

  if ( ! _isAlias(alias)) {
    raise(TypeError, 'Missing or invalid client alias,', alias);
  }

  this._alias = alias;
}

function _initInstance(instance) {

  if ( ! _isInstance(instance)) {
    raise(TypeError, 'Missing or invalid client instance,', instance);
  }

  this._instance = instance;
}

function _isAlias(alias) {
  return _.isString(alias);
}

function _isInstance(instance) {
  return _.isObject(instance);
}

module.exports = Client;
