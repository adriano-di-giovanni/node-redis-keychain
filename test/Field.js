/* global expect */
/* eslint no-unused-expressions: 0 */

'use strict';

module.exports = function () {

  var
    Config = require('../lib/types/Config'),
    Field = require('../lib/types/Field');

  describe('Field', function () {

    var
      config,
      key;

    before(function () {
      config = new Config();
      config.init({
        keys: {
          aKey: {
            name: 'path:to:key',
            type: 'string'
          }
        }
      });
      key = config.keys.aKey;
    });

    it('shouldn\'t instantiate due to invalid name argument', function () {
      expect(function () {
        return new Field();
      }).to.throw(TypeError, /Missing or invalid name/);
    });

    it('shouldn\'t instantiate due to invalid options argument', function () {

      var
        name = 'aField';

      expect(function () {
        return new Field(name);
      }).to.throw(TypeError, /Missing or invalid options/);
    });

    it('should manage invalid type', function () {
      var
        name = 'aField',
        options = {
          type: []
        };
      expect(function () {
        return new Field(name, options, key);
      }).to.throw(TypeError, /Missing or invalid type option/);
    });

    it('should manage invalid auto', function () {
      var
        name = 'aField',
        options = {
          auto: []
        };
      expect(function () {
        return new Field(name, options, key);
      }).to.throw(TypeError, /Missing or invalid auto option/);
    });

    it('should manage invalid process', function () {
      var
        name = 'aField',
        options = {
          process: []
        };
      expect(function () {
        return new Field(name, options, key);
      }).to.throw(TypeError, /Missing or invalid process option/);
    });

    it('should manage invalid validate', function () {
      var
        name = 'aField',
        options = {
          validate: []
        };
      expect(function () {
        return new Field(name, options, key);
      }).to.throw(TypeError, /Missing or invalid validate option/);
    });

    it('should return correct type', function () {
      var
        name = 'aField',
        type = String,
        options = {
          type: type
        },
        field = new Field(name, options, key);

      expect(field.type).to.equal(type);
    });

    it('should return correct Boolean auto', function () {
      var
        name = 'aField',
        auto = true,
        options = {
          auto: auto
        },
        field = new Field(name, options, key);

      expect(field.hasAuto).to.be.true;
      expect(field.auto).to.equal(auto);
    });

    it('should fail due to Function auto returing invalid value', function () {
      var
        name = 'aField',
        auto = function () {
          return [];
        },
        options = {
          auto: auto
        },
        field = new Field(name, options, key);

        expect(function () {
          return field.auto;
        }).to.throw(TypeError, /Missing or invalid auto value/);
    });

    it('should return correct Function auto', function () {
      var
        name = 'aField',
        value = true,
        auto = function () {
          return value;
        },
        options = {
          auto: auto
        },
        field = new Field(name, options, key);

      expect(field.auto).to.equal(value);
    });

    it('should return correct Number auto', function () {
      var
        name = 'aField',
        auto = 1,
        options = {
          auto: auto
        },
        field = new Field(name, options, key);

      expect(field.auto).to.equal(auto);
    });

    it('should return correct String auto', function () {
      var
        name = 'aField',
        auto = 'string',
        options = {
          auto: auto
        },
        field = new Field(name, options, key);

      expect(field.auto).to.equal(auto);
    });

    it('should process', function () {
      var
        name = 'aField',
        input = 1,
        output = 'OK',
        process = function (value) {
          expect(value).to.equal(input);
          return output;
        },
        options = {
          process: process
        },
        field = new Field(name, options, key);

      expect(field.process(input)).to.equal(output);
    });

    it('should fail due to validate function returing invalid value', function () {
      var
        name = 'aField',
        validate = function () {
          return [];
        },
        options = {
          validate: validate
        },
        field = new Field(name, options, key);

      expect(function () {
        field.validate(1);
      }).to.throw(TypeError, /Missing or invalid validate return value/);
    });
  });
};
