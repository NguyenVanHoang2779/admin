import util from '../helper/util'

export default {
  getOidcHash (str) {
    const buffer = new TextEncoder().encode(str)
    return crypto.subtle.digest('SHA-256', buffer).then(function (arrayBuffer) {
      const intBuffer = new Uint8Array(arrayBuffer)
      const firstHalf = intBuffer.slice(0, 16)
      const hash = String.fromCharCode.apply(null, firstHalf)
      // url-safe base64 variant
      return util.stringToBase64Url(hash)
    })
  },

  verifyToken (idToken, key) {
    key = util.clone(key)

    const format = 'jwk'
    const algo = {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' }
    }
    const extractable = true
    const usages = ['verify']

    // https://connect.microsoft.com/IE/feedback/details/2242108/webcryptoapi-importing-jwk-with-use-field-fails
    // This is a metadata tag that specifies the intent of how the key should be used.
    // It's not necessary to properly verify the jwt's signature.
    delete key.use

    return crypto.subtle.importKey(
      format,
      key,
      algo,
      extractable,
      usages
    )
      .then(function (cryptoKey) {
        const jwt = idToken.split('.')
        const payload = util.stringToBuffer(jwt[0] + '.' + jwt[1])
        const b64Signature = util.base64UrlDecode(jwt[2])
        const signature = util.stringToBuffer(b64Signature)

        return crypto.subtle.verify(
          algo,
          cryptoKey,
          signature,
          payload
        )
      })
  }
}
