<template>
  <b-row>
    <b-row class="col-md-12">
      <b-col md="12">
        <h2 v-if="isAdd">Thêm phiếu bảo dưỡng, sửa chữa</h2>
        <h2 v-else>Sửa phiếu bảo dưỡng, sửa chữa</h2>
      </b-col>
    </b-row>
    <b-row class="mt-3 col-md-12">
      <b-col md="6">
        <b-form-group label-cols-sm="4" label="Loại bảo dưỡng">
          <b-form-select v-model="info.type" :options="maintenanceOptions" name="maintenance_type">
              <template v-slot:first>
                  <option :value="null" disabled>-- Chọn loại bảo dưỡng --</option>
              </template>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label-cols-sm="4" label="Ngày bảo dưỡng">
          <v-date-picker :max-date="new Date()" color="green" placeholder="Chon thoi gian" v-model="info.maintenance_date" locale="vi"/>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label-cols-sm="4" label="Đại lý/garage">
          <!-- <b-form-select v-model="info.maintenance_agent" :options="agents" name="maintenance_agent">
                <template v-slot:first>
                    <option :value="null" disabled>-- Chọn đại lý --</option>
                </template>
            </b-form-select> -->
          <single-select-maintain-agent  @onChange="selectedAgent" :agent="info.agent"></single-select-maintain-agent>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label-cols-sm="4" label="Tài xế phụ trách">
          <single-select-driver @onChange="selectedDriver" :user="info.driver"></single-select-driver>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label-cols-sm="4" label="Số Km">
          <b-form-input v-model="info.number_distance" @update="convertMoney" :formatter="convertMoney"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-card class="mt-3 col-md-12">
      <b-card-header class="col-md-12"><h6>1. Hạng mục bảo dưỡng, sửa chữa</h6></b-card-header>
      <b-card-body class="col-md-12" >
        <b-form-checkbox-group
          class="maintenance-checkbox col-md-8"
          id="checkbox-group-1"
          v-model="categoriesSelected"
          :options="categories"
          name="flavour-1"
        ></b-form-checkbox-group>
        <!-- <b-form-input class="ml-2 mt-3 col-md-5 check-box-add" name="add-component" v-model="info.more_details" placeholder="Khác"></b-form-input> -->
      </b-card-body>
      <b-card-header class="h6 col-md-12">2. Hạng mục sửa chữa phát sinh</b-card-header>
      <b-card-body class="col-md-12">
        <b-form-checkbox-group
          class="maintenance-checkbox col-md-8"
          id="checkbox-group-2"
          v-model="categoryExternsSelected"
          :options="categoryExterns"
          name="flavour-1"
        ></b-form-checkbox-group>
        <div class="pr-3 col-md-12">
          <b-row class="mt-1" align-h="between" v-for="(newExterData, index) in categoryNewExternData" :key="index">
            <b-form-input class="check-box-add col-md-3" v-model="newExterData.name" placeholder="Khác"></b-form-input>
            <b-form-input class="col-md-3" name="maintenance-cost" v-model="newExterData.value" :formatter="convertMoney" placeholder="Nhập giá phụ tùng, vật tư"></b-form-input>
          </b-row>
          <b-button v-if="categoryNewExternData.length <= 20" class="mt-3" size="sm" variant="success" title="Thêm sửa chữa phát sinh" @click="categoryNewExternData.push({name:'',value:''})"><i class="ion ion-ios-add"></i></b-button>
        </div>
      </b-card-body>
      <b-row align-v="center" align-h="between" class="ml-0 card-header col-md-12">
        <h6 class="col-md-3 pl-0 pt-7">3. Chi phí bảo dưỡng, sửa chữa</h6>
        <b-form-input class="col-md-4" name="maintenance-pay" v-model="info.number_pay" :formatter="convertMoney" placeholder="Nhập tổng tiền thanh toán đã có VAT"></b-form-input>
      </b-row>
      <b-card-body class="col-md-12">
      </b-card-body>
       <b-card-header class="col-md-12"><h6>4. Phiếu báo giá bảo dưỡng, sửa chữa</h6></b-card-header>
        <b-card-body class="col-md-12" >
          <template>
            <div class="text-left">
              <div v-for="(file, index) in info.fileDocuments" class="img-bounder mt-1 mb-4" :key="file.id">
                <span @click="deleteFile($event, index, true)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                <b-img
                  v-if="file.type.indexOf('image') === 0"
                  v-img="{group: `files`}" :src="file.link_file" :alt="file.name" class="rounded mt-2 mr-3" style="height: 150px;"
                ></b-img>
                <div v-else class="mt-2 mr-3">
                  <b-link @click="openLink(file.link_file)" class="mr-3">
                    <h4><b-badge variant="primary">{{file.name}}</b-badge></h4>
                  </b-link>
                </div>
              </div>
              <div v-for="(file, index) in info.fileAdded" class="img-bounder mt-1 mb-4" :key="index">
                <span @click="deleteFile($event, index, false)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                <a href="javascript:void(0)">
                  <b-img
                    v-if="file.type.indexOf('image') === 0"
                    :src="getUrl(file)" :alt="file.name" class="rounded mt-2 mr-3" style="height: 150px;"
                  >
                  </b-img>
                  <b-link v-else class="mr-3">
                    <h4><b-badge variant="primary">{{file.name}}</b-badge></h4>
                  </b-link>
                </a>
              </div>
              <div class="img-bounder mt-1 mb-4" v-if="(info.fileDeleted.length && info.fileAdded.length < 1) || (!info.fileDeleted.length && info.fileDocuments.length < 1 && info.fileAdded.length < 1)">
                <b-form-group class="dragdrop font-size">
                  <b-form-file
                    accept="image/*, .pdf"
                    v-model="info.fileAdded"
                    multiple
                    placeholder="+"
                    :file-name-formatter="formatNames"
                  >
                  </b-form-file>
                </b-form-group>
              </div>
            </div>
          </template>
        </b-card-body>
        <b-row class="mt-3 text-right col-md-12">
          <b-col md="12"><b-button variant="success" @click="updateTruckMaintenance" :disabled="addBtnDisabled">Cập nhật</b-button></b-col>
        </b-row>
    </b-card>
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
import moment from 'moment'

Vue.use(Viewer)
Vue.use(VueImg, {
  altAsTitle: true
})

export default {
  name: 'update-trucks-maintenance',
  components: {
    SingleSelectDriver,
    SingleSelectMaintainAgent
  },

  props: [
  ],

  data: () => ({
    agents: [
      {text: 'THACO', value: 1}
    ],
    categoriesSelected: [],
    categoryExternsSelected: [],
    categories: [],
    categoryExterns: [],
    categoryNewExternData: [],
    truckData: {},
    truckId: null,
    addBtnDisabled: false,
    info: {
      id: null,
      type: null,
      maintenance_date: null,
      maintenance_agent: null,
      number_cost: '',
      number_discount: '',
      number_pay: '',
      details: [],
      driver_id: '',
      number_distance: '',
      more_details: '',
      fileDocuments: [],
      fileAdded: [],
      fileDeleted: [],
      driver: {},
      agent: {}
    },
    maintenanceOptions: [
      {text: 'BD 5,000 km', value: 2},
      {text: 'BD 10,000 km', value: 3},
      {text: 'BD 20,000 km', value: 4},
      {text: 'BD 40,000 km', value: 5},
      {text: 'BD 80,000 km', value: 6},
      {text: 'Khác', value: 1}
    ]
  }),

  created () {
    // get info bảo dưỡng
    this.getTruckMaintenanceConfig().then(() => {
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
        if (this.$route.params.id) {
          this.getTruckMaintenance()
        }
      }
    }).catch(e => commonHelper.showMessage('Có lỗi xảy ra', 'warn'))
  },

  computed: {
    isAdd: function () {
      return this.$route.name === 'add-trucks-maintenance'
    },

    isEdit: function () {
      return this.$route.name === 'edit-trucks-maintenance'
    }
  },

  watch: {
  },

  methods: {
    updateTruckMaintenance () {
      // check required
      let dataSend = new FormData()
      if (this.info.id) {
        dataSend.append('id', this.info.id)
      }
      if ((this.info.fileAdded.length + this.info.fileDocuments.length - this.info.fileDeleted.length) === 0) return commonHelper.showMessage('Không được thiếu tài liệu/ảnh phiếu bảo dưỡng', 'warn')

      if (!this.truckId) return commonHelper.showMessage('Không có dữ liệu xe tải', 'warn')
      if (!this.info.type) return commonHelper.showMessage('Chưa chọn loại bảo dưỡng', 'warn')
      if (!this.info.agent.id) return commonHelper.showMessage('Chưa chọn đại lý bảo dưỡng', 'warn')
      if (!this.info.driver.id) return commonHelper.showMessage('Chưa gán tài xế phụ trách', 'warn')
      if (!this.info.maintenance_date) return commonHelper.showMessage('Chưa có ngày bảo dưỡng', 'warn')
      let numberDistance = this.covertNumberInput(this.info.number_distance)
      if (!numberDistance) return commonHelper.showMessage('Chưa có số Km cuối', 'warn')
      let numberPay = this.covertNumberInput(this.info.number_pay)
      if (!numberPay) return commonHelper.showMessage('Chưa có chi phí bảo dưỡng, sửa chữa', 'warn')

      if ((this.info.fileAdded.length + this.info.fileDocuments.length - this.info.fileDeleted.length) > 10) return commonHelper.showMessage('Không được up quá 10 ảnh', 'warn')
      // check chi phi phát sinh
      let maintenanceExterns = []
      if (this.categoryNewExternData.length) {
        for (let i = 0; i < this.categoryNewExternData.length; i++) {
          let element = this.categoryNewExternData[i]
          let price = element.value ? this.covertNumberInput(element.value) : ''
          if (!element.name && price) {
            return commonHelper.showMessage('Không để trống tên chi phí phát sinh có giá trị', 'warn')
          }
          if (element.name && !price) {
            return commonHelper.showMessage('Chưa có giá cho bảo dưỡng phát sinh: ' + element.name, 'warn')
          }
          if (!element.name && !element.id) {
            // return commonHelper.showMessage('Chưa có thông tin chi phí', 'warn')
          } else {
            maintenanceExterns.push({
              id: element.id || '',
              name: element.name || '',
              price
            })
          }
        }
      }
      dataSend.append('truck_id', this.truckId)
      dataSend.append('driver_id', this.info.driver.id)
      dataSend.append('type', this.info.type)
      dataSend.append('number_distance', numberDistance)
      dataSend.append('maintenance_agent', this.info.agent.id)
      dataSend.append('number_cost', this.covertNumberInput(this.info.number_cost))
      dataSend.append('number_discount', this.covertNumberInput(this.info.number_discount))
      dataSend.append('number_pay', numberPay)
      dataSend.append('details', JSON.stringify(this.categoriesSelected))
      if (this.categoryExternsSelected.length) dataSend.append('extern_details', JSON.stringify(this.categoryExternsSelected))
      if (maintenanceExterns.length) {
        dataSend.append('extern_category', JSON.stringify(maintenanceExterns))
      }
      this.addBtnDisabled = true
      if (this.info.more_details) dataSend.append('more_details', this.info.more_details)
      if (this.info.maintenance_date) dataSend.append('maintenance_date', moment(this.info.maintenance_date).format('YYYY-MM-DD'))

      if (this.info.fileAdded.length) {
        for (let i = 0; i < this.info.fileAdded.length; i++) {
          dataSend.append('files[' + i + ']', this.info.fileAdded[i])
        }
      }
      if (this.info.fileDeleted.length) dataSend.append('deleteDocs', JSON.stringify(this.info.fileDeleted))

      CompanyProfileService.addTruckMaintenance(dataSend).then(response => {
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
      if (files) return `${files.length} files selected`
      return ''
    },
    getUrl (file) {
      return URL.createObjectURL(file)
    },
    deleteFile (event, indexFile, uploaded) {
      if (uploaded) {
        if (event.target.classList.contains('ion-md-close-circle')) {
          this.info.fileDeleted.push(this.info.fileDocuments[indexFile].id)
          event.target.setAttribute('title', 'Lấy lại')
        } else {
          let index = this.info.fileDeleted.indexOf(this.info.fileDocuments[indexFile].id)
          if (index >= 0) {
            this.info.fileDeleted.splice(index, 1)
            event.target.setAttribute('title', 'Xóa')
          }
        }
        event.target.classList.toggle('ion-md-close-circle')
        event.target.classList.toggle('ion-md-refresh-circle')
        event.target.nextElementSibling.classList.toggle('file-deleted')
      } else {
        this.info.fileAdded.splice(indexFile, 1)
      }
    },
    countNumPay () {
      let numPay = this.covertNumberInput(this.info.number_cost) - this.covertNumberInput(this.info.number_discount)
      this.info.number_pay = (numPay >= 0) ? commonHelper.formatMoney(numPay) : 0
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
    getTruckMaintenanceConfig () {
      return CompanyProfileService.getTruckMaintenanceConfig({}).then(response => {
        if (response.data.success) {
          let info = response.data.data
          // this.agents = info.agents
          this.categories = info.categories.map(e => {
            return {...e, text: e.name, value: e.id}
          })
          this.categoryExterns = info.category_externs.map(e => {
            return {...e, text: e.name, value: e.id}
          })
        } else {
          commonHelper.showMessage(response.data.message, 'warn')
        }
      }).catch(e => {
        console.error(e)
      })
    },
    getTruckMaintenance () {
      this.$startLoading()
      CompanyProfileService.getTruckMaintenance({id: this.$route.params.id}).then(response => {
        if (response.data.success) {
          let info = response.data.data
          if (info.details) this.categoriesSelected = JSON.parse(info.details)
          if (info.extern_details) this.categoryExternsSelected = JSON.parse(info.extern_details)
          if (info.maintenance_date) this.info.maintenance_date = new Date(info.maintenance_date)
          this.categoryNewExternData = info.extern_category || []
          this.info.type = info.type
          this.info.maintenance_agent = info.maintenance_agent
          this.info.number_distance = this.convertMoney(info.number_distance)
          this.info.number_cost = this.convertMoney(info.number_cost)
          this.info.number_discount = this.convertMoney(info.number_discount)
          this.info.number_pay = this.convertMoney(info.number_pay)
          this.info.driver_id = info.driver_id
          this.info.more_details = info.more_details
          this.info.driver = info.driver
          this.info.agent = info.agent
          this.info.id = info.id
          // this.info = info
          this.truckId = info.truck_id
          this.info.fileDocuments = info.documents
          this.categoryNewExternData = info.extern_category && info.extern_category.map(element => {
            let result = {
              name: element.name
            }
            if (element.price) result.value = this.convertMoney(element.price)
            if (element.id) result.id = element.id
            return result
          })
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
  height: 135px;
  line-height: 128px;
  text-align: center;
  color: green;
  padding: 0;
  margin-top: 0.5rem;
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
</style>
