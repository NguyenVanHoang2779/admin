<template>
  <div>
    <b-modal
      title="Lịch sử thay đổi"
      size="lg"
      header-bg-variant="white"
      header-text-variant="black"
      static
      centered
      scrollable
      v-model="show"
      id="ModalPkBusLog"
    >
      <div v-if="loading" class="text-center">
        <i class="fa fa-spin fa-spinner"/> Đang tải dữ liệu...
      </div>

      <b-alert variant="warning" show v-else-if="errorMessage">{{ errorMessage }}</b-alert>

      <div v-else class="table-responsive">
        <table class="table table-striped">
          <tbody>
          <tr v-for="(item, index) in logs" :key="index">
            <td style="width: 20%">
              <div><b>{{ item.editor }}</b></div>
              <div>{{ item.time_edit }}</div>
            </td>
            <td>
              <div class="font-weight-bold">Đã tạo config mới áp dụng từ {{ item.start_date }}</div>
              <div class="p-1">
                <b-row v-for="(config, keyIndex) in item.times" :key="keyIndex">
                  <b-col sm="5">
                    <span class="no-wrap">Ca {{ config.shift }}: </span>{{ config.point_name }}
                  </b-col>
                  <b-col sm="2">Bắt đầu: {{ config.start }}</b-col>
                  <b-col sm="2">Muộn: {{ config.late }}</b-col>
                  <b-col sm="3">Kết thúc: {{ config.end }}</b-col>
                </b-row>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <template #modal-footer="{ hide }">
        <b-button variant="outline-secondary" @click="hide()">Đóng</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import manageListCodService from '../../../domain/services/manage-list-cod-service'

export default {
  name: 'ModalPkBusLog',
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      logs: [],
      show: true,
      loading: false,
      errorMessage: null
    }
  },
  mounted () {
    this.getLogs()
    this.$root.$on('bv::modal::hidden', () => {
      this.$emit('closed')
    })
  },
  methods: {
    /**
     * Đổi format từ H:i:s -> H:i (loại bỏ giây)
     */
    removeSecondInTime (time) {
      if (!time) {
        return ''
      }
      const timeParts = time.split(':')
      return [timeParts[0] || '', timeParts[1] || ''].join(':')
    },

    /**
     * Lấy thông tin log thay đổi PK Bus
     */
    async getLogs () {
      try {
        this.loading = true
        const logs = await manageListCodService.getConfigPKBusLog(this.userId)
        this.logs = logs.log.filter(log => !log.is_delete).map(log => {
          log.times = Object.values(log.times).map(item => {
            item.start = this.removeSecondInTime(item.start || '')
            item.late = this.removeSecondInTime(item.late || '')
            item.end = this.removeSecondInTime(item.end || '')
            return item
          })
          return log
        })
      } catch (reason) {
        this.errorMessage = reason.toString()
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
