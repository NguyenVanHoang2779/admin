<template>
  <div v-if="Object.keys(staffTicketInfo.info_user).length > 0" class="staff-ticket">
    <div class="info w-35">
      <div class="d-flex justify-content-between">
        <div class="profile mt-1 mr-2 mb-1">
          <img
            class="img-circle image-gallery m-2"
            alt="avatar"
            :src="staffTicketInfo.info_user.image_profile"
          />
          <div class="d-inline-block">
            <div class="member-info">{{ staffTicketInfo.info_user.fullname }} ({{ staffTicketInfo.info_user.username }})</div>
            <div class="position">{{ staffTicketInfo.info_user.position_name }} - {{ staffTicketInfo.info_user.work_type_description }} - {{ staffTicketInfo.info_user.station_name }}</div>
          </div>
        </div>
        <div class="btn-profile m-2">
          <button @click="openStaffProfileScreen()">
            Xem
          </button>
          <button @click="openModalContact(staffTicketInfo)">
            Gọi
          </button>
        </div>
      </div>
      <div class="statistics m-2">
        <div>
          <b>Ngày vào: <span>{{ formatJoinDate }}</span></b>
        </div>
        <div class="manager">
          <b>Quản lý:</b>
          <div class="ml-1">
            <span v-for="(leader, index) in staffTicketInfo.list_leader" :key="index">
              {{ leader.fullname }}
              <b-btn @click="openChatBox(leader.id)" class="button-chat border-0 p-0">
                <img class="icon-chat ml-2"
                     src="../../../../../assets/images/icon/icon-chat.png"
                     alt="icon-chat">
              </b-btn>
              <br>
            </span>
          </div>
        </div>
        <div>
          <b>Vấn đề: <span>{{ staffTicketInfo.count_ticket }}</span></b>
        </div>
        <div>
          <span>
            Bồi hoàn: {{ staffTicketInfo.count_refund }}
          </span>
        </div>
        <div>
          <span>
            Thẻ phạt: {{ staffTicketInfo.count_penalty }}
          </span>
        </div>
        <div>
          <span>
            Thu nhập thấp: {{ staffTicketInfo.count_salary }}
          </span>
        </div>
        <div>
          <span>
            Nghỉ không phép: {{ staffTicketInfo.count_leave }}
          </span>
        </div>
        <div>
          <span>
            Tăng ca: {{ staffTicketInfo.count_overtime }}
          </span>
        </div>
        <div>
          <span>
            Chăm sóc định kỳ: {{ staffTicketInfo.count_default }}
          </span>
        </div>
      </div>
      <!-- Contact Modal -->
      <StaffContactModal
        :contactInfo="staffTicketInfo.info_user"
        :contactModalId="contactModalId"
        :title="'Gọi nhân viên'"
      >
      </StaffContactModal>
    </div>
    <div class="multi-ticket w-65 m-2">
      <div class="statistics-title mb-1">
        <b>Cần xử lý <span>({{ countTicketWait }})</span></b>
      </div>
      <template v-for="ticket in sortTickets">
        <div v-if="ticket.type === 1">
          <RoutineCareTicket
            :ticketInfo="ticket"
          ></RoutineCareTicket>
        </div>
        <div v-else-if="ticket.type === 2">
          <RefundTicket
            :ticketInfo="ticket"
          ></RefundTicket>
        </div>
        <div v-else-if="ticket.type === 3">
          <PenaltyCardTicket
            :ticketInfo="ticket"
          ></PenaltyCardTicket>
        </div>
        <div v-else-if="ticket.type === 4">
          <LowIncomeTicket
            :ticketInfo="ticket"
          ></LowIncomeTicket>
        </div>
        <div v-else-if="ticket.type === 5">
          <UnauthorizedAbsenceTicket
            :ticketInfo="ticket"
          ></UnauthorizedAbsenceTicket>
        </div>
        <div v-else-if="ticket.type === 6">
          <OvertimeTicket
            :ticketInfo="ticket"
          ></OvertimeTicket>
        </div>
        <div v-else-if="ticket.type === 7">
          <RockieTicket
            :ticketInfo="ticket"
          ></RockieTicket>
        </div>
      </template>
      <LogDetail
        :ticketIds="getTicketIds"
        :isRefreshData="isRefreshDataLog"
        :isCloseLogs="isCloseLogs"
      >
      </LogDetail>
    </div>
  </div>
</template>

<script>
// helper
import helpers from '../../../../../infrastructures/helpers/common-helpers'

// components
import RefundTicket from './Tickets/RefundTicket.vue'
import LowIncomeTicket from './Tickets/LowIncomeTicket.vue'
import PenaltyCardTicket from './Tickets/PenaltyCardTicket.vue'
import UnauthorizedAbsenceTicket from './Tickets/UnauthorizedAbsenceTicket.vue'
import OvertimeTicket from './Tickets/OvertimeTicket.vue'
import StaffContactModal from '../../../../elements/common/modal/StaffContactModal.vue'
import RoutineCareTicket from './Tickets/RoutineCareTicket.vue'
import RockieTicket from './Tickets/RockieTicket.vue'
import LogDetail from './LogDetail.vue'

export default {
  name: 'StaffTicket',
  components: {
    RefundTicket,
    LowIncomeTicket,
    PenaltyCardTicket,
    UnauthorizedAbsenceTicket,
    OvertimeTicket,
    StaffContactModal,
    RoutineCareTicket,
    RockieTicket,
    LogDetail
  },
  props: {
    staffTicketInfo: {
      type: Object
    },
    isCloseLogs: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    contactInfo: null,
    contactModalId: 'contact-modal-staff',
    isRefreshDataLog: false
  }),
  created () {
    this.contactModalId = helpers.generateUniqueId('contact-modal')
  },
  computed: {
    getTicketIds () {
      return this.staffTicketInfo.ticket_detail.map(ticket => ticket.id)
    },
    countTicketWait () {
      return this.staffTicketInfo.ticket_detail.filter(ticket => ticket.status === 0).length
    },
    sortTickets () {
      return this.sortTicket(this.staffTicketInfo.ticket_detail)
    },
    formatJoinDate () {
      return helpers.formatDate(this.staffTicketInfo.info_user.seniority_date, 'DD-MM-YYYY')
    }
  },
  methods: {
    openModalContact () {
      this.$bvModal.show(this.contactModalId)
    },
    openStaffProfileScreen () {
      window.open(`/adm/profile/staff/${this.staffTicketInfo.user_id}`, '_blank')
    },
    openChatBox (leaderId) {
      helpers.openChatBox(leaderId)
    },
    sortTicket (ticket) {
      return ticket.sort((a, b) => {
        return a.status - b.status
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../../assets/sass/components/take-care-staff.scss';
</style>
