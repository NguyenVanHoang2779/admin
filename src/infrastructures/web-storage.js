export default class WebStorage {
  JsonSerialize = true
  constructor (storageType, jsonSerialize = true) {
    switch (storageType) {
      case 'session':
      default:
        this.storageEngine = sessionStorage
        break

      case 'local':
        this.storageEngine = localStorage
        break
    }

    this.JsonSerialize = jsonSerialize
  }

  /**
   * Get data from storage
   * @param keyName
   * @returns {null}
   */
  get (keyName) {
    let storedData = this.storageEngine.getItem(keyName)
    if (storedData) {
      return this.JsonSerialize ? JSON.parse(storedData) : storedData
    } else {
      return null
    }
  }

  /**
   * Save data to storage
   *
   * @param keyName
   * @param data
   */
  set (keyName, data) {
    try {
      if (this.JsonSerialize) {
        data = JSON.stringify(data)
      }
      this.storageEngine.setItem(keyName, data)
    } catch (e) {} // eslint-disable-line
  }

  /**
   * Remove data from storage
   *
   * @param keyName
   */
  remove (keyName) {
    this.storageEngine.removeItem(keyName)
  }

  /**
   * Clear all data stored in storage
   */
  clear () {
    this.storageEngine.clear()
  }

  /**
   * Get data then remove it from storage
   *
   * @param keyName
   * @returns {null}
   */
  slice (keyName) {
    let data = this.get(keyName)
    this.remove(keyName)

    return data
  }
}
