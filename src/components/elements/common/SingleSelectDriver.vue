<template>
    <b-row class="my-1 sl-driver">
        <b-col sm="12">
            <multiselect
                    v-model="asyncSelected"
                    label="name"
                    track-by="id"
                    placeholder="Nhập ít nhất 2 kí tự.."
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
        </b-col>
    </b-row>
</template>
<script>
import Multiselect from 'vue-multiselect'
import CompanyProfileService from 'domain/services/company-profile-service'

import debounce from 'debounce'

export default {
  props: ['user'],
  name: 'single-select-driver',

  components: {
    Multiselect,
    CompanyProfileService,
    debounce
  },
  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    },
    user () {
      this.asyncSelected = this.user
    }
  },

  data: () => ({
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    message: 'Nhập ít nhất 2 ký tự'
  }),

  computed: {},

  created () {
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
      CompanyProfileService.apiGetListDriver({term: query, action: 'maintenance'}).then(response => {
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
<style>
@media (max-width: 900px) {
  .sl-driver .multiselect .multiselect__tags span {
    display: none;
  }
}
</style>
