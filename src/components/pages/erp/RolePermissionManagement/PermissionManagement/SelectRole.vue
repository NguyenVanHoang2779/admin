<template>
  <multiselect
    :disabled="disabled"
    v-model="option"
    :options="options"
    label="name"
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
    :custom-label="roleWithInfo"
    @input="$emit('selectRole', option)"
    @remove="$emit('removeRole', option)"
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
  name: 'select-role',

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
      default: null
    },
    hideSelected: {
      default: false
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

  watch: {
    value: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        this.option = newVal
      }
    }
  },

  methods: {
    // eslint-disable-next-line camelcase
    roleWithInfo ({name, description, group_id}) {
      // eslint-disable-next-line camelcase
      if (group_id) {
        return `${name} — ${description} (Role được tạo cho GROUP)`
      }
      return `${name} — ${description}`
    },
    resetData () {
      this.option = null
    },
    search: debounce(function (str) {
      this.options = []
      if (str.length < 2) {
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.loading = true
      let params = {
        role_name: str
      }
      PermissionManagement.getListRoleSuggest(params)
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
