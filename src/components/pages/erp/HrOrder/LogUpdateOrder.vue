<template>
  <b-modal title="Thông tin thay đổi" id="view-log-update" hide-footer static>
    <LogChange :logs="logUpdate" v-loading="loading" class="position-relative"/>
  </b-modal>
</template>

<script>
// custom component
import LogChange from './LogChange'

// service
import hrOrderService from 'domain/services/hr-order-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'log-update-order',

  components: {
    LogChange
  },

  props: {
    id: {
      default: 'view-log-update'
    },

    logId: {

    }
  },

  data: _ => ({
    logUpdate: [],
    loading: false
  }),

  watch: {
    logId: {
      immediate: true,
      handler: function (newVal, oldVal) {
        if (newVal) this.getLogUpdate(newVal)
        else this.logUpdate = []
      }
    }
  },

  methods: {
    getLogUpdate (logId) {
      if (!logId) return

      this.loading = true
      hrOrderService.getLogUpdate({log_id: logId})
        .then(res => {
          if (res.data.success) {
            this.logUpdate = res.data.data || []
          } else {
            helper.showMessage(res.data.message || 'Không lấy được thông tin thay đổi !')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi khi lấy thông tin thag dổi !')
        })
        .finally(_ => {
          this.loading = false
        })
    }
  }
}
</script>
