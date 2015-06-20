'use strict';

// module deps
var
  _ = require('underscore');

// file deps
var
  raise = require('../functions/raise');

var
  SCOPE_GLOBAL = 'global',
  SCOPE_KEY = 'key',
  ERROR_MESSAGE_GLOBAL = 'Missing or invalid %s for global field \'%s\',',
  ERROR_MESSAGE_KEY = 'Missing or invalid %s for field \'%s\' of key \'%s\',';

var
  defaultProcess = function (value) {
    return value;
  },
  defaultValidate = function () {
    return true;
  };

function Field(name, options, key) {

  _initScope.call(this, key);
  _initName.call(this, name);

  if ( ! _isOptions(options, this.isGlobal)) {
    _raise.call(this, TypeError, 'options', options);
  }

  options = options || {};

  _initType.call(this, options.type);
  _initAuto.call(this, options.auto);
  _initProcess.call(this, options.process);
  _initValidate.call(this, options.validate);
}

Object.defineProperty(Field.prototype, 'name', {
  get: function () {
    return this._name;
  }
});

Object.defineProperty(Field.prototype, 'key', {
  get: function () {
    return this._key;
  }
});

Object.defineProperty(Field.prototype, 'scope', {
  get: function () {
    return this._scope;
  }
});

Object.defineProperty(Field.prototype, 'isGlobal', {
  get: function () {
    return this._scope === SCOPE_GLOBAL;
  }
});

Object.defineProperty(Field.prototype, 'type', {
  get: function () {
    return this._type;
  }
});

Object.defineProperty(Field.prototype, 'hasAuto', {
  get: function () {
    var auto = this._auto;
    return ! _.isNull(auto) && ! _.isUndefined(auto);
  }
});

Object.defineProperty(Field.prototype, 'auto', {
  get: function () {
    if ( ! this.hasAuto) { return void 0; }
    var value = this._process(_.result(this, '_auto'));
    if ( ! _isValue.call(this, value) || ! this.validate(value)) {
      _raise.call(this, TypeError, 'auto value', value);
    }
    return value;
  }
});

Field.prototype.process = function (value) {
  return this._process(value);
};

Field.prototype.validate = function (value) {

  var
    isValue = _isValue.call(this, value);

  if ( ! isValue) { return isValue; }

  var
    result = this._validate(value);

  if ( ! _.isBoolean(result)) {
    _raise.call(this, TypeError, 'validate return value', result);
  }

  return result;
};

function _initName(name) {

  if ( ! _isName(name)) {
    _raise.call(this, TypeError, 'name', name);
  }

  this._name = name;
}

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

function _initType(type) {

  if ( ! _isType(type)) {
    _raise.call(this, TypeError, 'type option', type);
  }

  this._type = type;
}

function _initAuto(auto) {

  if ( ! _isAuto(auto)) {
    _raise.call(this, TypeError, 'auto option', auto);
  }

  this._auto = auto;
}

function _initProcess(process) {

  if ( ! _isProcess(process)) {
    _raise.call(this, TypeError, 'process option', process);
  }

  this._process = process || defaultProcess;
}

function _initValidate(validate) {

  if ( ! _isValidate(validate)) {
    _raise.call(this, TypeError, 'validate option', validate);
  }

  this._validate = validate || defaultValidate;
}

function _isOptions(options, isGlobal) {
  return ! isGlobal || (_.isObject(options) && options.auto);
}

function _isName(name) {
  return _.isString(name);
}

function _isType(type) {
  return _.isUndefined(type) || type === Boolean || type === Number ||
    type === String;
}

function _isAuto(auto) {
  return _.isUndefined(auto) || _.isBoolean(auto) || _.isFunction(auto) ||
    _.isNumber(auto) || _.isString(auto);
}

function _isProcess(process) {
  return _.isUndefined(process) || _.isFunction(process);
}

function _isValidate(validate) {
  return _.isUndefined(validate) || _.isFunction(validate);
}

function _isValue(value) {
  return _.isBoolean(value) || _.isNumber(value) ||
    _.isString(value);
}

function _raise(ErrorClass, name, value) {
  if (this.isGlobal) {
    raise(ErrorClass, ERROR_MESSAGE_GLOBAL, name, this.name, value);
  } else {
    raise(ErrorClass, ERROR_MESSAGE_KEY, name, this.name, this.key.alias,
      value);
  }
}

module.exports = Field;
