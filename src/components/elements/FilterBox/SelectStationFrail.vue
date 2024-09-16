<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="asyncSelected"
        label="name"
        track-by="id"
        placeholder="Nhập Kho"
        :options="asyncFound"
        :multiple="true"
        :searchable="true"
        :loading="asyncLoading"
        :internal-search="false"
        :clear-on-select="true"
        :close-on-select="true"
        :hide-selected="true"
        selectLabel=""
        selectedLabel=""
        @search-change="asyncFind">
        <span slot="noResult">{{message}}</span>
        <span slot="noOptions">{{message}}</span>
      </multiselect>
    </b-col>
  </b-row>
</template>

<script>
import Multiselect from 'vue-multiselect'
import FrailPackage from 'domain/services/frail-package-service'
import debounce from 'debounce'
import * as _ from 'lodash'

export default {
  name: 'MultiSelectShop',
  components: {
    Multiselect,
    debounce
  },
  props: ['stationCur'],
  data: () => ({
    asyncSelected: null,
    asyncFound: [],
    asyncLoading: false,
    message: 'Nhập ít nhất 2 ký tự'
  }),
  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    }
  },
  // created () {
  //   this.asyncSelected = this.stationCur
  // },
  methods: {
    resetValue () {
      this.asyncSelected = null
    },
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      const dataSend = { term: query }
      FrailPackage.getStation(dataSend).then(response => {
        this.asyncFound = response.data.items
        if (_.isEmpty(response.data.items)) {
          this.message = 'Không tìm thấy kết quả'
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
