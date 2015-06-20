/* global expect */

'use strict';

module.exports = function (instance) {

  var
    Client = require('../lib/types/Client');

  describe('Client', function () {

    describe('instantiation', function () {

      it('should fail due to invalid alias argument', function () {
        expect(function () {
          return new Client();
        }).to.throw(TypeError, /Missing or invalid client alias, undefined/);
      });

      it('should fail due to invalid instance argument', function () {
        expect(function () {
          return new Client('aClient');
        }).to.throw(TypeError, /Missing or invalid client instance, undefined/);
      });

      it('should succeed', function () {

        var
          client = new Client('aClient', instance);

        expect(client.alias).to.equal('aClient');
        expect(client.instance).to.eql(instance);
      });
    });
  });
};
