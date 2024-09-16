<template>
  <b-modal ref="edit-modal" dialog-class="mh-40re" :title="title" size="lg" ok-only static centered>
    <b-row class="mb-3">
      <b-col md="6">
        <b-form-group>
          <template slot='label'>
            Tên biến: <span class='red-text'>(*)</span>
          </template>
          <b-form-input
            v-model="form.variable"
            id="form_variable"
            name="form_variable"
            v-validate="'required'"
            placeholder="Nhập tên biến"
            :class="{'is-danger': errors.has('form_variable')}"
          >
          </b-form-input>
          <span v-show="errors.firstRule('form_variable') == 'required'" class="help is-danger">Không để trống trường này </span>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Trường">
          <b-input placeholder="Nhập trường" v-model="form.field"/>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col md="6">
        <b-form-group label="Bảng">
          <b-input placeholder="Nhập bảng" v-model="form.table"/>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group>
        <template slot='label'>
          Miêu tả: <span class='red-text'>(*)</span>
        </template>
        <b-form-group>
          <b-form-input
            v-model="form.descrip"
            id="form_descrip"
            name="form_descrip"
            v-validate="'required'"
            placeholder="Nhập miêu tả"
            :class="{'is-danger': errors.has('form_descrip')}"
          >
          </b-form-input>
          <span v-show="errors.firstRule('form_descrip') == 'required'" class="help is-danger">Không để trống trường này </span>
        </b-form-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col md="12">
        <b-form-group>
          <template slot='label'>
            Ví dụ cách sử dụng: <span class='red-text'>(*)</span>
          </template>
          <b-form-input
            v-model="form.example"
            id="form_example"
            name="form_example"
            v-validate="'required'"
            placeholder="Nhập ví dụ"
            :class="{'is-danger': errors.has('form_example')}"
          >
          </b-form-input>
          <span v-show="errors.firstRule('form_example') == 'required'" class="help is-danger">Không để trống trường này </span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="col-md-12">
        <div class="template-label cursor-pointer">
          <div class="col-form-label">Thêm ảnh minh họa (Ảnh, PDF)</div>
          <file-view-upload
            class="d-inline-block"
            :input-id="'file_' + varEditting"
            :allow-delete="allowDelete"
            :hideUploadButton="true"
            height="5rem"
            :edit="true"
            :files="files"
            :file-add="fileAdd"
            :file-delete="fileDelete"
          ></file-view-upload>
        </div>
      </b-col>
    </b-row>
    <template slot="modal-footer">
      <b-button variant="primary" @click="handleSubmit()">
        Đồng ý
      </b-button>
    </template>
  </b-modal>
</template>

<style scoped lang="scss">
.sperator-right {
  border-right: 1px solid rgba(0, 0, 0, 0.2)
}
.is-danger {
  border-color: #E0B4B4;
  color: #9F3A38;
  box-shadow: none;
}
</style>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import TemplateService from 'domain/services/template-service'
import VeeValidate from 'vee-validate'
import FileViewUpload from 'components/elements/common/FileViewUpload'
import Vue from 'vue'
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})
export default {
  name: 'modal-edit-variable',
  components: {FileViewUpload},

  props: [
    'varEditting', 'trigger', 'type'
  ],

  data: () => ({
    title: 'Chỉnh sửa biến cho template',
    disable: false,
    form: {variable: null, field: null, table: null, descrip: null, example: null, link: []},
    fileAdd: [],
    fileDelete: [],
    loading: false,
    edit: true,
    files: [],
    allowDelete: true
  }),

  watch: {
    trigger: function (newVal, oldVal) {
      this.resetForm()

      if (this.type === 'edit') {
        if (!this.varEditting) return
        let param = {
          id: this.varEditting
        }

        TemplateService.getVariableById(param).then(res => {
          if (res.data.success) {
            this.form.variable = res.data.data.ErpTemplateVariable.variable
            this.form.field = res.data.data.ErpTemplateVariable.field
            this.form.table = res.data.data.ErpTemplateVariable.table
            this.form.descrip = res.data.data.ErpTemplateVariable.descrip
            this.form.example = res.data.data.ErpTemplateVariable.example
            if (res.data.data.ErpTemplateVariable.link != null) {
              this.form.link = res.data.data.ErpTemplateVariable.link.split(',').map(s => s.trim())
              var links = []
              var name = this.form.variable
              this.form.link.map(function (item, i) {
                links.push({link: item, name: name + '_' + i})
              })
              this.files = links
            }
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
          .catch(e => {
            console.log(e)
          })
          .then(() => {
            this.appLoading = false
          })
      }
      this.$refs['edit-modal'].show()
    },

    type: function (newVal, oldVal) {
      if (newVal === 'create') {
        this.disable = false
        this.title = 'Tạo biến cho template'
      }
      if (newVal === 'edit') {
        this.title = 'Chỉnh sửa biến cho template'
        this.disable = true
      }
    }
  },

  methods: {
    resetForm: function () {
      this.form.variable = null
      this.form.field = null
      this.form.table = null
      this.form.descrip = null
      this.form.example = null
      this.form.link = []
      this.files = []
    },

    handleSubmit () {
      let dataSend = new FormData()

      Object.keys(this.form)
        .forEach(key => {
          if (!this.form[key]) dataSend.append(key, '')
          else dataSend.append(key, this.form[key])
        })

      if (this.fileDelete.length > 0) {
        var arrLinks = this.form.link
        var linkDels = this.fileDelete
        for (let i = 0; i < linkDels.length; i++) {
          var urlLink = arrLinks.indexOf(linkDels[i])
          if (urlLink > -1) arrLinks.splice(urlLink, 1)
        }
        dataSend.append('link', arrLinks)
      }

      if (this.fileAdd.length > 0) {
        for (let i = 0; i < this.fileAdd.length; i++) {
          dataSend.append('file[]', this.fileAdd[i])
        }
      }

      if (this.type === 'edit') {
        dataSend.append('id', this.varEditting)
        TemplateService.updateVariable(dataSend)
          .then(res => {
            this.fileDelete = []
            if (res.data.success) {
              this.fileAdd = []
              this.$emit('on-updated', res.data.message)
              this.$refs['edit-modal'].hide()
            } else {
              commonHelper.showMessage(res.data.message, 'fail')
            }
          })
      }

      if (this.type === 'create') {
        this.$validator.validateAll().then((result) => {
          if (result) {
            TemplateService.addVariable(dataSend)
              .then(res => {
                this.fileDelete = []
                if (res.data.success) {
                  this.fileAdd = []
                  this.$emit('on-updated', res.data.message)
                  this.$refs['edit-modal'].hide()
                } else {
                  commonHelper.showMessage(res.data.message, 'fail')
                }
              })
          }
        })
      }
    }
  }
}
</script>
