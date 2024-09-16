function AuthApiError (err, xhr) {
  this.name = 'AuthApiError'
  this.message = err.error_summary

  this.errorSummary = err.error_summary
  this.errorCode = err.error_code
  this.errorId = err.error_id

  if (xhr) {
    this.xhr = xhr
  }
}

AuthApiError.prototype = new Error()

function AuthSdkError (msg, xhr) {
  this.name = 'AuthSdkError'
  this.message = msg

  this.errorSummary = msg
  this.errorCode = 'INTERNAL'
  this.errorId = 'INTERNAL'
  if (xhr) {
    this.xhr = xhr
  }
}

AuthSdkError.prototype = new Error()

function OAuthError (errorCode, summary) {
  this.name = 'OAuthError'
  this.message = summary

  this.errorCode = errorCode
  this.errorSummary = summary
}

OAuthError.prototype = new Error()

export {
  AuthApiError,
  AuthSdkError,
  OAuthError
}
