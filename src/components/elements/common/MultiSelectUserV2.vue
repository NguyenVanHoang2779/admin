<template>
  <multiselect
    v-model="selected"
    label="text"
    track-by="id"
    :placeholder="placeholder"
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
import debounce from 'debounce'
import Multiselect from 'vue-multiselect'
import manageListBagBoxService from './../../../domain/services/manage-list-bag-box-service'

export default {
  props: {
    value: Array,
    placeholder: {
      type: String,
      default: ''
    },
    format: {
      type: String,
      default: '{username} {fullname} - {positionJob} - {stationName}'
    }
  },
  name: 'MultiSelectUserV2',
  components: {
    Multiselect,
    debounce
  },
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
  data: () => ({
    options: [],
    loading: false,
    message: 'Nhập ít nhất 2 ký tự'
  }),
  created () {
    if (this.value) {
      this.asyncSelected = this.value
    }
    this.$emit('input', this.asyncSelected.map(a => a.id))
  },
  methods: {
    find: debounce(async function (query) {
      this.options = []
      if (query.length < 2) {
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.message = ''
      try {
        this.loading = true
        this.options = await manageListBagBoxService.searchUser({term: query, format: this.format})
      } catch (reason) {
        this.message = 'Không tìm thấy kết quả'
        console.error(reason)
      } finally {
        this.loading = false
      }
    }, 500)
  }
}
</script>
