# sb-logger
Wrapper for creating [winston](https://github.com/winstonjs/winston) loggers configured with a config object.

```
{
  // unique identifier for this logger
  name: 'foo',
  
  // used as the message context
  ctxt: { 
    bar: 'baz'
  },
  
  // Optional transports to use, useful for passing a global transport for sharing amongst all loggers.
  // Use formatter to format the transport logs
  // A default json console logger is used if transports are omitted.
  transports: [
    new winston.transports.Console({
      formatter: require('./format/sb_rest_1'),
      handleExceptions: true,
      humanReadableUnhandledException: true
    })
  ],
  
  // Optional masks to apply. Each mask is applied in order to the log's message property
  masks: [ 
    {
      pattern: /(aaa)/gm,
      mask: '****'
    }
  ]
  
}
```

Supports the same log levels as the window console (`error`, `warn`, `info`, `debug`), with the default set to `warn`.

By default, logs messages in json using the following format:

```
{
  name: <config name>,
  timestamp: <utc iso string>,
  context: <config ctxt object>,
  message: <masked message with new lines removed>
}
```
Context is for passing arbitrary data such as header information in an express application.