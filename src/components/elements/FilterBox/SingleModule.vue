<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="asyncSelected"
        label="name"
        track-by="id"
        :placeholder="'Nhập tên module'"
        :options="asyncFound"
        :multiple="false"
        :searchable="true"
        :loading="asyncLoading"
        :internal-search="false"
        :clear-on-select="true"
        :close-on-select="true"
        :hide-selected="false"
        @search-change="asyncFind">
        <span slot="noResult">Không tìm thấy kết quả</span>
        <span slot="noOptions">Nhập ít nhất 2 kí tự</span>
      </multiselect>
    </b-col>
  </b-row>
</template>

<script>
import Multiselect from 'vue-multiselect'
import ManageLineService from 'domain/services/manage-line-service'
import debounce from 'debounce'
import * as _ from 'lodash'

export default {
  name: 'SingleModule',
  components: {
    Multiselect,
    debounce
  },
  props: {
    station_id: {
      type: String,
      default: '0'
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    asyncSelected: null,
    asyncFound: [],
    asyncLoading: false,
    message: 'Nhập ít nhất 2 ký tự'
  }),
  watch: {
    asyncSelected () {
      this.$emit('selected', this.asyncSelected)
    },
    selected: {
      immediate: true,
      handler (newValue, oldValue) {
        if (newValue) {
          this.setSelectedOption()
        }
      }
    }
  },
  methods: {
    resetValue () {
      this.asyncSelected = null
    },
    setSelectedOption () {
      if (!_.isEmpty(this.selected)) {
        this.asyncSelected = this.selected
        this.asyncFound = this.selected
      }
    },
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
        station_id: [this.station_id]
      }

      ManageLineService.getModule(dataSend).then(response => {
        if (response.data.success) {
          this.asyncFound = response.data.data
          if (_.isEmpty(response.data.data)) {
            this.message = 'Không tìm thấy kết quả'
          }
        } else {
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
