<template>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <b-col cols="6">
          <h4 class="pt-1 text-info">Quản Lý Coupons Của XTeam</h4>
          <b-form-group
            class="m-0"
            label="Đối tượng quản lý"
            v-slot="{ ariaDescribedby }"
          >
            <b-form-radio-group
              id="btn-radios-2"
              v-model="groupType"
              :options="options"
              :aria-describedby="ariaDescribedby"
              button-variant="outline-primary"
              size="sm"
              name="radio-btn-outline"
              buttons
            ></b-form-radio-group>
          </b-form-group>
        </b-col>
      </b-row>
      <hr>
      <div class="m-0" v-if="groupType==0">
        <div>
          <div>
            <b-modal id="modal-1" v-if="showModal" @close="showModal = true" :hide-footer="true"
                     :hide-header="true">
              <form id="app2" method="post">
                <div class="row">
                  <div class="col-md-12">
                    <label class="form-label d-none d-md-block">Quận:</label>
                    <b-input type="text" v-model="districtName" placeholder="" disabled/>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label d-none d-md-block">Coupon</label>
                    <b-form-select v-model="selectedCoupon" :options="optionCouponsOfDistrict"></b-form-select>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label d-none d-md-block">Hệ số</label>
                    <b-input type="text" v-model="factor" placeholder="" disabled/>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label d-none d-md-block">Start time</label>
                    <b-input type="text" v-model="startTime" placeholder="" disabled/>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label d-none d-md-block">End time</label>
                    <b-input type="text" v-model="endTime" placeholder="" disabled/>
                  </div>
                  <div class="col-md-12">
                    <b-form-group class="" label="Ngày bắt đầu">
                      <datepicker
                        v-model="startDate"
                        :format="customFormatter"
                        :bootstrapStyling="true"
                        :monday-first="true"
                        :full-month-name="true"
                        :calendar-button="true"
                        calendar-button-icon="ion ion-md-calendar"
                        :clear-button="true"
                      />
                    </b-form-group>
                  </div>
                  <div class="col-md-12">
                    <b-form-group class="" label="Ngày kết thúc">
                      <datepicker
                        v-model="endDate"
                        :format="customFormatter"
                        :bootstrapStyling="true"
                        :monday-first="true"
                        :full-month-name="true"
                        :calendar-button="true"
                        calendar-button-icon="ion ion-md-calendar"
                        :clear-button="true"
                      />
                    </b-form-group>
                  </div>
                </div>
                <br>
              </form>
              <br>
              <div class="mb-4 text-center">
                <b-btn type="button" class="btn btn-primary pl-4 pr-4" @click="updateDistrict">Sửa</b-btn>
                <b-btn type="button" @click="$bvModal.hide('modal-1')">Đóng</b-btn>
              </div>
            </b-modal>
          </div>
          <b-row>
            <b-col cols="4">
              <b-form-group
                label="Chọn thành phố"
                v-slot="{ ariaDescribedby }"
              >
                <multiselect
                  v-model="valueProvinces"
                  tag-placeholder="Tất cả"
                  placeholder="Mặc định là tất cả" label="name"
                  track-by="code"
                  :options="optionsProvinces"
                  :close-on-select="false"
                  :multiple="true"
                  :taggable="true"
                  @tag="addTag">
                </multiselect>
              </b-form-group>
            </b-col>
            <b-col cols="4">
              <b-form-group
                label="Chọn quận"
                v-slot="{ ariaDescribedby }"
              >
                <multiselect
                  v-model="valueDistricts"
                  tag-placeholder=""
                  placeholder="Tất cả" label="nameDistrict"
                  track-by="codeDistrict"
                  :options="optionsDistricts"
                  :close-on-select="false"
                  :multiple="true"
                  :taggable="true"
                  @tag="addTagDistrict">
                </multiselect>
              </b-form-group>
            </b-col>
            <b-col cols="4">
              <b-form-group
                label="Chọn coupons"
                v-slot="{ ariaDescribedby }"
              >
                <multiselect
                  v-model="valueCoupons"
                  tag-placeholder=""
                  placeholder="Coupon" label="nameCoupons"
                  track-by="codeCoupons"
                  :options="optionsCoupons"
                  :close-on-select="false"
                  :multiple="true"
                  :taggable="true"
                  @tag="addTagCoupons">
                </multiselect>
              </b-form-group>
            </b-col>
          </b-row>
          <hr>
          <b-row>
            <b-col cols="4">
              <b-form-group class="" label="Ngày bắt đầu">
                <datepicker
                  v-model="fromDistrict"
                  :format="customFormatter"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
                />
              </b-form-group>
            </b-col>
            <b-col cols="4">
              <b-form-group class="" label="Ngày kết thúc">
                <datepicker
                  v-model="toDistrict"
                  :format="customFormatter"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
                />
              </b-form-group>
            </b-col>
            <b-col cols="4" class="">
              <b-button class="mr-2 mt-4 " variant="outline-primary" @click="loadCouponsDistricts">Tìm kiếm
              </b-button>
              <b-button class="mr-2 mt-4" variant="outline-success" @click="addCouponsDistricts">Thêm mới coupons cho
                quận
              </b-button>
            </b-col>
          </b-row>
        </div>
        <b-card-body >
          <b-table
            id="my-table"
            class="table-file-mechanism text-center"
            :items="listDistrict"
            :fields="fields"
            :per-page="perPage"
            :current-page="currentPage"
            responsive
            striped
            hover
          >
            <template v-slot:head(id)="data">
              <span class="text-primary">{{ data.label }}</span>
            </template>
            <template v-slot:head(district_name)="data">
              <span class="text-success">{{ data.label }}</span>
            </template>
            <template v-slot:head(from_district)="data">
              <span class="text-success">{{ data.label }}</span>
            </template>
            <template v-slot:head(to_district)="data">
              <span class="text-success">{{ data.label }}</span>
            </template>
            <template v-slot:head(coupon_name)="data">
              <span class="text-danger">{{ data.label }}</span>
            </template>
            <template v-slot:head(factor)="data">
              <span class="text-danger">{{ data.label }}</span>
            </template>
            <template v-slot:head(from_coupon)="data">
              <span class="text-danger">{{ data.label }}</span>
            </template>
            <template v-slot:head(to_coupon)="data">
              <span class="text-danger">{{ data.label }}</span>
            </template>
            <template v-slot:head(option)="data">
              <span class="text-info">{{ data.label }}</span>
            </template>
            <template v-slot:cell(option)="data">
              <b-btn variant="outline-success borderless icon-btn" class="btn-sm"
                     v-on:click="showItem(data.item)"><i class="ion ion-md-create"></i></b-btn>
              <b-btn variant="outline-danger borderless icon-btn" class="btn-sm"
                     v-on:click="deleteCouponDistrict(data.item.id)"><i
                class="ion ion-md-close"></i>
              </b-btn>
            </template>
          </b-table>
          <b-pagination
            v-if="rows > perPage"
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
          ></b-pagination>
        </b-card-body>
      </div>
      <div class="m-0" v-if="groupType==1">
        <div>
          <div>
            <b-modal id="modal-1" v-if="showModal" @close="showModal = true" :hide-footer="true"
                     :hide-header="true">
              <form id="app3" method="post">
                <div class="row">

                  <div class="col-md-12">
                    <label class="form-label d-none d-md-block">Coupon</label>
                    <b-input type="text" v-model="editCouponName" placeholder="" />
                  </div>
                  <div class="col-md-12">
                    <label class="form-label d-none d-md-block">Hệ số</label>
                    <b-input type="number" min="0" v-model="editCouponFactor" placeholder="" />
                  </div>
                  <div class="col-md-12">
                    <b-form-group class="" label="Thời gian bắt đầu">
                      <b-form-input  type="time" v-model="editCouponFrom"></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="col-md-12">
                    <b-form-group class="" label="Thời gian kết thúc">
                      <b-form-input  type="time" v-model="editCouponTo"></b-form-input>
                    </b-form-group>
                  </div>
                </div>
                <br>
              </form>
              <br>
              <div class="mb-4 text-center">
                <b-btn type="button" class="btn btn-primary pl-4 pr-4" @click="updateCoupon">Sửa</b-btn>
                <b-btn type="button" @click="$bvModal.hide('modal-1')">Đóng</b-btn>
              </div>
            </b-modal>
          </div>
          <b-row>
            <b-col cols="4">
                <label class="form-label d-none d-md-block">Coupon name</label>
                <b-input type="text" v-model="nameCouponConfig" placeholder="name"/>
            </b-col>
            <b-col cols="2">
                <label class="form-label d-none d-md-block">Hệ số lương</label>
                <b-input type="number" min="0" v-model="factorCouponConfig" placeholder="number"/>
            </b-col>
            <b-col cols="3">
              <b-form-group class="" label="Thời gian bắt đầu">
                <b-form-input  type="time" v-model="startTimeCoupon"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <b-form-group class="" label="Thời gian kết thúc">
                <b-form-input  type="time" v-model="endTimeCoupon"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="float-right m-3">
            <b-button class="mr-2 mt-4 " variant="outline-success" @click="addCoupon">Thêm mới coupon
            </b-button>
          </b-row>
        </div>
        <b-card-body >
          <div class="row">
            <b-input size="sm" placeholder="Search..." class="d-inline-block float-sm-left w-25 margin-top-10"
                     @input="filter($event)"/>
          </div>
          <b-table
            id="my-table"
            class="table-file-mechanism text-center"
            :items="listCouponsActive"
            :fields="fieldsCoupons"
            :per-page="perPage"
            :current-page="currentPageCoupon"
            responsive
            striped
            hover
          >
            <template v-slot:head(id)="data">
              <span class="text-primary">{{ data.label }}</span>
            </template>
            <template v-slot:head(name)="data">
              <span class="text-danger">{{ data.label }}</span>
            </template>
            <template v-slot:head(factor)="data">
              <span class="text-success">{{ data.label }}</span>
            </template>
            <template v-slot:head(from)="data">
              <span class="text-danger">{{ data.label }}</span>
            </template>
            <template v-slot:head(to)="data">
              <span class="text-danger">{{ data.label }}</span>
            </template>
            <template v-slot:head(option)="data">
              <span class="text-info">{{ data.label }}</span>
            </template>
            <template v-slot:cell(option)="data">
              <b-btn variant="outline-success borderless icon-btn" class="btn-sm"
                     v-on:click="showItem(data.item)"><i class="ion ion-md-create"></i></b-btn>
              <b-btn variant="outline-danger borderless icon-btn" class="btn-sm"
                     v-on:click="deleteCoupon(data.item.id)"><i
                class="ion ion-md-close"></i>
              </b-btn>
            </template>
          </b-table>
          <b-pagination
            v-if="rows > perPage"
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
          ></b-pagination>
        </b-card-body>
      </div>
    </b-card-body>
  </b-card>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped>
</style>

<script>
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import couponsXTeamService from 'domain/services/coupons-x-team-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Datepicker from 'vuejs-datepicker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'show-coupon-x-team',

  components: {
    Multiselect,
    Datepicker,
    flatPickr,
    VueMonthlyPicker,
    Moment,
    commonHelper
  },
  data () {
    return {
      groupType: '0',
      options: [
        { text: 'District', value: '0' },
        { text: 'Coupons', value: '1' }
      ],
      fields: [
        {
          key: 'id',
          label: 'ID',
          sortable: true
        },
        {
          key: 'district_name',
          label: 'District',
          sortable: true
        },
        {
          key: 'from_district',
          label: 'Start date',
          sortable: true
        },
        {
          key: 'to_district',
          label: 'End date',
          sortable: true
        },
        {
          key: 'coupon_name',
          label: 'Coupon',
          sortable: true
        },
        {
          key: 'factor',
          label: 'Factor',
          sortable: true
        },
        {
          key: 'from_coupon',
          label: 'Start time',
          sortable: true
        },
        {
          key: 'to_coupon',
          label: 'End time',
          sortable: true
        },
        {
          key: 'option',
          label: 'Option',
          sortable: true
        }
      ],
      perPage: 20,
      currentPage: 1,
      listDistrict: [],
      rows: 1,
      salaryMonth: new Moment(),
      valueProvinces: [],
      optionsProvinces: [],
      provincesId: [],
      valueDistricts: [],
      optionsDistricts: [],
      districtsId: [],
      valueCoupons: [],
      optionsCoupons: [],
      couponsId: [],
      fromDistrict: '',
      toDistrict: '',
      message: '',
      showModal: true,
      districtName: '',
      districtId: '',
      couponName: '',
      factor: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      optionCouponsOfDistrict: [],
      selectedCoupon: null,
      updateId: '',
      fieldsCoupons: [
        {
          key: 'id',
          label: 'ID',
          sortable: true
        },
        {
          key: 'name',
          label: 'Coupon',
          sortable: true
        },
        {
          key: 'factor',
          label: 'Factor',
          sortable: true
        },
        {
          key: 'from',
          label: 'Start time',
          sortable: true
        },
        {
          key: 'to',
          label: 'End time',
          sortable: true
        },
        {
          key: 'option',
          label: 'Option',
          sortable: true
        }
      ],
      listCouponsActive: [],
      currentPageCoupon: 1,
      startTimeCoupon: '',
      endTimeCoupon: '',
      nameCouponConfig: '',
      factorCouponConfig: 0,
      searchKeys: ['id', 'factor', 'name', 'from', 'to'],
      originalArticlesData: '',
      editCouponId: '',
      editCouponName: '',
      editCouponFactor: '',
      editCouponFrom: null,
      editCouponTo: null
    }
  },
  created () {
    this.loadProvinces()
    this.loadCoupons()
    this.loadCouponsDistricts()
  },
  watch: {
    groupType () {
      this.currentPage = 1
      if (this.groupType < 1) {
        this.rows = this.listDistrict.length
      } else {
        this.rows = this.listCouponsActive.length
      }
    },
    valueProvinces () {
      return this.LoadDistricts()
    },
    selectedCoupon () {
      this.optionCouponsOfDistrict.forEach(element => {
        if (this.selectedCoupon === element.value) {
          this.factor = element.factor
          this.startTime = element.from
          this.endTime = element.to
        }
      })
    }
  },
  methods: {
    filter (value) {
      const val = value.toLowerCase()
      if (this.originalArticlesData === '') {
        this.originalArticlesData = this.listCouponsActive
      }
      const filtered = this.originalArticlesData.filter(d => {
        return Object.keys(d)
          .filter(k => this.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      })
      this.listCouponsActive = filtered
    },
    formatInput () {
      this.valueProvinces = []
      this.optionsProvinces = []
      this.message = ''
      this.currentPage = 1
    },
    customFormatter (date) {
      return Moment(date).format('YYYY-MM-DD')
    },
    addTag (newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.optionsProvinces.push(tag)
      this.valueProvinces.push(tag)
    },
    addTagDistrict (newTag) {
      const tag = {
        nameDistrict: newTag,
        codeDistrict: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.optionsDistricts.push(tag)
      this.valueDistricts.push(tag)
    },
    addTagCoupons (newTag) {
      const tag = {
        nameCoupons: newTag,
        codeCoupons: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.optionsCoupons.push(tag)
      this.valueCoupons.push(tag)
    },
    loadCoupons () {
      couponsXTeamService.getAllCoupons().then(res => {
        if (res.data.success) {
          this.optionsCoupons = []
          this.valueCoupons = []
          this.originalArticlesData = ''
          this.optionCouponsOfDistrict = []
          this.listCouponsActive = []
          res.data.data.forEach(element => {
            this.optionsCoupons.push({
              nameCoupons: element.name + ': ' + element.factor + ' (' + element.from + ' - ' + element.to + ')',
              codeCoupons: element.id
            })
            this.optionCouponsOfDistrict.push({
              value: element.id,
              text: element.name,
              factor: element.factor,
              from: element.from,
              to: element.to
            })
            this.listCouponsActive.unshift({
              id: element.id,
              name: element.name,
              factor: element.factor,
              from: element.from,
              to: element.to
            })
          })
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    loadProvinces () {
      couponsXTeamService.getAllProvinces().then(res => {
        if (res.data.success) {
          this.optionsProvinces = []
          this.valueProvinces = []
          Object.entries(res.data.data).forEach(([key, value]) => {
            this.optionsProvinces.push({
              name: value,
              code: key
            })
          })
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    LoadDistricts () {
      this.provincesId = []
      this.valueProvinces.forEach(element =>
        this.provincesId.push(element.code)
      )
      let param = {
        province_id: this.provincesId
      }
      couponsXTeamService.getAllDistricts(param).then(res => {
        if (res.data.success) {
          this.optionsDistricts = []
          this.valueDistricts = []
          Object.entries(res.data.data).forEach(([key, value]) => {
            this.optionsDistricts.push({
              nameDistrict: value,
              codeDistrict: key
            })
          })
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    loadCouponsDistricts () {
      this.districtsId = []
      this.valueDistricts.forEach(element =>
        this.districtsId.push(element.codeDistrict)
      )
      this.couponsId = []
      this.valueCoupons.forEach(element =>
        this.couponsId.push(element.codeCoupons)
      )
      let param = {
        districts_id: this.districtsId,
        coupons_id: this.couponsId,
        from: (this.fromDistrict) ? this.customFormatter(this.fromDistrict) : null,
        to: (this.toDistrict) ? this.customFormatter(this.toDistrict) : null
      }
      if (param.from === null) {
        param.to = null
      }
      if (param.to !== null && param.from > param.to) {
        return commonHelper.showMessage('Thời gian bắt đầu lớn hơn kết thúc', 'failed')
      }
      couponsXTeamService.loadCouponsDistricts(param).then(res => {
        if (res.data.success) {
          this.currentPage = 1
          this.listDistrict = []
          res.data.data.forEach(element => {
            this.listDistrict.unshift({
              id: element.ErpCouponsXTeamDistrict.id,
              district_name: element.ErpAdress.name,
              coupon_name: element.ErpCouponsXTeam.name,
              factor: element.ErpCouponsXTeam.factor,
              from_district: element.ErpCouponsXTeamDistrict.from,
              to_district: element.ErpCouponsXTeamDistrict.to,
              from_coupon: element.ErpCouponsXTeam.from,
              to_coupon: element.ErpCouponsXTeam.to,
              coupon_id: element.ErpCouponsXTeamDistrict.coupon_id,
              district_id: element.ErpCouponsXTeamDistrict.district_id
            })
          })
          this.rows = this.listDistrict.length
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    showItem (item) {
      this.districtId = item.district_id
      this.districtName = item.district_name
      this.startDate = item.from_district
      this.endDate = item.to_district
      this.selectedCoupon = item.coupon_id
      this.updateId = item.id
      this.editCouponId = item.id
      this.editCouponName = item.name
      this.editCouponFactor = item.factor
      this.editCouponFrom = item.from
      this.editCouponTo = item.to
      this.$bvModal.show('modal-1')
    },
    addCouponsDistricts () {
      let param = {
        district_id: [],
        coupon_id: [],
        from: (this.fromDistrict) ? this.customFormatter(this.fromDistrict) : null,
        to: (this.toDistrict) ? this.customFormatter(this.toDistrict) : null
      }
      this.valueDistricts.forEach(element =>
        param.district_id.push(element.codeDistrict)
      )
      if (param.district_id.length === 0) {
        this.optionsDistricts.forEach(element =>
          param.district_id.push(element.codeDistrict)
        )
      }
      this.valueCoupons.forEach(element =>
        param.coupon_id.push(element.codeCoupons)
      )
      if (param.from === null || param.district_id.length === 0 || param.coupon_id.length === 0) {
        return commonHelper.showMessage('Thiếu thông tin truyền lên', 'failed')
      }
      if (param.to !== null && param.from > param.to) {
        return commonHelper.showMessage('Thời gian bắt đầu lớn hơn kết thúc', 'failed')
      }
      couponsXTeamService.addCouponsDistricts(param).then(res => {
        if (res.data.success) {
          this.valueCoupons = []
          this.valueDistricts = []
          this.fromDistrict = ''
          this.toDistrict = ''
          this.loadCouponsDistricts()
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    deleteCouponDistrict (id) {
      let param = {
        id: id
      }
      let r = confirm('Bạn có chắc chắn muốn xóa bản ghi')
      if (r === false) {
        return null
      }
      couponsXTeamService.deleteCouponDistrict(param).then(res => {
        if (res.data.success) {
          this.valueCoupons = []
          this.valueDistricts = []
          this.fromDistrict = ''
          this.toDistrict = ''
          this.loadCouponsDistricts()
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    updateDistrict () {
      let param = {
        id: this.updateId,
        district_id: this.districtId,
        coupon_id: this.selectedCoupon,
        from: (this.startDate) ? this.customFormatter(this.startDate) : null,
        to: (this.endDate) ? this.customFormatter(this.endDate) : null
      }
      if (param.to !== null && param.from > param.to) {
        return commonHelper.showMessage('Thời gian bắt đầu lớn hơn kết thúc', 'failed')
      }
      couponsXTeamService.updateDistrict(param).then(res => {
        if (res.data.success) {
          this.valueCoupons = []
          this.valueDistricts = []
          this.fromDistrict = ''
          this.toDistrict = ''
          this.loadCouponsDistricts()
          this.$bvModal.hide('modal-1')
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    addCoupon () {
      let param = {
        name: this.nameCouponConfig,
        factor: this.factorCouponConfig,
        from: (this.startTimeCoupon) ? (this.startTimeCoupon + ':00') : null,
        to: (this.endTimeCoupon) ? (this.endTimeCoupon + ':00') : null
      }
      param.from = param.from.slice(0, 8)
      param.to = param.to.slice(0, 8)
      if (param.from === null || param.to === null || param.name === '' || param.factor === 0) {
        return commonHelper.showMessage('Thiếu thông tin truyền lên', 'failed')
      }
      if (param.from >= param.to) {
        return commonHelper.showMessage('Thời gian bắt đầu lớn hơn kết thúc', 'failed')
      }
      couponsXTeamService.addCoupon(param).then(res => {
        if (res.data.success) {
          this.nameCouponConfig = ''
          this.factorCouponConfig = 0
          this.startTimeCoupon = ''
          this.endTimeCoupon = ''
          this.listCouponsActive = []
          this.loadCoupons()
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    deleteCoupon (id) {
      let param = {
        id: id
      }
      let r = confirm('Bạn có chắc chắn muốn xóa bản ghi')
      if (r === false) {
        return null
      }
      couponsXTeamService.deleteCoupon(param).then(res => {
        if (res.data.success) {
          this.nameCouponConfig = ''
          this.factorCouponConfig = 0
          this.startTimeCoupon = ''
          this.endTimeCoupon = ''
          this.listCouponsActive = []
          this.loadCoupons()
          this.loadCouponsDistricts()
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    updateCoupon () {
      let param = {
        id: this.editCouponId,
        name: this.editCouponName,
        factor: this.editCouponFactor,
        from: (this.editCouponFrom) ? (this.editCouponFrom + ':00') : null,
        to: (this.editCouponTo) ? (this.editCouponTo + ':00') : null
      }
      param.from = param.from.slice(0, 8)
      param.to = param.to.slice(0, 8)
      if (param.from === null || param.to === null || param.name === '' || param.factor === 0) {
        return commonHelper.showMessage('Thiếu thông tin truyền lên', 'failed')
      }
      if (param.from >= param.to) {
        return commonHelper.showMessage('Thời gian bắt đầu lớn hơn kết thúc', 'failed')
      }
      couponsXTeamService.updateCoupon(param).then(res => {
        if (res.data.success) {
          this.nameCouponConfig = ''
          this.factorCouponConfig = 0
          this.startTimeCoupon = ''
          this.endTimeCoupon = ''
          this.listCouponsActive = []
          this.loadCoupons()
          this.$bvModal.hide('modal-1')
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>
