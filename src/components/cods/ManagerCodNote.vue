<template>
    <div class="payslip-manager-page">
        <div class="ui-block">
            <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
                <div>Ghi chú COD chốt ca đặc biệt</div>
            </h4>
            <div class="row">
                <div class="col-sm-9">
                </div>
                <div class="col-sm-3">
                    <b-link href="/erp/cods/note/exportExcelCod" class="btn btn-outline-primary">Xuất excel</b-link>
                    <b-link href="/erp/cods/note/downloadTeamplateExcel" class="btn btn-outline-primary">Download template Excel</b-link>
                </div>
            </div>
            <hr>
            <form id="app" method="post">
                <div class="row">
                        <b-form-group label="Chọn Username" class="col-sm-3">
                            <multiselect
                                    v-model="asyncSelected"
                                    label="name"
                                    track-by="id"
                                    placeholder=""
                                    :options="asyncFound"
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
                        <!--Box chọn ngày bắt đầu -->
                        <b-form-group class="col-sm-3" label="Ngày bắt đầu">
                            <datepicker
                                    v-model="time_start"
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
                        <b-form-group class="col-sm-3" label="Ngày kết thúc">
                            <datepicker
                                    v-model="time_end"
                                    format="dd-MM-yyyy"
                                    :bootstrapStyling="true"
                                    :monday-first="true"
                                    :full-month-name="true"
                                    :calendar-button="true"
                                    calendar-button-icon="ion ion-md-calendar"
                                    :clear-button="true"
                            />
                        </b-form-group>
                        <b-form-group class="col-sm-3" label="Bỏ phạt">
                            <b-select v-model="detail" :options="options" />
                        </b-form-group>
                        <b-form-group class="col-sm-3" label="Ghi chú">
                            <b-textarea rows="3" v-model="description" />
                        </b-form-group>
                </div>
                <hr>
                <div class="row">
                    <div class="col-sm-9">
                        <b-form-group class="col-sm-4" label="Import file Excel">
                            <b-form-file class="inputFile" v-model="fileEx" ref="fileEx" plain
                                         accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"></b-form-file>
                        </b-form-group>
                    </div>
                    <div class="col-sm-3">
                            <b-btn type="button" variant="outline-primary" @click="postNote"><i
                                    class="fa fa-plus-square"
                                    aria-hidden="true"></i> Thêm ghi
                                chú
                            </b-btn>
                            <b-btn type="button" variant="outline-success" @click="search"><i
                                    class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
                            </b-btn>
                            <b-btn type="button" variant="outline-success" @click="loadData">Tất cả</b-btn>
                    </div>
                </div>
                <br>
            </form>
        </div>
        <b-card no-body>
            <b-table
                    id="my-table"
                    :items="load"
                    :fields="fields"
                    :per-page="perPage"
                    :current-page="currentPage"
                    class="text-center"
            >
                <template v-slot:cell(username)="data">
                    <b-badge variant="outline-info">{{data.item.username}}</b-badge>
                </template>
                <template v-slot:cell(detail)="data">
                    <b-badge variant="outline-secondary">{{data.item.detail}}</b-badge>
                </template>
                <template v-slot:cell(option)="data">
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs"
                           v-on:click="updateChange(data.item)"><i class="ion ion-md-create"></i></b-btn>
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
        </b-card>
        <b-modal id="modal-1" v-if="showModal" @close="showModal = true" :hide-footer="true" :hide-header="true">
            <form method="post">
                <div class="row">
                    <!--Box nhap ten dang nhap -->
                    <div class="col-md-12">
                        <label class="form-label d-none d-md-block">UserName</label>
                        <b-input type="text" v-model="usernameE" name="usernameE" placeholder="Username" disabled/>
                    </div>
                    <!--Box nhap ho ten -->
                    <div class="col-md-12">
                        <label class="form-label d-none d-md-block">Họ tên</label>
                        <b-input type="text" v-model="fullnameE" name="fullnameE" placeholder="Nhập họ tên" disabled/>
                    </div>
                    <!--Box chọn ngày bắt đầu -->
                    <div class="col-md-12">
                        <label class="form-label d-none d-md-block">Ngày Bắt Đầu </label>
                        <datepicker
                                v-model="time_startE"
                                format="dd-MM-yyyy"
                                :bootstrapStyling="true"
                                :monday-first="true"
                                :full-month-name="true"
                                :calendar-button="true"
                                calendar-button-icon="ion ion-md-calendar"
                                :clear-button="true"
                        />
                    </div>
                    <!--Box chọn ngày kết thúc -->
                    <div class="col-md-12">
                        <label class="form-label d-none d-md-block">Ngày kết thúc</label>
                        <datepicker
                                v-model="time_endE"
                                format="dd-MM-yyyy"
                                :bootstrapStyling="true"
                                :monday-first="true"
                                :full-month-name="true"
                                :calendar-button="true"
                                calendar-button-icon="ion ion-md-calendar"
                                :clear-button="true"
                        />
                    </div>
                    <div class="col-md-12">
                        <label class="form-label d-none d-md-block">Bỏ phạt</label>
                        <b-select v-model="detailE" :options="options" />
                    </div>
                    <div class="col-md-12">
                        <label class="form-label d-none d-md-block">Lý do</label>
                            <b-textarea rows="3" v-model="descriptionE" />
                    </div>
                </div>
                <br>
                <div class="mb-4 text-center">
                    <b-btn type="button" variant="outline-primary" @click="postUpdate">Sửa</b-btn>
                    <b-btn type="button" @click="$bvModal.hide('modal-1')">Đóng</b-btn>
                </div>
            </form>
        </b-modal>
    </div>
</template>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import Multiselect from 'vue-multiselect'
import SalaryService from 'domain/services/salary-service'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import commonHelper from 'infrastructures/helpers/common-helpers'
import debounce from 'debounce'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'

export default {
  name: 'cod-note',
  metaInfo: {
    title: 'Ghi chú COD chốt ca'
  },
  data () {
    return {
      detail: 'khong_phien',
      options: [
        {value: 'khong_phien', text: 'Bỏ phạt không phiên chốt'},
        {value: 'mot_phien', text: 'Bỏ phạt một phiên chốt'}
      ],
      description: '',
      id_user: '',
      id_userE: '',
      dataTable: [],
      dataCod: [],
      username: '',
      time_start: new Date(),
      time_end: '',
      error: '',
      errorIdCod: '',
      errors: [],
      fullnameE: '',
      errorE: '',
      descriptionE: '',
      detailE: '',
      usernameE: '',
      time_startE: new Date(),
      time_endE: '',
      id: '',
      page: 1,
      fileEx: null,
      showModal: true,
      selectedRow: 0,
      filename: '',
      totalItems: 0,
      currentPage: 1,
      perPage: 50,
      fields: [
        {
          key: 'id',
          label: 'Id',
          sortable: true
        },
        {
          key: 'username',
          label: 'Username',
          sortable: true
        },
        {
          key: 'fullname',
          label: 'Họ tên',
          sortable: true
        },
        {
          key: 'time_start',
          label: 'Thời gian bắt đầu',
          sortable: true
        },
        {
          key: 'time_end',
          label: 'Thời gian kết thúc',
          sortable: true
        },
        {
          key: 'detail',
          label: 'Bỏ phạt',
          sortable: true
        },
        {
          key: 'description',
          label: 'Lý do',
          sortable: true
        },
        {
          key: 'option',
          label: 'Thao tác',
          sortable: true
        }
      ],
      asyncSelected: [],
      asyncFound: [],
      asyncLoading: false,
      message: 'Nhập ít nhất 2 ký tự'
    }
  },
  components: {
    Datepicker,
    flatPickr,
    debounce,
    Multiselect,
    moment
  },
  created () {
    this.loadData()
  },
  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    },
    load () {
      return this.dataTable
    },
    Page () {
      return this.page
    },
    totalTable () {
      return this.dataTable.length
    }
  },
  methods: {
    formatInput () {
      this.asyncFound = []
      this.asyncSelected = []
      this.time_end = ''
      this.time_start = new Date()
      this.description = ''
    },
    updateChange (data) {
      this.id = data['id']
      this.usernameE = data['username']
      this.id_userE = data['user_id']
      this.fullnameE = data['fullname']
      this.time_startE = data['time_start']
      this.time_endE = data['time_end']
      this.detailE = data['detail']
      this.descriptionE = data['description']
      this.$bvModal.show('modal-1')
    },
    loadData () {
      SalaryService.getCodNote().then(res => {
        this.dataTable = res.data.data
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    postNote () {
      if (this.fileEx === null) {
        let from = moment(this.time_start).format('YYYY-MM-DD')
        let to = moment(this.time_end).format('YYYY-MM-DD')
        if (this.time_end === '') {
          to = ''
        }
        if (from > to && to !== '') {
          return commonHelper.showMessage('Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 'failed')
        }
        if (this.asyncSelected.length === 0) {
          return commonHelper.showMessage('User không được bỏ trống', 'failed')
        }
        let params = {
          userId: this.asyncSelected.id,
          time_start: from,
          time_end: to,
          detail: this.detail,
          description: this.description
        }
        SalaryService.postCodNote(params).then(res => {
          if (res.data.success) {
            this.loadData()
            this.formatInput()
            return commonHelper.showMessage(res.data.message, 'success')
          } else {
            return commonHelper.showMessage(res.data.message, 'failed')
          }
        })
          .catch(e => {
            this.errors.push(e)
          })
      } else {
        let dataTableend = new FormData()
        dataTableend.append('file_upload', this.fileEx)
        SalaryService.importExcel(dataTableend).then(res => {
          if (res.data.success) {
            this.loadData()
            this.formatInput()
            return commonHelper.showMessage('Thêm mới thành công', 'success')
          } else {
            return commonHelper.showMessage(res.data.message, 'failed')
          }
        })
          .catch(e => {
            return commonHelper.showMessage('Upload file thất bại', 'failed')
          })
      }
    },
    deleteItem (item) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
        return
      }
      let parmas = {
        id: item.id
      }
      SalaryService.postCodNoteDelete(parmas).then(res => {
        this.loadData()
        return commonHelper.showMessage('Xóa file thành công', 'success')
      }).catch(e => {
        this.errors.push(e)
      })
    },
    postUpdate () {
      let from = moment(this.time_startE).format('YYYY-MM-DD')
      let to = moment(this.time_endE).format('YYYY-MM-DD')
      if (this.time_endE === '') {
        to = ''
      }
      if (from > to && to !== '') {
        return commonHelper.showMessage('Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 'failed')
      }
      let params = {
        id: this.id,
        time_start: from,
        time_end: to,
        detail: this.detailE,
        description: this.descriptionE
      }
      SalaryService.postCodNoteUpdate(params).then(res => {
        if (res.data.success) {
          this.loadData()
          return commonHelper.showMessage('Update thành công', 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'failed')
        }
      })
        .catch(e => {
          this.errors.push(e)
        })
      this.$bvModal.hide('modal-1')
    },
    search () {
      if (this.asyncSelected.length === 0) {
        return commonHelper.showMessage('User không được bỏ trống', 'failed')
      }
      if (this.time_start === '') {
        return commonHelper.showMessage('Ngày bắt đầu không được bỏ trống', 'failed')
      }
      let from = moment(this.time_start).format('YYYY-MM-DD')
      let to = moment(this.time_end).format('YYYY-MM-DD')
      if (this.time_end === '') {
        to = ''
      }
      let params = {
        userId: this.asyncSelected.id,
        time_start: from,
        time_end: to
      }
      SalaryService.seachCodNote(params).then(res => {
        this.dataTable = res.data.data
      })
        .catch(e => {
          this.errors.push(e)
        })
    },
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      SalaryService.searchCod({term: query}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.asyncFound = response.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    }, 500)
  }
}
</script>
<style lang="scss" scoped>
</style>
