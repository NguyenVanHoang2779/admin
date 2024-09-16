<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="asyncSelected"
        label="alias"
        track-by="id"
        placeholder="Nhập tên giỏ để tìm kiếm"
        :options="asyncFound"
        :multiple="true"
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
  name: 'MultiSelectCartParent',
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
  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
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
  props: {
    cartId: {
      type: String
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    setSelectedOption () {
      if (!_.isEmpty(this.selected)) {
        this.asyncSelected = this.selected
        this.asyncFound = this.selected
      }
    },
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
      const dataSend = {
        term: query,
        cartId: this.cartId
      }
      ManageLineService.getCartParent(dataSend).then(response => {
        if (!_.isEmpty(response.data)) {
          this.asyncFound = response.data.items
          if (_.isEmpty(response.data.items)) {
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
