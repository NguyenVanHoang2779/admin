<template>
  <ul class="onboard-line">
    <template v-for="(desc, step) in stepDesc">
    <LineItem
      v-if="onboardStatus[step] && onboardStatus[step].show"
      :key="step"
      :active="stepDone[step]"
      :checked="stepDone[step]"
      :message="desc"
      :contentStyle="{'width': '40%', 'display': 'inline-block', 'padding': '0 0 0.5rem 1.5rem', 'font-weight': 'bold'}"
      :tailStyle="step === 'asset' ? {'display': 'none'} : {}"
    >
      <div slot='line-item-append' v-if="!stepDone[step]" class="handler cursor-pointer d-inline align-top">
        <span class="handled-info" v-if="handlers[step] && handlers[step][0] && handlers[step][0].handler_info">
          <img :src="handlers[step][0].handler_info.avatar" alt="" width="20" height="20" class="rounded-circle">
          {{ handlers[step][0].handler_info.username }} - {{ handlers[step][0].handler_info.position_name }}
          <span class="step-handler pl-1">
            <i
              class="far fa fa-comment-dots text-ghtk font-large"
              @click="$emit('action', {action: 'chat_user', data: { user_id: handlers[step][0].handler_info.id}})"
            ></i>
          </span>
        </span>
        <i class="fas fa-edit text-success pl-1" @click="$emit('action', { action: 'edit_handler', data: {censors: handlers[step], action: step, masterProfileId: masterProfileId}})"></i>
      </div>
    </LineItem>
    </template>
  </ul>
</template>

<style scoped>
.onboard-line {
  font-variant: tabular-nums;
  -webkit-font-feature-settings: "tnum","tnum";
  font-feature-settings: "tnum","tnum";
  margin: 0;
  padding: 0;
  list-style: none;
}
.step-handler {
  display: none;
}
.handled-info:hover .step-handler{
  display: inline;
}
</style>

<script>
import LineItem from 'components/elements/logs/LineItem.vue'

export default {
  name: 'onboard-line',

  components: {
    LineItem
  },

  props: {
    onboardStatus: {},
    handlers: {},
    masterProfileId: {
      type: String
    }
  },

  data: _ => ({
    stepDesc: {
      create_user: 'Tạo tài khoản',
      ekyc: 'Hoàn thành eKYC',
      document: 'Hoàn thành hồ sơ',
      deposit: 'Đóng cọc',
      contract: 'Ký hợp đồng',
      active_wallet: 'Kích hoạt ví',
      attach_group: 'Gán nhóm',
      asset: 'Cấp phát công cụ dụng cụ'
    }
  }),

  computed: {
    stepDone () {
      let stepDone = {}
      for (let step in this.stepDesc) {
        stepDone[step] = this.onboardStatus[step] && this.onboardStatus[step].status === 'done'
      }

      return stepDone
    }
  },

  methods: {

  }
}
</script>
