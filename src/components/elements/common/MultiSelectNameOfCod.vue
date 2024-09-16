<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="asyncSelected"
        label="fullname"
        track-by="id"
        placeholder="Chọn COD"
        :options="asyncFound"
        :multiple="multiple"
        :searchable="true"
        :loading="asyncLoading"
        :internal-search="false"
        :clear-on-select="true"
        :close-on-select="true"
        :hide-selected="false"
        select-label="✓"
        deselect-label="✗"
        selected-label="✓"
        :custom-label="customLabel"
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
  name: 'MultiSelectNameOfCod',
  components: {
    Multiselect,
    debounce
  },
  data: () => ({
    asyncSelected: null,
    asyncFound: [],
    asyncLoading: false,
    type: 3,
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
    multiple: {
      type: Boolean,
      required: true
    },
    selected: {
      type: Array,
      default: () => []
    },
    positionJob: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    resetValue () {
      this.asyncSelected = null
    },
    setSelectedOption () {
      this.asyncSelected = this.multiple ? this.selected : this.selected[0]
      this.asyncFound = this.selected
    },
    customLabel (obj) {
      const fullName = _.isEmpty(obj.fullname) ? '' : obj.fullname
      const phone1 = _.isEmpty(obj.phone1) ? '' : ' - ' + obj.phone1
      const position = _.isEmpty(obj.position) ? '' : ' - ' + obj.position
      const workTypes = _.isEmpty(obj.work_types) ? '' : ' - ' + obj.work_types
      return `${fullName}${phone1}${position}${workTypes}`
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
        getAll: true
      }
      if (!_.isEmpty(this.positionJob)) {
        dataSend['positionJob'] = this.positionJob
      }
      ManageLineService.getCod(dataSend).then(response => {
        if (!_.isEmpty(response.data.items)) {
          this.asyncFound = response.data.items
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
