<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <b-row><h4 class="ml-3">Quản Lý Config Bỏ Phạt Tài Xế</h4></b-row>
        <hr>
        <b-row>
          <b-col md="6">
            <label class="form-label">Miền</label>
            <multiselect
              class="multiselect-info"
              :options="regionOptions"
              v-model="regionOption"
              selectLabel="Chọn"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              placeholder="Chọn Miền"
              label="name"
              track-by="id"
              :preserve-search="true"
              :hide-selected="false"
            />
          </b-col>
          <b-col md="6">
            <label class="form-label">Ngày mở</label>
            <b-input placeholder="Ngày" v-model="searchDate" type="date"></b-input>
          </b-col>
        </b-row>
        <br>
        <b-row>
          <b-col md="5"></b-col>
          <b-col md="1">
            <b-btn variant="outline-info" @click="getConfig()" :disabled="isSearching">
              Tìm kiếm <i class="fa fa-search" v-if="!isSearching"></i>
              <i class="fa fa-spinner fa-spin" v-if="isSearching"></i>
            </b-btn>
          </b-col>
          <b-col md="1">
            <b-btn variant="outline-primary" @click="clearSearch()">
              Xóa lọc <i class="fa fa-broom"></i>
            </b-btn>
          </b-col>
          <b-col md="1">
            <b-btn variant="outline-success" @click="createConfig()">
              Tạo mới <i class="fa fa-plus-circle"></i>
            </b-btn>
          </b-col>
        </b-row>
        <br>
        <create-config
          :region-options="regionOptions"
          :edit-config="editConfig"
          :getConfig="getConfig"
          @resetForm="resetForm()"
          :is-created-config="isCreateConfig"
        />
      </b-card-body>
    </b-card>
    <br>
    <b-card no-body>
      <b-card-body>
        <br>
        <b-table
          sort-icon-left
          responsive
          selectable
          :select-mode="`single`"
          sticky-header
          class="card-table"
          ref="dataTable"
          :items="dataConfig"
          :fields="fieldDataConfig"
          :striped="false"
          :bordered="true"
          :outlined="true"
          :hover="true"
          style="text-align: center;"
          :busy="isBusy"
        >
          <template v-slot:cell(manage)="data">
            <b-button class="ml-1 mt-1 mb-1 mr-1" size="sm" variant="outline-success" @click="updateConfigFine(data.item)"><i class="fa fa-pencil-alt"></i></b-button>
            <b-button class="ml-1 mt-1 mb-1 mr-1" size="sm" variant="outline-danger" @click="deleteConfigFine(data.item.id_config)"><i class="fa fa-trash"></i></b-button>
          </template>
        </b-table>
        <br>
        <div class="d-flex justify-content-center">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            class="mt-4"
          >
            <template v-slot:prev-text><span class="text-info">Trang trước</span></template>
            <template v-slot:next-text><span class="text-info">Trang sau</span></template>
            <template v-slot:page="{ page, active }">
              <b v-if="active">{{ page }}</b>
              <i v-else>{{ page }}</i>
            </template>
          </b-pagination>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<style scoped>
.monthly-picker >>> .input {
  font-weight: bold;
  color: #28c3d7 ;
}
.alias-column {
  width: 500px;
}

.desc-column {
  width: 500px;
}

.fa {
  transition: all .5s;
}

button:hover .fa {
  transform: scale(1.2) rotate(30deg);
}

.non-blur >>> .multiselect--disabled {
  opacity: 1!important;
  pointer-events: auto;
}

.non-blur >>> .multiselect__tags {
  background: white;
}

.non-blur >>> .multiselect__tag-icon {
  display: none
}

.monthly-picker {
  border: 1px solid rgba(24, 28, 33, 0.1);
}

.custom-multiselect {
  max-height: 200px;
  overflow: auto;
}
.custom-multiselect::-webkit-scrollbar {
  width: 6px;
  border-radius: 5px;
  background-color:#F5F5F5;
}
.custom-multiselect::-webkit-scrollbar-thumb {
  background-color: rgb(194, 194, 194);
  border-radius: 5px;
}
.custom-multiselect::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #F5F5F5;
}
</style>

<script>
import driverConfigService from 'domain/services/driver-config-value'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import Moment from 'moment'
import CreateConfig from './ModalCreateUpdate'

export default {
  name: 'admin-driver-config',

  components: {
    'multiselect': Multiselect,
    Moment,
    CreateConfig
  },

  data: () => ({
    regionOption: [
      {id: 0, name: 'Cả nước'}
    ],
    regionOptions: [
      {id: 0, name: 'Cả nước'},
      {id: 10, name: 'Miền Bắc'},
      {id: 20, name: 'Miền Trung'},
      {id: 30, name: 'Miền Nam'}
    ],
    isSearching: false,
    dataConfig: [],
    fieldDataConfig: [
      {key: 'id_config', label: 'Mã config', sortable: true},
      {key: 'from_date', label: 'Mở từ ngày', sortable: true},
      {key: 'to_date', label: 'Mở đến ngày', sortable: true},
      {key: 'start_date', label: 'Áp dụng từ ngày( các ngày quá hạn)', sortable: true},
      {key: 'end_date', label: 'Áp dụng đến ngày', sortable: true},
      {key: 'region', label: 'Miền', sortable: true},
      {key: 'list_prov', label: 'Danh sách tỉnh', sortable: true},
      {key: 'list_station', label: 'Danh sách kho', sortable: true},
      {key: 'created_by', label: 'Người tạo', sortable: true},
      {key: 'updated_by', label: 'Người cập nhật', sortable: true},
      {key: 'manage', label: 'Quản lý'}
    ],
    editConfig: null,
    dataDraw: [],
    rows: 1000,
    perPage: 10,
    currentPage: 1,
    isBusy: false,
    isCreateConfig: false,
    searchDate: null
  }),

  created () {
    this.getConfig()
  },

  watch: {
    regionOption: function (newValue, oldValue) {},
    currentPage: function (newValue, oldValue) {
      this.getConfig()
    }
  },

  methods: {
    createConfig () {
      this.isCreateConfig = true
      this.$bvModal.show('create-config-driver')
    },

    resetForm: function () {
      this.editConfig = null
    },

    clearSearch () {
      this.searchDate = null
      this.regionOption = {id: 0, name: 'Cả nước'}
    },

    getConfig () {
      let dataSearch = {
        page: this.currentPage,
        region: 0,
        dateSearch: null,
        perDate: this.perPage
      }

      this.isBusy = true
      this.isSearching = true
      if (this.regionOption.length > 0) dataSearch.region = this.regionOption.id
      if (this.searchDate !== null) dataSearch.dateSearch = this.searchDate
      driverConfigService.apiGetDriverConfigValue(dataSearch).then(res => {
        if (res.data.success) {
          this.dataConfig = Object.values(res.data.data)
          return commonHelper.showMessage(res.data.message, 'success')
        }
        this.dataConfig = []
        return commonHelper.showMessage(res.data.message)
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra khi lấy các config bỏ phạt'))
        .finally(() => {
          this.isBusy = false
          this.isSearching = false
        })
    },

    updateConfigFine (data) {
      this.editConfig = data
      this.isCreateConfig = false
      this.$bvModal.show('create-config-driver')
    },

    deleteConfigFine (idConfig) {
      if (!confirm('Bạn có chắc chắn muốn xóa config bỏ phạt này')) return 1
      driverConfigService.apiDeleteConfigBoPhat({id: idConfig}).then(res => {
        if (res.data.success) {
          this.getConfig()
          return commonHelper.showMessage(res.data.message, 'success')
        }
        return commonHelper.showMessage(res.data.message)
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra khi xóa config bỏ phạt'))
    }
  }
}
</script>
