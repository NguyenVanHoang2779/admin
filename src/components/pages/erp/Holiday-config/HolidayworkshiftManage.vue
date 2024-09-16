<template>
  <div class="wrapper">
    <b-row class="top align-items-center">
      <b-col md="4">
        <h4 class="m-0">Danh sách ngày nghỉ lễ</h4>
      </b-col>
      <b-col md="8" class="text-right">
        <b-button variant="ghtk" @click="openAddModal">
          <i class="ion ion-md-add"></i> Thêm ngày lễ
        </b-button>
      </b-col>
    </b-row>
    <div class="seperate-xs my-1"></div>
    <div class="mb-3">
      <div class="paging mt-3 mx-3">
        <div class="z-0 d-inline-block">
          <b-pagination
            class="mb-1"
            size="sm"
            align="left"
            v-model="currentPage"
            :total-rows="totalItems"
            :per-page="perPage"
          >
          </b-pagination>
        </div>
        <b class="float-right">Trang {{ currentPage }}/{{ totalPages }}</b>
      </div>
      <div class="wrapper-list-master">
        <b-card no-body>
          <table class="table table-hover table-bordered table-sm mb-0 mih-5re">
            <thead>
            <tr>
              <th>ID</th>
              <th>Ngày</th>
              <th>Tên ngày lễ</th>
              <th>Nhân viên không tính KPI</th>
              <th>Nhân viên tính KPI</th>
              <th>Lương overtime HĐDV</th>
              <th>Người chỉnh sửa</th>
              <th>Hành động</th>
            </tr>
            </thead>
            <tbody v-loading="appLoading" class="position-relative">
            <tr v-for="(holiday, index) in listALlHoliday" :key="index">
              <td>{{holiday.id}}</td>
              <td>{{holiday.date}}</td>
              <td>{{holiday.name}}</td>
              <td>{{convertOvertimeAndKpi(holiday.overtime_workshift, holiday.kpi_workshift, 'noKpi')}}</td>
              <td>{{convertOvertimeAndKpi(holiday.overtime_workshift, holiday.kpi_workshift, 'yesKpi')}}</td>
              <td>{{holiday.service_ot}}</td>
              <td>{{holiday.username}}</td>
              <td>
                <b-button @click="sendDataModal(holiday)" variant="ghtk" >
                  <i class="ion ion-md-create"></i>
                </b-button>
                <b-button @click="deleteHoliday(holiday.id)" variant="ghtk" style="background-color: red" >
                  <i class="ion ion-md-trash"></i>
                </b-button>
              </td>
            </tr>
            </tbody>
          </table>
        </b-card>
      </div>
    </div>
    <ModalAddHoliday
      v-show="isModalVisible"
      @close="closeModal"
      @loading ="reload"
      :holiday-modal="holidayModal"
    />
  </div>
</template>

<style scoped lang="scss">
.image-gallery {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  vertical-align: initial;
}
.wrapper-list-master {
  position: relative;
  min-height: 120px;
}
.h-col-50 .col-md-2 {
  max-height: 50px;
}
.exporting-btn {
  span {
    position: relative; padding-left: 20px
  }
  .sk-folding-cube.sk-primary{
    position: absolute;
    height: 12px;
    width: 12px;
    top: -37px;
    left: 0
  }
}
</style>

<script>
// service
import holidayConfigService from 'domain/services/holiday-config-service'
import ModalAddHoliday from './ModalAddHoliday'
import commonHelper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'holiday-workshift-config',
  components: {
    holidayConfigService,
    ModalAddHoliday,
    commonHelper
  },
  data: () => ({
    listALlHoliday: [],
    date: '',
    name: '',
    holidayModal: null,
    currentPage: 1,
    perPage: 10,
    totalItems: '',
    appLoading: false,
    isModalVisible: false,
    isAdd: false
  }),

  watch: {
    currentPage: function (newValue, oldValue) {
      this.getListAllHoliday()
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  created () {
    this.getListAllHoliday()
  },

  methods: {
    getListAllHoliday () {
      this.appLoading = true
      let data = {
        currentPage: this.currentPage
      }
      holidayConfigService.getAllHoliday(data)
        .then(res => {
          if (res.data.success) {
            this.listALlHoliday = res.data.data.data_page
            this.totalItems = res.data.data.totalItems
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },
    openAddModal () {
      this.holidayModal = null
      this.$bvModal.show('id_modalAdd')
    },
    closeModal () {
      this.$bvModal.hide('id_modalAdd')
    },
    reload (type) {
      if (type !== 'update') {
        this.currentPage = 1
      }
      this.getListAllHoliday()
    },
    sendDataModal (data) {
      this.holidayModal = data
      this.$bvModal.show('id_modalAdd')
    },
    convertOvertimeAndKpi (dataOT, dataKPI, type) {
      let index = 1
      if (type === 'noKpi') index = 0
      return dataKPI[index] + ' ' + 'KPI,    ' + dataOT[index] + ' OT'
    },
    deleteHoliday (holidayId) {
      if (!confirm('Bạn có chắc chắn muốn xóa ngày lễ này không')) return 1
      let data = {
        id: holidayId
      }
      holidayConfigService.deleteHoliday(data)
        .then(res => {
          if (res.data.success) {
            this.reload('update')
            return commonHelper.showMessage(res.data.message, 'success')
          } else {
            return commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    }
  }
}
</script>
