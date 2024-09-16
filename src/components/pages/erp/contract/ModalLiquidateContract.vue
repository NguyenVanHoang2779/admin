<template>
  <b-modal hide-footer @hide="resetInfo" modal-class="modal-lg-custom align-items-center" :title="title" :id="id" centered static @shown="getLiquidateInfo">
    <b-row v-loading="loading">
        <b-col md="6">
          <b-form-group>
            <span slot="label">Ngày thanh lý <span class="text-danger">*</span></span>
            <datepicker
              v-model="liquidateInfo.liquidate_date"
              format='dd/MM/yyyy'
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              placeholder="Chọn ngày thanh lý"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group>
            <span slot="label">Lý do <span class="text-danger">*</span></span>
            <SelectOption
              :options="reasonLiquidate"
              v-model="liquidateInfo.reason"
              placeholder="Chọn lý do thanh lý hợp đồng"
            />
          </b-form-group>
        </b-col>
        <b-col md="12" class="mt-1" v-show="liquidateInfo.reason === 'other'">
          <b-form-group>
            <span slot="label">Nhập lý do khác <span class="text-danger">*</span></span>
            <b-input v-model="liquidateInfo.other_reason" placeholder="Nhập lý do thanh lý hợp đồng"></b-input>
          </b-form-group>
        </b-col>
        <b-col md="12" class="mt-1">
          <b-form-group label="Thêm file thanh lý (nếu có)">
            <FileViewUpload
              :file-add="fileAdd"
              :file-delete="fileDelete"
              :files="files"
              :edit="edit"
              accept='image/*, .pdf, .doc, .docx'
              :input-id="id + '-file-liquidation'"
              :hideUploadButton="true"
            />
          </b-form-group>
        </b-col>
    </b-row>
    <div class="seperate-sm mb-1"></div>
    <div class="text-center" v-show="edit">
      <b-btn variant="ghtk" name="stop-work-btn-update-liquidate-info" id='stop-work-btn-update-liquidate-info' @click="updateLiquidateInfo">Xác nhận thanh lý</b-btn>
    </div>
  </b-modal>
</template>

<script>
// Api service
import contractService from 'domain/services/contract-service'
// custom components
import FileViewUpload from 'components/elements/common/FileViewUpload'
import SelectOption from 'components/elements/common/SelectOption'

// built-in component
import Datepicker from 'vuejs-datepicker'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// entities
import Contract from 'domain/entities/Contract'

export default {
  name: 'detail-liquidate-contract',

  props: {
    title: {
      type: String,
      default: 'Thông tin thanh lý'
    },
    id: {
      type: String,
      default: 'detail-liquidate-contract'
    },
    contractId: {
      default: null
    },
    contract: {

    },
    edit: {
      default: true
    }
  },

  components: {
    FileViewUpload,
    SelectOption,
    Datepicker
  },

  data: () => ({
    liquidateInfo: {
      id: null,
      contract_id: null,
      date: null,
      reason: null,
      other_reason: null,
      status: null
    },
    reasonLiquidate: Contract.reasonLiquidate,
    files: [],
    fileAdd: [],
    fileDelete: [],
    loading: false
  }),

  watch: {},

  methods: {
    resetInfo () {
      this.files = []
      this.fileAdd = []
      this.fileDelete = []
      this.liquidateInfo.liquidate_date = ''
      this.liquidateInfo.reason = ''
      helper.resetData(this.liquidateInfo)
    },

    updateLiquidateInfo () {
      let contractId = this.contractId
      if (!contractId) return

      let data = new FormData()

      if (!this.liquidateInfo.liquidate_date || !this.liquidateInfo.reason || (this.liquidateInfo.reason === 'other' && !this.liquidateInfo.other_reason)) {
        helper.showMessage('Vui lòng nhập đủ thông tin !')
        return
      }

      // kiểm tra ngày thanh lý để show thông báo
      let today = new Date()
      let liquidateDate = new Date(this.liquidateInfo.liquidate_date)
      if (liquidateDate.getTime() <= today.getTime()) {
        if (!confirm('Hợp đồng sẽ bị vô hiệu hóa ngay lập tức !')) return
      }

      for (const idx in this.fileDelete) {
        data.append('fileDelete[' + idx + ']', this.fileDelete[idx])
      }

      for (const idx in this.fileAdd) {
        data.append('fileAdd[' + idx + ']', this.fileAdd[idx])
      }

      for (const field in this.liquidateInfo) {
        if (this.liquidateInfo[field] instanceof Date) {
          data.append(field, this.liquidateInfo[field].toDateString())
          continue
        }
        if (this.liquidateInfo[field]) data.append(field, this.liquidateInfo[field])
        else data.append(field, '')
      }

      data.append('contract_id', contractId)

      this.$startLoading()

      contractService.updateLiquidateInfo(data)
        .then(res => {
          if (res.data.success) {
            this.$emit('updateOk', res.data.data)
            this.files = res.data.data.file || []
            this.fileAdd = []
            this.fileDelete = []
            this.$bvModal.hide(this.id)
            helper.showMessage(res.data.message, 'success')
          } else {
            helper.showMessage(res.data.message || 'Không cập nhật được thông tin thanh lý, vui lòng liên hệ IT để được hỗ trợ !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Không cập nhật được thông tin thanh lý, vui lòng liên hệ IT để được hỗ trợ !', 'warning')
          console.log(e)
        })
        .finally(_ => {
          this.resetInfo()
          this.$stopLoading()
        })
    },

    getLiquidateInfo () {
      let contractId = this.contractId || this.contract.id
      if (!contractId) return
      this.loading = true

      let params = {
        contract_id: contractId
      }
      contractService.getLiquidateInfo(params)
        .then(res => {
          if (res.data.success) {
            if (res.data.data) {
              this.liquidateInfo = res.data.data
              this.files = res.data.data.file
            }
            this.fileAdd = []
            this.fileDelete = []
          } else {
            helper.showMessage(res.data.message || 'Không thể lấy thông tin thanh lý !', 'warning')
            this.resetInfo()
          }
        })
        .catch(e => {
          helper.showMessage('Không thể lấy thông tin thanh lý !', 'warning')
          console.log(e)
          this.resetInfo()
        })
        .finally(_ => {
          this.loading = false
        })
    }
  }
}
</script>
