<template>
  <div>
    <b-card class="mb-1">
      <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-1 text-primary">
        <div>Quản lý ca làm việc</div>
      </h4>
      <b-row class="mt-5">
        <b-col class="my-1" sm="3">
          <b-row>
            <b-col sm="3" class="pr-0">
              <label class="font-italic font-weight-bold font-label pt-2"><b>Kho:</b></label>
            </b-col>
            <b-col sm="9" class="pl-0">
              <selected-station-penalty @model="searchData.selectStation = $event"></selected-station-penalty>
            </b-col>
          </b-row>
        </b-col>
        <b-col class="my-1" sm="3">
          <b-row>
            <b-col sm="3" class="pr-0">
              <label class="font-italic font-weight-bold font-label pt-2">Tài khoản:</label>
            </b-col>
            <b-col sm="9" class="pl-0">
              <select-user-cod @model="searchData.selectUser = $event"></select-user-cod>
            </b-col>
          </b-row>
        </b-col>
        <b-col class="my-1" sm="3">
          <b-row>
            <b-col sm="3" class="pr-0">
              <label class="font-italic font-weight-bold font-label pt-2">Từ ngày:</label>
            </b-col>
            <b-col sm="9" class="pl-0">
              <datepicker
                v-model="searchData.from"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                placeholder=""
              />
            </b-col>
          </b-row>
        </b-col>
        <b-col class="my-1" sm="3">
          <b-row>
            <b-col sm="3" class="pr-0">
              <label class="font-italic font-weight-bold font-label pt-2">Đến ngày:</label>
            </b-col>
            <b-col sm="9" class="pl-0">
              <datepicker
                v-model="searchData.to"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                placeholder=""
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="my-1" sm="8">
        </b-col>
        <b-col class="my-1" sm="2">
          <b-btn type="button" variant="primary" class="btn-block" @click="getDataConfigShift"><i
            class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
          </b-btn>
        </b-col>
        <b-col class="my-1" sm="2">
          <b-btn type="button" variant="success" class="btn-block" @click="addItem()"><i
            class="sidenav-icon ion ion-md-add"></i> Thêm mới
          </b-btn>
        </b-col>
      </b-row>
    </b-card>
    <b-card>
      <b-row class="mb-2">
        <b-col>
          Mỗi trang:
          <b-select size="sm" @input="getDataConfigShift" v-model="page.perPage" :options="[20, 50, 100]"
                    class="d-inline-block w-auto"/>
        </b-col>
        <b-col v-if="page.totalItems" class="col-sm text-sm-left text-center">
          <div class="row float-right">
            <span class="text-muted mr-2">Trang {{ page.currentPage }}/{{ Math.ceil(page.totalItems / page.perPage) }} trên {{ page.totalItems }} bản ghi</span>
            <b-pagination class="justify-content-center justify-content-sm-end m-0 clear-zindex"
                          v-model="page.currentPage"
                          :total-rows="page.totalItems"
                          :per-page="page.perPage"
                          v-on:input="getDataConfigShift"
                          size="sm"
            >
            </b-pagination>
          </div>
        </b-col>
      </b-row>
      <b-table
        id="my-table"
        ref="dataTable"
        :items="dataTable"
        :fields="fieldTable"
        :bordered="true"
        :outlined="true"
        head-variant="light"
        striped
        hover
        style="text-align: center;"
        class="card-table"
        :per-page="page.perPage"
        :current-page="1"
        responsive>
        <template #table-colgroup="scope">
          <col
            v-for="field in scope.fields"
            :key="field.key"
            :style="{ width: (field.key === 'modified') ?  '15%' : 'auto' }"
          >
        </template>
        <template v-slot:cell(modified)="data">
          <p class="text-left text-info font-weight-bold"> {{ data.item.modified_name }} ( <i
            class="font-weight-normal"> {{ (data.item.created) }} </i> )</p>
        </template>
        <template v-slot:cell(edit)="data">
          <b-btn variant="outline-success borderless icon-btn" class="btn-sm"
                 v-on:click="showItem(data.item)"><i class="ion ion-md-create"></i></b-btn>
          <b-btn variant="outline-danger borderless icon-btn" class="btn-sm ml-5"
                 v-on:click="deleteItem(data.item)"><i
            class="ion ion-md-close"></i>
          </b-btn>
        </template>
        <template v-slot:cell(manager_xlhh)="data">
          <button type="button" class="rounded btn btn-outline-success"><a :href="url + data.item.user_id" target="_blank" style="color: #02BC77">Chỉnh sửa</a></button>
        </template>
      </b-table>
    </b-card>
    <div>
      <b-modal id="modal-1" v-if="showModal" @close="showModal = true" title="Cập nhật ca làm việc"
               :hide-footer="true">
        <b-row class="pt-2">
          <b-col sm="3" class="pr-0">
            <label class="font-italic font-weight-bold font-label pt-2">Tài khoản:</label>
          </b-col>
          <b-col sm="9" class="pl-0" v-if="updateData.id === null">
            <select-user-cod @model="updateData.userSelect = $event"></select-user-cod>
          </b-col>
          <b-col sm="9" class="pl-0" v-else-if="updateData.id !== null">
            <input type="text" id="username" name="username" v-model="updateData.username" disabled><br><br>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col sm="3" class="pr-0">
            <label class="font-italic font-weight-bold font-label pt-2">Ca làm việc:</label>
          </b-col>
          <b-col sm="9" class="pl-0">
            <select-shift @select="handleSelectedShift" :shift="updateData.shift"></select-shift>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col sm="3" class="pr-0">
            <label class="font-italic font-weight-bold font-label pt-2">Ngày bắt đầu:</label>
          </b-col>
          <b-col sm="9" class="pl-0">
            <datepicker
              v-model="updateData.from_date"
              format="dd-MM-yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              placeholder=""
            />
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col sm="3" class="pr-0">
            <label class="font-italic font-weight-bold font-label pt-2">Ngày kết thúc:</label>
          </b-col>
          <b-col sm="9" class="pl-0">
            <datepicker
              v-model="updateData.to_date"
              format="dd-MM-yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              placeholder=""
            />
          </b-col>
        </b-row>
        <br>
        <div class="mb-4 text-center">
          <b-row>
            <b-col sm="6">
              <b-btn type="button" class="btn btn-primary pl-4 pr-4 btn-block" @click="editConfigShift()">Cập nhật</b-btn>
            </b-col>
            <b-col sm="6">
              <b-btn type="button" class="btn-block" @click="$bvModal.hide('modal-1')">Đóng</b-btn>
            </b-col>
          </b-row>
        </div>
      </b-modal>
    </div>
    <div>
      <b-modal id="modal-2" v-if="showModal" @close="showModal = true" :hide-footer="true" title="Xóa ca làm việc">
        <h4><p>Bạn có chắc chắn muốn xóa bản ghi ca làm việc của <b class="text-primary"> {{ updateData.username }}</b>
        </p></h4>
        <div class="mb-4 text-center">
          <b-row>
            <b-col sm="6">
              <b-btn type="button" class="btn btn-danger pl-4 pr-4 btn-block"
                     @click="editConfigShift(), $bvModal.hide('modal-2')">
                Xóa
              </b-btn>
            </b-col>
            <b-col sm="6">
              <b-btn type="button" class="btn-block" @click="$bvModal.hide('modal-2')">Bỏ qua</b-btn>
            </b-col>
          </b-row>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/kpi-penalty-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import shiftConfig from 'domain/services/shift-config'
import VueMonthlyPicker from 'vue-monthly-picker'
import Datepicker from 'vuejs-datepicker'
import Moment from 'moment'
import SelectedStationPenalty from 'components/pages/erp/kpi/penalties/SelectedStationPenalty'
import SelectUserCod from './SelectUserCod'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SelectShift from 'components/elements/common/SelectShift'

export default {
  name: 'shift-manage',
  metaInfo: {
    title: 'XLHH ca làm việc'
  },
  components: {
    SelectShift,
    Multiselect,
    Datepicker,
    flatPickr,
    VueMonthlyPicker,
    Moment,
    commonHelper,
    shiftConfig,
    SelectedStationPenalty,
    SelectUserCod
  },
  data: () => ({
    fieldTable: [
      {key: 'id', label: 'Id', sortable: true},
      {key: 'name', label: 'Kho', sortable: true},
      {key: 'username', label: 'Tài khoản', sortable: true},
      {key: 'from', label: 'Bắt đầu ca', sortable: true},
      {key: 'to', label: 'Kết thúc ca', sortable: false},
      {key: 'from_date', label: 'Ngày bắt đầu áp dụng', sortable: true},
      {key: 'to_date', label: 'Ngày kết thúc áp dụng', sortable: false},
      {key: 'modified', label: 'Thay đổi', sortable: false},
      {key: 'edit', label: 'Chỉnh sửa', sortable: false},
      {key: 'manager_xlhh', label: 'Người quản lý', sortable: false}
    ],
    page: {
      currentPage: 1,
      totalPages: 1,
      perPage: 20,
      totalItems: 0
    },
    dataTable: [],
    searchData: {
      from: null,
      to: null,
      selectUser: [],
      selectStation: []
    },
    updateData: {
      userSelect: [],
      id: null,
      username: null,
      user_id: null,
      shift: null,
      from: '',
      to: '',
      from_date: '',
      to_date: '',
      is_active: 0
    },
    listHour: [],
    distance: 10,
    showModal: true,
    url: ''
  }),
  created () {
    this.url = `${location.protocol}//${location.host}/adm/user/edit/`
    this.setDate()
    this.getDataConfigShift()
    this.getListShiftHour()
  },
  methods: {
    setDate () {
      this.searchData.from = Moment(new Date()).format('YYYY-MM-01')
      this.searchData.to = Moment(new Date()).format('YYYY-MM-DD')
    },
    handleSelectedShift (option) {
      this.updateData.shift = option
      this.updateData.from = option.from
      this.updateData.to = option.to
    },
    getDataConfigShift () {
      let params = {
        users: this.searchData.selectUser,
        stations: this.searchData.selectStation,
        page: this.page.currentPage,
        limit: this.page.perPage
      }
      if (this.searchData.from) {
        params.from_date = Moment(this.searchData.from).format('YYYY-MM-DD')
      }
      if (this.searchData.to) {
        params.to_date = Moment(this.searchData.to).format('YYYY-MM-DD')
      }
      shiftConfig.getShiftConfig(params).then((res) => {
        if (res.data.success) {
          this.dataTable = res.data.data
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
        if (res.data.general) {
          this.page.totalItems = res.data.general
        } else {
          this.page.totalItems = 0
        }
      })
        .catch((e) => {
          console.log(e)
        })
    },
    showItem (item) {
      this.formatUpdateData()
      this.updateData.id = item.id
      this.updateData.user_id = item.user_id
      this.updateData.username = item.username
      this.updateData.from = item.from
      this.updateData.to = item.to
      this.updateData.from_date = item.from_date
      this.updateData.to_date = item.to_date
      this.updateData.is_active = 0
      this.updateData.shift = {from: item.from, to: item.to}
      this.$bvModal.show('modal-1')
    },
    addItem () {
      this.formatUpdateData()
      this.$bvModal.show('modal-1')
    },
    deleteItem (item) {
      this.formatUpdateData()
      this.updateData.id = item.id
      this.updateData.user_id = item.user_id
      this.updateData.username = item.username
      this.updateData.from = item.from
      this.updateData.to = item.to
      this.updateData.from_date = Moment(item.to_date).format('YYYY-MM-DD')
      this.updateData.to_date = Moment(item.to_date).format('YYYY-MM-DD')
      this.updateData.is_active = 1
      this.$bvModal.show('modal-2')
    },
    formatUpdateData () {
      this.updateData.id = null
      this.userSelect = []
      this.updateData.user_id = null
      this.updateData.username = null
      this.updateData.shift = null
      this.updateData.from = ''
      this.updateData.to = ''
      this.updateData.from_date = ''
      this.updateData.to_date = ''
      this.updateData.is_active = 0
    },
    editConfigShift () {
      if (this.updateData.user_id === null && this.updateData.userSelect.length > 0) {
        this.updateData.user_id = this.updateData.userSelect[0]
      }
      let params = {
        id: this.updateData.id,
        user_id: this.updateData.user_id,
        from: (this.updateData.from) ? ((this.updateData.from.length >= 8) ? this.updateData.from : (this.updateData.from + ':00')) : null,
        to: (this.updateData.to) ? ((this.updateData.to.length >= 8) ? this.updateData.to : (this.updateData.to + ':00')) : null,
        from_date: (this.updateData.from_date) ? Moment(this.updateData.from_date).format('YYYY-MM-DD') : null,
        to_date: (this.updateData.to_date) ? Moment(this.updateData.to_date).format('YYYY-MM-DD') : null
      }
      if (this.updateData.is_active === 1) {
        params.is_active = 1
      }
      shiftConfig.updateShiftConfig(params).then((res) => {
        if (res.data.success) {
          this.formatUpdateData()
          this.$bvModal.hide('modal-1')
          this.getDataConfigShift()
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      })
        .catch((e) => {
          console.log(e)
        })
    },
    getListShiftHour () {
      shiftConfig.getListShiftConfig().then((res) => {
        if (res.data.success) {
          this.listHour = res.data.data
          this.distance = res.data.distance
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
