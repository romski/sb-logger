var express = require('express');
var app = express();
var logger = require('./logger');

function middleware(req, res, next) {
  req.log = logger.getLogger({
    ctxt: {
      foo: 'bar'
    },
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