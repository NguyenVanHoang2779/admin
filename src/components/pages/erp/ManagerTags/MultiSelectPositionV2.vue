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
import ManageTagService from 'domain/services/manage-tags-service'

export default {
  name: 'multi-select-position-v2',

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
    triggerDuplicateChange: {
      default: false
    },
    isMultiple: {
      default: true
    }
  },

  data: () => ({
    option: null,
    options: [],
    triggerDuplicate: false,
    cachePositionKey: 'allPositionForTag'
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
      if (!departmentIds && sessionStorage.getItem(this.cachePositionKey)) {
        this.options = JSON.parse(sessionStorage.getItem(this.cachePositionKey))
        if (this.listPosition) this.setListOption(this.listPosition)
        if (this.departmentId) this.setListOptionByDepartmentId(this.departmentId)
        this.setList()
        return
      }
      let arrDepartmentId = departmentIds.split(',') || []
      ManageTagService.getAllPositionByDepartmentIds({department_ids: arrDepartmentId})
        .then((res) => {
          if (res.data.success) {
            let data = res.data.data.map((item) => {
              return {
                id: item.id,
                name: item.name,
                $isDisabled: item.is_disabled
              }
            })
            this.options = data
            this.triggerDuplicate = false
            this.$emit('handleTriggerDuplicateChange', false)
            this.setList()
            if (!departmentIds) sessionStorage.setItem(this.cachePositionKey, JSON.stringify(this.options))
            if (this.listPosition) this.setListOption(this.listPosition)
            if (this.departmentId) this.setListOptionByDepartmentId(this.departmentId)
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
