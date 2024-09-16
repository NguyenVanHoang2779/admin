<template>
  <div class="log-detail h-25" :ref="unionLogsId" @scroll="handleScroll">
    <ul class="ant-timeline ms-1">
      <li class="ant-timeline-item" v-for="(log, index) in dataLogs" :key="index">
        <div class="ant-timeline-item-tail"></div>
        <div class="ant-timeline-item-head ant-timeline-item-head-blue"></div>
        <div class="ant-timeline-item-content">
          <span class="time-log text-black">{{ log }}</span>
        </div>
      </li>
      <li v-show="dataLogs.length === 0">
        <div class="text-center">Không có dữ liệu logs!</div>
      </li>
    </ul>
    <div v-if="isLoading"><em class="fa fa-spin fa-spinner"/></div>
  </div>
</template>

<script>
// helper
import helpers from 'infrastructures/helpers/common-helpers'

// services
import hrmTicketService from 'domain/services/Erp/ticket-service'

export default {
  name: 'UnionLogs',
  props: {
    unionOffer: {
      type: Object,
      default: _ => ({})
    }
  },
  created () {
    this.unionLogsId = helpers.generateUniqueId(this.unionLogsId)
    this.loadDataLog()
  },
  watch: {
    unionOffer () {
      this.page = 1
      this.dataLogs = []
      this.loadDataLog()
    }
  },
  data: () => ({
    page: 1,
    limit: 10,
    isLoading: false,
    dataLogs: [],
    stopLoadData: false,
    unionLogsId: 'union-logs'
  }),
  methods: {
    async loadDataLog () {
      this.isLoading = true
      try {
        const res = await hrmTicketService.getLogs({
          code: this.unionOffer.code,
          page: this.page,
          limit: this.limit
        })
        if (res.data.success) {
          this.dataLogs.push(...res.data.data)
          this.stopLoadData = res.data.data.length < this.limit
          this.page++
        } else {
          this.stopLoadData = true
        }
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        this.stopLoadData = true
      }
    },
    handleScroll () {
      if (this.stopLoadData || this.isLoading) return
      const elementLogDetail = this.$refs[this.unionLogsId]
      if (elementLogDetail.scrollTop + elementLogDetail.clientHeight + 100 >= elementLogDetail.scrollHeight) {
        this.loadDataLog()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/components/union.scss';
</style>
