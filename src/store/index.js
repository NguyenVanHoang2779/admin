import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
import { event as Event } from './modules/Event'
import education from './modules/education'
import location from './modules/location'
import position from './modules/position'

Vue.use(Vuex)

const state = {
  userInfo: {},
  tokenData: {}
}

const store = new Vuex.Store({
  modules: {
    Event,
    education,
    location,
    position
  },
  state,
  getters,
  actions,
  mutations
})

export default store
