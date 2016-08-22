var logFactory = require('./logger');
var log = logFactory.getLogger({
  ctxt: { foo: 'bar' }
});

log.setLogLevel('info');

log.info('wibble');