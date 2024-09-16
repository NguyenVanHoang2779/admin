import app from '../../main'
import BaseEntity from './BaseEntity'

export default class IframeHelper extends BaseEntity {
  static urlAllow = [
    'https://ghtk.me/',
    'https://ghtk.me'
  ]

  static receiveMessage (evt) {
    // if (!IframeHelper.urlAllow.includes(evt.origin)) return false
    let data = evt.data
    // console.log('Reciever: ' + window.origin + ',', 'Origin: ' + evt.origin + ',', data)
    if (data) app.$store.dispatch('setEvent', data)
  }

  static startListen () {
    if (!window['postMessage']) console.log('Không hỗ trợ function postMessage')
    else {
      if (window.addEventListener) {
        // alert("standards-compliant");
        // For standards-compliant web browsers (ie9+)
        window.addEventListener('message', IframeHelper.receiveMessage, false)
      } else {
        // alert("not standards-compliant (ie8)");
        window.attachEvent('onmessage', IframeHelper.receiveMessage)
      }
    }
  }

  static sendMessage (data, target, targetOrigin = '*') {
    if (!target) target = window.opener || window.parent
    if (!target) return
    target.postMessage(data, targetOrigin)
  }
}
