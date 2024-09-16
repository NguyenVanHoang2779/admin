import { storageBuilder } from '../helper/storageBuilder'
import constants from './constants'
import browserStorage from './browserStorage'
import cookieHelper from '../helper/cookie'

class AuthStorageManager {
  constructor () {
    this.singedInStorage = storageBuilder(this.getStorageEngine(), constants.SIGNED_IN_STORAGE_NAME)
    this.authnStateStorage = storageBuilder(this.getStorageEngine(), constants.AUTHN_STATE_STORAGE_NAME)
  }

  /**
   * @returns {Storage|{getItem: (function(*): *), setItem: setItem}}
   */
  getStorageEngine () {
    if (browserStorage.browserHasLocalStorage()) {
      return browserStorage.getLocalStorage()
    } else if (browserStorage.browserHasSessionStorage()) {
      return browserStorage.getSessionStorage()
    }

    return browserStorage.getInMemoryStorage()
  }

  /**
   * @returns {any|{signedIn: boolean, expiresAt: number}}
   */
  getSession () {
    return this.singedInStorage.getStorage().session || {
      signedIn: false,
      expiresAt: -1
    }
  }

  /**
   * @param session
   */
  setSession (session) {
    this.singedInStorage.updateStorage('session', session)
  }

  /**
   * @returns {*|{id: string, info: {}}}
   */
  getAccount () {
    return this.singedInStorage.getStorage().account || {
      id: '',
      info: {}
    }
  }

  /**
   * @param account
   */
  setAccount (account) {
    this.singedInStorage.updateStorage('account', account)
  }

  /**
   * @returns {*|{selected: {ui: {}, profile: {}, id: string, type: string}, factors: []}}
   */
  getAccountFactors () {
    return this.singedInStorage.getStorage().mfa || {
      factors: [],
      selected: {
        id: '',
        profile: {},
        type: '',
        ui: {}
      }
    }
  }

  /**
   * @param mfa
   */
  setAccountFactors (mfa) {
    this.singedInStorage.updateStorage('mfa', mfa)
  }

  /**
   *
   * @return {string}
   */
  getRecoveryQuestion () {
    return this.singedInStorage.getStorage().recoveryQuestion || ''
  }

  /**
   *
   * @param {string} question
   */
  setRecoveryQuestion (question) {
    this.singedInStorage.updateStorage('recoveryQuestion', question)
  }

  clearRecoveryQuestion () {
    this.singedInStorage.clearStorage('recoveryQuestion')
  }

  resetRedirectionCounter () {
    cookieHelper.setCookie('authRedirectCounter', 0, 0)
  }

  increaseRedirectionCounter () {
    const counter = this.getRedirectionCounter()
    cookieHelper.setCookie('authRedirectCounter', counter + 1, 5)
  }

  getRedirectionCounter () {
    return cookieHelper.getCookie('authRedirectCounter') || 0
  }

  /**
   * @returns {*|{name: string, expiresAt: number, token: string}}
   */
  getAuthnState () {
    return this.authnStateStorage.getStorage() || {
      name: '',
      token: '',
      expiresAt: -1
    }
  }

  /**
   * @param authnState
   */
  setAuthnState (authnState) {
    if (authnState === null) {
      this.authnStateStorage.clearStorage()
      return
    }

    this.authnStateStorage.setStorage(authnState || {})
  }

  setOnOauthCallbackJustNow () {
    cookieHelper.setCookie('_oncbjn', 1, 10)
  }

  isOnOauthCallbackJustNow () {
    return !!cookieHelper.getCookie('_oncbjn') || false
  }
}

export default new AuthStorageManager()
