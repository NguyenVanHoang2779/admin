<template>
  <div>
    <div class="ui-block">
      <h4 class="ui-block-heading">Quản lý phụ kho onsite</h4>
      <div class="search-form">
        <form>
          <b-form-row>
            <div class="col-md-12">
              <b-form-group label="Chọn shop">
                <select-shop @selected="selectedShop">
                </select-shop>
              </b-form-group>
            </div>
          </b-form-row>

          <b-form-row>
            <div class="col-md-3">
              <b-form-group label="Hiện tất cả/Đã được gán">
                <b-form-select :options="filter_staff_options" v-model="selected.staff_type" :disabled="disableSelectFilterType"></b-form-select >
              </b-form-group>
            </div>

            <div class="col-md-6">
              <b-form-group label="Chọn pk onsite" class="col-md-12">
                <select-pk-onsite @selected="selectedPkOnsite" :selected_pk_onsite="selected_pk_onsite" @updateSelectedPkOnsite="selected_pk_onsite = $event">
                </select-pk-onsite>
              </b-form-group>
            </div>

<!--            <div class="col-md-3">-->
<!--              <b-form-group label="Tên đăng nhập">-->
<!--                <b-input type="text" placeholder="Nhập tên đăng nhập" v-model="user.username"/>-->
<!--              </b-form-group>-->
<!--            </div>-->

<!--            <div class="col-md-3">-->
<!--              <b-form-group label="Họ tên">-->
<!--                <b-input type="text" placeholder="Nhập họ tên" v-model="user.fullname"/>-->
<!--              </b-form-group>-->
<!--            </div>-->

            <div class="col-md-3">
              <b-form-group label="Chọn kho">
                <select-stations @selected="selected.stations = $event" ref="select_stations" placehoder="Nhập kho cần tìm kiếm"></select-stations>
              </b-form-group>
            </div>
          </b-form-row>

          <b-form-row>
            <div class="col-md-12">
              <b-form-group>
                <div class="align-content-center center">
<!--                  <b-btn type="reset" @click="resetForm">Nhập lại</b-btn>-->
                  <b-btn type="button" variant="primary" @click="searchPkOnsites(pageData.currentPage, true, false)">
                    <i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
                  </b-btn>
                </div>
              </b-form-group>
            </div>
          </b-form-row>
        </form>
      </div>
      <div class="result" id="results"><br/>
        <div class="col-sm text-sm-left text-center pt-3">
          <span class="text-muted" v-if="pageData.totalItems">Tìm thấy {{ pageData.totalItems }} nhân viên</span>
        </div>
        <br/>
        <b-card no-body v-if="listUsers">
          <!-- / Table controls -->
          <div class="table-result" >
            <!-- Table -->
            <div class="table-responsive mb-4">
              <table class="table mb-0 table-bordered">
                <thead class="" style="width: 100%">
                <tr>
                  <th>Mã NV</th>
                  <th>Thông tin</th>
                  <th>Bộ phận</th>
                  <th>Vị trí</th>
                  <th>Kho</th>
                  <th width="80px">Hành động</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="dataUser in listUsers">
                  <th scope="row" :data-user-id="dataUser.id">{{dataUser.staff_code}}</th>
                  <td>
                    <div>{{dataUser.fullname}}</div>
                    <b-badge variant="outline-info">{{dataUser.username}} <span v-if="dataUser.personal_email">/</span> {{dataUser.personal_email}}</b-badge>
                  </td>
                  <td>{{dataUser.group}}</td>
                  <td>{{dataUser.position}}</td>
                  <td>{{dataUser.station}}</td>
                  <td>
                    <assign-pk-onsite
                      :shop_code="shop.code"
                      :is_assign="dataUser.is_assign"
                      @isAssignWasUpdated="dataUser.is_assign = $event"
                      :staff_type="selected.staff_type"
                      :username="user.username"
                      :fullname="user.fullname"
                      :user_id="dataUser.id"
                      :group="dataUser.group"
                      :total_item="pageData.totalItems"
                      @totalItemWasUpdated="updatePage"
                    >
                    </assign-pk-onsite>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination -->
            <b-card-body class="pt-0 pb-3">
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
                  <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                </div>
              </div>
            </b-card-body>
            <!-- / Pagination -->
          </div>
        </b-card>
        <div class="no-data" v-if="!listUsers">
          Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.
        </div>
      </div>
    </div>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import shopService from 'domain/services/shop-service'
import Multiselect from 'vue-multiselect'
import InputTag from 'vue-input-tag'
import SelectUserGroup from 'components/elements/FilterBox/SelectUserGroup'
import SelectDepartmentAndPositionJob from 'components/elements/FilterBox/SelectDepartmentAndPositionJob'
import SelectB2CSaleLeader from 'components/elements/FilterBox/SelectB2CSaleLeader'
import SelectShop from 'components/elements/FilterBox/SelectShop'
import SelectPkOnsite from 'components/elements/FilterBox/SelectPkOnsite'
import AssignPkOnsiteForShop from 'components/elements/ActionBox/AssignPkOnsiteForShop'
import SelectStations from 'components/elements/FilterBox/SelectStations'
import SetStaffOfLeaderSaleB2C from 'components/elements/ActionBox/SetStaffOfLeaderSaleB2C'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import flatPickr from 'vue-flatpickr-component'
import VueMonthlyPicker from 'vue-monthly-picker'
import draggable from 'vuedraggable'

export default {
  name: 'AssignPkOnsite',
  components: {
    SelectStations,
    SelectDepartmentAndPositionJob,
    SelectUserGroup,
    LoadingMiniBottom,
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    InputTag,
    draggable,
    'select-b2c-sale-leader': SelectB2CSaleLeader,
    'set-staff': SetStaffOfLeaderSaleB2C,
    'select-shop': SelectShop,
    'select-pk-onsite': SelectPkOnsite,
    'assign-pk-onsite': AssignPkOnsiteForShop
  },
  data: () => ({
    success: true,
    appLoading: false,
    shop: {
      code: ''
    },
    countUpdate: 0,
    disableSelectFilterType: true,
    user: {
      fullname_username: [],
      fullname: '',
      username: '',
      staff_code: ''
    },
    listUsers: [],
    selected: {
      stations: [],
      staff_type: 0
    },
    filter_staff_options: [
      {value: '0', text: 'Hiện tất cả'},
      {value: '1', text: 'Chỉ hiện phụ kho được gán'}
    ],
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    },
    selected_pk_onsite: {}
  }),
  methods: {
    pageChanged (page) { // Event check pagination change
      this.searchPkOnsites(page)
      this.pageData.currentPage = page
    },
    updatePage (newTotal) {
      this.pageData.totalItems = newTotal
      this.pageData.totalPages = Math.ceil(newTotal / this.pageData.perPage)
    },
    searchPkOnsites (page, newSearchConditions) {
      let dataSend = {
        'full_name': this.user.fullname,
        'username': this.user.username,
        'national_id': this.user.national_id,
        'tel': this.user.tel,
        'email': this.user.email,
        'stations': this.selected.stations,
        'page': page,
        'staff_type': this.selected.staff_type
      }
      if (this.shop.code) {
        dataSend.shop_code = this.shop.code
      }
      // Truong hop nguoi dung tim kiem voi dieu kien loc moi
      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }

      if (this.selected.department !== null) {
        dataSend.department = this.selected.department
        if (this.selected.position_job !== null) {
          dataSend.position_job = this.selected.position_job
        }
      }

      // Enable loading
      this.$startLoading()
      this.countUpdate += 1
      shopService.searchPkOnsite(dataSend).then(response => {
        if (response.data.success) {
          this.pageData.totalItems = response.data.pagination.total
          this.pageData.perPage = response.data.pagination.per_page
          this.pageData.totalPages = response.data.pagination.total_page
          this.listUsers = response.data.data
        } else {
          this.success = false
        }
      }).then(() => {
        this.$stopLoading()
        this.countUpdate += 1
      })
    },
    selectedShop (result) {
      this.shop.code = result
      if (result) {
        this.disableSelectFilterType = false
      } else {
        this.shop.code = ''
        this.disableSelectFilterType = true
      }
    },
    selectedPkOnsite (result) {
      if (result) {
        this.user.fullname_username = result.split('-')
        this.user.fullname_username = this.user.fullname_username.map(val => val.trim())

        this.user.fullname = this.user.fullname_username[0]
        this.user.username = this.user.fullname_username[1]
        // this.disableSelectFilterType = false
      } else {
        this.user.fullname = ''
        this.user.username = ''
        // this.disableSelectFilterType = true
      }
    },
    resetForm () {
      this.selected_pk_onsite = {}
      this.user.fullname_username = null
      this.user.fullname = null
      this.user.username = null
      this.user.email = null
      this.selected.staff_type = 0
      this.selected.stations = []
      // Reset data of component select box
      // this.$refs.select_stations.reset()
      // this.$refs.select_groups.reset()
    },
    showDate (date) {
      this.selected.date = date
    }
  },
  created () {
    // this.searchPkOnsites(this.pageData.currentPage) // Get data users
  },
  computed: {
    totalItems () {
      return this.listUsers.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  watch: {
    'pageData.totalPages': function (newVal) {
      if (newVal) {
        this.searchPkOnsites()
      }
    }
    // 'user.username': function (val) {
    //   if (val) {
    //     this.searchPkOnsites()
    //   }
    //   return null
    // },
    // 'user.fullname': function (val) {
    //   if (val) {
    //     this.searchPkOnsites()
    //   }
    //   return null
    // },
    // 'selected.stations': function (val) {
    //   if (val) {
    //     this.searchPkOnsites()
    //   }
    // },
    // 'shop.code': function (val) {
    //   if (val) {
    //     this.searchPkOnsites()
    //   }
    //   return null
    // },
    // 'selected.staff_type': function (val) {
    //   if (val) {
    //     this.searchPkOnsites()
    //   }
    //   return null
    // }
  },
  metaInfo: {
    title: 'Quản lý phụ kho onsite'
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
</style>
