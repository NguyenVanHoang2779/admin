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
        <div :class="data.checkTick.tickOrder ? 'ant-timeline-item-head-active' : 'ant-timeline-item-head'" class="ant-timeline-item-head-blue">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-sm-6 col-md-4 txt-status">
              <b>Duyệt đề xuất</b>
            </div>
            <div class="d-flex col-sm-6 col-md-8" v-if="!data.checkTick.tickOrder">
              <div class="content-right-status align-self-center" v-if="data.userHandlerOrder.length > 0">
                <span class="mr-1" v-if="data.userHandlerOrder[0].avatar">
                  <img :src="data.userHandlerOrder[0].avatar" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name">{{ data.userHandlerOrder[0].username || '' }}</span> - <span>{{ data.userHandlerOrder[0].position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor('order_resign', data.userHandlerOrder, data.id, data.profile_id)">
                  <i class="fas fa-edit text-success"></i>
                </b-btn>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li class="ant-timeline-item">
        <div class="ant-timeline-item-tail"></div>
        <div :class="data.checkTick.tickAsset ? 'ant-timeline-item-head-active' : 'ant-timeline-item-head'" class="ant-timeline-item-head-blue">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-sm-6 col-md-4 txt-status">
              <b  >Thu hồi công cụ, dụng cụ</b>
            </div>
            <div class="d-flex col-sm-6 col-md-8" v-if="!data.checkTick.tickAsset">
              <div class="content-right-status align-self-center" v-if="data.userHandlerCCDC.length > 0">
                <span class="mr-1" v-if="data.userHandlerCCDC[0].avatar">
                  <img :src="data.userHandlerCCDC[0].avatar" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name">{{ data.userHandlerCCDC[0].username || '' }}</span> - <span>{{ data.userHandlerCCDC[0].position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3">

                <b-btn class="text-success border-0 btn-default" @click="showModalCensor('thu_hoi_ccdc', data.userHandlerCCDC, data.id, data.profile_id)">
                  <i class="fas fa-edit text-success"></i>
                </b-btn>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li class="ant-timeline-item" v-if="!data.hideStatus.deposit">
        <div class="ant-timeline-item-tail"></div>
        <div :class="data.checkTick.tickDeposit ? 'ant-timeline-item-head-active' : 'ant-timeline-item-head'" class="ant-timeline-item-head-blue">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-sm-6 col-md-4 txt-status">
              <b  >Thanh toán cọc</b>
            </div>
            <div class="d-flex col-sm-6 col-md-8" v-if="!data.checkTick.tickDeposit">
              <div class="content-right-status align-self-center" v-if="data.userHandlerDeposits.length > 0">
                <span class="mr-1" v-if="data.userHandlerDeposits[0].avatar">
                  <img :src="data.userHandlerDeposits[0].avatar" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name">{{ data.userHandlerDeposits[0].username || '' }}</span> - <span>{{ data.userHandlerDeposits[0].position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor('thanh_toan_coc', data.userHandlerDeposits, data.id, data.profile_id)">
                  <i class="fas fa-edit text-success"></i>
                </b-btn>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li class="ant-timeline-item" v-if="!data.hideStatus.insurance">
        <div class="ant-timeline-item-tail"></div>
        <div :class="data.checkTick.tickInsurance ? 'ant-timeline-item-head-active' : 'ant-timeline-item-head'"
             class="ant-timeline-item-head-blue"><div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-sm-6 col-md-4 txt-status">
              <b  >Chốt sổ bảo hiểm xã hội</b>
            </div>
            <div class="d-flex col-sm-6 col-md-8" v-if="!data.checkTick.tickInsurance">
              <div class="content-right-status align-self-center" v-if="data.userHandlerBHXH.length > 0">
                <span class="mr-1" v-if="data.userHandlerBHXH[0].avatar">
                  <img :src="data.userHandlerBHXH[0].avatar" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name">{{ data.userHandlerBHXH[0].username || '' }}</span> - <span>{{ data.userHandlerBHXH[0].position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center mb-1">
                <span>Chưa có đề xuất chốt sổ bảo hiểm xã hội!</span>
              </div>
              <div class="item-button ml-3">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor('chot_so_bhxh', data.userHandlerBHXH, data.orderInsurance, data.profile_id)">
                  <i class="fas fa-edit text-success"></i>
                </b-btn>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li class="ant-timeline-item">
        <div class="ant-timeline-item-tail"></div>
        <div :class="data.checkTick.tickContract ? 'ant-timeline-item-head-active' : 'ant-timeline-item-head'" class="ant-timeline-item-head-blue">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <div class="row">
            <div class="col-sm-6 col-md-4 txt-status">
              <b>Thanh lý hợp đồng</b>
            </div>
            <div class="d-flex col-sm-6 col-md-8" v-if="!data.checkTick.tickContract">
              <div class="content-right-status align-self-center" v-if="data.userHandlerHD.length > 0">
                <span class="mr-1" v-if="data.userHandlerHD[0].avatar">
                  <img :src="data.userHandlerHD[0].avatar" alt="avt user" width="25" height="25">
                </span>
                <span class="info-user-name">{{ data.userHandlerHD[0].username || '' }}</span> - <span>{{ data.userHandlerHD[0].position_name || '' }}</span>
              </div>
              <div v-else class="content-right-status align-self-center">
                <span>Đề xuất chưa gán người xử lý!</span>
              </div>
              <div class="item-button ml-3">
                <b-btn class="text-success border-0 btn-default" @click="showModalCensor( 'thanh_ly_hd', data.userHandlerHD, data.id, data.profile_id)">
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
// helper
import helper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'DetailStatusOrderResignWork',
  props: {
    data: {
      default: null
    },
    showStatus: {
      type: Boolean,
      default: true
    },
    permission: {}
  },
  data: _ => ({
  }),
  created () {
  },

  methods: {
    showModalCensor (action, censors, orderId, masterId) {
      if (!this.permission.edit_action) {
        helper.showMessage('Bạn không có quyền thực hiện thao tác này!', 'warning')
        return
      }
      if (helper.isEmpty(orderId)) {
        helper.showMessage('Bạn chưa tạo đề xuất!', 'warning')
        return
      }
      if (action === 'chot_so_bhxh' && !helper.isEmpty(orderId)) {
        orderId = orderId.hrOrder.id
      }
      this.$emit('showCensors', {action, censors, orderId, masterId})
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
