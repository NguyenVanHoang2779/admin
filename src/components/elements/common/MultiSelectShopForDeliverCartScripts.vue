<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="asyncSelected"
        label="name"
        track-by="code"
        placeholder="Nhập từ khóa tìm kiếm shop"
        :options="asyncFound"
        :multiple="true"
        :searchable="true"
        :loading="asyncLoading"
        :internal-search="false"
        :clear-on-select="true"
        :close-on-select="true"
        :hide-selected="true"
        @search-change="asyncFind"
      >
        <span slot="noResult">{{message}}</span>
        <span slot="noOptions">{{message}}</span>
        <template slot="option" slot-scope="props">
          <span style="font-weight: bold">{{props.option.name}}</span>
          <span>&emsp;{{props.option.first_address}}</span>
        </template>
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
  name: 'MultiSelectShop',
  components: {
    Multiselect,
    debounce
  },
  data: () => ({
    asyncSelected: null,
    asyncFound: [],
    asyncLoading: false,
    message: 'Nhập ít nhất 2 ký tự'
  }),
  props: {
    selected: {
      type: Array,
      default: () => []
    }
  },
  created () {
    if (this.selected) {
      this.asyncSelected = this.selected
    }
  },
  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    }
  },
  methods: {
    resetValue () {
      this.asyncSelected = null
    },
    asyncFind: debounce(async function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      const dataSend = {term: query}
      try {
        const response = await ManageLineService.searchShop(dataSend)
        const data = response.data
        this.asyncFound = data.items.map(item => {
          item.name = `${item.code} - ${item.name}`
          return item
        })
        if (_.isEmpty(data.items)) {
          this.message = 'Không tìm thấy kết quả'
        }
      } catch (reason) {
        this.message = 'Không tìm thấy kết quả'
      } finally {
        this.asyncLoading = false
      }
    }, 500)
  }
}
</script>
