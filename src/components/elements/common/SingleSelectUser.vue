<template>
    <multiselect
      v-model="asyncSelected"
      label="name"
      track-by="id"
      :placeholder="placeholder"
      :options="asyncFound"
      :multiple="multiple"
      :searchable="true"
      :loading="asyncLoading"
      :allow-empty="true"
      :internal-search="false"
      :clear-on-select="true"
      :close-on-select="true"
      :hide-selected="false"
      selected-label=""
      deselect-label="X"
      select-label=""
      :disabled="isDisabled"
      :reset-after="resetAfter"
      @search-change="asyncFind"
      @select="op => {$emit('select', op)}"
      @remove="op => {$emit('remove', op)}"
    >
      <span slot="noResult">không có kết quả phù hợp !</span>
      <span slot="noOptions">{{ message }}</span>
      <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
    </multiselect>
</template>
<script>
import Multiselect from 'vue-multiselect'
import depositService from 'domain/services/deposit-service'

import debounce from 'debounce'

// services
import userService from 'domain/services/user-service'

// entities
import MasterProfile from 'domain/entities/MasterProfile'

export default {
  props: {
    multiple: false,
    resetAfter: {
      default: false
    },
    user: {
      type: Object,
      default: null
    },
    inScope: {
      default: false
    },
    statusId: {
      default: null
    },
    isSelectMainUser: {
      type: String,
      default: 'no'
    },
    reset: {},
    placeholder: {
      default: 'Nhập ít nhất 2 ký tự'
    },
    customClass: {
      default: 'multiselect-primary'
    },
    trainingSyllabusId: {
      default: null
    },
    roles: {
      default: null
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    targetApi: {
      type: String,
      default: 'admin'
    }
  },

  name: 'single-select-user',

  components: {
    Multiselect,
    depositService,
    debounce
  },

  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    },

    user: {
      immediate: true,
      handler: function () {
        if (this.user && this.user.id) {
          this.asyncSelected = this.user
        } else {
          this.asyncSelected = null
        }
      }
    },

    reset () {
      this.asyncSelected = null
    }
  },

  data: () => ({
    asyncSelected: null,
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    message: 'Nhập ít nhất 2 ký tự'
  }),

  computed: {},

  created () {
  },

  methods: {
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      if (this.targetApi === 'hrm') {
        let params = {
          username: query,
          mp_status: MasterProfile.ACTIVE_STATUS
        }
        userService.searchUser(params)
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
        depositService.apiGetListUsers({
          term: query,
          isSelectMainUser: this.isSelectMainUser,
          inScope: this.inScope,
          trainingSyllabusId: this.trainingSyllabusId,
          statusId: this.statusId,
          roles: this.roles
        }).then(response => {
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
