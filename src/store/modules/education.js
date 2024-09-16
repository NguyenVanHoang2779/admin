export default {
  namespaced: true,

  state: {
    permissions: {
      permissionConfirm: false,
      permissionHr: false,
      permissionVh: false,
      permissionIt: false
    }
  },

  getters: {
    getPermissions (state) {
      return state.permissions
    }
  },

  mutations: {
    setPermissions (state, permissions) {
      state.permissions.permissionIt = permissions.permissionIt
    }
  },

  actions: {
    setPermissions (context, data) {
      context.commit('setPermissions', data)
    }
  }
}
