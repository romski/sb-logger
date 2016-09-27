'use strict';

const express = require('express');
const app = express();
const logger = require('./../logger');
const winston = require('winston');
const formatter = logger.getFormatter('sb_rest_2');
const transportConsole = new winston.transports.Console({
  formatter: formatter
});

function defaultLogger(req, res, next) {
  req.log = logger.getLogger();
  next();
}

function defaultLoggerWithFormat(req, res, next) {
  req.log = logger.getLogger('sb_rest_2');
  next();
}

function defaultLoggerWithFormatNamed(req, res, next) {
  req.log = logger.getLogger('sb_rest_2', 'rest2');
  next();
}

function configLogger(req, res, next) {
  req.log = logger.getLogger({
    ctxt: {
      CORRELATION_ID: 'correlation-id',
      SESSION_ID: 'session-id',
      USER_ID: 'user-id',
      ACCOUNT_ID: 'account-id',
      URL: req.url,
      METHOD: req.method
    },
    transports: [transportConsole],
    name: 'wibble',
    masks: [
      {
        pattern: /(aaa)/gm,
        mask: 'zzzz'
      }
    ]
  });
  next();
}

function log(req) {
  req.log.debug('baz aaa aaa bbb', 'log1');
  req.log.info('baz aaa aaa bbb', 'log2');
  req.log.warn('baz aaa aaa bbb', 'log3');
  req.log.error('baz aaa aaa bbb', {foo: "bar", foz: {baz: 2}}, {foo: "bar2"}, {foo: "bar3"});
}

app.use('/default', defaultLogger);
app.use('/format', defaultLoggerWithFormat);
app.use('/named', defaultLoggerWithFormatNamed);
app.use('/config', configLogger);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/default', function (req, res) {
  log(req);
  res.send('Hello World!');
});

app.get('/format', function (req, res) {
  log(req);
  res.send('Hello World!');
});

app.get('/named', function (req, res) {
  log(req);
  res.send('Hello World!');
});

app.get('/config', function (req, res) {
  log(req);
  res.send('Hello World!');
});