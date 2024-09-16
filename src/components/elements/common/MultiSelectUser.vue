<template>
  <b-row class="my-1">
    <b-col sm="12">
      <multiselect
          :disabled="disabled"
          v-model="asyncSelected"
          :class="customClass"
          label="name"
          track-by="id"
          :placeholder="placeholder"
          :options="asyncFound"
          :multiple="multiple"
          :searchable="true"
          :loading="asyncLoading"
          :internal-search="false"
          :clear-on-select="clearOnSelect"
          :close-on-select="autoClose"
          :hide-selected="hideSelected"
          :show-labels="false"
          @search-change="asyncFind"
          @select="op => { $emit('select', op) }"
          @remove="op => { $emit('remove', op) }"
          @input="ops => { $emit('input', ops) }"
        >
        <span slot="noResult">Không có kết quả phù hợp !</span>
        <span slot="noOptions">{{ message }}</span>
        <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
      </multiselect>
    </b-col>
  </b-row>
</template>
<script>
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
import debounce from 'debounce'

// services
import userService from 'domain/services/user-service'

export default {
  name: 'multi-select-user',

  props: {
    users: {
      default: null
    },
    stationId: {
      default: null
    },

    customClass: {
      default: ''
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
      default: false
    },
    multiple: {
      default: true
    },
    targetApi: {
      type: String,
      default: 'admin'
    }
  },

  components: {
    Multiselect,
    sosService,
    debounce
  },

  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    },
    users: {
      immediate: true,
      handler: function () {
        this.asyncSelected = this.users
      }
    }
  },

  data: () => ({
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    message: 'Nhập ít nhất 2 ký tự'
  }),

  computed: {},

  created () {
  },

  methods: {
    resetOption () {
      this.asyncSelected = []
    },

    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      let params = {
        term: query,
        onlyMainUser: 0,
        station_id: this.stationId,
        cod_type: this.codType,
        status_id: this.statusId
      }
      if (this.targetApi === 'hrm') {
        userService.searchUser({ username: query })
          .then(response => {
            if (response.data.hasOwnProperty('success')) {
              if (response.data.success) {
                this.asyncFound = response.data.data
              } else {
                this.message = 'Không tìm thấy kết quả'
              }
            }
          }).catch(() => {
            this.message = 'Không tìm thấy kết quả'
          }).then(() => {
            this.asyncLoading = false
          })
      } else {
        sosService.apiGetListUsers(params)
          .then(response => {
            if (response.data.hasOwnProperty('success')) {
              if (response.data.success) {
                this.asyncFound = response.data.data
              } else {
                this.message = 'Không tìm thấy kết quả'
              }
            }
          }).catch(() => {
            this.message = 'Không tìm thấy kết quả'
          }).then(() => {
            this.asyncLoading = false
          })
      }
    }, 500)
  }
}
</script>
