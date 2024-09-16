import profileService from 'domain/services/profile-service'
import EmpDepartment from 'domain/entities/EmpDepartment'

export default {
  namespaced: true,

  state: {
    positions: null
  },

  getters: {
    allPositions: state => {
      return state.positions
    },
    positionsWithDepartmentAlias: state => {
      let listNames = state.positions.map(item => item.name)
      let duplicateNames = listNames.filter((name, index) => listNames.indexOf(name) !== index)

      return state.positions.map(option => {
        let departmentAlias = EmpDepartment.alias[option.department_id]
        let newOption = { ...option }
        newOption.name = duplicateNames.includes(option.name) && departmentAlias ? `${option.name} (${departmentAlias})` : option.name

        return newOption
      })
    }
  },

  actions: {
    async getPositions (context, data) {
      if (context.state.positions === null) {
        const response = await profileService.getPositionList()
        if (response.data.success) {
          context.commit('setPositions', response.data.data)
        }
      }
    },

    async getPositionByDepartment (context, data) {
      if (context.state.positions === null) {
        const response = await profileService.getAllPositionByDepartmentIds(data)
        if (response.data.success) {
          context.commit('setPositions', response.data.data)
        }
      }
    },
    setPositions (context, data) {
      context.commit('setPositions', data)
    }
  },

  mutations: {
    setPositions (state, data) {
      state.positions = [...data]
    }
  }
}
