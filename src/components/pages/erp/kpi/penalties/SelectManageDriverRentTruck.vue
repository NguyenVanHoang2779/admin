<template>
  <div>
    <multiselect
      class="custom-multiselect custom-multiselect-user"
      v-model="asyncSelected"
      label="name"
      track-by="id"
      :placeholder="holder ? holder : ''"
      selectLabel=""
      :options="asyncFound"
      :multiple="true"
      :searchable="true"
      :loading="asyncLoading"
      :internal-search="false"
      :clear-on-select="true"
      :close-on-select="true"
      :hide-selected="true"
      @search-change="asyncFind">
      <span slot="noResult">{{ message }}</span>
      <span slot="noOptions">{{ message }}</span>
    </multiselect>
</div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import debounce from 'debounce'
import kpiPenaltyService from 'domain/services/kpi-penalty-service'
export default {
  props: ['title', 'holder', 'value'],
  name: 'select-manager-driver-rent-truck',

  components: {
    Multiselect,
    kpiPenaltyService,
    debounce
  },
  watch: {
    asyncSelected () {
      this.$emit('model', this.asyncSelected.map(a => a.id))
    }
  },
  data: () => ({
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    message: 'Nhập ít nhất 3 ký tự'
  }),
  computed: {
  },
  created () {
    if (this.value) {
      this.asyncSelected = this.value
    }
    this.$emit('model', this.asyncSelected.map(a => a.id))
  },
  methods: {
    asyncFind: debounce(function (query) {
      if (query.length < 3) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      kpiPenaltyService.apiGetManagerDriverRentTruck({term: query}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.asyncFound = response.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    }, 500)
  }
}
</script>
