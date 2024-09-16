<template>
  <div>
    <div class="ui-block">
      <h4 class="ui-block-heading">Gán huy hiệu shop</h4>
      <div class="search-form">
        <form>
          <b-form-row>
            <div class="col-md-12" style="margin-bottom:10px">
              <multiselect v-model="selectedAwards"
                id="ajax"
                label="text"
                track-by="value"
                placeholder="(Chọn loại huy hiệu)"
                open-direction="bottom"
                :options="options"
                :multiple="true"
                :internal-search="false"
                :clear-on-select="true"
                :close-on-select="true"
                :options-limit="300"
                :max-height="600"
                :show-no-results="false"
                :hide-selected="false"
                :deselectLabel="`X`"
                @input="selectAwards"
              >
              </multiselect>
            </div>
            <!-- <div class="col-md-12" v-if="checkHasReputation()">
              <b-form-group label="CSKH xác nhận Uy tín" v-slot="{ ariaDescribedby }">
                <b-form-checkbox-group
                  id="checkbox-group-1"
                  v-model="filterData.confirmReputation"
                  :options="optionsConfirm"
                  :aria-describedby="ariaDescribedby"
                  name="flavour-1"
                ></b-form-checkbox-group>
              </b-form-group>
            </div> -->
          </b-form-row>

          <b-form-row>
            <div class="col-md-6">
              <b-form-group label="Chọn shop">
                <select-shop @selected="selectedShops">
                </select-shop>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group label="Ngày bắt đầu">
                <datepicker v-model="filterData.startDate" :bootstrap-styling=true format="yyyy-MM-dd" placeholder="Ngày bắt đầu"
                :calendar-button=true calendar-button-icon="fa fa-calendar" :clear-button="true"></datepicker>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group label="Ngày kết thúc">
                <datepicker v-model="filterData.endDate" :bootstrap-styling=true format="yyyy-MM-dd" placeholder="Ngày kết thúc"
                :calendar-button=true calendar-button-icon="fa fa-calendar" :clear-button="true"></datepicker>
              </b-form-group>
            </div>
          </b-form-row>

          <div class="sk-wave loading-filter" style="margin: 0 auto;" v-if="loading">
            <div class="sk-rect sk-rect1" id="sk-rect-custom"></div> <div class="sk-rect sk-rect2" id="sk-rect-custom"></div> <div class="sk-rect sk-rect3" id="sk-rect-custom"></div> <div class="sk-rect sk-rect4" id="sk-rect-custom"></div> <div class="sk-rect sk-rect5" id="sk-rect-custom"></div>
          </div>
          <b-form-row class="btn-filter">
            <div class="col-md-12">
              <b-form-group>
                <div class="align-content-center center">
                  <b-btn type="button" variant="success" @click="getListShopAward">
                    <i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
                  </b-btn>
                </div>
              </b-form-group>
            </div>
          </b-form-row>
        </form>
      </div>
      <div class="result" id="results"><br/>
        <!-- <div class="col-sm text-sm-left text-center pt-3">
          <span class="text-muted" v-if="pageData.totalItems">Tìm thấy {{ pageData.totalItems }} shop</span>
        </div> -->
        <br/>
        <b-card no-body v-if="listShopAwards">
          <!-- / Table controls -->
          <div class="table-result" >
            <!-- Table -->
            <template class="table-responsive mb-4">
              <table class="table mb-0 table-bordered">
                <thead class="" style="width: 100%">
                  <tr>
                    <th>Thông tin shop</th>
                    <th width='30%'>Huy hiệu</th>
                    <th width='43%' style="min-width:450px">Gán huy hiệu</th>
                    <th width='7%'>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(shop, index) in listShopAwards" :key="index">
                    <td>{{shop.shop_code}} - {{shop.shop_name}}</td>
                    <td>
                      <div class="list-icon">
                        <div v-if="shop.friendly && shop.friendly.confirm">
                          <img src="../../../assets/images/friendly_40px.png" class="icon-award" alt="" width="40px">
                        </div>
                        <div v-if="shop.reputation">
                          <img src="../../../assets/images/reputation_40px.png" class="icon-award" alt="" width="40px">
                        </div>
                        <div v-if="shop.growing">
                          <img src="../../../assets/images/growing_40px.png" class="icon-award" alt="" width="40px">
                        </div>
                        <div v-if="shop.pro && shop.pro.confirm">
                          <img src="../../../assets/images/pro_40px.png" class="icon-award" alt="" width="40px">
                        </div>
                        <div v-if="shop.spro && shop.spro.confirm">
                          <img src="../../../assets/images/spro_40px.png" class="icon-award" alt="" width="40px">
                        </div>
                        <div v-if="shop.charming">
                          <img src="../../../assets/images/charming_40px.png" class="icon-award" alt="" width="40px">
                        </div>
                        <div v-if="shop.devoted">
                          <img src="../../../assets/images/devoted_40px.png" class="icon-award" alt="" width="40px">
                        </div>
                      </div>
                      <div v-b-toggle="'collapse-' + index" style="cursor: pointer;margin-top:10px" @click="awardHistory(index)">
                          <span>
                            <span><i class="fas fa-caret-right" :id="'icon-right-' + index" style="display:contents"></i></span>
                            <span><i class="fas fa-sort-down" :id="'icon-down-' + index" style="display:none"></i></span>
                            <span style="margin-left:10px">Lịch sử  gán huy hiệu shop</span>
                          </span>
                        </div>
                      <b-collapse :id="'collapse-' + index" class="mt-2">
                        <b-card style="background-color: #fafafa;">
                          <div v-for="(history, i) in shop.history" :key="i" style="width:100%;float:left">
                            ({{history.created}}): {{history.award}} (từ {{history.start_date}} đến {{history.end_date}}) - {{history.modified_by}}
                          </div>
                        </b-card>
                      </b-collapse>
                    </td>
                    <td>
                      <!-- FRIENDLY -->
                      <b-form-group>
                        <b-form-checkbox v-model="shop.friendly.confirm" :value=true :unchecked-value=false style="float:left;margin-top:10px;height:30px">Thân thiện</b-form-checkbox>
                        <div v-if="shop.friendly.confirm" style="float:right">
                          <datepicker class="small-date" v-model="shop.friendly.start_date" :bootstrap-styling=true format="yyyy-MM-dd" :calendar-button=true calendar-button-icon="fa fa-calendar"></datepicker>
                          <datepicker class="small-date" v-model="shop.friendly.end_date" :bootstrap-styling=true format="yyyy-MM-dd" :calendar-button=true calendar-button-icon="fa fa-calendar"></datepicker>
                        </div>
                      </b-form-group>
                      <!-- PRO -->
                      <b-form-group>
                        <b-form-checkbox v-model="shop.pro.confirm" :value=true :unchecked-value=false style="float:left;margin-top:10px;height:30px">Pro</b-form-checkbox>
                        <div v-if="shop.pro.confirm" style="float:right">
                          <datepicker class="small-date" v-model="shop.pro.start_date" :bootstrap-styling=true format="yyyy-MM-dd" :calendar-button=true calendar-button-icon="fa fa-calendar"></datepicker>
                          <datepicker class="small-date" v-model="shop.pro.end_date" :bootstrap-styling=true format="yyyy-MM-dd" :calendar-button=true calendar-button-icon="fa fa-calendar"></datepicker>
                        </div>
                      </b-form-group>
                      <!-- SPRO -->
                      <b-form-group>
                        <b-form-checkbox v-model="shop.spro.confirm" :value=true :unchecked-value=false style="float:left;margin-top:10px;height:30px">Super Pro</b-form-checkbox>
                        <div v-if="shop.spro.confirm" style="float:right">
                          <datepicker class="small-date" v-model="shop.spro.start_date" :bootstrap-styling=true format="yyyy-MM-dd" :calendar-button=true calendar-button-icon="fa fa-calendar"></datepicker>
                          <datepicker class="small-date" v-model="shop.spro.end_date" :bootstrap-styling=true format="yyyy-MM-dd" :calendar-button=true calendar-button-icon="fa fa-calendar"></datepicker>
                        </div>
                      </b-form-group>
                    </td>
                    <td>
                      <b-button variant="success" :id="'btn-update-'+index" @click="updateAward(index)">Cập nhật</b-button>
                      <div :id="'spin-update-'+index"  class="sk-wave" style="margin: 0 auto;display:none">
                        <div class="sk-rect sk-rect1" id="sk-rect-custom"></div> <div class="sk-rect sk-rect2" id="sk-rect-custom"></div> <div class="sk-rect sk-rect3" id="sk-rect-custom"></div> <div class="sk-rect sk-rect4" id="sk-rect-custom"></div> <div class="sk-rect sk-rect5" id="sk-rect-custom"></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
            <!-- Pagination -->
            <!-- <b-card-body class="pt-0 pb-3">
              <div class="row">
                <div class="col-sm pt-3">
                  <b-pagination
                    :total-rows="pageData.totalItems"
                    v-model="pageData.currentPage"
                    :per-page="pageData.perPage"
                    v-on:change="pageChanged"
                  />
                </div>
                <div class="col-sm text-sm-left text-center pt-3">
                  <span class="text-muted" v-if="pageData.totalItems">Trang {{pageData.currentPage}} trên {{pageData.totalPages}}</span>
                </div>
              </div>
            </b-card-body> -->
            <!-- / Pagination -->
          </div>
        </b-card>
        <div class="no-data" v-if="!listShopAwards">
          Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'moment/locale/vi'
import Multiselect from 'vue-multiselect'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import shopService from 'domain/services/shop-service'
import SelectShop from 'components/elements/FilterBox/SelectMultiShop'
export default {
  name: 'ShopAward',
  components: {
    Multiselect,
    Datepicker,
    SelectShop
  },
  data: () => ({
    loading: false,
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 100
    },
    listShopAwards: [],
    listShopCode: [],
    shopCodeSearch: '',
    selectedAwards: [],
    filterData: {
      awards: [],
      shopCodes: [],
      startDate: '',
      endDate: '',
      confirmReputation: null
    },
    dateStart: '',
    dateEnd: '',
    selected: null,
    optionsConfirm: [
      {
        text: 'Đã xác nhận',
        value: 'confirm'
      },
      {
        text: 'Chưa xác nhận',
        value: 'notConfirm'
      }
    ],
    awardData: [],
    options: []
  }),
  methods: {
    updateAward (index) {
      this.loadingUpdate(index)
      let dataUpdate = this.listShopAwards[index]
      // FRIENDLY
      if (dataUpdate.friendly && dataUpdate.friendly.confirm) {
        dataUpdate.friendly.start_date = moment(new Date(dataUpdate.friendly.start_date)).format('YYYY-MM-DD 00:00:00')
        dataUpdate.friendly.end_date = moment(new Date(dataUpdate.friendly.end_date)).format('YYYY-MM-DD 23:59:59')
      }
      // PRO
      if (dataUpdate.pro && dataUpdate.pro.confirm) {
        dataUpdate.pro.start_date = moment(new Date(dataUpdate.pro.start_date)).format('YYYY-MM-DD 00:00:00')
        dataUpdate.pro.end_date = moment(new Date(dataUpdate.pro.end_date)).format('YYYY-MM-DD 23:59:59')
      }
      // SPRO
      if (dataUpdate.spro && dataUpdate.spro.confirm) {
        dataUpdate.spro.start_date = moment(new Date(dataUpdate.spro.start_date)).format('YYYY-MM-DD 00:00:00')
        dataUpdate.spro.end_date = moment(new Date(dataUpdate.spro.end_date)).format('YYYY-MM-DD 23:59:59')
      }
      shopService.updateShopAward(dataUpdate).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success === false) {
            commonHelper.showMessage(response.data.message, 'error')
          } else {
            console.log(response)
            commonHelper.showMessage('Cập nhật huy hiệu shop thành công !', 'success')
          }
        }
        this.stopLoadingUpdate(index)
      }).catch((e) => {
        console.log(e)
        this.stopLoadingUpdate(index)
        commonHelper.showMessage('Đã có lỗi xảy ra khi cập nhật huy hiệu shop', 'error')
      })
    },
    getAwardOptions () {
      shopService.getAwardOptions().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success === false) {
            commonHelper.showMessage(response.data.message, 'error')
          } else {
            this.options = []
            this.awardData = response.data.data
            Object.values(response.data.data).forEach(award => {
              this.options.push({
                'text': award.title,
                'value': award.name
              })
            })
          }
        }
      }).catch((e) => {
        console.log(e)
        commonHelper.showMessage('Đã có lỗi xảy ra khi lấy danh sách huy hiệu', 'error')
      })
    },
    loadingUpdate (index) {
      document.getElementById('spin-update-' + index).style.display = 'block'
      document.getElementById('btn-update-' + index).style.display = 'none'
    },
    stopLoadingUpdate (index) {
      document.getElementById('spin-update-' + index).style.display = 'none'
      document.getElementById('btn-update-' + index).style.display = 'block'
    },
    getListShopAward () {
      this.loading = true
      // build filter data
      if (this.filterData.startDate) {
        this.filterData.startDate = moment(new Date(this.filterData.startDate)).format('YYYY-MM-DD 00:00:00')
      }
      if (this.filterData.endDate) {
        this.filterData.endDate = moment(new Date(this.filterData.endDate)).format('YYYY-MM-DD 23:59:59')
      }
      this.filterData.page = this.pageData.currentPage
      this.filterData.limit = this.pageData.perPage
      // Get list shop award
      shopService.getListShopAward(this.filterData).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success === false) {
            commonHelper.showMessage(response.data.message, 'error')
          } else {
            this.listShopAwards = response.data.data ? response.data.data : []
            this.pageData.totalItems = response.data.count
            this.pageData.totalPages = Math.ceil(response.data.count / this.pageData.perPage)
          }
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
        console.log(e)
        commonHelper.showMessage('Đã có lỗi xảy ra khi lấy danh sách huy hiệu shop', 'error')
      })
    },
    selectedShops (result) {
      if (result) {
        this.filterData.shopCodes = result
      } else {
        this.filterData.shopCodes = []
      }
    },
    selectAwards () {
      this.filterData.awards = []
      this.selectedAwards.forEach(award => {
        this.filterData.awards.push(award.value)
      })
    },
    checkHasReputation () {
      return this.filterData.awards.includes('REPUTATION')
    },
    awardHistory (index) {
      // display icon arrow
      if (document.getElementById('icon-right-' + index).style.display === 'none') {
        document.getElementById('icon-right-' + index).style.display = 'contents'
        document.getElementById('icon-down-' + index).style.display = 'none'
      } else {
        document.getElementById('icon-right-' + index).style.display = 'none'
        document.getElementById('icon-down-' + index).style.display = 'contents'
      }
      // Get data award history
      if (!this.listShopAwards[index].history) {
        let body = {
          'shop_code': this.listShopAwards[index].shop_code
        }
        shopService.getAwardHistory(body).then(response => {
          if (response.data.hasOwnProperty('success')) {
            if (response.data.success === false) {
              commonHelper.showMessage(response.data.message, 'error')
            } else {
              let dataHistory = response.data.data || []
              this.$set(this.listShopAwards[index], 'history', dataHistory)
            }
          }
        }).catch((e) => {
          console.log(e)
          commonHelper.showMessage('Đã có lỗi xảy ra khi lấy lịch sử gán huy hiệu shop', 'error')
        })
      } else {
        delete this.listShopAwards[index].history
      }
    },
    pageChanged (page) {
      this.pageData.currentPage = page
    }
  },
  watch: {
    'pageData.currentPage': function (page) {
      this.getListShopAward()
    }
  },
  beforeMount () {
    this.getAwardOptions()
    this.getListShopAward()
  },
  metaInfo: {
    title: 'Huy hiệu shop'
  }
}
</script>
<style scoped>
.input-group-addon{
    display: flex;
    align-items: center;
    position: relative;
    left: 22px;
    z-index: 4;
}
.vdp-datepicker input{
    padding-left: 30px;
}
#form-group-1:focus{
  outline: none;
}
.center {
  margin: 0 auto;
}
.align-content-center {
  text-align: center;
}
.icon-award {
  float: left;
  margin-right: 10px;
}
.small-date {
  float: left;
  width: 150px;
}
.btn-filter {
  height: 50px;
}
#sk-rect-custom {
  background-color: #02BC77;
}
.loading-filter {
  position: fixed;
  left: 51%;
  z-index: 100;
  top: 90%;
}
.multiselect--active {
  z-index: 5;
}
.vdp-datepicker__clear-button {
  left: -17px;
}
.vdp-datepicker__clear-button i {
  font-size: 15px;
}
.list-icon {
  height: 50px;
}
</style>
