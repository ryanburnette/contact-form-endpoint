'use strict';

var makeOptions = require('./make-options');
var send = require('./send');

module.exports = function ({notifications, body, mailgun}) {
  var messages = [];

  notifications.forEach(function (notification) {
    var message = makeOptions({notification, body})
      .then(function (options) {
        return send({options, mailgun});
      });
    messages.push(message);
  });

  return Promise.all(messages);
};
