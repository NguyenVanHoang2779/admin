<template>
  <div class="detail-log-orders mt-3">
    <ul class="ant-timeline">
      <li class="ant-timeline-item">
        <div class="ant-timeline-item-tail"></div>
        <div class="ant-timeline-item-head-active ant-timeline-item-head-blue">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <b  >Tạo đề xuất</b>
        </div>
      </li>
      <li class="ant-timeline-item">
        <div class="ant-timeline-item-tail"></div>
        <div :class="allowDisplayInfo(dataOrder.status) ? 'ant-timeline-item-head-active' : 'ant-timeline-item-head'" class="ant-timeline-item-head-blue">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-sm-6 col-md-4 txt-status">
              <b>Duyệt đề xuất</b>
            </div>
            <div class="d-flex col-sm-6 col-md-8" v-if="!allowDisplayInfo(dataOrder.status)">
              <div class="content-right-status align-self-center" v-if="dataOrder.censor">
                <span class="mr-1" v-if="dataOrder.censor.avatar">
                  <img :src="dataOrder.censor.avatar"
                       alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name">{{ dataOrder.censor.username || '' }}</span> - <span>{{ dataOrder.censor.position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor(dataOrder.id)">
                  <i class="fas fa-edit text-success"></i>
                </b-btn>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li class="ant-timeline-item" v-if="showStatus">
        <div class="ant-timeline-item-tail"></div>
        <div :class="dataOrder.check_transfer ? 'ant-timeline-item-head-active' : 'ant-timeline-item-head'" class="ant-timeline-item-head-blue">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-sm-6 col-md-4 txt-status">
              <b  >Thu hồi công cụ, dụng cụ</b>
            </div>
            <div class="d-flex col-sm-6 col-md-8" v-if="!dataOrder.check_transfer">
              <div class="content-right-status align-self-center" v-if="dataOrder.userHandlerCCDC">
                <span class="mr-1" v-if="dataOrder.userHandlerCCDC.avatar">
                  <img :src="dataOrder.userHandlerCCDC.avatar"
                       alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name">{{ dataOrder.userHandlerCCDC.username || '' }}</span> - <span>{{ dataOrder.userHandlerCCDC.position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3">

                <b-btn class="text-success border-0 btn-default" @click="showModalCensorAccountant(dataOrder.userHandlerCCDCs, 'thu_hoi_ccdc', dataOrder.profile_id)">
                  <i class="fas fa-edit text-success"></i>
                </b-btn>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li class="ant-timeline-item" v-if="dataOrder.checkShowDeposit && showStatus">
        <div class="ant-timeline-item-tail"></div>
        <div :class="dataOrder.check_deposit ? 'ant-timeline-item-head-active' : 'ant-timeline-item-head'" class="ant-timeline-item-head-blue">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-sm-6 col-md-4 txt-status">
              <b  >Thanh toán cọc</b>
            </div>
            <div class="d-flex col-sm-6 col-md-8" v-if="!dataOrder.check_deposit">
              <div class="content-right-status align-self-center" v-if="dataOrder.censorAccountant">
                <span class="mr-1" v-if="dataOrder.censorAccountant.avatar">
                  <img :src="dataOrder.censorAccountant.avatar"
                       alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name">{{ dataOrder.censorAccountant.username || '' }}</span> - <span>{{ dataOrder.censorAccountant.position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensorAccountant(dataOrder.censorAllAccountant, 'thanh_toan_coc', dataOrder.profile_id)">
                  <i class="fas fa-edit text-success"></i>
                </b-btn>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li class="ant-timeline-item" v-if="!dataOrder.checkChotSo && showStatus">
        <div class="ant-timeline-item-tail"></div>
        <div :class="dataOrder.checkStatusBHXH ? 'ant-timeline-item-head-active' : 'ant-timeline-item-head'"
             class="ant-timeline-item-head-blue"><div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-sm-6 col-md-4 txt-status">
              <b  >Chốt sổ bảo hiểm xã hội</b>
            </div>
            <div class="d-flex col-sm-6 col-md-8" v-if="!dataOrder.checkStatusBHXH && !dataOrder.checkChotSo">
              <div class="content-right-status align-self-center" v-if="dataOrder.userHandlerBHXH">
                <span class="mr-1" v-if="dataOrder.userHandlerBHXH.avatar">
                  <img :src="dataOrder.userHandlerBHXH.avatar"
                       alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name">{{ dataOrder.userHandlerBHXH.username || '' }}</span> - <span>{{ dataOrder.userHandlerBHXH.position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span v-if="dataOrder.relate_order" >Chưa có gán người xử lý đề xuất!</span>
                <span v-else >Chưa có đề xuất chốt sổ bảo hiểm xã hội!</span>
              </div>
              <div class="item-button ml-3">
                <b-btn class="text-success border-0 btn-default" v-if="dataOrder.relate_order" @click="showModalCensor(dataOrder.relate_order.hrOrder.id)">
                  <i class="fas fa-edit text-success"></i>
                </b-btn>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li class="ant-timeline-item" v-if="showStatus">
        <div class="ant-timeline-item-tail"></div>
        <div :class="dataOrder.statusContract ? 'ant-timeline-item-head-active' : 'ant-timeline-item-head'" class="ant-timeline-item-head-blue">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-sm-6 col-md-4 txt-status">
              <b>Thanh lý hợp đồng</b>
            </div>
            <div class="d-flex col-sm-6 col-md-8" v-if="!dataOrder.statusContract">
              <div class="content-right-status align-self-center" v-if="dataOrder.userHandlerHD">
                <span class="mr-1" v-if="dataOrder.userHandlerHD.avatar">
                  <img :src="dataOrder.userHandlerHD.avatar"
                       alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name">{{ dataOrder.userHandlerHD.username || '' }}</span> - <span>{{ dataOrder.userHandlerHD.position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensorAccountant(dataOrder.userHandlerHDs, 'thanh_ly_hd', dataOrder.profile_id)">
                  <i class="fas fa-edit text-success"></i>
                </b-btn>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DetailStatusOrderStopWork',
  props: {
    dataOrder: {
      default: null
    },
    showStatus: {
      type: Boolean,
      default: true
    }
  },
  data: _ => ({
    displayUser: false,
    censors: []
  }),
  created () {
    this.allowDisplayInfo(this.dataOrder.status)
  },

  methods: {
    allowDisplayInfo (status) {
      return ['da_duyet', 'dat_duyet_leader', 'da_duyet_supervisor', 'hoan_thanh'].includes(status)
    },

    showModalCensor (orderId) {
      this.$emit('showCensorOrder', orderId)
    },

    showModalCensorAccountant (datas, action, profileId) {
      var data = {
        allDataCensor: datas,
        action: action,
        master_id: profileId
      }
      this.$emit('showCensorAccount', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-log-orders {
  .ant-timeline{
    box-sizing: border-box;
    color: #000;
    font-variant: tabular-nums;
    line-height: 1.8;
    -webkit-font-feature-settings: "tnum","tnum";
    font-feature-settings: "tnum","tnum";
    margin: 0;
    padding: 0;
    list-style: none;
    li:last-child{
      height: 32px;
    }
  }
  .ant-timeline-item {
    position: relative;
    margin: 0;
    padding: 0 0 4px;
    list-style: none;
    height: 34px;
  }
  .ant-timeline-item-tail {
    position: absolute;
    top: 10px;
    left: 6px;
    height: calc(100% - 10px);
    border-left: 4px solid #e8e8e8;
  }
  .ant-timeline-item-head-blue {
    color: #14a05b;
  }
  .ant-timeline-item-head {
    position: absolute;
    width: 16px;
    height: 16px;
    background-color: #C4C4C4;
    border: 2px solid transparent;
    border-radius: 100px;
  }

  .ant-timeline-item-head-active{
    background-color: #14a05b;
    border-color: #14a05b;
    border-radius: 100px;
    position: absolute;
    width: 16px;
    height: 16px;
    .checkmark {
      transform: rotate(45deg);
      height: 9px;
      width: 4px;
      margin-top: 0.18em;
      margin-left: 37%;
      border-bottom: 2px solid #FFFFFF;
      border-right: 2px solid #FFFFFF;
    }
  }

  .ant-timeline-item-content {
    position: relative;
    top: -6px;
    margin: 0 0 0 24px;
    word-break: break-word;
    .txt-status, .content-right-status {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    span.btn {
      border-radius: 20px;
      border: 1px solid #00904A;
    }

    .content-right-status {
      img {
        border-radius: 50%;
      }
    }
  }
  .time-log{
    color: #828282;
    font-size: 14px;
  }
}
</style>
