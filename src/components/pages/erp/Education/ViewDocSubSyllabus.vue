<template>
    <div class="profile-document">
      <template v-for="(lesson, idxPeriodDoc) in lessons || []">
          <div :key="'fileClass-' + idxPeriodDoc" class="profile-document__element">
            <div class="w-100 title-document">
                {{ `${idxPeriodDoc +1}.  ${lesson.title}` }}
            </div>
              <span class="cursor-pointer" @click="openLink(lesson)">
                <img class="image-document" :src="previewLesson(lesson)" :alt="'Tài liệu buổi '+ idxPeriodDoc"/>
              </span>
          </div>
      </template>
    </div>
</template>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'
import trainingUniService from 'domain/services/Erp/HrmUni/training-service'
export default {
  name: 'view-doc-sub-syllabus',

  components: {
  },

  data: _ => ({
    fileResponse: null
  }),

  props: {
    lessons: {
      default () {
        return []
      }
    }
  },

  computed: {
    helper () {
      return helper
    }
  },

  watch: {
  },
  methods: {
    previewLesson (lesson) {
      return lesson.thumbnail
    },
    async openLink (lesson) {
      await this.getLinkFiles(lesson.file_id)
      let url = this.fileResponse[lesson.file_id].gdrive || this.fileResponse[lesson.file_id].direct
      return window.open(url, '_blank')
    },
    async getLinkFiles (fileId) {
      try {
        let param = {}
        param.file_id = [fileId]

        const data = await trainingUniService.getLinkFiles(param)
        if (data.data.success) {
          this.fileResponse = data.data.data
        } else helper.showMessage(data.data.message, 'warning')
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      }
    }
  }
}
</script>
<style scoped>
.profile-document {
    overflow-x: auto;
    overflow-y: hidden;
    height: 100%;
    white-space: nowrap;
    .profile-document__element {
        padding: 10px;
        white-space: normal;
    }
}
.image-document {
    width: 9rem;
    height: 5rem;
    display: inline-block;
    vertical-align: middle;
}

.profile-document__element {
    width: 185px;
    position: relative;
    height: 99%;
    display: inline-block;
}
</style>
