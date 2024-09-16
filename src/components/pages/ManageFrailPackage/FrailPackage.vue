<template>
  <div>
    <div class="ui-block">
      <h3 class="ui-block-heading">Quản lý đơn hàng dễ vỡ</h3>
      <div>
        <b-form>
          <div class="form-filter">
            <b-form-row>
              <b-col md="6">
                <b-form-group label="Cod">
                  <select-cod-frail
                    @onChange="selectedCod"
                    ref="codFrail"
                  ></select-cod-frail>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Chọn Shop">
                  <select-shop-frail
                    @onChange="selectedShop"
                    ref="shopFrail"
                  ></select-shop-frail>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="6">
                <b-form-group label="Loại hình ảnh">
                  <multiselect
                    v-model="optionsImages"
                    placeholder="Chọn loại ảnh"
                    :options="optionsImages"
                    :multiple="false"
                    :searchable="false"
                    selectLabel=""
                    selectedLabel=""
                    :loading="false"
                    :internal-search="false"
                    :clear-on-select="true"
                    :close-on-select="true"
                    :hide-selected="true"
                    ref="imagesFrail"
                  ></multiselect>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Kho">
                  <select-station-frail
                  @onChange="selectedStation"
                  ref="stationFrail">
                  </select-station-frail>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="6">
                <b-form-group label="Loại report">
                  <multiselect
                    v-model="selected.reports"
                    label="text"
                    track-by="value"
                    placeholder="Chọn loại report"
                    :options="options_reports"
                    :multiple="false"
                    :searchable="false"
                    :loading="false"
                    selectLabel=""
                    selectedLabel=""
                    deselectLabel="x"
                    :internal-search="false"
                    :clear-on-select="true"
                    :close-on-select="true"
                    :hide-selected="false"
                    ref="reportFrail"
                  ></multiselect>
                </b-form-group>
              </b-col>
              <b-col md="3">
                <b-form-group label="Từ:">
                  <datepicker
                    v-model="selected.fromDate"
                    :bootstrapStyling="true"
                    :format="customFormatter"
                    class="from-date"
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
                    v-on:selected="dateSelectedToInChild"
                    v-bind:disabled="inputDisable"
                    placeholder="Chọn ngày"
                    ref="toDate"
                  />
                </b-form-group>
              </b-col>
            </b-form-row>
           <b-form-row class="cfButton">
              <b-button variant="light" class=" b1" type="reset" @click="resetForm"
                >Làm lại</b-button
              >
              <ladda-btn
                :loading="loadingButton"
                @click.native="searchFrailPackage(dataPage.currentPage, true)"
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
            <div no-body v-if="dataLogs.length > 0">
              <div class="form-filter mt-3">
                <b-form-row>
                  <b-col md="12">
                    <b-card>
                      <!-- / Table controls -->
                      <div class="table-result">
                        <!-- Table -->
                        <ul class="deck-list d-flex flex-wrap">
                          <li class="card border p-1" v-for="(product) in dataLogs" :key="product.product_id">
                            <b-img
                              v-if="product.IsfragePackageImage"
                              width="180"
                              height="180"
                              class="card-img-top cursor-pointer"
                              :src="product.IsfragePackageImage.image_url"
                              alt="Không có ảnh"
                              @click="openModalImage(product)"
                            />
                            <b-img v-else
                              width="180"
                              height="180"
                              class="card-img-top"
                              alt="Không có ảnh"
                            ></b-img>
                            <div class="card-body">
                              <h5 class="card-title">{{ product.Cod.fullname }}</h5>
                              <div class="card-text">Loại: Ảnh gia cố</div>
                              <div class="card-text">Mã COD: {{product.Cod.cod_alias}}</div>
                              <div class="card-text">ĐH: <a :href="`https://admin.giaohangtietkiem.vn/admin/AdPackages/index?alias=` + product.RpDbPackage.order" target="_blank">{{ product.RpDbPackage.order }}</a></div>
                              <div class="card-text">Ngày chụp: {{ product.IsfragePackageImage.created }}</div>
                              <div class="card-text">
                              <span v-if="product.ReportFrageImage.status ==null"></span>
                              <span style="color:red;" v-else>Ảnh đơn hàng đã được
                              <span v-if="product.ReportFrageImage.status ==1">báo xấu</span>
                              <span v-if="product.ReportFrageImage.status ==2">duyệt</span>
                              <span v-if="product.ReportFrageImage.status ==3">thẻ đỏ</span>
                              <span v-if="product.ReportFrageImage.status ==4">thẻ vàng</span>
                              bởi {{product.User.username}}</span>
                              </div>
                            </div>
                            <div class="card-footer text-center">
                                  <div v-for="(item,index) in type" :key="index">
                                  <b-button v-if="item.value != product.ReportFrageImage.status" size="sm" :variant="item.color" class="buttonSelect" @click.prevent="editFrailPackage(product.IsfragePackageImage.id, item.value) ">
                                  {{item.text}}
                                </b-button>
                                </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </b-card>
                  </b-col>
                </b-form-row>
              </div>
            </div>
            <div class="no-data" v-if="dataLogs.length == 0">
              <b-alert show dismissible variant="warning">
                <i class="sidenav-icon ion ion-ios-warning"></i>
                Không có dữ liệu phù hợp, vui lòng thử lại.
              </b-alert>
            </div>
          </div>
        </b-form>
        <b-card-body class="pt-0 pb-3">
          <div class="row">
            <div class="col-md-12 pt-3 element">
              <div>
                Tổng số bản ghi: {{ dataPage.totalItems }}
                <b-pagination
                  style="z-index: 0;"
                  :total-rows="dataPage.totalItems"
                  v-model="dataPage.currentPage"
                  :per-page="dataPage.perPage"
                  v-on:change="pageChanged"
                />
              </div>
              <div class="select">
                <span class="text-muted" v-if="dataPage.totalItems"
                  >Trang {{ dataPage.currentPage }} trên {{ totalPages }}</span
                >
              </div>
              <div>
                <b-form-select
                  v-model="dataPage.perPage"
                  :options="options_perPage"
                  v-on:change="pageChangedForSel"
                ></b-form-select>
              </div>
            </div>
          </div>
        </b-card-body>
      </div>
      <b-modal
        ref="showImageModal"
        title="Ảnh sản phẩm"
        hide-footer
      >
        <vueper-slides
          ref="vueperslides1"
          :touchable="false"
          fade
          :autoplay="false"
          :bullets="false"
          @slide="$refs.vueperslides2.goToSlide($event.currentSlide.index, { emit: false })"
          fixed-height="500px">
          <vueper-slide
            :image="slides">
          </vueper-slide>
        </vueper-slides>
      </b-modal>
      <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
    </div>
  </div>
</template>

<script>
import FrailPackageService from 'domain/services/frail-package-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import Multiselect from 'vue-multiselect'
import SelectCodFrail from 'components/elements/FilterBox/SelectCodFrail'
import SelectShopFrail from 'components/elements/FilterBox/SelectShopFrail'
import SelectStationFrail from 'components/elements/FilterBox/SelectStationFrail'
import FrailPackage from 'domain/entities/FrailPackage'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import * as _ from 'lodash'
import datepicker from 'vuejs-datepicker'
import moment from 'moment'
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'
export default {
  data () {
    return {
      optionsImages: ['Ảnh gia cố'],
      options_reports: FrailPackage.optionsReport,
      options_perPage: FrailPackage.optionsPerpage,
      inputDisable: false,
      slides: [],
      image: [],
      typeReport: '',
      type: [
        {value: '1', text: 'Báo xấu', color: 'secondary'},
        {value: '2', text: 'Duyệt', color: 'success'},
        {value: '3', text: 'Thẻ đỏ', color: 'danger'},
        {value: '4', text: 'Thẻ vàng', color: 'warning'}
      ],
      dataLogs: [],
      selected: {
        regions: [],
        images: 'Ảnh gia cố',
        reports: '',
        fromDate: '',
        toDate: ''
      },
      dataPage: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        perPage: 25
      },
      dataInput: {
        shops: [],
        cods: [],
        station: []
      },
      loadingButton: false,
      appLoading: false,
      checkResult: false
    }
  },
  methods: {
    searchFrailPackage (page, newSearchConditions) {
      this.appLoading = true
      let params = {}
      if (this.selected.fromDate) {
        params['from_date'] = moment(this.selected.fromDate).format('YYYY-MM-DD') + ' ' + '00:00:00'
      }
      if (this.selected.toDate) {
        params['to_date'] = moment(this.selected.toDate).format('YYYY-MM-DD') + ' ' + '23:59:59'
      }
      params['image_status'] = this.selected.reports.value
      params['shop_id'] = this.dataInput.shops
      params['cod_id'] = this.dataInput.cods
      params['station_id'] = this.dataInput.station
      if (newSearchConditions) {
        this.dataPage.currentPage = 1
        params.page = 1
        this.loadingButton = true
      }
      params['page'] = this.dataPage.currentPage
      params['limit'] = this.dataPage.perPage
      if (params['image_status'] === '6') {
        params['image_status'] = ''
      }
      FrailPackageService.search(params).then((response) => {
        if (response.data.success) {
          this.checkResult = response.data.success
          this.dataPage.totalItems = response.data.total
          response = response.data.data
          this.dataLogs = response
          this.typeReport = this.selected.reports.value
          this.offLoading()
        } else {
          commonHelper.showMessage('Đã có lỗi xảy ra', 'error')
          this.offLoading()
        }
      }).catch((e) => {
        console.log(e)
        commonHelper.showMessage('Đã có lỗi xảy ra', 'error')
        this.offLoading()
      })
    },
    editFrailPackage (imageId, statusId) {
      if (!confirm('Bạn có chắc chắn muốn xác nhận?')) return
      const dataEdit = {
        image_id: imageId,
        status_id: statusId
      }
      FrailPackageService.edit(dataEdit).then((res) => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'error')
        }
      }).catch((e) => {
        commonHelper.showMessage('Đã có lỗi xảy ra', 'error')
        console.log(e)
      })
    },
    openModalImage (product) {
      this.slides = product.IsfragePackageImage.image_url
      this.$refs.showImageModal.show()
    },
    selectedShop (option) {
      if (!_.isNil(option)) {
        this.dataInput.shops = option.id
      }
    },
    selectedCod (option) {
      if (!_.isNil(option)) {
        this.dataInput.cods = option.id
      }
    },
    selectedStation (option) {
      if (!_.isNil(option)) {
        this.dataInput.station = _.map(option, 'id')
      }
    },
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    dateSelectedToInChild: function (date) {
      this.to = date
    },
    dateSelectedFromInChild: function (date) {
      this.from = date
    },
    pageChanged (page) {
      // Event check pagination change
      this.dataPage.currentPage = page
      this.searchFrailPackage()
    },
    pageChangedForSel () {
    // Event check pagination change
      this.dataPage.currentPage = 1
      this.searchFrailPackage()
    },
    offLoading () {
      this.appLoading = false
      this.loadingButton = false
    },
    resetForm () {
      this.selected.regions = ''
      this.selected.images = ''
      this.selected.reports = ''
      this.selected.fromDate = ''
      this.selected.toDate = ''
      this.$refs.codFrail.resetValue()
      this.$refs.shopFrail.resetValue()
      this.$refs.stationFrail.resetValue()
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.dataPage.totalItems / this.dataPage.perPage)
    }
  },
  components: {
    datepicker,
    SelectCodFrail,
    SelectShopFrail,
    SelectStationFrail,
    LoadingMiniBottom,
    LaddaBtn,
    Multiselect,
    VueperSlides,
    VueperSlide
  }
}
</script>

<style scoped>
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
.element {
  display: flex;
  justify-content: space-between;
}
* {
  font-family: inherit;
}
.notification-content {
  font-size: 15px;
  font-family: inherit;
}
.bcenter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.position {
  position: relative;
}
.deck-list li {
  margin-bottom: 2rem;
  margin-right: 2rem;
  width: 24vh;
}
.deck-list li .card-body {
  overflow-y: hidden;
  font-size: 13px;
}
.thumbnails {
  margin: auto;
  max-width: 300px;
}
.thumbnails .vueperslide {
  box-sizing: border-box;
  border: 1px solid #fff;
  transition: 0.3s ease-in-out;
  opacity: 0.7;
  cursor: pointer;
}
.thumbnails .vueperslide--active {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
  opacity: 1;
  border-color: #000;
}
.page-item.active .page-link {
    z-index: 0;
}
</style>
