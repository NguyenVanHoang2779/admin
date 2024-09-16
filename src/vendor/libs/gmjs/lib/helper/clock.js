import util from './util'

export function SdkClock (localOffset) {
  // Calculated local clock offset from server time (in milliseconds). Can be positive or negative.
  this.localOffset = parseInt(localOffset || 0)
}

util.extend(SdkClock.prototype, {
  // Return the current time (in seconds)
  now: function () {
    return (Date.now() + this.localOffset) / 1000
  }
})

// factory method. Create an instance of a clock from current context.
SdkClock.create = function (/* sdk, options */) {
  // TODO: calculate localOffset
  const localOffset = 0
  return new SdkClock(localOffset)
}
