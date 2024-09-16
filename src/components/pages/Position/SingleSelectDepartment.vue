<template>
  <div>
    <multiselect
      v-model="option"
      :options="options"
      placeholder="Chọn bộ phận"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
      :disabled="isDisabled"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import profileService from 'domain/services/profile-service'

export default {
  name: 'single-select-department',

  components: {
    Multiselect
  },
  props: {
    departmentName: {},
    departmentId: {},
    isDisabled: {
      type: Boolean
    }
  },
  data: () => ({
    option: null,
    options: [],
    readonly: false
  }),

  created () {
    this.getList()
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedDepartment', newValue)
      this.$emit('update:department-id', newValue ? newValue.id : null)
    },

    departmentName: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      } else {
        this.option = null
      }
    },

    departmentId: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      }
      if (newValue == null || newValue === '') {
        this.option = null
      }
    }
  },

  methods: {
    getList: function () {
      profileService.getDepartmentList()
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setSelectedOption()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    setSelectedOption () {
      if (this.options.length > 0 && this.departmentName) {
        this.option = this.options.find((option) => {
          return option.name === this.departmentName
        })
      }

      if (this.options.length > 0 && this.departmentId) {
        this.option = this.options.find((option) => {
          return parseInt(option.id) === parseInt(this.departmentId)
        })
      }
    }
  }
}
</script>
