<template>
    <div>
        <div class="ui-block">
            <div class="row">
                <div class="col-md-8">
                    <h4 class="ui-block-heading">Quản lý config cọc</h4>
                </div>
                <div class="col md-4 text-right d-inline-block">
                  <b-btn v-if="exporting" variant="ghtk" class="exporting-btn">
                              <span>
                                <div class="sk-folding-cube sk-primary">
                                  <div class="sk-cube1 sk-cube"></div>
                                  <div class="sk-cube2 sk-cube"></div>
                                  <div class="sk-cube4 sk-cube"></div>
                                  <div class="sk-cube3 sk-cube"></div>
                                </div>
                                Đang xuất...</span>
                  </b-btn>
                  <a class="btn btn-ghtk" :href="URLExportedFile" download="" v-if="exported && !exporting" @click="resetExport">
                    <i class="fas fa-download"></i> Đã xuất xong, Tải file excel
                  </a>
                  <b-btn v-if="!exporting && !exported" variant="ghtk" @click="exportDepositConfig">
                    <i class="ion ion-md-print"></i> Xuất config cọc
                  </b-btn>
                    <router-link :to="{name: 'config-initial-deposit'}" class="btn btn-success">+ Cập nhật config cọc</router-link>
                </div>
            </div>
            <hr>
            <div class="mb-2">
                <b-row class="h-col-50">
                    <b-col md="2">
                        <single-select-profile-region :region="region" @handleSelectedRegion="handleSelectedRegion"></single-select-profile-region>
                    </b-col>
                    <b-col md="2">
                        <multi-select-province
                                @input="handleSelectedField('provinceId', ...arguments)"
                                :region="region"
                                :pre-load="true"
                                :province-ids="provinceId"
                                :limit-prop="99999"
                                :auto-close="false"
                                :hide-selected="true"
                                placeholder="Chọn tỉnh"
                        ></multi-select-province>
                    </b-col>
                    <b-col md="2">
                        <multi-select-station
                                :limit-prop="9999"
                                :station-ids="stationId"
                                @handleStationSelected="handleSelectedField('stationId', ...arguments)"
                                :auto-close="false"
                                :hide-selected="true"
                                :province-ids="provinceId"
                                placeholder="Chọn kho"
                        ></multi-select-station>
                    </b-col>
                    <b-col md="2">
                        <single-select-department  :department-id=departmentId @handleSelectedDepartment="handleSelectedDepartmentSearch"></single-select-department>
                    </b-col>
                    <b-col md="2" class="mb-2">
                      <multi-select-position
                        :position-ids="positionId ? positionId.toString() : ''"
                        @handlePositionSelected="handleSelectedPositionSearch"
                        :auto-close="false"
                        :hide-selected="true"
                        :custom-class="''"
                        :department-ids="departmentId">
                      </multi-select-position>
                    </b-col>
                    <b-col md="2" class="mb-2">
                        <multi-select-work-type
                                @handleSelectedWorkType="handleSelectedWorkType($event)"
                                :work-type-id="work_type_id"
                                :position-custom="positionId ? positionId.toString() : ''"
                        >
                        </multi-select-work-type>
                    </b-col>
                    <b-col class="text-right">
                        <b-btn type="button" variant="primary" @click="searchConfigs()"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
                        <b-btn type="button" variant="secondary" @click="resetFilter()"><i class="sidenav-icon ion ion-md-sync"></i> Xóa lọc</b-btn>
                    </b-col>
                </b-row>
            </div>
            <div class="mb-3">
                <div class="wrapper-list-master" v-loading="appLoading">
                    <b-card no-body v-if="listConfigs.length > 0">
                        <table class="table table-sm table-striped table-hover is_align_middle table-bordered">
                            <thead class="thead-dark">
                            <tr>
                                <th class="department-header">Bộ phận / Vị trí</th>
                                <th class="work-type-header">Kiểu nhân viên</th>
                                <th class="address-header">Miền / Tỉnh / Kho</th>
                                <th class="payment-money-header" >Tổng tiền cần cọc</th>
                                <th class="receive-at-work-header">Tiền cọc lúc nhận việc</th>
                                <th class="time-header">Thời gian hiệu lực</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(config, index) in listConfigs">
                                <th>
                                    <div class="mt-2">
                                        <single-select-department
                                                @handleSelectedDepartment="handleSelectedDepartment(config, ...arguments)"
                                                :department-id="config.department_id"
                                        >
                                        </single-select-department>
                                    </div>
                                    <div class="mt-2">
                                      <multi-select-position
                                        @handlePositionSelected="handleSelectedPosition(config, ...arguments)"
                                        :position-ids="config.position_ids"
                                        :auto-close="false"
                                        :hide-selected="true"
                                        :custom-class="''"
                                        :departmentId="config.department_id">
                                      </multi-select-position>
                                    </div>
                                </th>
                                <th>
                                    <multi-select-work-type
                                            @handleSelectedWorkType="handleSelectedWorkType(config, ...arguments)"
                                            :work-type-id="config.work_type_id"
                                            :auto-close="false"
                                            :hide-selected="true"
                                            :listPosition="config.position_ids || ''"
                                            :custom-class="''"
                                            :screenDeposit="true"
                                    >
                                    </multi-select-work-type>
                                </th>
                                <th>
                                    <div class="mt-2">
                                        <single-select-profile-region :region="config.region" @handleSelectedRegion="handleSelectedRegion($event,index)"></single-select-profile-region>
                                    </div>
                                    <div class="mt-2">
                                        <multi-select-province
                                                @input="handleSelectedField('provinceId', ...arguments, index)"
                                                :region="config.region"
                                                :province-ids="config.provinceId"
                                                :limit-prop="99999"
                                                :auto-close="false"
                                                :hide-selected="true"
                                                :placeholder="'Chọn tỉnh'"
                                                :custom-class="''"
                                        ></multi-select-province>
                                    </div>
                                    <div class="mt-2">
                                        <multi-select-station
                                                :limit-prop="9999"
                                                :station-ids="config.stationId"
                                                @handleStationSelected="handleSelectedField('stationId', ...arguments, index)"
                                                :auto-close="false"
                                                :hide-selected="true"
                                                :province-ids="config.provinceId"
                                                :placeholder="'Chọn kho'"
                                                :custom-class="''"
                                        ></multi-select-station>
                                    </div>
                                </th>
                                <th>
                                    <vue-numeric v-model="config.payment_money" class="form-control" currency="VNĐ" v-bind:min="0" v-bind:max="15000000"
                                                 currency-symbol-position="suffix"></vue-numeric>
                                </th>
                                <th>
                                    <vue-numeric v-model="config.receivable_at_work" class="form-control" currency="VNĐ" v-bind:min="0" v-bind:max="15000000"
                                                     currency-symbol-position="suffix"></vue-numeric>
                                </th>
                                <th>
                                    <div class="mt-2">
                                        <v-date-picker v-model="config.from" locale="vi"
                                                       color="green"
                                                       :input-props="{ placeholder: 'Bắt đầu áp dụng', style: 'font-size:14px; line-height: unset' }"/>
                                    </div>
                                    <div class="mt-2">
                                        <v-date-picker v-model="config.to" locale="vi"
                                                       color="green"
                                                       :input-props="{ placeholder: 'Kết thúc áp dụng', style: 'font-size:14px; line-height: unset' }"/>
                                    </div>
                                </th>
                                <th class="text-center">
                                    <b-btn class="btn btn-sm btn-outline-danger mb-1 d-block" @click="deleteConfig(config)" title="Xóa config"><i class="ion ion-md-trash"></i></b-btn>
                                    <b-btn class="btn btn-sm btn-outline-success mb-1 d-block" @click="updateConfig(config)" title="Lưu config"><i class="fas fa-save"></i></b-btn>
                                </th>
                            </tr>
                            </tbody>
                        </table>
                        <div class="mt-3" v-if="totalPages > 1">
                            <b-row>
                                <b-col md="6">
                                    <b-pagination
                                            :total-rows="totalItems"
                                            v-model="currentPage"
                                            :per-page="perPage"
                                            v-on:input="getConfigDeposits"
                                    />
                                </b-col>
                                <b-col md="6">
                                    <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
                                </b-col>
                            </b-row>
                        </div>
                    </b-card>
                    <div v-if="appLoading === false && listConfigs.length === 0">
                        <span class="pl-3 font-weight-bold">Rất tiếc, không tìm thấy config phù hợp.</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .work-type-header {
        width: 20%;
    }
    .address-header {
        width: 20%;
    }
    .department-header {
        width: 20%;
    }
    .font-size-14 {
        font-size: 14px;
    }
    .wrapper-list-master {
        position: relative;
        min-height: 120px;
    }
    .h-col-50 .col-md-2 {
        max-height: 50px;
    }
    .yellow-icon {
        color: orange;
    }
    .exporting-btn {
      span {
        position: relative;
        padding-left: 20px
      }

      .sk-folding-cube.sk-primary {
        position: absolute;
        height: 12px;
        width: 12px;
        top: -37px;
        left: 0
      }
    }
</style>

<script>
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import MultiSelectWorkType from 'components/elements/common/MultiSelectWorkType'
import depositService from 'domain/services/deposit-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import VueNumeric from 'vue-numeric'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'

export default {
  name: 'ConfigDepositManage',
  components: {
    SingleSelectProfileRegion,
    MultiSelectProvince,
    MultiSelectStation,
    SingleSelectDepartment,
    MultiSelectWorkType,
    VueNumeric,
    MultiSelectPosition
  },

  data: () => ({
    region: '',
    provinceId: '',
    stationId: '',
    departmentId: '',
    departmentName: '',
    positionId: [],
    work_type_id: '',
    listConfigs: [],
    appLoading: false,
    currentPage: 1,
    totalItems: 0,
    perPage: 10,
    exporting: false,
    URLExportedFile: null,
    exported: false
  }),

  created () {
    this.getConfigDeposits()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {
    exporting: function (newVal, oldVal) {
      if (this.URLExportedFile) window.open(this.URLExportedFile, '_blank')
    }
  },

  methods: {
    reverseFormatDate (date) {
      return date.split('-').reverse().join('-')
    },

    deleteConfig (config) {
      if (!confirm(`Bạn có chắc chắn muốn xóa config này không?`)) {
        return
      }
      depositService.deleteConfig({id: config.id})
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.getConfigDeposits()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    updateConfig (config) {
      if (!confirm(`Bạn có chắc chắn muốn chỉnh sửa config này không?`)) {
        return
      }
      depositService.updateConfig({config: config})
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
            this.getConfigDeposits()
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    resetFilter () {
      this.region = ''
      this.provinceId = ''
      this.stationId = ''
      this.departmentId = ''
      this.departmentName = ''
      this.positionId = []
      this.workTypeId = ''
      this.currentPage = 1
      this.getConfigDeposits()
    },

    searchConfigs () {
      this.currentPage = 1
      this.getConfigDeposits()
    },

    getConfigDeposits () {
      this.appLoading = true
      if (this.positionId && this.positionId.length > 0) {
        this.positionId = this.positionId.toString()
      }
      let params = {
        region: this.region,
        provinceId: this.provinceId,
        stationId: this.stationId,
        departmentId: this.departmentId,
        positionId: this.positionId,
        workTypeId: this.work_type_id,
        page: this.currentPage,
        limit: this.perPage
      }

      depositService.getConfigDeposits(params)
        .then(res => {
          if (res.data.success) {
            this.listConfigs = res.data.data.data.map((item) => {
              if (item.from != null) {
                item.from = new Date(item.from)
              }
              if (item.to != null) {
                item.to = new Date(item.to)
              }
              return item
            })
            this.totalItems = res.data.data.count
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    handleSelectedRegion (option, index) {
      if (typeof index !== 'undefined') {
        this.listConfigs[index].region = option ? option.id : ''
      } else {
        this.region = option ? option.id : ''
      }
    },

    handleSelectedField (field, option, index) {
      if (typeof index !== 'undefined') {
        this.listConfigs[index][field] = option ? option.map((item) => item.id).toString() : ''
      } else {
        this[field] = option ? option.map((item) => item.id).toString() : ''
      }
    },

    handleSelectedDepartment (config, options) {
      if (!config) return
      if (options) {
        config.department_id = options.id
      } else {
        config.department_id = null
      }
    },

    handleSelectedPosition: function (config, options) {
      if (!config) return
      if (options) {
        config.position_ids = options.map(op => op.id).toString()
      } else {
        config.position_ids = config.position_ids ? config.position_ids : ''
      }
    },
    handleSelectedWorkType: function (config, options) {
      if (!config) return
      if (options) {
        config.work_type_id = options.map(op => op.id).toString()
      } else {
        config.work_type_id = config.work_type_id ? config.work_type_id : ''
      }
    },
    exportDepositConfig () {
      this.exporting = true
      depositService.exportDepositConfig()
        .then(res => {
          if (res.data.success) {
            this.checkJobStatus(res.data.job_id)
          } else {
            this.resetExport()
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          this.resetExport()
          console.log(e)
        })
    },
    checkJobStatus (jobId) {
      if (!jobId) commonHelper.showMessage('Đã có lỗi xảy ra', 'warning')
      let getJobStat = setInterval(() => {
        depositService.checkJobStatus({job_id: jobId})
          .then(response => {
            if (response.data.success) {
              if (response.data.job_status === 'closed') {
                clearInterval(getJobStat)
                commonHelper.showMessage('Đã xuất xong file dữ liệu', 'success')
                this.URLExportedFile = response.data.file_path
                this.exported = true
                this.exporting = false
              }
            } else {
              commonHelper.showMessage(response.data.message, 'warning')
              clearInterval(getJobStat)
              this.exporting = false
            }
          })
      }, 2000)
    },
    resetExport () {
      this.exporting = false
      this.exported = false
      this.URLExportedFile = null
    },
    handleSelectedDepartmentSearch (options) {
      if (!options) {
        this.departmentId = null
      } else {
        this.departmentId = options.id
      }
    },

    handleSelectedPositionSearch: function (options) {
      if (!options) {
        this.positionId = null
      } else {
        this.positionId = options.map(op => op.id).toString()
      }
    }
  }
}
</script>
