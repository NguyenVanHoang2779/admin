<template>
    <div>
        <b-modal size="lg" centered scrollable  header-class="p-2" body-class="p-1" content-class="p-1" id="modal-image-gallery" ref="refImageGallery" :hide-footer="true" :hide-body="true" static>
            <div slot="modal-title">
                Bộ sưu tập ảnh đại diện
            </div>
            <div class="content-gallery-text">
                <span>Ảnh từ bộ sưu tập</span>
            </div>
            <div class="row">
                <div class="col-md-3" v-for="(image, i) in listImage" :key="i">
                    <a class="img-thumbnail margin-top-10" href="javascript:void(0)" >
                        <img v-img="listImage" :src="image.link_path" alt="avatar" style="width: 180px; height: 180px; object-fit: cover" class="img-fluid">
                    </a>
                </div>
            </div>
        </b-modal>
    </div>
</template>
<style src="@/vendor/libs/vue-gallery/vue-gallery.scss" lang="scss"></style>
<style src="@/vendor/libs/v-img/v-img.scss" lang="scss"></style>
<script>
import profileService from 'domain/services/profile-service'
import Vue from 'vue'
import VueImg from 'v-img'

Vue.use(VueImg)

export default {
  name: 'modal-image-gallery',

  components: {
  },

  props: {
    masterProfileId: {
      type: String,
      default: null
    }
  },

  data: () => ({
    listImage: []
  }),

  created () {
  },

  watch: {
    masterProfileId: function () {
      this.listImage = []
      if (this.masterProfileId !== null) this.getGalleryProfile()
    }
  },

  methods: {
    getGalleryProfile () {
      let dataRequest = {
        master_id: this.masterProfileId
      }
      profileService.getGalleryProfile(dataRequest)
        .then(res => {
          if (res.data.success) {
            this.listImage = res.data.data
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
