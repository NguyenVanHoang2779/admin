<template>
  <div>
    <div>
      <div class="mb-1 image-wrap">

        <b-carousel
          ref="profileDocsSlide"
          class="document-carousel-custom"
          style="text-shadow: 1px 1px 2px #333; height: 180px; border: 1px solid #ddd;"
          :background="'#ababab'"
          :interval="40000"
          :controls="true"
          :indicators="true"
          v-viewer
        >

          <b-carousel-slide v-if="showImage" v-for="(url, index) in document.url" :key="`slide-${index}`">
            <template v-if="checkImage(url)" #img>
              <img class="w-100" :src="imageSrc(url)" :alt="document.document_name">
            </template>
            <template v-else #img>
              <img class="w-100 cursor-pointer" @click="openNotImageFile(url)" :src="imageSrc(url)"
                   :alt="document.document_name" onerror="this.src='https://admin.giaohangtietkiem.vn/adm/static/img/pdf.png'">
            </template>
          </b-carousel-slide>

        </b-carousel>

        <div>
          <b-button-group size="sm" class="btn-block mt-1 mb-1" v-if="document.document_id === 58">
              <b-button
                block
                variant="light rounded-0"
                class="mt-0 ghtk-color"
                @click="openFile('.mp4')"
                >
                <span v-if="loadingAction === '.mp4'">
                  <i class="fas fa-spinner fa-pulse text-success ml-auto mr-1"></i>
                </span>
                <span v-else>
                  <i class="fa fa-video"></i> Xem video
                </span>
              </b-button>
              <b-button
                block
                variant="light rounded-0"
                class="mt-0 ghtk-color"
                @click="openFile('.pdf')"
                >
                <span v-if="loadingAction === '.pdf'">
                  <i class="fas fa-spinner fa-pulse text-success ml-auto mr-1"></i>
                </span>
                <span v-else>
                  <i class="fa fa-file-pdf-o"></i> Xem file
                </span>
              </b-button>
          </b-button-group>
          <b-button-group size="sm" class="btn-block mt-1 mb-1" v-else>
            <b-button
              block
              variant="light rounded-0"
              class="mt-0 ghtk-color"
              @click="viewIdentify('identify')"
              >
              <span v-if="loadingAction === 'identify'">
                  <i class="fas fa-spinner fa-pulse text-success ml-auto mr-1"></i>
                </span>
              <span v-else>
                  <i class="fa fa-eye"></i> Lấy ảnh nét
              </span>
            </b-button>
          </b-button-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
import config from 'config/app.base'
import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'
Vue.use(Viewer)

export default {
  components: {Viewer},
  props: {
    document: {}
  },
  data: function () {
    return {
      showImage: true,
      isViewIdentify: false,
      loadingAction: null
    }
  },
  computed: {
    helper () {
      return helper
    }
  },
  mounted () {
  },
  methods: {
    imageSrc (url) {
      if (+this.document.document_id === 58) {
        return 'https://cache.giaohangtietkiem.vn/d/6dfaffd8b31844a380c72b9a191894e5.png'
      }
      if (this.checkPdf(url)) {
        url = config.baseUrl + '/static/img/pdf.png'
      }

      return url
    },

    async openFile (extension) {
      if (extension) {
        await this.viewIdentify(extension)
        if (this.document.url && Array.isArray(this.document.url)) {
          this.document.url.forEach(function (value) {
            if (value && value.includes(extension)) {
              window.open(value, '_blank')
            }
          })
        }
      }
    },

    openNotImageFile (url) {
      window.open(url, '_blank')
    },

    checkImage (url) {
      /* eslint-disable */
      return (url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null)
    },
    checkPdf (url) {
      return (url.match(/\.(pdf|PDF)$/) != null)
    },
    async viewIdentify (action = 'identify') {
      if (this.isViewIdentify) {
        return
      }
      this.loadingAction = action
      console.log(this.document)
      await recruitmentService.realDocument(this.document)
        .then(res => {
          if (res.data.success) {
            this.showImage = false
            this.document.url = res.data.data || this.document.url
            this.showImage = true
            this.isViewIdentify = true
          } else {
            helper.showMessage(res.data.message || 'Lấy ảnh nét thất bại!')
          }
        })
        .catch(e => {
          helper.showMessage(e.message || 'Lỗi xảy ra, vui lòng liên hệ IT để được hỗ trợ!', 'error')
        })
      this.loadingAction = null
    }
  },
  filters: {
    dateFormated (d) {
      return moment(d).format('DD/MM/YYYY')
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
.image-wrap {
  display:inline-block;
  position:relative;
  width: 100%;
}
.button-view {
  font-size: 12px;
  background-color: white;
  padding: 0;
  position:absolute;
  bottom:37px;
  right:0;
}
.button-view:hover{
  background-color: #069255 !important;
}
.action-document button {
  padding: 3px 5px;
  min-width: 70px;
}
.info {
  margin-bottom: 2rem;
}
.images > img {
  width: 100%;
  height: auto;
}
.custom-img{
  width: 100%;
}
.box-action {
  .btn {
    border-radius: 6px;
  }
}
.btn-status-waiting {
  color: #828282;
  background: #ffffff;
  border: 1px solid #828282;
}
.btn-status-waiting:hover {
  background: #B0B0B0;
  color: #ffffff;
}
.btn-status-reject, .btn-outline-ghtk, .btn-status-waiting {
  font-size: 13px;
}
.btn-status-reject {
  border: 1px solid #FFB800;
  color: #FFB800;
  background-color: white;
  outline: none;
}
.btn-status-reject:hover {
  background: #FFB800;
  color: white;
}
</style>
<style>
.document-carousel-custom > .carousel-inner{
  background: white !important;
  height: 100% !important;
}
</style>
