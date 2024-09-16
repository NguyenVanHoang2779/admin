<template>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <b-col>
          <h3>Quản lý Wifi tại kho</h3>
        </b-col>
        <b-col class="text-right">
          <b-button variant="outline-primary" class="pt-1 pb-1" @click="openAddWifiModal"><i class="ion ion-md-add"></i> Thêm wifi</b-button>
        </b-col>
      </b-row>
      <hr>
      <!-- Search -->
      <b-row>
        <b-col>
          <single-select-station :station-id="filter.stationId" @handleSelectedStation="handleSelectedStation"></single-select-station>
        </b-col>
        <b-col>
          <b-form-input id="filter-bssid" placeholder="Nhập bssid" v-model="filter.bssid" :state="null" trim></b-form-input>
        </b-col>
        <b-col>
          <multiselect
            v-model="filter.status"
            :options="statuses"
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            placeholder="Trạng tháng wifi">
          </multiselect>
        </b-col>
        <!-- <b-col>
          <b-form-input id="filter-created-by" placeholder="Nhập tên đăng nhập người tạo" :state="null" trim></b-form-input>
        </b-col> -->
        <b-col>
          <b-button variant="primary" @click="getListWifi"><i class="ion ion-md-search"></i> Tìm kiếm</b-button>
          <b-button @click="clearSearch"><i class="ion ion-md-close-circle"></i> Xóa lọc</b-button>
        </b-col>
      </b-row>
      <!-- Content -->
      <b-table
        :items="listWifi"
        :fields="fields"
        :striped="true"
        :bordered="true"
        responsive
        style="text-align: center;"
      >
        <template v-slot:cell(bssid)="row">
          <p><b>{{row.item.bssid}}</b></p>
        </template>
        <template v-slot:cell(station_id)="row">
          <single-select-station :stationId="row.item.station_id" :class="`non-blur`" :is-disabled="true"></single-select-station>
        </template>
        <template v-slot:cell(status)="row">
          <b-badge class="custom-badge" :variant="row.item.status === 'active' ? 'success' : 'warning'"><b>{{row.item.status}}</b></b-badge>
        </template>
        <template v-slot:cell(action)="row">
          <b-button variant="primary" size="sm" @click="editWifi(row.item)"><i class="ion ion-md-create"></i> Chỉnh sửa</b-button>
        </template>
      </b-table>
      <!-- Pagination -->
      <b-pagination
        v-if="page.totalItems"
        v-model="page.currentPage"
        :total-rows="page.totalItems"
        :per-page="page.perPage"
        size="sm"
        class="mb-0"
        align="center"
        @input="getListWifi(page.currentPage)"
      ></b-pagination>
      <!-- Modal add new wifi -->
      <add-wifi :trigger-show="triggerShow" :obj-wifi="objWifi" @success="getListWifi"></add-wifi>
    </b-card-body>
  </b-card>
</template>

<script>
import AddWifi from './AddWifi'
import Multiselect from 'vue-multiselect'
import WifiService from 'domain/services/wifi-service'
import CommonHelper from 'infrastructures/helpers/common-helpers'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'

export default {
  name: 'ManageWifi',

  components: {
    AddWifi,
    Multiselect,
    CommonHelper,
    SingleSelectStation
  },

  created () {
    this.getListWifi(1)
  },

  data: () => ({
    triggerShow: false,
    objWifi: null,
    listWifi: [],
    fields: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Tên wifi', sortable: true },
      { key: 'bssid', label: 'Bssid', sortable: true },
      { key: 'station_id', label: 'Kho', sortable: true },
      { key: 'status', label: 'Trạng thái', sortable: true },
      // { key: 'created_by', label: 'Người tạo', sortable: true },
      { key: 'created', label: 'Thời gian tạo', sortable: true },
      { key: 'action', label: 'Chỉnh sửa', sortable: true }
    ],
    filter: {
      stationId: '',
      bssid: '',
      status: '',
      createdBy: ''
    },
    statuses: ['active', 'disable'],
    page: {
      totalItems: 0,
      currentPage: 1,
      perPage: 15,
      totalPages: 1
    }
  }),

  methods: {
    openAddWifiModal: function () {
      this.triggerShow = !this.triggerShow
    },

    getListWifi: function (page) {
      let data = {
        stationId: this.filter.stationId,
        status: this.filter.status,
        bssid: this.filter.bssid,
        perPage: this.page.perPage,
        page: page
      }
      WifiService.getListWifi(data).then(res => {
        if (res.data.success) {
          this.listWifi = res.data.data
          this.page.totalItems = res.data.total
          this.page.totalPages = Math.ceil(res.data.total / this.page.perPage)
          CommonHelper.showMessage(res.data.message, 'success')
        } else {
          CommonHelper.showMessage(res.data.message, 'warning')
          this.listWifi = []
        }
      }).catch(error => {
        console.log(error)
      })
    },

    search: function () {
      if (this.filter.stationId || this.filter.bssid || this.filter.status) {
        WifiService.getListWifi(this.filter).then(res => {
          if (res.data.success) {
            this.listWifi = res.data.data
            this.page.totalItems = res.data.total
            this.page.totalPages = Math.ceil(res.data.total / this.page.perPage)
            CommonHelper.showMessage(res.data.message, 'success')
          } else {
            CommonHelper.showMessage(res.data.message, 'warning')
            this.listWifi = []
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },

    editWifi: function (data) {
      this.objWifi = data
      this.openAddWifiModal()
    },

    clearSearch: function () {
      this.filter = {
        stationId: '',
        bssid: '',
        status: '',
        createdBy: ''
      }
    },

    handleSelectedStation: function (option) {
      this.filter.stationId = option ? option.id : ''
    }
  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
  .center {
    text-align: center;
  }

  .custom-badge {
    padding: 5px 10px 5px 10px;
    width: 60px;
  }
</style>
