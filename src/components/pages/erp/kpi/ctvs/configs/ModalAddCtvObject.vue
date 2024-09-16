<template>
    <b-modal ref="modalconfigObject" hide-footer id="modal-add-ctv-object">
        <div slot="modal-title">
            <p>Thêm config loại thù lao</p>
        </div>
      <div>
        <div class="row mb-1">
          <div class="col-md-6">
            <label class="form-label">Chọn loại thù lao</label>
            <multiselect
              class=""
              v-model="object_type.selected"
              label="name"
              track-by="id"
              placeholder=""
              :options="object_type.options"
              :multiple="false"
              :searchable="true"
              :loading="object_type.loading"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              selectLabel=""
              :allow-empty="false"
              :internal-search="true"
              :clear-on-select="true"
              :close-on-select="true"
              :hide-selected="false">
              <span slot="noResult">Không có kết quả phù hợp</span>
              <span slot="noOptions">Không có dữ liệu</span>
            </multiselect>
          </div>
        </div>
        <div class="row mb-4 ml-2 text-muted font-italic">(*) Lưu ý các đại lượng khi so sánh đều là &ge;</div>
        <div class="row mb-2">
            <table-config-type :typeId="object_type.selected.id" @model="object = $event"></table-config-type>
        </div>
      </div>
        <div class=" row float-right mt-5">
          <b-btn @click="$bvModal.hide('modal-add-ctv-object')" variant="secondary">Hủy</b-btn>&nbsp;
          <ladda-btn :loading="buttonSave.loading" @click.native="saveData" data-style="zoom-out" class="btn btn-success">
            Lưu dữ liệu
          </ladda-btn>
        </div>
    </b-modal>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<script>
import kpiCodService from 'domain/services/kpi-cod-service'
import Multiselect from 'vue-multiselect'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import flatPickr from 'vue-flatpickr-component'
import vueNumeric from 'vue-numeric'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import TableConfigType from './TableConfigType'

export default {
  name: 'modal-add-ctv-object',
  props: [
  ],

  components: {
    kpiCodService,
    Multiselect,
    SweetModal,
    SweetModalTab,
    commonHelper,
    flatPickr,
    vueNumeric,
    TableConfigType,
    LaddaBtn
  },
  watch: {
  },
  data: () => (
    {
      object_type: {
        loading: false,
        options: [],
        selected: []
      },
      buttonSave: {
        loading: false
      },
      object: {}
    }
  ),
  computed: {
  },
  methods: {
    getObjectTypes () {
      this.object_type.loading = true
      kpiCodService.apiGetObjectTypes().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.object_type.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lấy type object', 'error')
      }).then(() => {
        this.object_type.loading = false
      })
    },
    saveData () {
      if (typeof this.object_type.selected.id === 'undefined') {
        commonHelper.showMessage('Thông tin rỗng', 'warning')
        return
      }
      this.buttonSave.loading = true
      let dataSend = {
        type_id: this.object_type.selected.id,
        detail: this.object
      }
      kpiCodService.apiSaveCtvObject(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.hideModal()
            commonHelper.showMessage(response.data.message, 'success')
          } else {
            commonHelper.showMessage(response.data.message, 'error')
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lưu dữ liệu', 'error')
      }).then(() => {
        this.buttonSave.loading = false
      })
    },
    hideModal () {
      this.$refs.modalconfigObject.hide()
    }
  },
  created () {
    this.getObjectTypes()
  }
}
</script>

<style scoped lang="scss">
</style>
