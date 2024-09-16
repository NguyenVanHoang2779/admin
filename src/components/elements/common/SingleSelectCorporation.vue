<template>
  <div>
    <multiselect
      v-model="option"
      :options="options"
      placeholder="Chọn công ty"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
      :disabled="isDisabled"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn công ty</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import profileService from 'domain/services/profile-service'

export default {
  name: 'single-select-corporation',

  components: {
    Multiselect
  },
  props: {
    id: null,
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getList()
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelected', newValue)
    },

    id: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      } else this.option = null
    }
  },

  methods: {
    getList: function () {
      profileService.getListMemberCoporations()
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setSelectedOption()
            // sessionStorage.setItem('listCorporations', JSON.stringify(this.options))
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    setSelectedOption () {
      if (this.options.length > 0 && this.id) {
        this.option = this.options.find((option) => {
          return parseInt(option.id) === parseInt(this.id)
        })
      }
    }
  }
}
</script>
