'use strict';

// module deps
var
  redis = require('redis'),
  Redis = require('ioredis');

global.expect = require('chai').expect;

describe('Unit tests', function () {

  describe('client independent', function () {
    require('./Expiry')();
    require('./Field')();
    // require('./examples')();
  });

  describe('redis', function () {
    var
      client = redis.createClient();

    require('./Client')(client);
    require('./Key')(client);
    require('./Config')(client);
    require('./commands')(client);
  });

  describe('ioredis', function () {
    var
      client = new Redis();

    require('./Client')(client);
    require('./Key')(client);
    require('./Config')(client);
    require('./commands')(client);
  });
});
