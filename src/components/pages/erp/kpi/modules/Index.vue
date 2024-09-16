<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
      <div>Quản lý module</div>
<!--      <b-btn variant="primary btn-round" class="d-block"><span class="ion ion-md-add"></span>&nbsp; Create article</b-btn>-->
    </h4>
    <b-card class="mb-4">
      <div class="row">
        <div class="col-md-4">
          <single-select-station @handleSelectedStation="selectedStation = $event"></single-select-station>
        </div>
        <div class="col-md-2">
          <ladda-btn @click.native="getDataModules"
                     :loading="loading.search" data-style="expand-right" class="btn btn-success" style="width: 100%">
            Tìm kiếm
          </ladda-btn>
        </div>
      </div>
    </b-card>
    <b-card no-body>
      <div class="demo-vertical-spacing">
        <table class="table mb-0 table-bordered table-striped text-center">
          <thead>
          <tr>
            <th style="width: 15%">Tên module</th>
            <th style="width: 15%">Loại</th>
            <th>Nhân viên</th>
            <th style="width: 5%">&nbsp;</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(module) in dataModules">
            <th scope="row">{{ module.alias }}</th>
            <td>{{ module.type_name }}</td>
            <td class="row text-left m-0">
              <div class="col-md-3 mb-2" v-for="roles in module.detail">
                <p class="font-weight-bold mb-1">{{ roles.role_name }}</p>
                <div v-for="(user, key) in roles.users">
                  <p v-if="key <= 10" class="mb-1"><span class="font-italic">{{ user.fullname }}</span> ({{ user.username }})</p>
                  <p v-if="key === 11" class="mb-1">...</p>
                </div>
                <!--                <perfect-scrollbar :options="{ wheelPropagation: true }" class="mb-4" style="height: 100px">-->
                <!--                <p>{{roles.role_name}}</p>-->
                <!--                <p v-for="user in roles.users">{{user.fullname}}</p>-->
                <!--                </perfect-scrollbar>-->
              </div>
            </td>
            <td>
              <router-link target="_blank" :to="{name: 'edit-module-user', params: { id: module.id }}" class="btn btn-outline-secondary btn-sm" title="Chỉnh sửa Profile"><i class="ion ion-md-create"></i></router-link>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </b-card>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/kpi-module-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import kpiModuleService from 'domain/services/kpi-module-service'
import Multiselect from 'vue-multiselect'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import flatPickr from 'vue-flatpickr-component'
import vueNumeric from 'vue-numeric'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
export default {
  name: 'kpi-edit-module',
  metaInfo: {
    title: 'KPI Module User'
  },
  components: {
    kpiModuleService,
    Multiselect,
    SweetModal,
    SweetModalTab,
    commonHelper,
    flatPickr,
    vueNumeric,
    LaddaBtn,
    PerfectScrollbar,
    Datepicker,
    moment,
    SingleSelectStation
  },
  data: () => ({
    selectedStation: null,
    dataModules: [],
    loading: {
      search: false
    }
  }),

  computed: {
  },

  methods: {
    getDataModules () {
      if (!this.selectedStation.id) return
      this.loading.search = true
      kpiModuleService.apiGetDataModules({station_id: this.selectedStation.id}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataModules = response.data.data
          } else {
            this.dataModules = []
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lấy data module', 'error')
      }).then(() => {
        this.loading.search = false
      })
    }
  },

  created () {
  }
}
</script>
