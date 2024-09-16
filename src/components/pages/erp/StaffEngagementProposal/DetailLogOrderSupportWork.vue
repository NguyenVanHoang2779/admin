<template>
  <div class="log-cus">
<!--    <i v-show="loadingLogDetail" class="fas fa-spinner fa-pulse cusSpinner"></i>-->
  <div v-loading="loadingLogDetail" class="detail-logs-update ml-2" v-show="detailLog && detailLog.length > 0">
    <div class="content-detail-log">
<!--      <ul class="log-timeline ul-log-cus" @scroll="onScrollLogDetail" ref="infoHeightLog" :id="userId" v-if="detailLog">-->
      <ul class="log-timeline ul-log-cus" ref="infoHeightLog" :id="userId" v-if="detailLog">
        <li class="log-timeline-item" v-for="(log, idx) in detailLog" :key="idx">
          <div class="log-timeline-item-tail"></div>
          <div class="log-timeline-item-head ant-timeline-item-head-blue"></div>
          <div class="log-timeline-item-content">
<!--            <span>{{ formatDate(log.action_created) }} </span>-->
            <span>{{ log }}
            </span>
<!--            <span v-if="log.message && !log.message.old && !log.message.new" v-html="log.message"> </span>-->
          </div>
        </li>
      </ul>
    </div>
  </div>
  </div>
</template>

<script>
import moment from 'moment'
// import staffResignService from 'domain/services/staff-resign-service'
import helper from 'infrastructures/helpers/common-helpers'

import staffService from 'domain/services/staff-management-service'

export default {
  name: 'DetailLogOrderSupportWork',
  props: {
    detailLog: {
      default: null
    },
    idOrder: null,
    userId: null
  },
  data: _ => ({
    loadingLogDetail: false,
    limit: 15,
    page: 1,
    perPage: 10,
    isLimit: false
  }),
  methods: {
    formatDate (date, format) {
      return moment(date || null).format(format || 'DD-MM-YYYY HH:mm:ss')
    },
    async onScrollLogDetail () {
      let idTag = '[id="' + this.userId + '"]'
      const logDetail = document.querySelector(idTag)
      const HeightLogWindow = this.$refs.infoHeightLog.clientHeight
      // check limit
      if (+this.detailLog.current_page === +this.detailLog.last_page || this.detailLog.data.length === this.detailLog.total) {
        this.isLimit = true
      }

      if (HeightLogWindow + logDetail.scrollTop + 100 > logDetail.scrollHeight && !this.loadingLogDetail && !this.isLimit) {
        // Lấy thêm log của từng user khi cuộn
        this.page++
        // this.getLogDetail()
      }
    },
    async getLogDetail () {
      if (this.isLimit || this.loadingLogDetail) { return true }
      this.loadingLogDetail = true
      try {
        let params = {
          user_id: this.userId,
          per_page: this.perPage,
          page: this.page
        }
        const res = await staffService.getlistLogDetail(params)
        if (res.data.success) {
          if (res.data.data.hasOwnProperty('data')) {
            this.detailLog.data = this.detailLog.data.concat(res.data.data.data)
          }
          if (+res.data.data.current_page === +res.data.data.last_page) {
            this.isLimit = true
          }
          this.page = res.data.data.current_page
        } else {
          helper.showMessage(res.data.message, 'warning')
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingLogDetail = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.log-cus {
  position: relative;
}
.detail-logs-update {
  ul.log-timeline {
    max-height: 20vh;
    overflow-y: scroll;
    li:last-child {
    }
  }
  .log-timeline{
    box-sizing: border-box;
    color: #000;
    font-variant: tabular-nums;
    line-height: 1.9;
    -webkit-font-feature-settings: "tnum","tnum";
    font-feature-settings: "tnum","tnum";
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .log-timeline-item {
    position: relative;
    margin: 0;
    padding: 6px 4px 0px 4px;
    list-style: none;
  }
  .log-timeline-item-tail {
    position: absolute;
    top: 12px;
    left: 0.4rem;
    height: calc(100% - 4px);
    border-left: 2px solid #BDBDBD;
  }
  .log-timeline-item-head-blue {
    color: #14a05b;
    border-color: #14a05b !important;
  }
  .log-timeline-item-head {
    width: 6px;
    height: 6px;
    background-color: #000000;
    border: 2px solid transparent;
    border-radius: 89%;
  }
  .log-timeline-item-content {
    position: relative;
    top: -15px;
    margin: 0 0 0 14px;
    word-break: break-word;
    span.btn {
      border-radius: 20px;
      border: 1px solid #00904A;
    }
  }
  .time-log{
    color: #828282;
    font-size: 14px;
  }

  .content-detail-log {
    overflow-y: auto;
  }

  .content-detail-log::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}
.text-deatil-log{
  color: #000000;
}

.text-time {
  font-weight: 500;
  color: #000000;
}

.ul-log-cus::-webkit-scrollbar {
  width: 0!important;
}

.cusSpinner {
  position: absolute;
  top: 50%;
  left: 45%;
}

</style>
