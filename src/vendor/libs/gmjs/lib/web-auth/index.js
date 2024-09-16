import util from '../helper/util'
import storageUtil from './browserStorage'
import { axiosRequest } from '../helper/axiosRequest'
import { GhtkAuthBuilder } from './browser'

export function GhtkAuth (args) {
  if (!(this instanceof GhtkAuth)) {
    return new GhtkAuth(args)
  }

  if (args) {
    args.storageUtil = storageUtil
    args.httpRequestClient = axiosRequest
  }

  util.bind(GhtkAuthBuilder, this)(args)
}

GhtkAuth.prototype = GhtkAuthBuilder.prototype
GhtkAuth.prototype.constructor = GhtkAuth

// Hoist feature detection functions to static type
GhtkAuth.features = GhtkAuthBuilder.prototype.features
