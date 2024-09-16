import axios from 'axios'

/**
 * @param {Object} response Axios response schema
 *
 * @return {{status: number, statusText: string, ok: boolean, headers: Object, dataType: string, dataJSON: Object, rawData: Object}}
 **/
function formatResponse (response) {
  const axiosData = response.data
  const isObject = typeof axiosData === 'object'
  let isOk = false
  if (response.statusText === 'OK') {
    isOk = true
  } else {
    // in some case that statusText is not set OK, recheck by status again
    // https://github.com/axios/axios/issues/1501
    if (response.status >= 200 && response.status <= 299) {
      isOk = true
    }
  }
  const formattedResponse = {
    status: response.status,
    statusText: response.statusText,
    ok: isOk,
    headers: response.headers,
    dataType: '',
    // data field from API response
    dataJSON: {},
    // full json object from API response
    rawData: {}
  }

  if (isObject) {
    formattedResponse.dataType = 'json'
    formattedResponse.dataJSON = axiosData.data
    formattedResponse.rawData = axiosData
  }

  return formattedResponse
}

/**
 *
 * @param msg
 * @param xhr
 * @constructor
 */
export function AxiosRequestError (msg, xhr) {
  this.name = 'AxiosRequestError'
  this.message = msg
  if (xhr) {
    this.xhr = xhr
  }
}

AxiosRequestError.prototype = new Error()

/**
 *
 * @param method
 * @param url
 * @param args
 * @return {Promise<{status: number, statusText: string, ok: boolean, headers: Object, dataType: string, dataJSON: Object, rawData: Object}>}
 */
export function axiosRequest (method, url, args) {
  let body = args.data
  const headers = args.headers || {}
  const xsrfHeaderName = args.xsrfHeaderName || 'X-CSRF-Token'
  const xsrfCookieName = args.xsrfCookieName || '_ghtk_csrf'
  const contentType = (headers['Content-Type'] || headers['content-type'] || '')

  // JSON encode body (if appropriate)
  if (contentType === 'application/json' && body && typeof body !== 'string') {
    body = JSON.stringify(body)
  }

  return axios(url, {
    method: method,
    headers: args.headers,
    data: body,
    withCredentials: args.withCredentials,
    xsrfCookieName: xsrfCookieName,
    xsrfHeaderName: xsrfHeaderName
  }).then(function (response) {
    // success 2xx
    return formatResponse(response)
  }).catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return formatResponse(error.response)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      let msg = 'The request was made but no response was received'
      if (error.isAxiosError) {
        msg = msg + '. Error: ' + error.message
      }
      throw new AxiosRequestError(msg, error)
    } else {
      // Something happened in setting up the request that triggered an Error
      let msg = 'Something happened in setting up the request that triggered an Error'
      if (error.isAxiosError) {
        msg = msg + '. Error: ' + error.message
      }
      throw new AxiosRequestError(msg, error)
    }
  })
}
