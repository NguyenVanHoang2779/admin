import Vue from 'vue'
import * as dotenv from 'dotenv'

dotenv.config({ path: './.env' })
Vue.config.productionTip = false

global.matchMedia = global.matchMedia || function () {
  return {
    matches: false,
    addListener: function () {},
    removeListener: function () {}
  }
}

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document
  },
  selectNodeContents: () => {},
  surroundContents: () => {}
})

jest.mock('vue-pdf', () => () => '<div/>');
