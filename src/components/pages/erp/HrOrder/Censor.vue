<template>
  <div v-loading="loading">
    <div :class="moment() > moment(deadline) ? 'text-danger' : 'text-ghtk'" v-if="deadline">
      Hạn xử lý: {{ moment(deadline).format('HH:mm:ss DD/MM/YYYY') }}
    </div>
    <MultiSelectUser
      :disabled="!canUpdateCensor"
      :class="smallView ? 'font-12' : 'font-13'"
      placeholder="Chọn người xử lý"
      :users="order.censors"
      @select="updateCensor(...arguments, 'add')"
      @remove="updateCensor(...arguments, 'delete')"
      @input="ops => { order.censors = (ops || []) }"
      :hide-selected="false"
    />
  </div>
</template>

<script>
// custom component
import MultiSelectUser from 'components/elements/common/MultiSelectUser'

// service
import hrOrderService from 'domain/services/hr-order-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'

export default {
  name: 'censor',

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
    MultiSelectUser
  },

  data: _ => ({
    loading: false
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
      return !(this.order.delete || ['da_duyet', 'tu_choi', 'hoan_thanh', 'da_huy'].includes(this.order.status))
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
    getDeadline (order) {
      if (!order || !order.censors || !order.censors.length || ['hoan_thanh', 'da_duyet', 'thieu_ho_so', 'tu_choi', 'co_ket_qua', 'nhan_ket_qua'].includes(order.status)) return null
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

    updateCensor (op, type) {
      if (!type || (type !== 'add' && type !== 'delete')) return
      this.$startLoading()
      hrOrderService.updateCensor({ order: this.orderId || this.order.id, censor: op, type: type })
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || (type === 'add' ? 'Thêm người duyệt thành công' : 'Xóa người duyệt thành công'), 'success')
            this.order.logs.unshift(res.data.data)
            this.$emit('updateCensor')
          } else {
            // reset lại input select user khi không cập nhật được
            if (type === 'add') { // thêm
              this.order.censors.pop()
            } else { // xóa
              if (!this.order.censors) this.order.censors = [op]
              else this.order.censors.push(op)
            }
            helper.showMessage(res.data.message || 'Không cập nhật được người duyệt, vui lòng thử lại sau !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Không cập nhật được người duyệt, vui lòng thử lại sau !', 'warning')
        })
        .finally(_ => {
          this.$stopLoading()
        })
    }
  }
}
</script>
