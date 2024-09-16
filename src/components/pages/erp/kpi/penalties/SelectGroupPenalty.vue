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
      <span slot="noOptions">Có lỗi xảy ra khi lấy danh sách bộ phận làm việc</span>
    </multiselect>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import kpiPenaltyService from 'domain/services/kpi-penalty-service'
export default {
  name: 'select-group-penalty',

  components: {
    Multiselect,
    kpiPenaltyService
  },
  watch: {
    multipleValue () {
      this.$emit('model', this.multipleValue.map(a => a.id))
    }
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
    this.getListGroup()
  },
  methods: {
    getListGroup () {
      this.loading = true
      kpiPenaltyService.apiGetAllGroups().then(response => {
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
