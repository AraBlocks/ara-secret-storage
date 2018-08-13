<img src="https://github.com/arablocks/docs/blob/master/ara.png" width="30" height="30" />

ARA Secret Storage
==================

[![Build Status](https://travis-ci.com/AraBlocks/ara-secret-storage.svg?token=6WjTyCg41y8MBmCzro5x&branch=master)](https://travis-ci.com/arablocks/ara-secret-storage)

This module implements [ARA RFC
0001](https://github.com/AraBlocks/rfcs/blob/master/text/0001-ass.md).

## Status

**Stable**

## Installation

```sh
$ npm install arablocks/ara-secret-storage
```

## API

### `storage.encrypt(value, opts)` <a name="encrypt"></a>

Encrypts value into a "crypto" object configured by
an initialization vector (iv) and secret key (key) with
optional cipher and digest algorithms.

```js
const storage = require('ara-secret-storage')
const cyrpto = require('ara-crypto')

const message = Buffer.from('hello')
const key = Buffer.alloc(16).fill('key')
const iv = crypto.randomBytes(16)
const enc = storage.encrypt(message, { key, iv })
console.log(enc)
```

Should output:

```js
{ id: 'a83f4ea0-f486-4d32-82ec-8a047bd085a7',
  version: 0,
  crypto:
    { cipherparams: { iv: 'a292924998b67cf8d1abcb5f1174e7de' },
      ciphertext: '5e46475c92',
      cipher: 'aes-128-ctr',
      digest: 'sha1',
      mac: '702deecad7b3bf12ae9bcff7cfd13ee24e43cd13' } }

```

### `storage.decrypt(value, opts)` <a name="decrypt"></a>

Decrypt an encrypted "crypto" object into the originally
encoded buffer.

Where

- `value` - is a JSON object from the output of `storage.encrypt()`
- `opts` - An object containing parameters used for decryption that can
  overload the cipher parameters found in the secret storage JSON
object.

```js
const storage = require('ara-secret-storage')
const cyrpto = require('ara-crypto')

const message = Buffer.from('hello')
const key = Buffer.alloc(16).fill('key')
const iv = crypto.randomBytes(16)
const enc = crypto.encrypt(message, { key, iv })
const dec = crypto.decrypt(enc, { key })
assert(0 == Buffer.compare(dec, message))
```

## Contributing

- [Commit message format](/.github/COMMIT_FORMAT.md)
- [Commit message examples](/.github/COMMIT_FORMAT_EXAMPLES.md)
- [How to contribute](/.github/CONTRIBUTING.md)

Releases follow [Semantic Versioning](https://semver.org/)

## See Also

- [ARA RFC 0001](https://github.com/AraBlocks/rfcs/blob/master/text/0001-ass.md)

## License

LGPL-3.0
