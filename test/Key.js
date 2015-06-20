/* global expect */

'use strict';

module.exports = function (client) {

  var
    Config = require('../lib/types/Config'),
    Key = require('../lib/types/Key');

  describe('Key', function () {

    var
      config;

    beforeEach(function () {
      config = new Config();
    });

    it('shouldn\'t instantiate due to missing alias', function () {

      expect(function () {
        return new Key();
      }).to.throw(TypeError, /Missing or invalid key alias/);
    });

    it('shouldn\'t instantiate due to missing name', function () {

      expect(function () {
        var
          alias = 'aKey',
          options = {};
        return new Key(alias, options);
      }).to.throw(TypeError, /Missing or invalid name option/);
    });

    it('shouldn\'t instantiate due to missing type', function () {

      expect(function () {
        var
          alias = 'aKey',
          options = {
            name: 'path:to:key'
          };
        return new Key(alias, options);
      }).to.throw(TypeError, /Missing or invalid type option/);
    });

    it('shouldn\'t instantiate due to missing config', function () {

      expect(function () {
        var
          alias = 'aKey',
          options = {
            name: 'path:to:key',
            type: 'string'
          };
        return new Key(alias, options);
      }).to.throw(TypeError, /Missing or invalid config/);
    });

    it('should render a key w/o fields', function () {

      var
        alias = 'aKey',
        options = {
          name: 'path:to:key',
          type: 'string'
        },
        key = new Key(alias, options, config);

      expect(key.render()).to.equal(options.name);
      expect(key.r()).to.equal(options.name);

      expect(key.render(1)).to.equal(options.name);
    });

    it('shouldn\'t instantiate due to duplicate field name', function () {

      var
        alias = 'aKey',
        options = {
          name: 'path:to:key:{?}:{?}',
          type: 'string',
          fields: {
            '?': {
              type: String
            }
          }
        };

      expect(function (){
        return new Key(alias, options, config);
      }).to.throw(Error, /Duplicate field name/);
    });

    it('shouldn\'t render due to incomplete params', function () {

      var
        alias = 'aKey',
        options = {
          name: 'path:to:key:{x}',
          type: 'string',
          fields: {
            'x': {
              type: String
            }
          }
        },
        key = new Key(alias, options, config);

      expect(function () {
        return key.render();
      }).to.throw(Error, /Missing or invalid value/);
    });

    it('should render w/ params as argument list', function () {

      var
        alias = 'aKey',
        options = {
          name: 'path:to:key:{x}:{y}',
          type: 'string',
          fields: {
            'x': {
              type: String
            },
            'y': {
              type: String
            }
          }
        },
        key = new Key(alias, options, config);

      expect(key.render('a', 'b')).to.equal('path:to:key:a:b');
    });

    it('should render w/ params as object', function () {

      var
        alias = 'aKey',
        options = {
          name: 'path:to:key:{x}:{y}',
          type: 'string',
          fields: {
            'x': {
              type: String
            },
            'y': {
              type: String
            }
          }
        },
        key = new Key(alias, options, config);

      expect(key.render({ x: 'a', y: 'b' })).to.equal('path:to:key:a:b');
    });

    it('shouldn\'t render due to field auto override', function () {

      var
        alias = 'aKey',
        options = {
          name: 'path:to:key:{x}:{y}',
          type: 'string',
          fields: {
            'x': {
              type: String,
              auto: 'a'
            },
            'y': {
              type: String
            }
          }
        },
        key = new Key(alias, options, config);

      expect(function () {
        return key.render({ x: 'a', y: 'b' });
      }).to.throw(Error, 'Can\'t override auto value');
    });

    it('should render w/ fields having auto', function () {

      var
        options = {
          name: 'path:to:key:{x}:{y}',
          type: 'string',
          fields: {
            'x': {
              type: String,
              auto: 'a'
            },
            'y': {
              type: String
            }
          }
        },
        alias = 'key',
        key = new Key(alias, options, config);

      expect(key.render({ y: 'b' })).to.equal('path:to:key:a:b');
    });

    it('shouldn\'t instantiate due to global field override', function () {

      config.init({
        fields: {
          global: {
            type: String,
            auto: 'a'
          }
        }
      });

      var
        alias = 'aKey',
        options = {
          name: 'path:to:key:{global}',
          type: 'string',
          fields: {
            global: {
              type: Number
            }
          }
        };

      expect(function () {
        return new Key(alias, options, config);
      }).to.throw(Error, 'Can\'t override properties of global field');
    });

    it('shouldn\'t render due to global field override', function () {

      config.init({
        fields: {
          global: {
            type: String,
            auto: 'a'
          }
        }
      });

      var
        options = {
          name: 'path:to:key:{global}',
          type: 'string'
        },
        alias = 'key',
        key = new Key(alias, options, config);

      expect(function () {
        return key.render('a');
      }).to.throw(Error, 'Can\'t override auto value');
    });

    it('should render w/ global fields', function () {

      config.init({
        fields: {
          global: {
            type: String,
            auto: 'a'
          }
        }
      });

      var
        options = {
          name: 'path:to:key:{global}',
          type: 'string'
        },
        alias = 'key',
        key = new Key(alias, options, config);

      expect(key.render()).to.equal('path:to:key:a');
    });

    it('should return correct expiry', function () {

      var
        alias = 'aKey',
        options = {
          name: 'path:to:key',
          type: 'string',
          expiry: '1 hour'
        },
        key = new Key(alias, options, config);

      expect(key.expiry).to.equal(1000 * 60 * 60);
    });

    it('should return correct global expiry', function () {

      config.init({
        expiries: {
          global: '1 hour'
        }
      });

      var
        options = {
          name: 'path:to:key',
          type: 'string',
          expiry: 'global'
        },
        alias = 'key',
        key = new Key(alias, options, config);

      expect(key.expiry).to.equal(1000 * 60 * 60);
    });

    it('shouldn\'t instantiate due to missing client', function () {

      var
        options = {
          name: 'path:to:key',
          type: 'string',
          client: 'global'
        },
        alias = 'key';

      expect(function () {
        return new Key(alias, options, config);
      }).to.throw(TypeError, /Missing client/);
    });

    it('should return correct client', function () {

      config.init({
        clients: {
          global: client
        }
      });

      var
        options = {
          name: 'path:to:key',
          type: 'string',
          client: 'global'
        },
        alias = 'key',
        key = new Key(alias, options, config);

      expect(key.client).to.equal(client);
    });
  });
};
