<template>
    <b-modal hide-footer id="modal-detail-config-formula">
        <div slot="modal-title">
            <p v-if="type === 'edit'">Sửa config công thức lương</p>
            <p v-if="type === 'create' || type === 'clone'">Tạo mới công thức lương</p>
            <p v-if="type === 'addListFormula'">Thêm huyện vào các công thức lương đã có</p>
        </div>
        <div class="row mb-4">
            <div v-if="type !== 'addListFormula'" class="col-md-4">
                <label class="form-label">Công thức <span class="text-danger">(*)</span></label>
                <b-form-input
                        id="input-live"
                        v-model="formula"
                        type="number"
                        :disabled="type === 'edit'"
                        :state="checkDuplicateFormula"
                        aria-describedby="input-live-help input-live-feedback"
                        trim
                ></b-form-input>
                <b-form-invalid-feedback v-if="type === 'create' || type === 'clone'" id="input-live-feedback" style="margin-top: 11px;">
                    {{messageError1}}
                </b-form-invalid-feedback>
            </div>
            <div v-if="type !== 'addListFormula'" class="col-md-8">
                <label class="form-label">Tên <span class="text-danger">(*)</span></label>
                <b-form-input
                        id="input-live"
                        v-model="formula_name"
                        :state="checkValidateName"
                        aria-describedby="input-live-help input-name-feedback"
                        trim
                ></b-form-input>
                <b-form-invalid-feedback id="input-name-feedback">
                  {{messageError2}}
                </b-form-invalid-feedback>
            </div>
          <div v-if="type === 'addListFormula'" class="col-md-10">
            <label class="form-label">Chọn công thức lương</label>
            <multiselect
              class=""
              v-model="dataFormula.selected"
              label="formula"
              track-by="id"
              placeholder="Chọn công thức lương khả dụng"
              :options="dataFormula.options"
              :multiple="true"
              :searchable="true"
              :loading="dataFormula.loading"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              selectLabel=""
              :internal-search="true"
              :clear-on-select="true"
              :close-on-select="true"
              :hide-selected="false"
            >
              <span slot="noResult">Không có kết quả phù hợp</span>
              <span slot="noOptions">Không có dữ liệu</span>
            </multiselect>
          </div>
          <div v-if="type === 'addListFormula'" class="col-md-2 mt-4">
            <b-form-checkbox
              id="checkbox"
              name="checkbox"
              v-model="valueSelectedALl"
              @change="selectedAll"
            >
              {{ valueSelectedALl ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}}
            </b-form-checkbox>
          </div>
        </div>
      <div class="row mb-4">
        <div class="col-md-12">
          <label class="form-label">Nhập danh sách id Huyện</label>
          <b-form-input
            id="input-live"
            v-model="listIdDistrict"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Danh sách theo định dạnh 1,2,3,..."
            :state="checkUniqueListId"
            @input="mapData"
            trim>
          </b-form-input>
          <b-form-invalid-feedback id="input-live-feedback">
            Nhập trùng id = {{ duplicateId }}
          </b-form-invalid-feedback>
        </div>
      </div>
        <div class="row mb-4">
            <div class="col-md-12">
                <div class="row mb-1">
                    <div class="col-md-1">
                        <p class="form-label">Huyện - {{district.selected.length}} <span class="text-danger">(*)</span></p>
                    </div>
                </div>
                <multiselect
                        class="custom-multiselect station-custom-multiselect"
                        v-model="district.selected"
                        label="name"
                        track-by="id"
                        placeholder=""
                        :options="district.options"
                        :multiple="true"
                        :searchable="true"
                        :loading="district.loading"
                        selectedLabel="Đã chọn"
                        deselectLabel="Bỏ chọn"
                        selectLabel=""
                        :internal-search="true"
                        :clear-on-select="true"
                        :close-on-select="false"
                        :hide-selected="false"
                        @remove="requestRemoveMap"
                        @select="requestSelectMap">
                    <span slot="noResult">Không có kết quả phù hợp</span>
                    <span slot="noOptions">Không có dữ liệu</span>
                </multiselect>
            </div>
        </div>
        <div v-if="type !== 'addListFormula'" class="row mb-4">
            <div class="col-md-6">
                <label class="form-label">Hình thức làm việc <span class="text-danger">(*)</span></label>
                <multiselect
                        class="custom"
                        v-model="workType.selected"
                        label="name"
                        track-by="id"
                        placeholder=""
                        :options="workType.options"
                        :multiple="true"
                        :searchable="true"
                        :loading="workType.loading"
                        selectedLabel="Đã chọn"
                        deselectLabel="Bỏ chọn"
                        selectLabel=""
                        :internal-search="true"
                        :clear-on-select="true"
                        :close-on-select="false"
                        :hide-selected="true"
                >
                    <span slot="noResult">Không có kết quả phù hợp</span>
                    <span slot="noOptions">Không có dữ liệu</span>
                </multiselect>
            </div>
            <div class="col-md-6">
                <label class="form-label">Loại hình công việc <span class="text-danger">(*)</span></label>
                <multiselect
                        class=""
                        v-model="position.selected"
                        label="name"
                        track-by="id"
                        placeholder=""
                        :options="position.options"
                        :multiple="true"
                        :searchable="true"
                        :loading="position.loading"
                        selectedLabel="Đã chọn"
                        deselectLabel="Bỏ chọn"
                        selectLabel=""
                        :internal-search="true"
                        :clear-on-select="true"
                        :close-on-select="false"
                        :hide-selected="true"
                >
                    <span slot="noResult">Không có kết quả phù hợp</span>
                    <span slot="noOptions">Không có dữ liệu</span>
                </multiselect>
            </div>
        </div>
        <div class="float-right mt-5">
            <b-btn @click="$bvModal.hide('modal-detail-config-formula')" variant="secondary">Hủy</b-btn>
            <b-btn v-if="type !== 'addListFormula'" @click="saveDataFormula" variant="primary">Xác nhận</b-btn>
            <b-btn v-if="type === 'addListFormula'" @click="configFormula" variant="primary">Xác nhận</b-btn>
        </div>
      <div>
      </div>
    </b-modal>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>
import kpiCodService from 'domain/services/kpi-cod-service'
import Multiselect from 'vue-multiselect'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-change-type-ticket',
  props: [
    'type',
    'listFormulaIds',
    'currentFormula',
    'listFormulas'
  ],

  components: {
    kpiCodService,
    Multiselect,
    SweetModal,
    SweetModalTab,
    commonHelper
  },
  watch: {
    type () {
      if (this.type === 'create') {
        this.resetWindow()
      }
      if (this.type === 'create' || this.type === 'clone') {
        this.formula = Math.max.apply(null, this.listFormulaIds) + 1
        this.formula_name = ''
      }
      if (this.type === 'edit') {
        this.formula = this.currentFormula.formula
        this.formula_name = this.currentFormula.name
      }
      if (this.type === 'addListFormula') {
        this.resetData()
        this.dataFormula.options = this.listFormulas.filter(option => option.status === '1')
      }
    },
    currentFormula: function (newVal, oldVal) {
      if (typeof newVal !== 'undefined' && (this.type === 'edit' || this.type === 'clone')) {
        this.getDataFormula()
      }
    }
  },
  data: () => (
    {
      formula: null,
      formula_name: '',
      listIdDistrict: '',
      duplicateId: null,
      dataFormula: {
        loading: false,
        options: [],
        selected: []
      },
      district: {
        loading: false,
        options: [],
        selected: [],
        selectedBackup: []
      },
      workType: {
        loading: false,
        options: [],
        selected: []
      },
      position: {
        loading: false,
        options: [],
        selected: []
      },
      appLoading: true,
      dataFormulaHintName: {
        name: '',
        loading: false
      },
      dataListDistricts: {},
      messageError1: null,
      messageError2: null,
      valueSelectedALl: false
    }
  ),
  computed: {
    checkUniqueListId () {
      let data = this.listIdDistrict.split(',')
      let arrUnique = []
      for (let id of data) {
        if (!arrUnique.includes(id)) {
          if (id !== '') arrUnique.push(id)
        } else {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.duplicateId = id
          return false
        }
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.duplicateId = null
      return true
    },
    checkDuplicateFormula () {
      let formula = this.formula
      if (this.listFormulaIds.includes(formula) && this.type !== 'edit') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.messageError1 = 'Công thức đã tồn tại'
        return false
      }
      if (formula <= 0 && this.type !== 'edit') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.messageError1 = 'Công thức phải lớn hơn không'
        return false
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.messageError1 = null
      return true
    },
    checkValidateName () {
      if (this.formula_name.length < 5) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.messageError2 = 'Nhập ít nhất 5 ký tự (thêm tháng lương bắt đầu vào cuối tên)'
        return false
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.messageError2 = null
      return true
    }
  },
  methods: {
    resetWindow: function () {
      this.formula_name = ''
      this.district.selected = this.workType.selected = this.position.selected = []
      this.district.loading = this.workType.loading = this.position.loading = false
      this.listIdDistrict = ''
    },
    getListDistricts () {
      this.district.loading = true
      kpiCodService.apiGetListDistricts().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataListDistricts = response.data.data
            this.district.options = Object.values(response.data.data)
            this.district.selected = []
          } else {
            return 0
          }
        }
      }).catch(() => {
        this.$root.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Hix.'
        })
      }).then(() => {
        this.district.loading = false
      })
    },
    getListWorkTypes () {
      this.workType.loading = true
      kpiCodService.apiGetListWorkTypes().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.workType.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        this.$root.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.workType.loading = false
      })
    },
    getListPositions () {
      this.position.loading = true
      kpiCodService.apiGetListPositions().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.position.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        this.$root.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.position.loading = false
      })
    },
    getDataFormula () {
      this.district.loading = this.workType.loading = this.position.loading = true
      if (this.type === 'edit') {
        this.formula = this.currentFormula.formula
        this.formula_name = this.currentFormula.name
      }
      kpiCodService.apiGetDataFormulaByDistrict({
        formula: this.currentFormula.formula
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$root.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
          if (response.data.success) {
            let dataResponse = response.data.data
            this.district.selected = this.district.selectedBackup = dataResponse.districts
            this.workType.selected = dataResponse.work_types
            this.position.selected = dataResponse.positions
            this.listIdDistrict = dataResponse.listIdDistricts
          } else {
            return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu !', 'warning')
          }
        }
      }).catch(() => {
        this.$root.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.district.loading = this.workType.loading = this.position.loading = false
      })
    },
    saveDataFormula () {
      if (this.duplicateId !== null) {
        return commonHelper.showMessage('Trùng id = ' + this.duplicateId, 'warning')
      }
      if (this.messageError1 !== null) {
        return commonHelper.showMessage(this.messageError1, 'warning')
      }
      if (this.messageError2 !== null) {
        return commonHelper.showMessage(this.messageError2, 'warning')
      }
      let dataSend = {
        type: this.type,
        formula: this.formula,
        name: this.formula_name,
        districts: this.district.selected.map(dt => dt.id),
        work_types: this.workType.selected.map(wt => wt.id),
        positions: this.position.selected.map(pt => pt.id)
      }
      kpiCodService.apiSaveDataFormulaByDistrict(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$root.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
          if (response.data.success) {
            this.$parent.getAllFormula()
            this.$bvModal.hide('modal-detail-config-formula')
            this.resetData()
          } else {
          }
        }
      }).catch(() => {
        this.$root.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
      })
    },
    mapData () {
      let data = this.listIdDistrict.split(',')
      let dataDistrict = data.reduce(function (acc, currentValueID) {
        if (typeof (this.dataListDistricts[currentValueID]) !== 'undefined') {
          acc = [...acc, this.dataListDistricts[currentValueID]]
        }
        return acc
      }.bind(this), [])
      this.district.selected = dataDistrict
    },
    requestRemoveMap ({name, id}) {
      let currentListIdDt = this.listIdDistrict.split(',')
      if (currentListIdDt.includes(id)) {
        let location = currentListIdDt.indexOf(id)
        currentListIdDt = [...currentListIdDt.slice(0, location), ...currentListIdDt.slice(location + 1, currentListIdDt.length)]
      }
      this.listIdDistrict = currentListIdDt.join()
    },
    requestSelectMap ({name, id}) {
      if (this.listIdDistrict !== '') {
        let arrListId = this.listIdDistrict.split(',')
        if (!arrListId.includes(id)) {
          arrListId.push(id)
        }
        this.listIdDistrict = arrListId.join()
      } else {
        this.listIdDistrict = id
      }
    },
    resetData () {
      this.district.selected = []
      this.dataFormula.selected = []
      this.workType.selected = []
      this.position.selected = []
      this.listIdDistrict = ''
      this.formula_name = ''
      this.formula = null
    },
    configFormula () {
      if (this.district.selected === '' || this.dataFormula.selected === '') {
        return commonHelper.showMessage('Nhập đầy đủ thông tin', 'warning')
      }
      let dataSend = {
        type: this.type,
        formula: this.dataFormula.selected.map(option => option.formula),
        districts: this.district.selected.map(a => a.id)
      }
      kpiCodService.apiConfigFormulaDistrict(dataSend).then(async response => {
        if (response.data.hasOwnProperty('success')) {
          this.$root.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
          if (response.data.success) {
            this.$parent.getAllFormula()
            await this.resetData()
            this.$bvModal.hide('modal-detail-config-formula')
          }
        }
      }).catch(() => {
        this.$root.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
      })
    },
    selectedAll (checked) {
      this.valueSelectedALl = checked
      this.dataFormula.selected = checked ? this.dataFormula.options : []
    }
  },
  created () {
    this.getListDistricts()
    this.getListWorkTypes()
    this.getListPositions()
  }
}
</script>

<style scoped lang="scss">
  .spanCustom {
    margin-left: 22px;
    padding: 5px 5px 5px 5px;
    color: white;
    background-color: mediumseagreen;
    border: 1px solid #12ff9a;
    -webkit-transition: width 1s, height 1s;
    transition: width 1s, height 1s
  }
  .spanCustom:hover{
    cursor: pointer;
    background-color: #08e384;
    width: 35px;
    height: 22px;
  }
</style>
