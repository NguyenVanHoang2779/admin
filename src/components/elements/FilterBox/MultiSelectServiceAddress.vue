<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="address"
        :options="addresses"
        :placeholder="addressPlaceholder"
        :multiple="true"
        label="name"
        track-by="id"
        :custom-label="customLabel"
      >
        <template slot="singleLabel" slot-scope="props">
          <span style="font-weight: bold">{{props.option.id}}:</span>
          <span>{{props.option.name}}</span>
        </template>
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
import debounce from 'debounce'
import * as _ from 'lodash'
import ManageLineService from 'domain/services/manage-line-service'

export default {
  name: 'MultiSelectAddressV2',
  components: {
    Multiselect,
    debounce
  },
  props: {
    type: {
      type: Array,
      default: () => []
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
    address: null,
    addresses: [],
    inParents: []
  }),
  watch: {
    selected: {
      immediate: true,
      handler (newValue, oldValue) {
        if (!_.isEmpty(newValue)) {
          this.address = newValue
        }
      }
    },
    parent_id: {
      immediate: true,
      handler (newValue, oldValue) {
        if (Array.isArray(newValue) && newValue.length === 0) {
          // this.address = []
          this.addresses = []
        }
        if (_.isEqual(newValue, oldValue) || _.isEqual(newValue, ['0'])) {
          return
        }

        let dataSend = {
          type: this.type,
          parent_id: this.parent_id
        }

        if (_.isEqual(this.type, [3, 7])) {
          if (!_.isEqual(oldValue, ['0'])) {
            // this.address = []
            this.addresses = []
          }

          this.getAddresses(dataSend)
        } else {
          if (_.isEmpty(oldValue)) {
            oldValue = []
          }
          if (_.isEmpty(newValue)) {
            newValue = []
          }

          if (newValue.length === 0) {
            this.addresses = []
            // this.address = []
          }

          let parentsDiff = newValue.filter(function (item) { return !(oldValue.includes(parseInt(item))) })
          let parentOldDiff = oldValue.filter(function (item) { return !(newValue.includes(parseInt(item))) })

          if (parentsDiff.length > 0) {
            dataSend['parent_id'] = parentsDiff
            this.getAddresses(dataSend)
          } else {
            let addresses = []
            newValue.forEach(el => {
              addresses = addresses.concat(this.inParents[el])
            })
            this.addresses = this.addresses.filter(function (item) {
              return (addresses.includes(parseInt(item.id)))
            })
            this.address = this.address.filter(function (item) {
              return (addresses.includes(parseInt(item.id)))
            })
          }

          parentOldDiff.forEach(el => {
            delete this.inParents[el]
          })
        }
      }
    },
    address () {
      this.$emit('onChange', this.address)
    }
  },
  methods: {
    customLabel ({ id, name }) {
      return `${id}: ${name}`
    },
    resetValue () {
      this.address = []
    },
    getAddresses (dataSend) {
      ManageLineService.getAddressByType(dataSend).then(response => {
        if (response.data.success) {
          if (_.isEqual(this.type, [3, 7])) {
            this.addresses = response.data.data
          } else {
            this.inParents[dataSend.parent_id] = response.data.data.map(function (item) { return item.id })
            this.addresses = this.addresses.concat(response.data.data)
          }
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
    }
  },
  computed: {
    addressPlaceholder () {
      if (_.isEmpty(this.parent_id) || _.isEqual(this.parent_id, ['0'])) {
        return 'Không có thông tin về tỉnh/ thành phố.'
      } else if (this.placeholder) {
        return this.placeholder
      }
      return 'Chọn quận/ huyện'
    }
  }
}
</script>
