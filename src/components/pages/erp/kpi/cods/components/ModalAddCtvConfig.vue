<template>
    <b-modal ref="modalconfig" hide-footer id="modal-add-ctv-config">
        <div slot="modal-title">
            <p>Thêm config cộng tác viên</p>
        </div>
      <div class="row mb-2">
        <div class="col-md-6 mb-2">
          <div class="row mb-2">
            <!--Loại hình làm việc-->
            <div class="col-md">
              <label class="form-label">Loại hình làm việc <span class="text-danger">(*)</span></label>
              <multiselect
                v-model="filter.work_type.selected"
                label="name"
                track-by="id"
                placeholder=""
                :options="filter.work_type.options"
                :multiple="false"
                :searchable="true"
                :loading="filter.work_type.loading"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel=""
                :internal-search="true"
                :clear-on-select="true"
                :close-on-select="true"
                :hide-selected="true">
                <span slot="noResult">Không có kết quả phù hợp</span>
                <span slot="noOptions">Không có dữ liệu</span>
              </multiselect>
            </div>
            <!--Phạm vi áp dụng-->
            <div class="col-md">
              <label class="form-label">Chọn phạm vi áp dụng <span class="text-danger">(*)</span></label>
              <multiselect
                class=""
                v-model="filter.option_area.selected"
                label="name"
                track-by="id"
                placeholder=""
                :options="filter.option_area.options"
                :multiple="false"
                :searchable="true"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel=""
                :allow-empty="false"
                :internal-search="true"
                :clear-on-select="false"
                :close-on-select="true"
                :hide-selected="false">
                <span slot="noResult">Không có kết quả phù hợp</span>
                <span slot="noOptions">Không có dữ liệu</span>
              </multiselect>
            </div>
          </div>
          <div class="row mb-2">
            <!--Ngày bắt đầu-->
            <div class="col-md mb-2">
              <label class="form-label">Từ ngày <span class="text-danger">(*)</span></label>
              <datepicker
                      v-model="filter.date_from"
                      :disabled-dates="filter.from_config.disabledDates"
                      format="dd-MM-yyyy"
                      :bootstrapStyling="true"
                      :monday-first="true"
                      :full-month-name="true"
                      :calendar-button="true"
                      calendar-button-icon="ion ion-md-calendar"
                      :clear-button="true"
                      placeholder="Vô hạn"
              />
            </div>
            <!--Ngày kết thúc-->
            <div class="col-md mb-2">
              <label class="form-label">Đến ngày <span class="text-danger">(*)</span></label>
              <datepicker
                      v-model="filter.date_to"
                      :disabled-dates="filter.to_config.disabledDates"
                      format="dd-MM-yyyy"
                      :bootstrapStyling="true"
                      :monday-first="true"
                      :full-month-name="true"
                      :calendar-button="true"
                      calendar-button-icon="ion ion-md-calendar"
                      :clear-button="true"
                      placeholder="Vô hạn"
              />
            </div>
          </div>
          <div>
          </div>
        </div>
        <div class="col-md mb-2">
          <div class="row mb-2">
            <!--Theo miền-->
            <div class="col-md" v-if="filter.option_area.selected.id === 'region'">
              <label class="form-label">Chọn Miền <span class="text-danger">(*)</span></label>
              <multiselect
                class="custom-multiselect"
                v-model="filter.region.selected"
                label="name"
                track-by="id"
                placeholder=""
                :options="filter.region.options"
                :multiple="true"
                :searchable="true"
                :loading="filter.region.loading"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel=""
                :internal-search="true"
                :clear-on-select="true"
                :close-on-select="false"
                :hide-selected="false">
                <span slot="noResult">Không có kết quả phù hợp</span>
                <span slot="noOptions">Không có dữ liệu</span>
              </multiselect>
            </div>
            <!--Theo tỉnh/thành-->
            <div class="col-md" v-if="filter.option_area.selected.id === 'province'">
              <label class="form-label">Chọn Tỉnh/Thành phố <span class="text-danger">(*)</span></label>
              <multiselect
                class="custom-multiselect"
                v-model="filter.province.selected"
                label="name"
                track-by="id"
                placeholder=""
                :options="filter.province.options"
                :multiple="true"
                :searchable="true"
                :loading="filter.province.loading"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel=""
                :internal-search="true"
                :clear-on-select="true"
                :close-on-select="false"
                :hide-selected="false">
                <span slot="noResult">Không có kết quả phù hợp</span>
                <span slot="noOptions">Không có dữ liệu</span>
              </multiselect>
            </div>
            <!--Theo quận huyện-->
            <div class="col-md" v-if="filter.option_area.selected.id === 'district'">
              <label class="form-label">Quận/Huyện</label>
              <multiselect
                class="custom-multiselect"
                v-model="filter.district.selected"
                label="name"
                track-by="id"
                placeholder=""
                :options="filter.district.options"
                :multiple="true"
                :searchable="true"
                :loading="filter.district.loading"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel=""
                :internal-search="true"
                :clear-on-select="true"
                :close-on-select="false"
                :hide-selected="false">
                <span slot="noResult">Không có kết quả phù hợp</span>
                <span slot="noOptions">Không có dữ liệu</span>
              </multiselect>
            </div>
            <!--Theo kho-->
            <div class="col-md" v-if="filter.option_area.selected.id === 'station'">
              <label class="form-label">Kho</label>
              <multiselect
                class="custom-multiselect"
                v-model="filter.station.selected"
                label="name"
                track-by="id"
                placeholder=""
                :options="filter.station.options"
                :multiple="true"
                :searchable="true"
                :loading="filter.station.loading"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel=""
                :internal-search="true"
                :clear-on-select="true"
                :close-on-select="false"
                :hide-selected="false">
                <span slot="noResult">Không có kết quả phù hợp</span>
                <span slot="noOptions">Không có dữ liệu</span>
              </multiselect>
            </div>
            <!--Theo username-->
            <div class="col-md" v-if="filter.option_area.selected.id === 'username'">
              <label class="form-label">Username <span class="text-danger">(*)</span></label>
              <b-form-input id="inputLive"
                            v-model.trim="filter.username"
                            type="text"
                            :state="usernameState"
                            aria-describedby="inputLiveFeedback"
                            placeholder="Nhiều username cách nhau bởi dấu phẩy"></b-form-input>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md">
              <label class="form-label">Mô tả ngắn gọn <span class="text-danger">(*)</span></label>
              <b-form-input id="inputLive"
                            v-model.trim="filter.description"
                            type="text"
                            :state="true"
                            aria-describedby="inputLiveFeedback"
                            placeholder=""></b-form-input>
            </div>
          </div>
        </div>
      </div>
      <hr class="border-light container-m--x my-2">
      <perfect-scrollbar class="pr-2" :options="{wheelSpeed: 0.2,  wheelPropagation: false }" style="height: 400px">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button class="text-left" block v-b-toggle.accordion2-1 variant="outline-primary">
              #1 Thù lao đơn/điểm theo vùng
              <b-badge variant="light">{{ option.type1.object_id }}</b-badge>
              <div class="float-right collapse-icon"></div>
            </b-button>
          </b-card-header>
          <b-collapse id="accordion2-1" :visible="option.type1.visible" accordion="accordion2">
            <b-card-body>
              <option-config-type @model="option.type1.object_id = $event" v-bind:type_id="1"></option-config-type>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button class="text-left" block v-b-toggle.accordion2-2 variant="outline-primary">
              #2 Thù lao vượt ngưỡng theo vùng
              <b-badge variant="light">{{ option.type2.object_id }}</b-badge>
              <div class="float-right collapse-icon"></div>
            </b-button>
          </b-card-header>
          <b-collapse id="accordion2-2" :visible="option.type2.visible" accordion="accordion2">
            <b-card-body>
              <option-config-type @model="option.type2.object_id = $event" v-bind:type_id="2"></option-config-type>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button class="text-left" block v-b-toggle.accordion2-3 variant="outline-primary">
              #3 Thù lao vượt ngưỡng tổng đơn/điểm trên ngày
              <b-badge variant="light">{{ option.type3.object_id }}</b-badge>
              <div class="float-right collapse-icon"></div>
            </b-button>
          </b-card-header>
          <b-collapse id="accordion2-3" :visible="option.type3.visible" accordion="accordion2">
            <b-card-body>
              <option-config-type @model="option.type3.object_id = $event" v-bind:type_id="3"></option-config-type>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button class="text-left" block v-b-toggle.accordion2-4 variant="outline-primary">
              #4 Thù lao đi làm theo ngày công
              <b-badge variant="light">{{ option.type4.object_id }}</b-badge>
              <div class="float-right collapse-icon"></div>
            </b-button>
          </b-card-header>
          <b-collapse id="accordion2-4" :visible="option.type4.visible" accordion="accordion2">
            <b-card-body>
              <option-config-type @model="option.type4.object_id = $event" v-bind:type_id="4"></option-config-type>
            </b-card-body>
          </b-collapse>
        </b-card>
      </perfect-scrollbar>
      <div class=" row float-right mt-5">
        <b-btn @click="$bvModal.hide('modal-add-ctv-config')" variant="secondary">Hủy</b-btn>&nbsp;
        <ladda-btn :loading="buttonSave.loading" @click.native="saveData" data-style="zoom-out" class="btn btn-success">
          Lưu dữ liệu
        </ladda-btn>
      </div>
    </b-modal>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<script>
import kpiCodService from 'domain/services/kpi-cod-service'
import Multiselect from 'vue-multiselect'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import flatPickr from 'vue-flatpickr-component'
import vueNumeric from 'vue-numeric'
import OptionConfigType from './OptionConfigType'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'

const optionsArea = [
  {name: 'Theo Miền', id: 'region'},
  {name: 'Theo Tỉnh/Thành Phố', id: 'province'},
  {name: 'Theo Quận/Huyện', id: 'district'},
  {name: 'Theo Kho', id: 'station'},
  {name: 'Theo Username', id: 'username'}
]

export default {
  name: 'modal-add-ctv-config',
  props: [
  ],

  components: {
    kpiCodService,
    Multiselect,
    SweetModal,
    SweetModalTab,
    commonHelper,
    flatPickr,
    vueNumeric,
    OptionConfigType,
    LaddaBtn,
    PerfectScrollbar,
    Datepicker,
    moment
  },
  watch: {
    'filter.date_from': function (newVal) {
      this.filter.to_config.disabledDates.to = newVal
    },
    'filter.date_to': function (newVal) {
      this.filter.from_config.disabledDates.from = newVal
    },
    option: {
      immediate: true,
      deep: true,
      handler (newValue) {
      }
    }
  },
  data: () => (
    {
      filter: {
        date_from: '',
        date_to: '',
        from_config: {disabledDates: {from: null, to: null}},
        to_config: {disabledDates: {from: null, to: null}},
        description: '',
        username: '',
        option_area: {
          selected: optionsArea[0],
          options: optionsArea
        },
        region: {
          loading: false,
          options: [],
          selected: []
        },
        province: {
          loading: false,
          options: [],
          selected: []
        },
        district: {
          loading: false,
          options: [],
          selected: []
        },
        station: {
          loading: false,
          options: [],
          selected: []
        },
        work_type: {
          loading: false,
          options: [],
          selected: []
        }
      },
      option: {
        type1: {
          visible: false,
          object_id: null
        },
        type2: {
          visible: false,
          object_id: null
        },
        type3: {
          visible: false,
          object_id: null
        },
        type4: {
          visible: false,
          object_id: null
        }
      },
      buttonSave: {
        loading: false
      }
    }
  ),
  computed: {
    usernameState () {
      if (/^[a-z]/.test(this.filter.username) || this.filter.username === '') return true
      return false
    }
  },
  methods: {
    // Loại hình làm việc ctv
    getCtvWorkTypes () {
      this.filter.work_type.loading = true
      kpiCodService.apiCtvGetWorkTypes().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.filter.work_type.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh', 'error')
      }).then(() => {
        this.getStations()
        this.filter.work_type.loading = false
      })
    },

    // lấy danh sách miền
    getRegions () {
      this.filter.region.loading = true
      kpiCodService.apiCtvGetRegions().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.filter.region.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách miền', 'error')
      }).then(() => {
        this.filter.region.loading = false
      })
    },

    // lấy danh sách tỉnh
    getProvinces () {
      this.filter.province.loading = true
      let dataSend = {
        region_ids: this.filter.region.selected.id
      }
      kpiCodService.apiCtvGetProvinces(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$root.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
          if (response.data.success) {
            this.filter.province.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh', 'error')
      }).then(() => {
        this.filter.province.loading = false
      })
    },

    // lấy danh sách quận huyện
    getDistricts () {
      this.filter.district.loading = true
      kpiCodService.apiCtvGetDistricts({
        region_ids: this.filter.region.selected.id,
        province_ids: this.filter.province.selected.id
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.filter.district.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh', 'error')
      }).then(() => {
        this.filter.district.loading = false
      })
    },

    // lấy danh sách kho
    getStations () {
      this.filter.station.loading = true
      if (this.filter.province.selected.length === 0) {
        this.filter.station.selected = []
      }
      kpiCodService.apiCtvGetStations({
        region_ids: this.filter.region.selected.id,
        province_ids: this.filter.province.selected.id,
        district_ids: this.filter.district.selected.id
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.filter.station.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lưu dữ liệuxử lý danh sách kho', 'error')
      }).then(() => {
        this.filter.station.loading = false
      })
    },

    // lưu dữ liệu
    saveData () {
      this.buttonSave.loading = true
      let ids = Object.values(this.option).map(a => a.object_id)
      let dataSend = {
        object_ids: ids.filter(function (a) { return a != null }),
        from: this.filter.date_from,
        to: this.filter.date_to,
        description: this.filter.description,
        work_type: typeof this.filter.work_type.selected.id === 'undefined' ? null : this.filter.work_type.selected.id,
        option_area: typeof this.filter.option_area.selected.id === 'undefined' ? null : this.filter.option_area.selected.id,
        region_ids: this.filter.region.selected.map(a => a.id),
        province_ids: this.filter.province.selected.map(a => a.id),
        district_ids: this.filter.district.selected.map(a => a.id),
        station_ids: this.filter.station.selected.map(a => a.id),
        username: this.filter.username
      }
      if (dataSend.object_ids.length === 0) {
        commonHelper.showMessage('Chưa chọn loại Thù lao', 'error')
        this.buttonSave.loading = false
        return 0
      }
      if (dataSend.work_type === null) {
        commonHelper.showMessage('Chưa chọn loại hình làm việc', 'error')
        this.buttonSave.loading = false
        return 0
      }
      if (dataSend.description === '') {
        commonHelper.showMessage('Chưa viết mô tả', 'error')
        this.buttonSave.loading = false
        return 0
      }
      kpiCodService.apiSaveCtvConfig(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
            this.hideModal()
            this.$parent.getDataConfig()
          } else {
            commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lưu dữ liệu', 'error')
      }).then(() => {
        this.buttonSave.loading = false
      })
    },
    hideModal () {
      this.$refs.modalconfig.hide()
    }
  },
  created () {
    this.getRegions()
    this.getCtvWorkTypes()
  }
}
</script>

<style scoped lang="scss">
</style>
