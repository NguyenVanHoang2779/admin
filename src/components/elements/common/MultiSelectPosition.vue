<template>
  <multiselect
    v-model="option"
    :options="options"
    :multiple="isMultiple"
    :placeholder="placeholder"
    label="name"
    track-by="id"
    selectedLabel=""
    deselectLabel="X"
    selectLabel=""
    :close-on-select="autoClose"
    :hide-selected="hideSelected"
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
  name: 'multi-select-position',

  components: {
    Multiselect
  },

  props: {
    departmentIds: {
      default: null
    },
    positionIds: {
      default: null
    },
    autoClose: {
      default: null
    },
    hideSelected: {
      default: null
    },
    placeholder: {
      default: 'Chọn vị trí'
    },
    disabled: {
      default: false
    },
    listPosition: {},
    departmentId: {},
    isSyllabus: {
      default: false
    },
    triggerDuplicateChange: {
      default: false
    },
    isMultiple: {
      default: true
    },
    excludeDepartment: {
      type: Array,
      default: () => []
    },
    notInGroup: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    option: null,
    options: [],
    triggerDuplicate: false
  }),

  created () {
    this.getList(this.departmentIds)
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handlePositionSelected', newValue)
    },

    departmentIds: function (newValue, oldValue) {
      this.getList(newValue)
    },

    listPosition: {
      immediate: true,
      handler: function (newValue, oldValue) {
        this.getList()
        this.option = null
      }
    },

    departmentId: {
      immediate: true,
      handler: function (newValue, oldValue) {
        this.getList()
      }
    },
    triggerDuplicateChange: function (newValue, oldValue) {
      this.triggerDuplicate = newValue
    },
    positionIds: function (newVal, oldVal) {
      if (this.triggerDuplicate) {
        return
      }
      if (this.options && this.options.length > 0) {
        this.setList()
      }
    }
  },

  methods: {
    upTriger () {
      this.triggerDuplicateChange = false
    },

    reset () {
      this.option = null
    },
    setList () {
      if (this.positionIds && this.positionIds.length > 0) {
        this.option = []
        this.positionIds.split(',').forEach(positionId => {
          if (positionId) {
            let option = this.options.find(op => (+op.id === +positionId))
            if (option) this.option.push(option)
          }
        })
      } else this.option = null
    },

    getList: function (departmentIds) {
      if (!departmentIds && sessionStorage.getItem('allPosition')) {
        this.options = JSON.parse(sessionStorage.getItem('allPosition'))
        if (this.listPosition && this.listPosition.length) this.setListOption(this.listPosition)
        if (this.excludeDepartment && this.excludeDepartment.length > 0) {
          this.options = this.options.filter((item) => !this.excludeDepartment.includes(+item.department_id))
        }
        if (this.departmentId) this.setListOptionByDepartmentId(this.departmentId)
        if (this.isSyllabus) this.setListOptionSyllarbus()
        if (this.notInGroup.length > 0) {
          this.options = this.options.filter(op => {
            if (!this.notInGroup.includes(parseInt(op.group_id))) return true
          }, {'notInGroup': this.notInGroup})
        }
        this.setList()
        return
      }
      profileService.getAllPositionByDepartmentIds({departmentIds: departmentIds, isSyllabus: this.isSyllabus})
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            if (this.excludeDepartment && this.excludeDepartment.length > 0) {
              this.options = this.options.filter((item) => !this.excludeDepartment.includes(+item.department_id))
            }
            this.triggerDuplicate = false
            this.$emit('handleTriggerDuplicateChange', false)
            this.setList()
            if (!departmentIds) sessionStorage.setItem('allPosition', JSON.stringify(this.options))
            if (this.listPosition && this.listPosition.length) this.setListOption(this.listPosition)
            if (this.departmentId) this.setListOptionByDepartmentId(this.departmentId)
            if (this.isSyllabus) this.setListOptionSyllarbus()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    setListOption (positions) {
      this.options = this.options.filter(op => {
        if (positions.includes(parseInt(op.id))) return true
        if (positions.includes(op.id)) return true
      })
    },

    setListOptionByDepartmentId (departmentId) {
      this.options = this.options.filter(op => {
        if (parseInt(departmentId) === parseInt(op.department_id)) return true
      })
      this.setList()
    },

    setListOptionSyllarbus () {
      this.options = this.options.filter(op => {
        if (parseInt(op.department_id) !== 1) return true
      })
      this.setList()
    }
  }
}
</script>
