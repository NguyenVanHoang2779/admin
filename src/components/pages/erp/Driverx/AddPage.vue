<template>
    <div class="add-page" v-loading="loading">
        <b-form-input placeholder="Tiêu đề trang" v-model="name" class="page-title"></b-form-input>
        <b-form-group>
          <b-form-file
            :multiple="false"
            accept=".mp4"
            class="custom-file"
            v-model="file"
            placeholder="Vui lòng chọn file upload..."
          ></b-form-file>
        </b-form-group>
        <quill-editor
            ref="myQuillEditor"
            :options="optionEdittor"
            v-model="note"
        />
        <button class="my-btn save" @click="createPage">Lưu <i class="fa fa-floppy-o" aria-hidden="true"></i></button>
    </div>
</template>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import driverxService from 'domain/services/driverx-service'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import config from './config'

export default {
  components: {quillEditor},
  data () {
    return {
      loading: false,
      optionEdittor: config.optionEdittor,
      name: '',
      note: '',
      file: null
    }
  },
  methods: {
    async createPage () {
      try {
        this.loading = true
        let formData = new FormData()

        if (this.file) formData.append('file', this.file)
        formData.append('name', this.name)
        formData.append('note', this.note)
        formData.append('testId', this.$route.params.id)

        const {data} = await driverxService.createPage(formData)

        if (data.success) {
          this.name = ''
          this.note = ''
          this.file = null
          this.$emit('refreshTest')
          commonHelper.showMessage(data.message, 'success')
        } else commonHelper.showMessage(data.message, 'error')
      } catch (e) {
        commonHelper.showMessage(e.message, 'error')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.more-video-btn{
  margin-top: 10px;
}

.add-page{
  margin-top: 1em;
}
.page-title{
    margin-bottom: 2em;
}
.save{
    margin-top: 1em !important;
    background-color: #02a065 !important;
    color: white !important;
}
.my-btn{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;
}
</style>

<style>
.add-page .ql-container{
  height: 250px;
}
.add-page .ql-toolbar.ql-snow{
  border: 1px solid rgba(24, 28, 33, 0.1);
}
.add-page .ql-container.ql-snow{
  border: 1px solid rgba(24, 28, 33, 0.1);
}
</style>
