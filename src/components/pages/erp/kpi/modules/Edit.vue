<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
      <div>Chỉnh sửa nhân viên module</div>
<!--      <b-btn variant="primary btn-round" class="d-block"><span class="ion ion-md-add"></span>&nbsp; Create article</b-btn>-->
    </h4>
    <b-card>
      <div class="row">
        <div class="col-md-4">
          <b-form inline class="mb-2">
            <label class="label-edit">Tên module:</label>
            <b-input disabled v-model="dataModuleUsers.alias"/>
          </b-form>
          <b-form inline class="mb-2">
            <label class="label-edit">Loại:</label>
            <b-input disabled v-model="dataModuleUsers.type_name" />
          </b-form>
          <b-form inline class="mb-2">
            <label class="label-edit">Kho:</label>
            <b-input disabled v-model="dataModuleUsers.station_name" />
          </b-form>
        </div>
        <div class="col-md mb-lg-3">
          <b-card bg-variant="info" text-variant="white" title="Lưu ý">
            <p class="mb-1">- Chỉ bấm xóa bản ghi khi bản ghi bị tạo sai</p>
            <p class="mb-1">- Muốn khôi phục lại cần tích hiện bản ghi đã xóa và bấm khôi phục lại</p>
            <p class="mb-1">- Khi nhân viên thôi chức vụ tại module bắt buộc phải update ngày nghỉ</p>
            <p class="mb-1">- Bấm Lưu thay đổi ở cuối trang khi thao tác chỉnh sửa xong</p>
          </b-card>
        </div>
      </div>
      <div class="mb-2">
        <b-form-checkbox @input="$forceUpdate()" class="float-right right" id="checkbox-1" v-model="has_disabled" name="checkbox-1">
          Hiện bản ghi bị xóa
        </b-form-checkbox>
      </div>
      <br>
      <div class="mb-2" v-for="roleUsers in dataModuleUsers.detail">
        <role-user-config :data="roleUsers" :station_id="dataModuleUsers.station_id" :has_disabled="has_disabled"></role-user-config>
      </div>
      <ladda-btn class="float-right btn btn-success" @click.native="saveData"
                 :loading="loading.save" data-style="expand-right">
        Lưu thay đổi
      </ladda-btn>
    </b-card>
    <div style="min-height: 100px"></div>
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
import SingleSelectUserModule from './SingleSelectUserModule'
import RoleUserConfig from './RoleUserConfig'
export default {
  name: 'kpi-module-manager',
  metaInfo: {
    title: 'KPI Module'
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
    SingleSelectStation,
    SingleSelectUserModule,
    RoleUserConfig
  },
  watch: {
    dataModuleUsers: {
      immediate: true,
      deep: true,
      handler: function (newValue, oldValue) {
      }
    }

  },
  data: () => ({
    moduleId: null,
    has_disabled: 0,
    dataModuleUsers: [],
    errorMess: [],
    loading: {
      save: false,
      search: false
    }
  }),

  computed: {
  },

  methods: {
    getDetailModuleUser (moduleId) {
      if (!moduleId) return
      this.loading.search = true
      kpiModuleService.apiGetDetailModuleUsers({module_id: moduleId}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataModuleUsers = response.data.data
          } else {
            this.dataModuleUsers = []
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lấy data module users', 'error')
      }).then(() => {
        this.loading.search = false
      })
    },
    saveData () {
      this.loading.save = true
      kpiModuleService.apiSaveDataModuleUsers(this.dataModuleUsers).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, 'success')
            this.getDetailModuleUser(this.moduleId)
          } else {
            this.dataModuleUsers = response.data.data
            commonHelper.showMessage(response.data.message, 'error')
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lưu data module users', 'error')
      }).then(() => {
        this.loading.save = false
      })
    }
  },

  created () {
    this.moduleId = this.$route.params.id
    this.getDetailModuleUser(this.moduleId)
  }
}
</script>
