'use strict';

// module deps
var
  _ = require('underscore');

// file deps
var
  // Getter = require('./Getter'),
  raise = require('../functions/raise');

function Keychain(config) {
  this._config = config;
  // this._clients = new Getter(config.clients, 'instance');
  // this._expiries = new Getter(config.expiries, 'value');

  _initClients.call(this, config.clients);
  _initExpiries.call(this, config.expiries);
  _initKeys.call(this, config.keys);
}

Object.defineProperty(Keychain.prototype, 'clients', {
  get: function () {
    return this._clients;
  }
});

Object.defineProperty(Keychain.prototype, 'expiries', {
  get: function () {
    return this._expiries;
  }
});

function _initClients(clients) {

  this._clients = {};

  _.each(clients, function (client, alias) {

    if (this.clients[alias]) {
      raise(Error, 'Duplicate client alias,', alias);
    }

    this._clients[alias] = client.instance;
  }, this);
}

function _initExpiries(expiries) {

  this._expiries = {};

  _.each(expiries, function (expiry, alias) {

    if (this._expiries[alias]) {
      raise(Error, 'Duplicate expiry alias,', alias);
    }

    this._expiries[alias] = expiry.value;
  }, this);
}

function _initKeys(keys) {
  _.each(keys, function (key, alias) {

    if (this[alias]) {
      raise(Error, 'Duplicate key alias,', alias);
    }

    this[alias] = key;
  }, this);
}

module.exports = Keychain;
