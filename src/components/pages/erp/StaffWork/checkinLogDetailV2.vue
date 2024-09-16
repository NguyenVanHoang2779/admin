<template>
  <tr>
    <td :rowspan="userCheckin.check_ins.length || 1" v-if="!idx" class="border-right">
      <img :src="userCheckin.user.image_profile" alt="Avatar" class="document-images img-circle avatar">
      <div class="d-inline-block w-70">
        <b>{{ upperCaseEachFirstLetter(userCheckin.user.fullname) }} ({{ userCheckin.user.username }})</b> <br>
        <span>{{ userCheckin.user.position_name }} - {{
            userCheckin.user.work_type_name
          }} - {{ userCheckin.user.station_name }}</span>
      </div>
      <div class="d-inline float-right d-flex flex-column">
        <b-dd left variant="outline-ghtk" class="w-100 justify-content-end mb-2"
          toggle-class="btn-pill btn-sm" dropdown no-caret menuClass="border-radius-3 p-0 border-ghtk overflow-hidden"
        >
          <span slot="button-content">
            Xem
          </span>
          <b-dd-item class="action-view border-bottom-ghtk" @click="action('show_calendar', null, userCheckin.user.user_id)">Xem công <i class="fas fa-chevron-right float-right"></i></b-dd-item>
          <b-dd-item class="action-view" @click="redirectToProfile">Xem profile <i class="fas fa-chevron-right float-right"></i></b-dd-item>
        </b-dd>

        <button class="btn btn-outline-ghtk btn-pill btn-sm mb-2"
                @click="$emit('action', {action: 'phone', data: {user_id: userCheckin.user.user_id}})">Gọi
        </button>
      </div>
      <div class="mt-2">
        <div v-for="(tag,idx) in userCheckin.fixedTags || []" :key="'fixed_tag' + idx" :style="tag.style"
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
        <span v-if="editableTag" class="text-ghtk cursor-pointer mx-2  d-inline-block" @click="openHrtagModal()"><i
          class="fas fa-plus"></i> Tag</span>
      </div>
    </td>
    <td class="border-right">
      <div class="mh-10re overflow-auto pt-1">
        <TimeLine
          :logs="checkin.logs"
          :itemStyle="{}"
          time-field="time"
          message-field="message"
          :timeFormat="formatDate"
        />
      </div>
    </td>
    <td class="text-center">
      <div v-show="showAction">
        <div v-for="(actionDesc, act) in checkin.action || []" :key="act">
          <button
            v-if="act !== 'explain'"
            class="btn btn-pill btn-sm w-50 mb-1"
            :class="act === 'rejected' ? 'btn-outline-danger' : 'btn-outline-ghtk'"
            :name="`wd-btn-${act}-checkin`"
            :data-user-id="userCheckin.user.user_id"
            @click="action(act, checkin.checkin_log.id, userCheckin.user.user_id)"
          >
            {{ actionDesc }}
          </button>
        </div>
        <div v-if="allowExplain">
          <button
            class="btn btn-pill btn-sm w-50 mb-1 btn-outline-danger"
            @click="explain()"
          >
            Giải trình
          </button>
        </div>
      </div>
    </td>
  </tr>
</template>

<style src="@/assets/sass/components/staff-work.scss" lang="scss"></style>

<script>
import TimeLine from '../StaffLog/TimeLine'
// service
import hrTagService from 'domain/services/hr-tag-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'checkin-log-detail-v2',
  data () {
    return {
      codGroupIds: [12, 14, 17, 18],
      tags: []
    }
  },
  props: {
    allowExplain: {
      default: false
    },
    userCheckin: {
      type: Object
    },
    checkin: {
      type: Object
    },
    idx: {
      type: Number
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
  components: {
    TimeLine
  },
  computed: {
    showAction () {
      if (['approved', 'rejected', 'cancel'].includes(this.checkin.checkin_log.status) || (this.allowExplain && this.checkin.explained)) return false
      return true
    }
  },
  watch: {
    checkin: {
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
  methods: {
    explain () {
      let data = {
        master_profile_id: this.userCheckin.user.master_profile_id,
        user_id: this.userCheckin.user.user_id,
        full_name: this.upperCaseEachFirstLetter(this.userCheckin.user.fullname),
        ref_id: this.checkin.checkin_log.id,
        new_value: 'checkin',
        deadline: new Date().toString()
      }
      this.$emit('action', {action: 'explain', data: data, work_type: this.userCheckin.work_type})
    },

    upperCaseEachFirstLetter (sentence) {
      return helper.upperCaseEachFirstLetter(sentence)
    },
    showIcon (id, display = 'inline-block') {
      document.getElementById(id).style.display = display
    },

    openHrtagModal () {
      this.$emit('action', {action: 'tag', data: this.checkin, work_type: this.userCheckin.work_type, work_category: this.userCheckin.work_category})
    },

    redirectToProfile () {
      this.codGroupIds.includes(+this.userCheckin.user.group_id) ? window.open('/adm/profile/cods/' + this.userCheckin.user.user_id, '_blank') : window.open('/adm/profile/master/edit/' + this.userCheckin.user.master_profile_id, '_blank')
    },
    formatDate (date, format = 'DD/MM/YYYY') {
      return helper.formatDate(date, format)
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
            this.checkin.tags = this.tags
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

    action (action = 'view', checkinId, userId) {
      this.$emit('action', {action: 'action_checkin', data: {checkinId: checkinId, userId: userId, action}})
    }
  }
}
</script>

<style lang="css" scoped>
.border-bottom-ghtk {
  border-bottom: 1px solid #069255;
}
.rounded-1rem {
  border-radius: 1rem;
}
.deleteTag {
  position: absolute;
  top: -5px;
  right: -5px;
  color: black;
  display: none;
}

.document-images {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  vertical-align: initial;
}

.w-15 {
  width: 15% !important;
}

.w-70 {
  width: 70% !important;
}

.not-checkin {
  background: #DE9657;
  color: white;
}

.fs-1r3 {
  font-size: 1.3rem;
}
</style>
