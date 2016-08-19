# sb-logger
Wrapper for creating [winston](https://github.com/winstonjs/winston) loggers configured with a config object:

```
{
  name: 'foo',
  
  // used as the message context
  ctxt: { 
    bar: 'baz'
  },
  
  // each mask is applied in order to the log's message property
  masks: [ 
    {
      pattern: /(aaa)/gm,
      mask: '****'
    }
  ]
  
}
```

Supports the same log levels as the window console (`error`, `warn`, `info`, `debug`), with the default set to `warn`.

Logs messages in json using the following format:

```
{
  name: <config name>,
  timestamp: <utc iso string>,
  context: <config ctxt object>,
  message: <masked message with new lines removed>
}
```
Context is intended for passing arbitrary data such as header information in an express application.