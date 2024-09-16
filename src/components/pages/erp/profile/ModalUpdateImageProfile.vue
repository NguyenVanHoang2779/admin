<template>
    <div>
        <b-modal header-class="p-2" body-class="p-1" content-class="p-1" size="lg" id="modal-update-image-profile" ref="refGalleryProfile" @show="getGalleryProfile" :hide-footer="true" :hide-body="true" static>
            <div slot="modal-title">
                Cập nhật ảnh đại diện
            </div>
            <div class="upload-image-profile">
                <select-file :file-name="fileName" @handlerChooseFile="onChooseImage" @handlerRemoveFile="onRemoveImage"></select-file>
                <button class="btn btn-primary" @click="uploadImage" v-if="imageUpload">Upload</button>
            </div>
            <div class="content-gallery-text">
                <span>Ảnh từ bộ sưu tập</span>
            </div>
            <div class="row">
                <span class="col-3 margin-top-10 position-relative text-center image-in-gallery" md="3" v-for="image in listImage">
                    <b-img :src="image.link_path" style="width: 180px; height: 180px; object-fit: cover" class= "cursor-pointer" alt="avatar"/>
                    <button class="btn btn-primary transfer-main-image"  @click="transferImageProfileFromGallery(image.id)">Đặt làm ảnh đại diện</button>
                    <i class="ion ion-md-star position-absolute main-image" v-if="image.status == 1"></i>
                </span>
            </div>
        </b-modal>
    </div>
</template>

<script>
import profileService from 'domain/services/profile-service'
import SelectFile from 'components/elements/common/SelectFile'

export default {
  name: 'modal-update-image-profile',

  components: {
    SelectFile
  },

  props: [
    'masterId'
  ],

  data: () => ({
    listImage: [],
    fileName: '',
    imageUpload: ''
  }),

  created () {
  },

  watch: {
  },

  methods: {
    onChooseImage ($event) {
      this.imageUpload = $event
      this.fileName = this.imageUpload.name
    },

    onRemoveImage () {
      this.imageUpload = []
      this.fileName = ''
    },

    uploadImage () {
      let formData = new FormData()
      formData.append('file', this.imageUpload)
      formData.append('id', this.masterId)

      profileService.uploadImage(formData)
        .then(res => {
          if (res.data.success) {
            this.$notify({
              group: 'default',
              type: 'text-white bg-primary',
              text: res.data.message
            })
            this.getGalleryProfile()
            this.$emit('updateImageProfile')
            this.imageUpload = ''
            this.fileName = ''
          } else {
            this.$notify({
              group: 'default',
              type: 'text-white bg-warning',
              title: 'Xảy ra lỗi',
              text: res.data.message
            })
          }
        }).catch(e => {
          console.log(e)
        })
    },

    getGalleryProfile () {
      let dataRequest = {
        master_id: this.masterId
      }
      profileService.getGalleryProfile(dataRequest)
        .then(res => {
          if (res.data.success) {
            this.listImage = res.data.data
          }
        }).catch(e => {
          console.log(e)
        })
    },

    transferImageProfileFromGallery (imageId) {
      let data = {
        imageId: imageId
      }
      profileService.transferImageProfileFromGallery(data)
        .then(res => {
          if (res.data.success) {
            this.$notify({
              group: 'default',
              type: 'text-white bg-primary',
              text: res.data.message
            })
            this.getGalleryProfile()
            this.$emit('updateImageProfile')
          } else {
            this.$notify({
              group: 'default',
              type: 'text-white bg-warning',
              title: 'Xảy ra lỗi',
              text: res.data.message
            })
          }
        }).catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
    .margin-top-10 {
        margin-top: 10px !important;
    }

    .main-image {
        color: #26B4FF;
        top: 0;
    }

    .upload-image-profile {
        cursor: pointer;
        text-align: center;
        font-size: 18px;
        font-weight: 500;
        border-bottom: solid 1px #f5f6f7;
        i {
            margin-right: 5px;
        }
    }

    .upload-image-profile:hover {
        background: #f5f6f7;
    }

    .image-in-gallery {
        .transfer-main-image {
            position: absolute;
            top: 87%;
            transform: translateY(-50%) translateX(-50%);
            z-index: -1;
            font-size: 12px;
        }
    }

    .image-in-gallery:hover {
        .transfer-main-image {
            z-index: 999;
        }
    }

    .content-gallery-text {
        padding: 10px 10px 0px 10px;
        color: #8d949e;
    }
</style>
