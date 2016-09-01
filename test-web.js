const express = require('express');
const app = express();
const logger = require('./logger');
const winston = require('winston');

// global transports for all logger instances
app.locals.transports = [
  new winston.transports.Console({
    json: true,
    handleExceptions: true,
    humanReadableUnhandledException: true
  })
];

// ad logger per request
function middleware(req, res, next) {
  req.log = logger.getLogger({
    ctxt: {
      foo: 'bar'
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
  req.log.error('baz aaa aaa bbb');
  res.send('Hello World!');
});