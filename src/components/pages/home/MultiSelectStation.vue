<template>
  <div>
      <multiselect class="multiselect-primary"
      v-model="option"
      :options="options"
      :multiple="true"
      placeholder="Chọn kho"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import dashboardV4 from 'domain/admin/dashboardV4'

export default {
  name: 'multi-select-station',

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
      this.$emit('handleStationSelected', newValue)
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

      dashboardV4.getAllStationByProvinceIds(params)
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
