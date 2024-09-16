<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="asyncSelected"
        label="name"
        track-by="id"
        :placeholder="placeholder"
        :options="asyncFound"
        :multiple="multiple"
        :searchable="true"
        :loading="asyncLoading"
        :internal-search="false"
        :clear-on-select="true"
        :close-on-select="true"
        :hide-selected="false"
        :custom-label="customLabel"
        @search-change="asyncFind">
        <span slot="noResult">Không tìm thấy kết quả</span>
        <span slot="noOptions">Nhập ít nhất 2 kí tự</span>
        <template slot="singleLabel" slot-scope="props">
          <span style="font-weight: bold">{{props.option.id}}:</span>
          <span>{{props.option.name}}</span></template>
        <template slot="option" slot-scope="props">
          <span style="font-weight: bold">{{props.option.id}}:</span>
          <span>{{props.option.name}}</span>
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
  name: 'MultiSelectAddress',
  components: {
    Multiselect,
    debounce
  },
  props: {
    type: {
      type: String
    },
    parent_id: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      required: true
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
    customLabel ({ id, name }) {
      return `${id}: ${name}`
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
        type: this.type
      }

      if (!_.isEmpty(this.parent_id)) {
        dataSend['parent_id'] = this.parent_id
      }

      ManageLineService.getAddressByType(dataSend).then(response => {
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
