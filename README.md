# sb-logger
Wrapper for creating [winston](https://github.com/winstonjs/winston) loggers configured with a config object:

```
{
  name: 'foo'
  ctxt: {
    bar: 'baz'
  }
}
```

Supports the same log levels as the window console (`error`, `warn`, `info`, `debug`), with the default set to `warn`.

Logs messages in json using the following format:

```
{
  name: <config name>,
  timestamp: <utc iso string>,
  context: <config ctxt object>,
  message: <message with new lines removed>
}
```
Context is intended for passing arbitrary data such as header information in an express application.