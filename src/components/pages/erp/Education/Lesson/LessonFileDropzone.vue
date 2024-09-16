<template>
  <div hidden="hidden">
    <div ref="dropzoneElement" class="dropzone"></div>
    <input ref="selectFileInput" type="file" accept="application/pdf, video/*, image/*" v-on:change="onSelectFile"/>
  </div>
</template>

<style scoped lang="scss">

</style>
<script>
import config from 'config/app.base'
import helper from 'infrastructures/helpers/common-helpers'
import dropzoneService from 'domain/services/dropzone-service'
import GchatAuth from 'infrastructures/gchat-auth'
import axios from 'axios'
import {AuthRedirectGuardMiddleware} from '@/vendor/libs/gmjs/lib'
import WebStorage from 'infrastructures/web-storage'

export default {
  name: 'LessonFileDropzone',

  props: {
    triggerUpload: {
      type: Boolean,
      default: false
    },
    lectureId: {
      type: Number,
      default: 0
    },
    cur_lesson: {},
    maxFileSizeMB: {
      type: Number,
      default: 2000 // 2GB
    },
    minChunkSizeMB: {
      type: Number,
      default: 5 // 5MB
    },
    maxChunkSizeMB: {
      type: Number,
      default: 50 // 100MB
    },
    maxUploadBodySizeMB: {
      type: Number,
      default: 100 // 100MB
    },
    maxChunksPerFile: {
      type: Number,
      default: 200 // max chunk parts per file ~ number of parallel chunk uploads
    }
  },

  data: function () {
    return {
      accept: ['video', 'image', 'pdf'],
      dropzone: null
    }
  },

  created () {
  },

  mounted () {
    this.dropzone = dropzoneService.createDropzone(this.$refs.dropzoneElement, {
      url: config.baseApiHrmUniUrl + '/education/api/tp/lessons/docs/upload',
      maxFilesize: this.maxFileSize,
      chunkSize: this.maxChunkSize
    })

    this.dropzone.on('sending', this.onDzUploadFile)
    this.dropzone.on('uploadprogress', this.onDzUploadProgress)
    this.dropzone.on('success', this.onDzSuccess)
    this.dropzone.on('error', this.onDzError)
    this.dropzone.on('queuecomplete', this.onDzQueueComplete)
  },

  computed: {
    helper: function () {
      return helper
    },
    maxUploadBodySize: function () {
      return this.mbToByte(this.maxUploadBodySizeMB)
    },
    maxFileSize: function () {
      return this.mbToByte(this.maxFileSizeMB)
    },
    minChunkSize: function () {
      return this.mbToByte(this.minChunkSizeMB)
    },
    maxChunkSize: function () {
      return this.maxChunkSizeMB ? this.mbToByte(this.maxChunkSizeMB) : this.maxUploadBodySize
    }
  },

  watch: {
    triggerUpload: function () {
      this.$refs.selectFileInput.click()
    }
  },

  methods: {
    onDzUploadFile (file, xhr, formData) {
      xhr.setRequestHeader(this.getHeaderRequest(), this.helper.getToken())
    },

    getHeaderRequest () {
      const adminDomain = new URL(config.domain)
      const currentURL = new URL(document.referrer || location.origin)
      const isOnAdminDomain = adminDomain.host === currentURL.host
      if (!isOnAdminDomain) {
        return 'GchatToken'
      }

      return 'Authorization'
    },

    onDzUploadProgress (file, progress, bytesSent) {
      this.$emit('actionUploadLesson', {action: 'upload-progress'}, {
        lectureId: file.lectureId,
        lessonUploadId: file.lessonUploadId,
        progress: progress
      })
    },

    onDzSuccess (file, response, error) {
      if (response.is_finished) {
        this.$refs.selectFileInput.value = ''
        file.file_id = response.data.id
        file.storage = response.data.storage
        file.file_type = response.data.type
        file.links = response.data.links
        file.metadata = response.data.metadata

        this.$emit('actionUploadLesson', {action: 'upload-file-success'}, file)
      } else if (!response.success) {
        helper.showMessage(response.message)
      }
    },

    onDzError (file, response, xhr) {
      switch (xhr.status) {
        case 401:
          this.handError(xhr, response)
      }
      file.error = {response, xhr}
      this.$refs.selectFileInput.value = ''
      this.$emit('actionUploadLesson', {action: 'upload-file-error'}, file)
    },

    onDzQueueComplete () {
      this.$emit('actionUploadLesson', {action: 'upload-all-file-success'})
    },

    async handError (error, data) {
      const webLocalStorage = new WebStorage('local')
      const webSessionStorage = new WebStorage('session', false)
      const GCHAT_TOKEN_EXPIRED_CODE = 1109
      if (data.code === GCHAT_TOKEN_EXPIRED_CODE || (data.errors && data.errors.includes(GCHAT_TOKEN_EXPIRED_CODE))) {
        await GchatAuth.refreshToken()
      }
      const gchatToken = GchatAuth.getToken()

      let retry = 0
      if (gchatToken && retry === 0) {
        // retry request with new token
        ++retry
        error.config.headers.GchatToken = gchatToken
        return axios.request(error.config)
      } else {
        // Redirect to log in page if unauthenticated
        let reload = webSessionStorage.get('isReload')
        if (!reload || reload === 'false') {
          webLocalStorage.remove(config.oidc.tokenIamStorage)
          webSessionStorage.set('isReload', true)
          const authRedirectGuardMiddleware = AuthRedirectGuardMiddleware(config.oidc)
          try {
            await authRedirectGuardMiddleware.run(window.location.href)
          } catch (e) {
            // Handle exception here
          }
        }
      }
    },
    onSelectFile () {
      if (this.$refs.selectFileInput.files.length) {
        const file = this.$refs.selectFileInput.files.item(0)

        if (file) {
          const fileType = this.helper.getFileType(file)

          if (!this.accept.includes(fileType)) {
            helper.showMessage(`Vui lòng tải file đúng định dạng PDF, Video, Ảnh!`, 'warning')
            return
          }

          if (fileType === 'video' && file.size > this.maxFileSize) {
            helper.showMessage(`Dung lượng tối đa của file tài liệu dạng video là 2GB. Bạn vui lòng thử lại!`, 'warning')
            return
          }

          if (fileType !== 'video' && file.size > this.maxUploadBodySize) {
            helper.showMessage(`Dung lượng tối đa của file tài liệu văn bản là 100MB. Bạn vui lòng thử lại!`, 'warning')
            return
          }
        }

        this.dropzone.options.chunkSize = this.calculateChunkSize(file.size)

        file.lectureId = this.lectureId
        file.lessonUploadId = this.cur_lesson.uploadId

        this.$emit('actionUploadLesson', {action: 'start-upload'}, file)

        this.dropzone.addFile(file)
      }
    },

    byteToMB (fileSize) {
      return fileSize / 1024 / 1024
    },

    mbToByte (fileSize) {
      return fileSize * 1024 * 1024
    },

    /**
     * @param {Number} fileSize
     * @return {Number}
     */
    calculateChunkSize (fileSize = 0) {
      const maxChunks = this.maxChunksPerFile || 100

      let chunkSize = this.minChunkSize
      let chunkNumbers = Math.ceil(fileSize / chunkSize)

      // Nếu kích thước file nhỏ hơn hoặc bằng kích thước tối thiểu thì không cần chunking
      if (fileSize > this.minChunkSize) {
        // Nếu số lượng chunk lớn hơn maxChunks và chunkSize chưa quá maxChunkSize
        // thì tăng chunkSize để giảm số lượng chunks.

        while (chunkNumbers > maxChunks && chunkSize < this.maxChunkSize) {
          chunkSize *= 2

          chunkNumbers = Math.ceil(fileSize / chunkSize)
        }

        // Đảm bảo kích thước chunk không vượt quá giới hạn
        if (chunkSize > this.maxChunkSize) {
          chunkSize = this.maxChunkSize
        }
      }

      return chunkSize
    }
  }
}

</script>
