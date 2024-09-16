<template>
  <div>
    <multiselect
      v-model="option"
      :id="id"
      :options="options"
      placeholder="Chọn vị trí làm việc"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
      :multiple="multiple"
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
  name: 'single-select-position',

  components: {
    Multiselect
  },

  props: {
    id: 'single-select-position',
    isDisabled: {
      type: Boolean
    },
    departmentName: {},
    departmentId: {},
    positionId: {},
    positionName: {},
    multiple: false
  },
  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getList()
  },

  watch: {
    departmentName: function (newValue, oldValue) {
      this.option = null
      this.options = []
      this.getPositionListByDepartment(newValue)
    },

    departmentId: function (newValue, oldValue) {
      this.option = null
      this.options = []
      this.getPositionListByDepartment(newValue)
    },

    option: function (newValue, oldValue) {
      this.$emit('handleSelectedPosition', newValue)
    },

    positionId: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      }
    },

    positionName: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      }
    }
  },

  methods: {
    setSelectedOption () {
      if (this.options.length > 0 && this.positionId) {
        this.option = this.options.find((option) => {
          return option.id === this.positionId
        })
      }
      if (this.options.length > 0 && this.positionName) {
        this.option = this.options.find((option) => {
          return option.name === this.positionName
        })
      }
    },

    getList: function () {
      profileService.getPositionList()
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getPositionListByDepartment: function (value) {
      let params = {
        department: value
      }
      profileService.getPositionListByDepartment(params)
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setSelectedOption()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
