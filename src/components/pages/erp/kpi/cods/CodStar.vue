<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <div class="header">
          <b-col><h3 class="mt-2">Tool chạy và xuất lương Cod Star</h3></b-col>
        </div>
        <hr/>
        <b-row>
          <b-form-group class="col-sm-4">
            <span>Chọn kho: </span>
            <multiselect
              v-model="station"
              label="name"
              track-by="id"
              placeholder="Chọn kho"
              :options="stations"
              :searchable="true"
              :multiple="true"
              :hide-selected="true"
              :allow-empty="true"
              :clearOption="true"
            >
            </multiselect>
          </b-form-group>
          <b-form-group label="Chọn tháng" class="col-sm-4">
            <vue-monthly-picker v-model="date" alignment="center" date-format="MM/YYYY"></vue-monthly-picker>
          </b-form-group>
          <b-form-group label="Tùy chọn" class="col-sm-4">
            <b-btn type="button" variant="outline-success" @click="runSalary" :disabled="disabledRunSalary">Chạy lương
            </b-btn>
            <b-btn type="button" variant="outline-primary" v-on:click="exportExcel" :disabled="disabledExcel">Tạo File
              Excel
            </b-btn>
          </b-form-group>
        </b-row>
        <b-row v-bind:class="{ hideactive: hideActiveSalary }">
          <div class="col-12">
            <div class="text-center text-muted small text-success">Đang chạy tiến trình chạy lương</div>
            <div class="text-right text-muted small">100%</div>
            <b-progress :value="processSalary" :max="100" show-progress animated height="6px" variant="success"/>
          </div>
        </b-row>
        <b-row v-bind:class="{ hideactive: hideActivePro }">
          <div class="col-12">
            <div class="text-center text-muted small text-primary">Đang chạy tiến trình tạo Excel
              <i class="fa fa-spin fa-spinner ml-3"></i>
            </div>
          </div>
        </b-row>
        <hr>
        <div>
          <b-table
            id="my-table"
            class="table-file-mechanism text-center"
            :items="dataTable"
            :fields="fields"
            :per-page="perPage"
            :current-page="currentPage"
            responsive
            striped
            hover
          >
            <template v-slot:head(file_name)="data">
              <span class="text-info">{{ data.label }}</span>
            </template>
            <template v-slot:head(created)="data">
              <span class="text-success">{{ data.label }}</span>
            </template>
            <template v-slot:head(file_path)="data">
              <span class="text-primary">{{ data.label }}</span>
            </template>
            <template v-slot:head(option)="data">
              <span class="text-danger">{{ data.label }}</span>
            </template>
            <template v-slot:cell(file_path)="data">
              <a :href="data.item.file_path" target='_blank'><i>Dowload file</i></a>
            </template>
            <template v-slot:cell(option)="data">
              <b-btn variant="outline-danger borderless icon-btn" class="btn-sm"
                     v-on:click="deleteItem(data.item.id)"><i
                class="ion ion-md-close"></i>
              </b-btn>
            </template>
          </b-table>
          <b-col sm="7" md="6" class="my-1" v-if="totalRows > perPage">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              aria-controls="my-table"
            ></b-pagination>
          </b-col>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import debounce from 'debounce'
import SalaryService from 'domain/services/salary-service'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import commonHelper from 'infrastructures/helpers/common-helpers'
import VueMonthlyPicker from 'vue-monthly-picker'
import moment from 'moment'
import stationService from 'domain/services/station-service'
export default {
  name: 'cod-star',
  data () {
    return {
      codSelected: '',
      asyncFound: [],
      asyncLoading: false,
      asyncTimeout: null,
      message: 'Nhập ít nhất 2 ký tự',
      date: moment().format('YYYY-MM'),
      stringIdCod: '',
      dataTable: [],
      fields: [
        {
          key: 'file_name',
          label: 'Tên cơ chế',
          sortable: true
        },
        {
          key: 'created',
          label: 'Ngày tạo',
          sortable: true
        },
        {
          key: 'file_path',
          label: 'Link file',
          sortable: true
        },
        {
          key: 'option',
          label: 'Thao tác',
          sortable: true
        }
      ],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      process: 1,
      total: '',
      countTake: '',
      idCreated: '',
      statusProcess: '',
      isActive: true,
      disabledRunSalary: false,
      disabledExcel: false,
      statusRunSalary: '',
      checkRun: '',
      proSalary: 0,
      activeSalary: true,
      dateNowRun: '',
      stations: [],
      station: [],
      totalRunCod: 0,
      countSuccess: 0
    }
  },
  computed: {
    getData () {
      return this.dataTable
    },
    dataProcess () {
      return this.process
    },
    processSalary () {
      return this.proSalary
    },
    hideActivePro () {
      return this.isActive
    },
    hideActiveSalary () {
      return this.activeSalary
    }
  },
  created () {
    this.loadListExcel()
    this.getAllStations()
  },
  components: {
    Multiselect,
    debounce,
    SalaryService,
    flatPickr,
    VueMonthlyPicker,
    stationService
  },
  methods: {
    getAllStations: function () {
      stationService.getAllStationByProvinceIds()
        .then((res) => {
          if (res.data.success) {
            this.stations = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    clearInput () {
      this.codSelected = []
      this.date = new Date()
    },
    checkRunCodStar () {
      let parmas = {
        datenow: this.dateNowRun
      }
      SalaryService.checkRunCodStar(parmas).then(response => {
        if (!response.data.success) {
          clearInterval(this.checkRun)
          this.disabledRunSalary = false
          return commonHelper.showMessage(response.data.data.message)
        }
        this.countSuccess = response.data.data.countSuccess
        this.proSalary = ((this.countSuccess / this.totalRunCod) * 100)
        this.proSalary = (this.proSalary > 100) ? 100 : this.proSalary
        if (this.proSalary === 100) {
          this.disabledRunSalary = false
          this.activeSalary = true
          clearInterval(this.checkRun)
          return commonHelper.showMessage('Chạy lương thành công', 'success')
        }
      }).catch(() => {
        clearInterval(this.checkRun)
        this.disabledRunSalary = false
        this.activeSalary = true
        return commonHelper.showMessage('Chạy lương thất bại')
      })
    },
    loadListExcel () {
      SalaryService.getlistExcelCodStar().then(response => {
        if (response.data.success) {
          this.dataTable = response.data.data
          this.totalRows = this.dataTable.length
        } else {
          commonHelper.showMessage(response.data.message, 'success')
        }
      }).catch(() => {
        commonHelper.showMessage('Không tìm thấy kết quả')
      })
    },
    runSalary () {
      var now = new Date()
      this.dateNowRun = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':00'
      this.proSalary = 0
      let stationId = []
      this.station.forEach(item => {
        stationId.push(item.id)
      })
      let parmas = {
        month: moment(this.date).format('MM'),
        year: moment(this.date).format('YYYY'),
        stationId: stationId
      }
      SalaryService.runSalaryCodStar(parmas).then(response => {
        if (response.data.success) {
          this.totalRunCod = response.data.data.totalCod
          if (response.data.data.totalCod > 0) {
            this.checkRun = setInterval(() => {
              this.checkRunCodStar()
            }, 10000)
            this.disabledRunSalary = true
            this.activeSalary = false
          }
          commonHelper.showMessage(response.data.message, 'success')
        } else {
          commonHelper.showMessage(response.data.message, 'false')
        }
      }).catch(() => {
        commonHelper.showMessage('Chạy lương thất bại')
      })
    },
    exportExcel () {
      this.disabledExcel = true
      this.process = 1
      this.isActive = false
      let stationId = []
      this.station.forEach(item => {
        stationId.push(item.id)
      })
      let parmas = {
        month: moment(this.date).format('MM'),
        year: moment(this.date).format('YYYY'),
        stationId: stationId
      }
      SalaryService.ExportCodStar(parmas).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.idCreated = response.data.data.idExCreated
        } else {
          commonHelper.showMessage(response.data.message)
        }
      }).catch(() => {
        this.isActive = true
        commonHelper.showMessage('Xuất lương thất bại')
      }).then(
        this.statusProcess = setInterval(() => {
          this.loadProcess()
        }, 10000)
      )
    },
    loadProcess () {
      let parmas = {
        idExcel: this.idCreated
      }
      SalaryService.loadProcessCodStar(parmas).then(response => {
        if (!response.data.success) {
          clearInterval(this.statusProcess)
          this.isActive = true
          this.disabledExcel = false
          return commonHelper.showMessage(response.message)
        }
        if (response.data.data.is_success === true) {
          this.loadListExcel()
          this.isActive = true
          this.disabledExcel = false
          clearInterval(this.statusProcess)
        }
      }).catch(() => {
        clearInterval(this.statusProcess)
        this.isActive = true
        this.disabledExcel = false
        commonHelper.showMessage('Không tìm thấy kết quả')
      })
    },
    deleteItem (id) {
      let parmas = {
        id: id
      }
      SalaryService.codStarDelete(parmas).then(response => {
        this.loadListExcel()
        if (response.data.success) {
          return commonHelper.showMessage('Xóa file thành công', 'success')
        } else {
          return commonHelper.showMessage('Xóa file thất bại')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi khi xóa File')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.hideactive{
  display: none;
}
</style>
