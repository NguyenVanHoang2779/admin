<template>
  <table class="table table-sm table-borderless position-relative" v-loading="loading">
    <tr>
      <th colspan="4">Con(nếu có ghi nhiều dòng)</th>
      <th>File giấy khai sinh</th>
      <th></th>
    </tr>
    <ListChildren :children="children" @remove="removeChild" edit :fileOption="{edit: true}" />
    <tr>
      <th colspan="10">
        <b-btn variant="outline-ghtk" class="btn-sm sub_btn_add" @click="addChild()">
          <i class="ion ion-md-add"></i>&nbsp; Thêm con
        </b-btn>
      </th>
    </tr>
  </table>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import FileViewUpload from 'components/elements/common/FileViewUpload'
import ListChildren from './ListChildren.vue'

import helper from 'infrastructures/helpers/common-helpers'

// service
import staffInfoService from 'domain/services/staff-info-service'

export default {
  name: 'list-children-form',

  components: {
    Datepicker,
    FileViewUpload,
    ListChildren
  },

  props: {
    masterProfileId: {
      type: Number
    }
  },
  data: () => ({
    loading: false,
    children: [],
    originData: null
  }),

  computed: {
    gender: () => ([
      { text: 'Giới tính', value: null },
      { text: 'Nam', value: 'male' },
      { text: 'Nữ', value: 'female' }
      // { text: 'Khác', value: 'other' }
    ])
  },

  methods: {
    getChildrenInfo (masterProfileId) {
      this.loading = true
      staffInfoService.getChildrenInfo({master_profile_id: masterProfileId})
        .then(res => {
          if (res.data.success) {
            let children = res.data.data || []

            this.children = children.map(child => {
              child.birth_certificate_add = []
              child.birth_certificate_delete = []
              if (!child.birth_certificate) child.birth_certificate = []

              return child
            })
            this.originData = JSON.stringify(this.children)
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi lấy thông tin con nhỏ')
          }
        })
        .catch(e => {
          helper.showMessage(e)
        })
        .finally(_ => {
          this.loading = false
        })
    },

    updateChildrenInfo (masterProfileId) {
      if (this.originData === JSON.stringify(this.children)) {
        return
      }
      if (!masterProfileId) {
        helper.showMessage('Không có Id nhân viên cần cập nhật thông tin con nhỏ')
        return
      }

      let formData = helper.createFormData({master_profile_id: masterProfileId, children: this.children})

      this.loading = true
      staffInfoService.updateChildrenInfo(formData)
        .then(res => {
          if (res.data.success) {
            this.getChildrenInfo(masterProfileId)
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi cập nhật thông tin con nhỏ')
          }
        })
        .catch(e => {
          helper.showMessage(e)
        })
        .finally(_ => {
          this.loading = false
        })
    },

    addChild () {
      this.children.push({
        name: '',
        birthday: '',
        gender: '',
        personal_id_number: '',
        birth_certificate: [],
        birth_certificate_add: []
      })
    },

    removeChild (index) {
      this.children.splice(index, 1)
    }
  }
}
</script>
