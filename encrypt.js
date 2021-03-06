const { createCipheriv, createHmac } = require('crypto')
const isBuffer = require('is-buffer')
const uint64 = require('ara-crypto/uint64')
const uuid = require('uuid')

const {
  kVersion,
  kDefaultCipher,
  kDefaultDigest,
} = require('./constants')

/**
 * Encrypts value into a "crypto" object configured by
 * an initialization vector (iv) and secret key (key) with
 * optional cipher and digest algorithms.
 *
 * @public
 * @param {String|Buffer} value
 * @param {Object} opts
 * @param {Buffer} opts.iv
 * @param {Buffer} opts.key
 * @param {?(String)} opts.cipher
 * @param {?(String)} opts.digest
 * @return {Object}
 */
function encrypt(value, opts) {
  if (null === value) {
    throw new TypeError('encrypt: Expecting value. Got null.')
  } else if ('string' !== typeof value && false === isBuffer(value)) {
    /* eslint-disable-next-line function-paren-newline */
    throw new TypeError(
      'encrypt: Expecting value to be a string or buffer.'
    )
  } else if (0 === value.length) {
    throw new TypeError('encrypt: Cannot encrypt empty value.')
  }

  if (!opts || 'object' !== typeof opts) {
    throw new TypeError('encrypt: Expecting options object.')
  }

  if (!opts.key) {
    throw new TypeError('encrypt: Expecting encryption key.')
  } else if ('string' !== typeof opts.key && false === isBuffer(opts.key)) {
    /* eslint-disable-next-line function-paren-newline */
    throw new TypeError(
      'encrypt: Expecting encryption key to be a string or buffer.'
    )
  }

  if (!opts.cipher || 'string' !== typeof opts.cipher) {
    /* eslint-disable-next-line no-param-reassign */
    opts.cipher = kDefaultCipher
  }

  if (!opts.digest || 'string' !== typeof opts.digest) {
    /* eslint-disable-next-line no-param-reassign */
    opts.digest = kDefaultDigest
  }

  if ('string' !== typeof opts.cipher) {
    throw new TypeError('encrypt: Expecting cipher type to be a string.')
  }

  if ('string' !== typeof opts.digest) {
    throw new TypeError('encrypt: Expecting digest type to be a string.')
  }

  const {
    cipher, digest, key, iv
  } = opts
  const cipheriv = createCipheriv(cipher, key, iv)
  const hmac = createHmac(digest, key)

  const buffer = Buffer.concat([ cipheriv.update(value), cipheriv.final() ])
  const ciphertext = buffer.toString('hex')

  hmac.write(buffer)
  hmac.end()

  const id = uuid.v4()
  const mac = hmac.read().toString('hex')
  const version = uint64.encode(kVersion).toString('hex')
  const cipherparams = { iv: iv.toString('hex') }

  return {
    id,
    version,
    crypto: {
      cipherparams,
      ciphertext,
      cipher,
      digest,
      mac,
    }
  }
}

module.exports = {
  encrypt
}
