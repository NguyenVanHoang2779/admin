import util from './util'

// Implements a queue for synchronous or asynchronous methods
// Methods will be wrapped in a promise and execute sequentially
// This can be used to prevent concurrent calls to a single method or a set of methods
export function PromiseQueue () {
  this.queue = []
  this.running = false
}

util.extend(PromiseQueue.prototype, {
  // Returns a promise
  // If the method is synchronous, it will resolve when the method completes
  // If the method returns a promise, it will resolve (or reject) with the value from the method's promise
  push: function (/* method, thisObject, args... */) {
    let args = Array.prototype.slice.call(arguments)
    const method = args[0]
    const thisObject = args[1]
    args = args.slice(2)
    return new Promise((resolve, reject) => {
      this.queue.push({
        method,
        thisObject,
        args,
        resolve,
        reject
      })
      this.run()
    })
  },
  run: function () {
    if (this.running) {
      return
    }
    if (this.queue.length === 0) {
      return
    }
    this.running = true
    const queueItem = this.queue.shift()
    const res = queueItem.method.apply(queueItem.thisObject, queueItem.args)
    if (util.isPromise(res)) {
      res.then(queueItem.resolve, queueItem.reject).finally(() => {
        this.running = false
        this.run()
      })
    } else {
      queueItem.resolve(res)
      this.running = false
      this.run()
    }
  }
})
