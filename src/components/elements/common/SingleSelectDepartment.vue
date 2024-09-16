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
      :class="customClass"
      :searchable="true"
      :disabled="isDisabled"
      @select="op => { $emit('select', op) }"
      @remove="op => { $emit('remove', op) }"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
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
    customClass: '',
    isDisabled: {
      type: Boolean
    },
    placeholder: {
      default: 'Chọn bộ phận'
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
    },

    departmentName: function (newValue, oldValue) {
      // if (newValue) {
      this.setSelectedOption()
      // }
    },

    departmentId: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      } else this.option = null
    }
  },

  methods: {
    getList: function () {
      if (sessionStorage.getItem('allDepartment')) {
        this.options = JSON.parse(sessionStorage.getItem('allDepartment'))
        this.setSelectedOption()
        return
      }
      profileService.getDepartmentList()
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setSelectedOption()
            sessionStorage.setItem('allDepartment', JSON.stringify(this.options))
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
