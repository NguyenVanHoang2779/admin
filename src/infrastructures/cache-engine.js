export default class CacheEngine {
  constructor (storageType) {
    this.setStorageEngineer(storageType || 'local')
  }

  setStorageEngineer (storageType) {
    switch (storageType) {
      case 'session':
      default:
        this.storageEngine = sessionStorage
        break

      case 'local':
        this.storageEngine = localStorage
        break
    }
  }

  get (cacheKey) {
    try {
      const cacheValue = this.storageEngine.getItem(cacheKey)
      if (cacheValue === null) {
        return null
      }

      const cacheObject = JSON.parse(cacheValue)
      if (Object.prototype.toString.call(cacheObject) !== '[object Object]') {
        return null
      }

      if (!cacheObject.expiredAt || (cacheObject.expiredAt < new Date().getTime() / 1000)) {
        this.remove(cacheValue)
        return null
      }

      return cacheObject.data
    } catch (reason) {
      return null
    }
  }

  set (cacheKey, cacheValue, timeInMinutes) {
    try {
      this.storageEngine.setItem(cacheKey, JSON.stringify({
        expiredAt: new Date().getTime() / 1000 + timeInMinutes * 60,
        data: cacheValue
      }))
    } catch (e) {
      // ignore error
    }
  }

  remove (keyName) {
    this.storageEngine.removeItem(keyName)
  }

  clear () {
    this.storageEngine.clear()
  }

  remember (cacheKey, timeInMinutes, callback) {
    const cacheValue = this.get(cacheKey)
    if (cacheValue !== null) {
      return cacheValue
    }

    const callbackResponse = callback()
    if (callbackResponse instanceof Promise) {
      return callbackResponse.then((data) => {
        this.set(cacheKey, data, timeInMinutes)
        return data
      })
    }

    this.set(cacheKey, callbackResponse, timeInMinutes)
    return callbackResponse
  }

  rememberByIds (idList, cacheKeyPrefix, timeInMinutes, callback) {
    const cacheData = {}
    const idsNeedCache = []

    if (!Array.isArray(idList) || !idList.length) {
      return cacheData
    }

    idList.forEach(id => {
      cacheData[id] = this.get(cacheKeyPrefix + id)
      if (cacheData[id] === null) {
        idsNeedCache.push(id)
      }
    })

    if (!idsNeedCache.length) {
      return cacheData
    }

    const callbackResponse = callback(idsNeedCache)
    if (callbackResponse instanceof Promise) {
      return callbackResponse.then((data) => {
        Object.keys(data).forEach(id => {
          cacheData[id] = data[id]
          this.set(cacheKeyPrefix + id, data[id], timeInMinutes)
        })
        return data
      })
    }

    return Object.keys(callbackResponse).forEach(id => {
      cacheData[id] = callbackResponse[id]
      this.set(cacheKeyPrefix + id, callbackResponse[id], timeInMinutes)
    })
  }
}
