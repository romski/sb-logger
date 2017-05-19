# sb-logger
Wrapper for creating [winston](https://github.com/winstonjs/winston) loggers.

The loggers created build on Winston by providing defaults that can be overridden, as well as new functionality such as the ability to mask messages.

Supports the same log levels as the window console (`error`, `warn`, `info`, `debug`), with the default set to `info`.

## Creating loggers 
```
var logger = require('sb-logger');
var log;

// default un-named logger: uses console as default transport with 'sb_rest_1' as the format
log = logger.getLogger();

// default un-named logger: uses console as default transport with 'sb_rest_2' as the format
log = logger.getLogger('sb_rest_2');

// default logger named 'wibble': uses console as default transport with 'sb_rest_1' as the format
log = logger.getLogger('sb_rest_1', 'wibble');

// logger configured using config object
log = logger.getLogger(config);
```
 
## Transports
Transports default to a console transport with the specified formatter, or the default if no formatter is specified. The transports can be overridden by using the `config.transports` property of a config object

```
logger.getLogger({
  transports: [...]
});
```

## Formats
The loggers support named logging formatters. The formatter is specified at creation time and defaults to 'sb_rest_1' if not specified. 

The formater can be specified as the first string argument to `getLogger()` or as the `config.format` property of a config object, or set directly on any transport supplied in the config object `config.transports`. 

The logger can be used to access the formatters by name, `logger.getFormatter(name)`, returning returning the default if the format is not known.

The logger creates a log object as follows:
```
{
  name: '...',
  timestamp: '...',
  context: {..}, // config.ctxt
  message: '...'
}
```

Formatters get passed an args object which has a `meta` property representing the log object;

## Masks
Masks apply a pattern to the message and replace any matches with a mask to hide sensitive data. Masks are applied in the order specified.

Masks always include a mask for jwt tokens and is applied first.
```
{ pattern: /(Bearer [a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?)/gm, mask: '****' }
```

Custom masks can be specified using the config object:

```
{
  masks: [
    { pattern: /foo/, mask: 'bar' }
  ]
}
```

## Message size
By default, the message is split into 1000 character chunks and each chunk logged separately. Each chunk is logged with the same timestamp. The maximum number of characters can be specified on the config object.

```
{
  splitChars: 500 // default 1000
}
```

## Config Object

```
{
  name,
  format,
  transports,
  masks,
  ctxt,
  splitChars
}
```