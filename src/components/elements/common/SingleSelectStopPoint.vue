<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="asyncSelected"
        label="name"
        track-by="id"
        placeholder="Nhập từ khóa tìm kiếm điểm dừng"
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
import G3PL from 'domain/services/g3pl-service'
import debounce from 'debounce'
import * as _ from 'lodash'

export default {
  name: 'SingleSelectStopPoint',
  components: {
    Multiselect,
    debounce
  },
  props: ['index'],
  created () {
  },
  data: () => ({
    asyncSelected: null,
    asyncFound: [],
    asyncLoading: false,
    message: 'Nhập ít nhất 2 ký tự'
  }),
  watch: {
    asyncSelected () {
      this.$emit('onChange', {
        selected: this.asyncSelected,
        index: this.index
      })
    }
  },
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
      G3PL.getListStopPointByTerm(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.asyncFound = response.data.message
            if (_.isEmpty(response.data.data)) {
              this.message = 'Không tìm thấy kết quả'
            }
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
