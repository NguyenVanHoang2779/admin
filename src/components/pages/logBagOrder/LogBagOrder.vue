<template>
  <div>
    <div class="ui-block">
      <h3 class="ui-block-heading">Log Bao Hàng</h3>
      <div>
        <b-form>
          <div class="form-filter">
            <b-form-row>
              <b-col md="6">
                 <b-form-group label="Mã bao">
                <b-form-input
                  v-model="selected.BagLog"
                  placeholder="Nhiều mã bao cách nhau bằng dấu (,)"
                  ref="BagLog"
                ></b-form-input>
              </b-form-group>
              </b-col>
              <b-col md="3">
                <b-form-group label="Từ:">
                  <datepicker
                    v-model="selected.fromDate"
                    :bootstrapStyling="true"
                    :format="customFormatter"
                    class="from-date"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    v-on:selected="dateSelectedFromInChild"
                    v-bind:disabled="inputDisable"
                    placeholder="Chọn ngày"
                    ref="fromDate"
                  />
                </b-form-group>
              </b-col>
              <b-col md="3">
                <b-form-group label="Đến:">
                  <datepicker
                    v-model="selected.toDate"
                    :bootstrapStyling="true"
                    :format="customFormatter"
                    class="to-date"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    v-on:selected="dateSelectedToInChild"
                    v-bind:disabled="inputDisable"
                    placeholder="Chọn ngày"
                    ref="toDate"
                  />
                </b-form-group>
              </b-col>
            </b-form-row>
           <b-form-row class="cfButton">
              <ladda-btn
              :loading="loadingButton"
                @click.native="searchBaglog(true)"
                data-style="zoom-out"
                class="btn btn-success btn-z-index b1"
              >
                <i class="sidenav-icon ion ion-md-search"></i>
                Tìm kiếm
              </ladda-btn>
            </b-form-row>
          </div>
        </b-form>
        <b-form>
          <div class="result" id="results" v-if="checkResult">
          <div class="form-filter mt-3">
      <b-form-row>
        <b-col md="12">
        <b-card >
                        <!-- / Table controls -->
                        <div class="table-result" >
                        <!-- Table -->
                            <div class="table-responsive mb-4">
                                <table class="table mb-0 table-bordered">
                                    <thead class="" style="width: 100%!important">
                                    <tr>
                                        <th style="width: 20%">Mã bao</th>
                                        <th style="width: 80%">Log</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(item,index) in dataLogs" :key="index">
                                      <td v-if="index != 0">
                                       {{index}}
                                      </td>
                                      <td v-if="index != 0">
                                        <ul>
                                          <li v-for="(itemBaglog,indexBaglog) in item" :key="indexBaglog">
                                               {{itemBaglog.created_username}}({{itemBaglog.created}}): {{itemBaglog.desc}}
                                          </li>
                                        </ul>
                                      </td>
                                   </tr>
                                   </tbody>
                                </table>
                            </div>
                        </div>
        </b-card>
        </b-col>
      </b-form-row>
          </div>
          </div>
        </b-form>
      </div>

      <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
    </div>
  </div>
</template>

<script>
import logBagOrderService from 'domain/services/log-bag-order-service.js'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'

export default {
  data () {
    return {
      checkLength: [],
      loadingButton: false,
      appLoading: false,
      checkResult: false,
      inputDisable: false,
      dataLogs: [],
      selected: {
        BagLog: '',
        fromDate: moment()
          .subtract(3, 'months')
          .format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD')
      }
    }
  },
  components: {
    Datepicker,
    LaddaBtn,
    LoadingMiniBottom
  },
  methods: {
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    offLoading () {
      this.appLoading = false
      this.loadingButton = false
    },
    dateSelectedToInChild: function (date) {
      this.to = date
    },
    dateSelectedFromInChild: function (date) {
      this.from = date
    },
    searchBaglog (newSearchConditions) {
      this.appLoading = true
      let timeFrom = '00:00:00'
      let timeTo = '23:59:59'
      let arrayBagLog = []
      let params = {
        cr_from: this.customFormatter(this.selected.fromDate) + ' ' + timeFrom,
        cr_to: this.customFormatter(this.selected.toDate) + ' ' + timeTo
      }

      if (this.selected.BagLog) {
        this.selected.BagLog = this.selected.BagLog.trim()
      }

      if (this.selected.BagLog) {
        arrayBagLog = this.selected.BagLog.split(',')
        if (arrayBagLog.length > 20) {
          commonHelper.showMessage('vui lòng nhập tối đa 20 bao')
          return
        }
        params['bag_orders'] = arrayBagLog
      }

      if (newSearchConditions) {
        this.loadingButton = true
      }
      logBagOrderService.getLogBagOrder(params).then(response => {
        if (response.data.success) {
          this.checkResult = response.data.success
          response = response.data.data
          this.dataLogs = response
          this.offLoading()
        } else {
          commonHelper.showMessage('Truyền lên thiếu thông tin bao', 'error')
          this.offLoading()
        }
      }).catch((e) => {
        console.log(e)
        commonHelper.showMessage('Đã có lỗi xảy ra', 'error')
        this.offLoading()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-filter {
  border: 1px solid #ccc;
  border-radius: 5px;
  background: white;
  padding: 20px;
}
.cfButton {
  margin-left: 20px;
  display: flex;
  justify-content: center;
}
.cfButton .b1 {
  margin-left: 20px;
}
.custom-select {
  width: 100px;
}
.btn-z-index {
  z-index: 0;
}
</style>
