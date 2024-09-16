<template>
  <div>
    <div class="ui-block">
      <h4 class="ui-block-heading">Quản lý đại lý</h4>
      <b-card class="col-sm-12">
        <template #header>
          <div class="d-flex justify-content-between">
            <div>
              <div v-if="!isMainShop">
                <h4 class="mb-0">Config đối soát cho đại lý</h4>
                <i class="pt-2 pb-2 d-inline-block">Lưu ý: khi sử dụng config này, tiền sẽ được đối soát về tài khoản của shop tổng </i>
              </div>
              <div v-if="isMainShop">
                <h4 class="mb-0">Config cho các tài khoản chính</h4>
              </div>
            </div>
            <div class="col-md-6">
              <b-form-group style="float: right;">
                <b-badge variant="success" class="tag-status area-mode font-size-1em" v-if="!isMainShop">Đại lý</b-badge>
                <b-badge variant="success" class="tag-status area-mode font-size-1em" v-if="isMainShop">Tài khoản chính</b-badge>
                <label class="switch">
                  <input type="checkbox" v-model="isMainShop">
                  <span class="slider round"></span>
                </label>
              </b-form-group>
            </div>
          </div>
        </template>
        <b-card-body class="pl-0 pr-0">
          <div v-if="!isMainShop" class="accordion" role="tablist">
            <!-- start master shop -->
            <b-card no-body class="mb-1" v-for="shop in masterShops" :key="shop.code">
              <div class="alert alert-secondary mb-0 d-flex flex-row" role="alert"
                :aria-expanded="shop.is_visible ? 'true' : 'false'">
                <div class="col-sm-9 d-flex flex-row" v-b-toggle="shop.code">
                  <i class="ion ion-ios-arrow-dropright-circle" v-show="!shop.is_visible"></i>
                  <i class="ion ion-ios-arrow-dropdown-circle" v-show="shop.is_visible"></i>
                  <h5 class="mb-0 ml-3">{{shop.code}} - {{shop.name}}</h5>
                </div>
              </div>
              <b-collapse :id="shop.code" accordion="my-accordion" role="tabpanel" v-show="shop.is_visible">
              <table class="table table-fixed"  v-if="branchShops.length > 0">
                <col style="width:80%"/>
                <col style="width:10%"/>
                <thead class="pl-0 pr-0">
                  <tr>
                    <th class="pl-5 align-middle" style="width:80%"> Thông tin shop</th>
                    <th class="text-center" style="width:10%">
                      <div>Báo cáo </div>
                      <div class="pt-2 pb-1">
                        <input type="checkbox" style="width:16px;height:16px" v-model="isReportAll" @change="configReportAll(isReportAll)">
                      </div>

                      </th>
                    <th class="text-center">
                       <div> Đối soát </div>
                       <div class="pt-2 pb-1">
                         <label class="switcher switcher-square " v-show="shop.is_visible && branchShops.length > 0" >
                         <input type="checkbox" class="switcher-input" v-model="isAuditAll" @change="configAuditAll(isAuditAll)">
                         <span class="switcher-indicator">
                              <span class="switcher-yes"></span>
                              <span class="switcher-no"></span>
                          </span>
                        </label>
                       </div>
                    </th>
                  </tr>

                </thead>
                <tbody class="branch_shops overflow-auto">
                  <tr v-for="branchShop in branchShops" :key="branchShop.shop_code">
                    <td class="pl-5" style="width:80%" > <h5 class="mt-3">{{branchShop.shop_code}} - {{branchShop.shop_name}}</h5></td>
                    <td class="text-center" style="width:10%">
                       <input type="checkbox" v-model="branchShop.is_report" style="width:16px;height:16px" @change="getReport(branchShop.is_report,branchShop)">
                    </td>
                    <td class="text-center">
                      <label class="switcher switcher-square">
                          <input type="checkbox" class="switcher-input" v-model="branchShop.is_audit" @change="getAudit(branchShop.is_audit,branchShop)">
                            <span class="switcher-indicator">
                                <span class="switcher-yes"></span>
                                <span class="switcher-no"></span>
                            </span>
                      </label>
                    </td>
                  </tr>
                </tbody>
               </table>
               <b-list-group v-if="branchShops.length == 0">
                  <b-list-group-item >
                    <h5 class="mt-2">Không có đại lý</h5>
                  </b-list-group-item>
                </b-list-group>
              </b-collapse>
            </b-card>
             <!-- end master shop -->
          </div>
          <div v-if="isMainShop">
            <b-card no-body class="mb-1" v-for="shop in mainShops" :key="shop.master_shop_code">
              <div class="alert alert-secondary mb-0 d-flex flex-row" role="alert"
                   :aria-expanded="shop.is_visible ? 'true' : 'false'">
                <div class="col-sm-9 d-flex flex-row" v-b-toggle="shop.master_shop_code">
                  <i class="ion ion-ios-arrow-dropright-circle" v-show="!shop.is_visible"></i>
                  <i class="ion ion-ios-arrow-dropdown-circle" v-show="shop.is_visible"></i>
                  <h5 class="mb-0 ml-3">{{shop.master_shop_code}} - {{shop.name}}</h5>
                </div>
              </div>
              <b-collapse :id="shop.master_shop_code" accordion="my-accordion" role="tabpanel" v-show="shop.is_visible">
                <table class="table table-fixed">
                  <thead class="pl-0 pr-0">
                  <tr>
                    <th class="pl-5 align-middle d-flex">
                      <p class="mr-3 mt-2">Thông tin shop</p>
                      <button class="btn btn-outline-success" @click="showAddBranchShop"><i class="ion ion-ios-add"></i> Thêm TK chi nhánh</button>
                    </th>
                    <th class="text-center" style="width:10%">
                      <div>Rút COD nhanh</div>
                    </th>
                    <th class="text-center" style="width:10%">
                      <div>Dùng chung ví</div>
                    </th>
                    <th class="text-center" style="width:10%">
                      <div>Báo cáo</div>
                    </th>
                  </tr>
                  </thead>
                  <tbody class="branch_shops overflow-auto">
                  <b-list-group v-if="shop.branch_shops.length === 0">
                    <b-list-group-item >
                      <h5 class="mt-2">Không có đại lý</h5>
                    </b-list-group-item>
                  </b-list-group>
                  <tr v-if="shop.branch_shops.length > 0" v-for="branchShop in shop.branch_shops" :key="branchShop.branch_shop_code">
                    <td class="pl-5" style="width:70%" >
<!--                      <div class="branch-shop-name p-2 d-flex rounded" @mouseover="isDeleteBranchShop = true" @mouseleave="isDeleteBranchShop = false">-->
                      <div class="p-2 d-flex rounded">
<!--                        <h5 class="mt-3" @mouseover="isDeleteBranchShop = true" @mouseleave="isDeleteBranchShop = false">-->
                        <h5 class="mt-3">
                          {{branchShop.branch_shop_code}} - {{branchShop.name}}
                          <i v-if="isDeleteBranchShop" @mouseover="isDeleteBranchShop = true" @mouseleave="isDeleteBranchShop = false" class="ion ion-ios-close"></i>
                        </h5>
                      </div>
                    </td>
                    <td class="text-center" style="width:10%">
                      <input class="mt-3" type="checkbox" @change="updateBranchAccount(branchShop, false)" v-model="branchShop.is_quick_cod" :disabled="branchShop.status !== 1" style="width:16px;height:16px">
                    </td>
                    <td class="text-center" style="width:10%">
                      <input class="mt-3" type="checkbox" @change="updateBranchAccount(branchShop, false)" v-model="branchShop.is_join_wallet" :disabled="branchShop.status !== 1" style="width:16px;height:16px">
                    </td>
                    <td class="text-center" style="width:10%">
                      <input class="mt-3" type="checkbox" @change="updateBranchAccount(branchShop, false)" v-model="branchShop.is_report" :disabled="branchShop.status !== 1" style="width:16px;height:16px">
                    </td>
                  </tr>
                  </tbody>
                  <tbody v-if="isAddBranchShop">
                    <tr>
                      <td class="pl-5 autocomplete">
                        <b-form-input
                          style="width:30%"
                          v-model="newBranchShop.code"
                          @input="searchShop"
                          @focusout="isToggleSearchShop = false"
                          type="text"
                          placeholder="Nhập mã shop"
                        />
                        <ul
                          class="autocomplete-results"
                          v-if="isToggleSearchShop"
                        >
                          <li
                            v-for="shop in listShopSearch"
                            class="autocomplete-result"
                            @click="selectShopResult(shop)"
                          >
                            <span @mousedown.prevent>{{shop.code}} - {{shop.name}}</span>
                          </li>
                        </ul>
                      </td>
                      <td class="text-center" style="width:10%">
                        <input class="mt-3" type="checkbox" v-model="newBranchShop.is_quick_cod" style="width:16px;height:16px">
                      </td>
                      <td class="text-center" style="width:10%">
                        <input class="mt-3" type="checkbox" v-model="newBranchShop.is_join_wallet" style="width:16px;height:16px">
                      </td>
                      <td class="text-center" style="width:10%">
                        <input class="mt-3" type="checkbox" v-model="newBranchShop.is_report" style="width:16px;height:16px">
                      </td>
                    </tr>
                    <tr v-if="isAddBranchShop" class="d-flex justify-content-center">
                      <button class="btn btn-outline-success mr-3" @click="clearContentAddShop">Hủy</button>
                      <button class="btn btn-success" @click="updateBranchAccount(shop, true)">Xác nhận</button>
                    </tr>
                  </tbody>
                </table>
              </b-collapse>
            </b-card>
          </div>
        </b-card-body>

         <!-- Pagination -->
        <b-card-body class="pt-0 pb-3" >
          <div class="row">
              <div class="col-sm pt-3">
                <b-pagination
                v-model="currentPage"
                :total-rows="this.totalPages"
                :per-page="perPage"
                v-on:change="pageChanged"
                ></b-pagination>
              </div>
          </div>
        </b-card-body>
      <!-- / Pagination -->

        <b-card-footer v-if="!isMainShop">
          <b-button variant="primary" class="float-right" @click="configBranch()">Lưu thông tin</b-button>
        </b-card-footer>

      </b-card>
    </div>
  </div>
</template>
<script>
import shopService from 'domain/services/shop-service'
export default {
  name: 'ManageBranch',
  data () {
    return {
      isMainShop: true,
      isAddBranchShop: false,
      masterShops: [],
      branchShops: [],
      mainShops: null,
      saveData: {},
      isAuditAll: false,
      isReportALl: false,
      currentPage: 1,
      perPage: 10,
      totalPages: 0,
      newBranchShop: {
        'code': null,
        'is_join_wallet': true,
        'is_quick_cod': true,
        'is_report': true
      },
      isDeleteBranchShop: false,
      listShopSearch: [],
      isToggleSearchShop: false
    }
  },
  methods: {
    getMasterShop: function (page) {
      this.$startLoading()
      shopService.getMasterShops(page).then(response => {
        if (response.data.success) {
          this.masterShops = response.data.data
          this.masterShops = this.masterShops.map(value => {
            value['is_visible'] = false
            return value
          })
          this.totalPages = response.data.totalPages
        } else {
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.$stopLoading()
      })
    },
    getBranchShop: function (masterShopCode, page) {
      this.$startLoading()
      this.branchShops = []
      shopService.getBranchByMasterShop(masterShopCode, page).then(response => {
        if (response.data.success) {
          this.branchShops = response.data.data
          var isAuditAll = true
          var isReportAll = true
          this.branchShops = this.branchShops.map(value => {
            var isAudit = value['is_audit'] !== '0'
            value['is_audit'] = isAudit
            if (!isAudit) {
              isAuditAll = false
            }

            var isReport = value['is_report'] !== '0'
            value['is_report'] = isReport
            if (!isReport) {
              isReportAll = false
            }
            return value
          })
          this.isAuditAll = isAuditAll
          this.isReportAll = isReportAll
        } else {
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.$stopLoading()
      })
    },
    getMainShop (page) {
      this.$startLoading()
      shopService.getMainShops(page, this.perPage).then(response => {
        if (response.data.success) {
          this.mainShops = response.data.data.data
          this.mainShops = this.mainShops.map(value => {
            value['is_visible'] = false
            return value
          })
          this.totalPages = response.data.data.total
        } else {
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.$stopLoading()
      })
    },
    getAudit: function (isAudit, shop) {
      this.saveData[shop.id] = {
        'id': shop.id,
        'is_audit': isAudit,
        'is_report': shop.is_report
      }
    },
    getReport: function (isReport, shop) {
      this.saveData[shop.id] = {
        'id': shop.id,
        'is_audit': shop.is_audit,
        'is_report': isReport
      }
    },
    configBranch () {
      if (this.saveData) {
        this.$startLoading()
        var data = Object.values(this.saveData)
        shopService.updateConfigBranch(data).then(response => {
          if (response.data.success) {
            this.$notify({
              group: 'default',
              type: 'text-white bg-success',
              title: 'Thông báo',
              text: response.data.message
            })
          } else {
            this.$notify({
              group: 'default',
              type: 'text-white bg-danger',
              title: 'Thông báo',
              text: response.data.message
            })
          }
        }).then(() => {
          this.saveData = {}
          this.$stopLoading()
        })
      }
    },
    configAuditAll (isAuditAll) {
      let branchCodes = this.branchShops
      branchCodes.forEach(shop => {
        shop.is_audit = isAuditAll
        this.saveData[shop.id] = {
          'id': shop.id,
          'is_audit': isAuditAll,
          'is_report': shop.is_report
        }
      })
      this.branchShops = branchCodes
    },
    configReportAll (isReportAll) {
      let branchCodes = this.branchShops
      branchCodes.forEach(shop => {
        shop.is_report = isReportAll
        this.saveData[shop.id] = {
          'id': shop.id,
          'is_report': isReportAll,
          'is_audit': shop.is_audit
        }
      })
      this.branchShops = branchCodes
    },
    pageChanged: function (currentPage) {
      this.currentPage = currentPage
      if (this.isMainShop) {
        this.getMainShop(this.currentPage)
      } else {
        this.getMasterShop(this.currentPage)
      }
    },
    showAddBranchShop () {
      this.isAddBranchShop = !this.isAddBranchShop
    },
    clearContentAddShop () {
      this.isAddBranchShop = false
      this.newBranchShop = {
        'code': null,
        'is_join_wallet': true,
        'is_quick_cod': true,
        'is_report': true
      }
    },
    searchShop () {
      this.isToggleSearchShop = true
      shopService.searchShopAutoComplete(this.newBranchShop.code).then(response => {
        if (response.status === 200) {
          this.listShopSearch = response.data.items
        }
      })
    },
    updateBranchAccount (shop, isCreate) {
      let data = {}
      if (isCreate) {
        data = {
          'master_shop_code': shop.master_shop_code,
          'branch_shop_code': this.newBranchShop.code,
          'is_quick_cod': this.newBranchShop.is_quick_cod,
          'is_join_wallet': this.newBranchShop.is_join_wallet,
          'is_report': this.newBranchShop.is_report,
          'created_user_id': this.$store.state.userInfo.User.id
        }
      } else {
        data = {
          'master_shop_code': shop.master_shop_code,
          'branch_shop_code': shop.branch_shop_code,
          'is_quick_cod': shop.is_quick_cod ? 1 : 0,
          'is_join_wallet': shop.is_join_wallet ? 1 : 0,
          'is_report': shop.is_report ? 1 : 0
        }
      }
      shopService.updateBranchAccount(data).then(response => {
        if (response.data.success) {
          if (isCreate) {
            this.$notify({
              group: 'default',
              type: 'text-white bg-success',
              title: 'Thông báo',
              text: 'Shop đã kích hoạt ví thành công. Vui lòng kiểm tra và thông báo tới shop tài khoản chính'
            })
            this.saveData = {}
            this.clearContentAddShop()
            this.getMainShop(this.currentPage)
          } else {
            this.$notify({
              group: 'default',
              type: 'text-white bg-success',
              title: 'Thông báo',
              text: 'Cập nhật thông tin shop thành công'
            })
          }
        } else {
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.saveData = {}
        this.$stopLoading()
      })
    },
    showDeleteBranchShop () {
      this.isDeleteBranchShop = true
    },
    selectShopResult (shop) {
      this.isToggleSearchShop = false
      this.newBranchShop.code = shop.code
    },
    handleClickOutside (event) {
      if (!this.$el.contains(event.target)) {
        this.isToggleSearchShop = false
      }
    }
  },
  created: function () {
    if (this.isMainShop) {
      this.getMainShop(this.currentPage)
    } else {
      this.getMasterShop(this.currentPage)
    }
  },
  mounted () {
    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      /**
       * tìm index trong array
       */
      if (this.isMainShop) {
        let shopIndex = this.mainShops.findIndex(value => value.master_shop_code === collapseId)
        if (shopIndex !== -1) {
          let shop = this.mainShops[shopIndex]
          shop.is_visible = isJustShown
          this.$set(this.mainShops, shopIndex, shop)
        }
      } else {
        let shopIndex = this.masterShops.findIndex(value => value.code === collapseId)
        if (shopIndex !== -1) {
          let shop = this.masterShops[shopIndex]
          shop.is_visible = isJustShown
          this.$set(this.masterShops, shopIndex, shop)
        }
        if (isJustShown) {
          this.getBranchShop(collapseId, 1)
        }
      }
    })
    document.addEventListener('click', this.handleClickOutside)
  },
  watch: {
    isMainShop: function (newVal) {
      if (newVal) {
        this.mainShops = null
        this.getMainShop(1)
      } else {
        this.masterShops = []
        this.getMasterShop(1)
      }
    }
  },
  destroyed () {
    document.addEventListener('click', this.handleClickOutside)
  }
}
</script>
<style scoped>
.branch_shops {
   max-height: 400px;
}
table {
    display: flex;
    flex-flow: column;
    width: 100%;
}
thead {
  padding: 20px ;
}
tbody {
    display: block;
    overflow-y: auto;
    overflow-x: hidden;
}
tr {
    width: 100%;
    display: table;
    table-layout: fixed;
}

.switch {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 30px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #02BC77;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

input[type="checkbox"] {
  accent-color: #41904b;
}

.font-size-1em {
  font-size: 1em !important;
  padding: 0.45em 0.417em;
  height: 30px !important;
}

.branch-shop-name {
  width: fit-content;
  cursor: pointer;
}

.branch-shop-name:hover {
  background: #D6D6D6;
  color: #F5F5F5;
  cursor: pointer;
}

.autocomplete {
  position: relative;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  min-height: 1em;
  max-height: 6em;
  overflow: auto;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 6px;
  cursor: pointer;
}

.autocomplete-result:hover {
  background-color: #41904b;
  color: white;
}
</style>
