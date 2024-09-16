<template>
  <div>
    <div class="box-user d-flex justify-content-between">
      <div class="d-flex">
        <div class="avt-user">
          <img :src="order.profile_info.image_profile"
               alt="avatar user" width="52" height="52">
        </div>
        <div class="info-user ml-3">
          <div class="info-user-name">
            <b>{{ order.profile_info.fullname }} ({{ order.profile_info.username }})</b>
          </div>
          <div class="info-user-position">
            {{ order.profile_info.position_name }} - {{ order.profile_info.station }}
          </div>
        </div>
      </div>
      <div class="btn-chat">
        <div class="mb-1">
          <b-dropdown v-if="duty" size="md"  variant="link" toggle-class="text-decoration-none" class="p-0 dropdown-action-view" no-caret>
            <template slot="button-content" class="p-0">
              <b-btn variant="outline-ghtk" name='stop-work-btn-view-duty' id='stop-work-btn-view-duty' class="btn-sm">Xem</b-btn>
            </template>
            <b-dropdown-item>
              <a name='stop-work-btn-sos-stop-work' id='stop-work-btn-sos-stop-work' @click="$emit('clickAction', {action: 'view_group_chat', channel_id: order.chat_channel_id})">SOS nghỉ việc</a>
            </b-dropdown-item>
            <b-dropdown-item>
              <a name='stop-work-btn-view-order' id='stop-work-btn-view-order' @click="$emit('clickAction', {action: 'view_order', order_id: order.id})">Xem đề xuất</a>
            </b-dropdown-item>
            <b-dropdown-item>
              <a name='stop-work-btn-view-profile-cod' id='stop-work-btn-view-profile-cod' @click="$emit('clickAction', {action: 'view_profile_cod', data: order.profile_info})" target="_blank">
                Xem profile
              </a>
            </b-dropdown-item>
          </b-dropdown>
          <b-btn variant="outline-ghtk" class="btn-sm" name='stop-work-btn-show-message' id='stop-work-btn-show-message' v-else @click="showMessage()">Xem</b-btn>
        </div>
        <div class="mt-1">
          <b-btn variant="outline-ghtk" class="btn-sm" name='stop-work-btn-call' id='stop-work-btn-call' @click="showModalPhone(order.id)">Gọi</b-btn>
        </div>
      </div>
    </div>
    <div class="mb-1 mt-1 d-flex">
      <div class="text-start-date">
        <b> Ngày bắt đầu nghỉ: <span>{{ formatDate(order.resign_info.resign_date || order.created, 'DD/MM/YYYY') }}</span></b>
      </div>
    </div>
    <div class="btn-tags mb-1 mt-1">
      <div class="d-flex mt-2 content-tag">
        <div class="pl-1 pr-1 mr-1 mb-1 tag-default" v-if="order.status === 'cho_duyet'">
          Chưa duyệt đề xuất
        </div>
        <div class="pl-1 pr-1 mr-1 mb-1 tag-default" v-else-if="!order.check_transfer">
          Chưa thu hồi CCDC
        </div>
        <div v-else-if="!order.check_deposit && order.checkShowDeposit">
          <span class="pl-1 pr-1 mr-1 mb-1 tag-default">Chưa thanh toán cọc</span>
        </div>
        <div v-else-if="!order.checkChotSo">
          <span v-if="!order.checkStatusBHXH" class="pl-1 pr-1 mr-1 mb-1 tag-default">
              Chưa chốt sổ BHXH
          </span>
        </div>
        <div v-if="(order.checkChotSo || order.checkStatusBHXH) && order.check_deposit && !order.statusContract && order.check_transfer">
          <span class="pl-1 pr-1 mr-1 mb-1 tag-default">
              Chưa thanh lý HĐ
          </span>
        </div>
        <div v-for="(tag,idx) in order.fixedTags || []" :key="'fixed_tag' + idx" :style="tag.style" class="d-inline-block pr-2 pl-2 mb-1">{{ tag.name }}</div>
        <template v-for="(tag,idx) in tags">
          <div class="d-inline-block mr-1 mb-1 cursor-pointer position-relative"
               @mouseover="showIcon('iconDeleteTag' + tag.record_id + idx)"
               @mouseout="showIcon('iconDeleteTag' + tag.record_id + idx, 'none')"
               :key="idx"
               @click="onDeleteTag(tag)">

            <div class="d-inline-block tag"
                 :style="JSON.parse(tag.style)">
              {{ tag.name }}
            </div>
            <i class="fa fa-times-circle deleteTag" :id="'iconDeleteTag' + tag.record_id + idx"></i>
          </div>
        </template>
        <span v-if="editableTag" class="d-inline-block cursor-pointer text-ghtk ml-2 align-items-baseline"
              @click="$emit('action', {action: 'tag', data: {}})"><i class="fas fa-plus"></i> Tag</span>
      </div>
    </div>
    <div class="profile-document d-flex">
      <!--  Lấy file đề xuất nghỉ việc   -->
      <template v-for="(documentType, idxType) in order.files" v-if="order.files">
        <div :key="idxType" :class="idxType < 3 ? 'd-inline-block' : 'd-none'" class="position-relative mr-1" v-viewer>
          <div class="document-type-desc" >
            Đơn xin nghỉ việc CT{{ order.id }}
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
      <!-- Lấy file chốt sổ BHXH -->
      <template v-if="order.relate_order">
        <div class="position-relative file-relate mr-1 file-relate" v-if="order.relate_order.files"
             @click="showImage(order.relate_order.files, 'relate')" v-viewer >
          <div class="document-type-desc">
            Sổ BHXH - BH{{ order.relate_order.hrOrder.id }}
          </div>
          <div
            class="num-img-extend"
            v-show="order.relate_order.files.length - 1 > 1"
          >
            +{{ order.relate_order.files.length - 1 }}
          </div>
          <div v-for="(fileRelate, keyFile) in order.relate_order.files">
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
      <template v-if="order.fileContract">
        <div class="position-relative file-contract mr-1" @click="showImage(order.fileContract.file, 'contract')" v-viewer>
          <div class="document-type-desc" >
          Thanh lý HĐ - TL{{ order.fileContract.code }}
          </div>
          <div
            class="num-img-extend"
            v-show="order.fileContract.file.length > 1"
          >
            +{{ order.fileContract.file.length }}
          </div>
          <div v-for="(fileContract, keyFileContract) in order.fileContract.file"
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
      <b-modal :id="'modal-number-phone-' + order.id" title="Gọi ứng viên" centered ref="phone-number" :hide-header-close="true"
               title-class="w-100" header-class="text-center modal-phone" hide-footer size="sm">
        <div class="pl-3">
          <div class="mb-2">
            <b class="font-weight-bold">Họ tên:</b>
            <span>{{ order.profile_info.fullname }}</span>
          </div>
          <div class="mb-2">
            <b class="font-weight-bold">Vị trí:</b>
            <span>{{ order.profile_info.position_name }}</span>
          </div>
          <div>
            <b class="font-weight-bold">Số điện thoại:</b>
            <span class="mb-2">{{ order.profile_info.tel || 'không có số điện thoại'}}</span>
            <span>{{ order.profile_info.tel2 ? ' - ' + order.profile_info.tel2 : '' }}</span>
          </div>
        </div>
        <div class="mt-2 d-flex justify-content-center">
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
import moment from 'moment'

// service
import hrTagService from 'domain/services/hr-tag-service'

export default {
  name: 'InfoUserOrder',
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
    }
  },

  data: () => ({
    isLoading: false,
    listData: [],
    tags: []
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
    showModalPhone (idOrder) {
      this.$bvModal.show('modal-number-phone-' + idOrder)
    },
    closeModalPhone (idOrder) {
      this.$bvModal.hide('modal-number-phone-' + idOrder)
    },
    showIcon (id, display = 'inline-block') {
      document.getElementById(id).style.display = display
    },
    async onDeleteTag (tag) {
      try {
        if (confirm('Bạn có chắc muốn xóa tag ' + tag.name + ' ?')) {
          this.loading = true
          const data = await hrTagService.detach({
            record_id: +tag.record_id,
            table_name: tag.table_name,
            hr_tag_id: +tag.id
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
      border-radius: 20px;
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
  top: -5px;
  right: -5px;
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

.tag-default {
  background: #00904A;
  color: #FFFFFF;
  margin-bottom: 4px;
  text-align: center;
}

span.tag-default {
  padding-top: 1px;
  padding-bottom: 3px;
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
