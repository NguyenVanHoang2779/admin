<template>
  <div>
    <!------------------------------------------------1. Tool xuất thông tin phiên driver theo id -------------------------------------------------------------->
    <b-card bg-variant="default">
      <label class="text-center" :style="{color: 'red'}">{{this.noticeMessage}}</label>
      <div v-if="sessionData">
        <div v-for="(item, index) in this.fields" :key="index">
          <label>{{(index + 1) + '. ' + item.label}}</label>
          <ShowObject :objectData="sessionData[item.key]" :fields="item.childFields" :type="item.type"/>
        </div>
      </div>
    </b-card>

  </div>
</template>

<script>
import driverSessionService from 'domain/services/driver-session-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import ShowObject from './ShowObject'

const sessionFields = [
  {key: 'ss_id', label: 'Mã phiên:', description: '', childFields: null},
  {key: 'time_start', label: 'Thời gian bắt đầu:', description: '', childFields: null},
  {key: 'time_end', label: 'Thời gian kết thúc:', description: '', childFields: null},
  {key: 'range_time', label: 'Thời gian làm việc:', description: '', childFields: null},
  {key: 'distance', label: 'Tổng quãng đường:', description: ' km', childFields: null},
  {key: 'count_packages', label: 'Tổng số đơn:', description: ' đơn', childFields: null},
  {key: 'count_points', label: 'Số điểm dừng:', description: ' điểm', childFields: null}
]

const usersFields = [
  {key: 'username', label: 'Tên đăng nhập:', description: '', childFields: null},
  {key: 'position_name', label: 'Vị trí công việc:', description: '', childFields: null},
  {key: 'fullname', label: 'Họ tên:', description: '', childFields: null},
  {key: 'storage', label: 'Kho:', type: 'single', description: '', childFields: null},
  {key: 'province', label: 'Tỉnh:', type: 'single', description: '', childFields: null},
  {key: 'region', label: 'Khu vực:', type: 'single', description: '', childFields: null},
  {key: 'alias', label: 'Alias:', type: 'single', description: '', childFields: null},
  {key: 'cod_id', label: 'Mã cod:', type: 'single', description: '', childFields: null}
]

const truckFields = [
  {key: 'code', label: 'Biển số xe:', description: '', childFields: null},
  {key: 'weight', label: 'Trọng tải:', description: ' tấn', childFields: null},
  {key: 'weight_billing', label: 'Trọng tải tính tiền:', description: ' tấn', childFields: null},
  {key: 'lease_type', label: 'Loại xe:', description: '', childFields: null}
]

const pointFields = [
  {key: 'point_name', label: 'Điểm dừng:', description: '', childFields: null},
  {key: 'up_bags', label: 'Tổng bao lên tải:', description: '', childFields: null},
  {key: 'point_coordination', label: 'Tọa độ điểm dừng:', description: '', childFields: null},
  {key: 'up_packages', label: 'Tổng đơn lên tải:', description: '', childFields: null},
  {key: 'driver_coordination', label: 'Tọa độ checkin:', description: '', childFields: null},
  {key: 'down_bags', label: 'Tổng bao xuống tải:', description: '', childFields: null},
  {key: 'distance_checkin', label: 'Khoảng cách checkin:', description: ' m', childFields: null},
  {key: 'down_packages', label: 'Tổng đơn xuống tải:', description: '', childFields: null},
  {key: 'distance', label: 'Số Km:', description: ' Km', childFields: null},
  {key: 'count_packages', label: 'Sản lượng:', description: '', childFields: null},
  {key: 'time', label: 'Đến nơi:', description: '', childFields: null},
  {key: 'status', label: 'Trạng thái:', description: '', childFields: null},
  {key: 'time_end', label: 'Chốt xong:', description: '', childFields: null},
  {key: 'reason', label: 'Lý do từ chối:', description: '', childFields: null}
]

const routeFields = [
  {key: 'name', label: 'Tên tuyến:', description: '', childFields: null},
  {key: 'workshift', label: 'Ca làm việc:', description: '', childFields: null},
  {key: 'type', label: 'Loại tuyến:', description: '', childFields: null}
]
export default {
  mounted: function () {
    this.getDriverSessionDataById(this.sessionId, this.userId)
  },
  components: {
    LaddaBtn,
    ShowObject
  },
  props: {
    sessionId: Number,
    driverId: String
  },
  data: () => ({
    fields: [
      {key: 'session', label: 'Thông tin phiên:', description: '', type: 'object', childFields: [...sessionFields]},
      {key: 'route', label: 'Thông tin tuyến đường:', description: '', type: 'object', childFields: [...routeFields]},
      {key: 'users', label: 'Thông tin tài xế:', description: '', type: 'array', childFields: [...usersFields]},
      {key: 'truck', label: 'Thông tin xe:', description: '', type: 'object', childFields: [...truckFields]},
      {key: 'points', label: 'Thông tin điểm dừng:', description: '', type: 'array', childFields: [...pointFields]}
    ],
    sessionData: null,
    noticeMessage: ''
  }),
  methods: {
    getDriverSessionDataById: function (sessionId) {
      if (!sessionId) {
        return commonHelper.showMessage('Chưa nhập id phiên', 'warning')
      }

      let data = {
        'ssId': sessionId
      }

      driverSessionService.getDriverSessionDataById(data).then(res => {
        if (res.data.success) {
          this.noticeMessage = ''
          this.sessionData = res.data.data
          if (this.driverId) {
            for (let i = this.sessionData.users.length - 1; i >= 0; i--) {
              if (this.sessionData.users[i].user_id !== this.driverId) { this.sessionData.users.splice(i, 1) }
            }
          }
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          this.noticeMessage = 'Không có dữ liệu'
          this.sessionData = null
          commonHelper.showMessage(res.data.message, 'warning')
        }
      })
    }
  }
}
</script>

<style>

</style>
