<template>
    <b-modal ref="modalconfigObject" hide-footer id="modal-add-ctv-object">
        <div slot="modal-title">
            <p>Thêm config loại thù lao</p>
        </div>
      <div>
        <div class="row mb-2">
          <div class="col-md-6 mb-2">
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
        <div class="row mb-2">
          <table-config-type1 v-if="object_type.selected.id === 1" @model="object[1] = $event"></table-config-type1>
          <table-config-type2 v-if="object_type.selected.id === 2" @model="object[2] = $event"></table-config-type2>
          <table-config-type3 v-if="object_type.selected.id === 3" @model="object[3] = $event"></table-config-type3>
          <table-config-type4 v-if="object_type.selected.id === 4" @model="object[4] = $event"></table-config-type4>
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
import TableConfigType1 from './TableConfigType1'
import TableConfigType2 from './TableConfigType2'
import TableConfigType3 from './TableConfigType3'
import TableConfigType4 from './TableConfigType4'

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
    TableConfigType1,
    TableConfigType2,
    TableConfigType3,
    TableConfigType4,
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
      object: {
        1: {}, 2: {}, 3: {}, 4: {}
      }
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
        detail: this.object[this.object_type.selected.id]
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
        commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh', 'error')
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
