<template>
  <div>
    <div class="ui-block">
      <h3 class="ui-block-heading text-center">Quản Lý Hình Ảnh Đơn Hàng</h3>
      <div>
        <b-form>
          <div class="form-filter">
            <b-form-row>
              <b-col md="6">
                <b-form-group label="Shop">
                  <multi-select-shop
                    @onChange="selectedShop"
                    ref="shopComponent"
                  ></multi-select-shop>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Kho">
                  <multi-select-station-by-type-post-office
                    @onChange="selectedStation"
                    ref="stationComponent"
                  ></multi-select-station-by-type-post-office>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="6">
                <b-form-group label="Tên/Mã">
                  <b-input type="text" placeholder="Nhập tên hoặc mã sản phẩm" v-model="dataInput.name" />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Trạng thái kiểm duyệt">
                  <multiselect
                    v-model="dataInput.censorship_status"
                    label="text"
                    track-by="value"
                    placeholder="Chọn trạng thái kiểm duyệt"
                    :options="options.censorship_status"
                    :multiple="true"
                    :searchable="false"
                    :loading="false"
                    :internal-search="false"
                    :clear-on-select="true"
                    :close-on-select="true"
                    :hide-selected="true"
                    ref="censorshipStatusInput"
                  ></multiselect>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="6">
                <b-form-group label="Thuộc tính sản phẩm">
                  <multiselect
                    v-model="dataInput.attribute_product"
                    label="text"
                    track-by="value"
                    placeholder="Chọn thuộc tính sản phẩm"
                    :options="options.attribute_product"
                    :multiple="true"
                    :searchable="false"
                    :loading="false"
                    :internal-search="false"
                    :clear-on-select="true"
                    :close-on-select="true"
                    :hide-selected="true"
                    ref="attributeProductInput"
                  ></multiselect>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Thuộc tính hệ thống">
                  <multiselect
                    v-model="dataInput.property_system"
                    label="text"
                    track-by="value"
                    placeholder="Chọn thuộc tính hệ thống"
                    :options="options.property_system"
                    :multiple="true"
                    :searchable="false"
                    :loading="false"
                    :internal-search="false"
                    :clear-on-select="true"
                    :close-on-select="true"
                    :hide-selected="true"
                    ref="propertySystemInput"
                  ></multiselect>
                </b-form-group>
              </b-col>
            </b-form-row>
            <div class="text-center">
              <b-button @click="resetForm" class="btn btn-z-index">Nhập lại</b-button>
              <ladda-btn
                :loading="loadingButton"
                @click.native="searchProduct(dataPage.currentPage, true)"
                data-style="zoom-out"
                class="btn btn-success btn-z-index">
                <i class="sidenav-icon ion ion-md-search"></i>
                Tìm kiếm
              </ladda-btn>
            </div>
          </div>
        </b-form>
        <div class="mt-3 result" v-if="checkResult === 1">
          <b-card no-body v-if="productsResponse.length > 0">
            <!-- / Table controls -->
            <div class="table-result">
              <!-- Pagination -->
              <b-card-body class="pt-0 pb-3">
                <div class="row">
                  <div class="col-sm pt-3">
                    <b-pagination :total-rows="dataPage.totalItems"
                                  v-model="dataPage.currentPage"
                                  :per-page="dataPage.perPage"
                                  v-on:change="pageChanged"
                    />
                    Tổng số sản phẩm: {{ dataPage.totalItems }}
                  </div>
                  <div class="col-sm text-sm-left text-center pt-4">
                    <span class="text-muted" v-if="dataPage.totalItems">Trang {{ dataPage.currentPage }} trên {{ totalPages }}</span>
                  </div>
                </div>
              </b-card-body>
              <!-- / Pagination -->

              <!-- Content -->
              <ul class="deck-list d-flex flex-wrap">
                <li class="card border p-1" v-for="(product) in productsResponse" :key="product.product_id">
                  <b-img
                    v-if="product.images.length > 0"
                    width="180"
                    height="180"
                    class="card-img-top cursor-pointer"
                    :src="product.images[0].image"
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
                    <h5 class="card-title">{{ product.full_name }}</h5>
                    <div class="card-text">Code: {{ product.code }}</div>
                    <div class="card-text">Sku: {{ product.sku }}</div>
                    <div class="card-text">Cân nặng: {{ product.weight }}</div>
                  </div>
                  <div class="card-footer text-center">
                    <b-button size="sm" variant="outline-success" @click="openModalEdit(product)">
                      <i class="ion ion-md-create"></i>
                      Sửa
                    </b-button>
                    <b-button size="sm" variant="outline-danger" @click.prevent="deleteProduct(product)">
                      <i class="ion ion-md-trash"></i>
                      Xóa
                    </b-button>
                  </div>
                </li>
              </ul>
              <!-- / Content -->

            </div>
          </b-card>
          <div class="no-data" v-else>
            <b-alert show dismissible variant="warning">
              <i class="sidenav-icon ion ion-ios-warning"></i>
              Không có dữ liệu phù hợp, vui lòng thử lại.
            </b-alert>
          </div>
        </div>
      </div>
      <!--modal-->
      <b-modal
        ref="editProductModal"
        title="Sửa sản phẩm"
        @ok="editProduct"
        @cancel="cancel"
        cancel-title="Hủy bỏ" static
      >
        <b-form-row>
          <b-col md="6">
            <b-form-group label="Tên">
              <b-form-input v-model.trim="dataProductEdit.full_name"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Code">
              <b-form-input v-model.trim="dataProductEdit.code"></b-form-input>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <b-form-group label="Trạng thái kiểm duyệt">
              <b-form-select
                v-model="dataProductEdit.status"
                :options="options.censorship_status"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Giá bán">
              <b-form-input v-model.trim="dataProductEdit.cost"></b-form-input>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <b-form-group label="Giá bán lẻ">
              <b-form-input v-model.trim="dataProductEdit.retail_prices"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Giá bán sỉ">
              <b-form-input v-model.trim="dataProductEdit.wholesale_price"></b-form-input>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <b-form-group label="Thuộc tính sản phẩm">
              <b-form-select
                v-model="dataProductEdit.attribute_product"
                :options="options.attribute_product"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Thuộc tính hệ thống">
              <b-form-select
                v-model="dataProductEdit.property_system"
                :options="options.property_system"
              ></b-form-select>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <b-form-group label="Cân nặng">
              <b-form-input v-model.trim="dataProductEdit.weight"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Ảnh sản phẩm">
              <b-form-file
                multiple
                accept="image/*"
                v-model="dataProductEdit.images"
                placeholder="Chọn ảnh..."
                :file-name-formatter="formatNames"
              >
              </b-form-file>
              <span v-show="errorImageExtension" class="help is-danger">Bạn chỉ được upload file định dạng Ảnh</span>
            </b-form-group>
          </b-col>
        </b-form-row>
      </b-modal>

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
          fixed-height="700px">
          <vueper-slide
            v-for="(slide, i) in slides"
            :key="i"
            :image="slide.image">
          </vueper-slide>
        </vueper-slides>
        <vueper-slides
          class="no-shadow thumbnails"
          ref="vueperslides2"
          @slide="$refs.vueperslides1.goToSlide($event.currentSlide.index, { emit: false })"
          :visible-slides="slides.length"
          fixed-height="100px"
          :bullets="false"
          :touchable="false"
          :gap="2.5"
          :arrows="false">
          <vueper-slide
            v-for="(slide, i) in slides"
            :key="i"
            :image="slide.image"
            @click.native="$refs.vueperslides2.goToSlide(i)">
          </vueper-slide>
        </vueper-slides>
      </b-modal>
      <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
    </div>
  </div>
</template>

<script>
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Vue from 'vue'
import BlockUI from 'vue-blockui'
import Multiselect from 'vue-multiselect'
import MultiSelectShop from 'components/elements/common/MultiSelectShop'
import MultiSelectStationByTypePostOffice from 'components/elements/common/MultiSelectStationByTypePostOffice'
import * as _ from 'lodash'
import ProhibitPackage from 'domain/entities/ProhibitPackage'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import ProhibitPackageService from 'domain/services/prohibit-package-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

Vue.use(BlockUI)

export default {
  name: 'GetImageProduct',
  components: {
    LaddaBtn,
    Multiselect,
    MultiSelectShop,
    MultiSelectStationByTypePostOffice,
    LoadingMiniBottom,
    VueperSlides,
    VueperSlide
  },
  data: () => ({
    slides: [],
    appLoading: false,
    loadingButton: false,
    checkResult: 0,
    errorImageExtension: false,
    dataProductEdit: {},
    dataImageOld: [],
    productsResponse: [],
    dataPage: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 12
    },
    dataInput: {
      shops: [],
      stations: [],
      name: '',
      censorship_status: [],
      attribute_product: [],
      property_system: []
    },
    options: {
      censorship_status: ProhibitPackage.optionsCensorshipStatus,
      attribute_product: ProhibitPackage.optionsAttributeProduct,
      property_system: ProhibitPackage.optionsPropertySystem
    }
  }),
  methods: {
    cancel () {
      this.dataProductEdit = []
    },
    async editProduct () {
      let dataImages = this.dataImageOld
      let slideImage = []
      let dataEdit = {}
      let dataSend = new FormData()
      if (this.dataProductEdit.images.length > 0) {
        if (this.errorImageExtension) return
        dataImages = []
        for (let i = 0; i < this.dataProductEdit.images.length; i++) {
          dataSend.append('files[' + i + ']', this.dataProductEdit.images[i])
        }
        await ProhibitPackageService.getImageGS(dataSend).then(response => {
          if (response.data.hasOwnProperty('success')) {
            if (response.data.success) {
              let responses = response.data.data
              for (let i = 0; i < responses.length; i++) {
                dataImages.push({
                  ghtk_path: responses[i]['url'],
                  name: responses[i]['name']
                })
                slideImage.push({
                  image: responses[i]['url'],
                  id: responses[i]['id']
                })
              }
            }
          }
        }).catch((e) => {
          console.log(e)
        })
      }
      dataEdit = {
        id: this.dataProductEdit.product_id,
        requests: {
          code: this.dataProductEdit.code,
          confirm_status: this.dataProductEdit.status,
          cost: this.dataProductEdit.cost,
          images: dataImages,
          name: this.dataProductEdit.full_name,
          retail_prices: this.dataProductEdit.retail_prices,
          weight: this.dataProductEdit.weight,
          wholesale_prices: this.dataProductEdit.wholesale_price,
          attribute_product: this.dataProductEdit.attribute_product,
          property_system: this.dataProductEdit.property_system
        },
        shop_order: this.dataProductEdit.shop_order,
        shop_type: 0,
        user_id: this.$store.state.userInfo.User ? this.$store.state.userInfo.User.id : 0,
        user_name: this.$store.state.userInfo.User ? this.$store.state.userInfo.User.username : ''
      }
      await ProhibitPackageService.edit(dataEdit).then(res => {
        if (res.data.hasOwnProperty('status')) {
          if (res.data.status === 1) {
            commonHelper.showMessage('Sửa sản phẩm thành công', 'success')
            // update lại thông tin sản phẩm
            if (slideImage.length === 0) {
              for (let j = 0; j < dataImages.length; j++) {
                slideImage.push({
                  image: dataImages[j].ghtk_path,
                  id: j
                })
              }
            }
            for (let i = 0; i < this.productsResponse.length; i++) {
              if (this.productsResponse[i].product_id === dataEdit.id) {
                this.productsResponse[i].code = dataEdit.requests.code
                this.productsResponse[i].cost = dataEdit.requests.cost
                this.productsResponse[i].confirm_status = dataEdit.requests.confirm_status
                this.productsResponse[i].images = slideImage
                this.productsResponse[i].full_name = dataEdit.requests.name
                this.productsResponse[i].retail_prices = dataEdit.requests.retail_prices
                this.productsResponse[i].weight = dataEdit.requests.weight
                this.productsResponse[i].wholesale_price = dataEdit.requests.wholesale_prices
                this.productsResponse[i].attribute_product = dataEdit.requests.attribute_product
                this.productsResponse[i].property_system = dataEdit.requests.property_system
                return
              }
            }
          } else {
            commonHelper.showMessage(res.data.message, 'error')
          }
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    formatNames (files) {
      if (files) return `${files.length} files selected`
      return ''
    },
    openModalEdit (product) {
      this.errorImageExtension = false
      this.dataImageOld = []
      if (product.images.length) {
        for (let i = 0; i < product.images.length; i++) {
          this.dataImageOld.push({
            ghtk_path: product.images[i].image,
            name: product.images[i].name
          })
        }
      }
      const swap = {
        images: [],
        product_id: product.product_id,
        code: product.code,
        status: product.confirm_status,
        cost: product.cost,
        full_name: product.full_name,
        retail_prices: product.retail_prices,
        weight: product.weight,
        wholesale_price: product.wholesale_price,
        attribute_product: product.attribute_product,
        property_system: product.property_system,
        shop_order: product.shop_order
      }
      this.dataProductEdit = swap
      this.$refs.editProductModal.show()
    },
    openModalImage (product) {
      this.slides = product.images
      this.$refs.showImageModal.show()
    },
    resetForm () {
      this.dataInput = {
        shops: [],
        stations: [],
        name: '',
        censorship_status: [],
        attribute_product: [],
        property_system: []
      }
      this.$refs.shopComponent.resetValue()
      this.$refs.stationComponent.resetValue()
    },
    selectedShop (option) {
      if (!_.isNil(option)) {
        this.dataInput.shops = _.map(option, 'id')
      }
    },
    selectedStation (option) {
      if (!_.isNil(option)) {
        this.dataInput.stations = _.map(option, 'id')
      }
    },
    pageChanged: function (page) { // Event check pagination change
      this.searchProduct(page)
      this.dataPage.currentPage = page
    },
    searchProduct (page, newSearchConditions) {
      this.appLoading = true
      let dataSend = {
        page: page - 1,
        page_size: this.dataPage.perPage,
        key: this.dataInput.name,
        station_ids: _.isEmpty(this.dataInput.stations) ? '' : this.dataInput.stations.join(','),
        shop_ids: _.isEmpty(this.dataInput.shops) ? '' : this.dataInput.shops.join(','),
        confirm_status: _.isEmpty(this.dataInput.censorship_status) ? '' : _.map(this.dataInput.censorship_status, 'value').join(','),
        attribute_products: _.isEmpty(this.dataInput.attribute_product) ? '' : _.map(this.dataInput.attribute_product, 'value').join(','),
        property_systems: _.isEmpty(this.dataInput.property_system) ? '' : _.map(this.dataInput.property_system, 'value').join(',')
      }
      // Truong hop nguoi dung tim kiem voi dieu kien loc moi
      if (newSearchConditions) {
        this.dataPage.currentPage = 1
        dataSend.page = 0
        this.loadingButton = true
      }
      ProhibitPackageService.search(dataSend).then(response => {
        if (response.data.status === 1) {
          let data = response.data.data
          this.dataPage.totalItems = data.total
          this.productsResponse = data.products
          this.checkResult = response.data.status
          this.offLoading()
        } else {
          this.offLoading()
          this.checkResult = 0
          commonHelper.showMessage(response.data.message, 'error')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    offLoading () {
      this.appLoading = false
      this.loadingButton = false
    },
    deleteProduct (product) {
      if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${product.full_name} ?`)) return

      let dataDelete = {
        id: product.product_id,
        shop_order: product.shop_order,
        shop_type: 0,
        user_id: this.$store.state.userInfo.User ? this.$store.state.userInfo.User.id : 0,
        user_name: this.$store.state.userInfo.User ? this.$store.state.userInfo.User.username : ''
      }
      ProhibitPackageService.delete(dataDelete).then(response => {
        if (response.data.hasOwnProperty('status')) {
          if (response.data.status === 1) {
            commonHelper.showMessage('Xóa sản phẩm thành công', 'success')
            // xóa sản phẩm trong list
            for (let i = 0; i < this.productsResponse.length; i++) {
              if (this.productsResponse[i].product_id === dataDelete.id) {
                this.productsResponse.splice(i, 1)
                return
              }
            }
          } else {
            commonHelper.showMessage(response.data.message, 'error')
          }
        }
      }).catch((e) => {
        console.log(e)
      })
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.dataPage.totalItems / this.dataPage.perPage)
    }
  },
  watch: {
    dataProductEdit: {
      deep: true,
      handler: function () {
        if (!_.isEmpty(this.dataProductEdit.images)) {
          let nameImages = _.map(this.dataProductEdit.images, 'name')
          this.errorImageExtension = false
          for (let i = 0; i < this.dataProductEdit.images.length; i++) {
            if (!_.includes(['jpg', 'png', 'jpeg'], nameImages[i].split('.').pop())) {
              this.errorImageExtension = true
              return
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .center {
    text-align: center;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .form-filter {
    border: 1px solid #ccc;
    border-radius: 5px;
    background: white;
    padding: 20px;
  }
  .btn-z-index {
    z-index: 0;
  }
  .deck-list {
    margin: auto;
    li {
      margin-bottom: 1rem;
      margin-right: 1rem;
      width: 27vh;
      .card-body {
        overflow-y: hidden;
        font-size: 13px;
      }
    }
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
  .is-danger {
    border-color: #E0B4B4;
    color: #9F3A38;
    box-shadow: none;
  }
</style>
