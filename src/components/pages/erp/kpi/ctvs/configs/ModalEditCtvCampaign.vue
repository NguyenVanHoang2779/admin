<template>
    <b-modal hide-footer ref="modalEditCampaign" id="modal-edit-ctv-campaign">
      <div slot="modal-title">Chỉnh sửa cụm config</div>
      <div class="row">
        <div class="col-md">
          <!--mặc định hay campaign-->
          <div class="mb-2 select-campaign-type">
            <label class="form-label">Chọn loại <span class="text-danger">(*)</span></label>
            <multiselect
              v-model="options.campaign_types.selected"
              label="name"
              track-by="id"
              placeholder=""
              :disabled="true"
              :options="options.campaign_types.options"
              :multiple="true"
              :searchable="true"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              selectLabel=""
              :allow-empty="false"
              :internal-search="true"
              :clear-on-select="false"
              :close-on-select="true"
              :hide-selected="false">
              <span slot="noResult">Không có kết quả phù hợp</span>
              <span slot="noOptions">Không có dữ liệu</span>
            </multiselect>
          </div>
          <!--Ngày bắt đầu-->
          <div class="mb-2">
            <label class="form-label">Từ ngày <span class="text-danger">(*)</span></label>
            <datepicker
              v-model="options.date_from"
              :disabled-dates="options.from_config.disabledDates"
              :disabled="options.from_config.disabled"
              format="dd-MM-yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              :placeholder="options.campaign_types.selected.id === 'default' ? 'Vô hạn' : 'Không được rỗng'"
            />
          </div>
          <!--Ngày kết thúc-->
          <div class="mb-2">
            <label class="form-label">Đến ngày <span class="text-danger">(*)</span></label>
            <datepicker
              v-model="options.date_to"
              :disabled-dates="options.to_config.disabledDates"
              :disabled="options.to_config.disabled"
              format="dd-MM-yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              :placeholder="options.campaign_types.selected.id === 'default' ? 'Vô hạn' : 'Không được rỗng'"
            />
          </div>
        </div>
        <div class="col-md">
          <div class="mb-3">
            <label class="form-label w-100">Tiêu đề <span class="text-danger">(*)</span>
              <span class="float-right text-muted">{{options.campaign_title.length}}/100</span>
            </label>
            <b-form-input id="inputLive"
                          v-model.trim="options.campaign_title"
                          type="text"
                          :disabled="false"
                          :state="true"
                          :maxlength="100"
                          aria-describedby="inputLiveFeedback"
                          placeholder=""></b-form-input>
          </div>
          <div class="mb-2">
            <label class="form-label">Mô tả ngắn gọn</label>
            <b-form-textarea
              id="textarea"
              v-model="options.campaign_desc"
              placeholder="Giải thích cho thay đổi"
              rows="4"
              max-rows="4"
            ></b-form-textarea>
          </div>
        </div>
      </div>
      <div class=" row float-right mt-5">
        <b-btn @click="$bvModal.hide('modal-edit-ctv-campaign')" variant="secondary">Hủy</b-btn>&nbsp;
        <ladda-btn :loading="buttonSave.loading" @click.native="saveData" data-style="zoom-out" class="btn btn-success">
          Lưu dữ liệu
        </ladda-btn>
      </div>
    </b-modal>
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

const optionCampaignTypes = [
  {name: 'Config Mặc định', id: 'default'},
  {name: 'Config cho Campaign', id: 'campaign'}
]

export default {
  name: 'modal-edit-ctv-campaign',
  props: {
    campaign: {}
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
    moment
  },
  watch: {
    'campaign': function (newVal) {
      this.options.campaign_types.selected = optionCampaignTypes.find(x => x.id === newVal.type)
      this.options.date_from = newVal.from
      this.options.date_to = newVal.to
      this.options.campaign_title = newVal.title
      this.options.campaign_desc = newVal.desc
    },
    'options.campaign_types.selected': function (newVal) {
      if (!newVal) return
      if (newVal.id === 'default') {
        this.options.date_to = null
        this.options.to_config.disabled = true
      } else {
        this.options.to_config.disabled = false
      }
    }
  },
  data: () => (
    {
      options: {
        from_config: {disabled: false, disabledDates: {from: null, to: null}},
        to_config: {disabled: false, disabledDates: {from: null, to: null}},
        date_from: moment().format('YYYY-MM-DD'),
        date_to: '',
        campaign_types: {
          selected: optionCampaignTypes[1],
          options: optionCampaignTypes
        },
        campaign_title: '',
        campaign_desc: ''
      },
      buttonSave: {
        loading: false
      }
    }
  ),
  computed: {
  },
  methods: {
    // lưu dữ liệu
    saveData () {
      this.buttonSave.loading = true
      let dataSend = {
        id: this.campaign.id,
        type: this.options.campaign_types.selected.id,
        from: this.options.date_from,
        to: this.options.date_to,
        title: this.options.campaign_title,
        desc: this.options.campaign_desc
      }
      kpiCodService.apiSaveCtvCampaign(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
            this.hideModal()
          } else {
            commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lưu dữ liệu', 'error')
      }).then(() => {
        this.buttonSave.loading = false
        this.$parent.getCampaigns()
      })
    },
    hideModal () {
      this.$refs.modalEditCampaign.hide()
    }
  },
  created () {
  }
}
</script>

<style scoped lang="scss">
</style>
