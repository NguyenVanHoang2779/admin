<template>
  <div class="row">
      <multiselect
        v-model="asyncSelected"
        label="name"
        track-by="id"
        placeholder="Chọn user"
        :options="asyncFound"
        :multiple="true"
        :searchable="true"
        :loading="asyncLoading"
        :internal-search="false"
        :clear-on-select="true"
        :close-on-select="true"
        :max="limit"
        :hide-selected="true"
        @search-change="asyncFind">
        <span slot="noResult">{{message}}</span>
        <span slot="noOptions">{{message}}</span>
      </multiselect>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
import debounce from 'debounce'
import SalaryService from 'domain/services/salary-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'select-user',
  components: {
    Multiselect,
    sosService,
    debounce
  },
  watch: {
    asyncSelected () {
      this.$emit('model', this.asyncSelected)
    },
    resetUserSelected (newVal, oldVal) {
      if (newVal === oldVal) return
      this.asyncSelected = []
    }
  },
  props: {
    limit: {
      default: 50
    },
    resetUserSelected: {
    },
    stationIds: {}
  },
  data: () => ({
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    asyncSelected: [],
    message: 'Nhập ít nhất 2 ký tự'
  }),
  computed: {
  },
  created () {
    this.$emit('model', this.asyncSelected)
  },
  methods: {
    reset () {
      this.asyncSelected = []
    },
    asyncFind: debounce(async function (query) {
      let dataSend = {
        term: query,
        stations: this.stationIds
      }
      this.isLoading = true
      try {
        // let res = await SalaryService.autoCompleteUserNV(dataSend)
        let res = await SalaryService.apiGetUserLV(dataSend)
        if (res.data.hasOwnProperty('message')) {
          commonHelper.showMessage(res.data.message, 'failed')
          this.isLoading = false
          return
        }
        this.asyncFound = res.data
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    }, 500)
  }
}
</script>
