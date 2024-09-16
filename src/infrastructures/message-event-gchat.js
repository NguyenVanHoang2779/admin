import store from '../store'
export default class MessageEventGchat {
  static urlAllow = [
    'https://ghtk.me/',
    'https://ghtk.me'
  ]

  static receiveMessage (evt) {
    if (!MessageEventGchat.urlAllow.includes(evt.origin)) return false
    let data = evt.data
    if (data) store.dispatch('setEvent', data)
  }

  static startListen () {
    if (!window['postMessage']) console.log('Không hỗ trợ function postMessage')
    else {
      if (window.addEventListener) {
        // For standards-compliant web browsers (ie9+)
        window.addEventListener('message', MessageEventGchat.receiveMessage, false)
      } else {
        // alert("not standards-compliant (ie8)");
        window.attachEvent('onmessage', MessageEventGchat.receiveMessage)
      }
    }
  }

  static sendMessage (data, targer, targetOrigin = '*') {
    if (!targer) targer = window.opener || window.parent
    if (!targer) return
    targer.postMessage(data, targetOrigin)
  }
}
