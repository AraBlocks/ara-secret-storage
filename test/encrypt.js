const { randomBytes } = require('ara-crypto/random-bytes')
const uint64 = require('ara-crypto/uint64')
const test = require('ava')

const { kDefaultCipher, kDefaultDigest, kVersion } = require('../constants')
const { encrypt } = require('../encrypt')

test('encrypt(opts)', async (t) => {
  const iv = randomBytes(16)
  const key = Buffer.alloc(16).fill('key')

  t.throws(() => encrypt(), { instanceOf: TypeError })
  t.throws(() => encrypt(null), { instanceOf: TypeError })
  t.throws(() => encrypt(42), { instanceOf: TypeError })
  t.throws(() => encrypt(true), { instanceOf: TypeError })
  t.throws(() => encrypt({}), { instanceOf: TypeError })

  t.throws(() => encrypt('hello', null))
  t.throws(() => encrypt('hello', {}))
  t.throws(() => encrypt('hello', true))
  t.throws(() => encrypt('hello', 42))
  t.throws(() => encrypt('hello', { iv: null }))
  t.throws(() => encrypt('hello', { iv: {} }))
  t.throws(() => encrypt('hello', { iv: 16 }))
  t.throws(() => encrypt('hello', { iv, key: null }))
  t.throws(() => encrypt('hello', { iv, key: [] }))
  t.throws(() => encrypt(Buffer.alloc(0), { iv, key }))

  t.true('object' === typeof encrypt('hello', { iv, key }))
  t.true('object' === typeof encrypt(Buffer.from('hello'), { iv, key }))

  const enc = encrypt(Buffer.from('hello'), { iv, key })

  t.true('object' === typeof enc)
  t.true('string' === typeof enc.id)
  t.true('string' === typeof enc.version)
  t.true('object' === typeof enc.crypto)
  t.true('object' === typeof enc.crypto.cipherparams)
  t.true('string' === typeof enc.crypto.cipherparams.iv)
  t.true('string' === typeof enc.crypto.ciphertext)
  t.true('string' === typeof enc.crypto.cipher)
  t.true('string' === typeof enc.crypto.digest)
  t.true('string' === typeof enc.crypto.mac)

  t.true(kDefaultCipher === enc.crypto.cipher)
  t.true(kDefaultDigest === enc.crypto.digest)
  t.true(0 === Buffer.compare(
    uint64.encode(kVersion),
    Buffer.from(enc.version, 'hex')
  ))
})
