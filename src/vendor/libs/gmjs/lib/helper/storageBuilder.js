import { AuthSdkError } from './error'

// storage must have getItem and setItem
export function storageBuilder (webStorage, storageName) {
  if (typeof storageName !== 'string' || !storageName.length) {
    throw new AuthSdkError('"storageName" is required')
  }

  function getStorage () {
    let storageString = webStorage.getItem(storageName)
    storageString = storageString || '{}'
    try {
      return JSON.parse(storageString)
    } catch (e) {
      throw new AuthSdkError('Unable to parse storage string: ' + storageName)
    }
  }

  function setStorage (storage) {
    try {
      const storageString = JSON.stringify(storage)
      webStorage.setItem(storageName, storageString)
    } catch (e) {
      throw new AuthSdkError('Unable to set storage: ' + storageName)
    }
  }

  function clearStorage (key) {
    if (!key) {
      return setStorage({})
    }
    const storage = getStorage()
    delete storage[key]
    setStorage(storage)
  }

  function updateStorage (key, value) {
    const storage = getStorage()
    storage[key] = value
    setStorage(storage)
  }

  return {
    getStorage: getStorage,
    setStorage: setStorage,
    clearStorage: clearStorage,
    updateStorage: updateStorage
  }
}
