<template>
  <div>
    <b-modal
      :title="'Lịch sử thay đổi ca ' + workShiftId"
      size="lg"
      header-bg-variant="white"
      header-text-variant="black"
      centered
      static
      scrollable
      v-model="show"
      id="ModalWorkCapacityLog"
    >
      <div v-if="loading" class="text-center">
        <i class="fa fa-spin fa-spinner"/> Đang tải dữ liệu...
      </div>

      <b-alert variant="warning" show v-else-if="errorMessage">{{ errorMessage }}</b-alert>

      <div v-else class="table-responsive">
        <table class="table table-striped log-config">
          <tbody>
          <tr v-for="(item, index) in logs" :key="index">
            <td style="width: 30%">
              <div><b>{{ item['created_user_fullname'] }}</b></div>
              <div>{{ item['date_created'] }}</div>
              <div>{{ item['time_created'] }}</div>
            </td>
            <td>
              <div class="font-weight-bold">{{ item['desc'] }}</div>
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
import manageListCodService from '../../../../domain/services/manage-list-cod-service'

export default {
  name: 'ModalPickCapacityLog',
  props: {
    userId: {
      type: Number,
      required: true
    },
    workShiftId: {
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
     * Lấy thông tin log thay đổi Work Capacity
     */
    async getLogs () {
      try {
        this.loading = true
        this.logs = await manageListCodService.getCodPickCapacityLogs(this.userId, this.workShiftId)
      } catch (reason) {
        this.errorMessage = reason.toString()
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
.log-config > tbody {
  display: block;
  height: 700px;
  width: 100%;
  overflow-y: auto;
}

.log-config > tbody > tr {
  display: table;
  width: 100%;
  table-layout: inherit;
}

.log-config > tbody > tr:nth-child(odd) > td,
.log-config > tbody > tr:nth-child(odd) > th {
  background-color: #f3fafc;
}
</style>
