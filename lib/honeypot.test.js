/* global describe */
/* global it */
/* global expect */

'use strict';

var honeypot = require('./honeypot');

describe('#honeypot()', function() {
  it('return false when no extra attrs are present', function() {
    expect(
      honeypot(
        {
          a: {},
          b: {}
        },
        {
          a: '',
          b: ''
        }
      )
    ).toBeFalsy();
  });

  it('return true when extra attrs are present', function() {
    expect(
      honeypot(
        {
          a: {},
          b: {}
        },
        {
          a: '',
          b: '',
          c: ''
        }
      )
    ).toBeTruthy();
  });
});
