<template>
  <tr>
    <td class="border-right">
      <div class="">
        <div class="position-relative">
          <div class="d-flex justify-content-between">
            <div class="d-flex justify-content-start">
              <div class="mr-2">
                <img :src="order.user.image_profile" alt="" class="rounded-circle" width="50" height="50" />
              </div>
              <div>
                <b>{{ upperCaseEachFirstLetter(order.user.fullname) }} ({{ order.user.username }})</b> <br>
                <span>{{ order.user.position_name }} - {{ order.user.work_type }} - {{ order.user.station_name }}</span> <br>
                Mã MP: {{ order.user.staff_code }}
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
                <b-dd-item class="action-view" @click="$emit('action', {action: 'view_profile_cod', data: {}})">
                  Xem profile <i class="fas fa-chevron-right float-right"></i>
                </b-dd-item>
              </b-dd>
              <br/>
              <button class="w-100 btn btn-outline-ghtk btn-sm btn-pill" @click="$emit('action', {action: 'phone', data: {user_id: order.user.id}})">Gọi</button>
            </div>
          </div>
        </div>
      </div>
    </td>
    <td class="border-right">
      <div class="mh-10re overflow-auto pt-1">
        <TimeLine
          :logs="order.logs"
          :itemStyle="{}"
          time-field="created"
          message-field="message"
          :timeFormat="formatDate"
        />
      </div>
      <div class="desc" style="color: #000 !important;">
        <b>Hạn bổ sung:</b> {{ formatDate(order.order.deadline, 'DD-MM-YYYY') }}
      </div>
    </td>
    <td>
      <div v-show="showAction">
        <div v-show="canAction" class="text-center mt-1">
          <button @click="$emit('action', {action: 'duyet', data: {}})" class="wd-order-btn-approve-info btn btn-sm btn-outline-ghtk btn-pill w-75 mb-1">Duyệt</button>
          <button @click="$emit('action', {action: 'tu_choi', data: {}})" class="btn btn-sm btn-outline-danger btn-pill w-75 mb-1">Từ chối</button>
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

// entities
import Order from 'domain/entities/Order'

// library
import { mapGetters } from 'vuex'

export default {
  name: 'report-lost-identity-card',

  components: {
    TimeLine
  },

  props: {
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
    updateVal: {
      type: Object
    },
    editableTag: {
      default: true
    }
  },

  data: () => ({
    categoryAlias: Order.categoryAlias,
    tags: []
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

    showAction () {
      return this.order.order.can_action
    },

    canAction () {
      return this.order.order.can_action
    }
  },

  methods: {
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
    }
  }
}
</script>
