<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="asyncSelected"
        label="name"
        track-by="id"
        placeholder="Nhập tìm kiếm địa chỉ"
        :options="asyncFound"
        :multiple="true"
        :searchable="true"
        :loading="asyncLoading"
        :internal-search="false"
        :clear-on-select="true"
        :close-on-select="true"
        :hide-selected="false"
        :show-labels="true"
        :custom-label="customLabel"
        @search-change="asyncFind">
        <span slot="noResult">Không tìm thấy kết quả</span>
        <span slot="noOptions">Nhập ít nhất 2 kí tự</span>
        <template slot="singleLabel" slot-scope="props"><span style="color: red">{{props.option.id}}</span></template>
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
  name: 'MultiSelectAddress4',
  components: {
    Multiselect,
    debounce
  },
  props: {
    province_id: {
      type: String,
      default: '0'
    },
    district_id: {
      type: Array,
      default: () => []
    },
    used_address_id: {
      type: Array,
      default: () => []
    },
    cart_type: {
      type: String,
      default: '1'
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
    message: 'Nhập ít nhất 2 ký tự',
    inParents: {}
  }),
  watch: {
    asyncSelected () {
      this.asyncSelected.forEach(item => {
        if (!(item.district_id in this.inParents)) {
          this.inParents[item.district_id] = []
        }

        if (!this.inParents[item.district_id].includes(item.id)) {
          this.inParents[item.district_id].push(item.id)
        }
      })
      this.$emit('onChange', this.asyncSelected)
    },
    selected: {
      immediate: true,
      handler (newValue, oldValue) {
        if (newValue) {
          this.setSelectedOption()
        }
      }
    },
    district_id: {
      handler (newValue, oldValue) {
        if (_.isEmpty(oldValue)) {
          return
        }
        let addresses = []
        newValue.forEach(el => {
          addresses = addresses.concat(this.inParents[el])
        })

        let parentOldDiff = oldValue.filter(function (item) { return !(newValue.includes(parseInt(item))) })
        this.asyncSelected = this.asyncSelected.filter(function (item) {
          return (addresses.includes(parseInt(item.id)))
        })

        parentOldDiff.forEach(el => {
          delete this.inParents[el]
        })
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
        cart_type: this.cart_type,
        district_id: this.district_id,
        province_id: this.province_id
      }

      if (!_.isEmpty(this.used_address_id)) {
        dataSend['used_address_id'] = this.used_address_id
      }

      ManageLineService.getAddress4(dataSend).then(response => {
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
