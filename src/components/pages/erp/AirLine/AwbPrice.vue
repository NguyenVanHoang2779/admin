<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <div class="mb-5 d-flex justify-content-center">
          <h1>Config giá Air Way Bill</h1>
        </div>
        <div class="filter">
          <b-row class="mb-2 justify-content-center">
            <b-col md="3">
              <b-form-group class="w-100">
                <b-input-group>
                  <multi-select-company-profile
                    :show-info="true"
                    :allow-empty="true"
                    @handleChooseProfileCompany="handleChooseProfileCompany"
                    company-type="3"
                    :multiple-select="true"
                  ></multi-select-company-profile>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group class="w-100">
                <b-input-group>
                  <multiselect
                    v-model="airLineCode"
                    :options="airLineCodes"
                    placeholder="Tìm kiếm theo mã chuyến bay"
                    track-by="code"
                    label="code"
                    selectedLabel="Đã chọn"
                    deselectLabel="Bỏ chọn"
                    selectLabel="Chọn"
                    :allow-empty="true"
                    :searchable="true"
                    :internal-search="false"
                    :show-no-results="false"
                    :multiple="true"
                    :close-on-select="false"
                  >
                    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
                  </multiselect>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group class="w-100">
                <b-input-group>
                  <multiselect
                    v-model="pointCodeStart"
                    :options="pointCodes"
                    placeholder="Tìm kiếm theo điểm xuất phát"
                    track-by="code"
                    label="code"
                    selectedLabel="Đã chọn"
                    deselectLabel="Bỏ chọn"
                    selectLabel="Chọn"
                    :allow-empty="true"
                    :searchable="true"
                    :internal-search="false"
                    :show-no-results="false"
                  >
                    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
                  </multiselect>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group class="w-100">
                <b-input-group>
                  <multiselect
                    v-model="pointCodeEnd"
                    :options="pointCodes"
                    placeholder="Tìm kiếm theo điểm kết thúc"
                    track-by="code"
                    label="code"
                    selectedLabel="Đã chọn"
                    deselectLabel="Bỏ chọn"
                    selectLabel="Chọn"
                    :allow-empty="true"
                    :searchable="true"
                    :internal-search="false"
                    :show-no-results="false"
                  >
                    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
                  </multiselect>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="mb-4 justify-content-center">
            <b-col md="3">
              <datepicker
                placeholder="Chọn ngày bay"
                v-model="date"
                class="from-date"
                :bootstrapStyling="true"
              />
            </b-col>
            <b-col md="3">
              <flat-pickr v-model="time" :config="timeConfig" :placeholder="!isIE ? 'Giờ bay' : null" />
            </b-col>
            <b-col md="2">
              <b-form-select v-model="pkgType" :options="pkgTypes"></b-form-select>
            </b-col>
            <b-col md="2">
              <b-form-select v-model="transportPkgType" :options="transportPkgTypes"></b-form-select>
            </b-col>
            <b-col md="2">
              <b-form-select v-model="transportPlaneType" :options="transportPlaneTypes"></b-form-select>
            </b-col>
          </b-row>
          <b-row class="mb-3 justify-content-center">
            <b-col md="3">
              <b-form-input v-model="minQuota" placeholder="Khối lượng tối thiểu"></b-form-input>
            </b-col>
            <b-col md="3">
              <b-form-input v-model="maxQuota" placeholder="Khối lượng tối đa"></b-form-input>
            </b-col>
            <b-col md="2">
              <b-form-input v-model="weight" placeholder="Khối lượng"></b-form-input>
            </b-col>
            <b-col md="2">
              <b-form-input v-model="minPrice" placeholder="Giá tối thiểu"></b-form-input>
            </b-col>
            <b-col md="2">
              <b-form-input v-model="maxPrice" placeholder="Giá tối đa"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="mb-5 justify-content-center">
            <b-col md="1">
              <b-button variant="outline-success" @click="getConfig">
                <i class="sidenav-icon ion ion-md-search"></i>Tìm Kiếm
              </b-button>
            </b-col>
            <b-col md="1">
              <b-button variant="outline-danger" @click="reset">
                <i class="sidenav-icon ion ion-md-remove-circle"></i>Reset
              </b-button>
            </b-col>
          </b-row>
        </div>
        <!-- table -->
        <b-table
          striped
          hover
          responsive
          :fields="fieldsDataConfigCheckin"
          :items="dataConfig"
          :per-page="perPage"
          :current-page="currentPage"
        >
          <template
            v-slot:cell(transport_pkg_type)="row"
          >{{ row.item.transport_pkg_type === 'default' ? 'Thường' : row.item.transport_pkg_type }}</template>
          <template
            v-slot:cell(pkg_type)="row"
          >{{ row.item.pkg_type === 'default' ? 'Thường' : row.item.pkg_type }}</template>
          <template
            v-slot:cell(transport_plane_type)="row"
          >{{ row.item.transport_plane_type === 'default' ? 'Thương mại' : row.item.transport_plane_type }}</template>
          <template v-slot:cell(time)="row">
            <div style="max-width: 400px">
              <b-button-group size="sm" class="mb-2">
                <b-button variant="success">Bắt đầu : {{row.item.time_start}}</b-button>
                <b-button variant="danger">Kết thúc : {{row.item.time_end}}</b-button>
              </b-button-group>
            </div>
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
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import VueMonthlyPicker from 'vue-monthly-picker'
import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import MultiSelectCompanyProfile from 'components/elements/common/MultiSelectCompanyProfile'
import CompanyProfileService from 'domain/services/company-profile-service'
import Moment from 'moment'
import flatPickr from 'vue-flatpickr-component'
import Datepicker from 'vuejs-datepicker'
import 'flatpickr/dist/flatpickr.css'

function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
    document.body.getAttribute('dir') === 'rtl'
}
export default {
  mounted () {
    if (typeof this.$route.params.companyId !== 'undefined') {
      this.companyId = this.$route.params.companyId
      this.getConfig()
    } else this.getAwbPrice()
    this.getAirLineCode()
    this.getPointCode()
  },
  components: {
    VueMonthlyPicker,
    LaddaBtn,
    Multiselect,
    MultiSelectCompanyProfile,
    Datepicker,
    flatPickr
  },
  data () {
    return {
      time: null,
      date: new Moment().format('YYYY-MM-DD'),
      timeConfig: {
        enableTime: true,
        noCalendar: true,
        altInput: true,
        animate: !isRTL()
      },
      companyId: [],
      airLineCodes: [],
      airLineCode: '',
      pointCodes: [],
      pointCodeStart: '',
      pointCodeEnd: '',
      perPage: 5,
      currentPage: 1,
      dataConfig: [],
      fieldsDataConfigCheckin: [
        { key: 'company_name', label: 'Tên công ty', sortable: true },
        { key: 'airline_code', label: 'Hãng hàng không', sortable: true },
        { key: 'src_code', label: 'Điểm xuất phát', sortable: true },
        { key: 'dst_code', label: 'Điểm kết thúc', sortable: true },
        { key: 'pkg_type', label: 'Loại hàng hóa', sortable: true },
        { key: 'transport_pkg_type', label: 'Loại tải', sortable: true },
        { key: 'transport_plane_type', label: 'Loại tàu bay', sortable: true },
        { key: 'min_quota', label: 'Min Quota(kg)', sortable: true },
        { key: 'max_quota', label: 'Max Quota(kg)', sortable: true },
        { key: 'hard_quota', label: 'Hard Quota(kg)', sortable: true },
        { key: 'start_date', label: 'Ngày có hiệu lực', sortable: true },
        { key: 'time', label: 'Khung giờ bay', sortable: true },
        { key: 'price', label: 'Giá', sortable: true },
        { key: 'created', label: 'Tạo lúc', sortable: true }
      ],
      pkgTypes: [
        { text: '--Chọn loại hàng--', value: null },
        { text: 'Hàng thường', value: 'default' },
        { text: 'Bưu phẩm, bưu cục', value: 'bpbk' },
        { text: 'Hàng dễ vỡ', value: 'breakable' }
      ],
      pkgType: 'default',
      transportPkgTypes: [
        { text: '--Chọn loại tải--', value: null },
        { text: 'Tải thường', value: 'default' },
        { text: 'Tải cứng', value: 'hard' }
      ],
      transportPkgType: 'default',
      transportPlaneTypes: [
        { text: '--Chọn loại tàu bay--', value: null },
        { text: 'Thương mại', value: 'default' },
        { text: 'Cargo', value: 'cargo' }
      ],
      transportPlaneType: 'default',
      minPrice: null,
      maxPrice: null,
      minQuota: null,
      maxQuota: null,
      weight: null
    }
  },
  computed: {
    rows () {
      return this.dataConfig.length || 0
    }
  },
  watch: {},
  methods: {
    async getAwbPrice () {
      let res = await CompanyProfileService.getAwbPrice()
      if (typeof res.data.data !== 'undefined') {
        commonHelper.showMessage(res.data.message, 'success')
        this.dataConfig = res.data.data
      } else commonHelper.showMessage('Có lỗi khi lấy dữ liệu')
    },
    handleChooseProfileCompany (option) {
      if (option) {
        this.companyId = option.map((value) => value.id)
      }
    },
    async getAirLineCode () {
      let res = await CompanyProfileService.getAirLineCode()
      if (typeof res.data.data !== 'undefined') {
        commonHelper.showMessage(res.data.message, 'success')
        this.airLineCodes = res.data.data
      } else commonHelper.showMessage('Có lỗi khi lấy airline code')
    },
    async getPointCode () {
      let res = await CompanyProfileService.getPointCode()
      if (typeof res.data.data !== 'undefined') {
        commonHelper.showMessage(res.data.message, 'success')
        this.pointCodes = res.data.data
      } else commonHelper.showMessage('Có lỗi khi lấy point code')
    },
    async getConfig () {
      let dataSend = {
        companyId: this.companyId,
        src: (this.pointCodeStart) instanceof Object ? this.pointCodeStart.code : null,
        des: (this.pointCodeEnd) instanceof Object ? this.pointCodeEnd.code : null,
        minWeight: this.minQuota,
        maxWeight: this.maxQuota,
        transportPkgType: this.transportPkgType,
        transportPlaneType: this.transportPlaneType,
        pkgType: this.pkgType,
        airlineCode: (this.airLineCode) instanceof Object ? this.airLineCode.map(e => e.code) : null,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        weight: this.weight,
        date: this.date,
        time: this.time
      }
      let res = await CompanyProfileService.getAwbPriceConfig(dataSend)
      if (typeof res.data.data !== 'undefined') {
        commonHelper.showMessage(res.data.message, 'success')
        this.dataConfig = res.data.data
      } else commonHelper.showMessage('Có lỗi khi lấy dữ liệu')
    },
    reset () {
      this.companyId = ''
      this.pointCodeStart = null
      this.pointCodeEnd = null
      this.transportPlaneType = 'default'
      this.transportPkgType = 'default'
      this.pkgType = 'default'
      this.minPrice = null
      this.maxPrice = null
      this.minQuota = null
      this.maxQuota = null
      this.airLineCode = ''
      this.weight = null
      this.date = null
      this.time = null
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
