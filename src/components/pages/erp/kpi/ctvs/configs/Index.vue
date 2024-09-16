<template>
  <div>

    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-2">
      <div>Gán thù lao cho cộng tác viên</div>
      <div class="float-right">
        <button type="button" class="btn btn-primary mr-3" ><a data-v-0320ebbf="" href="https://gdrives.ghtk.co/s/rWTg7F38fT7q5ow" target="_blank" style="color: #FFFFFF;"><i class="ion ion-md-attach mr-1"> </i>Hướng dẫn</a></button>
        <b-btn variant="primary" @click="$bvModal.show('modal-add-ctv-object')"><i class="ion ion-ios-add"></i>&nbsp;Tạo gói thù lao</b-btn> &nbsp;
      </div>
    </h4>

    <div class=" row bg-lighter container-p-x py-1 container-m--x mb-4">
      <ul class="nav col-md">
        <li class="nav-item">
          <a @click="tab = 'all'" :class="tab === 'all' ? 'nav-link text-dark font-weight-bold pl-0' : 'nav-link text-muted pl-0'" href="javascript:void(0)">Tất cả</a>
        </li>
        <li class="nav-item">
          <a @click="tab = 'default'" :class="tab === 'default' ? 'nav-link text-dark font-weight-bold' : 'nav-link text-muted'" href="javascript:void(0)">Mặc định</a>
        </li>
        <li class="nav-item">
          <a @click="tab = 'campaign'" :class="tab === 'campaign' ? 'nav-link text-dark font-weight-bold' : 'nav-link text-muted'" href="javascript:void(0)">Campaign</a>
        </li>
      </ul>
<!--      <div class="col-md-3 px-0 justify-content-end">-->
<!--        <b-input placeholder="Tìm kiếm..." />-->
<!--      </div>-->
    </div>
    <div class="row justify-content-end mb-2 mr-2">
      <b-form-checkbox class="mr-2" v-model="checkBox.viewDisable">vô hiệu</b-form-checkbox>
<!--      <b-form-checkbox v-model="checkBox.viewExpired">quá hạn</b-form-checkbox>-->
    </div>
    <b-card no-body class="mb-4">
      <b-card-header>
       <div class="row">
         <div class="col-md-1">
          <div class="row">
            <!--Checkbox all-->
            <b-form-checkbox class="mb-1" @input="clickCheckAllCampaign" v-model="checkBox.checkAll"></b-form-checkbox>
            <div class="ml-sm-3">
              <!--Add button-->
              <button id="addPopover" type="button" @click="$bvModal.show('modal-add-ctv-campaign')" class="btn btn-default btn-circle borderless"><i class="ion ion-md-add"></i></button>
              <b-popover target="addPopover" class="popover-primary d-inline-block" placement="top" triggers="hover" content="Thêm cụm configs" />
            </div>
          </div>
         </div>
         <div class="col-md right">
         </div>
       </div>
      </b-card-header>
      <b-list-group :flush="true" v-loading="loading.getCampaign">

        <li v-for="(data, index) in campaignData" v-if="data.status === '1' || checkBox.viewDisable" class="campaign-item list-group-item" :class="{'campaign-selected': selectedCampaign === index, 'campaign-box-checked': data.checkbox}">
<!--          {{data}}-->
          <div class="row campaign-info pb-2" @click="clickDivCampaign(index)"
               @mouseover="mouseDivCampaign(index, true)"
               @mouseleave="mouseDivCampaign(index, false)" >
            <div class="col-md-4 align-self-center">
              <div class="row align-self-center">
                <div @click.stop="">
                  <b-form-checkbox v-model="data.checkbox" @input="$forceUpdate()"></b-form-checkbox>
                </div>
                <div class="media-body col-md ml-sm-3">
                  <h6 class="mb-1">
                    <a href="javascript:void(0)" class="text-dark">#{{data.id}} {{ data.title }}</a>
                    <span class="text-muted">[{{data.from && 1 ? data.from : 'vô hạn'}} {{data.to && 1 ? data.to : 'vô hạn'}}]</span>
                  </h6>
                </div>
              </div>
            </div>
            <div class="pr-2 align-self-center" style="min-width: 80px">
              <div class="row align-self-center">
                  <b-badge href="javascript:void(0)" :variant="data.status === '1' ? 'success' : 'danger'">{{data.status === '1' ? 'Đang kích hoạt' : 'Vô hiệu hóa'}}</b-badge>
                  <b-badge href="javascript:void(0)" variant="default" v-if="data.time_status === 'normal'">Đang chạy</b-badge>
                  <b-badge href="javascript:void(0)" variant="default" v-if="data.time_status === 'expired'">Quá hạn</b-badge>
                  <b-badge href="javascript:void(0)" variant="default" v-if="data.time_status === 'not_start'">Chưa bắt đầu</b-badge>
              </div>
            </div>
            <div class="col-md-5 align-self-center">
              <div class="row align-self-center">
                <div class="text-muted ml-2" style="word-break: break-word">{{ data.desc }}</div>
              </div>
            </div>
            <div class="col-md align-self-center" style="min-height: 30px">
              <div v-if="!data.mouseover" class="row right mt-1">
                {{data.modified_by}} {{data.modified}}
              </div>
              <div v-else class="row right">
                <!--Add campaign button-->
                <div @click.stop="">
                  <button :id="'addConfig-' + index" type="button" @click="addConfigCampaign(index)" class="btn btn-default btn-circle borderless"><i class="ion ion-md-add"></i></button>
                  <b-popover :target="'addConfig-' + index" class="popover-primary d-inline-block" placement="top" triggers="hover" content="Thêm config cho campaign" />
                </div>
                <!--Edit campaign button-->
                <div @click.stop="">
                  <button :id="'editCampaign-' + index" type="button" @click="editCampaign(index)" class="btn btn-default btn-circle borderless"><i class="ion ion-md-create"></i></button>
                  <b-popover :target="'editCampaign-' + index" class="popover-primary d-inline-block" placement="top" triggers="hover" content="Chỉnh sửa Campaign" />
                </div>
                <!--Deactive campaign button-->
                <div v-if="data.status === '1'" @click.stop="">
                  <button :id="'deleteCampaign-' + index" type="button" @click="changeStatusCampaign(data.id, 0)" class="btn btn-default btn-circle borderless"><i class="ion ion-md-trash"></i></button>
                  <b-popover :target="'deleteCampaign-' + index" class="popover-primary d-inline-block" placement="top" triggers="hover" content="Vô hiệu hóa Campaign" />
                </div>
                <div v-else @click.stop="">
                  <button :id="'activeCampaign-' + index" type="button" @click="changeStatusCampaign(data.id, 1)" class="btn btn-default btn-circle borderless"><i class="ion ion-md-undo"></i></button>
                  <b-popover :target="'activeCampaign-' + index" class="popover-primary d-inline-block" placement="top" triggers="hover" content="Kích hoạt lại Campaign" />
                </div>
              </div>
            </div>
          </div>
          <div :class="{'campaign-selected': true, 'campaign-box-checked': data.checkbox}">
            <div v-if="selectedCampaign === index">
              <campaign-detail v-bind:campaign_id="data.id"></campaign-detail>
            </div>
          </div>
        </li>

      </b-list-group>
    </b-card>
    <modal-add-ctv-campaign></modal-add-ctv-campaign>
    <modal-edit-ctv-campaign :campaign="editingCampaign"></modal-edit-ctv-campaign>
    <modal-add-config-campaign ref="modalConfigCampaign" :campaign="editingCampaign"></modal-add-config-campaign>
    <modal-add-ctv-object></modal-add-ctv-object>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import kpiCodService from 'domain/services/kpi-cod-service'
import Multiselect from 'vue-multiselect'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import flatPickr from 'vue-flatpickr-component'
import vueNumeric from 'vue-numeric'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import ModalAddCtvCampaign from './ModalAddCtvCampaign'
import ModalAddCtvObject from './ModalAddCtvObject'
import ModalEditCtvCampaign from './ModalEditCtvCampaign'
import ModalAddConfigCampaign from './ModalAddConfigCampaign'
import CampaignDetail from './CampaignDetail'

export default {
  name: 'ctv-campaign',
  metaInfo: {
    title: 'CTV Campaign'
  },
  components: {
    kpiCodService,
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
    ModalAddCtvCampaign,
    ModalEditCtvCampaign,
    ModalAddCtvObject,
    ModalAddConfigCampaign,
    CampaignDetail
  },
  data: () => ({
    tab: 'all',
    campaignData: [],
    search: {
      totalItems: 100,
      currentPage: 1,
      perPage: 20,
      text: ''
    },
    checkBox: {
      viewDisable: false,
      viewExpired: false,
      listChecked: [],
      checkAll: false
    },
    selectedCampaign: null,
    editingCampaign: null,
    loading: {
      getCampaign: false
    }
  }),
  watch: {
    'selectedCampaign': function (newVal) {
    },
    'tab': function (newVal) {
      this.getCampaigns()
    }
  },
  methods: {
    mouseDivCampaign (index, value) {
      this.campaignData[index].mouseover = value
      this.$forceUpdate()
    },
    clickDivCampaign (index) {
      this.selectedCampaign = (this.selectedCampaign === index) ? null : index
      this.campaignData[index].mouseover = !this.campaignData[index].mouseover
    },
    clickCheckAllCampaign () {
      for (const index in this.campaignData) {
        this.campaignData[index].checkbox = this.checkBox.checkAll
      }
    },
    changeStatusCampaign (id, status) {
      if (!confirm('Bạn có chắc chắn muốn thay đổi trạng thái campaign này không?')) return
      this.loading.getCampaign = true
      kpiCodService.apiChangeStatusCampaign({id: id, status: status}).then(response => {
        commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi thay đổi trạng thái campaign', 'error')
      }).then(() => {
        this.getCampaigns()
      })
    },
    editCampaign (index) {
      this.editingCampaign = this.campaignData[index]
      this.$bvModal.show('modal-edit-ctv-campaign')
    },
    addConfigCampaign (index) {
      this.editingCampaign = this.campaignData[index]
      this.$bvModal.show('modal-add-config-campaign')
      this.$refs.modalConfigCampaign.resetValue()
    },
    getCampaigns () {
      this.loading.getCampaign = true
      kpiCodService.apiGetCampaignData({type: this.tab}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.campaignData = response.data.data
            for (const index in this.campaignData) {
              this.campaignData[index].checkbox = this.campaignData[index].mouseover = false
            }
          } else {
            this.campaignData = []
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lấy data campaign', 'error')
      }).then(() => {
        this.loading.getCampaign = false
        this.selectedCampaign = null
      })
    }
  },
  created () {
    this.getCampaigns()
  }
}
</script>
