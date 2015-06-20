'use strict';

var
  Config = require('./lib/types/Config'),
  Keychain = require('./lib/types/Keychain');

exports.forge = function (fn) {

  var
    config = new Config();

  fn(config);

  return new Keychain(config);
};

exports.Key = require('./lib/types/Key');
exports.Expiry = require('./lib/types/Expiry');
