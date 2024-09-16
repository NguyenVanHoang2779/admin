<template>
  <div>
    <div v-if="loading" class="text-center">
      <i class="fa fa-spinner fa-spin mr-2" /> Đang tải...
    </div>

    <b-alert variant="warning" class="mb-0" show v-else-if="errorMessage">{{errorMessage}}</b-alert>

    <div v-else>
      <b-row class="mb-3">
        <b-col cols="3"><b>Công thức lương:</b> {{ formulaInfo.formula }}</b-col>
        <b-col><b>Tên công thức lương:</b> {{ formulaInfo.formulaName }}</b-col>
      </b-row>

      <b-row class="mb-3">
        <b-col cols="3"><b>Ngày bắt đầu:</b> {{ config.start_date || '' }}</b-col>
        <b-col>
          <b-button variant="secondary" class="w-100px" size="sm" @click.prevent="doShowModalPkBusLog()">
            Xem log
          </b-button>
        </b-col>
      </b-row>

      <b-row class="mb-3">
        <b-col cols="3">
          <b>Số lần về bưu cục:</b> {{ config.config ? Object.values(config.config).length : 0 }}
        </b-col>
        <b-col>
          <a
            :href="`/adm/salary/manage-checkin-cod?object_type=2&object_id=${this.userId}`"
            class="btn btn-success btn-sm w-100px"
            target="_blank">
            Sửa
          </a>
        </b-col>
      </b-row>

      <div class="mb-0 table-responsive">
        <table class="table">
          <tbody>
          <tr v-for="(item, index) in config.config" :key="index">
            <td>
              <div class="form-control w-100">{{ item.shift }}</div>
            </td>
            <td>
              <div class="form-control w-100">{{ item.point_name }}</div>
            </td>
            <td>
              <div class="form-control w-100">Bắt đầu: {{ item.start }}</div>
            </td>
            <td>
              <div class="form-control w-100">Muộn: {{ item.late }}</div>
            </td>
            <td>
              <div class="form-control w-100">Kết thúc: {{ item.end }}</div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <modal-pk-bus-log v-if="isShowLogModal" :user-id="this.userId" @closed="onHidePkBusLogModal" />

  </div>
</template>

<script>
import manageListCodService from 'domain/services/manage-list-cod-service'
import ModalPkBusLog from '../ModalPkBusLog'

const STATUS_CURRENT = 1

export default {
  name: 'PkBusSettingForm',
  components: {ModalPkBusLog},
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      formulaInfo: null,
      config: {},
      loading: true,
      errorMessage: null,
      isShowLogModal: false
    }
  },
  created () {
    this.getConfigs()
  },
  methods: {
    onHidePkBusLogModal () {
      this.isShowLogModal = false
    },
    doShowModalPkBusLog () {
      this.isShowLogModal = true
    },
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
    async getConfigs () {
      if (!this.userId) {
        this.errorMessage = 'UserId không hợp lệ.'
        return
      }

      try {
        this.errorMessage = ''
        this.loading = true
        const data = await manageListCodService.getAllConfigPKBus(this.userId)
        this.loading = false
        this.formulaInfo = data.info
        this.config = {}
        if (Array.isArray(data.config)) {
          this.config = data.config.find(item => item.status_config === STATUS_CURRENT) || {}
        }
        if (this.config.config) {
          this.config.config = Object.values(this.config.config).map(item => {
            item.start = this.removeSecondInTime(item.start || '')
            item.late = this.removeSecondInTime(item.late || '')
            item.end = this.removeSecondInTime(item.end || '')
            return item
          })
        }
      } catch (reason) {
        this.errorMessage = reason.toString()
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.w-50px {
  width: 50px;
}
.w-100px {
  width: 100px;
}
</style>
