/*eslint-disable*/

class Abstract {
  setConfig (config = {}) {
    throw new Error('Not implement yet')
  }

  /**
   * Use this method to render captcha HTML and inject to form.
   * @param placeElement
   */
  render (placeElement) {
    throw new Error('Not implement yet')
  }

  /**
   * Use this method to get data to send to backend to verify
   * @return any
   */
  getRequestData () {
    throw new Error('Not implement yet')
  }
}

/*eslint-enable*/

export default Abstract
