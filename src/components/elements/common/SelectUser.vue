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
    :loading="asyncLoading"
    :internal-search="false"
    :clear-on-select="clearOnSelect"
    :close-on-select="autoClose"
    :hide-selected="hideSelected"
    :show-labels="false"
    @search-change="find"
    @select="op => { $emit('select', op) }"
    @remove="op => { $emit('remove', op) }"
    @input="ops => { $emit('input', ops) }"
  >
    <span slot="noResult">Không có kết quả phù hợp !</span>
    <span slot="noOptions">{{ message }}</span>
    <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>
<script>
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
import debounce from 'debounce'

export default {
  name: 'select-user',

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
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    option: null,
    options: [],
    asyncLoading: false,
    message: 'Nhập ít nhất 2 ký tự'
  }),

  watch: {
    value: {
      immediate: true,
      deep: true,
      handler: function (newVal) { this.option = newVal }
    }
  },

  methods: {
    find: debounce(async function (query) {
      this.options = []
      if (query.length < 2) {
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      let params = {
        term: query,
        onlyMainUser: 0,
        station_id: this.stationId,
        cod_type: this.codType,
        status_id: this.statusId
      }
      await sosService.apiGetListUsers(params)
        .then(res => {
          if (res.data.success) {
            this.options = res.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }).catch(() => {
          this.message = 'Không tìm thấy kết quả'
        }).finally()
      this.asyncLoading = false
    }, 500)
  }
}

</script>
