<template>
  <b-modal
    v-model="openModal"
    :title="`Ticket Bồi hoàn ${ticketId}`"
    @hidden="close"
  >
    <div v-if="loading" class="col-md-12 form">
      <span><i class="fa fa-spin fa-spinner mr-1"></i></span>
    </div>
    <div class="col-md-12 form" v-if="ticket">
      <template v-if="ticket.IssuesUsersRefund">
        <div class="ticket-details">
          <p>Trạng thái: {{ ticket.Ipr.status_id | statusToText }}</p>
          <p>Cấp độ trách nhiệm: {{ ticket.IssuesUsersRefund.refund_group ? 'Nhóm' :  'Cá nhân' }}</p>
          <p>Số tiền phạt: {{ ticket.Ipr.penalty }}</p>
          <p>Hỗ trợ bởi công ty: 0 đ</p>
          <p>Người gán bồi hoàn: <span class="user-highlight">{{ ticket.IssuesUsersRefund.created_username }}</span></p>
        </div>
      </template>
      <b-card no-body class="mb-1" v-if="logs.length > 0">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-2 variant="default">
            Logs ticket
          </b-button>
        </b-card-header>
        <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              <ul class="ant-timeline">
                <li class="ant-timeline-item" v-for="(log, idx) in  logs" :key="`log-${idx}`">
                  <div class="ant-timeline-item-tail"></div>
                  <div class="ant-timeline-item-head ant-timeline-item-head-blue"></div>
                  <div class="ant-timeline-item-content">
                    <span class="time-log">{{ log.created | timeForHumans }}</span>
                    <span v-html="log.content"></span>
                  </div>
                </li>
              </ul>
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
      <div v-else>
        Không tìm thấy logs đơn hàng
      </div>
    </div>
    <div v-else>
      Không tìm thấy thông tin
    </div>
    <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="close">Đóng</button>
    </template>
  </b-modal>
</template>

<script>
import newMemberService from 'domain/services/new-member-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Reuse from './ReuseMixin'

export default {
  mixins: [Reuse],
  props: ['open', 'ticketId'],
  data () {
    return {
      openModal: false,
      loading: false,
      ticket: null,
      logs: []
    }
  },
  methods: {
    close () {
      this.openModal = false
      this.$emit('toggleTicketPopup', {ticketId: null, state: false})
    },
    async getTicketData () {
      try {
        this.loading = true
        const {data} = await newMemberService.getUserTiketDetails({ticketId: this.ticketId})
        if (data.success) {
          this.ticket = data.ticket
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    async getTicketLogs () {
      try {
        this.loading = true
        const {data} = await newMemberService.getTicketLogs({ticketId: this.ticketId})
        if (data.success) {
          this.logs = data.data
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    }
  },
  watch: {
    open (v) {
      this.openModal = v
      if (v === true && this.ticketId) {
        this.getTicketData()
        this.getTicketLogs()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-highlight{
  color: #069255;
}
.time-log{
  color: #828282;
  font-size: 14px;
}
.ant-timeline{
  box-sizing: border-box;
  color: #000;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  -webkit-font-feature-settings: "tnum","tnum";
  font-feature-settings: "tnum","tnum";
  margin: 0;
  padding: 0;
  list-style: none;
}
.ant-timeline-item {
  position: relative;
  margin: 0;
  padding: 0 0 20px;
  font-size: 14px;
  list-style: none;
}
.ant-timeline-item-tail {
  position: absolute;
  top: 10px;
  left: 4px;
  height: calc(100% - 10px);
  border-left: 2px solid #e8e8e8;
}
.ant-timeline-item-head-blue {
  color: #14a05b;
  border-color: #14a05b !important;
}
.ant-timeline-item-head {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #fff;
  border: 2px solid transparent;
  border-radius: 100px;
}
.ant-timeline-item-content {
  position: relative;
  top: -6px;
  margin: 0 0 0 18px;
  word-break: break-word;
}
</style>
