/* global expect */
/* eslint no-unused-expressions:0 */

'use strict';

// module deps
var
    _ = require('underscore'),
    moment = require('moment'),
    redis = require('redis'),
    Redis = require('ioredis'),
    RedisKeychain = require('../');

module.exports = function () {

    describe.only('examples', function () {

        it('configuration+instantiation+usage', function (done) {

            var
                after = _.after(2, done);

            var
                configure = function configure(config) {
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
                },

                keychain = RedisKeychain.forge(configure);

            // centralize access to your Redis clients
            keychain.clients.cache.dbsize(function (error, reply) {
                if (error) {
                    throw error;
                }
                console.log(reply); // number of keys in db 0
                after();
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
                    after();
                });
        });

        it('clients', function (done) {

            var
                after = _.after(2, done);

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
                after();
            });

            keychain.clients.persistent.dbsize()
                .then(function (reply) {
                    console.log(reply); // number of keys in db 1
                    after();
                });
        });

        it('expiries', function () {
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
        });

        it('fields', function () {
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
        });

        it('keys', function () {
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
        });

        it('refresh', function (done) {
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
                done();
            });
        });

        it('client', function (done) {
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
                done();
            });
        });

        it('Key#render', function () {
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
        });

        it('Key#send', function () {
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
        });
    });
};
