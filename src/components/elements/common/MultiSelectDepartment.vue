<template>
    <multiselect
      :class="customClass"
      v-model="departmentOption"
      :options="departmentOptions"
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
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{placeholder}}</span>
    </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import profileService from 'domain/services/profile-service'

export default {
  name: 'multi-select-department',

  props: {
    departmentNames: {
      default: null
    },
    departmentIds: {
      default: null
    },
    autoClose: {
      default: null
    },
    hideSelected: {
      default: null
    },
    placeholder: {
      default: 'Chọn Bộ Phận'
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
    departmentOption: null,
    departmentOptions: []
  }),

  created () {
    this.getAllDepartment()
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

    departmentNames: function (newValue, oldValue) {
      if (!newValue) {
        this.departmentOption = null
        return
      }
      if (this.departmentOptions !== undefined && this.departmentOptions.length > 0) {
        this.setList()
      }
    },

    departmentIds: function (newValue, oldValue) {
      if (!newValue) {
        this.departmentOption = null
      }
      if (this.departmentOptions && this.departmentOptions.length > 0) {
        this.setList()
      }
    },

    departmentOption: function (newValue, oldValue) {
      this.$emit('handleDepartmentSelected', newValue)
    }
  },

  methods: {
    setList () {
      if (!this.departmentOptions || this.departmentOptions.length === 0) return
      if (this.departmentNames) {
        this.departmentOption = []
        this.departmentNames.split(',').forEach(department => {
          if (department) {
            let option = this.departmentOptions.find(op => ('' + op.name === department))
            if (option) this.departmentOption.push(option)
          }
          this.departmentOption.push(this.departmentOptions.find(op => (('' + op.name) === department)))
        })
      }
      if (this.departmentIds && this.departmentIds.length > 0) {
        this.departmentOption = []
        let listDepartmentIds = this.departmentIds
        if (!Array.isArray(this.departmentIds)) {
          listDepartmentIds = this.departmentIds.split(',')
        }
        listDepartmentIds.forEach(departmentId => {
          let option = this.departmentOptions.find(op => (+op.id === +departmentId))
          if (option) this.departmentOption.push(option)
        })
      }
    },

    getAllDepartment: function () {
      if (sessionStorage.getItem('allDepartment')) {
        this.departmentOptions = JSON.parse(sessionStorage.getItem('allDepartment'))
        this.setList()
        return
      }
      profileService.getDepartmentList()
        .then((res) => {
          if (res.data.success) {
            this.departmentOptions = res.data.data
            this.setList()
            sessionStorage.setItem('allDepartment', JSON.stringify(this.departmentOptions))
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
