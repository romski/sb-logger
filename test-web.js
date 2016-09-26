'use strict';

const express = require('express');
const app = express();
const logger = require('./logger');
const winston = require('winston');

// global transports for all logger instances
app.locals.transports = [
  new winston.transports.Console({
    formatter: require('./format/sb_rest_1'),
    handleExceptions: true,
    humanReadableUnhandledException: true
  })
];

// ad logger per request
function middleware(req, res, next) {
  req.log = logger.getLogger({
    ctxt: {
      CORRELATION_ID: 'correlation-id',
      SESSION_ID: 'session-id',
      USER_ID: 'user-id',
      ACCOUNT_ID: 'account-id',
      URL: req.url,
      METHOD: req.method
    },
    transports: req.app.locals.transports,
    masks: [
      {
        pattern: /(aaa)/gm,
        mask: '***'
      }
    ]
  });

  next();
}

app.use('/', middleware);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/', function (req, res) {
  req.log.debug('baz aaa aaa bbb', {foo: "bar", foz: {baz: 2}}, {foo: "bar2"}, {foo: "bar3"});
  req.log.info('baz aaa aaa bbb', {foo: "bar", foz: {baz: 2}}, {foo: "bar2"}, {foo: "bar3"});
  req.log.warn('baz aaa aaa bbb', {foo: "bar", foz: {baz: 2}}, {foo: "bar2"}, {foo: "bar3"});
  req.log.error('baz aaa aaa bbb', {foo: "bar", foz: {baz: 2}}, {foo: "bar2"}, {foo: "bar3"});
  res.send('Hello World!');
});