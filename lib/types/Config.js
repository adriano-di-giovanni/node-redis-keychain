'use strict';

// module deps
var
  _ = require('underscore');

// file deps
var
  Client = require('./Client'),
  Expiry = require('./Expiry'),
  Field = require('./Field'),
  Key = require('./Key'),
  raise = require('../functions/raise');

function Config() {
  this._clients = {};
  this._expiries = {};
  this._fields = {};
  this._keys = {};
  this._isInitialized = false;
}

Config.prototype.init = function (options) {

  if (this._isInitialized) {
    raise(Error, 'Keychain config already initialized');
  }

  if ( ! _.isObject(options)) {
    raise(TypeError, 'Missing or invalid options,', options);
  }

  _initClients.call(this, options.clients);
  _initExpiries.call(this, options.expiries);
  _initFields.call(this, options.fields);
  _initKeys.call(this, options.keys);
};

Object.defineProperty(Config.prototype, 'clients', {
  get: function () {
    return _.clone(this._clients);
  }
});

Object.defineProperty(Config.prototype, 'expiries', {
  get: function () {
    return _.clone(this._expiries);
  }
});

Object.defineProperty(Config.prototype, 'fields', {
  get: function () {
    return _.clone(this._fields);
  }
});

Object.defineProperty(Config.prototype, 'keys', {
  get: function () {
    return _.clone(this._keys);
  }
});

function _initClients(clients) {

  if ( ! clients) { return; }

  if ( ! _.isObject(clients)) {
    raise(TypeError, 'Invalid clients option,', clients);
  }

  _.each(clients, function (instance, alias) {
    _initClient.call(this, instance, alias);
  }, this);
}

function _initClient(instance, alias) {

  var
    client = new Client(alias, instance),
    clients = this._clients;

  if (clients[alias]) {
    raise(Error, 'Duplicate client alias,', alias);
  }

  clients[alias] = client;
}

function _initExpiries(expiries) {

  if ( ! expiries) { return; }

  if ( ! _.isObject(expiries)) {
    raise(TypeError, 'Invalid expiries option,', expiries);
  }

  _.each(expiries, function (options, alias) {
    _initExpiry.call(this, options, alias);
  }, this);
}

function _initExpiry(options, alias) {

  var
    expiry = new Expiry(alias, options),
    expiries = this._expiries;

  if (expiries[alias]) {
    raise(Error, 'Duplicate expiry alias,', alias);
  }

  expiries[alias] = expiry;
}

function _initFields(fields) {

  if ( ! fields) { return; }

  if ( ! _.isObject(fields)) {
    raise(TypeError, 'Invalid fields option,', fields);
  }

  _.each(fields, function (options, name) {
    _initField.call(this, options, name);
  }, this);
}

function _initField(options, name) {

  var
    field = new Field(name, options),
    fields = this._fields;

  if (fields[name]) {
    raise(Error, 'Duplicate field name,', name);
  }

  fields[name] = field;
}

function _initKeys(keys) {

  if ( ! keys) { return; }

  if ( ! _.isObject(keys)) {
    raise(TypeError, 'Invalid keys option,', keys);
  }

  _.each(keys, function (options, alias) {
    _initKey.call(this, options, alias);
  }, this);
}

function _initKey(options, alias) {
    var
      key = new Key(alias, options, this),
      keys = this._keys;

    if (keys[alias]) {
      raise(Error, 'Duplicate key alias', alias);
    }

    keys[alias] = key;
}

module.exports = Config;
