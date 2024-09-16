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
      <span slot="noOptions">Có lỗi xảy ra khi lấy danh sách tỉnh</span>
    </multiselect>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
export default {
  name: 'select-province-penalty',

  components: {
    Multiselect,
    sosService
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
    this.getListProvince()
  },
  methods: {
    getListProvince () {
      this.loading = true
      sosService.apiGetAllProvince().then(response => {
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
