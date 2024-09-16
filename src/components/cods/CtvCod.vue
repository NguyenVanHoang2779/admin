<template>
    <div class="payslip-manager-page">
        <b-modal id="modal-1" v-if="showModal" @close="showModal = true" :hide-footer="true" :hide-header="true">
            <form method="post">
                <div class="row">
                    <div class="col-md-12">
                        <label class="form-label d-none d-md-block">Đổi tên File</label>
                        <b-input type="text" v-model="fileName" placeholder="Tên file"/>
                    </div>
                </div>
                <br>
                <div class="mb-4 text-center">
                    <b-btn type="button" variant="outline-primary" @click="updateFileName">Sửa</b-btn>
                    <b-btn type="button" @click="$bvModal.hide('modal-1')">Đóng</b-btn>
                </div>
            </form>
        </b-modal>
        <b-modal id="modal-2" v-if="showModal2" @close="showModal2 = true" :hide-footer="true" title="Tool chạy lương">
            <form method="post">
                <div class="row">
                    <b-form-group class="col-sm-12" label="Nhập Cod (Không nhập mặc định chạy All)">
                        <b-textarea type="text" placeholder="Nhiều mã cách nhau bởi dấu phẩy. Ví dụ: T1,T2,T3..."
                                    v-model="alias"/>
                    </b-form-group>
                    <b-form-group class="col-sm-12" label="Chọn tháng">
                        <vue-monthly-picker v-model="date" alignment="center" date-format="MM/YYYY"></vue-monthly-picker>
                    </b-form-group>
                </div>
                <br>
                <div class="mb-4 text-center">
                    <b-btn type="button" variant="outline-primary" @click="processSalary">Chạy lương</b-btn>
                    <b-btn type="button" @click="$bvModal.hide('modal-2')">Đóng</b-btn>
                </div>
            </form>
        </b-modal>
        <div class="ui-block">
            <div class="row">
                <div class="col-sm-9">
                    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
                        <div>Cod cộng tác viên</div>
                    </h4>
                </div>
                <div class="col-sm-3 text-right">
                    <b-btn variant="outline-success"
                           @click="redirectCheck">
                        <i class="fas fa-donate"></i> Check lương CTV
                    </b-btn>
                </div>
            </div>
            <form id="app" method="post">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="row">
                            <b-form-group class="col-sm-6" label="Chọn vùng miền">
                                <b-select v-model="optionRegion.values" :options="optionRegion.options"
                                          :disabled="optionData.values == 1"/>
                            </b-form-group>
                            <b-form-group class="col-sm-6" label="Chọn đối tượng">
                                <b-select v-model="optionData.values" :options="optionData.options" />
                            </b-form-group>
                        </div>
                        <div class="row">
                            <!--Box chọn ngày bắt đầu -->
                            <b-form-group class="col-sm-6" label="Ngày bắt đầu">
                                <datepicker
                                        v-model="dateStart"
                                        format="dd-MM-yyyy"
                                        :bootstrapStyling="true"
                                        :monday-first="true"
                                        :full-month-name="true"
                                        :calendar-button="true"
                                        calendar-button-icon="ion ion-md-calendar"
                                        :clear-button="true"
                                />
                            </b-form-group>
                            <!--Box chọn ngày kết thúc -->
                            <b-form-group class="col-sm-6" label="Ngày kết thúc">
                                <datepicker
                                        v-model="dateEnd"
                                        format="dd-MM-yyyy"
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
                    <div class="col-sm-6">
                        <b-form-group class="col-sm-12" label="Nhập Cod">
                            <b-textarea type="text" placeholder="Nhiều mã cách nhau bởi dấu phẩy. Ví dụ: T1,T2..." :rows="4"
                            :disabled="typeof optionData.values === 'undefined' || optionData.values !== 1"
                                        v-model="codSelected"/>
                        </b-form-group>
                        <b-form-group class="col-sm-12 text-right">
                            <b-btn type="button" variant="outline-success" @click="runSalary"><i class="fas fa-money-bill-alt"></i>
                                Xuất lương
                            </b-btn>
                            <b-btn type="button" variant="outline-primary" @click="exportExcel"><i class="fas fa-cubes"></i>
                                Xuất excel đơn
                            </b-btn>
                            <b-btn type="button" variant="outline-success" @click="exportExcelV2"><i
                              class="fas fa-cubes"></i>
                              Xuất excel đơn V2
                            </b-btn>
                            <b-btn type="button" variant="outline-primary" v-b-modal.modal-2>
                                Chạy lương
                            </b-btn>
                        </b-form-group>
                    </div>
                </div>
            </form>
        </div>
        <hr/>
        <div>
            <b-tabs content-class="mt-3">
                <b-tab title="Files lương" active>
                    <b-card no-body>
                        <b-table
                                id="my-table1"
                                :items="loadDataSalary"
                                :fields="fields"
                                :per-page="perPage"
                                :current-page="currentPage1"
                                class="text-center"
                        >
                            <template v-slot:cell(type)="data">
                                <b-badge variant="outline-success">{{data.item.type}}</b-badge>
                            </template>
                            <template v-slot:cell(status)="data">
                                <b-badge variant="outline-success" v-if="data.item.is_success === true">thành công</b-badge>
                                <b-badge variant="outline-danger" v-if="data.item.is_success === false">thất bại</b-badge>
                            </template>
                            <template v-slot:cell(username)="data">
                                <b-badge variant="outline-info">{{data.item.username}}</b-badge>
                            </template>
                            <template v-slot:cell(download)="data">
                                <a :href="data.item.file_path"><i class="ion ion-md-download"></i></a>
                            </template>
                            <template v-slot:cell(option)="data">
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs"
                                       v-on:click="updateChange(data.item)"><i class="ion ion-md-create"></i></b-btn>
                                <b-btn variant="outline-danger borderless icon-btn" class="btn-xs"
                                       v-on:click.once="deleteItem(data.item.id)"><i
                                        class="ion ion-md-close"></i>
                                </b-btn>
                            </template>
                        </b-table>
                        <hr>
                        <b-pagination
                                v-model="currentPage1"
                                :total-rows="totalTable2"
                                :per-page="perPage"
                                aria-controls="my-table1"
                        ></b-pagination>
                    </b-card>
                </b-tab>
                <b-tab title="Files đơn">
                    <b-card no-body>
                        <b-table
                                id="my-table2"
                                :items="loadData"
                                :fields="fields"
                                :per-page="perPage"
                                :current-page="currentPage2"
                                class="text-center"
                        >
                            <template v-slot:cell(type)="data">
                                <b-badge variant="outline-success">{{data.item.type}}</b-badge>
                            </template>
                            <template v-slot:cell(status)="data">
                                <b-badge variant="outline-success" v-if="data.item.is_success === true">thành công</b-badge>
                                <b-badge variant="outline-danger" v-if="data.item.is_success === false">thất bại</b-badge>
                            </template>
                            <template v-slot:cell(username)="data">
                                <b-badge variant="outline-info">{{data.item.username}}</b-badge>
                            </template>
                            <template v-slot:cell(download)="data">
                                <a :href="data.item.file_path"><i class="ion ion-md-download"></i></a>
                            </template>
                            <template v-slot:cell(option)="data">
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs"
                                       v-on:click="updateChangeFile(data.item)"><i class="ion ion-md-create"></i></b-btn>
                                <b-btn variant="outline-danger borderless icon-btn" class="btn-xs"
                                       v-on:click.once="deleteItem(data.item.id)"><i
                                        class="ion ion-md-close"></i>
                                </b-btn>
                            </template>
                        </b-table>
                        <hr>
                        <b-pagination
                                v-model="currentPage2"
                                :total-rows="totalTable1"
                                :per-page="perPage"
                                aria-controls="my-table2"
                        ></b-pagination>
                    </b-card>
                </b-tab>
            </b-tabs>
        </div>
        <b-card>
            <BlockUI message="" :html="blockUI.html" v-if="loadingUI"/>
        </b-card>
    </div>
</template>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import Multiselect from 'vue-multiselect'
import Vue from 'vue'
import debounce from 'debounce'
import SalaryService from 'domain/services/salary-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component'
import BlockUI from 'vue-blockui'
import VueMonthlyPicker from 'vue-monthly-picker'

Vue.use(BlockUI)
export default {
  name: 'cod-ctv',
  metaInfo: {
    title: 'COD cộng tác viên'
  },
  data () {
    return {
      currentPage1: 1,
      currentPage2: 1,
      perPage: 25,
      showModal: true,
      showModal2: true,
      idChange: '',
      fileName: '',
      optionData: {
        values: 0,
        disabled: true,
        options: [
          {value: 0, text: 'Chọn tất cả'},
          {value: 1, text: 'Nhập mã Cod alias'},
          {value: 2221, text: 'COD thời vụ'},
          {value: 2222, text: 'COD hỗ trợ'}
        ]
      },
      optionRegion: {
        values: 0,
        disabled: true,
        options: [
          {value: 0, text: 'Chọn tất cả'},
          {value: 'HN', text: 'Hà Nội'},
          {value: 'HCM', text: 'Hồ Chí Minh'},
          {value: 'MB', text: 'Miền Bắc'},
          {value: 'MT', text: 'Miền Trung'},
          {value: 'MN', text: 'Miền Nam'}
        ]
      },
      dateStart: new Date(),
      dateEnd: new Date(),
      codSelected: '',
      dataTable: [],
      dataTableSalary: [],
      stringAlias: '',
      idExCreated: '',
      checkRun: '',
      totalTask: 0,
      totalFile: 0,
      fields: [
        {
          key: 'file_name',
          label: 'Tên file',
          sortable: true
        },
        {
          key: 'type',
          label: 'Loại file',
          sortable: true
        },
        {
          key: 'status',
          label: 'Trạng thái',
          sortable: true
        },
        {
          key: 'created',
          label: 'Ngày tạo',
          sortable: true
        },
        {
          key: 'username',
          label: 'Người tạo',
          sortable: true
        },
        {
          key: 'download',
          label: 'Download',
          sortable: true
        },
        {
          key: 'option',
          label: 'Thao tác',
          sortable: true
        }
      ],
      alias: '',
      date: moment().format('YYYY-MM'),
      blockUI: {
        loading: false,
        html: `<div class="loading-container__wrapper-loader"><div class="loading-container__loader">Loading...</div><h5>Đang xử lý dữ liệu</h5></div>`
      }
    }
  },
  components: {
    Multiselect,
    debounce,
    SalaryService,
    Datepicker,
    flatPickr,
    VueMonthlyPicker
  },
  computed: {
    loadData () {
      return this.dataTable
    },
    loadingUI () {
      return this.blockUI.loading
    },
    loadDataSalary () {
      return this.dataTableSalary
    },
    totalTable1 () {
      return this.dataTable.length
    },
    totalTable2 () {
      return this.dataTableSalary.length
    }
  },
  created () {
    this.listData()
    this.getListSalary()
  },
  methods: {
    listData () {
      SalaryService.getLisCodCtv().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataTable = response.data.data
          } else {
            return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'warning')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi khi lấy dữ liệu', 'warning')
      })
    },
    exportExcel () {
      if (this.dateStart > this.dateEnd && !this.dateEnd !== '') {
        return commonHelper.showMessage('Ngày bắt đầu nhỏ hơn ngày kết thúc', 'warning')
      }
      if (this.optionData.values === 0 && this.optionRegion.values === 0) {
        return commonHelper.showMessage('Phải điền mã Alias hoặc chọn vùng miền', 'warning')
      }
      let region = this.optionRegion.values
      if (this.optionRegion.values === 0) {
        region = ''
      }
      let params = {
        region: region,
        wordStyle: this.optionData.values,
        stringAlias: this.codSelected.trim(),
        from: moment(this.dateStart).format('YYYY-MM-DD'),
        to: moment(this.dateEnd).format('YYYY-MM-DD')
      }
      this.blockUI.loading = true
      SalaryService.exportExcelCodCtv(params).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.idExCreated = response.data.data.idExCreated
            this.totalTask = response.data.data.totalTask
            this.totalFile = response.data.data.totalFile
            if (this.totalTask === 0 || this.totalFile === 0) {
              return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'warning')
            }
            this.checkRun = setInterval(() => {
              this.checkRunExcel()
            }, 10000)
          } else {
            this.blockUI.loading = false
            return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'warning')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi khi lấy dữ liệu', 'warning')
      })
    },
    exportExcelV2 () {
      if (this.dateStart > this.dateEnd && !this.dateEnd !== '') {
        return commonHelper.showMessage('Ngày bắt đầu nhỏ hơn ngày kết thúc', 'warning')
      }
      if (this.optionData.values === 0) {
        return commonHelper.showMessage('Phải điền mã Alias', 'warning')
      }
      let params = {
        stringAlias: this.codSelected.trim(),
        from: moment(this.dateStart).format('YYYY-MM-DD'),
        to: moment(this.dateEnd).format('YYYY-MM-DD')
      }
      this.blockUI.loading = true
      SalaryService.exportExcelCodCtvV2(params).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.idExCreated = response.data.data.idExCreated
            this.totalTask = response.data.data.totalTask
            this.totalFile = response.data.data.totalFile
            if (this.totalTask === 0 || this.totalFile === 0) {
              return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'warning')
            }
            this.checkRun = setInterval(() => {
              this.checkRunExcel()
            }, 10000)
          } else {
            this.blockUI.loading = false
            return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'warning')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi khi lấy dữ liệu', 'warning')
      })
    },
    checkRunExcel () {
      let params = {
        idExCreated: this.idExCreated,
        totalFile: this.totalFile,
        totalTask: this.totalTask
      }
      SalaryService.checkRunExcelCtv(params).then(response => {
        if (!response.data.success) {
          clearInterval(this.checkRun)
          return commonHelper.showMessage(response.data.data.message)
        }
        if (response.data.data.process === 100) {
          clearInterval(this.checkRun)
          this.listData()
          this.getListSalary()
          this.blockUI.loading = false
          return commonHelper.showMessage('Xuất file thành công', 'success')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi khi lấy dữ liệu', 'warning')
      })
    },
    deleteItem (id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
        return
      }
      let parmas = {
        id: id
      }
      SalaryService.codCtvDelete(parmas).then(response => {
        this.listData()
        this.getListSalary()
        if (response.data.success) {
          return commonHelper.showMessage('Xóa file thành công', 'success')
        } else {
          return commonHelper.showMessage('Xóa file thất bại', 'warning')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi khi xóa File', 'warning')
      })
    },
    runSalary () {
      if (this.dateStart > this.dateEnd) {
        return commonHelper.showMessage('Ngày bắt đầu nhỏ hơn ngày kết thúc', 'warning')
      }
      let region = this.optionRegion.values
      if (this.optionRegion.values === 0) {
        region = ''
      }
      let params = {
        region: region,
        wordStyle: this.optionData.values,
        stringAlias: this.codSelected.trim(),
        from: moment(this.dateStart).format('YYYY-MM-DD'),
        to: moment(this.dateEnd).format('YYYY-MM-DD')
      }
      this.blockUI.loading = true
      SalaryService.exportSalaryCodCtv(params).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.idExCreated = response.data.data.idExCreated
            this.totalTask = response.data.data.totalTask
            if (this.totalTask === 0) {
              this.blockUI.loading = false
              return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'warning')
            }
            this.checkRun = setInterval(() => {
              this.checkRunExcel()
            }, 10000)
          } else {
            this.blockUI.loading = false
            return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'warning')
          }
        }
      }).catch(() => {
        this.blockUI.loading = false
        return commonHelper.showMessage('Có lỗi khi lấy dữ liệu', 'warning')
      })
    },
    getListSalary () {
      SalaryService.listSalaryCodCTV().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataTableSalary = response.data.data
          } else {
            return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'warning')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi khi lấy dữ liệu', 'warning')
      })
    },
    updateChange (item) {
      this.idChange = item.id
      this.fileName = item.file_name
      this.$bvModal.show('modal-1')
    },
    updateChangeFile (item) {
      this.idChange = item.id
      this.fileName = item.file_name
      this.$bvModal.show('modal-1')
    },
    updateFileName () {
      let params = {
        id: this.idChange,
        fileName: this.fileName
      }
      SalaryService.changeFile(params).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.listData()
            this.getListSalary()
            return commonHelper.showMessage('Đổi tên file thành công', 'success')
          } else {
            return commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xảy ra ', 'warning')
      })
      this.$bvModal.hide('modal-1')
    },
    redirectCheck () {
      this.$router.push({ name: 'ctv-checkSalary' })
    },
    processSalary () {
      this.$bvModal.hide('modal-2')
      let params = {
        alias: this.alias,
        month: moment(this.date).month() + 1,
        year: moment(this.date).year()
      }
      SalaryService.runSalaryCod(params).then(response => {
        if (response.data.success) {
          return commonHelper.showMessage('Tạo tiến trình thành công ! Vui lòng đợi trong ít phút', 'success')
        } else {
          return commonHelper.showMessage('Có lỗi khi tạo tiến trình. Vui lòng thử lại sau', 'warning')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xảy ra ', 'warning')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
