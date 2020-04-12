'use strict';

module.exports = function (constraints, body) {
  var contraintKeys = Object.keys(constraints);
  var bodyKeys = Object.keys(body);
  return bodyKeys.reduce(function (f, el) {
    if (!contraintKeys.includes(el)) {
      return true;
    }
    return false;
  }, false);
};
