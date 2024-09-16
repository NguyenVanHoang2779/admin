import { storageBuilder } from '../helper/storageBuilder'
import constants from './constants'

export default {
  // IE11 bug that Microsoft doesn't plan to fix
  // https://connect.microsoft.com/IE/Feedback/Details/1496040
  browserHasLocalStorage () {
    try {
      const storage = this.getLocalStorage()
      return this.testStorage(storage)
    } catch (e) {
      return false
    }
  },

  browserHasSessionStorage () {
    try {
      const storage = this.getSessionStorage()
      return this.testStorage(storage)
    } catch (e) {
      return false
    }
  },

  getPKCEStorage (options) {
    options = options || {}
    if (!options.preferLocalStorage && this.browserHasSessionStorage()) {
      return storageBuilder(this.getSessionStorage(), constants.PKCE_STORAGE_NAME)
    } else if (this.browserHasLocalStorage()) {
      return storageBuilder(this.getLocalStorage(), constants.PKCE_STORAGE_NAME)
    } else {
      return storageBuilder(this.getInMemoryStorage(), constants.PKCE_STORAGE_NAME)
    }
  },

  getHttpCache () {
    if (this.browserHasLocalStorage()) {
      return storageBuilder(this.getLocalStorage(), constants.CACHE_STORAGE_NAME)
    } else if (this.browserHasSessionStorage()) {
      return storageBuilder(this.getSessionStorage(), constants.CACHE_STORAGE_NAME)
    } else {
      return storageBuilder(this.getInMemoryStorage(), constants.CACHE_STORAGE_NAME)
    }
  },

  getOauthParamsStorage () {
    if (this.browserHasLocalStorage()) {
      return storageBuilder(this.getLocalStorage(), constants.REDIRECT_OAUTH_PARAMS_COOKIE_NAME)
    } else if (this.browserHasSessionStorage()) {
      return storageBuilder(this.getSessionStorage(), constants.REDIRECT_OAUTH_PARAMS_COOKIE_NAME)
    } else {
      return storageBuilder(this.getInMemoryStorage(), constants.REDIRECT_OAUTH_PARAMS_COOKIE_NAME)
    }
  },

  testStorage (storage) {
    const key = 'ghtk-test-storage'
    try {
      storage.setItem(key, key)
      storage.removeItem(key)
      return true
    } catch (e) {
      return false
    }
  },

  getLocalStorage () {
    return localStorage
  },

  getSessionStorage () {
    return sessionStorage
  },

  // Provides an in-memory solution
  getInMemoryStorage () {
    const store = {}
    return {
      getItem: function (key) {
        return store[key]
      },
      setItem: function (key, value) {
        store[key] = value
      }
    }
  }
}
