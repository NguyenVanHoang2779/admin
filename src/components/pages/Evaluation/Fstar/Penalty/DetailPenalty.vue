<template>
  <div class="row detail">
    <div class="row col-lg-5 col-sm-12">
      <div class="col-2 avatar">
        <img
          :src="penalty.user_created_info.image_profile"
          alt="">
      </div>
      <div class="description col-10">
        <ul>
          <li><span>{{ penalty.user_created_info.fullname }} - {{ penalty.user_created_info.position_name}} đánh giá: {{penalty.user_info.username}}</span></li>
          <li><span>Ngày đánh giá</span>: {{ helper.formatDate(penalty.created, 'DD/MM/YYYY - HH:mm') }}</li>
          <li><span>Trạng thái: </span><span class="status" :class="penaltyStatusColor[penalty.status]">{{ penalty.status_name }}</span></li>
          <li v-if="penalty.fstar_report.length > 0">
            <span>
              Biên bản:
              <PreviewFile
                :files="penalty.fstar_report"
                :alt="'Biên bản'"
              />
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-lg-7 col-sm-12">
      <div class="row">
        <div class="col-lg-8 col-sm-12">
          <div class="description">
            <ul class="pl-0">
              <li>
                <span>Loại hình: </span>
                <span class="mr-2">{{ penalty.category_name }}</span>
                <span class="card-category" :class="{'card-red': penalty.category === 'red_card', 'card-yellow': penalty.category === 'yellow_card'}"></span>
              </li>
              <li><span>Mức phạt: </span>{{ penalty.recompense_level_name }}</li>
              <li v-if="penalty.recompense_level === 'cash'"><span>Giá trị phạt: </span>{{ penalty.recompense_value }} {{ penalty.value_unit }} {{ penalty.value_unit === '%' ? 'Lương' : ''}}</li>
              <li><span>Nội dung: </span>{{ penalty.type_name }}</li>
              <li><span>Ngày vi phạm: </span>{{ helper.formatDate(penalty.date_key, 'DD/MM/YYYY') }}</li>
              <li><span>Lý do phạt: </span>{{ penalty.reason }}</li>
              <li><span>Chi tiết log</span>
                <Log
                  :logs="penalty.log"
                />
              </li>
            </ul>
          </div>
        </div>
        <div class="col-lg-4 col-sm-12 action" style="padding-right: 0px">
          <button class="btn btn-outline-success btn-outline-bold font-weight-bold" @click="edit" v-if="penalty.permission.update">Chỉnh sửa</button>
          <button class="btn btn-outline-danger btn-outline-bold font-weight-bold"  @click="cancel" v-if="penalty.permission.cancel">Bỏ phạt</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/sass/components/fstar/detail-penalty.scss" lang="scss"></style>

<script>
import helper from 'infrastructures/helpers/common-helpers'
import PreviewFile from '../PreviewFile.vue'
import Log from '../Log.vue'

export default {
  name: 'DetailPenalty',
  components: {
    PreviewFile,
    Log
  },
  props: {
    penalty: {
      type: Object,
      default: _ => ({})
    }
  },
  data () {
    return {
      penaltyStatusColor: {
        5: 'success-status',
        6: 'cancel-status'
      }
    }
  },
  computed: {
    helper: _ => helper
  },
  methods: {
    edit () {
      this.$emit('editPenalty', this.penalty)
    },
    cancel () {
      this.$emit('cancelPenalty', this.penalty)
    }
  }
}
</script>
