<template>
  <div id="auto-assign">
    <div class="ui-block">
      <h4 class="ui-block-heading">Danh sách chia tự động</h4>
      <div class="search-form">
        <form>
          <b-form-row>
            <!--                        Box lọc tỉnh/tp-->
            <div class="col-md-6">
              <!--                          <b-form-group label="Chọn Tỉnh/Thành phố">-->
              <select-province-station
                @getProvince="selected.provinces = $event"
                @getStation="selected.stations = $event"
                v-bind:initStation="init.station"
                v-bind:initProvince="init.province"
                ref="select_provice_station"
              ></select-province-station>
              <!--                          </b-form-group>-->
            </div>
<!--            <div class="col-md-2">-->
<!--              &lt;!&ndash;                        <b-form-group label="Chọn Kho">&ndash;&gt;-->
<!--              <select-stations-in-district-->
<!--                @selected="selected.stations = $event"-->
<!--                ref="select_station"-->
<!--                v-bind:districtIds="selected.provinces"-->
<!--              ></select-stations-in-district>-->
<!--              &lt;!&ndash;                        </b-form-group>&ndash;&gt;-->
<!--            </div>-->
            <!--chọn khu vực-->
            <div class="col-md-2">
              <b-form-group label="Chọn khu vực">
                <!--                          <select-user-group :multiple="false" @selected="selected.group = $event" ref="select_groups"></select-user-group>-->
                <b-form-input
                  v-model="selected.area"
                  placeholder="Chọn khu vực"
                ></b-form-input>
              </b-form-group>
            </div>

            <div class="col-md-4">
              <b-form-group>
                <span slot="label">&nbsp;</span>
                <div class="text-right center">
                  <b-btn type="reset" @click="resetForm">Nhập lại</b-btn>
                  <b-btn type="button" variant="primary" @click="searchArea"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
                </div>
              </b-form-group>
            </div>
          </b-form-row>
        </form>
      </div>
            <div class="result" id="results">
              <br/>
              <br/>
              <div class="text-right center add-kv">
                <b-btn type="button" variant="primary" > <router-link to="/config-capacity/index" id="add-area">Năng xuất COD</router-link> </b-btn>
                <b-btn type="button" variant="primary" ><i class="sidenav-icon ion ion-md-add"></i> <router-link to="/auto-assign/add" id="add-area">Thêm khu vực</router-link> </b-btn>
              </div>
                    <b-card no-body v-if="listAreas">
                        <!-- / Table controls -->
                        <div class="table-result" >
                        <!-- Table -->
                            <div class="table-responsive mb-4">
                                <table class="table mb-0 table-bordered">
                                    <thead class="" style="width: 100%">
                                    <tr>
                                        <th style="width: 10%">Mã khu vực</th>
                                        <th style="width: 10%">Tên khu vực</th>
                                        <th style="width: 10%">Tỉnh/Thành phố</th>
                                        <th style="width: 10%">Quận/Huyện</th>
                                        <th style="width: 10%">Kho</th>
                                        <th style="width: 35%;" class="th_cart">Giỏ</th>
                                        <th style="width: 15%" class="text-right th_action">Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="item in listAreas" :key="item.id">
                                      <td class="center" >{{item.id}}</td>
                                      <td class="center" >{{item.name}}</td>
                                      <td class="center" >{{item.province}}</td>
                                      <td class="center">{{item.district}}</td>
                                      <td class="center">{{item.station}}</td>
                                      <td class="center">
                                        <span v-for="c in item.cart">
                                          <a :href="c.linkCart" class="hover-under cart-name"><span>{{c.alias}} </span></a>,
                                        </span>
                                      </td>
                                      <td class="responsive-cart">
                                        <b-btn type="button" class="center">
                                          <router-link :to="item.editLink" class="white-text"
                                          >Sửa</router-link></b-btn>
                                        <b-btn type="button" class="">
                                          <router-link :to="'/auto-assign/config-cart/' + item.id" class="white-text">
                                            Config giỏ
                                          </router-link>
                                        </b-btn>

                                        <b-btn type="button" class="center" @click="removeArea(item.id)">Xóa</b-btn>
                                      </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!-- Pagination -->
                            <b-card-body class="pt-0 pb-3">
                                <div class="row">
                                    <div class="col-sm pt-3">
                                        <b-pagination :total-rows="pageData.totalItems"
                                            v-model="pageData.currentPage"
                                            :per-page="pageData.perPage"
                                           v-on:change="pageChanged"
                                        />
                                    </div>
                                    <div class="col-sm text-sm-left text-center pt-3">
                                        <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                                    </div>
                                </div>
                            </b-card-body>
                            <!-- / Pagination -->
                        </div>
                    </b-card>
                    <div class="no-data" v-if="!listAreas.length">
                        Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.
                    </div>
                    <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
            </div>
    </div>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import autoAssignService from 'domain/services/auto-assign-service.js'
import Multiselect from 'vue-multiselect'
import InputTag from 'vue-input-tag'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import VueMonthlyPicker from 'vue-monthly-picker'
import draggable from 'vuedraggable'
import SelectProvinceStation from 'components/elements/FilterBox/SelectProvinceStation'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SelectStationsInDistrict from 'components/elements/FilterBox/SelectStationsInDistrict'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SelectProvinces from 'components/elements/FilterBox/SelectProvinces'
export default {
  name: 'auto-assign',
  components: {
    LoadingMiniBottom,
    Multiselect,
    VueMonthlyPicker,
    InputTag,
    draggable,
    SelectProvinceStation,
    SingleSelectProvince,
    SelectStationsInDistrict,
    SelectProvinces
  },
  data: () => ({
    success: true,
    appLoading: false,
    linkCart: '/admin/carts/edit',
    listAreas: [],
    selected: {
      stations: [],
      provinces: [],
      districts: [],
      area: null
    },
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 20,
      sortBy: 'id',
      sortDesc: false
    },
    init: {
      province: {
        code: 1,
        name: 'HN'
      },
      station: {
        code: 11,
        name: 'stt'
      }
    }
  }),
  watch: {
    'selected.provinces': function (newValue) {
      if (!newValue || newValue.length === 0) {
        this.selected.districts = []
        this.selected.stations = []
      }
    },
    'selected.districts': function (newValue) {
      // if (newValue.length === 0) {
      //   this.selected.stations = []
      // }
    }
  },
  methods: {
    pageChanged (page) {
      // Event check pagination change
      this.pageData.currentPage = page
      this.searchArea()
    },
    searchArea () {
      if (this.selected.area) {
        this.selected.area = this.selected.area.trim()
      }
      this.$startLoading()
      let params = []
      params['name'] = this.selected.area
      params['stations'] = this.selected.stations
      params['provinces'] = this.selected.provinces
      params['districts'] = this.selected.districts
      if (this.pageData.currentPage === 0) {
        this.pageData.currentPage = 1
      }
      params['page'] = this.pageData.currentPage
      autoAssignService.getListAreas(params).then(response => {
        response = response.data
        if (response.success) {
          let dataRes = response.data
          this.pageData.currentPage = dataRes.current_page
          this.pageData.perPage = dataRes.per_page
          this.pageData.totalPages = dataRes.total_page
          this.pageData.totalItems = dataRes.total
          this.listAreas = this.handleListArea(dataRes.current_data)
        } else {
          this.pageData.currentPage = 0
          this.pageData.totalPages = 0
          this.pageData.totalItems = 0
          this.listAreas = []
        }
      }).then(() => {
        this.$stopLoading()
      }).catch(() => {
        this.pageData.currentPage = 1
        this.pageData.totalPages = 0
        this.pageData.totalItems = 0
        this.listAreas = []
        this.$stopLoading()
      })
    },
    removeArea (id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
        return true
      }
      this.$startLoading()
      autoAssignService.removeArea(id).then(response => {
        response = response.data
        console.log(response)
        if (response.success) {
          commonHelper.showMessage(response.message, 'success')
          this.searchArea()
          this.$stopLoading()
        } else {
          commonHelper.showMessage(response.message, 'error')
          this.$stopLoading()
        }
      }).catch((e) => {
        console.log(e)
        commonHelper.showMessage('Đã có lỗi xảy ra1', 'error')
        this.$stopLoading()
      })
    },
    handleListArea (listArea) {
      listArea.forEach(item => {
        item.editLink = '/auto-assign/edit/' + item.id
        item.cart.forEach(c => {
          c.linkCart = '/admin/carts/edit/' + c.id
        })
      })
      return listArea
    },
    showOptionsExp () {
      this.$refs.expandExport.show()
    },
    removeColums (index) {
      this.listColumnsExport.splice(index, 1)
    },
    resetForm () {
      this.selected.area = null
      this.$refs.select_provice_station.reset()
    },
    showDate (date) {
      this.selected.date = date
    }
  },
  created () {
    this.searchArea()
  },
  computed: {
    totalItems () {
      return this.pageData.totalItems
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  metaInfo: {
    title: 'Tìm kiếm nhân viên'
  }
}
</script>
<style scoped>
.center {
  margin: 0 auto;
}

.align-content-center {
  text-align: center;
}
.add-kv {
  margin-bottom: 10px;
}
#add-area {
  color: white;
}
.hover-under:hover {
  text-decoration: underline;
}
.white-text {
  color: white;
}

.cart-name {
  margin-left: 3px;
}

.responsive-cart {
  display: flex;
  border-bottom: none;
  border-left: none;
  border-right: none;
  justify-content: space-around;
}

@media (min-width: 1200px) {
  .th_cart {
    width: 25% !important;
  }

  .th_action {
    width: 25% !important;
  }
}

@media (min-width: 1450px) {
  .th_cart {
    width: 30% !important;
  }

  .th_action {
    width: 20% !important;
  }
}

@media (min-width: 1450px) {
  .th_cart {
    width: 30% !important;
  }

  .th_action {
    width: 20% !important;
  }
}

@media (min-width: 1860px) {
  .th_cart {
    width: 35% !important;
  }

  .th_action {
    width: 15% !important;
  }
}
</style>
