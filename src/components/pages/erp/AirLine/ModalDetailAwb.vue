<template>
    <div>
        <b-modal size="lg" id="modal-detail-awb" ref="myModalRef" :hide-footer="true" title="Thông tin chi tiết AWB" static>
            <div>
                <div class="d-flex mb-3">
                    <div v-if="awb.status == 1" class="btn-primary text-confirm">Đã xác nhận</div>
                    <div class="btn-warning text-confirm" v-else>Chưa xác nhận</div>
                </div>
                <b-row>
                    <b-col md="6">
                        <div>
                            <label for="input-live">Tên đại lý:</label>
                            <single-select-company-profile
                                    v-model="companyId"
                                    :show-info="true"
                                    @handleChooseProfileCompany="handleChooseProfileCompany"
                                    :master-id="awb.company_id"
                                    company-type="3"
                                    :disabled="awb.isEdit"
                            >
                            </single-select-company-profile>
                        </div>
                        <div>
                            <label for="input-live">Chặng bay:</label>
                            <b-form-input v-model="awb.flight" type="text" placeholder="Chặng bay" :disabled="awb.isEdit" class="only-bottom-border"></b-form-input>
                        </div>
                        <div>
                            <label for="input-live">Ngày bay:</label>
                            <b-form-input v-model="awb.date_take_off" type="text" placeholder="Ngày bay" :disabled="awb.isEdit" class="only-bottom-border"></b-form-input>
                        </div>
                        <div>
                            <label for="input-live">Giờ bay:</label>
                            <b-form-input v-model="awb.time_take_off" type="text" placeholder="Giờ bay" :disabled="awb.isEdit" class="only-bottom-border"></b-form-input>
                        </div>
                        <div>
                            <label for="input-live">Số hiệu:</label>
                            <b-form-input v-model="awb.flight_number" type="text" placeholder="Số hiệu" :disabled="awb.isEdit" class="only-bottom-border"></b-form-input>
                        </div>
                        <div>
                            <label for="input-live">Mã AWB:</label>
                            <b-form-input v-model="awb.awb_code" type="text" placeholder="Mã AWB" :disabled="awb.isEdit" class="only-bottom-border"></b-form-input>
                        </div>
                        <div>
                            <label for="input-live">Khối lượng tối đa:</label>
                            <b-form-input v-model="awb.weight_max" type="number" placeholder="Khối lượng tối đa (kg)" :disabled="awb.isEdit" class="only-bottom-border"></b-form-input>
                        </div>
                        <div>
                            <label for="input-live">Giá tiền:</label>
                            <b-form-input v-model="awb.price" type="text" placeholder="Nhập giá tiền" :disabled="awb.isEdit" class="only-bottom-border"></b-form-input>
                        </div>
                        <div>
                          <label for="input-live">Số hộp xanh:</label>
                          <b-form-input v-model="awb.box_amount" type="text" placeholder="Số hộp xanh" :disabled="awb.isEdit" class="only-bottom-border"></b-form-input>
                        </div>
                    </b-col>
                    <b-col md="6">
                        <div>
                            <label for="input-live">Khối lượng thực tế:</label>
                            <b-form-input v-model="awb.weight_actual" type="number" placeholder="Khối lượng thực tế (kg)" :disabled="awb.isEdit" class="only-bottom-border"></b-form-input>
                        </div>
                        <div>
                            <label for="input-live">Số kiện hàng:</label>
                            <b-form-input v-model="awb.package_amount" type="number" placeholder="Số kiện hàng" :disabled="awb.isEdit" class="only-bottom-border"></b-form-input>
                        </div>
                        <div>
                            <label for="input-live">Loại hàng:</label>
                            <b-form-select v-model="awb.type" :options="typeCommodity" class="only-bottom-border" :disabled="awb.isEdit">
                                <template v-slot:first>
                                    <option :value="null" disabled>-- Chọn loại hàng hóa --</option>
                                </template>
                            </b-form-select>
                        </div>
                        <div>
                            <label for="input-live">Kho nguồn:</label>
                            <select-stations :disabled="awb.isEdit" :multiple="false" :station-id="awb.station_origin_id" @selected="setSelectedStation" ref="select_stations" placehoder="Nhập kho cần tìm kiếm" ></select-stations>
                        </div>
                        <div>
                            <label for="input-live">Phương thức vận chuyển:</label>
                            <b-form-select v-model="awb.transport_plane_type" :options="transportPlaneTypeOptions" class="only-bottom-border" :disabled="awb.isEdit">
                                <template v-slot:first>
                                    <option :value="null" disabled>-- Chọn phương thức vận chuyển --</option>
                                </template>
                            </b-form-select>
                        </div>
                        <div>
                            <label for="input-live">Loại tải:</label>
                            <b-form-select v-model="awb.transport_pkg_type" :options="transportPkgTypeOptions" class="only-bottom-border" :disabled="awb.isEdit">
                                <template v-slot:first>
                                    <option :value="null" disabled>-- Chọn loại tải --</option>
                                </template>
                            </b-form-select>
                        </div>
                        <div>
                            <label for="input-live">Transit:</label>
                            <b-form-input v-model="awb.transit" type="text" placeholder="Transit" :disabled="awb.isEdit" class="only-bottom-border"></b-form-input>
                        </div>
                        <div>
                          <label for="input-live">Số đơn lẻ:</label>
                          <b-form-input v-model="awb.order_amount" type="text" placeholder="Số đơn lẻ" :disabled="awb.isEdit" class="only-bottom-border"></b-form-input>
                        </div>
                    </b-col>
                </b-row>
                <div class="text-center mt-3">
                    <b-button v-if="awb.isEdit" variant="primary" @click="edit()">Chỉnh sửa</b-button>
                    <b-button v-else variant="primary" @click="updateAwb()">Cập nhật</b-button>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import SingleSelectCompanyProfile from 'components/elements/common/SingleSelectCompanyProfile'
import CompanyProfileService from 'domain/services/company-profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SelectStations from 'components/elements/FilterBox/SelectStations'

export default {
  name: 'modal-detail-awb',

  components: {
    SelectStations,
    SingleSelectCompanyProfile
  },

  props: {
    tempAwb: {
      type: Object,
      default: null
    }
  },

  data: () => ({
    companyId: '',
    selectedStation: '',
    typeCommodity: [
      { value: 'default', text: 'Hàng thường' },
      { value: 'bpbk', text: 'Bưu phẩm bưu cục' },
      { value: 'breakable', text: 'Hàng dễ vỡ' }
    ],
    transportPlaneTypeOptions: [
      { value: 'default', text: 'Thương mại' },
      { value: 'cargo', text: 'Cargo' }
    ],
    transportPkgTypeOptions: [
      { value: 'default', text: 'Tải thường' },
      { value: 'hard', text: 'Tải cứng' }
    ],
    awb: {}
  }),

  created () {
  },

  watch: {
    tempAwb: function () {
      this.awb = this.tempAwb
    }
  },

  methods: {
    updateAwb: function () {
      let dataSend = {
        'id': this.awb.id,
        'company_id': this.companyId,
        'flight': this.awb.flight,
        'date_take_off': this.awb.date_take_off,
        'time_take_off': this.awb.time_take_off,
        'flight_number': this.awb.flight_number,
        'awb_code': this.awb.awb_code,
        'weight_max': this.awb.weight_max,
        'weight_actual': this.awb.weight_actual,
        'package_amount': this.awb.package_amount,
        'type': this.awb.type,
        'station_origin': this.selectedStation || this.awb.station_origin_id,
        'transport_pkg_type': this.awb.transport_pkg_type,
        'transport_plane_type': this.awb.transport_plane_type,
        'transit': this.awb.transit,
        'price': this.awb.price,
        'box_amount': this.awb.box_amount,
        'order_amount': this.awb.order_amount
      }
      CompanyProfileService.updateAwb(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.edit()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
            this.edit()
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    edit: function () {
      // if (parseInt(this.awb.status) === 1) {
      //   commonHelper.showMessage('Không thể chỉnh sửa awb đã xác nhận', 'warning')
      // } else {
      this.awb.isEdit = !this.awb.isEdit
      // }
    },
    setSelectedStation (stationIds) {
      this.selectedStation = stationIds
    },
    handleChooseProfileCompany (option) {
      this.companyId = option ? option.id : ''
    }
  }
}
</script>

<style scoped>
    .text-confirm {
        padding: 5px 10px;
        border-radius: 5px;
    }
</style>
