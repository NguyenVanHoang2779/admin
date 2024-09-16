<template>
  <multiselect
    v-model="selected"
    label="code"
    track-by="id"
    :placeholder="placeholder || ''"
    selectLabel=""
    :options="options"
    :multiple="true"
    :searchable="true"
    :loading="loading"
    :internal-search="false"
    :clear-on-select="true"
    :close-on-select="true"
    :hide-selected="true"
    @search-change="find">
    <span slot="noResult">{{ message }}</span>
    <span slot="noOptions">{{ message }}</span>
  </multiselect>
</template>
<script>
import Multiselect from 'vue-multiselect'
import commonHelper from './../../../infrastructures/helpers/common-helpers'
import manageListBagBoxService from './../../../domain/services/manage-list-bag-box-service'
import debounce from 'debounce'

export default {
  name: 'MultiSelectTruck',
  props: ['disabled', 'placeholder', 'value'],
  components: {
    Multiselect
  },
  data: () => ({
    options: [],
    loading: false,
    message: 'Nhập ít nhất 2 ký tự',
    pagination: {
      page: 1,
      more: false
    }
  }),
  computed: {
    selected: {
      get: function () {
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
      if (query.length < 2) {
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }

      this.options = []
      this.loading = true
      try {
        this.options = await manageListBagBoxService.searchTruck({
          term: query,
          page: this.pagination.page
        })
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
