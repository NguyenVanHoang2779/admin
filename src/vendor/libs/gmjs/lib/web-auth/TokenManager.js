import util from '../helper/util'
import storageUtil from './browserStorage'
import constants from './constants'
import oauthUtil from './oauthUtil'
import { storageBuilder } from '../helper/storageBuilder'
import { AuthSdkError } from '../helper/error'
import { SdkClock } from '../helper/clock'

const DEFAULT_OPTIONS = {
  autoRenew: false,
  storage: 'localStorage',
  expireEarlySeconds: 30
}

function getExpireTime (tokenMgmtRef, token) {
  return token.expiresAt - tokenMgmtRef.options.expireEarlySeconds
}

function hasExpired (tokenMgmtRef, token) {
  const expireTime = getExpireTime(tokenMgmtRef, token)
  return expireTime <= tokenMgmtRef.clock.now()
}

function emitExpired (tokenMgmtRef, key, token) {
  tokenMgmtRef.emitter.emit('expired', key, token)
}

function emitError (tokenMgmtRef, error) {
  tokenMgmtRef.emitter.emit('error', error)
}

function clearExpireEventTimeout (tokenMgmtRef, key) {
  clearTimeout(tokenMgmtRef.expireTimeouts[key])
  delete tokenMgmtRef.expireTimeouts[key]

  // Remove the renew promise (if it exists)
  delete tokenMgmtRef.renewPromise[key]
}

function clearExpireEventTimeoutAll (tokenMgmtRef) {
  const expireTimeouts = tokenMgmtRef.expireTimeouts
  for (const key in expireTimeouts) {
    if (!Object.prototype.hasOwnProperty.call(expireTimeouts, key)) {
      continue
    }
    clearExpireEventTimeout(tokenMgmtRef, key)
  }
}

function setExpireEventTimeout (sdk, tokenMgmtRef, key, token) {
  const expireTime = getExpireTime(tokenMgmtRef, token)
  const expireEventWait = Math.max(expireTime - tokenMgmtRef.clock.now(), 0) * 1000

  // Clear any existing timeout
  clearExpireEventTimeout(tokenMgmtRef, key)

  const expireEventTimeout = setTimeout(function () {
    emitExpired(tokenMgmtRef, key, token)
  }, expireEventWait)

  // Add a new timeout
  tokenMgmtRef.expireTimeouts[key] = expireEventTimeout
}

function setExpireEventTimeoutAll (sdk, tokenMgmtRef, storage) {
  try {
    const tokenStorage = storage.getStorage()
    for (const key in tokenStorage) {
      if (!Object.prototype.hasOwnProperty.call(tokenStorage, key)) {
        continue
      }
      const token = tokenStorage[key]
      setExpireEventTimeout(sdk, tokenMgmtRef, key, token)
    }
  } catch (e) {
    // Any errors thrown on instantiation will not be caught,
    // because there are no listeners yet
    emitError(tokenMgmtRef, e)
    return
  }
}

// TODO verify again
function add (sdk, tokenMgmtRef, storage, key, token) {
  const tokenStorage = storage.getStorage()
  tokenStorage[key] = token
  storage.setStorage(tokenStorage)
  setExpireEventTimeout(sdk, tokenMgmtRef, key, token)
}

function get (storage, key) {
  const tokenStorage = storage.getStorage()
  return tokenStorage[key]
}

function getAsync (sdk, tokenMgmtRef, storage, key) {
  return new Promise(function (resolve, reject) {
    if (tokenMgmtRef.options.autoRenew && oauthUtil.isLoginRedirect(sdk)) {
      return reject(new AuthSdkError(
        'The app should not attempt to call authorize API on callback. ' +
        'Authorize flow is already in process. Use parseFromUrl() to receive tokens.'
      ))
    }

    const token = get(storage, key)
    if (!token || !hasExpired(tokenMgmtRef, token)) {
      return resolve(token)
    }

    const tokenPromise = tokenMgmtRef.options.autoRenew
      ? renew(sdk, tokenMgmtRef, storage, key)
      : remove(tokenMgmtRef, storage, key)

    return resolve(tokenPromise)
  })
}

function remove (tokenMgmtRef, storage, key) {
  // Clear any listener for this token
  clearExpireEventTimeout(tokenMgmtRef, key)

  // Remove it from storage
  const tokenStorage = storage.getStorage()
  delete tokenStorage[key]
  storage.setStorage(tokenStorage)
}

function renew (sdk, tokenMgmtRef, storage, key) {
  // Multiple callers may receive the same promise.
  // They will all resolve or reject from the same request.
  const existingPromise = tokenMgmtRef.renewPromise[key]
  if (existingPromise) {
    return existingPromise
  }
  let token
  try {
    token = get(storage, key)
    if (!token) {
      throw new AuthSdkError('The tokenManager has no token for the key: ' + key)
    }
  } catch (e) {
    return Promise.reject(e)
  }

  // Remove existing autoRenew timeout for this key
  clearExpireEventTimeout(tokenMgmtRef, key)

  // Store the renew promise state, to avoid renewing again
  tokenMgmtRef.renewPromise[key] = sdk.token.renew(token)
    .then(function (freshToken) {
      const oldToken = get(storage, key)
      if (!oldToken) {
        // It is possible to enter a state where the tokens have been cleared
        // after a renewal request was triggered. To ensure we do not store a
        // renewed token, we verify the promise key doesn't exist and return.
        return
      }
      add(sdk, tokenMgmtRef, storage, key, freshToken)
      tokenMgmtRef.emitter.emit('renewed', key, freshToken, oldToken)
      return freshToken
    })
    .catch(function (err) {
      if (err.name === 'OAuthError' || err.name === 'AuthSdkError') {
        remove(tokenMgmtRef, storage, key)
        err.tokenKey = key
        err.accessToken = !!token.accessToken
        emitError(tokenMgmtRef, err)
      }
      throw err
    })
    .finally(function () {
      // Remove existing promise key
      delete tokenMgmtRef.renewPromise[key]
    })

  return tokenMgmtRef.renewPromise[key]
}

function clear (tokenMgmtRef, storage) {
  clearExpireEventTimeoutAll(tokenMgmtRef)
  storage.clearStorage()
}

export function TokenManager (sdk, options) {
  options = util.extend({}, DEFAULT_OPTIONS, util.removeNils(options))
  // console.log(options)

  if (options.storage === 'localStorage' && !storageUtil.browserHasLocalStorage()) {
    util.warn('This browser doesn\'t support localStorage. Switching to sessionStorage.')
    options.storage = 'sessionStorage'
  }

  if (options.storage === 'sessionStorage' && !storageUtil.browserHasSessionStorage()) {
    util.warn('This browser doesn\'t support sessionStorage.')
  }

  let storageProvider
  if (typeof options.storage === 'object') {
    // A custom storage provider must implement getItem(key) and setItem(key, val)
    storageProvider = options.storage
  } else {
    switch (options.storage) {
      case 'localStorage':
        storageProvider = localStorage
        break
      case 'sessionStorage':
        storageProvider = sessionStorage
        break
      case 'memory':
        storageProvider = storageUtil.getInMemoryStorage()
        break
      default:
        throw new AuthSdkError('Unrecognized storage option')
    }
  }
  const storageKey = options.storageKey || constants.TOKEN_STORAGE_NAME
  // console.log('TokenManager: ' + options.storage + ' ' + storageKey)
  const storage = storageBuilder(storageProvider, storageKey)
  const clock = SdkClock.create(sdk, options)
  const tokenMgmtRef = {
    clock: clock,
    options: options,
    emitter: sdk.emitter,
    expireTimeouts: {},
    renewPromise: {}
  }

  this.add = util.bind(add, this, sdk, tokenMgmtRef, storage)
  this.get = util.bind(getAsync, this, sdk, tokenMgmtRef, storage)
  this.remove = util.bind(remove, this, tokenMgmtRef, storage)
  this.clear = util.bind(clear, this, tokenMgmtRef, storage)
  this.renew = util.bind(renew, this, sdk, tokenMgmtRef, storage)
  this.on = util.bind(tokenMgmtRef.emitter.on, tokenMgmtRef.emitter)
  this.off = util.bind(tokenMgmtRef.emitter.off, tokenMgmtRef.emitter)

  setExpireEventTimeoutAll(sdk, tokenMgmtRef, storage)
}
