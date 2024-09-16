<template>
  <div class="row detail">
    <div class="row col-lg-5 col-sm-12">
      <div class="col-2 avatar">
        <img
          :src="reward.user_created_info.image_profile"
          alt="">
      </div>
      <div class="col-10 description">
        <ul>
          <li><span>{{ reward.user_created_info.fullname }} - {{ reward.user_created_info.position_name}} đánh giá: {{reward.user_info.username}}</span></li>
          <li><span>Ngày đánh giá: </span>{{ helper.formatDate(reward.created, 'DD/MM/YYYY - HH:mm') }}</li>
          <li><span>Loại hình: </span>{{ reward.category_name }}</li>
          <li><span>Mức thưởng: </span>{{ reward.recompense_level_name }}</li>
          <li v-if="reward.recompense_level === 'cash'"><span>Giá trị thưởng: </span>{{ reward.recompense_value }}{{ reward.value_unit }} {{ reward.value_unit === '%' ? 'Lương' : ''}}</li>
          <li><span>Nội dung: </span>{{ reward.type_name }}</li>
          <li><span>Ngày thưởng: </span>{{ helper.formatDate(reward.date_key, 'DD/MM/YYYY') }}</li>
          <li><span>Lý do thưởng: </span>{{ reward.reason }}</li>
          <li><span>Trạng thái: </span ><span class="status" :class="rewardStatusColor[reward.status]">{{ reward.status_name }}</span></li>
          <li v-if="reward.fstar_report.length > 0">
            <span>
              Văn bản thưởng:
              <PreviewFile
                :files="reward.fstar_report"
                :alt="'Văn bản thưởng'"
              />
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-lg-7 col-sm-12">
      <div class="row">
        <div class="col-lg-8 col-sm-12">
          <Progress
            :processing="reward.processing"
          />
          <span class="font-weight-bold">Chi tiết log</span>
          <Log
            :logs="reward.log"
          />
        </div>
        <div class="col-lg-4 col-sm-12 action" style="padding-right: 0px">
          <button class="btn btn-outline-success btn-outline-bold font-weight-bold" @click="remove" v-if="reward.permission.delete">Xóa thưởng</button>
          <button class="btn btn-outline-success btn-outline-bold font-weight-bold" @click="edit" v-if="reward.permission.update">Chỉnh sửa</button>
          <button class="btn btn-outline-success btn-outline-bold font-weight-bold" @click="approve" v-if="reward.permission.approve">Duyệt</button>
          <button class="btn btn-outline-danger btn-outline-bold font-weight-bold" @click="cancel" v-if="reward.permission.reject">Từ chối</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/sass/components/fstar/detail-reward.scss" lang="scss"></style>

<script>
import helper from 'infrastructures/helpers/common-helpers'
import PreviewFile from '../PreviewFile.vue'
import Log from '../Log.vue'
import Progress from '../Progress.vue'
import FileViewUpload from 'components/elements/common/FileViewUpload'
export default {
  name: 'DetailReward',
  components: {
    Progress,
    PreviewFile,
    Log,
    FileViewUpload
  },
  props: {
    reward: {
      type: Object,
      default: _ => ({})
    }
  },
  data () {
    return {
      rewardStatusColor: {
        0: 'propose-status',
        1: 'cancel-status',
        2: 'approve-status',
        3: 'approve-status'
      }
    }
  },
  computed: {
    helper: _ => helper
  },
  methods: {
    edit () {
      this.$emit('editReward', this.reward)
    },
    approve () {
      this.$emit('approveReward', this.reward)
    },
    remove () {
      this.$emit('removeReward', this.reward)
    },
    cancel () {
      this.$emit('cancelReward', this.reward)
    }
  }
}
</script>
