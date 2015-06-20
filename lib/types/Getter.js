'use strict';

function Getter(obj, key) {
  this._obj = obj;
  this._key = key;
}

Getter.prototype.get = function (alias) {
  return this._obj[alias][this._key];
};

module.exports = Getter;
