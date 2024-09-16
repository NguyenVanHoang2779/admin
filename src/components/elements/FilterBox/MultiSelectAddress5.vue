<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="address"
        label="full"
        track-by="id"
        placeholder="Nhập tìm kiếm địa chỉ"
        :options="addresses"
        :multiple="true"
        :loading="asyncLoading"
        :close-on-select="false"
        :hide-selected="false"
        :show-labels="false"
        :custom-label="customLabel">
        <span slot="noResult">Không tìm thấy kết quả</span>
        <span slot="noOptions">Nhập ít nhất 2 kí tự</span>
        <template slot="singleLabel" slot-scope="props"><span style="color: red">{{props.option.id}}</span></template>
        <template slot="option" slot-scope="props">
          <span style="color: greenyellow; font-weight: bold">{{props.option.stats}} </span>
          <span style="color: red" v-if="props.option.assigned_cod !== ''">{{props.option.assigned_cod}} </span>
          <span style="color: red" v-if="props.option.assigned !== ''">{{props.option.assigned}} </span>
          <span style="font-weight: bold">{{props.option.id}}: </span>
          <span>{{props.option.full_address_lv5}}</span>
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
  name: 'MultiSelectAddress5',
  components: {
    Multiselect,
    debounce
  },
  props: {
    params: {
      type: Object
    },
    lv4Ids: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    address: [],
    addresses: [],
    asyncLoading: false,
    message: 'Nhập ít nhất 2 ký tự',
    inParents: {}
  }),
  watch: {
    address () {
      this.$emit('onChange', this.address)
    },
    selected: {
      immediate: true,
      handler (newValue, oldValue) {
        if (!_.isEmpty(newValue)) {
          this.address = newValue
        }
      }
    },
    lv4Ids: {
      immediate: true,
      handler (newValue, oldValue) {
        if (Array.isArray(newValue) && newValue.length === 0) {
          this.address = []
          this.addresses = []
        }

        if (_.isEmpty(oldValue)) {
          oldValue = []
        }
        if (_.isEmpty(newValue)) {
          newValue = []
        }

        if (_.isEqual(newValue, oldValue)) {
          return
        }

        newValue = newValue.map(String)
        oldValue = oldValue.map(String)

        if (newValue.length === 0 && oldValue.length > 0) {
          this.addresses = []
          this.address = []
        }
        let parentsDiff = newValue.filter(function (item) { return !(oldValue.includes(item)) })
        let parentOldDiff = oldValue.filter(function (item) { return !(newValue.includes(item)) })

        if (parentsDiff.length > 0) {
          let params = {}
          parentsDiff.forEach(item => {
            params['lv4_address_id[' + item + ']'] = this.params['lv4_address_id[' + item + ']']
          })

          this.searchAddressLv5(params)
        } else {
          let addresses = []
          newValue.forEach(el => {
            addresses = addresses.concat(this.inParents[el])
          })
          this.addresses = this.addresses.filter(function (item) {
            return (addresses.includes(item.id.toString()))
          })
          this.address = this.address.filter(function (item) {
            return (addresses.includes(item.id))
          })
        }

        parentOldDiff.forEach(el => {
          delete this.inParents[el]
        })
      }
    }
  },
  methods: {
    resetValue () {
      this.address = []
    },
    customLabel (obj) {
      return `${obj.id}: ${obj.full_address_lv5}`
    },
    searchAddressLv5 (params) {
      let formData = new FormData()
      for (const [key, value] of Object.entries(params)) {
        formData.append(key, value)
      }
      formData.append('type', this.type)

      ManageLineService.getAddress5(formData).then(response => {
        if (response.data.success) {
          response.data.data.forEach(item => {
            if (!(item.lv4_id in this.inParents)) {
              this.inParents[item.lv4_id] = []
            }

            if (!this.inParents[item.lv4_id].includes(item.id)) {
              this.inParents[item.lv4_id].push(item.id.toString())
            }
          })
          this.addresses = this.addresses.concat(response.data.data)
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
    },
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []

      this.params['term'] = query
      this.params['type'] = this.type
      ManageLineService.getAddress5(this.params).then(response => {
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
