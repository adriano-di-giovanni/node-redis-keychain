'use strict';

// module deps
var
  _ = require('underscore'),
  expiry = require('expiry-js');

// file deps
var
  raise = require('../functions/raise');

var
  SCOPE_GLOBAL = 'global',
  SCOPE_KEY = 'key',
  ERROR_MESSAGE_GLOBAL = 'Missing or invalid %s for global expiry \'%s\',',
  ERROR_MESSAGE_KEY = 'Missing or invalid %s for expiry \'%s\' of key \'%s\',';

function Expiry(alias, options, key) {

  var
    value,
    refresh = false;

  _initScope.call(this, key);
  _initAlias.call(this, alias);

  if (_isValue(options)) {
    value = _toValue.call(this, options);
  } else if (_.isObject(options)) {
    value = _toValue.call(this, options.value);
    refresh = !! options.refresh;
  } else {
    _raise.call(this, TypeError, 'options', options);
  }

  this._value = value;
  this._refresh = refresh;
}

Object.defineProperty(Expiry.prototype, 'alias', {
  get: function () {
    return this._alias;
  }
});

Object.defineProperty(Expiry.prototype, 'key', {
  get: function () {
    return this._key;
  }
});

Object.defineProperty(Expiry.prototype, 'scope', {
  get: function () {
    return this._scope;
  }
});

Object.defineProperty(Expiry.prototype, 'isGlobal', {
  get: function () {
    return this._scope === SCOPE_GLOBAL;
  }
});

Object.defineProperty(Expiry.prototype, 'value', {
  get: function () {

    var
      value = _.result(this, '_value');

    if ( ! _isActualValue(value)) {
      _raise.call(this, TypeError, 'value', value);
    }

    if (value instanceof expiry.Expiry) {
      return value.asMilliseconds();
    }

    return value;
  }
});

Object.defineProperty(Expiry.prototype, 'refresh', {
  get: function () {
    return this._refresh;
  }
});

function _initScope(key) {

  var
    Key = require('./Key');

  if (_.isUndefined(key)) {
    this._scope = SCOPE_GLOBAL;
  } else if (key instanceof Key) {
    this._scope = SCOPE_KEY;
    this._key = key;
  } else {
    raise(TypeError, 'Invalid key,', key);
  }
}

function _initAlias(alias) {

  if ( ! _isAlias(alias)) {
    _raise.call(this, TypeError, 'alias', alias);
  }

  this._alias = alias;
}

function _isValue(value) {
  return _.isDate(value) || _.isFunction(value) || _.isNumber(value) ||
    _.isString(value);
}

function _isActualValue(value) {
  return (value instanceof expiry.Expiry) || _.isDate(value) || _.isNumber(value);
}

function _toValue(value) {

  if (_.isString(value)) {
    return expiry(value);
  }

  if (_isValue(value)) {
    return value;
  }

  _raise.call(this, TypeError, 'value', value);
}

function _isAlias(alias) {
  return _.isString(alias);
}

function _raise(ErrorClass, name, value) {
  if (this.isGlobal) {
    raise(ErrorClass, ERROR_MESSAGE_GLOBAL, name, this.alias, value);
  } else {
    raise(ErrorClass, ERROR_MESSAGE_KEY, name, this.alias, this.key.alias,
      value);
  }
}

module.exports = Expiry;
