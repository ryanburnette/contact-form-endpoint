'use strict';

var submit = require('./submit');

describe('submit',function () {
  test('sanity',function () {
    expect(submit).toBeInstanceOf(Function);
  });

  describe('validations',function () {
    test('success = true when valid',() => {
      demo.valid().then(result => expect(result.success).toBe(true));
    });
    test('result body is same as provided body',() => {
      demo.valid().then(result => expect(result.body).toEqual({
        name: 'Ryan Burnette',
        email: 'ryan.burnette@gmail.com'
      }));
    });
    test('validation not present',() => {
      demo.valid().then(result => expect(result.validation).toBeFalsy());
    });
  });

  describe('invalidating', function () {
    test('invalid because validation is present',() => {
      demo.invalid().then(result => expect(result).toHaveProperty('validation'));
    });
    test('validation accuration',() => {
      demo.invalid().then(result => expect(result.validation).toHaveProperty('email'));
    });
    test('invalid',() => {
      demo.invalid().then(result => expect(result.success).toBe(false));
    });
  });

  describe('unexpected data',() => {
    test('success false because of unexpected data in body',() => {
      demo.unexpectedData().then(result => expect(result).not.toBe(true));
    });
  });
});

var demo = {};

demo.valid = function () {
  var constraints = {
    name: {
      presence: {
        allowEmpty: false
      }
    },
    email: {
      presence: {
        allowEmpty: false
      },
      email: true
    }
  };

  var body = {
    name: 'Ryan Burnette',
    email: 'ryan.burnette@gmail.com'
  };

  return submit({constraints, body});
};

demo.invalid = function () {
  var constraints = {
    name: {
      presence: {
        allowEmpty: false
      }
    },
    email: {
      presence: {
        allowEmpty: false
      },
      email: true
    }
  };

  var body = {
    name: 'Ryan Burnette'
  };

  return submit({constraints, body});
};

demo.unexpectedData = function () {
  var constraints = {
    name: {
      presence: {
        allowEmpty: false
      }
    },
    email: {
      presence: {
        allowEmpty: false
      },
      email: true
    }
  };

  var body = {
    name: 'Ryan Burnette',
    xname: 'Ryan Burnette',
    email: 'ryan.burnette@gmail.com'
  };

  return submit({constraints, body});
};
