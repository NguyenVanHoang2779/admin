<template>
  <b-row>
    <b-row class="col-md-12">
      <b-col md="12">
        <h2 v-if="isAdd">Thêm phiếu bảo dưỡng, sửa chữa</h2>
        <h2 v-else>Sửa phiếu bảo dưỡng, sửa chữa</h2>
      </b-col>
    </b-row>
    <b-row class="mt-3 col-md-12 dv-maintenance">
      <b-card-body class="col-md-12">
        <b-row>
          <b-col sm="12" md="4">
            <b-form-group label-cols-sm="3" label-cols-md="3">
              <span slot="label">Đại lý/garage <span class="text-danger">*</span></span>
              <single-select-maintain-agent  @onChange="selectedAgent" :agent="info.agent" :isHaveOrder="isHaveOrder"></single-select-maintain-agent>
            </b-form-group>
          </b-col>
          <b-col sm="12" md="1"></b-col>
          <b-col sm="12" md="4">
            <b-form-group label-cols-sm="3" label-cols-md="3">
              <span slot="label">Ngày bảo dưỡng <span class="text-danger">*</span></span>
              <v-date-picker :max-date="new Date()" color="green" placeholder="Chon thời gian" v-model="info.maintenance_date" locale="vi"/>
            </b-form-group>
          </b-col>
          <b-col sm="12" md="3"></b-col>
        </b-row>
        <b-row>
          <b-col sm="12" md="4">
            <b-form-group label-cols-sm="3" label-cols-md="3">
              <span slot="label">Số Km <span class="text-danger">*</span></span>
              <b-form-input
                v-model="info.number_distance"
                @update="convertMoney"
                :formatter="convertMoney"
                :disabled="isDisabledDistance"
                id="numberDistance"
                name="numberDistance"
                v-validate="{ max: 9 }"
                :class="{'is-danger': errors.has('numberDistance')}"
              >
              </b-form-input>
              <span v-show="errors.firstRule('numberDistance') == 'max'" class="help is-danger">Chỉ nhập số nhỏ hơn 9.999.999</span>
            </b-form-group>
          </b-col>
          <b-col sm="12" md="1"></b-col>
          <b-col sm="12" md="4">
            <b-form-group label-cols-sm="3" label-cols-md="3">
              <span slot="label">Tài xế phụ trách <span class="text-danger">*</span></span>
              <single-select-driver @onChange="selectedDriver" :user="info.driver"></single-select-driver>
            </b-form-group>
          </b-col>
          <b-col sm="12" md="3"></b-col>
        </b-row>
      </b-card-body>
    </b-row>
    <b-card class="mt-3 mt-repair col-md-12">
      <b-card-header class="col-md-12 d-flex justify-content-between">
        <h6>1. Gói bảo dưỡng, sửa chữa</h6>
        <b-button class="btn btn-outline-success px-3" size="sm" @click="addPackageMaintenance"><i class="ion ion-ios-add"></i> Thêm gói</b-button>
      </b-card-header>
      <b-card-body class="col-md-12 dv-card-body">
        <package-maintenance v-for="(pkg, index) in packages" :key="pkg.uniqId"
          :indexPackage="index"
          @removePackage="removePackage"
          :packageChoose="maintenanceOptions"
          @onUpdatePackage="onUpdatePackage"
          :packages="packages"
        >
        </package-maintenance>
      </b-card-body>
    </b-card>
    <b-card class="mt-3 mt-extern col-md-12">
      <b-card-header class="col-md-12"><h6>2. Sửa chữa phát sinh</h6></b-card-header>
      <b-card-body class="col-md-12 dv-card-body">
        <b-row v-for="(item, index) in lstCategoryExtern" :key="index">
          <b-col md="12">
            <b-form-group label-cols-sm="2" :label="item.name">
              <b-input-group>
                <multi-select-category-extern
                  @input="handleCategoryEngineOption(...arguments, item.id)"
                  company-type="1"
                  :maxSelectedMessage="'Bạn chỉ được gán tối đa 20 loại! vui lòng bỏ chọn nếu muốn thay đổi lựa chọn'"
                  :level="level"
                  :parentId="item.id"
                  :categoryExtern="categoryExternData[item.id]"
                  :multiple="true"
                  :maxSelected="20"
                  @removeCategoryExtern="removeCategoryExtern"
                >
                </multi-select-category-extern>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
    <b-card class="mt-3 mt-payment col-md-12">
      <b-card-header class="col-md-12"><h6>3. Thanh toán</h6></b-card-header>
      <!--Chi phí gói bảo dưỡng, chi phí sửa chữa phát sinh-->
      <b-card-body class="col-md-12 dv-card-body" style="margin-bottom: 20px;">
        <b-row>
          <b-col md="6">
            <b-row v-for="(pkg, index) in packages" :key="index">
              <b-col md="8">
                <b-form-group label-cols-sm="5" :label="'Chi phí gói bảo dưỡng ' + (parseInt(index) + 1)">
                  <span slot="label" class="d-flex flex-column">
                    <div>{{ 'Chi phí gói bảo dưỡng ' + (parseInt(index) + 1) }} <span class="text-danger">*</span></div>
                    <span>(Đã bao gồm VAT)</span>
                  </span>
                  <b-form-input
                    v-model="packages[index].price_package"
                    @update="convertMoney"
                    :formatter="convertMoney"
                    :id="`pricePackage-${index}`"
                    :name="`pricePackage-${index}`"
                    v-validate="{max: 11}"
                    :class="{'is-danger': errors.has(`pricePackage-${index}`)}"
                    :disabled="!((isHaveOrder && isOrderWrongMoney) || !isHaveOrder)"
                  >
                  </b-form-input>
                  <span v-show="errors.firstRule(`pricePackage-${index}`) == 'max'" class="help is-danger">Chỉ nhập số nhỏ hơn 999.999.999 </span>
                </b-form-group>
              </b-col>
              <!--<b-col md="4">
                <b-form-checkbox
                  :id="'vat_' + index"
                  class="maintenance-checkbox mt-2"
                  v-model="packages[index].isVatSelected"
                  @update="convertMoney"
                  :formatter="convertMoney"
                  :name="'vat_' + index"
                  value="1"
                  unchecked-value="0"
                ><i>Bao gồm VAT</i>
                </b-form-checkbox>
              </b-col>-->
            </b-row>
            <b-row v-if="isExtern">
              <b-col md="8">
                <b-form-group label-cols-sm="5">
                  <span slot="label" class="d-flex flex-column">
                    <div>Chi phí sửa chữa phát sinh <span class="text-danger">*</span></div>
                    <span>(Đã bao gồm VAT)</span>
                  </span>
                  <b-form-input
                    v-model="info.extern_cost"
                    @update="convertMoney"
                    :formatter="convertMoney"
                    id="externCost"
                    name="externCost"
                    v-validate="{ max: 11 }"
                    :class="{'is-danger': errors.has('externCost')}"
                    :disabled="!((isHaveOrder && isOrderWrongMoney) || !isHaveOrder)"
                  >
                  </b-form-input>
                  <span v-show="errors.firstRule('externCost') == 'max'" class="help is-danger">Chỉ nhập số nhỏ hơn 999.999.999 </span>
                </b-form-group>
              </b-col>
              <!--<b-col md="4">
                <b-form-checkbox
                  class="maintenance-checkbox mt-2"
                  v-model="info.extern_vat"
                  name="vat"
                  value="1"
                  unchecked-value="0"
                ><i>Bao gồm VAT</i></b-form-checkbox>
              </b-col>-->
            </b-row>
          </b-col>
        </b-row>
      </b-card-body>
      <!--Hóa đơn, Thuế-->
      <b-card-body class="col-md-12 dv-card-body">
        <b-row>
          <b-col md="6">
            <!-- số hóa đơn, ngày hóa đơn -->
            <b-button class="btn btn-outline-success px-3" size="sm" @click="addBilleMaintenance"> Thêm hóa đơn</b-button>
            <bill-maintenance v-for="(bill, index) in bills" :key="bill.uniqBillId"
                :indexBill="index"
                @removeBill="removeBill"
                @onUpdateBill="onUpdateBill"
                :bills="bills"
                :isHaveOrder="isHaveOrder"
                :isOrderWrongMoney="isOrderWrongMoney"
                :maintenanceDate="info.maintenance_date"
                @onUpdateNumberCost="onUpdateNumberCost"
            >
            </bill-maintenance>
            <!-- Tổng chi phí cần thanh toán -->
            <b-row>
              <b-col md="8">
                <b-form-group label-cols-sm="5">
                  <span slot="label" class="d-flex flex-column">
                    <div>Tổng chi phí cần thanh toán <span class="text-danger">*</span></div>
                    <span>(Đã bao gồm VAT)</span>
                  </span>
                  <b-form-input
                    v-model="info.number_cost"
                    id="numberCost"
                    name="numberCost"
                    @update="convertMoney"
                    :formatter="convertMoney"
                    v-validate="{max: 11}"
                    :class="{'is-danger': errors.has('numberCost')}"
                    :disabled="!((isHaveOrder && isOrderWrongMoney) || !isHaveOrder)"
                  >
                  </b-form-input>
                  <span v-show="errors.firstRule('numberCost') == 'max'" class="help is-danger">Chỉ nhập số nhỏ hơn 999.999.999 </span>
                </b-form-group>
              </b-col>
              <b-col md="4">
              </b-col>
            </b-row>
          </b-col>
          <b-col md="6">
            <b-row>
              <b-col md="12">
                <b-form-group label-cols-sm="4">
                  <span slot="label">Đối tượng thanh toán <span class="text-danger">*</span></span>
                  <b-form-select
                    v-model="paymentObjectSelect"
                    :options="paymentObjectOptions"
                    @change="onChangePaymentObject"
                  >
                  </b-form-select>
                  <b-form-input v-show="!paymentObjectSelect"
                                v-model="info.object_payment"
                                id="paymentObject"
                                name="paymentObject"
                                placeholder="Nhập đối tượng thanh toán"
                  >
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group label-cols-sm="4">
                  <span slot="label">Ảnh hóa đơn/ biên lai <span class="text-danger">*</span></span>
                  <template>
                    <div class="text-left">
                      <div v-for="(file, index) in fileDocuments" class="img-bounder mt-1 mb-4" :key="file.id">
                        <span @click="deleteFile($event, index, true)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                        <b-img
                          v-if="getFileType(file.type) === 'image'"
                          v-img="{group: `files`}" :src="file.link_file" :alt="file.name" class="rounded mt-2 mr-3" style="height: 135px; width: 128px;"
                        ></b-img>
                        <div v-else class="mt-2 mr-3">
                          <b-link @click="openLink(file.link_file)" class="mr-3">
                            <h4><b-badge variant="primary">{{file.name}}</b-badge></h4>
                          </b-link>
                        </div>
                      </div>
                      <div v-for="(file, index) in fileAdded" class="img-bounder mt-1 mb-4" :key="index">
                        <span @click="deleteFile($event, index, false)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                        <a href="javascript:void(0)">
                          <b-img
                            v-if="getFileType(file.type) === 'image'"
                            :src="getUrl(file)" :alt="file.name" class="rounded mt-2 mr-3" style="height: 135px; width: 128px;"
                          >
                          </b-img>
                          <b-link v-else class="mr-3">
                            <h4><b-badge variant="primary">{{file.name}}</b-badge></h4>
                          </b-link>
                        </a>
                      </div>
                      <div class="img-bounder mt-1 mb-4">
                        <b-form-group class="dragdrop font-size">
                          <b-form-file
                            accept="image/*, .pdf"
                            v-model="fileAddSub"
                            multiple
                            placeholder="+"
                            :file-name-formatter="formatNames"
                          >
                          </b-form-file>
                        </b-form-group>
                      </div>
                    </div>
                  </template>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
    <b-row class="mt-3 text-center col-md-12">
      <b-col md="12"><b-button variant="success" @click="updateTruckMaintenanceV2" :disabled="addBtnDisabled" style="width: 300px;margin-top: 20px;margin-bottom: 50px;">Thêm/Cập nhật phiếu</b-button></b-col>
    </b-row>
  </b-row>
</template>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import Vue from 'vue'
import Viewer from 'v-viewer'
import VueImg from 'v-img'
import 'viewerjs/dist/viewer.css'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SingleSelectDriver from 'components/elements/common/SingleSelectDriver'
import SingleSelectMaintainAgent from 'components/elements/common/SingleSelectMaintainAgent'
import MultiSelectCategoryExtern from 'components/elements/common/MultiSelectCategoryExtern'
import PackageMaintenance from 'components/pages/erp/Truck/PackageMaintenance'
import BillMaintenance from 'components/pages/erp/Truck/BillMaintenance'
import moment from 'moment'

Vue.use(Viewer)
Vue.use(VueImg, {
  altAsTitle: true
})

export default {
  name: 'update-trucks-maintenanceV2',
  components: {
    SingleSelectDriver,
    SingleSelectMaintainAgent,
    MultiSelectCategoryExtern,
    PackageMaintenance,
    BillMaintenance
  },

  props: [
  ],

  data: () => ({
    agents: [
      {text: 'THACO', value: 1}
    ],
    truckData: {},
    truckId: null,
    addBtnDisabled: false,
    info: {
      id: null,
      maintenance_date: null,
      maintenance_agent: null,
      number_cost: '',
      details: [],
      driver_id: '',
      number_distance: '',
      more_details: '',
      fileDocuments: [],
      fileAdded: [],
      fileDeleted: [],
      driver: {},
      agent: {},
      price_package: '',
      price_incurred: '',
      object_payment: '',
      extern_cost: '',
      extern_vat: null,
      fileAddedRoot: 0,
      invoice_no: '',
      invoice_date: '',
      price_before_tax: '',
      tax: 10,
      number_cost_calculate: 0
    },
    level: 2,
    pCategoryIds: '',
    lstCategoryExtern: [],
    categoryExternData: {},
    maintenanceOptions: [
      {text: 'Lốp', value: 7},
      {text: 'Ắc quy', value: 8},
      {text: 'BD 60,000 km', value: 9},
      {text: 'BD 120,000 km', value: 10},
      {text: 'BD 5,000 km', value: 2},
      {text: 'BD 10,000 km', value: 3},
      {text: 'BD 20,000 km', value: 4},
      {text: 'BD 40,000 km', value: 5},
      {text: 'BD 80,000 km', value: 6},
      {text: 'Khác', value: 1}
    ],
    paymentObjectOptions: [
      {text: 'Công ty thanh toán', value: 'Công ty thanh toán'},
      {text: 'Bảo hiểm chi trả', value: 'Bảo hiểm chi trả'},
      {text: 'Lái xe tự trả', value: 'Lái xe tự trả'},
      {text: 'Bên thứ 3 bồi thường', value: 'Bên thứ 3 bồi thường'},
      {text: 'Khác', value: null}
    ],
    packageType: '',
    packageSelected: [],
    paymentObjectSelect: 'Công ty thanh toán',
    packages: [],
    files: [],
    fileAdd: [],
    fileDelete: [],
    fileDocuments: [],
    fileAdded: [],
    fileAddedRoot: 0,
    fileDeleted: [],
    fileAddSub: [],
    isExtern: 0,
    isDisabledDistance: false,
    isHaveOrder: false,
    isOrderWrongInfo: false,
    isOrderWrongMoney: false,
    bills: []
  }),

  created () {
    commonHelper.validateStatusEcomTruckFlow()
    // get info bảo dưỡng
    this.getCategoryExternList()
    if (this.isAdd) {
      if (!this.truckId) {
        if (this.$route.params.id) {
          this.truckId = this.$route.params.id
        }
      } else {
        this.truckId = this.truckId
      }
    } else {
      // load chi tiết bảo dưỡng
      this.isDisabledDistance = true
      if (this.$route.params.id) {
        this.getTruckMaintenance()
      }
    }
    if (this.$route.query.dateMaintenance) {
      this.info.maintenance_date = new Date(this.$route.query.dateMaintenance)
    }
    this.checkPermission()
  },

  watch: {
    fileAddSub: {
      handler: function (value) {
        this.fileAdded.push(...value)
      },
      deep: true
    }
  },

  computed: {
    isAdd: function () {
      return this.$route.name === 'add-trucks-maintenance'
    },

    isEdit: function () {
      return this.$route.name === 'edit-trucks-maintenance'
    }
  },
  mounted () {
  },

  methods: {
    updateTruckMaintenanceV2 () {
      // check required
      let dataSend = new FormData()
      if (this.info.id) {
        dataSend.append('id', this.info.id)
      }
      if (!this.truckId) return commonHelper.showMessage('Không có dữ liệu xe tải', 'warn')
      if (!this.info.agent.id) return commonHelper.showMessage('Chưa chọn đại lý bảo dưỡng', 'warn')
      if (!this.info.maintenance_date) return commonHelper.showMessage('Chưa có ngày bảo dưỡng', 'warn')
      if (!this.info.driver.id) return commonHelper.showMessage('Chưa gán tài xế phụ trách', 'warn')
      let numberDistance = this.covertNumberInput(this.info.number_distance)
      let maintenanceExterns = {}
      maintenanceExterns = this.getMaintenanceExterns()
      if (!numberDistance) return commonHelper.showMessage('Chưa có số Km', 'warn')
      if (!this.packages.length && JSON.stringify(maintenanceExterns) === '{}') return commonHelper.showMessage('Vui lòng chọn ít nhất 1 loại sửa chữa phát sinh', 'warn')
      if (JSON.stringify(maintenanceExterns) === '{}') this.isExtern = 0
      if (this.isExtern && (!this.info.extern_cost || this.info.extern_cost < 1000)) return commonHelper.showMessage('Bạn chưa điền chi phí sửa chữa phát sinh hoặc Chi phí sửa chữa phát sinh phải nhập ít nhất 4 kí tự số', 'warn')
      if (!this.info.number_cost) return commonHelper.showMessage('Vui lòng nhập tổng chi phí cần thanh toán', 'warn')
      if ((this.fileAdded.length + this.fileDocuments.length - this.fileDeleted.length) > 10) return commonHelper.showMessage('Không được up quá 10 ảnh', 'warn')
      if ((this.fileAdded.length + this.fileDocuments.length - this.fileDeleted.length) === 0) return commonHelper.showMessage('Không được thiếu tài liệu/ảnh phiếu bảo dưỡng', 'warn')

      // Validate các line hóa đơn của phiếu và tổng tiền tự tính theo công thức
      let numberCost = this.info.number_cost
      let numberCostCalculate = 0
      if (this.bills.length) {
        for (let i = 0; i < this.bills.length; i++) {
          if (!this.bills[i].invoice_no) return commonHelper.showMessage('Bạn chưa điền số hóa đơn thứ ' + (i + 1), 'warn')
          if (!this.bills[i].invoice_date) return commonHelper.showMessage('Bạn chưa điền ngày hóa đơn thứ ' + (i + 1), 'warn')
          if (moment(this.bills[i].invoice_date).format('YYYY-MM-DD') < moment(this.info.maintenance_date).format('YYYY-MM-DD')) {
            return commonHelper.showMessage('Ngày hóa đơn thứ ' + (i + 1) + ' phải lớn hơn hoặc bằng ngày bảo dưỡng', 'warn')
          }
          if (!this.bills[i].price_before_tax || this.bills[i].price_before_tax <= 0) return commonHelper.showMessage('Bạn chưa điền đơn giá trước thuế thứ ' + (i + 1), 'warn')
          // Tổng tiền tự tính theo công thức
          let priceBeforeTaxLine = this.bills[i].price_before_tax ? this.covertNumberInput(this.bills[i].price_before_tax) : 0
          let taxLine = this.bills[i].tax ? this.covertNumberInput(this.bills[i].tax) : 0
          numberCostCalculate += this.covertNumberInput(Math.round(priceBeforeTaxLine + priceBeforeTaxLine * taxLine / 100))
        }
      }

      // Validate tổng chi phí so với: chi phí sữa chữa phát sinh, chi phí các gói bảo dưỡng
      this.info.number_cost_calculate = numberCostCalculate
      let externCost = (this.isExtern) ? this.covertNumberInput(this.info.extern_cost) : 0
      let maxNumberCost = Math.abs(this.info.number_cost_calculate - this.covertNumberInput(numberCost))
      let totalPricePackages = 0
      if (this.packages.length) {
        this.packages.forEach(item => {
          let pricePackage = item.price_package ? item.price_package : 0
          totalPricePackages += this.covertNumberInput(pricePackage)
        })
      }
      if (maxNumberCost > 5) {
        return commonHelper.showMessage('Tổng chi phí cần thanh toán tự điền tay phải nhỏ hơn hoặc bằng 5 đồng so với công thức tự tính', 'warn')
      } else {
        if (this.covertNumberInput(numberCost) !== (externCost + totalPricePackages)) {
          return commonHelper.showMessage('Tổng chi phí cần thanh toán không bằng tổng chi phí các gói sửa chữa, bảo dưỡng phát sinh', 'warn')
        }
      }

      dataSend.append('truck_id', this.truckId)
      dataSend.append('driver_id', this.info.driver.id)
      dataSend.append('number_distance', numberDistance)
      dataSend.append('maintenance_agent', this.info.agent.id)
      dataSend.append('number_cost', this.covertNumberInput(numberCost))
      dataSend.append('cate_extern', JSON.stringify(maintenanceExterns) || [])
      dataSend.append('extern_cost', this.covertNumberInput(this.info.extern_cost))
      dataSend.append('extern_vat', this.info.extern_vat)
      dataSend.append('object_payment', this.info.object_payment ? this.info.object_payment : this.paymentObjectSelect)
      dataSend.append('package', JSON.stringify(this.packages))
      dataSend.append('bills', JSON.stringify(this.bills))
      dataSend.append('number_cost_calculate', this.info.number_cost_calculate)
      this.addBtnDisabled = true
      if (this.info.more_details) dataSend.append('more_details', this.info.more_details)
      if (this.info.maintenance_date) dataSend.append('maintenance_date', moment(this.info.maintenance_date).format('YYYY-MM-DD'))

      dataSend.append('invoice_no', this.info.invoice_no)
      dataSend.append('price_before_tax', this.covertNumberInput(this.info.price_before_tax))
      dataSend.append('tax', this.info.tax)

      if (this.fileAdded.length) {
        for (let i = 0; i < this.fileAdded.length; i++) {
          dataSend.append('files[' + i + ']', this.fileAdded[i])
        }
      }
      if (this.fileDeleted.length) dataSend.append('deleteDocs', JSON.stringify(this.fileDeleted))

      // Check thao tác sửa chữa phát sinh hay là nghiệm thu
      let action = ''
      if (this.$route.query.action) action = this.$route.query.action
      dataSend.append('action', action)

      CompanyProfileService.addTruckMaintenanceV2(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.$router.push({name: 'edit-vehicle-company', params: { id: this.truckId }})
        } else {
          commonHelper.showMessage(response.data.message, 'warn')
        }
      }).catch((e) => {
        commonHelper.showMessage('Đã có lỗi xảy ra', 'warn')
        console.error(e)
        this.addBtnDisabled = true
      }).then(() => {
        this.addBtnDisabled = false
      })
    },
    openLink (linkFile) {
      if (linkFile) {
        window.open(linkFile, '_blank')
      } else {
        commonHelper.showMessage('Chưa có tài liệu', 'warn')
      }
    },
    formatNames (files) {
      // if (files) return `${files.length} files selected`
      return '+'
    },
    getUrl (file) {
      return URL.createObjectURL(file)
    },
    getFileType (file) {
      if (!file) return null
      let ext = ''
      if (typeof file === 'string') { // là link
        ext = file.split('?').shift().split('.').pop().toLowerCase()
      } else ext = file.name.split('.').pop().toLowerCase() // là File

      if (file.indexOf('image') === 0) {
        if (['image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/svg'].includes(ext)) return 'image'// là ảnh
      }

      if (['jpeg', 'png', 'gif', 'tiff', 'psd', 'jpg', 'eps', 'ai', 'indd', 'raw', 'bmp', 'svg'].includes(ext)) return 'image'// là ảnh
      if (['pdf'].includes(ext)) return 'pdf' // là pdf
      if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) return 'doc' // là doc
      if (['xls', 'xlsx', 'xlsb'].includes(ext)) return 'excel' // là excel
      if (['txt', 'csv'].includes(ext)) return 'text' // là text
      if (['mpeg', 'mp4', 'avi', 'ts', 'webm', '3gp', '3g2'].includes(ext)) return 'video' // là video
      if (['mp3', 'aac', 'ogg', 'opus', 'wav'].includes(ext)) return 'audio' // là audio
      if (['zip', 'rar', '7z', 'tar'].includes(ext)) return 'zip' // là file nén
      return 'other'
    },
    deleteFile (event, indexFile, uploaded) {
      if (uploaded) {
        if (event.target.classList.contains('ion-md-close-circle')) {
          this.fileDeleted.push(this.fileDocuments[indexFile].id)
          event.target.setAttribute('title', 'Lấy lại')
          this.fileDocuments[indexFile] = []
        } else {
          let index = this.fileDeleted.indexOf(this.fileDocuments[indexFile].id)
          if (index >= 0) {
            this.fileDeleted.splice(index, 1)
            event.target.setAttribute('title', 'Xóa')
            this.fileDocuments[index] = []
          }
        }
        event.target.classList.toggle('ion-md-close-circle')
        event.target.classList.toggle('ion-md-refresh-circle')
        event.target.nextElementSibling.classList.toggle('file-deleted')
      } else {
        this.fileAddedRoot = this.fileAdded.length
        this.fileAdded.splice(indexFile, 1)
      }
    },

    covertNumberInput (number) {
      return +(number + '').replace(/\D/g, '')
    },
    convertMoney (money) {
      let result = (money + '').replace(/\D/g, '')
      return commonHelper.formatMoney(+result)
    },
    selectedAgent (option) {
      this.info.agent = option
    },
    selectedDriver (option) {
      this.info.driver = option
    },
    getTruckMaintenance () {
      this.$startLoading()
      CompanyProfileService.getTruckMaintenance({id: this.$route.params.id}).then(response => {
        if (response.data.success) {
          let info = response.data.data
          if (info.maintenance_date) this.info.maintenance_date = new Date(info.maintenance_date)
          this.categoryExternData = info.cate_extern
          this.info.type = info.type
          this.info.maintenance_agent = info.maintenance_agent
          this.info.number_distance = this.convertMoney(info.number_distance)
          this.info.number_cost = this.convertMoney(info.number_cost)
          this.info.number_cost_calculate = this.covertNumberInput(info.number_cost)
          this.info.driver_id = info.driver_id
          this.info.driver = info.driver
          this.info.agent = info.agent
          this.info.id = info.id
          this.info.extern_cost = this.convertMoney(info.extern_cost)
          this.info.extern_vat = info.extern_vat
          this.info.object_payment = info.object_payment
          this.addOptionPaymentObject()
          this.truckId = info.truck_id
          this.fileDocuments = info.documents
          this.packages = info.packages
          this.bills = info.bills
          if (this.categoryExternData.length !== 0) this.isExtern = 1
        } else {
          commonHelper.showMessage(response.data.message, 'warn')
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },
    getTruckDetail () {
      this.$startLoading()
      let dataRequest = {
        truck_id: this.$route.params.id
      }
      CompanyProfileService.getTruckDetail(dataRequest).then(response => {
        if (response.data.success) {
          let info = response.data.data
          this.truckData = info.Truck
        } else {
          commonHelper.showMessage(response.data.message, 'warn')
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },
    handleCategoryEngineOption (options, parentId) {
      let maintenanceExterns = {}
      if (!this.categoryExternData[parentId]) {
        this.$set(this.categoryExternData, parentId, options)
      } else this.categoryExternData[parentId] = options
      maintenanceExterns = this.getMaintenanceExterns()
      if (JSON.stringify(maintenanceExterns) !== '{}') this.isExtern = 1
    },
    getCategoryExternList: function () {
      let dataSend = {
        level: 1
      }
      CompanyProfileService.getCategoryExtern(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.lstCategoryExtern = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    },
    addPackageMaintenance () {
      this.packages.push({uniqId: Date.now() + Math.floor(Math.random() * 1000)})
    },
    onChangePaymentObject (val) {
      this.info.object_payment = val
    },
    addOptionPaymentObject () {
      let existed = this.paymentObjectOptions.find(e => e.value === this.info.object_payment)
      if (!existed && this.info.object_payment) this.paymentObjectOptions.unshift({text: this.info.object_payment, value: this.info.object_payment})
      this.paymentObjectSelect = this.info.object_payment || null
    },
    removePackage (pkgIdx) {
      this.packageSelected = this.packageSelected.map(item => item.value !== this.packages[pkgIdx].type)
      this.packages.splice(pkgIdx, 1)
    },
    onUpdatePackage ({id, data}) {
      this.packages[id] = data
    },
    removeCategoryExtern ({ categoryExternOption, parentId }) {
      let maintenanceExterns = {}
      this.categoryExternData[parentId].forEach((e, index) => {
        if (e.id === categoryExternOption.id) {
          this.categoryExternData[parentId].splice(index, 1)
        }
      })
      maintenanceExterns = this.getMaintenanceExterns()
      if (JSON.stringify(maintenanceExterns) === '{}') this.isExtern = 0
    },
    getMaintenanceExterns () {
      let maintenanceExterns = {}
      if (this.lstCategoryExtern.length) {
        this.lstCategoryExtern.forEach(externId => {
          let element = this.categoryExternData[externId.id]
          if ((element && !element.length) || element === 'undefined') {
          } else {
            maintenanceExterns[externId.id] = element
          }
        })
      }
      return maintenanceExterns
    },
    checkPermission: function () {
      let params = {
        provider_id: null
      }
      if (!this.isAdd && this.$route.params.id) {
        params.id = this.$route.params.id
      }
      CompanyProfileService.checkPermission(params)
        .then(res => {
          // Quyền kỹ thuật xe tải
          if (res.data.isPermissionEngineer) {
            this.isDisabledDistance = false
          }
          // Check tồn tại đề xuất, đx báo sai thông tin
          if (res.data.isHaveOrder) {
            this.isHaveOrder = true
          }
          // Check đx báo sai thông tin
          if (res.data.isOrderWrongInfo && !this.isAdd) {
            this.isOrderWrongInfo = res.data.isOrderWrongInfo
          }
          // Check đx báo sai tiền
          if (res.data.isOrderWrongMoney && !this.isAdd) {
            this.isOrderWrongMoney = res.data.isOrderWrongMoney
          }
        })
        .catch(err => {
          console.log('Has error in check permission rent truck', err)
        })
    },
    addBilleMaintenance () {
      if (!this.isHaveOrder) {
        this.bills.push({uniqBillId: Date.now() + Math.floor(Math.random() * 1000)})
      } else {
        return commonHelper.showMessage('Không thể thao tác thêm hóa đơn đc do phiếu đã sinh đề xuất rồi', 'warn')
      }
    },
    onUpdateBill ({id, data}) {
      this.bills[id] = data
    },
    removeBill (billIdx) {
      if (!this.isHaveOrder) {
        this.bills.splice(billIdx, 1)
      } else {
        return commonHelper.showMessage('Xóa hóa đơn không thành công do đã tồn tại đề xuất', 'warn')
      }
    },
    onUpdateNumberCost ({indexBill, number, tax, onchange}) {
      number = (number !== undefined && number !== null) ? number : 0
      tax = (tax !== undefined) ? tax : 10
      let numberCost = 0
      if (this.bills.length) {
        for (let i = 0; i < this.bills.length; i++) {
          let priceBeforeTaxLine = this.bills[i].price_before_tax ? (indexBill === i ? this.covertNumberInput(number) : this.covertNumberInput(this.bills[i].price_before_tax)) : 0
          let taxLine = this.bills[i].tax ? (indexBill === i ? this.covertNumberInput(tax) : this.covertNumberInput(this.bills[i].tax)) : 0
          numberCost += this.covertNumberInput(Math.round(priceBeforeTaxLine + priceBeforeTaxLine * taxLine / 100))
        }
      }
      this.info.number_cost = (onchange) ? this.convertMoney(numberCost) : this.convertMoney(this.info.number_cost_calculate)
    }
  }
}
</script>

<style scoped>
.div-file-type {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 3px;
  /* max-width: 200px; */
}
.doc-img {
  height: 0px;
  visibility: hidden;
}
.span-file-type {
  font-size: 15px;
  font-weight: 500;
  color: #8c8c8c;
  line-height: 2;
}
.img-bounder {
  position: relative;
  display: inline-block;
}
.img-bounder:hover > .btn-disable-file {
  display: inline;
}
.file-deleted {
  opacity: 0.1;
}
.btn-disable-file {
  font-size: 20px;
  display: none;
  position: absolute;
  top: -10px;
  right: 6px;
}
.dragdrop {
  font-size: '70px';
  position: relative;
  width: 8rem;
}
.dragdrop >>> .custom-file-label {
  border: 4px dotted green;
  height: 71px;
  width: 71px;
  line-height: 71px;
  text-align: center;
  color: green;
  padding: 0;
  margin-top: 0.5rem;
}
.custom-file-input {
  height: calc(1.25rem + 2px) !important;
}

.dragdrop .custom-file:hover >>> .custom-file-label {
  background: rgb(15, 182, 79);
  color: #fff;
}

.dragdrop >>> .custom-file-label::after {
  display: none;
}
</style>
<style>
.vc-text-base {
  font-size: 14px;
}
.check-box-add {
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-bottom: 1 darkgray;
  margin-left: 2rem;
}
.maintenance-checkbox .custom-checkbox {
  margin-top: 8px;
  width: 24.2rem;
}
.maintenance-checkbox .custom-control-label {
  margin-left: 8px;
}
.dv-title {
  margin-top: 40px;
  font-weight: bold;
}
.mt-extern .col-form-label {text-align: right;}

.delete-btn {
  margin-left: 6rem;
  margin-top: -10px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  padding: 0;
}
.card-header {
  border-bottom: none !important;
}
.dv-card-body {
  border: 1px solid #e2e2e2;
}
.card-header.col-md-12 {
  padding: 0.875rem 0;
}
.is-danger {
  border-color: #E0B4B4;
  color: #9F3A38;
  box-shadow: none;
}
</style>
