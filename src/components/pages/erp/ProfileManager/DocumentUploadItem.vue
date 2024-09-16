<template>
  <div>
    <div>
      <!--    Image-->
      <div class="mb-1 image-wrap">

        <b-carousel
          ref="profileDocsSlide"
          class="document-carousel-custom"
          style="text-shadow: 1px 1px 2px #333; height: 250px; border: 1px solid #ddd;"
          :background="'#ababab'"
          :interval="40000"
          :controls="true"
          :indicators="true"
          v-viewer
        >

          <b-carousel-slide v-for="(url, index) in item.ProfileDocument.files" :key="`slide-${index}`">
            <template v-if="checkImage(url)" #img>
              <img class="w-100" :src="imageSrc(url)" :alt="item.ErpDocument.name">
            </template>
            <template v-else #img>
              <img class="w-100" @click="openFile(url)" :src="imageSrc(url)" :alt="item.ErpDocument.name">
            </template>
          </b-carousel-slide>

        </b-carousel>

        <div>
          <b-button-group size="sm" class="btn-block mt-1 mb-1">
            <b-button
              :disabled="!item.ProfileDocument.videos"
              block
              variant="light rounded-0"
              class="mt-0"
              @click="openFile(item.ProfileDocument.videos)"
              v-b-tooltip.focus title="Video">
              <i class="fa fa-video"></i> Xem video
            </b-button>
            <b-button
              :disabled="!item.ErpDocument.private || +item.ProfileDocument.document_id === 58"
              block
              variant="light rounded-0"
              class="mt-0 "
              @click="viewIdentify"
              v-b-tooltip.focus title="Lưu ý - Người xem ảnh sẽ được lưu lại">
              <i class="fa fa-eye"></i> Lấy ảnh nét
            </b-button>
          </b-button-group>
        </div>

        <b-button
          style="height: 2rem;" block
          :variant="variant(item.ProfileDocument.status)"
          size="sm"
          class="rounded"
        >
          {{ item.ProfileDocument.status === 'Từ chối' ? 'Đã từ chối' : item.ProfileDocument.status }}
        </b-button>
      </div>
      <!--    Info-->
      <div class="info">
        <div class="mb-1 text-black"><b>{{ item.ErpDocument.name }}</b></div>
        <div class="mb-1 text-black"><b>Ngày tạo: </b>{{ item.ProfileDocument.created | dateFormated }}</div>
        <div class="mb-1 text-black"><b>Số trang: </b>{{ item.ProfileDocument.num_of_pages }}</div>
<!--        <div v-if="+item.ProfileDocument.document_id === 58" class="mb-1 text-black"><b>Lịch sử nợ xấu 5 năm gần nhất: </b>{{item.ProfileDocument.bad_debt === 1 ? 'Có' : 'Không'}}</div>-->
<!--        <div v-if="+item.ProfileDocument.document_id === 58" class="mb-1 text-black"><b>Hạng: </b>-->
<!--          {{ (typeof optionLevelCredit.filter((a) => +a.id === +item.ProfileDocument.credit_level)[0] === 'undefined') ? 'Đang cập nhật' : optionLevelCredit.filter((a) => +a.id === +item.ProfileDocument.credit_level)[0].name}}-->
<!--        </div>-->

<!--        <div class="mb-1 text-black" v-if="+item.ProfileDocument.document_id === 58"><b>Điểm tín dụng: </b>-->
<!--          {{+item.ProfileDocument.credit_score === -1 ? 'Đang cập nhật' : item.ProfileDocument.credit_score}}-->
<!--        </div>-->
<!--        <div class="mb-1 text-black" v-if="+item.ProfileDocument.document_id === 58"><b>Ngày chấm điểm: </b>-->
<!--          {{item.ProfileDocument.credit_date === '' ? 'Đang cập nhật' : item.ProfileDocument.credit_date}}-->
<!--        </div>-->
        <div v-if="+item.ProfileDocument.document_id === 13">
          <div class="mb-1 text-black"><b>Số bằng: </b>{{ masterProfile.ErpDriverLicense.no_number }}</div>
          <div class="mb-1 text-black"><b>Ngày cấp: </b>
            <span v-if="masterProfile.ErpDriverLicense.beginning_date">{{ masterProfile.ErpDriverLicense.beginning_date | dateFormated }}</span>
          </div>
          <div class="mb-1 text-black"><b>Ngày hết hạn: </b>
            <span v-if="masterProfile.ErpDriverLicense.expiry_date">
              {{ masterProfile.ErpDriverLicense.expiry_date | dateFormated }}
            </span>
            <span v-else>
              {{ masterProfile.ErpDriverLicense.no_number ? 'Vô thời hạn' : '' }}
            </span>
          </div>
          <div class="mb-1 text-black"><b>Hạng bằng: </b>{{ masterProfile.ErpDriverLicense.class }}</div>
        </div>
        <div v-else-if="+item.ProfileDocument.document_id === 60">
          <div class="mb-1 text-black"><b>Biển số xe: </b>{{ item.ErpVehicleRC.head_license_plate }}-{{ item.ErpVehicleRC.tail_license_plate }}</div>
        </div>
        <div v-else-if="+item.ProfileDocument.document_id === 10">
          <div class="mb-1 text-black"><b>Họ tên người bảo lãnh: </b>{{ masterProfile.guardian.fullname}}</div>
          <div class="mb-1 text-black"><b>Mối quan hệ: </b>{{ masterProfile.guardian.relation}}</div>
          <div class="mb-1 text-black"><b>Số CMND/CCCD: </b>{{ masterProfile.guardian.personal_id}}</div>
          <div class="mb-1 text-black"><b>Số điện thoại: </b>{{ masterProfile.guardian.phone}}</div>
        </div>
        <div v-show="['Đã duyệt', 'Từ chối'].includes(item.ProfileDocument.status)">
          <b>{{ item.ProfileDocument.status === 'Đã duyệt' ? 'Người duyệt' : 'Người từ chối' }}:</b>
          <span v-if="item.ProfileDocument.modified_by" class="text-black">
            {{ item.ProfileDocument.modified_by.username }} - {{ item.ProfileDocument.modified_by.position_name }}
          </span>
        </div>
      </div>
    </div>
<!--    Button-->

    <div>
      <b-button-group size="sm" class="btn-block">
        <b-button
          v-if="+item.ProfileDocument.document_id === 58 && item.ProfileDocument.status === 'Đã duyệt'"
          block
          variant="outline-ghtk"
          class="mt-0"
          @click="showCicDetail(item)"
        >Chi tiết</b-button>

        <b-button
          v-if="item.ProfileDocument.status === 'Chưa duyệt'"
          block
          variant="outline-ghtk"
          class="mt-0"
          @click="approve(item, true)"
        >Duyệt</b-button>

        <b-button
          v-if="item.ProfileDocument.status === 'Chưa duyệt'"
          block
          variant="status-waiting"
          class="mt-0"
          @click="approve(item, false)"
        >Từ chối</b-button>

        <b-button
          v-if="canRejectDocument"
          block
          variant="outline-danger"
          class="mt-0"
          @click="remove(item.ProfileDocument.id)"
        >Hủy</b-button>
      </b-button-group>
    </div>

  </div>
</template>

<script>
import {optionLevelCredit} from './OptionConst'
import moment from 'moment'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
import pdf from 'vue-pdf'
import profileService from 'domain/services/profile-service'
import config from 'config/app.base'

// helper
import helper from 'infrastructures/helpers/common-helpers'
Vue.use(Viewer)

export default {
  components: {Viewer, pdf},
  props: {
    permissions: {},
    item: {},
    masterProfile: {},
    closingShiftLayout: {
      default: false
    },
    authUserDutyId: null
  },
  data: function () {
    return {
      optionLevelCredit,
      privateUrls: []
    }
  },
  computed: {
    helper () {
      return helper
    },

    canRejectDocument () {
      return (this.item.ProfileDocument.status !== 'Đã duyệt' || this.permissions.delete_approved_doc)
    }
  },
  mounted () {
  },
  methods: {
    imageSrc (url) {
      if (+this.item.ProfileDocument.document_id === 58) {
        return 'https://cache.giaohangtietkiem.vn/d/6dfaffd8b31844a380c72b9a191894e5.png'
      }
      if (this.checkPdf(url)) {
        url = config.baseUrl + '/static/img/pdf.png'
      }

      return url
    },

    async openFile (url) {
      if (this.item.ErpDocument.private && !this.privateUrls[url]) {
        this.privateUrls[url] = await this.getClearPath(url)
      }

      if (this.privateUrls[url]) {
        url = this.privateUrls[url]
      }

      if (url) {
        window.open(url, '_blank')
      }
    },
    async getClearPath (path) {
      if (path.includes('https://') || path.includes('http://')) {
        path = (new URL(path)).pathname
      }

      const {data} = await profileService.apiGetClearFile({path: path})

      return data.data
    },
    variant (status) {
      switch (status) {
        case 'Chưa duyệt':
          return 'status-waiting'
        case 'Đã duyệt':
          return 'outline-ghtk'
        case 'Từ chối':
          return 'status-reject'
        default:
          return ''
      }
    },

    showCicDetail (profileDocument) {
      this.$emit('showCicDetail', profileDocument)
    },

    approve (doc, status) {
      this.$emit('approve', {doc, status})
    },
    checkImage (url) {
      /* eslint-disable */
      return (url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null)
    },
    checkPdf (url) {
      return (url.match(/\.(pdf|PDF)$/) != null)
    },
    remove (id) {
      this.$emit('remove', id)
    },
    async viewIdentify () {
      const {data} = await profileService.getOriginImage({urls: this.item.ProfileDocument.files})
      if (data.success) {
        this.item.ProfileDocument.files = data.urls.map(item => item.path)
      }
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
