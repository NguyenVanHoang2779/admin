<template>
    <table class="table b-table table-hover" aria-rowcount="100">
          <thead>
          <tr>
            <th aria-colindex="0"
              @click="$emit('changeOrder', {field: 'created', type: orderType === 'desc' ? 'asc' : 'desc', source: 'default'})"
              class="sort"
            >
              Dấu thời gian
              <i v-if="orderField === 'created' && orderType === 'asc'" class="fas fa-sort-up"></i>
              <i v-else-if="orderField === 'created' && orderType === 'desc'" class="fas fa-sort-down"></i>
              <i v-else class="fas fa-sort"></i>
            </th>
            <th aria-colindex="1">Người thay đổi</th>
            <th aria-colindex="2"
              @click="$emit('changeOrder', {field: 'start_date', type: orderType === 'desc' ? 'asc' : 'desc', source: 'default'})"
              class="sort"
            >
              Ngày hiệu lực
              <i v-if="orderField === 'start_date' && orderType === 'asc'" class="fas fa-sort-up"></i>
              <i v-else-if="orderField === 'start_date' && orderType === 'desc'" class="fas fa-sort-down"></i>
              <i v-else class="fas fa-sort"></i>
            </th>
            <th aria-colindex="3">Phân loại</th>
            <th aria-colindex="4">{{ this.showingType === 'promotion' ? 'Chức danh cũ' : 'Thay đổi từ' }}</th>
            <th aria-colindex="5">{{ this.showingType === 'promotion' ? 'Chức danh mới' : 'Thay đổi thành' }}</th>
            <th aria-colindex="6">Thời gian thử thách (tháng)</th>
            <th aria-colindex="7">Người đề xuất</th>
            <th aria-colindex="8">Người quyết định</th>
            <th aria-colindex="9">Ngày ban hành</th>
            <th aria-colindex="10">File đính kèm</th>
            <th aria-colindex="11" v-if="loginUser.ErpPosition &&  +loginUser.ErpPosition.id === 154">Thao tác</th>
          </tr>
          </thead>
          <tbody v-if="histories && histories.length > 0">
            <tr v-for="(history, index) in histories" :key="`history-${index}`">
              <td>{{ history.ErpWorkHistory.created | created }}</td>
              <td>{{ history.User.fullname }}</td>
              <td>{{ history.ErpWorkHistory.start_date | moment }}</td>
              <td>{{ history.ErpWorkHistory.type | showType }}</td>
              <td>{{ history.ErpWorkHistory.from_text }}</td>
              <td>{{ history.ErpWorkHistory.to_text }}</td>
              <td>{{ history.ErpWorkHistory.challenge_time || 'N/A' }}</td>
              <td>{{ history.proposer || 'N/A' }}</td>
              <td>{{ history.approver || 'N/A' }}</td>
              <td>{{ history.ErpWorkHistory.enacted | moment }}</td>
              <td>
                <a :href="history.ErpWorkHistory.attachment" target="_blank"> {{ history.ErpWorkHistory.attachment ? 'Tải xuống' : 'N/A' }}</a>
              </td>
              <td v-if="loginUser.ErpPosition &&  +loginUser.ErpPosition.id === 154"><b-button variant="light" @click="remove(history.ErpWorkHistory.id)" size="sm">Loại bỏ</b-button></td>
            </tr>
          </tbody>
          <tbody v-else class="empty-body">
            <span>Hiện chưa có lịch sử công việc</span>
          </tbody>
      </table>
</template>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import userService from 'domain/services/user-service'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  props: ['histories', 'currentPage', 'total', 'showingType', 'orderType', 'orderField'],
  computed: {
    ...mapGetters({
      loginUser: 'userInfo'
    })
  },
  methods: {
    remove (id) {
      this.$bvModal.msgBoxConfirm('Bạn chắc chắn muốn loại bỏ?', {
        title: 'Loại bỏ lịch sử công tác',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Tiếp tục',
        cancelTitle: 'Hủy',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => { if (value) this.executeRemove(id) })
        .catch(e => commonHelper.showMessage(e.message, 'warning'))
    },
    async executeRemove (historyId) {
      try {
        this.$startLoading()
        const {data} = await userService.removeWorkHistory({id: historyId})
        if (data.success) {
          this.$emit('refresh')
          return commonHelper.showMessage('Đã loại bỏ lịch sử công tác thành công', 'success')
        }
        commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.$stopLoading()
      }
    }
  },
  filters: {
    showType (type) {
      switch (type) {
        case 'station':
          return 'Kho'
        case 'department':
          return 'Bộ phận'
        case 'position':
          return 'Vị trí'
        case 'jobType':
          return 'Hình thức'
        case 'appoint':
          return 'Bổ nhiệm'
        case 'reduction':
          return 'Giáng chức'
        case 'disable_date':
          return 'Ngày tài khoản ngừng hoạt động'
        case 'ranking':
          return 'Cấp bậc nhân viên'
        case 'active_date':
          return 'Ngày tài khoản bắt đầu hoạt động'
        case 'manager_level':
          return 'Cấp bậc quản lý'
        default:
          return 'N/A'
      }
    },
    moment: function (date) {
      return date ? moment(date).format('DD-MM-YYYY') : 'N/A'
    },
    created: function (date) {
      return moment(date).format('DD-MM-YYYY H:mm:ss')
    }
  }
}
</script>

<style scoped>
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
</style>
