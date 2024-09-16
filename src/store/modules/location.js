import dependantPersonService from 'domain/services/dependant-person-service'
import addressService from 'domain/services/address-service'

export default {
  namespaced: true,

  state: {
    realProvinces: null,
    provinces: null,
    districts: [],
    communes: []
  },

  getters: {
    async getProvinces (state) {
      if (state.provinces === null) {
        const response = await dependantPersonService.getAllProvince()
        if (response.data.success) {
          state.provinces = response.data.data
          return state.provinces
        }
      }
      return state.provinces || []
    },
    async getRealProvinces (state) {
      if (state.realProvinces === null) {
        const response = await addressService.getAllProvince()
        if (response.data.success) {
          state.realProvinces = response.data.data
          return state.realProvinces
        }
      }
      return state.realProvinces || []
    }
  },

  actions: {
    setProvinces (context, data) {
      context.commit('setProvinces', data)
    },
    setRealProvinces (context, data) {
      context.commit('setProvinces', data)
    }
  },

  mutations: {
    setProvinces (state, data) {
      state.provinces = [...data]
    },
    setRealProvinces (state, data) {
      state.realProvinces = [...data]
    }
  }
}
