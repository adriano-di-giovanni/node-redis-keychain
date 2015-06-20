'use strict';

function Proxy(key) {
  this._key = key;
}

Proxy.prototype.send = function () {
  var key = this._key;
  this._keyName = key.render.apply(key, arguments);
  return this;
};

module.exports = Proxy;
