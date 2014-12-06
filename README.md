# memcached-protocol
Fast memcached binary protocol implementation for Node.JS with binary packet reader / writer and corresponding streams2 stream interfaces.

## install

```
npm install memcached-protocol
```

## api

```js
var mp = require('memcached-protocol');

var writer = mp.Writer();
var buffer = writer.write({
  key: 'KEY',
  opcode: "GET|SET|ADD|REPLACE|...",
  value: Buffer|String,
  extras: {
    expiry: Number,
    initial: Number,
    delay: Number,
    flags: Number
  },
  cas: String,
  opaque: Number
})

var reader = mp.Reader();
// returns array of structured memcached packets
var packets = reader.read(buffer)
```

## author

Ekin Koc

## license

MIT
