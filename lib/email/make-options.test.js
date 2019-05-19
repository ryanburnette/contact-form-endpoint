'use strict';

var makeOptions = require('./make-options');
var merge = require('@ryanburnette/merge');

var notification = {
  to: 'sender',
  from: 'Team <no-reply@example.com>',
  subject: 'Test',
  html: 'auto',
  text: 'auto'
};

var body = {
  name: 'Ryan Burnette',
  email: 'ryan.burnette@gmail.com',
  message: 'Hello, this is Ryan.',
  marketing: true
};

test('sanity',function () {
  expect(makeOptions).toBeInstanceOf(Function);
});

test('from',function () {
  makeOptions({notification,body})
    .then(function (options) {
      expect(options.from).toBe(notification.from);
    });
});

test('to sender',function () {
  makeOptions({notification,body})
    .then(function (options) {
      expect(options.to).toBe('Ryan Burnette <ryan.burnette@gmail.com>');
    });
});

test('reply-to not provided',function () {
  makeOptions({notification,body})
    .then(function (options) {
      expect(options).not.toHaveProperty('reply-to');
      expect(options).not.toHaveProperty('h:reply-to');
    });
});

test('reply-to provided',function () {
  var ry = 'Ryan Burnette <ryan.burnette@gmail.com>';
  var r = { 'reply-to': ry };
  var _notification = merge(notification,r);
  makeOptions({notification:_notification,body})
    .then(function (options) {
      expect(options).not.toHaveProperty('reply-to');
      expect(options['h:Reply-To']).toBe(ry);
    });
});

test('html',function () {
  makeOptions({notification,body})
    .then(function (options) {
      expect(options.html).toMatch(`<p>name: ${body.name}`);
    });
});

test('html with provided template',function () {
  var r = {
    html: '<p>foo: <%= body.name %></p>'
  };
  var _notification = merge(notification,r);
  makeOptions({notification:_notification,body})
    .then(function (options) {
      expect(options.html).toMatch(`<p>foo: ${body.name}`);
    });
});

test('html with provided template and data', function () {
  var _notification = merge(notification,{
    html: {
      template: '<p>zla: <%= data.zla %></p>',
      data: { zla: 'uuuuu' }
    }
  });
  makeOptions({notification:_notification,body})
    .then(function (options) {
      expect(options.html).toMatch(`<p>zla: uuuuu`);
    });
});

test('html with provided template and data promise',function () {
  var _notification = merge(notification,{
    html: {
      template: '<p>bar: <%= data.bar %></p>',
      data: new Promise(function (resolve) {
        setTimeout(function () {
          resolve({ bar: 'asdf' });
        },100);
      })
    }
  });
  makeOptions({notification:_notification,body})
    .then(function (options) {
      expect(options.html).toMatch(`<p>bar: asdf`);
    });
});

test('text',function () {
  makeOptions({notification,body})
    .then(function (options) {
      expect(options.text).toMatch(`name: ${body.name}`);
    });
});
