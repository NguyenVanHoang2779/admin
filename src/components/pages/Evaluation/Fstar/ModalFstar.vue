<template>
  <div>
    <b-modal
      :id="'modal-' + fstarType + '-fstar-' + actionModal"
      size="lg"
      scrollable
      hide-footer
      :title="titleModalAction"
      header-class="justify-content-center"
      centered
      class="custom-modal"
      @show="showModal"
    >
      <div class="mb-4">
        <div class="form-group">
          <label><b>Loại hình <span class="text-danger">*</span></b></label>
          <b-form-radio-group
            v-model="formModal.category"
            :options="optionCategories"
          ></b-form-radio-group>
        </div>
        <div class="form-group">
          <label><b>Mức {{ convertFstarType }} <span class="text-danger">*</span></b></label>
          <b-form-radio-group
            class="category"
            v-model="formModal.recompense_level"
            :options="optionLevels"
          ></b-form-radio-group>
        </div>
        <div class="form-group" v-if="formModal.recompense_level === 'cash'">
          <label><b>Giá trị {{ convertFstarType }} <span class="text-danger">*</span></b></label>
          <div class="form-group d-flex">
            <b-input class="category-value mr-5" v-model="formModal.recompense_value"
             @input="() => { if(formModal.recompense_value && formModal.recompense_value < 1) { formModal.recompense_value = 1 }}"
             type="number" min="1" placeholder="Giá trị">
            </b-input>
            <multiselect
              class="category-value"
              label="name"
              track-by="value"
              placeholder="Chọn đơn vị"
              :options="valueOptionType"
              v-model="formModal.value_unit"
              :multiple="false"
              :searchable="true"
              :preserve-search="true"
              selectLabel="Chọn"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
            />
          </div>
        </div>
        <div class="form-group">
          <label><b>Nội dung <span class="text-danger">*</span></b></label>
          <div class="form-group">
            <multiselect
              label="name"
              track-by="alias"
              :placeholder="'Chọn loại ' + (fstarType  === 'reward' ? 'thưởng' : 'phạt')"
              :options="typeOptions"
              v-model="formModal.type"
              :multiple="false"
              :searchable="true"
              :loading="loading"
              :preserve-search="true"
              selectLabel="Chọn"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
            />
          </div>
        </div>
        <div class="form-group">
          <label><b>Ngày {{ convertFstarType }} <span class="text-danger">*</span></b></label>
          <div class="form-group">
            <datepicker
              v-model="formModal.date_key"
              format="yyyy-MM-dd"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              :placeholder="'Chọn ngày ' + (fstarType  === 'reward' ? 'thưởng' : 'phạt')"
            />
          </div>
        </div>
        <div class="form-group">
          <label><b>Lý do {{ convertFstarType }} <span class="text-danger">*</span></b></label>
          <div class="form-group">
            <b-input :placeholder="'Lý do ' + (fstarType  === 'reward' ? 'thưởng' : 'phạt')" v-model="formModal.reason" type="text"></b-input>
          </div>
        </div>
        <div class="form-group">
          <label v-if="fstarType === 'reward'"><b>Văn bản thưởng (không bắt buộc)</b></label>
          <label v-if="fstarType === 'penalty'"><b>Biên bản phạt (bắt buộc)</b></label>
          <div class="list-file" v-if="renderFile">
            <template v-for="(link, idx) in formModal.file_old">
              <div :key="link + idx + 'fileClass'" class="square-image">
                <i class="icon ion-md-close-circle cursor-pointer"
                   @click="deleteFileOld(idx)"
                ></i>
                <template>
                      <span>
                        <img
                          v-if="['pdf', 'video', 'image', 'doc'].includes(helper.getFileType(link))"
                          :src="previewImageRender(link)"
                          alt=""/>
                      </span>
                </template>
              </div>
            </template>
            <template v-for="(link, idx) in formModal.file_path">
              <div :key="link + idx + 'fileClass'" class="square-image">
                <i class="icon ion-md-close-circle cursor-pointer"
                   @click="deleteFile(idx)"
                ></i>
                <template>
                      <span>
                        <img
                          v-if="['pdf', 'video', 'image', 'doc'].includes(helper.getFileType(link))"
                          :src="previewImageRender(link)"
                          alt=""
                        />
                      </span>
                </template>
              </div>
            </template>
          </div>
          <input
            type="file"
            class="custom-file-input d-none"
            :multiple="false"
            :accept="accept"
            @input="addFile"
            :id="idInput"
            :name="'input_'"
          />
          <br/>
          <label class="custom-label" :for="idInput">
            <slot name="label">
              <div class="rounded cursor-pointer btn btn-outline-success px-3 py-2">+ Thêm file</div>
            </slot>
          </label>
        </div>
      </div>
      <div class="mt-1 text-center">
        <button
          data-style="zoom-out"
          class="btn btn-outline-success mr-4 w-25"
          @click="$bvModal.hide('modal-' + fstarType + '-fstar-' + actionModal)"
        >
          Hủy
        </button>
        <button
          data-style="zoom-out"
          class="btn btn-success ml-4 w-25"
          @click="$bvModal.show('modal-' + fstarType + '-confirm-fstar-' + actionModal)"
        >
          Xác nhận
        </button>
      </div>
    </b-modal>
    <b-modal
      :id="'modal-' + fstarType + '-confirm-fstar-' + actionModal"
      :title="modalActionConfirm.title"
      scrollable
      hide-footer
      header-class="justify-content-center"
      centered
      class="modal-confirm-fstar"
    >
      <div class="mb-4 text-center">
        {{modalActionConfirm.content}}
      </div>
      <div class="mt-1 text-center" v-loading="loadingComponent">
        <button
          data-style="zoom-out"
          class="btn btn-outline-success mr-4 w-25"
          @click="$bvModal.hide('modal-' + fstarType + '-confirm-fstar-' + actionModal)"
        >
          Hủy
        </button>
        <button
          data-style="zoom-out"
          class="btn btn-success ml-4 w-25"
          @click="submit"
        >
          Xác nhận
        </button>
      </div>
    </b-modal>
  </div>
</template>

<style scoped src="@/assets/sass/components/fstar/modal.scss" lang="scss"></style>

<script>
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'
import fstarService from 'domain/services/fstar-service'
import helper from 'infrastructures/helpers/common-helpers'

const optionValueUnit = [
  { value: '%', name: '% Lương' },
  { value: 'VNĐ', name: 'VNĐ' }
]

const optionLevelRewards = [
  { value: 'honors', text: 'Tuyên dương' },
  { value: 'cash', text: 'Tiền mặt' }
]

const optionLevelPenalties = [
  { value: 'waring', text: 'Cảnh cáo' },
  { value: 'cash', text: 'Tiền mặt' }
]

const optionCategoryPenalties = [
  { value: 'yellow_card', text: 'Thẻ vàng' },
  { value: 'red_card', text: 'Thẻ đỏ' }
]

const optionCategoryRewards = [
  { value: 'instant_bonus', text: 'Thưởng nóng' },
  { value: 'month_star', text: 'Ngôi sao tháng' },
  { value: 'dedication_bonus', text: 'Thưởng cống hiến' }
]

export default {
  name: 'ModalFstar',
  components: {
    Datepicker,
    Multiselect
  },
  props: {
    actionModal: {
      type: String | null,
      default: null
    },
    dataReward: {
      type: Object | null,
      default: null
    },
    userId: {
      type: Number | null,
      default: null
    },
    fstarType: {
      type: String,
      required: true
    },
    typeOptions: {
      type: Array,
      required: true
    }
  },
  computed: {
    helper: _ => helper,
    idInput () {
      return 'input-file-' + Math.random()
    },
    convertFstarType () {
      if (this.fstarType === 'penalty') {
        return 'phạt'
      } else if (this.fstarType === 'reward') {
        return 'thưởng'
      }
    }
  },

  watch: {
    dataReward () {
      this.resetFormModal()
      this.handle()
    }
  },

  data () {
    return {
      accept: 'image/*, .pdf, video/*',
      orderPeriod: 1,
      valueOptionType: optionValueUnit,
      optionCategories: [],
      optionLevels: [],
      formModal: {
        category: null,
        type: null,
        value_unit: null,
        date_key: null,
        reason: null,
        recompense_level: null,
        recompense_value: null,
        file_path: [],
        user_id: null,
        file_old: []
      },
      loading: false,
      loadingComponent: false,
      titleModalAction: '',
      reason: '',
      renderFile: true,
      modalActionConfirm: {
        title: '',
        content: ''
      }
    }
  },

  created () {
    this.initFormDataModal()
  },

  methods: {
    showModal () {
      if (this.dataReward !== null && this.actionModal === 'edit') {
        this.handle()
      }
    },
    reRenderFile () {
      this.renderFile = false
      this.renderFile = true
    },
    addFile (e) {
      let file = e.target.files || e.dataTransfer.files
      if (file.size) file = [file]
      let listExtAllow = this.accept.split(', ')
      for (const f of file) {
        let typeFile = f.type.split('/')
        let ext = f.name.split('.').pop()
        if (!typeFile || typeFile.leght < 1) return
        if (listExtAllow.includes(f.type) || listExtAllow.includes(typeFile[0] + '/*') || listExtAllow.includes('.' + ext)) {
          this.formModal.file_path.push(f)
        } else {
          helper.showMessage(`Định dạng file ${f.name}  không được hỗ trợ !`, 'warning')
        }
      }
      e.target.value = null
      this.reRenderFile()
    },
    emitSuccess () {
      this.resetFormModal()
      this.$bvModal.hide('modal-' + this.fstarType + '-fstar-' + this.actionModal)
      this.$bvModal.hide('modal-' + this.fstarType + '-confirm-fstar-' + this.actionModal)
      this.$emit('reloadListFstar')
    },
    resetFormModal () {
      this.formModal = {
        category: null,
        type: null,
        value_unit: null,
        date_key: null,
        reason: null,
        recompense_level: null,
        recompense_value: null,
        file_path: [],
        user_id: null,
        file_old: []
      }
    },
    async submit () {
      if (!this.formModal.category) {
        helper.showMessage('Vui lòng chọn Loại hình', 'warning')
        return
      }
      if (!this.formModal.recompense_level) {
        helper.showMessage('Vui lòng chọn Mức thưởng/phạt', 'warning')
        return
      }
      if (typeof this.formModal.recompense_level !== 'undefined' && this.formModal.recompense_level === 'cash') {
        if (!this.formModal.recompense_value) {
          helper.showMessage('Vui lòng nhập Giá trị thưởng phạt', 'warning')
          return
        }
        if (!this.formModal.value_unit) {
          helper.showMessage('Vui lòng chọn loại Giá trị thưởng/phạt', 'warning')
          return
        }
      }
      if (!this.formModal.type) {
        helper.showMessage('Vui lòng chọn nội dung thưởng', 'warning')
        return
      }
      if (!this.formModal.date_key) {
        helper.showMessage('Vui lòng chọn ngày', 'warning')
        return
      }
      if (!this.formModal.reason) {
        helper.showMessage('Vui lòng nhập lý do', 'warning')
        return
      }
      if (!this.formModal.recompense_level) {
        helper.showMessage('Vui lòng chọn mức thưởng phạt', 'warning')
        return
      }
      if (!this.formModal.user_id) {
        helper.showMessage('Vui lòng chọn người dùng', 'warning')
        return
      }

      if (this.fstarType === 'penalty') {
        if (this.formModal.file_old.length < 1 && this.formModal.file_path.length < 1) {
          helper.showMessage('Vui lòng tải lên biên bản', 'warning')
          return
        }

        this.loadingComponent = true
        if (this.actionModal === 'create') {
          await this.submitCreatePenalty()
        } else if (this.actionModal === 'edit') {
          await this.submitEditPenalty()
        }
      } else if (this.fstarType === 'reward') {
        this.loadingComponent = true
        if (this.actionModal === 'create') {
          await this.submitCreateReward()
        } else if (this.actionModal === 'edit') {
          await this.submitEditReward()
        }
      }

      this.loadingComponent = false
    },
    async submitCreateReward () {
      let formData = this.buildFormData(false)

      await fstarService.createReward(formData)
        .then(response => {
          if (response.data.success) {
            helper.showMessage(response.data.message, 'success')
            this.emitSuccess()
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
        })
    },
    async submitEditReward () {
      let formData = this.buildFormData(true)

      await fstarService.updateReward(formData)
        .then(response => {
          if (response.data.success) {
            helper.showMessage(response.data.message, 'success')
            this.emitSuccess()
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
        })
    },
    async submitCreatePenalty () {
      let formData = this.buildFormData(false)

      await fstarService.createPenalty(formData)
        .then(response => {
          if (response.data.success) {
            helper.showMessage(response.data.message, 'success')
            this.emitSuccess()
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
        })
    },
    async submitEditPenalty () {
      let formData = this.buildFormData(true)

      await fstarService.updatePenalty(formData)
        .then(response => {
          if (response.data.success) {
            helper.showMessage(response.data.message, 'success')
            this.emitSuccess()
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
        })
    },
    buildFormData (edit = false) {
      let formData = new FormData()
      formData.append('category', this.formModal.category)
      formData.append('type', this.formModal.type.alias)
      formData.append('date_key', helper.formatDate(this.formModal.date_key, 'YYYY-MM-DD'))
      formData.append('reason', this.formModal.reason)
      formData.append('recompense_level', this.formModal.recompense_level)

      if (typeof this.formModal.recompense_level !== 'undefined' && this.formModal.recompense_level === 'cash') {
        formData.append('recompense_value', this.formModal.recompense_value)
        formData.append('value_unit', this.formModal.value_unit.value)
      }

      if (typeof this.formModal.file_path !== 'undefined' && this.formModal.file_path.constructor === Array) {
        this.formModal.file_path.forEach((f) => {
          if (f.name) formData.append('file_path[]', f)
        })
      }
      if (typeof this.formModal.file_old !== 'undefined' && this.formModal.file_old.constructor === Array) {
        this.formModal.file_old.forEach((f) => {
          formData.append('file_old[]', f)
        })
      }

      if (edit) {
        formData.append('id', this.formModal.id)
      } else {
        formData.append('user_id', this.formModal.user_id)
      }
      return formData
    },
    handle () {
      let data = JSON.parse(JSON.stringify(this.dataReward))
      if (this.actionModal === 'edit') {
        if (this.fstarType === 'reward') {
          this.titleModalAction = 'Chỉnh sửa khen thưởng'
          this.modalActionConfirm.title = 'Xác nhận chỉnh sửa khen thưởng'
          this.modalActionConfirm.content = 'Bạn có chắc chắn muốn chỉnh sửa đề xuất thưởng ?'
        } else if (this.fstarType === 'penalty') {
          this.titleModalAction = 'Chỉnh sửa thẻ phạt'
          this.modalActionConfirm.title = 'Xác nhận chỉnh sửa thẻ phạt'
          this.modalActionConfirm.content = 'Bạn có chắc chắn muốn chỉnh sửa thẻ phạt này ?'
        }

        this.formModal = data
        this.formModal.id = data.id
        this.formModal.value_unit = this.valueOptionType.find(item => item.value === this.formModal.value_unit)
        this.formModal.type = this.typeOptions.find(item => item.alias === this.formModal.type)
        this.formModal.recompense_value = parseInt(data.recompense_value.replace(/,/g, ''), 10)
        this.formModal.file_path = []
        this.formModal.file_old = data.fstar_report

        if (data.recompense_level === 'honors') {
          // Tuyên dương
          this.formModal.recompense_value = null
          this.formModal.value_unit = null
        }
        if (data.recompense_level === 'waring') {
          // Cảnh cáo
          this.formModal.recompense_value = null
          this.formModal.value_unit = null
        }
      } else {
        if (this.fstarType === 'reward') {
          this.titleModalAction = 'Tạo khen thưởng'
          this.modalActionConfirm.title = 'Xác nhận tạo khen thưởng'
          this.modalActionConfirm.content = 'Bạn có chắc muốn tạo khen thưởng ?'
        } else if (this.fstarType === 'penalty') {
          this.titleModalAction = 'Tạo thẻ phạt '
          this.modalActionConfirm.title = 'Xác nhận tạo thẻ phạt'
          this.modalActionConfirm.content = 'Bạn có chắc chắn muốn tạo thẻ phạt  ?'
        }

        this.formModal.user_id = this.userId
      }
    },
    deleteFile (idx) {
      this.formModal.file_path.splice(idx, 1)
      this.reRenderFile()
    },
    deleteFileOld (idx) {
      this.formModal.file_old.splice(idx, 1)
      this.reRenderFile()
    },
    previewImageRender (file) {
      if (helper.isEmpty(file)) return ''
      let fileType = helper.getFileType(file)
      if (fileType === 'doc') return 'https://gs.giaohangtietkiem.vn/d/e24bec4ee88441bdb3e79466dd541152.png?height=250'
      if (typeof file === 'object') {
        if (fileType === 'pdf') return 'https://gs.giaohangtietkiem.vn/d/d7d5ef9e764e4227b7aef2c11dfd1371.png?height=250'
        if (fileType === 'video') return 'https://ghtk.me/images/icon-file-video.png?height=250'
        if (fileType === 'image') return URL.createObjectURL(file)
      } else {
        // là file đã được uplaod lên server
        if (['pdf', 'video'].includes(fileType)) return file + '?extract=thumb'
      }

      return file
    },
    initFormDataModal () {
      if (this.fstarType === 'penalty') {
        this.optionLevels = optionLevelPenalties
        this.optionCategories = optionCategoryPenalties
      } else if (this.fstarType === 'reward') {
        this.optionLevels = optionLevelRewards
        this.optionCategories = optionCategoryRewards
      }
    }
  }
}
</script>
