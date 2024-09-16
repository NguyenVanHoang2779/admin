<template>
  <multiselect
    class="multiselect-primary"
    :disabled="disabled"
    v-model="option"
    :options="options"
    label="description"
    track-by="id"
    :placeholder="placeholder"
    :multiple="multiple"
    :searchable="true"
    :loading="loading"
    :internal-search="false"
    :clear-on-select="clearOnSelect"
    :close-on-select="autoClose"
    :hide-selected="hideSelected"
    :show-labels="false"
    @search-change="search"
    :custom-label="permissionWithInfo"
    @input="$emit('selectPermission', option)"
    @remove="op => { $emit('removePermission', op) }"
  >
    <span slot="noResult">Không có kết quả phù hợp !</span>
    <span slot="noOptions">{{ message }}</span>
    <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>
<script>
import Multiselect from 'vue-multiselect'
import PermissionManagement from 'domain/services/permission-management-service'
import debounce from 'debounce'

export default {
  name: 'select-permission',

  props: {
    value: {
      default: null
    },
    stationId: {
      default: null
    },
    codType: {
      default: null
    },
    statusId: {
      default: null
    },
    placeholder: {
      default: 'Nhập tên permission'
    },
    hideSelected: {
      default: true
    },
    autoClose: {
      default: true
    },
    clearOnSelect: {
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    listPermissionSelected: {
      type: Array,
      default: _ => ([])
    }
  },

  components: {
    Multiselect,
    PermissionManagement
  },

  data: () => ({
    option: null,
    options: [],
    loading: false,
    message: 'Nhập ít nhất 2 ký tự'
  }),

  created () {
    if (this.listPermissionSelected) {
      this.options = this.listPermissionSelected.map(item => {
        return {
          id: item.permission_id,
          name: item.name,
          description: item.description
        }
      })

      this.option = JSON.parse(JSON.stringify(this.options))
    }
  },

  watch: {
    listPermissionSelected: function (old, newVal) {
      if (this.listPermissionSelected.length > 0) {
        this.setListPermission()
      }
    }
  },

  methods: {
    // eslint-disable-next-line camelcase
    permissionWithInfo ({name, description}) {
      return `${name} — ${description}`
    },

    setListPermission () {
      this.option = this.listPermissionSelected
    },

    search: debounce(function (str) {
      this.options = []
      if (str.length < 2) {
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.loading = true
      let params = {
        permission_name: str
      }
      PermissionManagement.getListPermissionSuggest(params)
        .then(res => {
          if (res.data.success) {
            this.options = res.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }).catch(() => {
          this.message = 'Không tìm thấy kết quả'
        }).finally(
          this.loading = false
        )
    }, 500)
  }
}
</script>
