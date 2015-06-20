/* global expect */

'use strict';

module.exports = function (instance) {

  var
    Config = require('../lib/types/Config');

  describe('Config', function () {

    var config;

    beforeEach(function () {
      config = new Config();
    });

    it('shouldn\'t initialize due to missing options', function () {

      expect(function () {
        return config.init();
      }).to.throw(TypeError, /Missing or invalid options/);
    });

    it('should initialize with clients', function () {

      config.init({
        clients: {
          'aClient': instance
        }
      });

      expect(config.clients.aClient.instance).to.eql(instance);
    });

    it('should initialize with expiries', function () {

      config.init({
        expiries: {
          'anExpiry': '1 hour'
        }
      });

      expect(config.expiries.anExpiry.value).to.equal(1000 * 60 * 60);
    });

    it('should initialize with fields', function () {

      config.init({
        fields: {
          'aField': {
            auto: 'value'
          }
        }
      });

      expect(config.fields.aField.auto).to.equal('value');
    });

    it('should initialize with keys', function () {

      config.init({
        keys: {
          'aKey': {
            name: 'path:to:key',
            type: 'string'
          }
        }
      });

      expect(config.keys.aKey.name).to.equal('path:to:key');
    });
  });
};
