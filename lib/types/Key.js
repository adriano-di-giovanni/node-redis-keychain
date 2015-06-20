'use strict';

// module deps
var
  _ = require('underscore');

// file deps
var
  Expiry = require('./Expiry'),
  Field = require('./Field'),
  ProxyFactory = require('../factories/ProxyFactory'),
  raise = require('../functions/raise'),
  Type = require('../constants/Type');

var
  re = /\{\s*(.+?)\s*\}/g;

function Key(alias, options, config) {

  _initAlias.call(this, alias);

  if ( ! _.isObject(options)) {
    _raise.call(this, TypeError, 'options', options);
  }

  _initName.call(this, options.name);
  _initType.call(this, options.type);

  if ( ! config) {
    _raise.call(this, TypeError, 'config', config);
  }

  this._config = config;
  _initExpiry.call(this, options.expiry);
  _initClient.call(this, options.client);

  this._fields = [];
  _initFields.call(this, options.fields);
}

Object.defineProperty(Key.prototype, 'alias', {
  get: function () {
    return this._alias;
  }
});

Object.defineProperty(Key.prototype, 'name', {
  get: function () {
    return this._name;
  }
});

Object.defineProperty(Key.prototype, 'type', {
  get: function () {
    return this._type;
  }
});

Object.defineProperty(Key.prototype, 'expiry', {
  get: function () {
    var expiry = this._expiry;
    return expiry ? expiry.value : expiry;
  }
});

Object.defineProperty(Key.prototype, 'client', {
  get: function () {
    var client = this._client;
    return client ? client.instance : client;
  }
});

Key.prototype.eventuallyRefreshExpiry = function (proxy) {

  var
    expiry = this._expiry;

  if ( ! expiry || ! proxy || ! expiry.refresh) { return; }

  var
    value = expiry.value;

  if (_.isDate(value)) {
    proxy.pexpireat(value.getTime());
  } else if (_.isNumber(value) && value > 0) {
    proxy.pexpire(value);
  }
};

Key.prototype.render = function () {

  var
    params = _normalize.apply(this, arguments),
    template = _getTemplate.call(this),
    data = {},
    context = this,
    iteratee = function (field) {

      var
        name = field.name,
        value = field.process(params[name]),
        isValue = field.validate(value);

      if (field.hasAuto) {
        if (isValue) {
          raise(Error,
            'Can\'t override auto value for field \'%s\' of key \'%s\',',
            name, context.alias, value);
        }
        value = field.auto;
        isValue = true;
      }

      if ( ! isValue) {
        raise(TypeError,
          'Missing or invalid value for field \'%s\' of key \'%s\'', name,
          context.alias, value);
      }

      data[name] = value;
    };

  this._fields.forEach(iteratee);

  return template(data);
};

Key.prototype.r = Key.prototype.render;

Key.prototype.send = function () {

  if ( ! this._proxy) {
    this._proxy = ProxyFactory.create(this);
  }

  var
    proxy = this._proxy;

  return proxy.send.apply(proxy, arguments);
};

Key.prototype.s = Key.prototype.send;

function _initName(name) {

  if ( ! _.isString(name)) {
    _raise.call(this, TypeError, 'name option', name);
  }

  this._name = name;
}

function _initType(type) {

  if ( ! Type.validate(type)) {
    _raise.call(this, TypeError, 'type option', type);
  }

  this._type = type;
}

function _initExpiry(expiry) {

  if (_.isUndefined(expiry)) { return; }

  this._expiry = this._config.expiries[expiry] || new Expiry('', expiry, this);
}

function _initClient(clientAlias) {

  if ( ! clientAlias) { return; }

  var
    client = this._client = this._config.clients[clientAlias];

  if ( ! client) {
    raise(TypeError,
      'Missing client for key \'%s\'', this.alias);
  }
}

function _initFields(fields) {

  fields = fields || {};

  var
    _re = new RegExp(re),
    fName,
    kName = this._name,
    result;

  while ((result = _re.exec(kName)) !== null) {

    fName = result[1];
    _initField.call(this, fields[fName], fName);
  }
}

function _initField(options, name) {

  if (_fieldExists.call(this, name)) {
    raise(Error,
      'Duplicate field name \'%s\' for key \'%s\'', name, this.alias);
  }

  var
    field = this._config.fields[name];

  if (field) {
    if (options) {
      raise(Error,
        'Can\'t override properties of global field \'%s\' for key \'%s\'',
        name, this.alias);
    }
  } else {
    field = new Field(name, options, this);
  }

  this._fields.push(field);
}

function _initAlias(alias) {
  if ( ! _.isString(alias)) {
    _raise.call(this, TypeError, 'key alias', alias);
  }

  this._alias = alias;
}

function _normalize(params) {

  var
    a = arguments,
    n = a.length,
    result = {};

  if (n === 0) {
    return result;
  }

  if (n === 1 && _.isObject(params)) {
    return params;
  }

  this._fields.forEach(function (field, index) {
    result[field.name] = a[index];
  });

  return result;
}

function _getTemplate() {

  if (this._template) { return this._template; }

  var
    name = this._name,
    settings = { interpolate: new RegExp(re) },
    template = this._template = _.template(name, settings);

  return template;
}

function _fieldExists(name) {
  var predicate = function (field) { return field.name === name; };
  return !! _.find(this._fields, predicate);
}

function _raise(ErrorClass, name, value) {
  raise(ErrorClass, 'Missing or invalid %s for key \'%s\',', name, this.alias, value);
}

module.exports = Key;
