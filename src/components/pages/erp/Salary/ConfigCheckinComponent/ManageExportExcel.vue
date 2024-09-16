<template>
  <b-card>
    <b-card-body>
    <b-row class="ml-1 mr-1">
      <h4 class="ml-3">Quản Lý Các File Excel Đã Export</h4>
    </b-row>
    <b-row class="ml-1 mr-1">
      <b-col>
        <multiselect class="multiselect-primary"
         v-model="option"
         :options="options"
         :multiple="false"
         placeholder="Chọn Loại File"
         label="name"
         track-by="name"
         selectedLabel="Đã chọn"
         deselectLabel="Bỏ chọn"
         selectLabel="Chọn"
         :disabled="false"
         :hide-selected="false"
         :close-on-select="true"
        >
          <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
        </multiselect>
      </b-col>
      <b-col class="ml-3">
        <b-form-group>
          <flat-pickr v-model="selectedRangeTime" :config="rangeConfig" placeholder="Chọn khoảng thời gian"/>
          <p v-if="selectedRangeTime !== '' " style="font-size: 13px; line-height: 30px"><i>&emsp;(*) ứng với
            dữ liệu từ <span style="color: red">{{selectedRangeTime.split(' to ')[0]}} 00:00:00</span> đến <span
              class="require">{{selectedRangeTime.split(' to ')[1]}} 23:59:59</span></i></p>
        </b-form-group>
      </b-col>
      <b-col>
        <b-button class="btn btn-outline-info ml-3 mr-3" @click="getExportedFileByCondition(0)">Tìm Kiếm Tất Cả</b-button>
        <b-button class="btn btn-outline-success ml-3 mr-3" @click="getExportedFileByCondition(1)">Các File Tôi Xuất</b-button>
      </b-col>
      <b-col>
        <b-form-input
          class="mb-3"
          v-model="filter"
          type="search"
          id="filterInput"
          placeholder="Nhập Nội Dung Để Lọc"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row class="ml-1 mr-1">
      <b-table
          class="ml-1 mr-1"
          :fields="fields"
          :items="listFileExported"
          :filter="filter"
          :per-page="perPage"
          :current-page="currentPage"
        >
          <template
            v-slot:cell(actions)="row"
          >
            <b-button-group>
              <b-button size="sm"  class="mr-1 btn btn-outline-success" :href="row.item.file_path">
                Tải Xuống
              </b-button>
              <b-button size="sm"  class="mr-1 btn btn-outline-danger" @click="deleteFile(row.item.id)">
                Xóa
              </b-button>
            </b-button-group>
          </template>
        </b-table>
      </b-row>
      <b-row class="d-flex justify-content-center">
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
      </b-row>
      <hr>
    </b-card-body>
  </b-card>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
</style>

<script>
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SalaryService from 'domain/services/salary-service'
export default {
  name: 'manage-exported-excel',

  components: {
    Multiselect,
    flatPickr,
    commonHelper
  },

  props: {
  },

  data: () => ({
    option: null,
    options: [
      {id: 'CHECKIN_PK', name: 'CHECKIN_PK'},
      {id: 'COD_PT', name: 'COD_PT'},
      {id: 'SALE', name: 'SALE'},
      {id: 'CSKH', name: 'CSKH'}
    ],
    selectedRangeTime: '',
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'Y-m-d',
      altFormat: 'Y-m-d'
    },
    startDate: null,
    endDate: null,
    fields: [
      {key: 'id', label: 'ID File', sortable: true},
      {key: 'is_processing', label: 'Is Running', sortable: true},
      {key: 'count_task', label: 'Số Task Thực Thi', sortable: true},
      {key: 'file_name', label: 'Tên File', sortable: true},
      {key: 'is_success', label: 'Is Success', sortable: true},
      {key: 'created_user_id', label: 'Tạo Bởi User Id', sortable: true},
      {key: 'created', label: 'Thời Gian Tạo File', sortable: true},
      {key: 'actions', label: 'Quản Lý', sortable: true}
    ],
    listFileExported: [],
    filter: null,
    perPage: 5,
    currentPage: 1,
    type: null
  }),

  watch: {
    selectedRangeTime: function () {
      this.startDate = this.selectedRangeTime.split(' to ')[0]
      this.endDate = this.selectedRangeTime.split(' to ')[1]
    },
    option: function (newVal, oldValue) {
      this.type = newVal.id
    }
  },

  created () {
  },

  mounted () {
  },

  computed: {
    rows () {
      return this.listFileExported.length
    }
  },

  methods: {
    getExportedFileByCondition (isUser) {
      if (this.type === null) return commonHelper.showMessage('Vui lòng chọn loại file', 'warning')
      if (this.startDate === null || this.endDate === null) return commonHelper.showMessage('Vui Lòng Chọn Khoảng Thời Gian Cần Tìm File', 'warning')
      let from = this.startDate
      let to = this.endDate
      let type = this.type
      SalaryService.getExportedFileByCondition({from, to, type, 'is_user': isUser}).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.listFileExported = res.data.data
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
          this.listFileExported = []
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
      })
    },
    deleteFile (idFile) {
      SalaryService.deleteFile({id: idFile}).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'info')
          this.getExportedFileByCondition(0)
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(() => {
        commonHelper.showMessage('Có Lỗi Xảy Ra. Vui Lòng Thử Lại Sau', 'warning')
      })
    }
  }
}
</script>
