<template>
    <div class="table-responsive">
        <div class="search-truck">
            <div class="row">
                <div class="col-4">
                    <b-form-input class="only-bottom-border" style="max-width: 600px; padding-right: 35px;"
                                  v-model="searchText"
                                  placeholder="Nhập biển số hoặc số đăng ký xe"
                                  @keyup.enter.native="searchTruck">
                    </b-form-input>
                    <b-btn class="button-remove" @click="resetListTruck">
                        <i font-size: style="font-size: 20px" class="icon ion-ios-close remove-text" ></i>
                    </b-btn>
                </div>
                <div class="col-2">
                    <b-form-select v-model="selectTruckStatus" :options="statusOptions"></b-form-select>
                </div>
                <div class="col-6">
                    <button class="btn btn-success" @click="searchTruck">Tìm kiếm</button>
                </div>
            </div>
        </div>
        <table class="table b-table table-striped table-hover" aria-rowcount="100">
            <thead class="">
            <tr>
                <th>STT</th>
                <th aria-colindex="2" class="">Loại xe</th>
                <th aria-colindex="4" class="">Biển số</th>
                <th aria-colindex="4" class="">Đăng kí xe</th>
                <th aria-colindex="4" class="">Trọng tải</th>
                <th aria-colindex="4" class="">Thể thích thùng xe</th>
                <th aria-colindex="4" class="">Xe khô</th>
                <th aria-colindex="4" class="">Trạng thái</th>
                <th aria-colindex="4" class="">Action</th>
            </tr>
            </thead>
            <tbody class="">
            <tr class="" v-for="(vehicle, index) in currentTruckOfPage">
                <td>{{ index  + perPage * currentPage - 9 }}</td>
                <td class="">{{ vehicle.vehicle_type }}</td>
                <td class="">{{ vehicle.code }}</td>
                <td class="">{{ vehicle.vehicle_reg_number }}</td>
                <td class="">{{ vehicle.weight }} tấn</td>
                <td class="">{{ vehicle.trunk_volume }} khối</td>
                <td>
                    <b-form-checkbox
                            v-model="vehicle.lease_type"
                            value="dry"
                            unchecked-value="wet"
                            @change="getInfoTimeDryTruck(vehicle, true)"
                    >
                    </b-form-checkbox>
                </td>
                <td class="">{{ getVehicleStatusName(vehicle.approval_status) }}</td>
                <!--<td class="">
                    <b-form-select v-model="vehicle.approval_status" :options="statusOptions" @change="changeApprovalStatus($event, vehicle)"></b-form-select>
                </td>-->
                <td class="">
                    <router-link :to="{name: 'edit-vehicle-company', params: { id: vehicle.id }}" class="btn btn-outline-secondary"><i class="ion ion-md-create"></i></router-link>
                    <button class="btn btn-outline-danger red-text" @click="showDelete(vehicle)"><i class="ion ion-md-trash"></i></button>
                    <button class="btn btn-outline-secondary" @click="getInfoTimeDryTruck(vehicle, false)"><i class="on ion-md-time"></i></button>
                    <button class="btn btn-outline-secondary" @click="getListRentTruckTime(vehicle)"><i class="on ion-md-eye"></i></button>
                </td>
            </tr>
            </tbody>
        </table>
        <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                aria-controls="my-table"
        ></b-pagination>
      <!-- Modal thêm, sửa thời gian thuê xe khô -->
      <b-modal id="myModalCompany" ref="slideModal" modal-class="modal-xs-custom" hide-footer static @hide="resetModal">
        <div slot="modal-title">
          Thông tin xe khô <span v-if="currentTruck">{{currentTruck.code}}</span>
        </div>
        <div>
          <div class="form-row">
            <div class="col-md-6 mb-4">
              <label class="form-label">Ngày bắt đầu</label>
              <datepicker
                v-model="arrDateDryTruck.startDate"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
              />
            </div>

            <div class="col-md-6 mb-4">
              <label class="form-label">Ngày kết thúc</label>
              <datepicker
                v-model="arrDateDryTruck.endDate"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                :disabled="!bIsEnableEndTime"
              />
            </div>
          </div>
        </div>
        <b-btn class="mt-3" variant="outline-success" block @click="changeLeaseType(currentTruck.id)">Cập nhật</b-btn>
      </b-modal>
      <!-- Modal hiển thị tất cả khoảng thời gian thuê xe khô -->
      <b-modal id="modalHistoryDryTruck" ref="slideHistoryModal" modal-class="modal-xs-custom" hide-footer static>
        <div slot="modal-title">
          Các khoảng thời gian thuê xe khô <span v-if="currentTruck">{{currentTruck.code}}</span>
        </div>
        <div>
          <table class="table b-table table-striped table-hover" aria-rowcount="100">
            <thead class="">
            <tr>
              <th>STT</th>
              <th aria-colindex="2" class="">Ngày bắt đầu</th>
              <th aria-colindex="4" class="">Ngày kết thúc</th>
              <th aria-colindex="4" class="">Người tạo</th>
              <th aria-colindex="4" class="">Người sửa</th>
            </tr>
            </thead>
            <tbody class="">
            <tr class="" v-for="(rentDryTruck, nIndex) in arrRangeTimeDryTruck">
              <td>{{ nIndex + 1 }}</td>
              <td>{{rentDryTruck.date_start}}</td>
              <td>{{rentDryTruck.date_end}}</td>
              <td>{{rentDryTruck.user_created}}</td>
              <td>{{rentDryTruck.user_modified}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </b-modal>

      <b-modal centered header-class="justify-content-center" title="Dừng hoạt động" ref="showDelete" size="lg" :hide-footer="true" @hidden="hideDeleteReason">
        <div class="d-flex flex-column justify-content-start">
          <div class="d-flex align-items-center" style="margin-bottom: 43px !important;">
            <span style="font-weight:bold; font-size: 20px; margin-right: 33px !important;" class="mr-sm-1">Lý do </span>
            <div class="d-flex p-0 justify-content-between ">
              <div class="d-flex" v-for="(reason, index) in reasons" :key="index">
                <span :class="`item-reason ${typeReason === reason.value ? 'pick-up' : ''}`" :type="reason.value" @click="pickUpReason($event)">{{ reason.text }}</span>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-center">
            <b-button class="delete-truck" size="sm" @click="deleteTruck(vehicleDelete)">Xác nhận</b-button>
          </div>
        </div>
      </b-modal>
    </div>
</template>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import MasterCompanyProfile from 'domain/entities/MasterCompanyProfile'

moment.suppressDeprecationWarnings = true

export default {
  name: 'company-list-vehicle',

  components: {
    Datepicker,
    MasterCompanyProfile
  },

  props: {
    listVehicles: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    currentTruck: null,
    perPage: 10,
    currentPage: 1,
    currentTruckOfPage: [],
    searchText: '',
    selectTruckStatus: 2,
    listVehiclesData: [],
    statusOptions: [
      { value: 1, text: 'Chưa kiểm duyệt' },
      { value: 2, text: 'Đã kiểm duyệt' }
    ],
    infoDryTruck: [],
    arrDateDryTruck: {
      startDate: '',
      endDate: ''
    },
    bIsUpdateLeaseType: false,
    bIsEnableEndTime: false,
    arrRangeTimeDryTruck: [],
    reasons: [
      {value: 1, text: 'Đã thanh lý'},
      {value: 2, text: 'Sửa chữa/Tai nạn giao thông'},
      {value: 3, text: 'Chưa có kế hoạch sử dụng'}
    ],
    typeReason: 0,
    reasonDelete: ''
  }),

  computed: {
    rows () {
      return this.listVehiclesData.length
    }
  },

  watch: {
    listVehicles: function (newVal, oldVal) {
      this.listVehiclesData = JSON.parse(JSON.stringify(newVal))
      let self = this
      this.listVehiclesData = this.listVehicles.filter(
        function (el) {
          return parseInt(el.approval_status) === parseInt(self.selectTruckStatus)
        }
      )
      this.currentTruckOfPage = this.listVehiclesData.slice(this.currentPage * this.perPage - 10, this.currentPage * this.perPage)
    },

    currentPage: function (newVal, oldVal) {
      let perPage = this.perPage
      this.currentTruckOfPage = this.listVehiclesData.slice(newVal * perPage - 10, newVal * perPage)
    }
  },

  created () {
    let self = this
    this.listVehiclesData = this.listVehicles.filter(
      function (el) {
        return parseInt(el.approval_status) === parseInt(self.selectTruckStatus)
      }
    )
    this.currentTruckOfPage = this.listVehiclesData.slice(0, this.perPage)
  },

  methods: {
    changeApprovalStatus: function (value, vehicle) {
      if (!confirm(`Bạn có chắc chắn muốn thay đổi trạng thái kiểm duyệt xe tải biển số ${vehicle.code}?`)) {
        return
      }
      let dataSend = {
        'id': vehicle.id,
        'approval_status': vehicle.approval_status
      }
      CompanyProfileService.changeApprovalStatus(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.$emit('reloadTruck')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
            this.$emit('reloadTruck')
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình kiểm duyệt xe.'
          })
        })
    },

    changeLeaseType (id) {
      let selectedTruck = this.listVehiclesData.find((truck) => {
        return truck.id === id
      })

      if (!selectedTruck) {
        commonHelper.showMessage('Xảy ra lỗi, không tìm thấy xe', 'warning')
        return false
      }

      if (this.arrDateDryTruck.startDate === '' || this.arrDateDryTruck.startDate === null) {
        alert('Ngày bắt đầu không được để trống!')
        return false
      }

      let startDate = moment(this.arrDateDryTruck.startDate).format('YYYY-MM-DD')
      let endDate = ''
      if (this.arrDateDryTruck.endDate !== '' && this.arrDateDryTruck.endDate !== null) {
        endDate = moment(this.arrDateDryTruck.endDate).format('YYYY-MM-DD')
        if (!confirm('Bạn có chắc chắn muốn config time? \n Thời gian bắt đầu: ' + startDate + ' \n Thời gian kết thúc: ' + endDate)) {
          return false
        }
      } else {
        if (!confirm('Bạn có chắc chắn muốn config thời gian bắt đầu: ' + startDate)) {
          return false
        }
      }

      let bIsUpdateLeaseType = this.bIsUpdateLeaseType
      let dataSend = {
        id: id,
        leaseType: selectedTruck.lease_type,
        order: selectedTruck.order,
        startDate: startDate,
        endDate: endDate,
        bIsUpdateLeaseType: bIsUpdateLeaseType
      }

      this.$stopLoading()
      CompanyProfileService.changeLeaseType(dataSend).then(response => {
        if (response.data.success) {
          this.$refs.slideModal.hide()
          commonHelper.showMessage(response.data.message, 'success')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra trong quá trình update!', 'warning')
      }).then(() => {
        this.$stopLoading()
      })
    },

    getInfoTimeDryTruck (dataVehicle, bIsUpdateLeaseType) {
      if (!dataVehicle) {
        commonHelper.showMessage('Thông tin xe không đúng', 'warning')
        return false
      }
      this.currentTruck = dataVehicle
      this.bIsUpdateLeaseType = bIsUpdateLeaseType
      let dataSend = {
        'truck_order': dataVehicle.order,
        'nCheckUpdate': bIsUpdateLeaseType ? 1 : 0
      }
      // console.log(dataSend)
      CompanyProfileService.getInfoTimeDryTruck(dataSend).then(response => {
        if (response.data.success) {
          this.$refs.slideModal.show()
          this.arrDateDryTruck.startDate = ''
          this.arrDateDryTruck.endDate = ''
          if (response.data.count > 0) {
            this.infoDryTruck = response.data.data
            this.arrDateDryTruck.startDate = this.infoDryTruck.ErpSgwTimeToRentDryTruck.date_start
            console.log(bIsUpdateLeaseType)
            if (this.infoDryTruck.ErpSgwTimeToRentDryTruck.startDate !== '' && this.infoDryTruck.ErpSgwTimeToRentDryTruck.startDate !== null && bIsUpdateLeaseType) {
              this.bIsEnableEndTime = true
            }
          }
          // commonHelper.showMessage(response.data.message, 'success')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
          this.$stopLoading()
        }
      }).catch(error => {
        console.log(error)
      })
    },

    getListRentTruckTime: function (dataVehicle) {
      if (!dataVehicle) {
        commonHelper.showMessage('Thông tin xe không đúng', 'warning')
        return false
      }
      this.currentTruck = dataVehicle

      console.log(dataVehicle)
      let dataSend = {
        'truck_order': dataVehicle.order
      }
      CompanyProfileService.getListRentTruckTime(dataSend).then(response => {
        if (response.data.success) {
          this.$refs.slideHistoryModal.show()
          this.arrRangeTimeDryTruck = response.data.data
          commonHelper.showMessage(response.data.message, 'success')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
          this.$stopLoading()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    resetModal: function () {
      this.bIsEnableEndTime = false
      this.$emit('reloadTruck')
    },

    resetListTruck: function () {
      this.searchText = ''
      this.listVehiclesData = JSON.parse(JSON.stringify(this.listVehicles))
      this.currentTruckOfPage = this.listVehiclesData.slice(0, this.perPage)
    },

    searchTruck: function () {
      let self = this
      if (this.searchText !== '') {
        let temp = this.listVehicles.filter(
          function (el) {
            if (el.code !== null) {
              if (el.vehicle_reg_number === null) {
                return el.code.toUpperCase().includes(self.searchText.toUpperCase()) && (parseInt(el.approval_status) === parseInt(self.selectTruckStatus))
              }
              return (el.code.toUpperCase().includes(self.searchText.toUpperCase()) || el.vehicle_reg_number.includes(self.searchText)) && (parseInt(el.approval_status) === parseInt(self.selectTruckStatus))
            } else {
              return false
            }
          }
        )
        this.currentTruckOfPage = temp
        this.listVehiclesData = temp
      } else {
        let temp = this.listVehicles.filter(
          function (el) {
            if (parseInt(self.selectTruckStatus) === 3) {
              return el.lease_type === 'dry'
            } else {
              return parseInt(el.approval_status) === parseInt(self.selectTruckStatus)
            }
          }
        )
        this.currentTruckOfPage = temp.slice(0, 9)
        this.listVehiclesData = temp
      }
    },

    deleteTruck (vehicle) {
      /*      if (!confirm(`Bạn có chắc chắn muốn dừng hoạt động xe tải biển số ${vehicle.code} - đăng ký xe: ${vehicle.vehicle_reg_number} ?`)) {
        return
      } */
      let dataSend = {
        'truckId': vehicle.id,
        'order': vehicle.order,
        'reason_delete': this.reasonDelete || '',
        'type_reason': this.typeReason || ''
      }
      CompanyProfileService.deleteTruck(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.$emit('reloadTruck')
            this.hideDeleteReason()
            this.$refs.showDelete.hide()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
            this.hideDeleteReason()
            this.$refs.showDelete.hide()
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình dừng hoạt động của xe.'
          })
        })
        .finally(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },
    getVehicleStatusName (status) {
      return MasterCompanyProfile.getVehicleStatusName(status)
    },
    showDelete (vehicle) {
      this.$refs.showDelete.show()
      this.vehicleDelete = vehicle
    },
    hideDeleteReason () {
      this.vehicleDelete = null
      this.reasonDelete = ''
      this.typeReason = 0
    },
    pickUpReason: function (event) {
      let element = event.currentTarget
      this.typeReason = parseInt(element.getAttribute('type'))
    }
  }
}
</script>

<style scoped>
    .search-truck {
        position: relative;
        width: 100%;
        margin-bottom: 10px;
    }
    .only-bottom-border {
        border-top: none;
        border-left: none;
        border-right: none;
    }
    .remove-text {
        color: #dfe1e3;
    }
    .remove-text:hover {
        color: #6e7a8a;
    }
    .button-remove {
        position: absolute;
        top: 2px; right: 10px;
        border: none;
        background: rgba(0,0,0,0);
        padding: 0;
    }
    .delete-truck {
      background-color: #069255;
      padding: 5px 0;
      width: 173px;
      height: 40px;
      font-size: 16px;
    }
    .pick-up {
      color: #ffffff !important;
      background-color: #219653 !important;
    }
    .item-reason {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 5px 8px;
      gap: 10px;
      height: 29px;
      border: 1px solid #219653;
      border-radius: 100px;
      flex: none;
      order: 0;
      flex-grow: 0;
      color: #219653;
      margin-right: 10px;
    }
</style>
