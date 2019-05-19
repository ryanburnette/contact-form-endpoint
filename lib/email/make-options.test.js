'use strict';

var makeOptions = require('./make-options');
var merge = require('@ryanburnette/merge-options');

var notification = {
  to: '{sender}',
  from: 'Team <no-reply@example.com>',
  subject: 'Test',
  html: '{auto}',
  text: '{auto}'
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
  var options = makeOptions({notification,body});
  expect(options.from).toBe(notification.from);
});

test('to {sender}',function () {
  var options = makeOptions({notification,body});
  expect(options.to).toBe('Ryan Burnette <ryan.burnette@gmail.com>');
});

test('reply-to not provided',function () {
  var options = makeOptions({notification,body});
  expect(options).not.toHaveProperty('reply-to');
  expect(options).not.toHaveProperty('h:reply-to');
});

test('reply-to provided',function () {
  var ry = 'Ryan Burnette <ryan.burnette@gmail.com>';
  var r = { 'reply-to': ry };
  var _notification = merge(notification,r);
  var options = makeOptions({notification:_notification,body});
  expect(options).not.toHaveProperty('reply-to');
  expect(options['h:Reply-To']).toBe(ry);
});

test('html',function () {
  var options = makeOptions({notification,body});
  expect(options.html).toMatch(`<p>name: ${body.name}`);
});

test('html with provided template',function () {
  var r = {
    html: '<p>foo: <%= body.name %></p>'
  };
  var _notification = merge(notification,r);
  var options = makeOptions({notification:_notification,body});
  expect(options.html).toMatch(`<p>foo: ${body.name}`);
});

test('text',function () {
  var options = makeOptions({notification,body});
  expect(options.text).toMatch(`name: ${body.name}`);
});
