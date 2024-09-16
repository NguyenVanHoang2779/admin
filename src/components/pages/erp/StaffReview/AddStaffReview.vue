<template>
  <div>
    <b-modal hide-footer id="reviewStaffs" ref="reviewLog" size="lg" :title="title" ok-only centered>
      <b-card-body>
        <b-row>
          <b-form-group class="col-md-12">
            <label class="form-label">Nhân viên:</label>
            <b-form-input readonly v-model="staffInfo" ></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-12">
            <label class="form-label">Note:</label>
            <!-- <b-form-textarea
              v-model="note"
              placeholder="Nhận xét..."
              rows="10"
            ></b-form-textarea> -->
            <quill-editor
              ref="myQuillEditor"
              :options="optionEdittor"
              v-model="note"
            />
          </b-form-group>
        </b-row>
      </b-card-body>
      <b-row align-h="center">
        <b-button :disabled="buttonDisable" variant="success" @click="submitReview()">{{buttonTitle}}</b-button>
      </b-row>
    </b-modal>
  </div>
</template>
<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import StaffReviewService from 'domain/services/staff-review-service'
import { quillEditor } from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'add-staff-review',

  props: ['staff', 'trigger', 'item', 'isEdit'],

  components: {
    quillEditor
  },
  data () {
    return {
      optionEdittor: {
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline'],
            [{'list': 'ordered'}, { 'list': 'bullet' }],
            [{'indent': '-1'}, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['image', 'link']
          ]
        },
        placeholder: 'Nhận xét...',
        theme: 'snow'
      },
      idStaff: '',
      staffInfo: '',
      note: '',
      title: '',
      buttonTitle: '',
      buttonDisable: false
    }
  },
  watch: {
    trigger () {
      this.reset()
      this.$refs['reviewLog'].show()
    }
  },
  created () {
  },
  methods: {
    reset () {
      this.staffInfo = this.staff.fullname + ' - ' + this.staff.staff_code
      if (this.isEdit) {
        this.note = this.item ? this.item.note : ''
      } else {
        if (this.idStaff !== this.staff.id) {
          this.note = ''
        }
      }
      this.idStaff = this.staff.id
      if (this.isEdit) {
        this.title = 'Sửa review'
        this.buttonTitle = 'Cập nhật'
      } else {
        this.title = 'Thêm review'
        this.buttonTitle = 'Thêm'
      }
    },
    submitReview () {
      if (!confirm('Chắc chắn thêm review?')) return
      let dataSend = new FormData()
      dataSend.append('user_id', this.staff.id)
      dataSend.append('note', this.note)
      if (this.isEdit) dataSend.append('id', this.item.id)
      this.buttonDisable = true
      StaffReviewService.addStaffReview(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.$refs['reviewLog'].hide()
          this.$emit('updateOk', this.staff, {id: this.item.id, note: this.note})
        } else {
          commonHelper.showMessage(response.data.message, 'warn')
        }
      }).then(() => {
        this.buttonDisable = false
      }).catch(error => {
        console.error('submitReview', error)
      })
    }
  }
}
</script>

<style>
#reviewStaffs .ql-container{
  height: 250px;
}
</style>
