export default {
  // converts a string to base64 (url/filename safe variant)
  stringToBase64Url (str) {
    const b64 = btoa(str)
    return this.base64ToBase64Url(b64)
  },

  // converts a standard base64-encoded string to a "url/filename safe" variant
  base64ToBase64Url (b64) {
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  },

  // converts a "url/filename safe" base64 string to a "standard" base64 string
  base64UrlToBase64 (b64u) {
    return b64u.replace(/-/g, '+').replace(/_/g, '/')
  },

  base64UrlToString (b64u) {
    let b64 = this.base64UrlToBase64(b64u)
    switch (b64.length % 4) {
      case 0:
        break
      case 2:
        b64 += '=='
        break
      case 3:
        b64 += '='
        break
      default:
        // eslint-disable-next-line no-throw-literal
        throw 'Not a valid Base64Url'
    }
    const utf8 = atob(b64)
    try {
      return decodeURIComponent(escape(utf8))
    } catch (e) {
      return utf8
    }
  },

  stringToBuffer (str) {
    const buffer = new Uint8Array(str.length)
    for (let i = 0; i < str.length; i++) {
      buffer[i] = str.charCodeAt(i)
    }
    return buffer
  },

  base64UrlDecode (str) {
    return atob(this.base64UrlToBase64(str))
  },

  bind (fn, ctx) {
    const additionalArgs = Array.prototype.slice.call(arguments, 2)
    return function () {
      let args = Array.prototype.slice.call(arguments)
      args = additionalArgs.concat(args)
      return fn.apply(ctx, args)
    }
  },

  isAbsoluteUrl (url) {
    return /^(?:[a-z]+:)?\/\//i.test(url)
  },

  isString (obj) {
    return Object.prototype.toString.call(obj) === '[object String]'
  },

  isObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  },

  isNumber (obj) {
    return Object.prototype.toString.call(obj) === '[object Number]'
  },

  isoToUTCString (str) {
    const parts = str.match(/\d+/g)
    const isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5])
    const isoDate = new Date(isoTime)

    return isoDate.toUTCString()
  },

  toQueryParams (obj) {
    const str = []
    if (obj !== null) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) &&
          obj[key] !== undefined &&
          obj[key] !== null) {
          str.push(key + '=' + encodeURIComponent(obj[key]))
        }
      }
    }
    if (str.length) {
      return '?' + str.join('&')
    } else {
      return ''
    }
  },

  genRandomString (length) {
    const randomCharset = 'abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let random = ''
    for (let c = 0, cl = randomCharset.length; c < length; ++c) {
      random += randomCharset[Math.floor(Math.random() * cl)]
    }
    return random
  },

  extend () {
    // First object will be modified!
    const obj1 = arguments[0]
    // Properties from other objects will be copied over
    const objArray = [].slice.call(arguments, 1)
    objArray.forEach(function (obj) {
      for (const prop in obj) {
        // copy over all properties with defined values
        if (Object.prototype.hasOwnProperty.call(obj, prop) && obj[prop] !== undefined) {
          obj1[prop] = obj[prop]
        }
      }
    })
    return obj1 // return the modified object
  },

  removeNils (obj) {
    const cleaned = {}
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        const value = obj[prop]
        if (value !== null && value !== undefined) {
          cleaned[prop] = value
        }
      }
    }
    return cleaned
  },

  clone (obj) {
    if (obj) {
      const str = JSON.stringify(obj)
      if (str) {
        return JSON.parse(str)
      }
    }
    return obj
  },

  // Analogous to _.omit
  omit (obj) {
    const props = Array.prototype.slice.call(arguments, 1)
    const newObj = {}
    for (const p in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, p) && props.indexOf(p) === -1) {
        newObj[p] = obj[p]
      }
    }
    return this.clone(newObj)
  },

  find (collection, searchParams) {
    let c = collection.length
    while (c--) {
      const item = collection[c]
      let found = true
      for (const prop in searchParams) {
        if (!Object.prototype.hasOwnProperty.call(searchParams, prop)) {
          continue
        }
        if (item[prop] !== searchParams[prop]) {
          found = false
          break
        }
      }
      if (found) {
        return item
      }
    }
  },

  getNativeConsole () {
    if (typeof window !== 'undefined') {
      return window.console
    } else if (typeof console !== 'undefined') {
      return console
    } else {
      return undefined
    }
  },

  getConsole () {
    const nativeConsole = this.getNativeConsole()
    if (nativeConsole && nativeConsole.log) {
      return nativeConsole
    }
    return {
      log: function () {
      }
    }
  },

  warn (text) {
    /* eslint-disable no-console */
    this.getConsole().log('[gmjs-sdk] WARN: ' + text)
    /* eslint-enable */
  },

  removeTrailingSlash (path) {
    if (!path) {
      return
    }
    // Remove any whitespace before or after string
    let trimmed = path.replace(/^\s+|\s+$/gm, '')
    // Remove trailing slash(es)
    trimmed = trimmed.replace(/\/+$/, '')

    return trimmed
  },

  isIE11OrLess () {
    return !!document.documentMode && document.documentMode <= 11
  },

  isFunction (fn) {
    return !!fn && {}.toString.call(fn) === '[object Function]'
  },

  delay (ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms)
    })
  },

  isPromise (obj) {
    return obj && obj.finally && (typeof obj.finally === 'function')
  },

  debugLS (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
