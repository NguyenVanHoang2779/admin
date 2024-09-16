import axios from 'axios'
import config from 'config/app.base'
import WebStorage from './web-storage'

const webStorage = new WebStorage('local')

export const saveGchatAuth = (token = {access_token: null, refresh_token: null}) => {
  webStorage.set(config.gchat.authStorage, token)
}

export const getToken = () => {
  let result = null
  try {
    const gchatAuth = webStorage.get(config.gchat.authStorage)
    if (gchatAuth && gchatAuth.access_token && gchatAuth.access_token !== 'null') {
      result = gchatAuth.access_token
    }
  } catch (e) {
    if (config.isDev) {
      console.error('[Gchat] getAccessToken', e)
    }
  }

  return result
}

export const getRefreshToken = () => {
  let result = null
  try {
    const gchatAuth = webStorage.get(config.gchat.authStorage)
    if (gchatAuth && gchatAuth.refresh_token && gchatAuth.refresh_token !== 'null') {
      result = gchatAuth.refresh_token
    }
  } catch (e) {
    if (config.isDev) {
      console.error('[Gchat] getRefreshToken', e)
    }
  }

  return result
}

export const verifyToken = async (token = null) => {
  let result = null
  try {
    if (!config.gchat.domain) {
      if (config.isDev) {
        console.error('[Gchat] verifyToken', 'gchat auth domain is undefined!')
      }
      return null
    }

    let accessToken
    if (token) {
      accessToken = token
    } else {
      accessToken = getToken()
    }

    if (!accessToken || accessToken === 'null') {
      if (config.isDev) {
        console.error('[Gchat] verifyToken', 'gchat access token is null!')
      }
      return null
    }

    const req = await axios.get(
      config.gchat.authDomain + '/api/v3/auth/access_token',
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          apptype: 'web'
        }
      }
    )

    const {success, data} = req.data
    if (success) {
      result = data.access_token
    }
  } catch (e) {
    if (config.isDev) {
      console.error('[Gchat] verifyToken error: ', e)
    }
  }

  return result
}

export const refreshToken = async (token = null) => {
  let result = null

  try {
    if (!config.gchat.authDomain) {
      if (config.isDev) {
        console.error('[Gchat] refreshToken', 'gchat auth domain is undefined!')
      }
      return null
    }

    let refreshToken
    if (!token) {
      refreshToken = getRefreshToken()
    } else {
      refreshToken = token
    }

    if (!refreshToken || refreshToken === 'null') {
      if (config.isDev) {
        console.error('[Gchat] refreshToken', 'gchat refresh token is null!')
      }
      return null
    }

    const req = await axios.post(
      config.gchat.authDomain + '/api/v3/auth/refresh_token',
      {refresh_token: refreshToken},
      {
        headers: {
          apptype: 'web'
        }
      }
    )

    const {success, data} = req.data
    if (success && data.access_token) {
      result = data.access_token
      saveGchatAuth(data)
    }
  } catch (e) {
    if (config.isDev) {
      console.error('[Gchat] refreshToken error: ', e)
    }
  }

  return result
}

export default {
  saveGchatAuth,
  getToken,
  getRefreshToken,
  verifyToken,
  refreshToken
}
