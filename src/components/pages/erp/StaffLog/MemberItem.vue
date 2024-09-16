<template>
  <div class="member">
    <div class="member-info">
      <div class="member-position">
        <p :class="codGroupIds.includes(parseInt(member.User.group_id)) ? 'text-success-hover text-underline-hover cursor-pointer' : ''"
           class="member-info-item"
           @click="gotoCodProfile(member.User.group_id, member.User.id)">
          {{ member.ErpMasterProfile.fullname }} - {{ member.User.username }}</p>
        <p>{{ member.Position.position_name }} - {{ member.Station.name }}</p>
        <p>Hình thức - {{ member.WorkType.work_type_description }}</p>
        <p>
          Thâm niên: {{ (member.ErpMasterProfile.comeback_date || member.ErpMasterProfile.join_date)  | seniority }} ngày
        </p>
      </div>
       <hr/>
      <i class="fa fa-spin fa-spinner mr-1" v-if="refundLoading"></i>
      <div class="member-rate" v-else>
        <p>Thu nhập: {{ totalSalary }}</p>
        <p>Bồi hoàn: {{ refundMoney.done | money }}</p>
        <p>Fstar: {{ fstar.average }} / 4</p>
        <p>Phạt thẻ:
          <span>{{ fstar.warning }} CC |</span>
          <span>{{ fstar.yellow }} thẻ vàng |</span>
          <span>{{ fstar.red }} thẻ đỏ</span>
        </p>
        <div class="d-flex">
          <div class="row">
            <div class="tag-item" v-for="(tag, idx) in mpTags" :key="idx">
                <div class="tags">{{ tag.name }} <i @click="removeTagFromMp(tag)" class="delete-tag fa fa-times-circle"></i> </div>
            </div>
            <b-button class="tag-item" pill size="sm" variant="outline-secondary" @click="openTagManage()">+ Thêm tag</b-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="member-logs">
      <span><i class="fa fa-spin fa-spinner mr-1"></i></span>
    </div>
    <div class="member-logs" v-else>
      <div v-if="logs.length > 0">
        <ul class="ant-timeline">
          <li class="ant-timeline-item" v-for="(log, idx) in logs" :key="`tl-${idx}`">
            <div class="ant-timeline-item-tail"></div>
            <div class="ant-timeline-item-head ant-timeline-item-head-blue"></div>
            <div class="ant-timeline-item-content">
              <span class="time-log">{{ log.created | timeForHumans(log.type === 'salary' ? 'DD-MM-YYYY' : 'DD-MM-YYYY HH:mm:ss') }}</span
              >
                <span>
                  <span v-if="log.username">
                    <span class="pkg-order" v-if="!['note', 'fstar', 'cs_penalty'].includes(log.type)">{{ log.username }} - </span>
                    <span class="pkg-order" v-else>{{ log.fullname }} / {{ log.position }} / {{ log.username }} </span>
                  </span>
                  <span v-if="log.issue_id">
                    {{ log.type | typeForHumans }} <span class="pkg-order" @click="openTicketPopup(log.issue_id)">{{ log.issue_id }}</span> |
                  </span>
                  <span v-if="log.pkg_order">Đơn hàng:
                    <span class="pkg-order" @click="openPkgPopup(log.pkg_order)"> {{ log.pkg_order }}</span> |
                  </span>
                  <span v-if="['refund'].includes(log.type)" >Trạng thái: {{ log.status | statusToText }} |</span>
                  <span v-if="['cs_penalty'].includes(log.type)">QC phạt thẻ: {{ log.text }}</span>
                  <span v-if="['cs_penalty', 'refund'].includes(log.type)">Lý do:{{ log.text }}</span>
                  <span v-if="['buyer_vote', 'shop_vote', 'note', 'fstar', 'salary'].includes(log.type)">{{ log.text }}</span>
                </span>
            </div>
          </li>
          <li v-if="pagination.currentPage * pagination.limit < pagination.total" @click="loadMore" class="more">Xem thêm</li>
        </ul>
      </div>
      <div v-else class="empty-logs">
        <p>Chưa có dữ liệu</p>
      </div>
    </div>
    <div class="member-action">
      <b-button v-if="member.ErpMasterProfile.status === 'active'" pill size="sm" variant="outline-secondary" @click="openChatWindow(member.User.id)">
        Chat
      </b-button>
      <b-button pill size="sm" variant="outline-secondary" @click="openNote">
        Ghi chú
      </b-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import newMemberService from 'domain/services/new-member-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import MesssageEventGchat from 'infrastructures/message-event-gchat'
import ManageListCod from 'domain/entities/ManageListCod'

import Reuse from './ReuseMixin'
import {eventBus} from '../../../../main'

export default {
  mixins: [Reuse],
  props: ['member', 'idx'],
  data () {
    return {
      logs: [],
      loading: true,
      refundLoading: true,
      fstarLoading: true,
      salaryLoading: true,
      totalSalary: 'Chưa có thông tin.',
      refundMoney: {
        new: 0,
        inprogress: 0
      },
      pagination: {
        currentPage: 1,
        limit: 10,
        total: 0
      },
      fstar: {
        yellow: 0,
        red: 0,
        warning: 0,
        average: 2
      },
      codGroupIds: ManageListCod.codGroupIds,
      mpTags: []
    }
  },
  created () {
    eventBus.$on('refreshTagMp', this.refreshTagMp)
  },
  destroyed () {
    eventBus.$off('refreshTagMp', this.refreshTagMp)
  },
  mounted () {
    this.getLogs()
    this.getRefundTotalMoney()
    this.getUserFstarData()
    this.getTotalSalary()
    this.getListTagByMasterProfile()
  },
  methods: {
    resetPagination () {
      this.pagination = {
        currentPage: 1,
        limit: 10,
        total: 0
      }
    },
    openPkgPopup (pkgOrder) {
      this.$emit('togglePkgPopup', {pkgOrder, state: true})
    },
    async getLogs (append = false) {
      try {
        this.loading = true
        const {data} = await newMemberService.getUserLogs({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          id: this.member.ErpMasterProfile.id
        })
        if (append) this.logs = [...this.logs, ...data.logs]
        else this.logs = data.logs
        this.pagination.currentPage = data.page
        this.pagination.total = data.total
      } catch (e) {
        this.logs = []
      } finally {
        this.loading = false
      }
    },
    async getRefundTotalMoney () {
      try {
        this.refundLoading = true
        const {data} = await newMemberService.getRefundTotalMoney({
          masterProfileId: this.member.ErpMasterProfile.id
        })
        this.refundMoney = data.data
      } catch (e) {
        this.refundMoney = {
          new: 0,
          inprogress: 0
        }
      } finally {
        this.refundLoading = false
      }
    },
    openNote () {
      this.$emit('toggleNotePopup', {member: this.member, state: true})
    },
    openTicketPopup (ticketId) {
      this.$emit('toggleTicketPopup', {ticketId: ticketId, state: true})
    },
    loadMore () {
      this.pagination.currentPage = parseInt(this.pagination.currentPage) + 1
      this.getLogs(true)
    },
    openChatWindow (userId) {
      let message = {type: 'create_direct_chat', payload: {user: { id: `user_${userId}` }}}
      MesssageEventGchat.sendMessage(message, null)
    },
    async getUserFstarData () {
      try {
        this.fstarLoading = true
        const {data} = await newMemberService.getUserFstarData({
          masterProfileId: this.member.ErpMasterProfile.id
        })
        this.fstar = data
      } catch (e) {
        this.fstar = {
          yellow: 0,
          red: 0,
          average: 2,
          warning: 0
        }
      } finally {
        this.fstarLoading = false
      }
    },
    async getTotalSalary () {
      try {
        let currentDate = new Date()

        this.salaryLoading = true
        const {data} = await newMemberService.getTotalSalary({
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          cod_alias: this.member.Cod.alias
        })

        if (data.success) {
          this.totalSalary = data.data.final_salary ? data.data.final_salary : 'Chưa có thông tin.'
        }
      } catch (e) {
        this.totalSalary = 0
      } finally {
        this.salaryLoading = false
      }
    },
    gotoCodProfile (groupId, userId) {
      console.log(groupId, userId)
      ManageListCod.redirectProfile(groupId, userId)
    },
    async getListTagByMasterProfile () {
      try {
        this.loading = true
        const {data} = await newMemberService.getListTagByMasterProfile({
          master_profile_id: this.member.ErpMasterProfile.id
        })
        this.mpTags = data.data.map((item) => {
          return {
            id: item.ErpMemberTag.id,
            name: item.ErpMemberTag.name
          }
        })
      } catch (e) {
        // this.logs = []
      } finally {
        this.loading = false
      }
    },
    openTagManage () {
      this.$emit('toggleTagManage', {member: this.member, state: true})
    },
    refreshTagMp () {
      this.getListTagByMasterProfile()
    },
    async removeTagFromMp (tag) {
      try {
        if (confirm('Bạn có chắc muốn bỏ gắn tag ' + tag.name + ' ?')) {
          this.loading = true
          const {data} = await newMemberService.removeTagFromMasterProfile({
            master_profile_id: this.member.ErpMasterProfile.id,
            new_member_tag_id: tag.id
          })

          if (data.success) {
            this.getListTagByMasterProfile()
          } else {
            commonHelper.showMessage(data.data.message, 'warning')
          }
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    }
  },
  filters: {
    seniority (value) {
      let joinDate = moment(value, 'YYYY-MM-DD')
      let current = moment().startOf('day')
      return moment.duration(current.diff(joinDate)).asDays()
    },
    typeForHumans (value) {
      if (value === 'refund') return 'Hệ thống gán bồi hoàn'
      if (value === 'note') return 'Ghi chú'
    },
    timeForHumans (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },
    money (amount) {
      return commonHelper.formatMoney(amount)
    },
    statusToText (v) {
      if (parseInt(v) === 4) return 'Đã chốt bồi hoàn'
      if (parseInt(v) === 5) return 'Đã đối soát bồi hoàn'
      return 'n/a'
    }
  },
  watch: {
    member: {
      deep: true,
      handler () {
        this.resetPagination()
        this.getLogs()
        this.getRefundTotalMoney()
        this.getUserFstarData()
        this.getTotalSalary()
        this.getListTagByMasterProfile()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.member-action{
  text-align: right;
  margin-right: 10px;
}
.more{
  color: #219653 !important;
  cursor: pointer;
}
.btn-sm{
  border-radius: 2.25rem;
  border-color: #219653 !important;
  color: #219653 !important;
}

.ant-timeline{
  padding-top: 10px;
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
  padding: 0px 0 20px;
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
  max-width: 95%;
}
.btn-outline-secondary:hover{
  background: unset;
}
.pkg-order{
  color: #069255;
  cursor: pointer;
}
.pkg-order:hover{
  text-decoration: solid;
}
.member {
  border-bottom: 1px solid #ccc;
  padding-left: 0.75rem;
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 5fr 1fr;
  padding-top: 10px;
  padding-bottom: 10px;
  box-shadow: rgba(24, 28, 33, 0.06);
  &-info{
    padding-top: 10px;
  }
  &-baged {
    margin-top: 5px;
  }
  &-info-item {
    font-weight: bold;
    color: #069255;
  }
  &-rate{
    display: flex;
    flex-direction: column;
    max-width: 230px;
  }
}
.timeline-content {
  background-color: white;
  position: relative;
  border-radius: 6px;
  max-width: 45vw;
}

.timeline {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}

.timeline::after {
  content: "";
  position: absolute;
  width: 3px;
  background-color: #069255;
  top: 0;
  bottom: 0;
  margin-left: -6px;
}

.timeline-container {
  position: relative;
  background-color: inherit;
  padding: 13px 0 10px 10px;
}

.timeline-container::after {
  content: "";
  position: absolute;
  width: 15px;
  height: 15px;
  right: -15px;
  background-color: white;
  border: 4px solid #ff9f55;
  top: 15px;
  border-radius: 50%;
  z-index: 1;
}

.timeline-right::after {
  left: -12px;
}
.time-log{
  color: #828282;
  font-size: 14px;
}
.tags{
  background-color: #069255;
  color: #fff;
  text-align: center;
  display: inline-block;
  padding: 6px 24px;
  border-radius: 4px;
  position: relative;
}
.tag-item{
  margin: 5px;
}
.delete-tag{
  position: absolute;
  top: -5px;
  right: -5px;
  color: #000;
  cursor: pointer;
}
</style>
