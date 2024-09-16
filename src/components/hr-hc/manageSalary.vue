<template>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <b-col cols="6">
          <h4 class="pt-1 text-info">Quản Lý Chạy Và Xuất Lương Cho HR/HC</h4>
          <b-form-group
            class="m-0"
            label="Đối tượng quản lý"
            v-slot="{ ariaDescribedby }"
          >
            <b-form-radio-group
              id="btn-radios-2"
              v-model="groupType"
              :options="options"
              :aria-describedby="ariaDescribedby"
              button-variant="outline-primary"
              size="sm"
              name="radio-btn-outline"
              buttons
            ></b-form-radio-group>
          </b-form-group>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col cols="9">
          <b-row>
            <b-col cols="3">
              <b-form-group
                label="Chọn team cần quản lý"
                v-slot="{ ariaDescribedby }"
              >
                <multiselect
                  v-model="valueTeam"
                  tag-placeholder="Tất cả"
                  placeholder="Mặc định là tất cả" label="name"
                  track-by="code"
                  :options="optionsTeam"
                  :multiple="true"
                  :taggable="true"
                  @tag="addTag">
                </multiselect>
              </b-form-group>
            </b-col>
            <b-col cols="auto">
              <b-form-group
                label="Chọn kỳ lương"
                v-slot="{ ariaDescribedby }"
              >
                <vue-monthly-picker
                  class="monthly-picker"
                  v-model="salaryMonth"
                  placeHolder="Chọn kỳ lương"
                  :alignment="`center`"
                  :dateFormat="`MM-YYYY`"
                  :clearOption="false"
                ></vue-monthly-picker>
              </b-form-group>
            </b-col>
            <b-col cols="auto">
              <b-form-group
                label="Update kho"
                v-slot="{ ariaDescribedby }"
              >
                <b-form-checkbox
                  id="checkbox-1"
                  v-model="status"
                  name="checkbox-1"
                  value="1"
                  unchecked-value="0"
                >
                </b-form-checkbox>
              </b-form-group>
            </b-col>
            <b-col cols="auto">
              <b-form-group
                label="Update ngày"
                v-slot="{ ariaDescribedby }"
              >
                <b-form-checkbox
                  id="checkbox-2"
                  v-model="updateDate"
                  name="checkbox-2"
                  value="1"
                  unchecked-value="0"
                >
                </b-form-checkbox>
              </b-form-group>
            </b-col>
            <b-col cols="auto">
              <b-form-group
                label="Đối tượng"
                v-slot="{ ariaDescribedby }"
              >
                <b-form-select
                  v-model="updateLeader"
                  :options="optionsLeader"
                  class="mb-3"
                  value-field="item"
                  text-field="name"
                  disabled-field="notEnabled"
                ></b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="auto">
              <b-form-group
                label="KPi/SALARY"
                v-slot="{ ariaDescribedby }"
              >
                <b-form-select
                  v-model="updateSalary"
                  :options="optionsSalary"
                  class="mb-3"
                  value-field="item"
                  text-field="name"
                  disabled-field="notEnabled"
                ></b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="auto" >
              <b-form-group
                label="Chọn queue"
                v-slot="{ ariaDescribedby }"
              >
                <b-form-select v-model="queue" :options="optionsQueue"></b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="3">
          <b-button class="mr-2 mt-4" variant="outline-primary" @click="calSalary"><i class="ion ion-md-arrow-dropright-circle mr-2"></i>Chạy lương</b-button>
          <b-button class="mr-2 mt-4" variant="outline-success" @click="exportExcel"><i class="ion ion-md-download mr-2"></i>Xuất excel</b-button>
          <!--          <b-button class = "mr-2 mt-4" variant="outline-info" @click="calNewStaff" >Chạy newstaff</b-button>-->
        </b-col>
      </b-row>
    </b-card-body>
    <!-- Table controls -->
    <hr>
    <b-card-body>
      <b-row >
        <b-col >
          Per page:
          <b-select size="sm" v-model="perPage" :options="[5, 10, 20, 30, 40, 50]" class="d-inline-block w-auto"/>
          <template>
            <b-btn variant="outline-success borderless icon-btn" class="btn-sm ml-1" @click="loadFiles">
              <i class="h3 m-0 ion ion-md-refresh"></i>
            </b-btn>
          </template>
        </b-col>
        <b-col>
          <img data-v-3425a280="" src="https://admin.giaohangtietkiem.vn/img/logo_57.png" alt="ECOM JSC"
               data-aui-responsive-header-index="0" width="36" class="logo">
        </b-col>
      </b-row>
    </b-card-body>
    <!-- / Table controls -->
    <b-card-body v-if="rows > 0">
      <b-table
        id="my-table"
        class="table-file-mechanism text-center"
        :items="listFile"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        responsive
        striped
        hover
      >
        <template v-slot:head(id)="data">
          <span class="text-primary">{{ data.label }}</span>
        </template>
        <template v-slot:head(file_name)="data">
          <span class="text-primary">{{ data.label }}</span>
        </template>
        <template v-slot:head(is_processing)="data">
          <span class="text-success">{{ data.label }}</span>
        </template>
        <template v-slot:head(is_success)="data">
          <span class="text-success">{{ data.label }}</span>
        </template>
        <template v-slot:head(created_user_id)="data">
          <span class="text-info">{{ data.label }}</span>
        </template>
        <template v-slot:head(created)="data">
          <span class="text-info">{{ data.label }}</span>
        </template>
        <template v-slot:head(option)="data">
          <span class="text-danger">{{ data.label }}</span>
        </template>
        <template v-slot:cell(is_processing)="data">
          <span class="text-warning" v-if="data.item.is_processing==='Đang chạy' ">{{ data.item.is_processing }}</span>
          <span class="text-success" v-if="data.item.is_processing==='Đã xong' ">{{ data.item.is_processing }}</span>
        </template>
        <template v-slot:cell(is_success)="data">
          <span class="text-danger" v-if="data.item.is_success==='Lỗi'">{{ data.item.is_success }}</span>
          <span class="text-success" v-if="data.item.is_success==='Thành công'">{{ data.item.is_success }}</span>
        </template>
        <template v-slot:cell(option)="data">
          <a :href="data.item.option"><i class="ion ion-md-download"></i></a>
          <b-btn variant="outline-danger borderless icon-btn" class="btn-sm"
                 v-on:click="deleteFile(data.item.id)"><i
            class="ion ion-md-close"></i>
          </b-btn>
        </template>
      </b-table>
      <b-pagination
        v-if="rows > perPage"
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>
    </b-card-body>
  </b-card>
</template>

<style scoped>
</style>

<script>
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import hrHcService from 'domain/services/hr-hc-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'show-hr-hc-salary',

  components: {
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    Moment,
    commonHelper
  },
  data () {
    return {
      groupType: 'ns',
      options: [
        { text: 'Nhân sự', value: 'ns' },
        { text: 'Hành chính', value: 'hc', disabled: true }
      ],
      queue: 'cal_salary_4',
      optionsQueue: [
        { value: 'cal_salary_1', text: 'cal_salary_1' },
        { value: 'cal_salary_2', text: 'cal_salary_2' },
        { value: 'cal_salary_3', text: 'cal_salary_3' },
        { value: 'cal_salary_4', text: 'cal_salary_4' }
      ],
      salaryMonth: new Moment(),
      valueTeam: [],
      optionsTeam: [],
      teamId: [],
      message: '',
      status: '0',
      updateDate: '0',
      updateLeader: '0',
      optionsLeader: [
        { item: '0', name: 'member' },
        { item: '1', name: 'leader' }
      ],
      updateSalary: '0',
      optionsSalary: [
        {item: '0', name: 'Salary'},
        {item: '1', name: 'Kpi'}
      ],
      fields: [
        {
          key: 'id',
          label: 'ID',
          sortable: false
        },
        {
          key: 'file_name',
          label: 'Tên file',
          sortable: false
        },
        {
          key: 'is_processing',
          label: 'Trạng thái',
          sortable: true
        },
        {
          key: 'is_success',
          label: 'Tạo file',
          sortable: true
        },
        {
          key: 'created_user_id',
          label: 'Người tạo',
          sortable: true
        },
        {
          key: 'created',
          label: 'Thời gian tạo',
          sortable: true
        },
        {
          key: 'option',
          label: 'Thao tác',
          sortable: false
        }
      ],
      perPage: 10,
      currentPage: 1,
      listFile: [],
      rows: 0
    }
  },
  created () {
    this.loadTeams()
  },
  watch: {
    groupType () {
      return this.loadTeams()
    }
  },
  methods: {
    formatInput () {
      this.valueTeam = []
      this.optionsTeam = []
      this.message = ''
      this.currentPage = 1
    },
    addTag (newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.optionsTeam.push(tag)
      this.valueTeam.push(tag)
    },
    loadTeams () {
      this.loadFiles()
      this.formatInput()
      let param = {
        group: this.groupType
      }
      hrHcService.getAllTeams(param).then(res => {
        if (res.data.success) {
          this.optionsTeam = []
          this.valueTeam = []
          res.data.data.forEach(element => {
            this.optionsTeam.push({
              name: element.name,
              code: element.id
            })
          })
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    calSalary () {
      this.teamId = []
      this.valueTeam.forEach(element =>
        this.teamId.push(element.code)
      )
      let param = {
        teamId: this.teamId,
        month: this.salaryMonth.format('MM'),
        year: this.salaryMonth.format('YYYY'),
        update: this.status,
        queue: this.queue,
        role: this.updateLeader,
        updateDate: this.updateDate
      }
      if (this.updateSalary === '1') {
        hrHcService.calSalaryInTime(param).then(res => {
          if (res.data.success) {
            return commonHelper.showMessage(res.data.message, 'success')
          } else {
            return commonHelper.showMessage(res.data.message, 'failed')
          }
        })
          .catch(e => {
            this.errors.push(e)
          })
      } else {
        hrHcService.callSalaryHr(param).then(res => {
          if (res.data.success) {
            return commonHelper.showMessage(res.data.message, 'success')
          } else {
            return commonHelper.showMessage(res.data.message, 'failed')
          }
        })
          .catch(e => {
            this.errors.push(e)
          })
      }
    },
    calNewStaff () {
      let param = {
        month: this.salaryMonth.format('MM'),
        year: this.salaryMonth.format('YYYY'),
        queue: this.queue
      }
      hrHcService.saveSalaryNewStaff(param).then(res => {
        if (res.data.success) {
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    exportExcel () {
      let param = {
        month: this.salaryMonth.format('MM'),
        year: this.salaryMonth.format('YYYY'),
        group_type: this.groupType,
        queue: this.queue
      }
      hrHcService.exportDataToExcel(param).then(res => {
        if (res.data.success) {
          this.loadFiles()
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    loadFiles () {
      let param = {
        group_type: this.groupType
      }
      hrHcService.loadFiles(param).then(res => {
        if (res.data.success) {
          this.currentPage = 1
          this.listFile = []
          res.data.data.forEach(element => {
            if (element.ErpExcelExportProcess.is_processing === false) {
              element.ErpExcelExportProcess.is_processing = 'Đã xong'
            } else element.ErpExcelExportProcess.is_processing = 'Đang chạy'
            if (element.ErpExcelExportProcess.is_success === false) {
              element.ErpExcelExportProcess.is_success = 'Lỗi'
            } else element.ErpExcelExportProcess.is_success = 'Thành công'
            this.listFile.push({
              id: element.ErpExcelExportProcess.id,
              file_name: element.ErpExcelExportProcess.file_name,
              is_processing: element.ErpExcelExportProcess.is_processing,
              is_success: element.ErpExcelExportProcess.is_success,
              created_user_id: element.ErpUser.username,
              created: element.ErpExcelExportProcess.created,
              option: element.ErpExcelExportProcess.file_path
            })
          })
          this.rows = this.listFile.length
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    deleteFile (id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
        return
      }
      let param = {
        id: id
      }
      hrHcService.deleteFile(param).then(res => {
        if (res.data.success) {
          this.loadFiles()
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>
