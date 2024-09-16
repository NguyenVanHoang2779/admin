<template>
  <div>
    <multiselect
      class="multiselect-success"
      placeholder=""
      v-model="multipleValue"
      :options="multipleOptions"
      :multiple="true"
      selectedLabel='x'
      selectLabel=''
      :loading='loading'
      deselectLabel=''
      label="name"
      :showPointer=true
      track-by="id">
      <span slot="noResult">Không tìm thấy kết quả</span>
      <span slot="noOptions">Có lỗi xảy ra khi lấy danh sách kho</span>
    </multiselect>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
export default {
  name: 'select-station-penalty',

  components: {
    Multiselect,
    sosService
  },
  watch: {
    multipleValue () {
      this.$emit('model', this.multipleValue.map(a => a.id))
    },
    stationId: function () {
      this.multipleValue = this.multipleOptions.filter((item) => +item.id === +this.stationId)
    }
  },
  props: {
    stationId: null
  },
  data: () => ({
    multipleOptions: [],
    multipleValue: [],
    loading: false
  }),
  computed: {
  },
  created () {
    this.$emit('model', this.multipleValue.map(a => a.id))
    this.getListProvince()
  },
  methods: {
    getListProvince () {
      this.loading = true
      sosService.apiGetAllStation().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.multipleOptions = response.data.data
          }
        }
      }).then(() => {
        this.multipleValue = []
        if (this.stationId) {
          this.multipleValue = this.multipleOptions.filter((item) => +item.id === +this.stationId)
          this.$emit('dataReady', this.stationId)
        }
      }).catch(() => {
      }).then(() => {
        this.loading = false
      })
    }
  }
}
</script>
