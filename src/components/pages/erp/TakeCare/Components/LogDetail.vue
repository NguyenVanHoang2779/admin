<template>
  <div
    class="mt-2 log-detail"
    :ref="logDetailId"
    @scroll="handleScroll()"
  >
    <b-button
      v-b-toggle="collapseId"
      class="w-100"
      variant="log-detail"
    >
      Chi tiết log
      <span>
        <img src="../../../../../assets/images/icon/accordion.png" alt="accordion">
      </span>
    </b-button>
    <b-collapse :id="collapseId" :ref="collapseId" class="mt-2" @show="showCollapseLogs" @hide="hideCollapseLogs">
      <b-card no-body class="border-0">
        <ul class="ant-timeline m-0">
          <li class="ant-timeline-item" v-for="(log, index) in dataLogs" :key="index">
            <div class="ant-timeline-item-tail"></div>
            <div class="ant-timeline-item-head-log">
            </div>
            <div class="ant-timeline-item-content">
              <span v-html="log.log_detail"></span>
            </div>
          </li>
          <li v-show="dataLogs.length === 0">
              <div class="text-center">Không có dữ liệu!</div>
          </li>
          <loading-mini-bottom :enable="isLoading"></loading-mini-bottom>
        </ul>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
// helper
import helpers from '../../../../../infrastructures/helpers/common-helpers'

// services
import ticketService from '../../../../../domain/services/ticket-service'
import LoadingMiniBottom from '../../../../elements/loading/LoadingMiniBottom.vue'

export default {
  name: 'LogDetail',
  components: {
    LoadingMiniBottom
  },
  props: {
    ticketIds: {
      type: Array,
      default: _ => ([])
    },
    isRefreshData: {
      type: Boolean,
      default: false
    },
    isCloseLogs: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    collapseId: 'collapse',
    logDetailId: 'log-detail',
    elementLogDetail: null,
    offset_id: 0,
    limit: 10,
    isLoading: false,
    dataLogs: [],
    stopLoadData: false,
    isShowCollapse: false
  }),
  created () {
    this.collapseId = helpers.generateUniqueId(this.collapseId)
    this.logDetailId = helpers.generateUniqueId(this.logDetailId)
  },
  watch: {
    isRefreshData (value) {
      if (value) {
        this.refreshDataLog()
      }
    },
    isCloseLogs () {
      this.closeCollapseLogs()
    }
  },
  methods: {
    hideCollapseLogs () {
      this.isShowCollapse = false
    },
    closeCollapseLogs () {
      if (this.isShowCollapse) {
        this.$root.$emit('bv::toggle::collapse', this.collapseId)
        this.isShowCollapse = false
      }
    },
    showCollapseLogs () {
      this.isShowCollapse = true
      this.refreshDataLog()
    },
    refreshDataLog () {
      this.dataLogs = []
      this.offset_id = 0
      this.stopLoadData = false
      this.loadDataLog()
      this.$parent.isRefreshDataLog = false
    },
    loadDataLog () {
      this.isLoading = true
      ticketService.getLogs({
        offset_id: this.offset_id,
        limit: this.limit,
        ticket_ids: this.ticketIds
      }).then(res => {
        if (res.data.data.length < this.limit) {
          this.stopLoadData = true
        }
        this.dataLogs.push(...res.data.data)
        this.offset_id = this.dataLogs[this.dataLogs.length - 1].id
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    },
    handleScroll () {
      if (this.stopLoadData || this.isLoading) return
      const elementLogDetail = this.$refs[this.logDetailId]
      if (elementLogDetail.scrollTop + elementLogDetail.clientHeight + 100 >= elementLogDetail.scrollHeight) {
        this.loadDataLog()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.log-detail {
  max-height: 12rem;
  overflow: auto;
  font-weight: 400;

  &::-webkit-scrollbar {
    width: 0;
  }
}

.ant-timeline {
  box-sizing: border-box;
  color: black;
  font-variant: tabular-nums;
  line-height: 1.8;
  -webkit-font-feature-settings: "tnum", "tnum";
  font-feature-settings: "tnum", "tnum";
  margin: 0;
  padding: 5px;
  list-style: none;
}

.ant-timeline-item {
  position: relative;
  margin: 0;
  padding: 0 0 4px;
  list-style: none;
}

.ant-timeline-item-tail {
  position: absolute;
  top: 10px;
  left: 6px;
  height: calc(100% - 5px);
  border-left: 2px solid #e8e8e8;
}

.ant-timeline-item-head {
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: #C4C4C4;
  border: 2px solid transparent;
  border-radius: 100px;
}

.ant-timeline-item-head-log {
  background-color: black;
  border-color: black;
  border-radius: 100px;
  position: absolute;
  width: 5px;
  height: 5px;
  margin-left: 4.6px;
  margin-top: 4.6px;
}

.ant-timeline-item-content {
  position: relative;
  top: -4px;
  margin: 0 0 0 24px;
  word-break: break-word;
}

.collapsed img {
  transform: rotate(-90deg);
}
</style>
