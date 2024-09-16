import Vue from 'vue'
import App from './App'
import router from './router'

import BootstrapVue from 'bootstrap-vue'
import Notifications from 'vue-notification'
import store from './store'

import globals from './globals'
import Popper from 'popper.js'
import numeralDirective from 'directives/numeral'
import scrollDirective from 'directives/scroll'
import resizeDirective from 'directives/resize'
import loadingPlugin from 'plugins/loading'
import VCalendar from 'v-calendar'

// import * as Sentry from '@sentry/browser'
// import * as Integrations from '@sentry/integrations'

// Sentry.init({
//   dsn: 'https://24bf2519d49d4ec9b81ed48b719b8bdc@sentry.io/1727896',
//   // integrations: [new Integrations.Vue({Vue, attachProps: true})]
//   debug: true
// })

// Required to enable animations on dropdowns/tooltips/popovers
Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false

Vue.config.productionTip = false

Vue.use(BootstrapVue)

Vue.use(Notifications)

Vue.use(loadingPlugin)

Vue.use(VCalendar)

Vue.directive('numeral', numeralDirective)
Vue.directive('scroll', scrollDirective)
Vue.directive('resize', resizeDirective)

// Global RTL flag
Vue.mixin({
  data: globals
})

export const eventBus = new Vue()

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
