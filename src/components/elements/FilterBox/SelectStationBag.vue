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
import ConfigBagService from 'domain/services/config-bag-service'
import debounce from 'debounce'
import * as _ from 'lodash'

export default {
  name: 'SelectStationBag',
  components: {
    Multiselect,
    debounce
  },
  data: () => ({
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    message: 'Nhập ít nhất 2 ký tự'
  }),
  props: ['resetDstBag', 'resetDstStation', 'resetSrcStation'],
  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    },

    resetDstBag: function (newValue, oldValue) {
      if (newValue === 1) {
        this.asyncSelected = []
        this.$emit('notResetDstBag', 0)
      }
    },
    resetDstStation: function (newValue, oldValue) {
      if (newValue === 1) {
        this.asyncSelected = []
        this.$emit('notResetDstStation', 0)
      }
    },
    resetSrcStation: function (newValue, oldValue) {
      if (newValue === 1) {
        this.asyncSelected = []
        this.$emit('notResetSrcStation', 0)
      }
    }
  },
  methods: {
    resetValue () {
      this.asyncSelected = []
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
      ConfigBagService.getStation(dataSend).then(response => {
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
