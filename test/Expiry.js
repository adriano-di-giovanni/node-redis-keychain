/* global expect */

'use strict';

module.exports = function () {

  var
    Expiry = require('../lib/types/Expiry');

  describe('Expiry', function () {

    it('shouldn\'t instantiate due to invalid alias argument', function () {
      expect(function () {
        return new Expiry();
      }).to.throw(TypeError, /Missing or invalid alias/);
    });

    it('shouldn\'t instantiate due to invalid options argument', function () {
      expect(function () {
        return new Expiry('anExpiry');
      }).to.throw(TypeError, /Missing or invalid options/);
    });

    it('should manage a Date options argument', function () {
      var
        alias = 'anExpiry',
        options = new Date(),
        expiry = new Expiry(alias, options);

      expect(expiry.alias).to.equal(alias);
      expect(expiry.value).to.eql(options);
      expect(expiry.refresh).to.equal(false);
    });

    it('should manage a Function options argument returning invalid value', function () {
      var
        alias = 'anExpiry',
        options = function () { return void 0; },
        expiry = new Expiry(alias, options);

      expect(expiry.alias).to.equal(alias);
      expect(function () {
        return expiry.value;
      }).to.throw(TypeError, /Missing or invalid value/);
      expect(expiry.refresh).to.equal(false);
    });

    it('should manage a Function options argument returning valid value', function () {
      var
        alias = 'anExpiry',
        date = new Date(),
        options = function () { return date; },
        expiry = new Expiry(alias, options);

      expect(expiry.alias).to.equal(alias);
      expect(expiry.value).to.eql(date);
      expect(expiry.refresh).to.equal(false);
    });

    it('should manage a Number options argument', function () {
      var
        alias = 'anExpiry',
        options = 1,
        expiry = new Expiry(alias, options);

      expect(expiry.alias).to.equal(alias);
      expect(expiry.value).to.eql(options);
      expect(expiry.refresh).to.equal(false);
    });

    it('should manage a String options argument', function () {
      var
        alias = 'anExpiry',
        options = '1 hour',
        expiry = new Expiry(alias, options);

      expect(expiry.alias).to.equal(alias);
      expect(expiry.value).to.eql(1000 * 60 * 60);
      expect(expiry.refresh).to.equal(false);
    });

    it('should manage an Object options argument', function () {
      var
        alias = 'anExpiry',
        date = new Date(),
        options = {
          value: date,
          refresh: true
        },
        expiry = new Expiry(alias, options);

      expect(expiry.alias).to.equal(alias);
      expect(expiry.value).to.eql(date);
      expect(expiry.refresh).to.equal(true);
    });
  });
};
