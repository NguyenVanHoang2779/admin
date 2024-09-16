<template>
    <b-row class="my-1">
        <b-col sm="12">
            <multiselect
                    v-model="asyncSelected"
                    label="name"
                    track-by="id"
                    placeholder="Nhập tên hoặc alias tuyến đường"
                    :options="asyncFound"
                    :multiple="false"
                    :searchable="true"
                    :loading="asyncLoading"
                    :internal-search="false"
                    :disabled="isDisabled"
                    :clear-on-select="true"
                    :close-on-select="true"
                    :hide-selected="true"
                    @search-change="asyncFind">
                <span slot="noResult">{{message}}</span>
                <span slot="noOptions">{{message}}</span>
            </multiselect>
        </b-col>
    </b-row>
</template>
<script>
import Multiselect from 'vue-multiselect'
import CompanyProfileService from 'domain/services/company-profile-service'
import debounce from 'debounce'

export default {
  props: ['route', 'isDisabled', 'routeType'],
  name: 'single-select-route',

  components: {
    Multiselect,
    debounce
  },

  created () {
    this.asyncSelected = this.route
  },

  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    },
    route () {
      this.asyncSelected = this.route[0]
    }
  },

  data: () => ({
    asyncSelected: null,
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    message: 'Nhập ít nhất 2 ký tự'
  }),

  computed: {},

  methods: {
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      const dataSend = {
        term: query,
        routeType: this.routeType
      }
      CompanyProfileService.getListTruckRoutes(dataSend).then(response => {
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
