<template>
  <div>
    <div class="ui-block">
      <h2 class="text-center">Quản lý chiết khấu mới</h2>
      <div>
        <form>
          <div class="form-filter">
            <b-form-row>
              <div class="col-md-12">
                <b-form-group label="Gói chiết khấu">
                  <select-dd-type @selected="selected.deductionType = $event" ref="select_ddType"></select-dd-type>
                </b-form-group>
              </div>
            </b-form-row>
          </div>
          <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="loadingExcelHtml" v-if="loadingExcel" />
          <b-form-row>
            <div class="align-content-center center">
              <div class="col-md-12 text-center">
                <b-button
                  class="btn btn-success"
                  @click="searchNewDeductionDetail(pageData.currentPage, true)"
                >
                  Xem Chi tiết
                </b-button>
                <b-button
                  class="btn btn-success"
                  @click="exportNewDeductionType()"
                >
                  <i class="sidenav-icon ion ion-md-cloud-download"></i>
                  Xuất File Chi Tiết
                </b-button>
              </div>
            </div>
          </b-form-row>
        </form>
      </div>
      <div class="result" id="results" v-if="checkResult">
        <b-card no-body v-if="listDeductions.length > 0">
          <!-- / Table controls -->
          <div class="table-result">
            <!-- Pagination -->
            <b-card-body class="pt-0 pb-3">
              <div class="row">
                <div class="col-sm pt-3">
                  <b-pagination :total-rows="pageData.totalItems"
                                v-model="pageData.currentPage"
                                :per-page="pageData.perPage"
                                v-on:change="pageChanged"
                  />
                  Tổng số: {{ pageData.totalItems }}
                </div>
                <div class="col-sm text-sm-left text-center pt-3">
                  <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                </div>
              </div>
            </b-card-body>
            <!-- / Pagination -->
            <!-- Table -->
            <div class="table-responsive mb-4">
              <table class="table mb-0 table-bordered table-striped">
                <thead class="" style="width: 100%">
                <tr>
                  <th width="40%">Gói chiết khấu</th>
                  <th width="50%">Thông tin chi tiết</th>
                  <th width="10%">Thao tác</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="dataDeduction in listDeductions" class="tr-bill">
                  <td>
                    <span class="font-weight-bold">{{ dataDeduction.parent_name }} ({{ dataDeduction.name }})</span> <br/><br/>
                    <span class="font-weight-bold">Số lượng đơn hàng yêu cầu: <span class="text-danger">{{ dataDeduction.number_pkg }}</span></span>
                       <br/>
                  </td>
                  <td>
                    <span v-for="detail in dataDeduction.detail">
                      <span class="font-weight-bold">Ngưỡng cân (kg):
                        {{detail.weight_pkg_from }} &lt;<span v-if="[2, 7, 12, 23, 40].includes(parseInt(detail.id))">=</span> x &lt;= {{ detail.weight_pkg_to }}
                      </span>
                      <span class="font-weight-bold text-danger">(Số tiền giảm: {{ detail.reduce_value }}đ)</span>
                      <br/>
                    </span>
                  </td>
                  <td>
                    <div class="text-center">
                      <b-button
                        @click="editDeduction(dataDeduction)"
                        class="btn btn-primary"
                        :disabled="!isCanEdit"
                      >Sửa
                      </b-button>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </b-card>
        <update-deduction-config
          :activeModal="modalShow"
          :editDeduction="editDeductionData"
          @modal-show="modalShow = $event"
          @update-success="updateSuccess"
        ></update-deduction-config>
        <div class="no-data" v-if="listDeductions.length == 0">
          <b-alert show dismissible variant="warning">
            <i class="sidenav-icon ion ion-ios-warning"></i>
            Không có dữ liệu phù hợp, vui lòng thử lại.
          </b-alert>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import { SidenavRouterLink } from '@/vendor/libs/sidenav'
import UpdateDeductionConfig from 'components/pages/Deductions/UpdateDeductionConfig'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Multiselect from 'vue-multiselect'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import shopService from 'domain/services/shop-service'
import SelectDdType from 'components/elements/FilterBox/SelectDeductionType'

Vue.use(BlockUI)

export default {
  components: {
    SidenavRouterLink,
    LaddaBtn,
    Datepicker,
    Multiselect,
    UpdateDeductionConfig,
    SelectDdType
  },
  data: () => ({
    selected: {
      deductionType: ''
    },
    selectDeductionType: { name: 'CK BB_Đặc biệt', code: '1' },
    deductionType: [
      { name: 'CK BB_Đặc biệt', code: '1' }
    ],
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 50,
      sortBy: 'id',
      sortDesc: false
    },
    checkResult: false,
    listDeductions: [],
    isCanEdit: false,
    editDeductionData: [],
    modalShow: false,
    loadingExcel: false,
    loadingExcelHtml: `
      <div class="sk-folding-cube sk-primary">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
      </div>
      <h5 class="text-center mb-0">LOADING...</h5>
    `
  }),
  methods: {
    searchNewDeductionDetail: function (page, newSearchConditions) {
      let self = this
      let dataSend = {
        'deduction_parent_id': self.selected.deductionType,
        'page': page,
        'limit': self.pageData.perPage
      }
      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      self.loadingExcel = true
      shopService.searchNewDeductionDetail(dataSend).then(response => {
        if (response.data.success) {
          self.checkResult = response.data.success
          self.pageData.totalItems = response.data.options.total
          self.pageData.perPage = response.data.options.per_page
          self.pageData.totalPages = response.data.options.total_page
          self.listDeductions = response.data.options.deductions
          self.isCanEdit = response.data.options.canEdit
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.loadingExcel = false
      })
    },
    pageChanged: function (page) {
      this.searchNewDeductionDetail(page)
      this.pageData.currentPage = page
    },
    editDeduction: function (dataEdit) {
      this.editDeductionData = dataEdit
      this.modalShow = true
    },
    updateSuccess: function () {
      this.searchNewDeductionDetail(this.pageData.currentPage)
    },
    exportNewDeductionType: function () {
      shopService.exportNewDeductionType().then(response => {
        if (response.data.success) {
          window.location.href = response.data.data
        } else {
          let msg = response.data.msg ? response.data.msg : 'Có lỗi xảy ra. Hãy thử lại nhé!'
          alert(msg)
        }
      }).catch(error => {
        if (error) {
          alert('Có lỗi xảy ra. Hãy thử lại nhé!')
        }
      }).then(function () {
        self.loadingExcel = false
      })
    }
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
  .center {
    text-align: center;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .multiselect--active {
    z-index: 99;
  }
</style>
