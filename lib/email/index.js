'use strict';

var makeOptions = require('./make-options');
var send = require('./send');

module.exports = function ({notifications, body, mailgun}) {
  var messages = [];

  notifications.forEach(function (notification) {
    var options = makeOptions({notification, body});
    var message = send({options, mailgun});
    messages.push(message);
  });

  return Promise.all(messages);
};
