<template>
  <b-card no-body>
    <b-card-body>
      <b-row >
        <h3 style="color: #00904A;">
        Config lương XLHH thời vụ
        </h3>
      </b-row>
      <b-row>
        <button type="button" class="btn btn-primary" style="margin: 12px;"><a data-v-0320ebbf="" href="https://gdrives.ghtk.co/s/LciSdXMdKSPqDHn" target="_blank" style="color: #FFFFFF;"><i class="ion ion-md-attach mr-1"> </i>Hướng dẫn</a></button>
      </b-row>
      <b-row class="mb-2">
        <b-col md="2">
          <b-input v-model="filterConfig" :placeholder="`Tên config`"></b-input>
        </b-col>
        <b-col md="3">
          <select-station
            :reload="reloadChildComponent"
            :province-ids="git"
            :region-ids="regionIds"
            :reload-option="reloadOption"
            :display-all="true"
            @handleStationSelected="handleStationSelected"
          ></select-station>
        </b-col>
        <b-col md="3">
          <select-province
              :reload="reloadChildComponent"
              :region-ids="regionIds"
              :reload-option="reloadOption"
              :display-all="true"
              @handleProvinceSelected="handleProvinceSelected"
            ></select-province>
        </b-col>
        <b-col md="3">
          <select-region
            :reload="reloadChildComponent"
            :display-all="true"
            :reload-option="reloadOption"
            @handleRegionSelected="handleRegionSelected"
          ></select-region>
        </b-col>
      </b-row>
      <b-row class="mb-5">
        <b-col md="2">
          <datepicker
            v-model="dataSend.start_date"
            :format="customFormatter"
            class="from-date"
            :bootstrapStyling="true"
            placeholder="Ngày bắt đầu"
          ></datepicker>
        </b-col>
        <!-- <span class="my-auto">đến</span> -->
        <b-col md="3">
          <datepicker
            v-model="dataSend.end_date"
            :format="customFormatter"
            class="from-date"
            :bootstrapStyling="true"
            placeholder="Ngày kết thúc"
          ></datepicker>
        </b-col>
        <b-col md="3">
          <b-form-select v-model="dataSend.shift_on" :options="shiftOnsOption"></b-form-select>
        </b-col>
        <b-button variant="outline-success" @click="getConfigWithFilter" class="ml-3">
          <i class="sidenav-icon ion ion-md-search"></i>Tìm Kiếm
        </b-button>
        <b-button variant="outline-danger" @click="resetSearch" class="ml-3 mr-2">
          <i class="sidenav-icon ion ion-md-remove-circle"></i>Reset tìm kiếm
        </b-button>
        <b-button class="pt-1 pb-1" variant="outline-primary" @click="createConfig">
          <i class="ion ion-md-add"></i> Tạo Config Ca
        </b-button>
      </b-row>
      <!-- Content -->
      <b-table
        striped
        hover
        responsive
        :fields="fieldsDataConfigCheckin"
        :items="dataConfig"
        :per-page="perPage"
        :current-page="currentPage"
      >
        <!-- <template v-slot:cell(is_default)="row">{{row.item.is_default === 1 ? "Mặc định"  : "Không mặc định"}}</template> -->
        <template v-slot:cell(detail)="row">
          <b-button variant="outline-success" size="sm" @click="row.toggleDetails" class="mr-2">
            <i :class="row.detailsShowing ? 'ion ion-ios-arrow-down' : 'ion ion-ios-arrow-forward'"></i>
          </b-button>
        </template>

        <template v-slot:cell(time)="row">
          <div style="max-width: 400px">
            <b-button-group size="sm" class="mb-2">
              <b-button variant="success">Bắt đầu : {{row.item.start_date}}</b-button>
              <b-button variant="danger">Kết thúc : {{row.item.end_date}}</b-button>
            </b-button-group>
          </div>
        </template>

        <template v-slot:cell(shift)="row">
          {{ (row.item.price > 0 || row.item.day_price > 0)? 'Theo giờ' : ''}}
          {{row.item.price > 0 && row.item.bonus_by_days > 0 ? ', ' : ''}}
          {{row.item.bonus_by_days > 0 ? 'Theo ngày' : ''}}
        </template>

        <template v-slot:cell(action)="row">
          <b-button
            v-if="+row.item.is_default !== 1"
            variant="outline-success"
            size="sm"
            @click="updateConfig(row.item)"
          >
            <i class="fa fa-pencil-alt" />
          </b-button>
        </template>
        <template #row-details="row">
          <b-card>
            <b-table-simple
              striped
              hover
              responsive
            >
              <b-thead>
                <b-tr>
                  <b-th class="w-50">Phạm vi áp dụng</b-th>
                  <b-th class="w-30">Chi tiết</b-th>
                  <b-th>Ca</b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr>
                  <b-td class="w-50">
                    <div v-if="listRegionConfig[+row.item.id]">
                      <span>Theo miền:</span>
                      <multi-view
                        v-if="listRegionConfig !== null && Object.values(listRegionConfig).length !== 0 && listRegionConfig[+row.item.id]"
                        :option="listRegionConfig[+row.item.id]"
                        :options="listRegionConfig[+row.item.id]"
                      ></multi-view>
                      <br/>
                    </div>
                    <div v-if="listProvinceConfig[+row.item.id]">
                      <span>Theo tỉnh:</span>
                      <multi-view
                        v-if="listProvinceConfig !== null && Object.values(listProvinceConfig).length !== 0 && listProvinceConfig[+row.item.id]"
                        :option="listProvinceConfig[+row.item.id]"
                        :options="listProvinceConfig[+row.item.id]"
                      ></multi-view>
                      <br/>
                    </div>
                    <div v-if="listStationConfig[+row.item.id]">
                      <span>Theo kho:</span>
                      <multi-view
                        v-if="listStationConfig !== null && Object.values(listStationConfig).length !== 0 && listStationConfig[+row.item.id]"
                        :option="listStationConfig[+row.item.id]"
                        :options="listStationConfig[+row.item.id]"
                      ></multi-view>
                      <br/>
                    </div>
                    <div v-if="listUserConfig[+row.item.id]">
                      <span>Nhân viên:</span>
                      <multi-view
                        v-if="listUserConfig !== null && Object.values(listUserConfig).length !== 0 && listUserConfig[+row.item.id]"
                        :option="listUserConfig[+row.item.id]"
                        :options="listUserConfig[+row.item.id]"
                      ></multi-view>
                      <br/>
                    </div>
                  </b-td>
                  <b-td class="w-30">
                    <br/>
                    <div v-if="row.item.price > 0">
                      Phụ cấp theo giờ: {{row.item.price}} / giờ
                    </div>
                    <div v-if="row.item.day_price > 0">
                      Phụ cấp ca ngày: {{row.item.day_price}} / giờ
                    </div>
                    <div v-if="row.item.night_price > 0">
                      Phụ cấp ca đêm: {{row.item.night_price}} / giờ
                    </div>
                    <div v-if="row.item.bonus_by_days > 0">
                      Phụ cấp theo ngày đi làm: {{row.item.bonus_by_days}} / {{row.item.bonus_count_days}} ngày
                    </div>
                  </b-td>
                  <b-td>
                    <br/>
                    <div v-if="row.item.day_price === 0 && row.item.night_price === 0">
                      {{row.item.shift_on === 'day' ? 'Ngày' : 'Đêm'}}
                    </div>
                    <div v-if="row.item.day_price > 0">
                      Ca ngày: {{row.item.from}} - {{row.item.to}}
                    </div>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </b-card>
      </template>
      </b-table>
      <hr />
      <b-row class="d-flex justify-content-center">
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
      </b-row>
      <!-- config pk -->
      <b-modal
        ref="modal-config"
        no-close-on-backdrop
        size="lg"
        title="Config part time"
        cancel-title="Hủy bỏ"
        static
        :hide-footer="true"
        @close="close"
      >
        <br />
        <b-row class="mb-4">
          <b-col md="2">
            <label for="name" class="font-weight-bold">Tên Config<i class="require">(*)</i>:</label>
          </b-col>
          <b-col>
            <b-form-input id="name" v-model="dataSend.name" placeholder="Tên Config" :required="true"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col md="2">
            <label class="font-weight-bold">Miền:</label>
          </b-col>
          <b-col>
            <select-region
              :reload="reloadChildComponent"
              :data="action === 2 ? listRegionConfig[+dataSend.id] : null"
              :action="action"
              :display-all="true"
              :reload-option="reloadOption"
              @handleRegionSelected="handleRegionSelected"
            ></select-region>
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col md="2">
            <label class="font-weight-bold">Tỉnh:</label>
          </b-col>
          <b-col>
            <select-province
              :reload="reloadChildComponent"
              :data="action === 2 ? listProvinceConfig[+dataSend.id] : null"
              :region-ids="regionIds"
              :action="action"
              :display-all="true"
              :reload-option="reloadOption"
              @handleProvinceSelected="handleProvinceSelected"
            ></select-province>
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col md="2">
            <label class="font-weight-bold">Kho:</label>
          </b-col>
          <b-col>
            <select-station
              :reload="reloadChildComponent"
              :data="action === 2 ? listStationConfig[+dataSend.id] : null"
              :action="action"
              :province-ids="provinceIds"
              :region-ids="regionIds"
              :reload-option="reloadOption"
              :display-all="true"
              @handleStationSelected="handleStationSelected"
            ></select-station>
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col md="2">
            <label class="font-weight-bold">Nhân viên:</label>
          </b-col>
          <b-col>
            <multiselect
              v-model="users"
              label="name"
              track-by="id"
              placeholder="Chọn XLHH"
              :options="userOptions"
              :multiple="true"
              :searchable="true"
              :loading="asyncLoading"
              :internal-search="false"
              :clear-on-select="false"
              :close-on-select="false"
              :hide-selected="true"
              @search-change="asyncFind">
              <span slot="noResult">{{ message }}</span>
              <span slot="noOptions">{{ message }}</span>
            </multiselect>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="2">
            <label class="font-weight-bold">Nhân viên:</label>
          </b-col>
          <b-col md="10">
            <b-form-input id="listUsrName" v-model="dataSend.usernames" placeholder="List username"
                          :required="true"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col >
            <label class="form-label font-weight-bold">Chọn thời gian bắt đầu<i class="require">(*)</i>:</label>
            <datepicker
              v-model="dataSend.start_date"
              :format="customFormatter"
              class="from-date"
              :bootstrapStyling="true"
            ></datepicker>
          </b-col>

          <b-col >
            <label class="form-label font-weight-bold">Chọn thời gian kết thúc:</label>
            <datepicker
              v-model="dataSend.end_date"
              :format="customFormatter"
              class="from-date"
              :bootstrapStyling="true"
            ></datepicker>
          </b-col>
        </b-row>
        <b-row>
          <label for="name" class="font-weight-bold">Ca<i class="require">(*)</i>:</label>
        </b-row>
        <b-row>
          <b-col >
            <!-- <b-form-select v-model="dataSend.shift_on" :options="shiftOns"></b-form-select> -->
              <b-form-group
                horizontal
                :label-cols="2"
                label="Từ">
                <b-form-input  type="time" v-model="dataSend.from"></b-form-input>
              </b-form-group>
          </b-col>
          <b-col >
              <b-form-group
                horizontal
                :label-cols="2"
                label="Đến">
                <b-form-input  type="time" v-model="dataSend.to"></b-form-input>
              </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col md="4">
            <span class="font-weight-bold">Phụ cấp theo giờ<i class="require">(*)</i>:</span>
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col md="6">
            <b-form-group
              horizontal
              :label-cols="2"
              label="Ca ngày">
              <b-form-input id="price1" v-model="dataSend.day_price" placeholder="Số tiền (VNĐ)/ giờ"
                            :required="true"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              horizontal
              :label-cols="2"
              label="Ca đêm">
              <b-form-input id="price1" v-model="dataSend.night_price" placeholder="Số tiền (VNĐ)/ giờ"
                            :required="true"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col md="4">
            <b-form-checkbox
              v-model="dataSend.is_bonus_day"
              value="1"
              unchecked-value="0"
            >
                <span class="font-weight-bold">Phụ cấp theo ngày đi làm:</span>
            </b-form-checkbox>
          </b-col>
          <b-col md="3" v-if="dataSend.is_bonus_day == 1">
            <b-form-input id="bonus_by_days" v-model="dataSend.bonus_by_days" placeholder="Số tiền (VNĐ)" :required="true"></b-form-input>
          </b-col>
          <b-col class="md-1" v-if="dataSend.is_bonus_day == 1">/</b-col>
          <b-col md="3" v-if="dataSend.is_bonus_day == 1">
            <b-form-input id="bonus_count_days" v-model="dataSend.bonus_count_days" placeholder="Số ngày" :required="true"></b-form-input>
          </b-col>
          <b-col v-if="dataSend.is_bonus_day == 1">ngày</b-col>
        </b-row>
        <b-row class="float-right">
          <b-button
            class="mr-3"
            v-if="action === 1"
            variant="primary"
            @click="createConfigPK"
          >Tạo Config Ca</b-button>
          <b-button
            class="mr-3"
            v-if="action === 2"
            variant="primary"
            @click="updateConfigPK"
          >Cập Nhật Config</b-button>
          <b-button variant="success" @click="cancel">Hủy Bỏ</b-button>
        </b-row>
      </b-modal>
    </b-card-body>
  </b-card>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}
.require {
  color: #ff0000;
}
</style>

<script>
import SelectRegion from './SgwConfigPKComponent/SelectRegion'
import SelectStation from './SgwConfigPKComponent/SelectStation'
import SelectProvince from './SgwConfigPKComponent/SelectProvince'
import commonHelper from 'infrastructures/helpers/common-helpers'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import Multiselect from 'vue-multiselect'
import SalaryService from 'domain/services/salary-service'
import flatPickr from 'vue-flatpickr-component'
import Datepicker from 'vuejs-datepicker'
import MultiView from './SgwConfigPKComponent/MultiView'
import debounce from 'debounce'

export default {
  name: 'sgw-config-pk-part-time',
  components: {
    commonHelper,
    VueMonthlyPicker,
    Moment,
    Multiselect,
    flatPickr,
    Datepicker,
    SelectRegion,
    SelectStation,
    SelectProvince,
    MultiView
  },
  data: () => ({
    rangeConfig: {
      mode: 'range',
      altInput: true,
      altFormat: 'd-m-Y',
      dateFormat: 'd-m-Y'
    },
    perPage: 5,
    currentPage: 1,
    dataConfig: [],
    fieldsDataConfigCheckin: [
      { key: 'detail', label: '' },
      { key: 'name', label: 'Tên config', sortable: true },
      { key: 'time', label: 'Thời gian hiệu lực', sortable: true },
      { key: 'shift', label: 'Ca phụ cấp', sortable: true },
      { key: 'action', label: '' }
    ],
    filterConfig: '',
    optionSelect: [],
    countSearchConfig: 0,
    triggerShow: false,
    dataSend: {
      id: null,
      name: null,
      price: null,
      bonus_by_days: null,
      bonus_count_days: null,
      shift_on: 'day',
      is_default: 0,
      stations: [],
      provinces: [],
      regions: [],
      start_date: null,
      end_date: null,
      is_bonus_day: 0,
      day_price: null,
      night_price: null,
      from: '06:00:00',
      to: '17:00:00',
      usernames: ''
    },
    action: 1, // 1: create, 2: update
    shiftOns: [
      { value: 'day', text: 'Ca ngày' },
      { value: 'night', text: 'Ca đêm' }
    ],
    shiftOnsOption: [
      { value: -1, text: 'Tất cả' },
      { value: 'day', text: 'Ca ngày' },
      { value: 'night', text: 'Ca đêm' }
    ],
    listDefaults: [
      { value: '1', text: 'Mặc định', disabled: true },
      { value: '0', text: 'Không mặc định' }
    ],
    listDefaultsOption: [
      { value: -1, text: 'Tất cả' },
      { value: '1', text: 'Mặc định' },
      { value: '0', text: 'Không mặc định' }
    ],
    regionIds: [],
    provinceIds: [],
    listStationConfig: [],
    listProvinceConfig: [],
    listRegionConfig: [],
    stations: [],
    regions: [],
    listRegions: [],
    filterRegions: [],
    reloadChildComponent: true,
    reloadOption: true,
    users: [],
    userOptions: [],
    message: 'Nhập ít nhất 2 ký tự',
    asyncLoading: false,
    listUserConfig: []
  }),
  watch: {
    triggerShow: function (newVal, oldVal) {
      if (this.triggerShow) this.$refs['modal-config'].show()
    }
  },
  created () {
    this.getConfig()
    this.getListRegion()
  },
  computed: {
    rows () {
      return this.dataConfig.length
    }
  },
  methods: {
    async getConfig () {
      try {
        let res = await SalaryService.getConfigPkPartTime()
        if (typeof res !== 'undefined' && res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.dataConfig = res.data.data.dataConfig
          this.listRegionConfig = res.data.data.regionUseConfig
          this.listProvinceConfig = res.data.data.provinceUseConfig
          this.listStationConfig = res.data.data.stationUseConfig
          this.countSearchConfig = res.data.data.dataConfig.length
          this.listUserConfig = res.data.data.userUseConfig
          return
        }
        commonHelper.showMessage(res.data.message)
      } catch (error) {
        commonHelper.showMessage('Lỗi khi lấy config')
      }
    },
    async getConfigWithFilter () {
      try {
        let regions = [...this.regionIds]
        let provinces = [...this.provinceIds]
        let stations = [...this.dataSend.stations]
        let dataSend = {
          regions: regions,
          provinces: provinces,
          stations: stations,
          shift_on:
          +this.dataSend.shift_on !== -1 ? this.dataSend.shift_on : null,
          start_date: this.dataSend.start_date ? Moment(this.dataSend.start_date).format('YYYY/MM/DD') : '',
          end_date: this.dataSend.end_date ? Moment(this.dataSend.end_date).format('YYYY/MM/DD') : '',
          name: this.filterConfig
        }
        let res = await SalaryService.getConfigPkPartTime(dataSend)
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.dataConfig = res.data.data.dataConfig
          this.listRegionConfig = res.data.data.regionUseConfig
          this.listProvinceConfig = res.data.data.provinceUseConfig
          this.listStationConfig = res.data.data.stationUseConfig
          this.countSearchConfig = res.data.data.dataConfig.length
          return
        }
        commonHelper.showMessage(res.data.message)
      } catch (error) {
        commonHelper.showMessage('Lỗi khi lấy config')
      }
    },
    async updateConfigPK () {
      if (!this.validateDataSend()) {
        commonHelper.showMessage('Vui lòng nhập đủ thông tin')
        return
      }
      try {
        let userIds = []
        this.users.forEach(element => {
          userIds.push(element.id)
        })
        let tempDataSend = {
          id: this.dataSend.id,
          name: this.dataSend.name,
          start_date: this.dataSend.start_date ? Moment(this.dataSend.start_date).format('YYYY/MM/DD') : '',
          end_date: this.dataSend.end_date ? Moment(this.dataSend.end_date).format('YYYY/MM/DD') : '',
          shift_on: this.dataSend.shift_on,
          price: this.dataSend.price,
          is_bonus_day: this.dataSend.is_bonus_day,
          bonus_by_days: this.dataSend.bonus_by_days,
          bonus_count_days: this.dataSend.bonus_count_days,
          stations: [...this.dataSend.stations],
          provinces: JSON.parse(JSON.stringify(this.provinceIds)),
          regions: JSON.parse(JSON.stringify(this.regionIds)),
          is_default: this.dataSend.is_default,
          user_ids: userIds,
          day_price: this.dataSend.day_price,
          night_price: this.dataSend.night_price,
          from: this.dataSend.from,
          to: this.dataSend.to,
          usernames: this.dataSend.usernames
        }
        let res = await SalaryService.updateConfigPkPartTimeV2(tempDataSend)
        if (!res.data.success) {
          commonHelper.showMessage(res.data.message)
          return
        }

        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          await this.getConfig()
          this.cancel()
          return
        }
        commonHelper.showMessage(res.data.message)
      } catch (error) {
        commonHelper.showMessage('Lỗi khi cập nhật config')
      }
    },
    async createConfigPK () {
      if (!this.validateDataSend()) {
        commonHelper.showMessage('Vui lòng nhập đủ thông tin')
        return
      }
      try {
        let userIds = []
        this.users.forEach(element => {
          userIds.push(element.id)
        })
        let tempDataSend = {
          name: this.dataSend.name,
          start_date: this.dataSend.start_date ? Moment(this.dataSend.start_date).format('YYYY/MM/DD') : '',
          end_date: this.dataSend.end_date ? Moment(this.dataSend.end_date).format('YYYY/MM/DD') : '',
          shift_on: this.dataSend.shift_on,
          price: this.dataSend.price,
          is_bonus_day: this.dataSend.is_bonus_day,
          bonus_by_days: this.dataSend.bonus_by_days,
          bonus_count_days: this.dataSend.bonus_count_days,
          stations: [...this.dataSend.stations],
          provinces: JSON.parse(JSON.stringify(this.provinceIds)),
          regions: JSON.parse(JSON.stringify(this.regionIds)),
          is_default: this.dataSend.is_default,
          user_ids: userIds,
          day_price: this.dataSend.day_price,
          night_price: this.dataSend.night_price,
          from: this.dataSend.from,
          to: this.dataSend.to,
          usernames: this.dataSend.usernames
        }
        let res = await SalaryService.createConfigPkPartTimeV2(tempDataSend)
        if (!res.data.success) {
          commonHelper.showMessage(res.data.message)
          return
        }
        if (res.data.success) {
          await this.getConfig()
          commonHelper.showMessage(res.data.message, 'success')
          this.cancel()
          return
        }
        commonHelper.showMessage(res.data.message)
      } catch (error) {
        commonHelper.showMessage('Lỗi khi tạo config')
      }
    },
    validateDataSend () {
      if (this.dataSend.name === null || this.dataSend.day_price === null || this.dataSend.night_price === null) {
        return false
      }
      return true
    },
    openModal: function () {
      this.clearModal()
      this.triggerShow = true
    },
    updateConfig (data) {
      this.clearModal()
      this.action = 2 // update
      this.triggerShow = true
      this.dataSend.id = data.id
      this.dataSend.price = data.price
      this.dataSend.bonus_by_days = data.bonus_by_days
      this.dataSend.bonus_count_days = data.bonus_count_days
      this.dataSend.is_bonus_day = data.bonus_by_days > 0 ? 1 : 0
      this.dataSend.shift_on = data.shift_on
      this.dataSend.name = data.name
      this.dataSend.is_default = data.is_default
      this.dataSend.start_date = data.start_date
      this.dataSend.end_date = data.end_date
      this.dataSend.day_price = data.day_price
      this.dataSend.night_price = data.night_price
      this.dataSend.from = data.from
      this.dataSend.to = data.to
      this.dataSend.usernames = ''
      if (this.listUserConfig[data.id]) {
        this.listUserConfig[data.id].forEach(element => {
          this.users.push({id: element.user_id, name: element.name})
        })
      }
      if (this.listStationConfig[+data.id]) {
        this.dataSend.stations = this.listStationConfig[+data.id].map((x) => x.id)
      } else this.dataSend.stations = []
      if (this.listProvinceConfig[+data.id]) {
        this.provinceIds = this.listProvinceConfig[+data.id].map((x) => x.id)
      } else this.provinceIds = []
      if (this.listRegionConfig[+data.id]) {
        this.regionIds = this.listRegionConfig[+data.id].map((x) => x.id)
      } else this.regionIds = []
    },
    createConfig () {
      this.clearModal()
      this.action = 1 // create
      this.triggerShow = true
    },
    close: function () {
      this.clearModal()
      this.triggerShow = false
      this.isSelectAll = 1
    },
    cancel: function () {
      this.$refs['modal-config'].hide()
      this.triggerShow = false
      this.clearModal()
      this.reloadOption = !this.reloadOption
    },
    clearModal: function () {
      this.filterConfig = ''
      this.reloadChildComponent = !this.reloadChildComponent
      this.dataSend = {
        id: null,
        name: null,
        price: null,
        bonus_by_days: null,
        bonus_count_days: null,
        shift_on: 'day',
        is_default: 0,
        start_date: null,
        end_date: null,
        stations: [],
        provinces: [],
        regions: [],
        is_bonus_day: 0,
        day_price: null,
        night_price: null,
        from: '06:00:00',
        to: '17:00:00',
        usernames: ''
      }
      this.regionIds = []
      this.provinceIds = []
      this.userOptions = []
      this.users = []
    },
    resetSearch () {
      this.clearModal()
      this.provinceIds = []
      this.regionIds = []
      this.reloadOption = !this.reloadOption
    },
    customFormatter (date) {
      return Moment(date).format('YYYY-MM-DD')
    },
    handleStationSelected (option) {
      this.dataSend.stations = option.map((x) => x.id)
    },
    handleProvinceSelected (option) {
      this.provinceIds = option.map((x) => x.id)
    },
    handleRegionSelected (option) {
      this.regionIds = option.map((x) => x.id)
    },
    toIntArray (arr) {
      return arr.map((i) => +i)
    },
    getListRegion () {
      SalaryService.getListRegion()
        .then((res) => {
          if (res.data.success) {
            this.listRegions = [...res.data.data] // [id=>A, name=>B]
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.userOptions = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.userOptions = []
      SalaryService.searchXLHH({term: query}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.userOptions = response.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    }, 500)
  }
}
</script>
