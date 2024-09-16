<template>
  <div>
    <b-card no-body>
      <b-tabs content-class="mt-3" card v-model="tabIndex">
        <b-tab title="Danh sách module" :title-link-class="linkClass(0)">

          <div class="ui-block mb-4">
            <h1
              style="display: inline-flex"
              class="ui-block-heading"
            >Thông tin quản lý Module</h1>
            <b-btn variant="success" @click="tabIndex = 1" style="float: right;">
              <i class="fa fa-plus-circle"></i>
              Tạo mới
            </b-btn>
            <hr />
          </div>
          <b-row class="justify-content-md-center mb-2">
            <b-col md="6">
              <b-form-group label="Chọn module:">
                <multiselect
                  class="multiselect-info"
                  :options="listModuleLV"
                  :multiple="true"
                  v-model="filter.module"
                  placeholder="Chọn module"
                  label="name"
                  track-by="id"
                  :disabled="isEdit"
                  :close-on-select="true"
                  :preserve-search="true"
                  :hide-selected="true"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Chọn tỉnh:">
                <multiselect
                  class="multiselect-info"
                  :options="listProvince"
                  :multiple="true"
                  v-model="filter.province"
                  placeholder="Chọn tỉnh"
                  label="name"
                  track-by="id"
                  :disabled="isEdit"
                  :close-on-select="true"
                  :preserve-search="true"
                  :hide-selected="true"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="mt-4 mb-5 d-flex justify-content-center">
            <b-col md="1">
              <b-button variant="outline-info" @click="getConfigByConditions(false)">
                <i class="sidenav-icon ion ion-md-search"></i>
                Tìm kiếm
              </b-button>
            </b-col>
            <b-col md="1">
              <b-button variant="outline-danger" @click="resetFilter">
                <i class="sidenav-icon ion ion-ios-remove-circle"></i>
                Reset filter
              </b-button>
            </b-col>
          </b-row>

          <!-- Bang hien thi cac config -->
          <div v-if="pageAppLoading" class="sk-circle sk-primary">
            <div class="sk-circle1 sk-child"></div>
            <div class="sk-circle2 sk-child"></div>
            <div class="sk-circle3 sk-child"></div>
            <div class="sk-circle4 sk-child"></div>
            <div class="sk-circle5 sk-child"></div>
            <div class="sk-circle6 sk-child"></div>
            <div class="sk-circle7 sk-child"></div>
            <div class="sk-circle8 sk-child"></div>
            <div class="sk-circle9 sk-child"></div>
            <div class="sk-circle10 sk-child"></div>
            <div class="sk-circle11 sk-child"></div>
            <div class="sk-circle12 sk-child"></div>
          </div>
          <table v-else id="my-table" class="table b-table table-bordered table-striped">
            <thead class="thead-light">
            <tr class="text-primary">
              <th class="text-center">#</th>
              <th class="text-center">Tên module</th>
              <th class="text-center">Loại</th>
              <th class="text-center">Kho hàng</th>
              <th class="text-center">Tỉnh đích</th>
              <th class="text-center"><i class="fa fa-cogs"/></th>
            </tr>
            </thead>
            <tbody v-for="(data, index) in dataGroupConfig" :key="index">
            <tr class="">
              <td class="text-center">{{index + (currentPage-1)*perPage}}</td>
              <td class="text-center">{{data.module_alias}}</td>
              <td class="text-center">{{data.module_type}}</td>
              <td class="text-center">{{data.station_name}}</td>
              <td class="text-center">
                <ListView
                  :options="data.list_province.map(e => e.name)"
                />
              </td>
              <td class="text-center">
                <b-button size="sm" variant="outline-success" @click="updateConfig(data.module_id)">
                  <i class="fa fa-pencil-alt"/>
                </b-button>
                <b-button size="sm" variant="outline-danger" @click="deleteConfig(data.module_id)">
                  <i class="fa fa-window-close"/>
                </b-button>
              </td>
            </tr>
            </tbody>
          </table>
          <!--        phan trang-->
          <b-row class="d-flex justify-content-center">
            <b-pagination
              :total-rows="totalItems"
              v-model="currentPage"
              :per-page="perPage"
              v-on:input="paginate"
            />
          </b-row>
        </b-tab>
        <b-tab title="Thêm module mới" :title-link-class="linkClass(1)">
          <b-row>
            <b-col md="1">
              <label>Tên module:</label>
            </b-col>
            <b-col md="11">
              <multiselect
                class="multiselect-info"
                :options="listModuleLV"
                :multiple="false"
                v-model="dataSend.module"
                placeholder="Chọn module"
                label="name"
                track-by="id"
                :disabled="isEdit"
                :close-on-select="true"
                :preserve-search="true"
                :hide-selected="true"
              />
            </b-col>
          </b-row>
          <b-row class="mt-3">
            <b-col md="1">
              <label>Tỉnh đích:</label>
            </b-col>
            <b-col md="11">
              <multiselect
                class="multiselect-info"
                :options="listProvince"
                :multiple="true"
                v-model="dataSend.list_province"
                placeholder="Chọn tỉnh đích"
                label="name"
                track-by="id"
                :close-on-select="false"
                :preserve-search="true"
                :hide-selected="true"
              />
            </b-col>

            <div class="text-center mt-5 w-100">
              <b-button @click="saveConfig" variant="outline-success">
                Lưu và xem kết quả <i class="fa fa-save"/>
              </b-button>
            </div>
          </b-row>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import ListView from '../../BagConfig/Component/ListView'
import CompanyProfileService from 'domain/services/company-profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'

export default {
  name: 'ModuleProvince',
  components: {
    ListView,
    Multiselect
  },
  mounted () {
    this.getConfigByConditions(false)
    this.getListModuleProvinceLV()
    this.getListProvinces()
  },
  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  data: () => {
    return {
      dataSend: {
        module: null,
        list_province: null
      },
      filter: {
        module_id: null,
        province_id: null,
        module: null,
        province: null
      },
      isEdit: false,
      tabIndex: 0,
      isLoading: false,
      totalItems: 0,
      perPage: 5,
      currentPage: 1,
      dataGroupConfig: [],
      dataFetch: [],
      pageAppLoading: false,
      listModuleLV: [],
      listProvince: []
    }
  },
  watch: {
    tabIndex: function (newVal, oldVal) {
      if (newVal === 0) {
        this.isEdit = false
      }
    },

    isEdit: function (newVal, oldVal) {
      if (!newVal) {
        this.dataSend = {
          module: null,
          list_province: null
        }
      }
    }
  },
  methods: {
    paginate () {
      let start = (this.currentPage - 1) * this.perPage
      let end = this.perPage + start
      this.dataGroupConfig = this.dataFetch.slice(start, end)
    },
    linkClass (idx) {
      if (this.tabIndex === idx) {
        return ['bg-success', 'text-white']
      } else {
        return ['bg-light', 'text-dark']
      }
    },
    async getConfigByConditions (useLastRequest = false) {
      this.pageAppLoading = true

      try {
        let dataSend = {
          per_page: this.perPage
        }

        if (this.filter) {
          if (this.filter.module !== null) {
            dataSend.module_id = this.filter.module.map(e => e.id)
          }
          if (this.filter.province !== null) {
            dataSend.province_id = this.filter.province.map(e => e.id)
          }
        }

        if (useLastRequest) {
          dataSend = this.lastRequest
          dataSend.page = this.currentPage
        } else {
          this.currentPage = 1
        }
        this.lastRequest = dataSend
        let result = await CompanyProfileService.getListModuleProvince(dataSend)

        if (result.data.success === false) {
          this.resetDataGroupConfig()
          commonHelper.showMessage('Có lỗi xảy ra', 'failed')
        } else {
          this.saveToDataGroupConfig(result)
          // commonHelper.showMessage(result.data.message, 'success')
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
      this.pageAppLoading = false
    },

    async getListModuleProvinceLV () {
      try {
        let result = await CompanyProfileService.getListModuleProvinceLV()
        this.listModuleLV = result.data.data
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách module')
      }
    },

    async getListProvinces () {
      CompanyProfileService.getListProvinceBagConfig().then(res => {
        if (!res.data.success) return commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách tỉnh!')
        else this.listProvince = res.data.data
      }).catch(() => commonHelper.showMessage('Có lỗi khi lấy danh sách tỉnh'))
    },

    async saveConfig () {
      try {
        let dataSend = {
          module_id: this.dataSend.module.id,
          list_province: this.dataSend.list_province.map(e => e.id)
        }

        let result = null
        if (this.isEdit) {
          result = await CompanyProfileService.updateModuleProvince(dataSend)
        } else {
          result = await CompanyProfileService.createModuleProvince(dataSend)
        }

        if (!result.data.success) return commonHelper.showMessage(result.data.message)
        else {
          commonHelper.showMessage('Lưu thành công', 'success')
          this.getConfigByConditions(true)
          this.tabIndex = 0
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },

    async updateConfig (id) {
      let dataEdit = await CompanyProfileService.getListModuleProvince({module_id: id})

      if (!id || !dataEdit.data.success) {
        this.tabIndex = 0
        this.isEdit = false

        return
      }

      dataEdit = dataEdit.data.data[0]

      this.tabIndex = 1
      this.isEdit = true
      this.dataSend.module = this.listModuleLV.find(e => e.id === dataEdit.module_id)
      this.dataSend.list_province = dataEdit.list_province
    },

    async deleteConfig (id) {
      if (!confirm('Bạn có chắc chắn muốn xóa không')) return
      await CompanyProfileService.deleteModuleProvince({module_id: id})
      await this.getConfigByConditions()
    },

    resetDataGroupConfig () {
      this.dataFetch = []
      this.dataGroupConfig = []
      this.totalItems = 0
    },

    saveToDataGroupConfig (result) {
      this.dataFetch = []

      this.totalItems = result.data.data.length
      this.dataFetch = result.data.data
      this.paginate()
    },

    resetFilter () {
      this.filter = {
        module_id: null,
        province_id: null,
        module: null,
        province: null
      }
    }
  }
}
</script>

<style scoped>

</style>
