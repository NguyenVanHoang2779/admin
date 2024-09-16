<template>
  <div>
    <multiselect
      class="multiselect-success"
      placeholder=""
      v-model="value"
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
      <span slot="noOptions">Có lỗi xảy ra khi lấy danh sách loại phạt</span>
    </multiselect>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
import kpiPenaltyService from 'domain/services/kpi-penalty-service'

export default {
  name: 'select-type-penalty',

  components: {
    Multiselect,
    sosService
  },
  props: [
    'editData'
  ],
  watch: {
    value () {
      this.$emit('model', this.value)
    }
  },
  data: () => ({
    multipleOptions: [],
    multipleValue: {},
    loading: false,
    value: {}
  }),
  computed: {
  },
  created () {
    this.value = this.editData.selectTypePenalty
    this.$emit('model', this.multipleValue)
    this.getListTypes()
  },
  methods: {
    getListTypes () {
      this.loading = true
      kpiPenaltyService.apiGetListTypes().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.multipleOptions = response.data.data
          }
        }
      }).catch(() => {
      }).then(() => {
        this.loading = false
      })
    }
  }
}
</script>
