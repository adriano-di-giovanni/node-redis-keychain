# RedisKeychain <a name="redis-keychain"></a>
[![NPM version][npm-image]][npm-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url] [![Coverage Status][coveralls-image]][coveralls-url]
[![Build Status](https://travis-ci.org/adriano-di-giovanni/node-redis-keychain.svg?branch=master)](https://travis-ci.org/adriano-di-giovanni/node-redis-keychain)

RedisKeychain is a Node.js library for streamlining the configuration and maintenance of your Redis namespace.

## Features <a name="features"></a>

* template engine for key names;
* expiry configuration utility;
* key-to-client binding.

## Table of contents

*generated with [DocToc](http://doctoc.herokuapp.com/)*

- [RedisKeychain](#redis-keychain)
    - [Features](#features)
    - [Installation](#installation)
    - [Typical usage](#typical-usage)
        - [Configuration](#configuration)
        - [Instantiation](#instantiation)
        - [Usage](#usage)
    - [Configuration options ](#configuration-options)
        - [Clients ](#configuration-options-clients)
        - [Expiries ](#configuration-options-expiries)
        - [Fields ](#configuration-options-fields)
            - [type](#fields-type)
            - [auto](#fields-auto)
            - [process](#fields-process)
            - [validate](#fields-validate)
        - [Keys](#configuration-options-keys)
            - [name](#key-name)
            - [type](#key-type)
            - [fields ](#key-fields)
            - [expiry ](#key-expiry)
                - [Refresh ](#key-expiry-refresh)
            - [client](#key-client)
            - [Key#render ](#key-render)
            - [Key#send() ](#key-send)
    - [Running tests](#running-tests)
    - [License](#license)

## Installation <a name="installation"></a>

```
$ npm install node-redis-keychain
```

## Typical usage <a name="typical-usage"></a>

Typical usage involves defining a "configure" function and pass it as argument to the library's factory method `.forge()` in order to create a new instance of `RedisKeychain`.

### Configuration <a name="configuration"></a>

In the following example, "configure" function is defined as a module in `./configure.js` for the sake of clarity.

Separating configuration from instantiation is also considered a best practice.

```javascript
// module deps
var
    moment = require('moment'),
    redis = require('redis');

module.exports = function configure(config) {
    config.init({
        clients: {
            cache: redis.createClient()
        },
        expiries: {
            daily: '1 day'
        },
        fields: {
            day: {
                auto: function () {
                    return moment().format('YYYYMMDD');
                }
            }
        },
        keys: {
            userDailyScoreByLevel: {
                name: 'user:score:daily:{day}:level:{level}',
                type: 'string',
                fields: {
                    level: {
                        type: Number,
                        validate: function (value) {
                            return value >= 1 && value <= 5;
                        }
                    }
                },
                expiry: 'daily',
                client: 'cache'
            }
        }
    });
};
```

Every "configure" function uses this format and all of your configuration options must be specified inside this function:

```javascript
module.exports = function configure(config) {

    var
        options = {
            // clients, expiries, fields, keys
        };

    config.init(options);
}
```

More on configuration options [later](#configuration-options).

### Instantiation <a name="instantiation"></a>

In the following example, "configure" function module in `./configure.js` is passed to library's factory method, `.forge()`.

```javascript
// module deps
var
    RedisKeychain = require('node-redis-keychain');

// file deps
var
    configure = require('./configure');

var
    keychain = RedisKeychain.forge(configure);
```

### Usage <a name="usage"></a>

```javascript
// centralize access to your Redis clients
keychain.clients.cache.dbsize(function (error, reply) {
    if (error) {
        throw error;
    }
    console.log(reply); // number of keys in db 0
});

// centralize access to your expiries
console.log(keychain.expiries.daily); // 86400000

var
    key = keychain.userDailyScoreByLevel;

// use template engine for key names feature
console.log(key.render({ level: 1 })); // 'path:to:key:with:20200101:1'

// use key-to-client binding
key.send({ level: 2 })
    .incrby(3, function (error, reply) {
        if (error) {
            throw error;
        }
        console.log(reply); // 3
    });
```

## Configuration options <a name="configuration-options"></a>

Configuration options are passed to `Config#init()` as an hash argument.

Configuration options are `clients`, `expiries`, `fields` and `keys`.

All of them are optional.

```javascript
module.exports = function configure(config) {

    var
        options = {
            clients: {
                // all your clients here
            },
            expiries: {
                // all your expiries here
            },
            fields: {
                // all your fields here
            },
            keys: {
                // all your keys here
            }
        };

    config.init(options);
}
```

### Clients <a name="configuration-options-clients"></a>

In the following example, two different Redis clients are registered to a `RedisKeychain` instance.

Client instances are then accessed from `RedisKeychain#clients`.

```javascript
// module deps
var
    RedisKeychain = require('node-redis-keychain'),

    redis = require('redis'),
    Redis = require('ioredis');

var
    cache = redis.createClient(),
    persistent = new Redis();

persistent.select(1);

var
    configure = function (config) {
        config.init({
            clients: {
                cache: cache,
                persistent: persistent
            }
        });
    },

    keychain = RedisKeychain.forge(configure);

keychain.clients.cache.dbsize(function (error, reply) {
    if (error) {
        throw error;
    }

    console.log(reply); // number of keys in db 0
});

keychain.clients.persistent.dbsize()
    .then(function (reply) {
        console.log(reply); // number of keys in db 1
    });

```

Registering a client to a `RedisKeychain` instance, involves adding an alias-instance pair to the `clients` configuration option:

```javascript
{
    clients: {
        alias: instance
    }
}
```

You then access the client by alias:

```javascript
keychain.clients.alias;
```

Client registration is library agnostic: you can use your Redis client library of choice.

### Expiries <a name="configuration-options-expiries"></a>

Expiries are keys' time to live.

Expiries can have global or key scope.

The `expiries` configuration option is meant to register global expiries.

More on key-scoped expiries [later](#key-expiry).

In the following example, five global expiries are registered to a `RedisKeychain` instance to show all possible configurations.

Expiries are then accessed from `RedisKeychain#expiries`.

```javascript
// module deps
var
    RedisKeychain = require('node-redis-keychain');

var
    configure = function (config) {
        config.init({
            expiries: {
                daily: '1 day',
                minutely: 60000,
                at: new Date(2020, 0, 1),
                secondly: function () {
                    return 1000;
                },
                refreshing: {
                    value: '1 day',
                    refresh: true
                }
            }
        });
    },

    keychain = RedisKeychain.forge(configure);

console.log(keychain.expiries.daily); // 86400000
console.log(keychain.expiries.minutely); // 60000
console.log(keychain.expiries.at); // Wed Jan 01 2020 00:00:00 GMT+0100 (CET)
console.log(keychain.expiries.secondly); // 1000
console.log(keychain.expiries.refreshing); // 86400000
```

Registering a global expiry to a `RedisKeychain` instance, involves adding an alias-value pair to the `expiries` configuration option

```javascript
{
    expiries: {
        alias: value
    }
}
```

where `value` can be of types `String`, `Number`, `Date`, `Function`, `Object`.

Use a `String` value to define an expiry just like `1 day`, `2 weeks`. More information at [expiry-js](https://github.com/adriano-di-giovanni/expiry-js).

Use a `Number` value to define an expiry using milliseconds.

Use a `Date` value to define an expiry by date.

Use a `Function` value to define a dynamic expiry. The function must return a value of types `String`, `Number`, `Date` or `Object`.

Use an `Object` value to set expiry value and refresh. More info on refresh [later](#key-expiry-refresh).

You then access the expiry by alias:

```javascript
keychain.expiries.alias;
```

### Fields <a name="configuration-options-fields"></a>

Fields are placeholders in key names.

Fields can have global or key scope.

The `fields` configuration option is meant to register global fields.

More on key-scoped fields [later](#key-fields).

```javascript
// module deps
var
    moment = require('moment'),
    RedisKeychain = require('node-redis-keychain');

var
    configure = function (config) {
        config.init({
            fields: {
                yearMonth: {
                    auto: function () {
                        return moment().format('YYYYMM');
                    }
                }
            },
            keys: {
                leaderboard: {
                    name: 'leaderboard:monthly:{yearMonth}',
                    type: 'zset'
                }
            }
        });
    },

    keychain = RedisKeychain.forge(configure);

console.log(keychain.leaderboard.render()); // leaderboard:monthly:202001
```

Registering a global field to a `RedisKeychain` instance involves adding a name-value pair to the `fields` configuration option.

```javascript
{
    fields: {
        name: value
    }
}
```

where `value` is an object having at least one of the following properties: `type`, `auto`, `process`, `validate`.

#### type <a name="fields-type"></a>

Optional. It enables type-checking against actual field values.

It can be any value in `Boolean`, `Number`, `String`.

#### auto <a name="fields-auto"></a>

Required for global fields. Optional for key fields. It is an automatic value for the field.

It can be any value of type `Boolean`, `Function`, `Number`, `String`.

If `auto` is of type `Function` then `auto()` will be invoked upon [`Key#render()`](#key-render) or [`Key#send()`](#key-send) to get the actual value.

#### process <a name="fields-process"></a>

Specify `process` if you want to process values before validation and rendering; `process()` will be invoked upon [`Key#render()`](#key-render) or [`Key#send()`](#key-send).

It must return a value of valid `type` and conforming to `validate()` constraints.

#### validate <a name="fields-validate"></a>

Specify `validate` if you want to perform further validation on field value; `validate()` will be invoked upon [`Key#render()`](#key-render) or [`Key#send()`](#key-send) and after `process()`.

It must return a `Boolean` value.

You can use `validate` in conjunction with `type`.

### Keys <a name="configuration-options-keys"></a>

In the following example, a key is registered to a `RedisKeychain` instance.

```javascript
// module deps
var
    RedisKeychain = require('node-redis-keychain');

var
    configure = function (config) {
        config.init({
            keys: {
                aKey: {
                    name: 'path:to:key:with:{field}',
                    type: 'string'
                }
            }
        });
    },

    keychain = RedisKeychain.forge(configure);

console.log(keychain.aKey.render('value')); // path:to:key:with:value
```

Registering a key to a `RedisKeychain` instance involves adding an alias-value pair to the `keys` configuration option

```javascript
{
    keys: {
        alias: value
    }
}
```

where `value` is an object having at least `name` and `type` properties. Optional properties are `fields`, `expiry`, `client`.

#### name <a name="key-name"></a>

Required. It is the name of the key in your Redis namespace.

It can be an actual name or a template.

Templates contain one or more placeholders known as fields.

Fields are indicated by brackets: `{field}`.

Fields can have global or key scope. 

Global fields are registered to a `RedisKeychain` instance adding an entry to the `fields` configuration option. More on this [here](#configuration-options-fields).

Key-scoped fields are implicitly registered if they appear in a key name and they are not already registered as global fields.

#### type <a name="key-type"></a>

Required. It is the type of the key in your Redis namespace.

It can be any string value in `hash`, `hyperloglog`, `list`, `set`, `string`, `zset`.

#### fields <a name="key-fields"></a>

Optional. Use `fields` to configure a key-scoped field.

In the following example a key scoped field, `yearMonth`, has a `Function` auto value.

```javascript
// module deps
var
    moment = require('moment'),
    RedisKeychain = require('node-redis-keychain');

var
    configure = function (config) {
        config.init({
            keys: {
                aKey: {
                    name: 'path:to:key:with:{yearMonth}',
                    type: 'string',
                    fields: {
                        field: {
                            auto: function () {
                                return moment().format('YYYYMM');
                            }
                        }
                    }
                }
            }
        });
    }
```

Configure key-scoped fields just like [global fields](#configuration-options-fields).

#### expiry <a name="key-expiry"></a>

Optional. It is the key's time to live.

It can be a reference to a [global expiry](#configuration-options-expiries) or the configuration of a key-scoped expiry.

Configure key-scoped expiries just like [global expiries](#configuration-options-expiries).

##### Refresh <a name="key-expiry-refresh"></a>

In the following example `aKey` with an expiry of `1 day` is registered to a `RedisKeychain` instance. The key is also bound to a client instance.

Every Redis write command will refresh the expiry upon [`Key#send()`](#key-send).

```javascript
// module deps
var
    redis = require('redis'),
    RedisKeychain = require('node-redis-keychain');

var
    configure = function (config) {
        config.init({
            clients: {
                cache: redis.createClient()
            },
            keys: {
                aKey: {
                    name: 'path:to:key',
                    type: 'string',
                    expiry: {
                        value: '1 day',
                        refresh: true
                    },
                    client: 'cache'
                }
            }
        });
    },

    keychain = RedisKeychain.forge(configure),

    aKey = keychain.aKey;

aKey.send().set('value', function (error, reply) {
    if (error) {
        throw error;
    }
    console.log(reply); // OK
});
```

#### client <a name="key-client"></a>

Optional. It is an alias to a client instance registered to the same `RedisKeychain` instance.

When you specify a `client` you enable the key-to-client binding feature and you can send commands to Redis using [`Key#send()`](#key-send) as follows

```javascript
// module deps
var
    redis = require('redis'),
    RedisKeychain = require('node-redis-keychain');

var
    configure = function (config) {
        config.init({
            clients: {
                cache: redis.createClient()
            },
            keys: {
                aKey: {
                    name: 'path:to:key:with:{field}',
                    type: 'string',
                    client: 'cache'
                }
            }
        });
    },

    keychain = RedisKeychain.forge(configure);

keychain.aKey.send('fieldValue').set('keyValue', function (error, reply) {
    if (error) {
        throw error;
    }
    console.log(reply); // OK
});
```

Key-to-client binding feature is library agnostic: you can use your Redis client library of choice.

Key-to-client binding feature has been tested using [node_redis](https://github.com/mranney/node_redis) and [ioredis](https://github.com/luin/ioredis).

#### `Key#render()` <a name="key-render"></a>

Invoke `Key#render` to render a key name template. Arguments to `Key#render` can be a list of field values or a single `Object` argument having field-value pairs.

```javascript
// module deps
var
    RedisKeychain = require('node-redis-keychain');

var
    configure = function (config) {
        config.init({
            keys: {
                aKey: {
                    name: 'path:to:key:with:{field1}:{field2}',
                    type: 'string'
                }
            }
        });
    },

    keychain = RedisKeychain.forge(configure),

    aKey = keychain.aKey;

// list of field values
console.log(aKey.render('value1', 'value2')); // path:to:key:with:value1:value2

// object having field-value pairs
console.log(aKey.render({ field1: 'value1', field2: 'value2' }));  // path:to:key:with:value1:value2
```

You can also invoke the shortcut method `Key#r()`.

#### `Key#send()` <a name="key-send"></a>

Invoke `Key#send()` to send a command to Redis using the client instance bound to the key. Arguments to `Key#send()` can be a list of field values or a single `Object` argument having field-value pairs to render the key name template.

```javascript
// module deps
var
    redis = require('redis'),
    RedisKeychain = require('node-redis-keychain');

var
    configure = function (config) {
        config.init({
            clients: {
                cache: redis.createClient()
            },
            keys: {
                aKey: {
                    name: 'path:to:key:with:{field}',
                    type: 'string',
                    client: 'cache'
                }
            }
        });
    },

    keychain = RedisKeychain.forge(configure);

keychain.aKey.send('fieldValue').set('keyValue', function (error, reply) {
    if (error) {
        throw error;
    }
    console.log(reply); // OK
});
```

You can also invoke the shorcut method `Key#s()`.

## Running tests <a name="running-tests"></a>

The test suite is split into two parts: unit tests and command tests. The unit tests run on any machine while the command tests require a Redis server instance to be setup.

Please, be aware that each and every command test need to flushall your Redis instance.

In order to prevent accidental flushall, command tests won't run if no `test/.flushall` file is found. So, remember to create an empty `.flushall` file into `test/` directory before running tests.

Run tests as follows

```
$ npm test
```

## License <a name="license"></a>

The project is licensed under the MIT license.

[npm-url]:https://npmjs.org/package/node-redis-keychain
[npm-image]:http://img.shields.io/npm/v/node-redis-keychain.svg
[david-dm-url]:https://david-dm.org/adriano-di-giovanni/node-redis-keychain
[david-dm-image]:https://david-dm.org/adriano-di-giovanni/node-redis-keychain.svg
[david-dm-dev-url]:https://david-dm.org/adriano-di-giovanni/node-redis-keychain#info=devDependencies
[david-dm-dev-image]:https://david-dm.org/adriano-di-giovanni/node-redis-keychain/dev-status.svg
[coveralls-url]:https://coveralls.io/r/adriano-di-giovanni/node-redis-keychain
[coveralls-image]:https://coveralls.io/repos/adriano-di-giovanni/node-redis-keychain/badge.svg
