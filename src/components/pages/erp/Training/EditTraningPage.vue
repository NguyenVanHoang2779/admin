<template>
    <div class="add-page">
        <b-form-input placeholder="Tiêu đề trang" v-model="name" class="page-title"></b-form-input>
        <div class="video-box" v-if="video">
            <img :src="video" class="uploaded-img" v-if="isImage(video)"/>
            <video width="100" height="100" controls v-else>
              <source :src="video" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            <b-button class="ml-1 delete" size="sm" variant="danger" @click="video = null">
              Xóa <i class="fa fa-trash"></i>
            </b-button>
        </div>
        <b-form-group label="Video" v-else>
          <b-form-file
            :multiple="false"
            accept=".mp4, image/*"
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
        <button class="my-btn save" @click="editPage">Lưu <i class="fa fa-floppy-o" aria-hidden="true"></i></button>
    </div>
</template>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import trainingService from 'domain/services/training-service'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import config from './config'

export default {
  components: {quillEditor},
  props: ['page'],
  mounted () {
    this.name = this.page.name
    this.note = this.page.note
    this.video = this.page.file
  },
  data () {
    return {
      optionEdittor: config.optionEdittor,
      name: '',
      note: '',
      file: null,
      video: null
    }
  },
  methods: {
    async editPage () {
      try {
        let formData = new FormData()

        if (this.video) formData.append('video', this.video)
        else if (this.file) formData.append('file', this.file)
        formData.append('name', this.name)
        formData.append('note', this.note)
        formData.append('id', this.page.id)
        const {data} = await trainingService.editTrainingPage(formData)
        if (data.success) {
          this.$emit('refreshTest')
          commonHelper.showMessage(data.message, 'success')
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    isImage (path) {
      if (!path) return null
      let imageReg = /[/.](gif|jpg|jpeg|tiff|png)$/i
      return imageReg.test(path)
    }
  },
  watch: {
    page (v) {
      this.name = v.name
      this.note = v.note
      this.video = v.file
      this.file = null
    }
  }
}
</script>

<style lang="scss" scoped>
.video-box{
  display: flex;
  justify-content: center;
  align-items: baseline;
  flex-direction: column;
}
.delete{
  margin-top: 10px;
  margin-bottom: 10px;
}
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
.uploaded-img{
  margin-right: 5px;
  width: 100px;
  height: 100px;
  vertical-align: baseline;
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
