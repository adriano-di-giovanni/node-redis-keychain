'use strict';

// module deps
var
  _ = require('underscore'),
  commands = require('node-redis-commands').commands;

module.exports = function (Proxy) {

  var
    type = Proxy.type,
    array = [];

  _.each(commands, function (info, name) {
    if (_.contains(info.types, type) &&
      info.firstKeyAt === 1 &&
      (info.firstKeyAt === info.lastKeyAt ||
        info.lastKeyAt === -1)) {
      array.push(name);
    }
  });

  array.forEach(function (element) {

    var
      hasWrite = commands[element].flags.indexOf('write') !== -1;

    Proxy.prototype[element] = hasWrite ?
      function () {

        var
          instance = this._key.client,
          args = [ this._keyName ].concat(_.toArray(arguments)),
          ret;

        ret = instance[element].apply(instance, args);

        if (element.indexOf('expire') === -1) {
          this._key.eventuallyRefreshExpiry(this);
        }

        return ret;
      } :
      function () {

        var
          instance = this._key.client,
          args = [ this._keyName ].concat(_.toArray(arguments));

        return instance[element].apply(instance, args);
      };
  });
};
