import {saveGchatAuth} from '../../infrastructures/gchat-auth'
import configs from '@/config/app.base'

const event = {
  state: {
    gchatAuth: {
      access_token: null,
      refresh_token: null
    }
  },

  getters: {
    gchatAuth: (state) => {
      return state.gchatAuth
    }
  },

  mutations: {
    ADD_EVENT (state, dataEvent) {
      if (!dataEvent) return
      if (dataEvent.type === 'authentication' && dataEvent.payload) {
        state.gchatAuth.access_token = dataEvent.payload.token || ''
        state.gchatAuth.refresh_token = dataEvent.payload.refresh_token || ''
        saveGchatAuth(state.gchatAuth)
      }
    },
    SEND_MESSAGE (state, iframeId) {
      if (!iframeId) {
        return
      }
      const target = document.getElementById(iframeId)
      if (!state.gchatAuth.access_token) {
        const iamToken = localStorage.getItem(configs.oidc.tokenIamStorage)
        target.contentWindow.postMessage({
          type: 'hrm_iam_token',
          payload: iamToken
        }, configs.domainHrmFe)
      } else {
        target.contentWindow.postMessage({
          type: 'hrm_authentication_response',
          payload: state.gchatAuth
        }, configs.domainHrmFe)
      }
    }
  },

  actions: {
    setEvent ({ commit }, dataEvent) {
      commit('ADD_EVENT', dataEvent)
    },
    sendMessageToHrm ({ commit }, iframeId) {
      commit('SEND_MESSAGE', iframeId)
    }
  }
}

export { event }
