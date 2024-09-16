<template>
  <div>
    <table class="table b-table table-hover" aria-rowcount="100">
      <thead>
      <tr>
        <th aria-colindex="0"
            @click="$emit('changeOrder', {field: 'created', type: orderType === 'desc' ? 'asc' : 'desc', source: 'pause'})"
            class="sort"
        >
          Dấu thời gian
          <i v-if="orderField === 'created' && orderType === 'asc'" class="fas fa-sort-up"></i>
          <i v-else-if="orderField === 'created' && orderType === 'desc'" class="fas fa-sort-down"></i>
          <i v-else class="fas fa-sort"></i>
        </th>
        <th aria-colindex="1">Người thay đổi</th>
        <th aria-colindex="2">Loại thay đổi</th>
        <th aria-colindex="3"
            @click="$emit('changeOrder', {field: 'start_date', type: orderType === 'desc' ? 'asc' : 'desc', source: 'pause'})"
            class="sort"
        >
          Ngày bắt đầu
          <i v-if="orderField === 'start_date' && orderType === 'asc'" class="fas fa-sort-up"></i>
          <i v-else-if="orderField === 'start_date' && orderType === 'desc'" class="fas fa-sort-down"></i>
          <i v-else class="fas fa-sort"></i>
        </th>
        <th aria-colindex="4">Ngày kết thúc</th>
        <th aria-colindex="5">Lý do</th>
        <th aria-colindex="6">Người đề xuất</th>
        <th aria-colindex="7">Người quyết định</th>
        <th aria-colindex="8">Ghi chú</th>
        <th aria-colindex="9">File đính kèm</th>
        <th aria-colindex="10">Thao tác</th>
      </tr>
      </thead>
      <tbody v-if="histories && histories.length > 0">
      <tr v-for="(history, index) in histories" :key="`history-${index}`" :class="[Number(history.ErpPauseWorkHistory.is_deleted) === 1 ? 'text-secondary' : '']">
        <td>{{ history.ErpPauseWorkHistory.created | created }}</td>
        <td>{{ history.User.fullname }}</td>
        <td>{{ history.ErpPauseWorkHistory.type | typeToText }}</td>
        <td>{{ history.ErpPauseWorkHistory.start_date | moment }}</td>
        <td>{{ history.ErpPauseWorkHistory.end_date | moment }}</td>
        <td>{{ history.ErpPauseWorkHistory.reason }}</td>
        <td>{{ history.proposer || 'N/A' }}</td>
        <td>{{ history.approver || 'N/A' }}</td>
        <td>{{ history.ErpPauseWorkHistory.note || 'N/A' }}</td>
        <td class="d-flex download-file">
          <a :href="history.ErpPauseWorkHistory.attachment[0]" v-if="history.ErpPauseWorkHistory.attachment && history.ErpPauseWorkHistory.attachment.length == 1" target="_blank">
            {{ history.ErpPauseWorkHistory.attachment ? 'Tải xuống' : 'N/A'}}
          </a>
          <div v-else class="d-flex">
                    <span>
                      {{ history.ErpPauseWorkHistory.attachment ? 'Tải xuống' : 'N/A'}}
                    </span>
            <a v-if="history.ErpPauseWorkHistory.attachment.length > 1" class="ml-1"
               :href="file" target="_blank" v-for="(file, index) in history.ErpPauseWorkHistory.attachment" :key="index">[{{ index + 1 }}]</a>
          </div>
        </td>
        <td>
          <b-button v-if="history.ErpPauseWorkHistory.is_deleted === false" variant="light" @click="remove(history.ErpPauseWorkHistory.id)" size="sm">Loại bỏ</b-button>
          <div v-else>
            <p>Đã loại bỏ</p><p v-if="history.log_delete !== undefined"> bởi {{history.log_delete.action_created_by.username}}</p>
            <div style="color: #0e52e7; cursor: pointer" @click="showLogRemovePauseWorkHistory(history.ErpPauseWorkHistory.id)">Xem chi tiết</div>
          </div>
        </td>
      </tr>
      </tbody>
      <tbody v-else class="empty-body">
      <span>Hiện chưa có lịch sử nghỉ việc</span>
      </tbody>
    </table>
    <b-modal id="modal-confirm-remove-pause-work-history" title="Loại bỏ lịch sử nghỉ việc" centered hide-footer>
      <label for="input-reason-add-pause-work-history">Bạn chắc chắn muốn loại bỏ log thời gian này?<span
        class="text-danger">*</span></label>
      <b-form-input id="input-reason-add-pause-work-history" v-model="dataLogRemove.reason"
                    placeholder="Nhập lý do"></b-form-input>
      <div class="d-flex justify-content-center mt-2">
        <b-btn variant="ghtk" @click="executeRemove" class="w-50">Xác nhận</b-btn>
      </div>
    </b-modal>
    <b-modal id="modal-detail-log-remove-pause-work-history" title="Chi tiết" size="lg" centered hide-footer>
      <table class="table b-table table-hover" aria-rowcount="100">
        <thead>
        <tr>
          <th aria-colindex="4">Dấu thời gian</th>
          <th aria-colindex="4">Người thay đổi</th>
          <th aria-colindex="4">Lý do</th>
        </tr>
        </thead>
        <tbody>
        <td>{{ this.dataLog.action_created }}</td>
        <td v-if="this.dataLog.action_created_by.fullname || this.dataLog.action_created_by.username">
          {{ this.dataLog.action_created_by.fullname }} ({{ this.dataLog.action_created_by.username }})
        </td>
        <td>{{ this.dataLog.reason }}</td>
        </tbody>
      </table>
    </b-modal>
</div>

</template>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import userService from 'domain/services/user-service'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { pausWorkOptions } from './PauseWorkConst'

export default {
  props: ['histories', 'orderType', 'orderField'],
  computed: {
    ...mapGetters({
      loginUser: 'userInfo'
    })
  },
  data: () => ({
    dataLog: {
      action_created: '',
      reason: '',
      action_created_by: {
        username: '',
        fullname: ''
      }
    },
    dataLogRemove: {
      id: '',
      reason: ''
    }
  }),
  methods: {
    remove (id) {
      this.dataLogRemove.id = id
      this.$bvModal.show('modal-confirm-remove-pause-work-history')
    },
    async executeRemove () {
      try {
        if (this.dataLogRemove.reason === '') return commonHelper.showMessage('Không được bỏ trống lý do xóa log.', 'warning')
        this.$startLoading()
        const {data} = await userService.removePauseWorkHistory({id: this.dataLogRemove.id, reason: this.dataLogRemove.reason})
        if (data.success) {
          this.$emit('refresh')
          this.$bvModal.hide('modal-confirm-remove-pause-work-history')
          return commonHelper.showMessage('Đã loại bỏ lịch sử công tác thành công', 'success')
        }
        commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.$stopLoading()
      }
    },
    showLogRemovePauseWorkHistory (id) {
      var dataFilter = this.histories.filter(function (item) {
        return item.ErpPauseWorkHistory.id === id
      })
      if (dataFilter[0].log_delete) {
        this.dataLog = dataFilter[0].log_delete
      }
      this.$bvModal.show('modal-detail-log-remove-pause-work-history')
    }
  },
  filters: {
    moment: function (date) {
      return date ? moment(date).format('DD-MM-YYYY') : 'N/A'
    },
    created: function (date) {
      return moment(date).format('DD-MM-YYYY H:mm:ss')
    },
    typeToText (v) {
      return pausWorkOptions.find((option) => option.value === v) ? (pausWorkOptions.find((option) => option.value === v).text || 'N/A') : 'N/A'
    }
  },
  mounted () {
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
      this.dataLogRemove.id = ''
      this.dataLogRemove.reason = ''
    })
  }
}
</script>

<style lang="scss" scoped>
.empty-body{
  display: flex;
  margin-top: 5vh;
}

.sort{
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.download-file {
  span {
    color: #1e70cd;
  }
}
</style>
