<template>
    <div>
        <b-modal modal-class="modal-custom" static centered  id="modal-import-data-candidate" @hide="resetForm()" hide-footer hide-header>
            <div class="modal-title-contact">
            <span>Nhập dữ liệu</span>
            </div>
                <div class="modal-content-import-data">
                <div>
                    <span>- Chỉ cho phép upload file excel.</span><br>
                    <span>- Không được để trống các trường sau: STT, Họ tên, số điện thoại, ngày ứng tuyển, trạng thái.</span><br>
                    <span>- Nội dung các cột trạng thái, Vị trí, nguồn giới thiệu, kênh giới thiệu chỉ được chọn theo file mẫu.</span><br>
                    <span>- Ngày ứng tuyển không được có chữ.</span><br>
                    <span>- Thời gian để ở định dạng DD-MM-YYYY hoặc YYYY-MM-DD, ví dụ: 03-03-2022</span><br>
                    <span>- Nếu có nhiều sheet, Hệ thống sẽ nhận diện sheet đầu tiên của file excel</span><br>
                    <span>- Các trạng thái của lưu thông tin: Hủy ứng tuyển, đã nghỉ việc, Không trúng tuyển, từ chối nhận việc..</span><br>
                </div>
                <div class="mt-4">
                <div style="text-align: center;font-size: 16px;color: #000;"><b>KÉO THẢ FILE ĐỂ UPLOAD</b></div>
                <div class="text-center mt-2">
                    <b-btn variant="outline-ghtk" class="button-import-data" @click="exportSampleFile">
                        Tải file mẫu
                    </b-btn>
                    <b-button class="btn btn-outline-ghtk button-import-data" @click="triggerInputFileDataDisabled" id='candidate-btn-import-data' name='candidate-btn-import-data'
                              v-if="!isUploading">
                      <span class="ladda-label">Chọn file</span>
                    </b-button>
                    <b-btn v-if="isUploading" variant="outline-ghtk" class="exporting-btn">
                        <span>
                            <div class="sk-folding-cube sk-primary">
                                <div class="sk-cube1 sk-cube"></div>
                                <div class="sk-cube2 sk-cube"></div>
                                <div class="sk-cube4 sk-cube"></div>
                                <div class="sk-cube3 sk-cube"></div>
                            </div>
                            Đang xử lý...
                        </span>
                    </b-btn>
                </div>
              </div>
            </div>
        </b-modal>
        <b-form-file
            v-model="dataFileExcelCandidateDisabled"
            style="display: none"
            ref="fileInputDataDisabled"
        ></b-form-file>
  </div>
</template>
<style lang="scss" scoped>
.modal-title-contact {
    text-align: center;
    padding-top: 6px;
    padding-bottom: 6px;
    font-size: 18px;
    color: white;
    background: #069255;
}
.button-import-data {
    width: 150px;
    border-radius: 5px;
    padding: 5px 0;
    a {
      color: #069255 !important;
    }
    &:hover a {
      color: white !important;
    };
}
.modal-content-import-data {
    padding: 15px;
    color: #000;
}
.exporting-btn {
    span {
      position: relative; padding-left: 20px
    }
    .sk-folding-cube.sk-primary{
      position: absolute; height: 12px; width: 12px; top: -37px; left: 0
    }
}

</style>

<script>
export default {
  name: 'ModalImportData',
  props: {
    isUploading: {
      default: false
    },
    fileExcelCandidateDisabled: {
      default () {
        return []
      }
    }
  },
  data () {
    return {
      dataFileExcelCandidateDisabled: this.fileExcelCandidateDisabled
    }
  },
  watch: {
    dataFileExcelCandidateDisabled: {
      handler: function (newVal) {
        this.$emit('changeFileExcelCandidateDisabled', newVal)
      },
      deep: true
    }
  },
  methods: {
    triggerInputFileDataDisabled () {
      this.$emit('importing')
      this.$refs.fileInputDataDisabled.$el.childNodes[0].click()
    },

    resetForm () {
      this.dataFileExcelCandidateDisabled = []
    },

    exportSampleFile () {
      let link = '/admin/manage-candidates/exportCandidateCreationTemplate'
      window.open(link, '_blank')
    }
  }
}
</script>

<style scoped>

</style>
