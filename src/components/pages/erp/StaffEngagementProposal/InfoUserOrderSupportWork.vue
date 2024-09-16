<template>
  <div>
    <div class="box-user d-flex justify-content-between">
      <div class="d-flex">
        <div class="avt-user" v-if="order.user && order.user.master_profile && order.user.master_profile.image_profile">
          <img :src="order.user.master_profile.image_profile"
               alt="avatar user" width="52" height="52">
        </div>
        <div class="info-user ml-3" v-if="order.user && order.user.position && order.user.position.position_name">
          <div class="info-user-name">
            <b>{{ ConvertName(order.user.fullname) }} ({{ order.user.username || '' }})</b>
          </div>
          <div class="info-user-position">
            {{ order.user.position.position_name || ''}} - {{ order.user.station.name || '' }}
          </div>
        </div>
      </div>
    </div>
    <div class="btn-chat mb-2 mt-2 d-flex">
      <div class="mt-1 mr-2">
        <b-dropdown v-if="duty" size="md"  variant="link" toggle-class="text-decoration-none" class="p-0 dropdown-action-view" no-caret>
          <template slot="button-content" class="p-0">
            <b-btn variant="outline-ghtk" name='stop-work-btn-view-duty' id='stop-work-btn-view-duty' class="btn-sm" style="border-radius: 1rem !important;">Xem</b-btn>
          </template>
          <b-dropdown-item>
            <a name='stop-work-btn-sos-stop-work' id='stop-work-btn-sos-stop-work' @click="$emit('clickAction', {action: 'view_group_chat', channel_id: order.fields.channel_id || ''})">Group chat</a>
          </b-dropdown-item>
          <b-dropdown-item>
            <a name='stop-work-btn-view-profile-cod' id='stop-work-btn-view-profile-cod' @click="$emit('clickAction', {action: 'view_profile_cod', data: order.user_id || {}})" target="_blank">
              Profile nhân viên
            </a>
          </b-dropdown-item>
<!--          <b-dropdown-item>-->
<!--            <a name='stop-work-btn-view-order' id='stop-work-btn-view-order' @click="$emit('clickAction', {action: 'view_order', order_id: order.order_catalog_id})">Đề xuất nghỉ việc</a>-->
<!--          </b-dropdown-item>-->
        </b-dropdown>
        <b-btn variant="outline-ghtk" class="btn-sm" name='stop-work-btn-show-message' id='stop-work-btn-show-message' v-else @click="showMessage()" style="border-radius: 1rem !important;">Xem</b-btn>
      </div>
      <div class="mt-1 mr-2">
        <b-btn :disabled="loadingPhone" variant="outline-ghtk" class="btn-sm" name='stop-work-btn-call' id='stop-work-btn-call' @click="showModalPhone(order.id, order.user_id)" style="border-radius: 1rem !important;">Gọi</b-btn>
      </div>
      <div class="mt-1 mr-2">
        <b-btn variant="outline-ghtk" class="btn-sm" name='stop-work-btn-call' id='stop-work-btn-call' @click="$emit('showModal', {type: 'note', data: indexRow})" style="border-radius: 1rem !important;">Ghi chú</b-btn>
      </div>
      <div class="mt-1 mr-2">
        <b-btn variant="outline-ghtk" class="btn-sm" name='stop-work-btn-call' id='stop-work-btn-call' @click="$emit('showModal', {type: 'notice', data: indexRow})" style="border-radius: 1rem !important;">Thông báo nghỉ</b-btn>
      </div>
    </div>
    <div class="mb-1 mt-1 d-flex">
      <div class="text-start-date">
        <b v-if="order.resign_order"> Ngày bắt đầu nghỉ: <span>{{ formatDate(order.resign_order.resign_info.resign_date || order.resign_order.created, 'DD/MM/YYYY') }}</span></b>
        <b v-else> Ngày tạo: <span>{{ formatDate(order.created_at, 'DD/MM/YYYY') }}</span></b>
      </div>
    </div>
    <div class="btn-tags mb-1 mt-1">
      <div class="mt-2 content-tag">
        <div v-if="order.status === 'da_huy'"><span class="pl-1 pr-1 mr-1 mb-1 tag-danger">Đã hủy đề xuất</span></div>
        <div v-else>
          <div v-if="order.resign_order && order.resign_order.resign_info">
            <span v-if="order.resign_order.resign_info.resign_type === 'nghi_ngang'" class="pl-1 pr-1 mr-1 mb-1 tag-default"> Nghỉ ngang </span>
            <span v-if="order.resign_order.resign_info.resign_type === 'nghi_truoc_han'" class="pl-1 pr-1 mr-1 mb-1 tag-default"> Nghỉ trước hạn </span>
            <span v-if="order.resign_order.resign_info.resign_type === 'nghi_dung_quy_trinh'" class="pl-1 pr-1 mr-1 mb-1 tag-default"> Nghỉ đúng quy trình </span>
          </div>
          <div v-else-if="order.result_text"><span class="pl-1 pr-1 mr-1 mb-1 tag-default"> {{ order.result_text }} </span></div>
          <div v-else><span class="pl-1 pr-1 mr-1 mb-1 tag-default">Yêu cầu hỗ trợ để tiếp tục gắn bó</span></div>
          <div v-for="(tagDanger, idTag) in order.problems" :id="idTag" v-if="order.problems">
            <span class="pl-1 pr-1 mr-1 mb-1 tag-default tag-default-v2">{{ tagDanger.category_name }}</span>
          </div>
        </div>
        <div v-for="(tag,idx) in order.fixedTags || []" :key="'fixed_tag' + idx" :style="tag.style" class="d-inline-block pr-2 pl-2 mb-1">{{ tag.name }}</div>
        <template v-for="(tag,idx) in tags">
          <div class="d-inline-block mb-1 cursor-pointer position-relative"
               @mouseover="showIcon('iconDelelteTag' + tag.record_id + idx)"
               @mouseout="showIcon('iconDelelteTag' + tag.record_id + idx, 'none')"
               :key="idx"
               @click="onDeleteTag(tag)">
              <span class="pl-1 pr-1 mr-1 mb-1 tag-default tag-default">{{ tag.name }}</span>
            <i class="fa fa-times-circle deleteTag" :id="'iconDelelteTag' + tag.record_id + idx"></i>
          </div>
        </template>
        <span v-if="editableTag" class="d-inline-block cursor-pointer text-ghtk align-items-baseline"
              @click="$emit('action', {action: 'tag', data: {}})"><i class="fas fa-plus"></i> Tag</span>
      </div>
    </div>
    <div class="profile-document d-flex">
      <!--  Lấy file đề xuất nghỉ việc   -->
      <div v-if="order.resign_order && order.resign_order.files">
      <template v-for="(documentType, idxType) in order.resign_order.files || []">
        <div :key="idxType" :class="idxType < 3 ? 'd-inline-block' : 'd-none'" class="position-relative mr-1" v-viewer>
          <div class="document-type-desc" >
            Đơn xin thôi việc CT{{ order.resign_order.id || '' }}
          </div>
          <div
            class="num-img-extend"
            v-show="documentType.num_file > 1"
          >
            +{{ documentType.num_file - 1 }}
          </div>
          <template v-for="(files, idxUpload) in documentType.file_exist">
            <img
              :class="(idxUpload || idxType) && 'd-none'"
              class="image-document"
              width="108"
              height="150"
              :key="idxType + '_' + idxUpload"
              :src="files.link"
              alt=""
            />
          </template>
        </div>
      </template>

      </div>
      <!-- Lấy file chốt sổ BHXH -->
      <template v-if="order.resign_order && order.resign_order.orderInsurance">
        <div class="position-relative file-relate mr-1 file-relate" v-if="order.resign_order && order.resign_order.orderInsurance.files"
             @click="showImage(order.resign_order.orderInsurance.files, 'relate')" v-viewer >
          <div class="document-type-desc">
            Sổ BHXH - BH{{ order.resign_order.orderInsurance.hrOrder.id }}
          </div>
          <div
            class="num-img-extend"
            v-show="order.resign_order.orderInsurance.files.length - 1 > 1"
          >
            +{{ order.resign_order.orderInsurance.files.length - 1 }}
          </div>
          <div v-for="(fileRelate, keyFile) in order.resign_order.orderInsurance.files">
            <b-img
              :class="(keyFile) && 'd-none'"
              class="image-document"
              width="108"
              height="150"
              :key="keyFile"
              :src="fileRelate"
              alt="file chốt sổ BHXH"
            />
          </div>
        </div>
      </template>

      <!--  lấy file thanh lý hợp đồng    -->
      <template v-if="order.resign_order && order.resign_order.fileContract">
        <div class="position-relative file-contract mr-1" @click="showImage(order.resign_order.fileContract.file, 'contract')" v-viewer>
          <div class="document-type-desc" >
          Thanh lý HĐ - TL{{ order.resign_order.fileContract.code }}
          </div>
          <div
            class="num-img-extend"
            v-show="order.resign_order.fileContract.file.length > 1"
          >
            +{{ order.resign_order.fileContract.file.length }}
          </div>
          <div v-for="(fileContract, keyFileContract) in order.resign_order.fileContract.file"
               @click="openLink(fileContract, 'contract')" class="box-file-contract">
            <b-img
              :class="(keyFileContract) && 'd-none'"
              class="image-document-contract"
              width="108"
              height="150"
              :key="keyFileContract"
              :src="fileContract"
              frameborder="0"
              title="File thanh lý hợp đồng"
            />
          </div>
        </div>
      </template>
    </div>
    <!--  Modal call  -->
    <div>
      <b-modal :id="'modal-number-phone-' + order.id"
               title="Gọi ứng viên" centered ref="phone-number"
               modal-class="modal-phone-cus"
               title-class="w-100"
               header-class="text-center modal-phone"
               hide-footer size="sm">
        <div class="pl-3">
          <div class="mb-2">
            <b class="font-weight-bold">Họ tên:</b>
            <span>{{ order.user.fullname }}</span>
          </div>
          <div class="mb-2">
            <b class="font-weight-bold">Vị trí:</b>
            <span v-if="order.user && order.user.position && order.user.position.position_name">{{ order.user.position.position_name || '' }}</span>
          </div>
          <div>
            <b class="font-weight-bold">Số điện thoại:</b>
            <i v-show="loadingPhone" class="fas fa-spinner fa-pulse loading-phone mr-2"></i>
            <span v-show="!loadingPhone" class="mb-2">{{ phoneNumber || 'không có số điện thoại'}}</span>
          </div>
        </div>
        <div class="mt-3 d-flex justify-content-center">
          <b-btn class="btn text-white btn__close-modal-phone font-weight-bold" @click="closeModalPhone(order.id)">
            Đóng
          </b-btn>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>

// helper
import helper from 'infrastructures/helpers/common-helpers'
import userService from '../../../../domain/services/user-service'
import moment from 'moment'

// service
import hrTagService from 'domain/services/hr-tag-service'

export default {
  name: 'InfoUserOrderResignWork',
  props: {
    order: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: Object,
      default: () => ({})
    },
    duty: {
      default: true
    },
    tableName: {
      type: String
    },
    updateVal: {
      type: Object
    },
    editableTag: {
      default: true
    },
    indexRow: {
      default: null
    }
  },

  data: () => ({
    isLoading: false,
    listData: [],
    tags: [],
    phoneNumber: null,
    loadingPhone: false
  }),

  watch: {
    order: {
      immediate: true,
      handler: function (newVal) {
        if (newVal && newVal.tags) this.tags = newVal.tags
      },
      updateVal: {
        immediate: true,
        handler: function (newVal) {
          if (newVal && newVal.field === 'tag') this.tags = newVal.data
        }
      }
    }
  },

  methods: {
    formatDate (date, format) {
      return moment(date || null).format(format || 'DD-MM-YYYY')
    },
    showModalPhone (orderId, userId) {
      this.getPhoneNumberByUserId(userId)
      this.$bvModal.show('modal-number-phone-' + orderId)
    },
    closeModalPhone (orderId) {
      this.phoneNumber = null
      this.$bvModal.hide('modal-number-phone-' + orderId)
    },
    showIcon (id, display = 'inline-block') {
      document.getElementById(id).style.display = display
    },

    async getPhoneNumberByUserId (userId) {
      try {
        this.loadingPhone = true
        const res = await userService.getPhoneByUserId({user_id: userId})
        if (res.data.success) {
          this.phoneNumber = res.data.data.tel || ''
        } else {
          helper.showMessage(res.data.message || 'Không lấy được số điện thoại của user', 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingPhone = false
      }
    },
    async onDeleteTag (tag) {
      try {
        if (confirm('Bạn có chắc muốn xóa tag ' + tag.name + ' ?')) {
          this.loading = true
          const data = await hrTagService.detach({
            record_id: +tag.record_id,
            table_name: tag.table_name,
            hr_tag_id: +tag.hr_tag_id
          })
          if (data.data.success) {
            this.tags = this.tags.filter(x => {
              return +x.id !== +tag.id
            })
            this.order.tags = this.tags
            this.$emit('clickAction', {action: 'refreshHrTag'})
            helper.showMessage(data.data.message || 'Bỏ gắn tag thành công!', 'success')
          } else {
            helper.showMessage(data.data.message, 'warning')
          }
        }
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    showMessage () {
      helper.showMessage('Bạn không có quyền xem thông tin!', 'warning')
    },
    openLink (file, type) {
      var typeFile = file.split('.').pop()
      if (['pdf', 'docx'].includes(typeFile)) {
        window.open(file)
      } else {
        const viewer = this.$el.querySelector('.file-' + type).$viewer
        viewer.show()
      }
    },
    ConvertName (str) {
      return str.length > 0 ? str.split(' ').map(w => w.toLowerCase().charAt(0).toUpperCase() + w.toLowerCase().slice(1)).join(' ') : ''
    },
    showImage (files, type) {
      var number = files.length
      if (number === 1 || files[1] === '') {
        this.openLink(files[0], type)
      } else {
        for (var i = 0; i < number; i++) {
          this.openLink(files[i], type)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .modal-phone-cus {
  .modal-header {
    height: 3rem !important;
  }
  .modal-body {
    padding: 1rem !important;
  }
  .modal-title {
    line-height: 0.7 !important;
  }
  .close {
    display: inline-block !important;
    font-size: 1.5rem !important;
  }
}

img {
  object-fit: cover;
}
.num-img-extend {
  pointer-events: none;
  text-align: center;
  font-size: unset;
  color: white;
  background-color: rgba(0, 0, 0, 0.47);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-header {
  justify-content: center !important;
  .close {
    display: none !important;
  }
}

.box-user {
  .avt-user {
    img {
      border-radius: 50%;
    }
  }

  .info-user {
    color: #000000;
    .info-user-position, .info-user-name {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .btn-chat {
    .btn {
      border-radius: 1rem;
      width: 100%;
    }
  }
}

.btn__close-modal-phone {
  border-radius: 5px;
  background: #00904A;
  font-weight: bold;
}

.deleteTag {
  position: absolute;
  top: -4px;
  right: 0px;
  color: black;
  display: none;
}

.tag {
  display: inline-block;
  padding: 0 0.25rem;
}

.content-detail-log {
  padding-top: 10px;
}

.info-user-position {
  font-weight: 500;
}

b {
  font-weight: 500;
}

.text-start-date {
  color: #069255;
}
.image-document {
  cursor: pointer;
}

.modal-phone {
  display: flex !important;
  align-items: center !important;
  .modal-dialog{
    width: 100% !important;
  }
  b {
    color: #000000 !important;
  }
  span {
    font-weight: 500 !important;
    color: #000000 !important;
  }
}

.tag-default{
  background: #00904A;
  color: #FFFFFF;
  margin-bottom: 4px;
  text-align: center;
}

.tag-default-v2 {
  background: #F2994A !important;
  text-align: inherit !important;
}

.tag-danger {
  background: #bb1717;
  color: #FFFFFF;
  margin-bottom: 4px;
  text-align: center;
}

span.tag-default {
  display: inline-block;
  padding: 0.15rem;
  font-size: 0.8rem;
  border-radius: 6px;
}

.document-type-desc {
  text-align: center;
  font-size: 8px;
  color: white;
  background: rgba(0, 0, 0, 0.64);
  width: 100%;
  position: absolute;
  bottom: 0;
  pointer-events: none;
  height: 1.5rem;
  padding-top: 0.4rem;
  .box-file-contract {
    height: 100%;
  }
}

.content-tag {
  flex-wrap: wrap;
}

.dropdown-action-view {
  ul {
    li:hover {
      background-color: #20A286;
    }
    li {
      display: flex;
      align-items: center;
      padding-right: 20px;
      .dropdown-item:focus {
        background-color: #20A286;
      }
    }
    li:after {
      display: inline-block;
      width: 7px;
      height: 7px;
      vertical-align: 0.357em;
      content: "";
      border: 1px solid;
      border-top: 0;
      border-left: 0;
      -webkit-transform: rotate(
          -45deg);
      transform: rotate(
          -45deg);
    }
  }
}
</style>
