<template>
  <tr>
    <td class="border-right">
      <img :src="order.profile_info.image_profile" alt="Avatar" class="document-images img-circle avatar">
      <div class="d-inline-block w-60">
        <b>{{ upperCaseEachFirstLetter(order.profile_info.fullname) }} ({{ order.profile_info.username }})</b> <br>
        <span>{{ order.profile_info.position_name }} - {{ order.profile_info.province }} - {{ order.profile_info.station }}</span>
      </div>
      <div class="d-inline float-right d-flex flex-column">
        <b-dd left variant="outline-ghtk" class="w-100 justify-content-end mb-2"
          toggle-class="btn-pill btn-sm" dropdown no-caret menuClass="border-radius-3 p-0 border-ghtk overflow-hidden"
        >
          <span slot="button-content">
            Xem
          </span>
          <b-dd-item class="action-view border-bottom-ghtk" @click="$emit('action', {action: 'detail_order', data: {}})">
            Xem đề xuất <i class="fas fa-chevron-right float-right"></i>
          </b-dd-item>
          <b-dd-item class="action-view" @click="redirectToProfile(order.profile_info.user_id, order.profile_info.id, order.profile_info.group_id)">
            Xem profile <i class="fas fa-chevron-right float-right"></i>
          </b-dd-item>
        </b-dd>
        <button
          class="btn btn-outline-ghtk btn-pill btn-sm mb-2"
          @click="$emit('action', {action: 'phone', data: {user_id: order.profile_info.user_id}})">Gọi
        </button>
      </div>
      <div class="mt-2">
        <div v-for="(tag,idx) in order.fixedTags || []" :key="'fixed_tag' + idx" :style="tag.style"
             class="d-inline-block pr-2 pl-2 mb-1">{{ tag.name }}
        </div>
        <template v-for="(tag,idx) in tags">
          <div class="d-inline-block mr-1 cursor-pointer position-relative"
               @mouseover="showIcon('iconDeleteTag' + tag.record_id + idx)"
               @mouseout="showIcon('iconDeleteTag' + tag.record_id + idx, 'none')"
               @click="onDeleteTag(tag)"
               :key="idx"
          >
            <div class="d-inline-block tag"
                :style="JSON.parse(tag.style)"
            >
              {{ tag.name }}
            </div>
            <i class="fa fa-times-circle deleteTag" :id="'iconDeleteTag' + tag.record_id + idx"></i>
          </div>
        </template>
        <span class="text-ghtk cursor-pointer mx-2"
          @click="action({action: 'tag', work_category: order.work_category, data: order, work_type: order.work_type})"
        ><i class="fas fa-plus"></i> Tag
        </span>
      </div>
    </td>
    <td class="border-right" style="color: #000 !important;">
      <div>
        <strong class="text-ghtk cursor-pointer" @click="$emit('action', {action: 'detail_order', data: {}})">
          {{ genCodeOrder(order.order_id, order.category === 'contract' ? 'HĐ' : 'BH') }}
        </strong>
        <span v-if="order.contract_info">
        - <span>{{ genTypeContractName(order.contract_info.type_contract) }}</span>
        - <span>Tính KPI: {{ +order.contract_info.has_kpi ? 'Có' : 'Không' }}</span>
        </span>
      </div>
      <div v-if="order.contract_info">
        <span
          v-if="order.contract_info.end_date">Thời hạn: {{ formatDate(order.contract_info.start_date, 'DD/MM/YYYY') }} - {{ formatDate(order.contract_info.end_date, 'DD/MM/YYYY') }}</span>
        <span v-else>Thời hạn: Không thời hạn</span>
      </div>
      <div>
        <strong>Hạn xử lý: {{ formatDate(order.deadline) }}</strong>
      </div>
      <div class="mt-2">
        <TimeLine
          :itemStyle="{}"
          :logs="order.logs"
          :append-action="!['da_duyet', 'tu_choi', 'da_huy', 'hoan_thanh'].includes(order.status)"
          @action="action(...arguments)"
          :timeFormat="formatDate"
          message-field="message"
        />
      </div>
    </td>
    <td v-show="showAction">
      <div>
        <div class="text-ghtk cursor-pointer text-center" @click="$emit('action', {action: 'censor', data: {}})">Người
          xử lý <i class="fas fa-edit"></i></div>
        <template v-for="(censor, idx) in order.censors">
          <div v-if="idx < 2" :key="idx">
            <img :src="censor.avatar" alt="" class="rounded-circle" width="20" height="20"/>
            {{ censor.username }} - {{ censor.station }}
          </div>
        </template>
      </div>
      <div v-show="actions" class="text-center">
        <button
          @click="$emit('action', {action: 'duyet', data: {}})" v-show="actions.includes('approve')"
          class="btn btn-sm btn-outline-ghtk btn-pill w-75 mb-1 wd-btn-approve-contract">Duyệt
        </button>
        <button @click="$emit('action', {action: 'tu_choi', data: {}})"
          v-show="actions.includes('reject')"
          class="btn btn-sm btn-outline-danger btn-pill w-75 mb-1">Từ chối
        </button>
        <button @click="explain"
          v-show="allowExplain && actions.includes('explain')"
          class="btn btn-sm btn-outline-danger btn-pill w-75">Giải trình
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
// entities
import Contract from 'domain/entities/Contract'
import ManageListCod from 'domain/entities/ManageListCod'

// service
import hrTagService from 'domain/services/hr-tag-service'

// custom component
import TimeLine from '../StaffLog/TimeLine'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'contract-log-detail',

  components: {
    TimeLine
  },

  props: {
    allowExplain: {
      default: false
    },
    order: {
      type: Object
    },
    tableName: {
      type: String
    },
    updateVal: {
      type: Object
    }
  },

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
    showAction () {
      if (['tu_choi', 'da_duyet', 'nhan_ket_qua', 'da_huy', 'hoan_thanh'].includes(this.order.status)) return false
      return true
    },
    actions () {
      if (this.allowExplain && this.order.explained) return []
      return this.order.permission || []
    }
  },

  data () {
    return {
      typeContract: Contract.arrayTypeContract,
      tags: []
    }
  },

  methods: {
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

    action (action) {
      this.$emit('action', action)
    },

    explain () {
      let data = {
        master_profile_id: this.order.profile_info.id,
        user_id: this.order.profile_info.user_id,
        full_name: this.upperCaseEachFirstLetter(this.order.profile_info.fullname),
        ref_id: this.order.order_id,
        new_value: 'staff_order_contract',
        deadline: this.order.deadline
      }
      this.$emit('action', {action: 'explain', data: data})
    },

    showIcon (id, display = 'inline-block') {
      document.getElementById(id).style.display = display
    },
    redirectToProfile (userId, mpId, groupId) {
      ManageListCod.redirectProfile(groupId, userId, mpId)
    },
    formatDate (date, format = 'HH:mm:ss DD/MM/YYYY') {
      return helper.formatDate(date, format)
    },
    upperCaseEachFirstLetter (sentence) {
      return helper.upperCaseEachFirstLetter(sentence)
    },
    genCodeOrder (id, prefix = 'BH', postfix = '', codeLength = 6) {
      return helper.genCode(id, prefix, postfix, codeLength)
    },
    genTypeContractName (type) {
      let data = this.typeContract.find((option) => (option.value === type)) || null
      if (data !== null) return data.desc
      return null
    }
  }
}
</script>

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

.document-images {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  vertical-align: initial;
}

.w-60 {
  width: 60% !important;
}
</style>
