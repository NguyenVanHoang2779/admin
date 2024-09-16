export default {
  /**
   * @param name
   * @param value
   * @param duration in second
   */
  setCookie (name, value, duration) {
    let expires = ''
    if (duration) {
      const date = new Date()
      date.setTime(date.getTime() + duration*1000)
      expires = '; expires=' + date.toUTCString()
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/'
  },

  /**
   * @param name
   * @returns {string|null}
   */
  getCookie (name) {
    const nameEQ = `${name}=`
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length)
      }

      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length)
      }
    }

    return null
  }
}