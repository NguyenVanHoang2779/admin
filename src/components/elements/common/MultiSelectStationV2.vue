<template>
  <multiselect
    v-model="selected"
    label="name"
    track-by="id"
    :placeholder="placeholder"
    :options="options"
    :multiple="multiple"
    :loading="loading"
    :searchable="true"
    :internal-search="false"
    :clear-on-select="true"
    :close-on-select="true"
    :hide-selected="true"
    selectLabel=""
    selectedLabel=""
    :disabled="disabled"
    @search-change="find">
    <span slot="noResult">{{ message }}</span>
    <span slot="noOptions">{{ message }}</span>
  </multiselect>
</template>

<script>
import debounce from 'debounce'
import Multiselect from 'vue-multiselect'
import commonHelper from './../../../infrastructures/helpers/common-helpers'
import manageListBagBoxService from './../../../domain/services/manage-list-bag-box-service'

export default {
  name: 'MultiSelectStationV2',
  components: {
    Multiselect,
    debounce
  },
  props: {
    value: [Array, Object],
    disabled: Boolean,
    multiple: {
      type: Boolean,
      default: true
    },
    limitStation: {
      type: Number,
      default: 9999
    },
    placeholder: {
      type: String,
      default: 'Nhập Kho'
    },
    isReportMissingOrFind: {
      type: Boolean,
      default: false
    },
    excludes: Array
  },
  data: () => ({
    options: [],
    loading: false,
    message: 'Nhập ít nhất 2 ký tự'
  }),
  computed: {
    selected: {
      get: function () {
        if (!this.multiple) {
          return this.value
        }

        if (!Array.isArray(this.value)) {
          return []
        }
        return this.value
      },
      set: function (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    find: debounce(async function (query) {
      this.options = []
      if (this.limitStation === 1 && this.value.length === 1) {
        this.message = 'Chỉ được phép chọn một kho'
        return
      }
      if (query.length < 2) {
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }

      this.options = []
      this.loading = true
      try {
        var options = null
        if (this.isReportMissingOrFind) {
          options = await manageListBagBoxService.searchStationOrPostOffice({term: query})
        } else {
          options = await manageListBagBoxService.searchStation({term: query})
        }
        if (options.length > 0 && this.excludes && this.excludes.length > 0) {
          const excludes = this.excludes
          this.options = options.filter(function (item) {
            return (!excludes.includes(item.id))
          })
        } else {
          this.options = options
        }
      } catch (reason) {
        commonHelper.showMessage(reason.toString(), 'error')
      } finally {
        this.loading = false
      }

      if (!this.options.length) {
        this.message = 'Không tìm thấy kết quả'
      }
    }, 500)
  }
}
</script>
