<template>
  <div class="small-scrollbar">
    <form method="get">
      <b-row class="mb-3">
        <b-col cols="2">
          <b-form-select :options="optionsYear" v-model="filter.year" ></b-form-select>
        </b-col>
        <b-col cols="2">
          <b-input v-model="filter.search" placeholder="Số chứng từ/Mã số thuế" />
        </b-col>
        <b-col cols="2">
          <b-input v-model="filter.cerNumberFrom" placeholder="Từ Số chứng từ" />
        </b-col>
        <b-col cols="2">
          <b-input v-model="filter.cerNumberTo" placeholder="Đến Số chứng từ" />
        </b-col>
        <b-col cols="2">
          <v-date-picker
            v-model="range_created"
            mode="range"
            locale="vi"
            color="green"
            class="rounded"
            :input-props="{ placeholder: 'Thời gian tạo ', style: 'font-size:14px; line-height: unset; border-color: #BDBDBD' }"
            :popover="{visibility: 'focus'}"
          />
        </b-col>
        <b-col cols="2" md="2">
          <b-form-select :options="optionStatus" v-model="filter.status"></b-form-select>
        </b-col>
      </b-row>
      <b-row class="align-items-center">
        <b-col cols="2">
          <b-btn variant="ghtk" @click="getListing(1)"><span class="ion ion-md-search" ></span> Tìm kiếm</b-btn>
        </b-col>
        <b-col cols="2">
          <b-btn variant="ghtk" @click="signMultiConfirmCer()"><span class="ion ion-md-mail-open" ></span> Ký thư xác nhận</b-btn>
        </b-col>
        <b-col cols="2">
          <b-btn variant="ghtk" @click="sendSms()"><span class="ion ion-md-send" ></span> Gửi SMS</b-btn>
        </b-col>
        <b-col cols="2">
          <b-btn variant="ghtk" @click="exportCertificates()" :disabled="loadingExcel"><i v-show="loadingExcel" class="fas fa-spinner fa-spin"></i><span v-show="!loadingExcel" class="ion ion-md-document" ></span> Xuất excel</b-btn>
        </b-col>
      </b-row>
    </form>
    <div class="seperate-xs my-1"></div>
    <!-- paging -->
    <div class="paging mx-1">
      <div class="z-0 d-inline-block">
        <b-pagination
          class="mb-1"
          size="sm"
          align="left"
          v-model="pageData.curPage"
          :total-rows="+pageData.totalItems"
          :per-page="pageData.perPage"
          @change="getListing"
        >
        </b-pagination>
      </div>
      <b class="float-right">Trang {{ pageData.curPage }}/{{ pageData.totalPages }}</b>
    </div>
    <!-- list -->
    <table class="table table-sm table-hover table-bordered">
      <thead>
        <tr>
          <th class="text-center">STT</th>
          <th>Họ tên</th>
          <th>Username</th>
          <th>Mã Số Thuế</th>
          <th>Ngày sinh</th>
          <th>Điện thoại</th>
          <th>Mã Số CTu</th>
          <th>Ký hiệu</th>
          <th>Tháng/Năm</th>
          <th>Trạng thái</th>
          <th>File CTT</th>
          <th>Thư XN</th>
          <th class="text-center">SMS</th>
        </tr>
      </thead>
      <tbody v-loading="loading" class="position-relative">
        <tr v-for="(item ,index) in items" :key="item.id">
          <td class="text-center">{{ (pageData.curPage - 1) * pageData.perPage + index + 1 }}</td>
          <td>{{ item.fullname }}</td>
          <td>{{ item.username }}</td>
          <td>{{ item.tax_personal_id_number }}</td>
          <td>{{ item.personal_bod}}</td>
          <td>{{ item.personal_tel}}</td>
          <td>{{ item.certificate_number}}</td>
          <td>{{ item.certificate_serial}}</td>
          <td>{{ item.in_months + '/' + item.in_year}}</td>
          <td>
            <b-badge variant="outline-success" v-if="item.status === 1">Đã ký</b-badge>
            <b-badge variant="outline-danger" v-if="item.status === 2">Đã Hủy</b-badge>
          </td>
          <td>
            <b-link @click="openOriginFile(item.certificate_pdf_file)" v-show="item.certificate_pdf_file"><i class="ion ion-md-eye"></i></b-link>
          </td>
          <td>
            <b-link @click="openOriginFile(item.confirmation_pdf_file)" v-show="item.confirmation_pdf_file"><i class="ion ion-md-eye"></i></b-link>
          </td>
          <td class="text-center">
            <b-btn v-b-modal.modal-sm variant="outline-ghtk" title="Gửi SMS" size="sm">
              <i class="ion ion-md-send"></i>
            </b-btn>
          </td>
        </tr>
        <tr v-show="!items || !items.length">
          <td colspan="20" class="text-center h-25vh align-middle"><b>Không có dữ liệu nào.</b></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// custom component
// service
import IncomeTaxService from 'domain/services/income-tax-service'
import GstorageService from 'domain/services/gstorage-service'
// helper
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment/moment'

export default {
  name: 'manage-dependant',

  props: {
    accept: {
      type: String,
      default: '.xls, .xlsx'
    }
  },

  data () {
    return {
      loading: true,
      loadingExcel: false,
      pageData: {
        curPage: 1,
        totalPages: 0,
        totalItems: 0,
        perPage: 20
      },
      items: [],
      filter: {
        year: new Date().getFullYear(),
        search: '',
        cerNumberFrom: '',
        cerNumberTo: '',
        page: null,
        status: null,
        fromCreated: null,
        toCreated: null
      },
      optionsYear: [],
      optionStatus: [
        { text: '-- Chọn trạng thái --', value: null },
        { text: 'Chờ', value: 0 },
        { text: 'Thành công', value: 1 },
        { text: 'Hủy', value: 2 }
      ],
      range_created: null
    }
  },

  created () {
    this.createYearOption()
    this.getListing()
  },

  methods: {
    createYearOption () {
      let currentYear = new Date().getFullYear()
      for (let i = 0; i < 10; i++) {
        this.optionsYear.push(
          {
            text: ('Năm ' + (currentYear - i)),
            value: (currentYear - i)
          }
        )
      }
    },

    getStartEndFromTimeRange (range) {
      return {
        from: moment(range.start).format('YYYY-MM-DD'),
        to: moment(range.end).format('YYYY-MM-DD')
      }
    },

    prepareFilter () {
      this.loading = true
      let timeFormatCreated = this.range_created != null ? this.getStartEndFromTimeRange(this.range_created) : {}
      this.filter.fromCreated = timeFormatCreated.from
      this.filter.toCreated = timeFormatCreated.to
      this.filter.limit = this.pageData.perPage
    },

    getListing (page = 1) {
      this.prepareFilter()
      this.pageData.curPage = page
      this.filter.page = this.pageData.curPage
      IncomeTaxService.getIncomeTaxListing(this.filter)
        .then(res => {
          if (res.data.success) {
            this.items = res.data.data.data
            this.pageData.totalItems = res.data.data.total
            this.pageData.totalPages = res.data.data.last_page
          } else {
            helper.showMessage(res.data.message || 'Không có dữ liệu.', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage(e.response.data.message || 'Không có dữ liệu.', 'warning')
        })
        .then(_ => {
          this.loading = false
        })
    },

    signMultiConfirmCer () {
      this.prepareFilter()
      IncomeTaxService.signMultiConfirmCertificates(this.filter)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Ký thư xác nhận thành công.', 'success')
          } else {
            helper.showMessage(res.data.message || 'Không có dữ liệu.', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage(e.response.data.message || 'Không có dữ liệu.', 'warning')
        })
        .then(_ => {
          this.loading = false
        })
    },

    sendSms () {
      this.prepareFilter()
      IncomeTaxService.sendSms(this.filter)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Gửi SMS thành công.', 'success')
          } else {
            helper.showMessage(res.data.message || 'Không có dữ liệu.', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage(e.response.data.message || 'Không có dữ liệu.', 'warning')
        })
        .then(_ => {
          this.loading = false
        })
    },

    openOriginFile (url) {
      GstorageService.getOriginFile({file_url: url}).then(res => {
        if (res.data.success) {
          window.open(res.data.data.path, '_blank')
        } else {
          helper.showMessage(res.data.message || 'Không có dữ liệu.', 'warning')
        }
      })
        .catch(e => {
          helper.showMessage(e.response.data.message || 'Không có dữ liệu.', 'warning')
        })
    },

    exportCertificates () {
      this.prepareFilter()
      IncomeTaxService.exportCertificates(this.filter).then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'Chung_tu_thue_' + this.filter.year + '_' + this.filter.cerNumberFrom + '_' + this.filter.cerNumberTo + '.xlsx')
        document.body.appendChild(link)
        link.click()
      }).catch(async (error) => {
        let responseText = await error.response.data.text()
        if (error) {
          let responseObj = JSON.parse(responseText)
          helper.showMessage(responseObj.message || 'Có lỗi xảy ra. Hãy thử lại nhé!', 'warning')
        }
      }).then(() => {
        this.loadingExcel = false
        this.loading = false
      })
    }
  }
}
</script>
