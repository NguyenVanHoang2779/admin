<template>
    <multiselect
      :class="customClass"
      v-model="positionOption"
      :options="positionOptions"
      group-values="positions"
      group-label="department_name"
      :group-select="true"
      :multiple="isMultiple"
      :placeholder="placeholder"
      label="name"
      track-by="id"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      :hide-selected="hideSelected"
      :close-on-select="autoClosed"
      :disabled="disabled"
      selectGroupLabel="Chọn tất cả"
      deselectGroupLabel="Bỏ chọn tất cả"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{placeholder}}</span>
    </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import profileService from 'domain/services/profile-service'
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'multi-select-position-by-group',

  props: {
    departmentIds: {
      default: null
    },
    positionIds: {
      default: null
    },
    showByDepartment: {
      default: false
    },
    autoClose: {
      default: null
    },
    hideSelected: {
      default: null
    },
    placeholder: {
      default: 'Chọn vị trí'
    },
    customClass: {
      default: null
    },
    disabled: {
      default: false
    },
    isMultiple: {
      default: true
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    autoClosed: true,
    hideSelect: false,
    positionOption: [],
    positionOptions: [],
    positionOptionsFull: [],
    listPositions: [],
    listPositionCacheKey: 'ListPositionsByGroup',
    listDepartmentCacheKey: 'allDepartment'
  }),

  created () {
    this.getPositions()
    if (this.autoClose !== undefined && this.autoClosed !== null) this.autoClosed = this.autoClose
    if (this.hideSelected !== undefined && this.hideSelected !== null) this.hideSelect = this.hideSelected
  },

  watch: {
    hideSelected: function (newVal, oldVal) {
      this.hideSelect = this.hideSelected
    },

    autoClose: function (newVal, oldVal) {
      this.autoClosed = this.autoClose
    },

    positionIds: function (newValue, oldValue) {
      if (!newValue) {
        this.positionOption = null
        return
      }
      this.setList('position')
    },

    departmentIds: function (newValue, oldValue) {
      this.setList('department', [newValue, oldValue])
    },

    positionOption: function (newValue, oldValue) {
      this.$emit('handlePositionSelected', newValue)
    }
  },

  methods: {
    setList (changeType = 'all', updateValue = null) {
      if (!this.positionOptions || this.positionOptions.length === 0) return

      if (changeType === 'department') {
        if (this.departmentIds && this.departmentIds.length > 0) {
          // Update list options
          this.setOptionsByDepartment()

          // Update selected option
          let listDepartmentIds = this.departmentIds
          if (!Array.isArray(this.departmentIds)) {
            listDepartmentIds = this.departmentIds.split(',')
          }
          let oldDepartmentIds = updateValue[1]
          if (!Array.isArray(oldDepartmentIds)) {
            oldDepartmentIds = oldDepartmentIds ? oldDepartmentIds.split(',') : []
          }

          let intersectionDepartment = listDepartmentIds.filter(x => oldDepartmentIds.includes(x))
          let differenceDepartment = listDepartmentIds.filter(x => !oldDepartmentIds.includes(x))
          let newOptions = this.listPositions.filter((op) => differenceDepartment.includes(op.department_id))
          let intersectionOptions = this.positionOption ? this.positionOption.filter((op) => intersectionDepartment.includes(op.department_id)) : []

          this.positionOption = intersectionOptions.concat(newOptions)
        }
      }
      if (changeType === 'all' || changeType === 'position') {
        if (this.positionIds && this.positionIds.length > 0) {
          let listPositionIds = Array.isArray(this.positionIds) ? this.positionIds.map((id) => id) : this.positionIds
          if (!Array.isArray(this.positionIds)) {
            listPositionIds = this.positionIds.split(',')
          }
          listPositionIds = listPositionIds.map((id) => parseInt(id))
          this.positionOption = this.listPositions.filter((op) => listPositionIds.includes(parseInt(op.id)))
        }
      }
    },

    getPositions: function () {
      if (sessionStorage.getItem(this.listPositionCacheKey)) {
        let listPositions = JSON.parse(sessionStorage.getItem(this.listPositionCacheKey))
        this.setListPositionByGroup(listPositions)
        this.setList()
        return
      }
      profileService.getPositionList()
        .then((res) => {
          if (res.data.success) {
            sessionStorage.setItem(this.listPositionCacheKey, JSON.stringify(res.data.data))
            this.setListPositionByGroup(res.data.data)
            this.setList()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getListDepartment: function () {
      if (sessionStorage.getItem(this.listDepartmentCacheKey)) {
        return JSON.parse(sessionStorage.getItem(this.listDepartmentCacheKey))
      }
      profileService.getDepartmentList()
        .then((res) => {
          if (res.data.success) {
            sessionStorage.setItem(this.listDepartmentCacheKey, JSON.stringify(res.data.data))
            return res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
      return []
    },

    setListPositionByGroup: function (listPositions) {
      this.listPositions = listPositions
      this.positionOptions = []
      let listDepartments = this.getListDepartment()
      if (helper.isEmpty(listDepartments)) {
        return
      }
      let totalDepartment = listDepartments.length
      for (let i = 0; i < totalDepartment; i++) {
        this.positionOptions.push({
          department_id: listDepartments[i].id,
          department_name: listDepartments[i].name,
          positions: []
        })
      }

      let totalPosition = listPositions.length
      for (let i = 0; i < totalPosition; i++) {
        let currentPosition = listPositions[i]
        let departmentIndex = this.positionOptions.findIndex((item) => +item.department_id === +currentPosition.department_id)
        if (departmentIndex < 0) {
          continue
        }
        this.positionOptions[departmentIndex].positions.push(currentPosition)
      }

      // clone to optionsFull
      this.positionOptionsFull = this.positionOptions.map((item) => item)
      this.setOptionsByDepartment()
    },

    setOptionsByDepartment () {
      if (this.showByDepartment && this.departmentIds && this.departmentIds.length > 0) {
        let listDepartmentIds = this.departmentIds
        if (!Array.isArray(this.departmentIds)) {
          listDepartmentIds = this.departmentIds.split(',')
        }
        this.positionOptions = this.positionOptionsFull.filter((item) => listDepartmentIds.includes(item.department_id))
      }
    }
  }
}
</script>
