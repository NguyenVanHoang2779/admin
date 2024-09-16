<template>
    <div>
        <b-card no-body>
            <b-card-body>
                <b-row>
                    <h4 class="ml-2 mt-1">Config giờ đào tạo COD</h4><br>
                </b-row>
                <b-link href="/erp/salaryCods/exportTeamplateCodStar">Download template excel</b-link>
                <hr>
                <div class="row">
                    <b-form-group label="Chọn COD" class="col-sm-4">
                        <multiselect
                                v-model="user"
                                label="name"
                                track-by="id"
                                placeholder=""
                                :options="users"
                                :multiple="false"
                                :searchable="true"
                                :loading="asyncLoading"
                                :internal-search="false"
                                :clear-on-select="true"
                                :close-on-select="true"
                                :hide-selected="true"
                                @search-change="asyncFind">
                            <span slot="noResult">{{message}}</span>
                            <span slot="noOptions">{{message}}</span>
                        </multiselect>
                    </b-form-group>
                    <b-form-group label="Ngày đào tạo" class="col-sm-4">
                        <datepicker
                                v-model="date"
                                format="dd-MM-yyyy"
                                :bootstrapStyling="true"
                                :monday-first="true"
                                :full-month-name="true"
                                :calendar-button="true"
                                calendar-button-icon="ion ion-md-calendar"
                                :clear-button="true"
                                placeholder="Ngày đào tạo"
                        />
                    </b-form-group>
                    <b-form-group label="Số giờ đào tạo" class="col-sm-4">
                        <b-form-input placeholder="Số giờ đào tạo" v-model="house" type="number"></b-form-input>
                    </b-form-group>
                </div>
                <div class="row">
                    <b-form-group label="" class="col-sm-6">
                        <b-form-file v-model="uploadFile" class="mt-3" plain></b-form-file>
                    </b-form-group>
                    <b-form-group label="" class="col-sm-6 text-right">
                        <b-btn type="button" variant="outline-success" @click="addCodTraining"><i
                                class="fa fa-plus-square" aria-hidden="true"></i> Thêm
                        </b-btn>
                    </b-form-group>
                </div>
                <hr>
                <div v-if="this.isSearch">
                <label> <b>Tìm kiếm</b></label><br>
                <b-row>
                  <b-col sm="3">
                    <b-form-group
                      label="Chọn tỉnh cần tìm kiếm:"
                      v-slot="{ ariaDescribedby }"
                    >
                      <select-province-penalty @model="provinces = $event"></select-province-penalty>
                    </b-form-group>
                  </b-col>
                  <b-col sm="3">
                    <b-form-group
                      label="Chọn kho cần tìm kiếm:"
                      v-slot="{ ariaDescribedby }"
                    >
                      <multiselect
                        v-model="valueStations"
                        tag-placeholder="Tất cả"
                        placeholder="Mặc định là tất cả" label="name"
                        track-by="id"
                        :options="stations"
                        :close-on-select="false"
                        :multiple="true"
                        :taggable="true"
                        @tag="addTag">
                      </multiselect>
                    </b-form-group>
                  </b-col>
                  <b-col sm="2">
                    <b-form-group
                      label="Chọn cod:"
                      v-slot="{ ariaDescribedby }"
                    >
                      <multiselect
                        v-model="valueCod"
                        tag-placeholder="Tất cả"
                        placeholder="Mặc định là tất cả" label="name"
                        track-by="id"
                        :options="optionsCod"
                        :close-on-select="false"
                        :multiple="true"
                        :taggable="true"
                        @tag="addTagCod">
                      </multiselect>
                    </b-form-group>
                  </b-col>
                  <b-col sm="2">
                    <b-form-group class="" label="Ngày bắt đầu">
                      <datepicker
                        v-model="searchFrom"
                        :format="customFormatter"
                        :bootstrapStyling="true"
                        :monday-first="true"
                        :full-month-name="true"
                        :calendar-button="true"
                        calendar-button-icon="ion ion-md-calendar"
                        :clear-button="true"
                      />
                    </b-form-group>
                  </b-col>
                  <b-col sm="2">
                    <b-form-group class="" label="Ngày kết thúc">
                      <datepicker
                        v-model="searchTo"
                        :format="customFormatter"
                        :bootstrapStyling="true"
                        :monday-first="true"
                        :full-month-name="true"
                        :calendar-button="true"
                        calendar-button-icon="ion ion-md-calendar"
                        :clear-button="true"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>
                </div>
                <div class="row">
                    <b-form-group label="" class="col-sm-10 text-right">
                    </b-form-group>
                    <b-form-group label="" class="col-sm-2 text-right">
                        <b-btn type="button" variant="outline-primary" @click="searchCodTraining"><i
                                class="sidenav-icon ion ion-md-search" aria-hidden="true"></i> Tìm kiếm
                        </b-btn>
                    </b-form-group>
                </div>
                <hr>
                <b-table
                        ref="dataTable"
                        :items="dataTable"
                        :fields="fields"
                        :striped="false"
                        :bordered="true"
                        :outlined="true"
                        :hover="true"
                        style="text-align: center;"
                        class="card-table"
                        :per-page="perPage"
                        :current-page="currentPage"
                        responsive>
                    <template v-slot:cell(options)="data">
                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs"
                               v-on:click="editItem(data.item)"><i
                                class="ion ion-md-create"></i>
                        </b-btn>
                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs"
                               v-on:click="deleteItem(data.item)"><i
                                class="ion ion-md-close"></i>
                        </b-btn>
                    </template>
                </b-table>
                <hr>
                <b-pagination
                        v-model="currentPage"
                        :total-rows="totalTable"
                        :per-page="perPage"
                        aria-controls="my-table"
                ></b-pagination>
            </b-card-body>
        </b-card>
        <b-modal id="modal-1" v-if="showModal" @close="showModal = true" :hide-footer="true" :hide-header="true">
                <div class="row">
                    <b-form-group label="Chọn COD" class="col-sm-12">
                        <b-form-input placeholder="Username" v-model="userE" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label="Ngày đào tạo" class="col-sm-12">
                        <datepicker
                                v-model="dateE"
                                format="dd-MM-yyyy"
                                :bootstrapStyling="true"
                                :monday-first="true"
                                :full-month-name="true"
                                :calendar-button="true"
                                calendar-button-icon="ion ion-md-calendar"
                                :clear-button="true"
                                placeholder="Ngày đào tạo"
                        />
                    </b-form-group>
                    <b-form-group label="Số giờ đào tạo" class="col-sm-12">
                        <b-form-input placeholder="Số giờ đào tạo" v-model="houseE" type="number"></b-form-input>
                    </b-form-group>
                </div>
                <br>
                <div class="mb-4 text-center">
                    <b-btn type="button" variant="outline-primary" @click="updateItem">Sửa</b-btn>
                    <b-btn type="button" @click="$bvModal.hide('modal-1')">Đóng</b-btn>
                </div>
        </b-modal>
    </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped>
</style>

<script>
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import SalaryService from 'domain/services/salary-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import debounce from 'debounce'
import stationService from 'domain/services/station-service'
import SelectProvincePenalty from 'components/pages/erp/kpi/penalties/SelectProvincePenalty'

export default {
  name: 'cod-training',
  components: {
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    Moment,
    commonHelper,
    Datepicker,
    debounce,
    stationService,
    SelectProvincePenalty
  },

  data: () => ({
    users: [],
    idE: '',
    user: '',
    userE: '',
    dataTable: [],
    house: '',
    houseE: '',
    fields: [
      {key: 'id', label: 'Id', sortable: true},
      {key: 'region', label: 'Miền', sortable: true},
      {key: 'province', label: 'Tỉnh', sortable: true},
      {key: 'station', label: 'Kho', sortable: true},
      {key: 'username', label: 'Username', sortable: true},
      {key: 'fullname', label: 'Họ tên', sortable: true},
      {key: 'date', label: 'Ngày đào tạo', sortable: true},
      {key: 'house', label: 'Thời gian đào tạo', sortable: true},
      {key: 'modified_by', label: 'Người chỉnh sửa', sortable: true},
      {key: 'options', label: 'Tùy chọn', sortable: true}
    ],
    date: new Date(),
    searchFrom: new Date(),
    searchTo: new Date(),
    dateE: null,
    asyncLoading: false,
    message: 'Nhập ít nhất 2 ký tự',
    showModal: true,
    uploadFile: null,
    searchStation: [],
    searchUser: [],
    stations: [],
    valueStations: [],
    stationsId: [],
    optionsCod: [],
    valueCod: [],
    provinces: [],
    totalItems: 0,
    currentPage: 1,
    perPage: 50,
    isSearch: false
  }),

  created () {
    this.listData()
    this.getAllStations()
  },
  computed: {
    totalTable () {
      return this.dataTable.length
    }
  },
  watch: {
    valueStations () {
      return this.loadCod()
    },
    provinces () {
      return this.getAllStations()
    }
  },
  methods: {
    customFormatter (date) {
      return Moment(date).format('YYYY-MM-DD')
    },
    addTag (newTag) {
      const tag = {
        name: newTag,
        id: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.stations.push(tag)
      this.valueStations.push(tag)
    },
    addTagCod (newTag) {
      const tag = {
        name: newTag,
        id: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.optionsCod.push(tag)
      this.valueCod.push(tag)
    },
    loadCod () {
      this.stationsId = []
      this.valueStations.forEach(element => {
        this.stationsId.push(element.id)
      })
      let param = {
        stations: this.stationsId
      }
      SalaryService.searchCodByStations(param).then(response => {
        if (response.data.success) {
          this.valueCod = []
          this.optionsCod = []
          this.optionsCod = response.data.data
        } else {
          return commonHelper.showMessage(response.data.message, 'warning')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xẩy ra, vui lòng thử lại sau', 'warning')
      })
    },
    addCodTraining () {
      if (this.uploadFile === null) {
        if (this.user.length === 0 || this.date === null || this.house === '') {
          return commonHelper.showMessage('Dữ liệu không được bỏ trống & ngày bắt đầu nhỏ hơn ngày kết thúc', 'warning')
        }
        let date = Moment(this.date).format('YYYY-MM-DD')
        let data = {
          'date': date,
          'user_id': this.user.id,
          'house': this.house
        }
        SalaryService.addCodTraining(data).then(response => {
          if (response.data.success) {
            this.clearInput()
            this.listData()
            return commonHelper.showMessage(response.data.message, 'success')
          } else {
            return commonHelper.showMessage(response.data.message, 'warning')
          }
        }).catch(() => {
          return commonHelper.showMessage('Có lỗi xẩy ra, vui lòng thử lại sau', 'warning')
        })
      } else {
        let data = new FormData()
        data.append('uploadFile', this.uploadFile)
        SalaryService.importCodTraining(data).then(response => {
          if (response.data.success) {
            this.listData()
            return commonHelper.showMessage(response.data.message, 'success')
          } else {
            return commonHelper.showMessage(response.data.message, 'warning')
          }
        }).catch(() => {
          return commonHelper.showMessage('Có lỗi xẩy ra, vui lòng thử lại sau', 'warning')
        })
      }
    },
    editItem (item) {
      this.userE = item.username
      this.houseE = item.house
      this.dateE = item.date
      this.idE = item.id
      this.$bvModal.show('modal-1')
    },
    listData () {
      SalaryService.listCodTraining().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataTable = response.data.data
            return commonHelper.showMessage(response.data.message, 'success')
          } else {
            return commonHelper.showMessage(response.data.message, 'warning')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xẩy ra, vui lòng thử lại sau', 'warning')
      })
    },
    clearInput () {
      this.uploadFile = null
      this.user = null
      this.userE = null
      this.house = ''
      this.houseE = ''
      this.date = null
      this.searchUser = null
    },
    deleteItem (item) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
        return
      }
      let data = {
        id: item.id
      }
      SalaryService.deleteCodTraining(data).then(response => {
        if (response.data.success) {
          this.searchCodTraining()
          return commonHelper.showMessage(response.data.message, 'success')
        } else {
          return commonHelper.showMessage(response.data.message, 'warning')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xẩy ra, vui lòng thử lại sau', 'warning')
      })
    },
    updateItem () {
      if (this.dateE === null || this.houseE === '') {
        return commonHelper.showMessage('Dữ liệu không được bỏ trống', 'warning')
      }
      let date = Moment(this.dateE).format('YYYY-MM-DD')
      let data = {
        'date': date,
        'id': this.idE,
        'house': this.houseE
      }
      SalaryService.editCodTraining(data).then(response => {
        if (response.data.success) {
          this.clearInput()
          this.searchCodTraining()
          return commonHelper.showMessage(response.data.message, 'success')
        } else {
          return commonHelper.showMessage(response.data.message, 'warning')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xẩy ra, vui lòng thử lại sau', 'warning')
      })
      this.$bvModal.hide('modal-1')
    },
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.users = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.users = []
      SalaryService.searchCodV2({term: query}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.users = response.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    }, 500),
    getAllStations: function () {
      let data = {
        'provinceIds': this.provinces.toString()
      }
      stationService.getAllStationByProvinceIds(data)
        .then((res) => {
          if (res.data.success) {
            this.valueStations = []
            this.stations = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    searchCodTraining () {
      if (this.isSearch === false) {
        this.isSearch = true
        return
      }
      if (this.searchFrom > this.searchTo) {
        return commonHelper.showMessage('ngày bắt đầu nhỏ hơn ngày kết thúc', 'warning')
      }
      let from = Moment(this.searchFrom).format('YYYY-MM-DD')
      let to = Moment(this.searchTo).format('YYYY-MM-DD')
      this.searchUser = []
      this.searchStation = []
      this.valueStations.forEach(element =>
        this.searchStation.push(element.id)
      )
      this.valueCod.forEach(element =>
        this.searchUser.push(element.id)
      )
      let data = {
        'station_id': this.searchStation,
        'user_id': this.searchUser,
        'from': from,
        'to': to,
        'province_id': this.provinces
      }
      this.dataTable = []
      SalaryService.searchCodTraining(data).then(response => {
        if (response.data.success) {
          this.dataTable = response.data.data
          return commonHelper.showMessage(response.data.message, 'success')
        } else {
          return commonHelper.showMessage(response.data.message, 'warning')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xẩy ra, vui lòng thử lại sau', 'warning')
      })
    }
  }
}
</script>
