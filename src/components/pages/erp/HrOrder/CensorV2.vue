<template>
  <div v-loading="loading" class="position-relative">
    <template v-for="(censor, idx) in order.censors">
      <div :key="idx" class="row ml-1 mb-3">
        <img :src="censor.avatar" alt="Avatar" class="col-md-1 p-0 document-images img-circle avatar">
        <div class="col-md-10">
          <b class="pt-1">{{ censor.fullname }} - {{ censor.username }} - {{ censor.position_name }}</b>
          <i style="color: #069255" class="ml-1 fa fa-comment-dots cursor-pointer" @click="gotoGroupChat(censor)" aria-hidden="true"></i>
        </div>
        <div class="col-md-1 p-0">
          <b-btn class="btn-outline-danger btn btn-sm btn-delete" @click="deleteCensor(censor)">Xóa</b-btn>
        </div>
      </div>
    </template>
    <div class="row">
      <div class="col-sm-10">
        <SelectUser
          :disabled="!canUpdateCensor"
          :class="smallView ? 'font-12' : 'font-13'"
          placeholder="Chọn người xử lý"
          :reset="resetSelectUser"
          @select="updateNewCensor(...arguments, 'add')"
          @remove="updateNewCensor(...arguments, 'delete')"
        />
      </div>
      <div class="col-sm-2 p-0 text-right">
        <b-btn class="btn-ghtk btn btn-delete" @click="updateCensor('add')">Thêm</b-btn>
      </div>
    </div>
  </div>
</template>

<script>
// custom component
import SelectUser from 'components/elements/common/SingleSelectUser'

// service
import hrOrderService from 'domain/services/hr-order-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'

export default {
  name: 'censor-v2',

  props: {
    smallView: {
      default: false
    },
    order: {
      default: _ => ({})
    },
    orderId: {}
  },

  components: {
    SelectUser
  },

  data: _ => ({
    loading: false,
    curCensor: null,
    resetSelectUser: null
  }),

  computed: {
    deadline () {
      if (this.order.censors && this.order.censors.length) return this.getDeadline(this.order)
      return null
    },

    moment () {
      return moment
    },

    canUpdateCensor () {
      return !['da_duyet', 'tu_choi', 'hoan_thanh', 'da_huy'].includes(this.order.status)
    }
  },

  created () {
    if (!this.order.censors && this.orderId) this.getCensorForOrder(this.orderId)
  },

  watch: {
    orderId (newval, oldVal) {
      if (newval && !this.order.censors) this.getCensorForOrder(newval)
    }
  },

  methods: {
    gotoGroupChat (censor) {
      if (!censor || !censor.id) return
      if (censor.channel_id) {
        window.open('https://ghtk.me/channel/internal/' + censor.channel_id, '_blank')
      } else { // Tạo group chat nếu chưa có
        hrOrderService.createDirectChat({userId: censor.id})
          .then(res => {
            if (res.data.success) {
              let channelId = res.data.data.channel_id
              window.open('https://ghtk.me/channel/internal/' + channelId, '_blank')
            } else {
              helper.showMessage(res.data.message || 'Tạo direct chat thất bại !')
            }
          })
          .catch(e => {
            helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
            console.log(e)
          })
          .finally(_ => {
            this.loading = false
          })
      }
    },

    getDeadline (order) {
      if (!order || !order.censors || !order.censors.length || ['da_duyet', 'thieu_ho_so', 'tu_choi', 'co_ket_qua', 'nhan_ket_qua', 'hoan_thanh', 'da_huy'].includes(order.status)) return null
      let deadline = null
      order.censors.forEach(every => {
        if (!every || !every.deadline) return
        if (!deadline || moment(every.deadline) < deadline) deadline = moment(every.deadline)
      })
      if (deadline) return deadline.format('YYYY-MM-DD H:m:s')
      return null
    },

    getCensorForOrder (orderId) {
      if (!orderId) return
      this.loading = true
      hrOrderService.getCensorForOrder({ order_id: orderId })
        .then(res => {
          if (res.data.success) {
            this.order.censors = res.data.data || []
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi lấy người duyệt của đề xuất !')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi khi lấy người duyệt của đề xuất !')
        })
        .then(_ => {
          this.loading = false
        })
    },

    updateCensor (type) {
      if (!type || (type !== 'add' && type !== 'delete')) return
      this.$startLoading()
      hrOrderService.updateCensor({ order: this.orderId || this.order.id, censor: this.curCensor, type: type })
        .then(res => {
          if (!res.data.success) return helper.showMessage(res.data.message || 'Không cập nhật được người duyệt, vui lòng thử lại sau !', 'warning')
          helper.showMessage(res.data.message || (type === 'add' ? 'Thêm người duyệt thành công' : 'Xóa người duyệt thành công'), 'success')
          if (type === 'add' && res.data.data.new_censor) this.order.censors.push(res.data.data.new_censor)
          if (type === 'delete') {
            this.order.censors = this.order.censors.filter(x => {
              return +x.id !== +this.curCensor.id
            })
          }
          // this.$emit('action', {action: 'updateCensor', data: this.order.censors})
          this.curCensor = null
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Không cập nhật được người duyệt, vui lòng thử lại sau !', 'warning')
        })
        .finally(_ => {
          this.$stopLoading()
          this.resetSelectUser = !this.resetSelectUser
        })
    },

    updateNewCensor (op, type) {
      if (!type || (type !== 'add' && type !== 'delete')) return
      if (type === 'add') this.curCensor = op
      if (type === 'delete') this.curCensor = null
    },

    deleteCensor (censor) {
      this.curCensor = censor
      this.updateCensor('delete')
    }
  }
}
</script>

<style>
.document-images {
  width: 30px;
  height: 40px;
  border-radius: 50%;
}
.btn-delete {
  font-weight: bold;
  border-radius: 6px;
}
</style>
