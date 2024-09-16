<template>
  <tr>
    <td class="border-right">
      <div class="">
        <div class="position-relative">
          <div class="d-flex justify-content-between">
            <div class="d-flex justify-content-start">
              <div class="mr-2">
                <img :src="order.profile_info && order.profile_info.image_profile" alt="" class="rounded-circle" width="50" height="50" />
              </div>
              <div>
                <b>{{ upperCaseEachFirstLetter(order.profile_info && order.profile_info.fullname) }} ({{ order.profile_info && order.profile_info.username }})</b> <br>
                <span>{{ order.profile_info.position_name }} - {{ order.profile_info.work_type }} - {{ order.profile_info.station }}</span> <br>
                Mã MP: {{ order.profile_info.staff_code }}
              </div>
            </div>
            <div>
              <b-dd left variant="outline-ghtk" class="w-100 justify-content-end mb-2"
                toggle-class="btn-pill btn-sm" dropdown no-caret menuClass="border-radius-3 p-0 border-ghtk overflow-hidden"
              >
                <span slot="button-content">
                  Xem
                </span>
                <b-dd-item class="action-view border-bottom-ghtk" @click="$emit('action', {action: 'detail_order', data: {}})">
                  Xem đề xuất <i class="fas fa-chevron-right float-right"></i>
                </b-dd-item>
                <b-dd-item class="action-view" @click="$emit('action', {action: 'view_profile_cod', data: {user_id: order.profile_info.user_id, group_id: order.profile_info.group_id, master_profile_id: order.profile_info.id}})">
                  Xem profile <i class="fas fa-chevron-right float-right"></i>
                </b-dd-item>
              </b-dd>
              <br/>
              <button class="w-100 btn btn-outline-ghtk btn-sm btn-pill" @click="$emit('action', {action: 'phone', data: {user_id: order.profile_info.user_id}})">Gọi</button>
            </div>
          </div>
        </div>
        <div class="mt-2" v-if="type.alias !== 'lost_identity_card'">
          <div v-for="(tag,idx) in order.fixedTags || []" :key="'fixed_tag' + idx" :style="tag.style" class="d-inline-block pr-2 pl-2 mb-1">{{ tag.name }}</div>
          <template v-for="(tag,idx) in tags">
            <div class="d-inline-block mr-1 cursor-pointer position-relative"
                 @mouseover="showIcon('iconDeleteTag' + tag.record_id + idx)"
                 @mouseout="showIcon('iconDeleteTag' + tag.record_id + idx, 'none')"
                 :key="idx"
                 @click="onDeleteTag(tag)"
            >
              <div class="d-inline-block tag"
                :style="JSON.parse(tag.style)"
              >
                {{ tag.name }}
              </div>
              <i class="fa fa-times-circle deleteTag" :id="'iconDeleteTag' + tag.record_id + idx"></i>
            </div>
          </template>
          <span
            v-if="editableTag"
            class="d-inline-block cursor-pointer text-ghtk ml-2"
            @click="$emit('action', {action: 'tag', data: order, work_category: 'staff_order'})"
          ><i class="fas fa-plus"></i> Tag
          </span>
        </div>
      </div>
    </td>
    <td class="border-right">
      <div class="desc" style="color: #000 !important;" v-if="type.alias !== 'lost_identity_card'">
        <b class="text-ghtk cursor-pointer" @click="$emit('action', {action: 'detail_order', data: {}})">{{ genCodeOrder(order.id, categoryAlias[type.category]) }}</b>
        - {{ genTitle }} <br>
        <span v-show="type.alias === 'change_info' || type.alias === 'modify_ekyc_info'">Nội dung:</span>
        <span v-show="type.category === 'insurance'">Lý do:</span>
        <span v-show="type.alias === 'new_contract'">Thời hạn:</span>
        <span v-html="genContent"></span>

        <br>
        <b>Hạn xử lý: {{ formatDate(deadline, 'HH:mm:ss DD/MM/YYYY') }}</b>
      </div>
      <div class="mh-10re overflow-auto pt-1">
        <TimeLine
          :logs="order.logs"
          :itemStyle="{}"
          time-field="created"
          message-field="message"
          :timeFormat="formatDate"
        />
      </div>
      <div class="desc" style="color: #000 !important;" v-if="type.alias === 'lost_identity_card'">
        <b>Hạn bổ sung:</b> {{ formatDate(order.deadline, 'DD-MM-YYYY') }}
      </div>
    </td>
    <td>
      <div v-show="showAction">
      <div v-if="type.alias !== 'lost_identity_card'">
        <div class="text-ghtk cursor-pointer text-center" @click="$emit('action', {action: 'censor', data: {}})">Người xử lý <i class="fas fa-edit"></i></div>
        <template v-for="(censor, idx) in order.censors" >
          <div v-if="idx < 2" :key="idx">
            <img :src="censor.avatar" alt="" class="rounded-circle" width="20" height="20"/>
            {{ censor.username }} - {{ censor.station }}
          </div>
        </template>
      </div>
      <div v-show="canAction" class="text-center mt-1">
        <button v-show="canApprove" @click="$emit('action', {action: type.alias === 'modify_ekyc_info' ? 'detail_order' : 'duyet', data: {}})" class="wd-order-btn-approve-info btn btn-sm btn-outline-ghtk btn-pill w-75 mb-1">Duyệt</button>
        <button v-show="canApprove" @click="$emit('action', {action: type.alias === 'modify_ekyc_info' ? 'detail_order' : 'tu_choi', data: {}})" class="btn btn-sm btn-outline-danger btn-pill w-75 mb-1">Từ chối</button>
        <button v-if="allowExplain" @click="explain" class="btn btn-sm btn-outline-danger btn-pill w-75">Giải trình</button>
      </div>
      </div>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
.deleteTag {
  position: absolute;
  top: -5px;
  right: -5px;
  color: black;
  display: none;
}

.tag {
  display: inline-block;
  padding: 0 0.25rem;
}
</style>

<script>
// custom component
import TimeLine from '../StaffLog/TimeLine'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'

// service
import hrTagService from 'domain/services/hr-tag-service'

// entities
import Order from 'domain/entities/Order'
import Contract from 'domain/entities/Contract'

// library
import { mapGetters } from 'vuex'

export default {
  name: 'order-row-data-v2',

  components: {
    TimeLine
  },

  props: {
    approve_report_wrong_identity: {
      default: false
    },
    allowExplain: {
      default: false
    },
    order: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: Object,
      default: () => ({})
    },
    duty: {
      type: Object,
      default: () => ({})
    },
    tableName: {
      type: String
    },
    updateVal: {
      type: Object
    },
    editableTag: {
      default: true
    }
  },

  data: _ => ({
    categoryAlias: Order.categoryAlias,
    tags: [],
    contractType: Contract.typeOptions
  }),

  watch: {
    order: {
      immediate: true,
      handler: function (newVal) {
        if (newVal && newVal.tags) this.tags = newVal.tags
      }
    },
    updateVal: {
      immediate: true,
      handler: function (newVal) {
        if (newVal && newVal.field === 'tag') this.tags = newVal.data
      }
    }
  },
  computed: {
    ...mapGetters({
      curUser: 'userInfo'
    }),
    moment: moment,

    genTitle () {
      if (this.type.alias === 'change_info') {
        return 'Thay đổi thông tin ' + Object.keys(this.order.new_value).join(', ')
      }

      if (this.type.category === 'insurance') {
        return 'Bảo hiểm xã hội - ' + this.type.group_name + ' - ' + this.type.name
      }

      if (this.type.category === 'contract') {
        let typeContract = this.order.contract_info && this.order.contract_info.type_contract
        let hasKpi = this.order.contract_info && this.order.contract_info.has_kpi
        return (typeContract ? (this.contractType[typeContract] || typeContract) : '') + ' - Tính KPI: ' + (hasKpi ? 'Có' : 'Không')
      }

      if (this.type.alias === 'modify_ekyc_info') {
        return 'Cập nhật thông tin CCCD/CMND'
      }
    },

    deadline () {
      if (this.order.censors && this.order.censors.length) return this.getDeadline()
      return null
    },

    showAction () {
      if (['tu_choi', 'nhan_ket_qua', 'hoan_thanh', 'da_huy'].includes(this.order.status)) return false
      return true
    },

    canAction () {
      if (!this.order || !this.type || !this.duty[this.type.category] || (this.allowExplain && this.order.explained)) return false
      if (this.duty[this.type.category] === 'CnB') return true
      // Phân quyền duyệt đề xuất báo sai cmnd/cccd cho position 270, 271, 272
      if (
        this.order.status &&
        this.type.alias &&
        this.order.status === Order.PENDING_STATUS &&
        this.approve_report_wrong_identity &&
        this.type.alias === 'modify_ekyc_info'
      ) {
        return true
      }

      // Điều kiện theo người duyệt
      if (!this.order.censors || !Array.isArray(this.order.censors)) return false
      return this.curUser && this.curUser.User && this.order.censors.find(op => (+this.curUser.User.id === +op.id))
    },

    canApprove () {
      if (this.type.alias === 'lost_identity_card') {
        if (this.order.status !== Order.CHO_DUYET_STATUS) {
          return false
        } else {
          if (!this.order.censors || !Array.isArray(this.order.censors)) return false
          return this.curUser && this.curUser.User && this.order.censors.find(op => (+this.curUser.User.id === +op.id))
        }
      }

      return this.canAction
    },

    genContent () {
      if (this.type.alias === 'change_info' || this.type.alias === 'modify_ekyc_info') {
        let textChange = []
        for (let block in this.order.new_value) {
          for (let field in this.order.new_value[block]) {
            let arrNewTxt = []
            let arrOldTxt = []
            if (!['object', 'array'].includes(typeof this.order.new_value[block][field])) {
              let checkChangeEkycInfo = false
              if (this.type.alias === 'modify_ekyc_info' && this.order.new_value[block][field] &&
                (helper.isEmpty(this.order.old_value[block][field]) || this.order.new_value[block][field] !== this.order.old_value[block][field])) {
                checkChangeEkycInfo = true
              }
              if (this.type.alias !== 'modify_ekyc_info' || checkChangeEkycInfo) {
                arrNewTxt.push('<b>' + this.order.new_value[block][field] + '</b>')
                if (this.order.old_value[block] && this.order.old_value[block][field]) arrOldTxt.push('<b>' + this.order.old_value[block][field] + '</b>')
              }
            } else {
              if (['Chủ hộ', 'Thành viên', 'Con cái', 'Người liên hệ'].includes(field)) {
                if (this.order.old_value[block] && this.order.old_value[block][field] && this.order.old_value[block][field].length) {
                  for (let mem of this.order.old_value[block][field]) {
                    if (field === 'Chủ hộ') {
                      arrOldTxt.push(' <b>' + mem.name + (mem.mobile ? (' - SĐT ' + mem.mobile) : '') + '</b>')
                    }
                    if (field === 'Thành viên') {
                      arrOldTxt.push(' <b>' + mem.relation + ' - ' + mem.name + (mem.mobile ? (' - SĐT ' + mem.mobile) : '') + '</b>')
                    }
                    if (field === 'Con cái') {
                      arrOldTxt.push(' <b>' + mem.name + '</b>')
                    }
                    if (field === 'Người liên hệ') {
                      arrOldTxt.push(' <b>' + mem.relation + ' - ' + mem.name + (mem.mobile ? (' - SĐT ' + mem.mobile) : '') + '</b>')
                    }
                  }
                }
                for (let mem of this.order.new_value[block][field]) {
                  if (field === 'Chủ hộ') {
                    arrNewTxt.push(' <b>' + mem.name + (mem.mobile ? (' - SĐT ' + mem.mobile) : '') + '</b>')
                  }
                  if (field === 'Thành viên') {
                    arrNewTxt.push(' <b>' + mem.relation + ' - ' + mem.name + (mem.mobile ? (' - SĐT ' + mem.mobile) : '') + '</b>')
                  }
                  if (field === 'Con cái') {
                    arrNewTxt.push(' <b>' + mem.name + '</b>')
                  }
                  if (field === 'Người liên hệ') {
                    arrNewTxt.push(' <b>' + mem.relation + ' - ' + mem.name + (mem.mobile ? (' - SĐT ' + mem.mobile) : '') + '</b>')
                  }
                }
              }
            }

            if (!helper.isEmpty(arrNewTxt)) {
              textChange.push(field + ((arrOldTxt && arrOldTxt.length) ? (' từ ' + arrOldTxt.join(', ')) : '') + ' thành ' + arrNewTxt.join(', '))
            }
          }
        }
        return 'Thay đổi ' + textChange.join(', ')
      }
      if (this.type.category === 'insurance') {
        return this.order.note
      }
      if (this.type.alias === 'new_contract') {
        if (this.order.contract_info && this.order.contract_info.end_date) {
          return this.formatDate(this.order.contract_info.start_date) + ' - ' + this.formatDate(this.order.contract_info.end_date)
        }
        return 'Không thời hạn'
      }
    }
  },

  methods: {
    explain () {
      let data = {
        master_profile_id: this.order.profile_id,
        user_id: this.order.profile_info.user_id,
        ref_id: this.order.id,
        full_name: this.upperCaseEachFirstLetter(this.order.profile_info && this.order.profile_info.fullname),
        new_value: 'staff_order',
        deadline: this.deadline
      }

      this.$emit('action', {action: 'explain', data})
    },

    async onDeleteTag (tag) {
      try {
        if (confirm('Bạn có chắc muốn xóa tag ' + tag.name + ' ?')) {
          this.loading = true
          const data = await hrTagService.detach({
            record_id: +tag.record_id,
            table_name: tag.table_name,
            hr_tag_id: +tag.id
          })
          if (data.data.success) {
            this.tags = this.tags.filter(x => {
              return +x.id !== +tag.id
            })
            this.order.tags = this.tags
            helper.showMessage(data.data.message || 'Bỏ gắn tag thành công!', 'success')
          } else {
            helper.showMessage(data.data.message, 'warning')
          }
        }
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    showIcon (id, display = 'inline-block') {
      document.getElementById(id).style.display = display
    },
    formatDate (date, format = 'DD/MM/YYYY') {
      return helper.formatDate(date, format)
    },
    upperCaseEachFirstLetter (sentence) {
      return helper.upperCaseEachFirstLetter(sentence)
    },
    genCodeOrder (id, prefix = 'BH', postfix = '', codeLength = 6) {
      return helper.genCode(id, prefix, postfix, codeLength)
    },
    getDeadline () {
      if (!this.order || ['da_duyet', 'thieu_ho_so', 'tu_choi', 'co_ket_qua', 'nhan_ket_qua', 'hoan_thanh', 'da_huy'].includes(this.order.status)) return null
      if (!this.order.censors || !this.order.censors.length) return null
      let deadline = null
      this.order.censors.forEach(every => {
        if (!every.deadline) return
        if (!deadline || moment(every.deadline) < deadline) deadline = moment(every.deadline)
      })
      if (deadline) return deadline.format('YYYY-MM-DD H:m:s')
      return null
    }
  }
}
</script>
