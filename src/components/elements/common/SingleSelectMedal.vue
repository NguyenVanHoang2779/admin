<template>
  <div>
    <multiselect
      v-model="option"
      :options="options"
      placeholder="Chọn danh hiệu"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
      :disabled="isDisabled"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn danh hiệu</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import medalService from 'domain/services/medal-service'

export default {
  name: 'single-select-medal',

  components: {
    Multiselect
  },
  props: {
    medalId: null,
    isDisabled: {
      type: Boolean
    },
    whenCreate: {
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

    medalId: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      } else this.option = null
    }
  },

  methods: {
    getList: function () {
      let hasForCreate = +this.whenCreate
      let cacheKey = `listMedals${hasForCreate}`
      if (sessionStorage.getItem(cacheKey)) {
        this.options = JSON.parse(sessionStorage.getItem(cacheKey))
        this.setSelectedOption()
        return
      }
      medalService.getListMedals({ hasForCreate: hasForCreate })
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setSelectedOption()
            sessionStorage.setItem(cacheKey, JSON.stringify(this.options))
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    setSelectedOption () {
      if (this.options.length > 0 && this.medalId) {
        this.option = this.options.find((option) => {
          return parseInt(option.id) === parseInt(this.medalId)
        })
      }
    }
  }
}
</script>
