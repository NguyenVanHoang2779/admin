<template>
  <b-modal
    title="Thông báo nghỉ"
    modal-class="modal-cus"
    id="modal-notice-leave"
    header-class="justify-content-center header-modal-custom"
    size="sm"
    @hidden="resetData()"
    hide-footer
    static
  >
    <div class="wrap-cus">
      <div class="container-cus" :style="isDisabledText ? ' overflow-y: auto;' : ''">
        <div class="confirm-problem-cus">
          <div class="problems-current-cus">
            <label class="problems-cus">Ngày nghỉ <span class="text-danger ml-1">*</span></label>
            <Datepicker
              class="date-cus"
              :language="language.vi"
              v-model="leaveDate"
              format='dd-MM-yyyy'
              placeholder="Chọn ngày"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
            />
          </div>

          <div class="problems-current-cus">
            <label class="problems-cus">Lý do nghỉ <span class="text-danger ml-1">*</span></label>
            <Multiselect
              class="mb-2"
              v-model="reasonSelected"
              :options="listReason"
              placeholder="Chọn lý do"
              :multiple="false"
              label="name"
              track-by="id"
              selected-label=""
              deselect-label="X"
              select-label="Chọn"
              :hide-selected="true"
              :close-on-select="true">
              <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
              </Multiselect>
            <textarea
               v-if="!isDisabledText"
              :rows="(detailReason && detailReason.length > 50) ? 2 : 1"
              class="form-control"
              v-model="detailReason"
              placeholder="Nhập chi tiết"
            />
             <p v-else class="p-details">
            {{ detailReason }}
          </p>
          </div>

          <div class="other-problems-cus">
            <label class="problems-cus">Phạt % lương (nếu có)</label>
            <input
              class="form-control"
              v-model="salaryPenalty"
              placeholder="Nhập"
            />
          </div>

          <div class="other-problems-cus">
            <label class="problems-cus">Ghi chú</label>
            <textarea
               v-if="!isDisabledText"
              :rows="(note && note.length > 50) ? 2 : 1"
              class="form-control"
              v-model="note"
              placeholder="Nhập"
            />
             <p v-else class="p-details">
            {{ note }}
          </p>
          </div>

          <div class="other-problems-cus">
            <label class="problems-cus">Hồ sơ đính kèm</label>
            <div class="upload-file-cus">
              <file-view-upload
                class="d-inline-block"
                :input-id="'file_resign_'+ idHrOrder"
                :input-style="{ width: '5rem' }"
                :allow-delete="false"
                :hideUploadButton="true"
                :files="dataForm.files && dataForm.files[0] && dataForm.files[0].file_exist"
                height="6rem"
                :edit="true"
                :input-placeholder="'Thêm tệp'"
                @onChange="setDataFile"
              ></file-view-upload>
            </div>
          </div>

        </div>
      </div>
      <div class="confirm-cus">
        <b-btn :disabled="loading" :style="isDisableBtn() ? 'background-color: #BDBDBD;' : 'background-color: #069255;'" variant="ghtk" class="btn-cus" @click="confirm()">Xác nhận</b-btn>
      </div>
    </div>
  </b-modal>

</template>

<script>

import hrOrderService from 'domain/services/hr-order-service'
import helper from 'infrastructures/helpers/common-helpers'

import Datepicker from 'vuejs-datepicker'
import {vi} from 'vuejs-datepicker/dist/locale'
import FileViewUpload from 'components/elements/common/FileViewUpload'

import Multiselect from 'vue-multiselect'
export default {
  name: 'ModalNoticeLeave',
  components: {
    Multiselect,
    Datepicker,
    FileViewUpload
  },
  data: _ => ({
    loading: false,
    data: [],
    language: {
      vi: vi
    },
    reasonSelected: null,
    listReason: [
      {
        id: 1,
        name: 'Chế độ, thu nhập không đảm bảo'
      },
      {
        id: 2,
        name: 'Sức khỏe không đảm bảo/Ốm đau dài hạn'
      },
      {
        id: 3,
        name: 'Không đáp ứng được thời gian, địa điểm'
      },
      {
        id: 4,
        name: 'Không phù hợp với tính chất công việc'
      },
      {
        id: 5,
        name: 'Không phù hợp với môi trường, văn hóa - không hợp với Quản lý/đồng nghiệp'
      },
      {
        id: 6,
        name: 'Có công việc mới'
      },
      {
        id: 7,
        name: 'Khác'
      }
    ],
    detailReason: '',
    salaryPenalty: null,
    note: '',
    leaveDate: null,
    files: [],
    isDisabledText: false
  }),
  props: {
    idHrOrder: null,
    dataForm: {}
  },
  computed: {
  },
  created () {
  },
  watch: {
    dataForm: {
      immediate: true,
      handler: function (oldVal, newVal) {
        this.setData()
      },
      deep: true
    }
  },
  methods: {
    isDisableBtn () {
      if (!this.leaveDate || !this.reasonSelected || this.detailReason.length === 0) {
        return true
      }

      if (this.dataForm && this.dataForm.resign_info && this.dataForm.resign_info) {
        if (this.dataForm.resign_info.resign_type === 'nghi_ngang' || this.dataForm.resign_info.resign_type === 'nghi_truoc_han') {
          this.isDisabledText = true
          return true
        }
      }
      return false
    },
    setData () {
      if (this.dataForm && this.dataForm.resign_info) {
        if (this.dataForm.resign_info.resign_date) {
          this.leaveDate = this.dataForm.resign_info.resign_date
        }

        if (this.dataForm.resign_info.resign_reason) {
          let option = this.listReason.filter((item) => item.name.toUpperCase().replaceAll(' ', '') === this.dataForm.resign_info.resign_reason.toUpperCase().replaceAll(' ', ''))
          if (option && option.length > 0) this.reasonSelected = option[0]
        }

        if (this.dataForm.resign_info.resign_fine) {
          this.salaryPenalty = this.dataForm.resign_info.resign_fine
        }

        if (this.dataForm.resign_info.resign_reason_detail) {
          this.detailReason = this.dataForm.resign_info.resign_reason_detail
        }

        if (this.dataForm.note) {
          this.note = this.dataForm.note
        } else {
          this.note = ''
        }
      }
    },
    confirm: async function () {
      if (this.isDisableBtn()) {
        return
      }
      if (!this.leaveDate) {
        return helper.showMessage('Trường ngày nghỉ không được bỏ trống', 'warning')
      }
      if (!this.reasonSelected) {
        return helper.showMessage('Vui lòng chọn lý do nghỉ', 'warning')
      }
      if (this.detailReason.length === 0) {
        return helper.showMessage('Vui lòng nhập chi tiết lý do nghỉ', 'warning')
      }

      if (!this.idHrOrder) {
        return helper.showMessage('Không xác định được id của đề xuất', 'warning')
      }

      let data = new FormData()
      data.append('order_id', this.idHrOrder)
      data.append('resign_date', helper.formatDate(this.leaveDate, 'YYYY-MM-DD'))
      data.append('resign_reason', this.reasonSelected.name || '')
      data.append('resign_reason_detail', this.detailReason || '')
      if (this.note.length > 0) {
        data.append('note', this.note)
      }
      if (this.files.length > 0) {
        for (let i = 0; i < this.files.length; i++) {
          data.append('files[' + i + ']', this.files[i])
        }
      }
      if (this.salaryPenalty && this.salaryPenalty.length > 0) {
        if (isNaN(Number(this.salaryPenalty))) {
          return helper.showMessage('Phần trăm lương phải là số nguyên', 'warning')
        }
        data.append('resign_fine', this.salaryPenalty)
      }
      try {
        this.loading = true
        const res = await hrOrderService.resignationNotify(data)
        if (res.data.success) {
          this.$emit('changeEvent', {type: 'create_notice_success', data: null})
          this.resetData()
          this.$bvModal.hide('modal-notice-leave')
        } else {
          helper.showMessage(res.data.message || 'Có lỗi xảy ra khi tạo thông báo nghỉ', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (+e.response.status === 422) { return helper.showMessage(e.response.data.message, 'warning') }
      } finally {
        this.loading = false
      }
    },

    resetData () {
      this.reasonSelected = null
      this.leaveDate = null
      this.detailReason = ''
      this.salaryPenalty = ''
      this.note = ''
      this.leaveDate = null
      this.isDisabledText = false
      this.files = []
      this.$emit('resetData')
    },
    convertData (data) {
      return data.map((item) => item.name).join(', ')
    },
    setDataFile (file) {
      this.files = file
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .modal-cus {
  .modal-dialog {
    max-width: 45.5rem !important;
    align-items: center;
    min-height: calc(100% - (1.75rem * 2));
    display: flex;
    -webkit-box-align: center;
  }
  .modal-header {
    height: 3rem !important;
  }
  .modal-title {
    line-height: 0.7 !important;
  }
  .close {
    display: inline-block !important;
    font-size: 1.5rem !important;
  }
}
.wrap-cus {
  font-size: 15px;
  color: black;
  .container-cus {
    margin-bottom: 0.5rem;
    max-height: 45rem;
    .title-cus {
      font-weight: 500;
      font-size: 16px;
    }
    .problems-cus {
      margin-top: 0.5rem;
    }
  }
}
.confirm-cus {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  .btn-cus {
    width: 12rem;
    height: 2.4rem;
    font-weight: 700;
    font-size: 16px;
  }
}
/deep/ .multiselect__tags {
  padding-left: 0.8rem !important;
}
.document-type-desc {
  text-align: center;
  font-size: 8px;
  color: white;
  background: rgba(0, 0, 0, 0.64);
  width: 100%;
  position: absolute;
  bottom: 0;
  pointer-events: none;
  .box-file-contract {
    height: 100%;
  }
}
.num-img-extend {
  pointer-events: none;
  text-align: center;
  font-size: unset;
  color: white;
  background-color: rgba(0, 0, 0, 0.47);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.p-details {
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  border: 1px solid #BDBDBD;
  border-radius: 5px;
  background-color: #f1f1f2;
  color: #4E5155;
  min-height: 2.2rem;
}
</style>
