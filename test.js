var express = require('express');
var app = express();
var log = require('./logger');

app.use('/', middleware);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/', function (req, res) {
  console.log('saw request');
  req.log.info('saw request', req.SB);
  res.send('Hello World!');
});

function middleware(req, res, next){
  console.log('add logger');

  req.SB = {
    foo: 'wibble',
    bar: 'wobble'
  };

  req.log = log.getLogger({
    ctxt: req.SB,
    masks: [{
      path: 'message',
      pattern: /(Bearer [a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?)/gm,
      mask: '****'
    }]
  });

  next();
}