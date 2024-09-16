<template>
  <div>
      <multiselect class="multiselect-primary"
      v-model="option"
      :options="options"
      :multiple="true"
      :limit="3"
      placeholder="Chọn kho 12h"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      @input="handleInput(option)"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import dashboardV4 from 'domain/admin/dashboardV4'

export default {
  name: 'multi-select-station-12h',

  components: {
    Multiselect
  },

  props: [
    'provinceIds'
  ],

  data: () => ({
    option: null,
    options: []
  }),

  created () {
  },

  watch: {
    option: function (newValue, oldValue) {
      let isAll = (newValue && newValue.id === -1) || (newValue && newValue.length > 1 && newValue.findIndex((x) => x.id === -1) !== -1)
      if (isAll) {
        this.$emit('handleStation12hSelected', this.options)
      } else {
        this.$emit('handleStation12hSelected', newValue)
      }
    },

    provinceIds: function (newValue, oldValue) {
      if (newValue) {
        this.getList(newValue)
        this.option = null
      }
    }
  },

  methods: {
    getList: function (provinceIds) {
      let params = {
        'provinceIds': provinceIds
      }

      dashboardV4.getStation12hListByProvinceIds(params)
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data.length > 0 ? [{id: -1, name: 'Tất cả kho 12h'}, ...res.data.data] : res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    handleInput: function (option) {
      let isAll = (option.length > 0) && (option.findIndex((x) => x.id === -1) === option.length - 1)

      if (isAll) {
        this.option = {id: -1, name: 'Tất cả kho 12h'}
      } else {
        let notAll = option.filter((x) => x.id !== -1)
        this.option = notAll
      }
    }
  }
}
</script>
