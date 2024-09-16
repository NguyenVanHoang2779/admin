<template>
  <div>
    <multiselect
      v-model="asyncSelected"
      label="code"
      track-by="id"
      placeholder=""
      selectLabel=""
      :options="asyncFound"
      :multiple="false"
      :searchable="true"
      :loading="asyncLoading"
      :internal-search="false"
      :clear-on-select="true"
      :close-on-select="true"
      :hide-selected="true"
      @search-change="asyncFind">
      <span slot="noResult">{{message}}</span>
      <span slot="noOptions">{{message}}</span>
    </multiselect>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import debounce from 'debounce'
// import commonHelper from 'infrastructures/helpers/common-helpers'
import kpiModuleService from 'domain/services/kpi-module-service'

export default {
  props: {
    user: {},
    station_id: {},
    placeholder: {
      default: 'Nhập ít nhất 2 ký tự'
    }
  },
  name: 'single-select-user-module',

  components: {
    Multiselect,
    kpiModuleService,
    debounce
  },
  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    },
    user () {
      this.asyncSelected = this.user
    },
    reset () {
      this.asyncSelected = null
    }
  },

  data: () => ({
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    message: 'Nhập ít nhất 2 ký tự'
  }),

  computed: {},

  created () {
    this.asyncSelected = this.user
  },

  methods: {
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      kpiModuleService.apiGetListUsers({term: query, station_id: this.station_id}).then(response => {
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
