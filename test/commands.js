/* global expect */
/* eslint no-unused-expressions:0 */

'use strict';

// module deps
var
  async = require('async'),
  Redis = require('ioredis');


// file deps
var
  RedisKeychain = require('../');

module.exports = function (instance) {

  /**
   * @todo report in README.md
   */
  var
    flushAll = (function () {

      // core deps
      var
        fs = require('fs'),
        path = require('path');

      var
        filepath = path.resolve(__dirname, './.flushall'),
        exists = fs.existsSync(filepath);

      return exists ?
        function flushAll(done) {
          return instance.flushall(done);
        } :
        function (done) { done(); };
    }());

  describe('commands', function () {

    describe('string', function () {

      var
        keychain,
        key1;

      before(function () {

        keychain = RedisKeychain.forge(function (config) {

          config.init({

            clients: {
              aClient: instance
            },

            keys: {
              aKey: {
                name: 'key',
                type: 'string',
                client: 'aClient'
              }
            }
          });
        });

        key1 = keychain.aKey;
      });

      beforeEach(function (done) {
        flushAll(done);
      });

      it('append', function (done) {

        var
          value = 'append';

        key1.s().append(value, function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(value.length);

          done();
        });
      });

      it('bitcount', function (done) {

        key1.s().bitcount(function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('bitop', function () {

        expect(key1.s().bitop).to.be.undefined;
      });

      it('bitpos', function (done) {

        key1.s().bitpos(0, function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('decr', function (done) {

        key1.s().decr(function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(-1);

          done();
        });
      });

      it('decrby', function (done) {

        key1.s().decrby(10, function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(-10);

          done();
        });
      });

      it('get', function (done) {

        key1.s().get(function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.be.null;

          done();
        });
      });

      it('getbit', function (done) {

        key1.s().getbit(0, function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('getrange', function (done) {

        async.series(
          [

            function (callback) {

              key1.s().set('string', function () {
                callback();
              });
            },

            function (callback) {

              key1.s().getrange(0, 2, function (error, reply) {

                expect(error).to.be.null;
                expect(reply).to.equal('str');

                callback();
              });
            }
          ],
          function () {
            done();
          }
        );
      });

      it('getset', function (done) {

        key1.s().getset('string', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.be.null;

          done();
        });
      });

      it('incr', function (done) {

        key1.s().incr(function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(1);

          done();
        });
      });

      it('incrby', function (done) {

        key1.s().incrby(10, function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(10);

          done();
        });
      });

      it('incrbyfloat', function (done) {

        key1.s().incrbyfloat(10.5, function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal('10.5');

          done();
        });
      });

      it('mget', function (done) {
        key1.s().mget(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.eql([ null ]);
          done();
        });
      });

      it('mset', function (done) {
        key1.s().mset('value', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal('OK');
          done();
        });
      });

      it('msetnx', function (done) {
        key1.s().msetnx('value', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(1);
          done();
        });
      });

      it('psetex', function (done) {

        key1.s().psetex(1000, 'string', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal('OK');

          done();
        });
      });

      it('set', function (done) {

        key1.s().set('string', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal('OK');

          done();
        });
      });

      it('setbit', function (done) {

        key1.s().setbit(0, 1, function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('setex', function (done) {

        key1.s().setex(1, 'string', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal('OK');

          done();
        });
      });

      it('setnx', function (done) {

        key1.s().setnx('string', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(1);

          done();
        });
      });

      it('setrange', function (done) {

        key1.s().setrange(0, 'string', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(6);

          done();
        });
      });

      it('strlen', function (done) {

        key1.s().strlen(function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });
    });

    describe('zset', function () {

      var
        keychain,
        key1;

      before(function () {

        keychain = RedisKeychain.forge(function (config) {

          config.init({

            clients: {
              aClient: instance
            },

            keys: {
              aKey: {
                name: 'key',
                type: 'zset',
                client: 'aClient'
              }
            }
          });
        });

        key1 = keychain.aKey;
      });

      beforeEach(function (done) {
        flushAll(done);
      });

      it('zadd', function (done) {

        key1.s().zadd(1, 'member', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(1);

          done();
        });
      });

      it('zcard', function (done) {

        key1.s().zcard(function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('zcount', function (done) {

        key1.s().zcount('-inf', '+inf', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('zincrby', function (done) {

        key1.s().zincrby(10, 'member', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal('10');

          done();
        });
      });

      it('zinterstore', function () {

        expect(key1.s().zinterstore).to.be.undefined;
      });

      it('zlexcount', function (done) {

        key1.s().zlexcount('-', '+', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('zrange', function (done) {

        key1.s().zrange(0, -1, function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.eql([]);

          done();
        });
      });

      it('zrangebylex', function (done) {

        key1.s().zrangebylex('-', '+', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.eql([]);

          done();
        });
      });

      it('zrangebyscore', function (done) {

        key1.s().zrangebyscore('-inf', '+inf', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.eql([]);

          done();
        });
      });

      it('zrank', function (done) {

        key1.s().zrank('member', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.be.null;

          done();
        });
      });

      it('zrem', function (done) {

        key1.s().zrem('member', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('zremrangebylex', function (done) {

        key1.s().zremrangebylex('-', '+', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('zremrangebyrank', function (done) {

        key1.s().zremrangebyrank(0, -1, function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('zremrangebyscore', function (done) {

        key1.s().zremrangebyscore('-inf', '+inf', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('zrevrange', function (done) {

        key1.s().zrevrange(0, -1, function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.eql([]);

          done();
        });
      });

      /**
       * @todo update node-redis-commands
       */
      it.skip('zrevrangebylex', function (done) {

        key1.s().zrevrangebylex('-', '+', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.eql([]);

          done();
        });
      });

      it('zrevrangebyscore', function (done) {

        key1.s().zrevrangebyscore('-inf', '+inf', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.eql([]);

          done();
        });
      });

      it('zrevrank', function (done) {

        key1.s().zrevrank('member', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.be.null;

          done();
        });
      });

      /**
       * @todo export streamified version
       */
      it('zscan', function (done) {

        key1.s().zscan(0, function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.be.eql([ '0', [] ]);

          done();
        });
      });

      it('zscore', function (done) {

        key1.s().zscore('member', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.be.null;

          done();
        });
      });

      it('zunionstore', function () {

        expect(key1.s().zunionstore).to.be.undefined;
      });
    });

    describe('set', function () {

      var
        keychain,
        key1,
        key2,
        key3;

      before(function () {

        keychain = RedisKeychain.forge(function (config) {

          config.init({

            clients: {
              client: instance
            },

            keys: {
              key1: {
                name: 'key1',
                type: 'set',
                client: 'client'
              },
              key2: {
                name: 'key2',
                type: 'set',
                client: 'client'
              },
              key3: {
                name: 'key3',
                type: 'set',
                client: 'client'
              }
            }
          });
        });

        key1 = keychain.key1;
        key2 = keychain.key2;
        key3 = keychain.key3;
      });

      beforeEach(function (done) {
        flushAll(done);
      });

      it('sadd', function (done) {

        key1.s().sadd('member', function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(1);

          done();
        });
      });

      it('scard', function (done) {

        key1.s().scard(function (error, reply) {

          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('sdiff', function (done) {
        async.series(
          [
            function (callback) {
              key1.s().sadd('a', 'b', 'c', 'd', function (error) {
                callback(error);
              });
            },
            function (callback) {
              key2.s().sadd('c', function (error) {
                callback(error);
              });
            },
            function (callback) {
              key1.s().sdiff(key2.r(), function (error, reply) {
                expect(error).to.be.null;
                expect(reply).to.be.instanceof(Array);
                callback(error);
              });
            }
          ],
          function (error) {
            done(error);
          }
        );
      });

      it('sdiffstore', function (done) {
        async.series(
          [
            function (callback) {
              key1.s().sadd('a', 'b', 'c', 'd', function (error) {
                callback(error);
              });
            },
            function (callback) {
              key2.s().sadd('c', function (error) {
                callback(error);
              });
            },
            function (callback) {
              key3.s().sdiffstore(key1.r(), key2.r(), function (error, reply) {
                expect(error).to.be.null;
                expect(reply).to.equal(3);
                callback(error);
              });
            }
          ],
          function (error) {
            done(error);
          }
        );
      });

      it('sinter', function (done) {
        async.series(
          [
            function (callback) {
              key1.s().sadd('a', 'b', 'c', 'd', function (error) {
                callback(error);
              });
            },
            function (callback) {
              key2.s().sadd('c', function (error) {
                callback(error);
              });
            },
            function (callback) {
              key1.s().sinter(key2.r(), function (error, reply) {
                expect(error).to.be.null;
                expect(reply).to.be.instanceof(Array);
                callback(error);
              });
            }
          ],
          function (error) {
            done(error);
          }
        );
      });

      it('sinterstore', function (done) {
        async.series(
          [
            function (callback) {
              key1.s().sadd('a', 'b', 'c', 'd', function (error) {
                callback(error);
              });
            },
            function (callback) {
              key2.s().sadd('c', function (error) {
                callback(error);
              });
            },
            function (callback) {
              key3.s().sinterstore(key1.r(), key2.r(), function (error, reply) {
                expect(error).to.be.null;
                expect(reply).to.equal(1);
                callback(error);
              });
            }
          ],
          function (error) {
            done(error);
          }
        );
      });

      it('sismember', function (done) {
        key1.s().sismember('member', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('smembers', function (done) {
        key1.s().smembers(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.eql([]);

          done();
        });
      });

      it('smove', function () {
        expect(key1.s().smove).to.be.undefined;
      });

      it('spop', function (done) {
        key1.s().spop(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.be.null;

          done();
        });
      });

      it('srandmember', function (done) {
        key1.s().srandmember(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.be.null;

          done();
        });
      });

      it('srem', function (done) {
        key1.s().srem('member', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);

          done();
        });
      });

      it('sunion', function (done) {
        async.series(
          [
            function (callback) {
              key1.s().sadd('a', 'b', 'c', 'd', function (error) {
                callback(error);
              });
            },
            function (callback) {
              key2.s().sadd('e', function (error) {
                callback(error);
              });
            },
            function (callback) {
              key1.s().sunion(key2.r(), function (error, reply) {
                expect(error).to.be.null;
                expect(reply).to.be.instanceof(Array);
                callback(error);
              });
            }
          ],
          function (error) {
            done(error);
          }
        );
      });

      it('sunionstore', function (done) {
        async.series(
          [
            function (callback) {
              key1.s().sadd('a', 'b', 'c', 'd', function (error) {
                callback(error);
              });
            },
            function (callback) {
              key2.s().sadd('e', function (error) {
                callback(error);
              });
            },
            function (callback) {
              key3.s().sunionstore(key1.r(), key2.r(), function (error, reply) {
                expect(error).to.be.null;
                expect(reply).to.equal(5);
                callback(error);
              });
            }
          ],
          function (error) {
            done(error);
          }
        );
      });

      it('sscan', function (done) {
        key1.s().sscan(0, function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.be.eql([ '0', [] ]);
          done();
        });
      });
    });

    describe('list', function () {

      var
        keychain,
        key1;

      before(function () {

        keychain = RedisKeychain.forge(function (config) {

          config.init({

            clients: {
              aClient: instance
            },

            keys: {
              aKey: {
                name: 'key',
                type: 'list',
                client: 'aClient'
              }
            }
          });
        });

        key1 = keychain.aKey;
      });

      beforeEach(function (done) {
        flushAll(done);
      });

      it.skip('blpop', function (done) {
        key1.s().blpop(1, function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.be.null;
          done();
        });
      });

      it('brpop', function (done) {
        key1.s().brpop(1, function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.be.null;
          done();
        });
      });

      it('brpoplpush', function () {
        expect(key1.s().brpoplpush).to.be.undefined;
      });

      it('lindex', function (done) {
        key1.s().lindex(0, function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.be.null;
          done();
        });
      });

      it('linsert', function (done) {
        key1.s().linsert('BEFORE', 'pivot', 'value', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('llen', function (done) {
        key1.s().llen(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('lpop', function (done) {
        key1.s().lpop(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.be.null;
          done();
        });
      });

      it('lpush', function (done) {
        key1.s().lpush('element', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(1);
          done();
        });
      });

      it('lpushx', function (done) {
        key1.s().lpushx('element', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('lrange', function (done) {
        key1.s().lrange(0, -1, function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.eql([]);
          done();
        });
      });

      it('lrem', function (done) {
        key1.s().lrem(0, 'value', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('lset', function (done) {
        key1.s().lset(0, 'value', function (error, reply) {
          expect(error).to.be.instanceof(Error);
          expect(reply).to.be.undefined;
          done();
        });
      });

      it('ltrim', function (done) {
        key1.s().ltrim(0, -1, function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal('OK');
          done();
        });
      });

      it('rpop', function (done) {
        key1.s().rpop(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.be.null;
          done();
        });
      });

      it('rpoplpush', function() {
        expect(key1.s().rpoplpush).to.be.undefined;
      });

      it('rpush', function (done) {
        key1.s().rpush('element', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(1);
          done();
        });
      });

      it('rpushx', function (done) {
        key1.s().rpushx('element', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });
    });

    describe('key', function () {

      var
        keychain,
        key1;

      before(function () {

        keychain = RedisKeychain.forge(function (config) {

          config.init({

            clients: {
              aClient: instance
            },

            keys: {
              aKey: {
                name: 'key',
                type: 'string',
                client: 'aClient'
              }
            }
          });
        });

        key1 = keychain.aKey;
      });

      beforeEach(function (done) {
        flushAll(done);
      });

      it('del', function (done) {
        key1.s().del(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('dump', function (done) {
        key1.s().dump(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.be.null;
          done();
        });
      });

      it('exists', function (done) {
        key1.s().exists(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('expire', function (done) {
        key1.s().expire(1, function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('expireat', function (done) {
        key1.s().expireat(Date.now(), function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('keys', function () {
        expect(key1.s().keys).to.be.undefined;
      });

      it('migrate', function () {
        expect(key1.s().migrate).to.be.undefined;
      });

      it('move', function (done) {
        key1.s().move(1, function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('object', function () {
        expect(key1.s().object).to.be.undefined;
      });

      it('persist', function (done) {
        key1.s().persist(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('pexpire', function (done) {
        key1.s().pexpire(1000, function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('pexpireat', function (done) {
        key1.s().pexpireat(Date.now() * 1000, function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('pttl', function (done) {
        key1.s().pttl(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(-2);
          done();
        });
      });

      it('randomkey', function () {
        expect(key1.s().randomkey).to.be.undefined;
      });

      it('rename', function () {
        expect(key1.s().rename).to.be.undefined;
      });

      it('renamenx', function () {
        expect(key1.s().renamenx).to.be.undefined;
      });

      it.skip('restore', function (done) {

        var
          dump;

        async.series(
          [
            function (callback) {
              key1.s().set('value', function (error, reply) {
                callback(error, reply);
              });
            },
            function (callback) {
              key1.s().dump(function (error, reply) {
                dump = reply;
                callback(error, reply);
              });
            },
            function (callback) {
              key1.s().restore(0, dump, 'REPLACE', function (error, reply) {
                expect(error).to.be.null;
                expect(reply).to.equal('OK');
                callback(error, reply);
              });
            }
          ],
          function (error) {
            expect(error).to.be.null;
            done();
          }
        );
      });

      it('scan', function () {
        expect(key1.s().scan).to.be.undefined;
      });

      /**
       * todo should test on list, set and zset
       */
      it('sort', function () {
        expect(key1.s().sort).to.be.undefined;
      });

      it('ttl', function (done) {
        key1.s().ttl(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(-2);
          done();
        });
      });

      it('wait', function () {
        expect(key1.s().wait).to.be.undefined;
      });
    });

    describe('hyperloglog', function () {

      var
        keychain,
        key1,
        key2,
        key3;

      before(function () {

        keychain = RedisKeychain.forge(function (config) {

          config.init({

            clients: {
              client: instance
            },

            keys: {
              key1: {
                name: 'key1',
                type: 'hyperloglog',
                client: 'client'
              },
              key2: {
                name: 'key2',
                type: 'hyperloglog',
                client: 'client'
              },
              key3: {
                name: 'key3',
                type: 'hyperloglog',
                client: 'client'
              }
            }
          });
        });

        key1 = keychain.key1;
        key2 = keychain.key2;
        key3 = keychain.key3;
      });

      beforeEach(function (done) {
        flushAll(done);
      });

      it('pfadd', function (done) {
        key1.s().pfadd('element', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(1);
          done();
        });
      });

      it('pfcount', function (done) {
        key1.s().pfcount(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('pfmerge', function (done) {
        async.series(
          [
            function (callback) {
              key1.s().pfadd('foo', 'bar', 'zap', 'a', function (error, reply) {
                expect(error).to.be.null;
                expect(reply).to.equal(1);
                callback(error);
              });
            },
            function (callback) {
              key2.s().pfadd('a', 'b', 'c', 'foo', function (error, reply) {
                expect(error).to.be.null;
                expect(reply).to.equal(1);
                callback();
              });
            },
            function (callback) {
              key3.s().pfmerge(key1.r(), key2.r(), function (error, reply) {
                expect(error).to.be.null;
                expect(reply).to.equal('OK');
                callback(error);
              });
            }
          ],
          function (error) {
            done(error);
          }
        );
      });
    });

    describe('hash', function () {

      var
        keychain,
        key1;

      before(function () {

        keychain = RedisKeychain.forge(function (config) {

          config.init({

            clients: {
              aClient: instance
            },

            keys: {
              aKey: {
                name: 'key',
                type: 'hash',
                client: 'aClient'
              }
            }
          });
        });

        key1 = keychain.aKey;
      });

      beforeEach(function (done) {
        flushAll(done);
      });

      it('hdel', function (done) {
        key1.s().hdel('field', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('hexists', function (done) {
        key1.s().hexists('field', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('hget', function (done) {
        key1.s().hget('field', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.be.null;
          done();
        });
      });

      it('hgetall', function (done) {
        key1.s().hgetall(function (error, reply) {
          expect(error).to.be.null;
          if (instance instanceof Redis) {
            expect(reply).to.eql({});
          } else {
            expect(reply).to.be.null;
          }
          done();
        });
      });

      it('hincrby', function (done) {
        key1.s().hincrby('field', 1, function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(1);
          done();
        });
      });

      it('hincrbyfloat', function (done) {
        key1.s().hincrbyfloat('field', 10.5, function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal('10.5');
          done();
        });
      });

      it('hkeys', function (done) {
        key1.s().hkeys(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.eql([]);
          done();
        });
      });

      it('hlen', function (done) {
        key1.s().hlen(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal(0);
          done();
        });
      });

      it('hmget', function (done) {
        key1.s().hmget('field', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.eql([ null ]);
          done();
        });
      });

      it('hmset', function (done) {
        key1.s().hmset('field', 'value', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.equal('OK');
          done();
        });
      });

      it('hscan', function (done) {
        key1.s().hscan(0, function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.eql([ '0', [] ]);
          done();
        });
      });

      it('hset', function (done) {
        key1.s().hset('field', 'value', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.eql(1);
          done();
        });
      });

      it('hsetnx', function (done) {
        key1.s().hsetnx('field', 'value', function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.eql(1);
          done();
        });
      });

      it('hstrlen', function () {
        expect(key1.s().hstrlen).to.be.undefined;
      });

      it('hvals', function (done) {
        key1.s().hvals(function (error, reply) {
          expect(error).to.be.null;
          expect(reply).to.eql([]);
          done();
        });
      });
    });
    //
  });
};
