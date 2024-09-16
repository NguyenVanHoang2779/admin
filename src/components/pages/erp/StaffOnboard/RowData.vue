<template>
  <tr v-if="profile.hide_data || actionSearch">
    <!-- staff info  -->
    <td class="border-right">
      <div class="">
        <div class="position-relative profile-info" v-viewer>
          <div class="d-flex justify-content-between">
            <div class="d-flex justify-content-start">
              <div class="mr-2">
                <img :src="profile.avatar" alt="" class="rounded-circle" width="50" height="50" />
              </div>
              <div>
                <b>{{ profile.fullname }} ({{ profile.username || profile.personal_id }})</b> <br>
                <span>{{ profile.position_name }} - {{ profile.station_name }}</span> <br>
              </div>
            </div>
            <div>
              <button class="w-100 btn btn-outline-ghtk btn-sm btn-pill mb-1" name="row-data-btn-view-profile" id="row-data-btn-view-profile" @click="$emit('action', {action: 'view_profile', data: {}})">Xem</button>
              <br/>
              <button class="w-100 btn btn-outline-ghtk btn-sm btn-pill" name="row-data-btn-action-phone" id="row-data-btn-action-phone" @click="$emit('action', {action: 'phone', data: {}})">Gọi</button>
            </div>
          </div>
        </div>
        <div class="expected-join-time mb-1">
          <b class="text-ghtk">Hẹn nhận việc:
            {{ profile.comeback_date ? formatDate(profile.comeback_date, 'DD/MM/YYYY') :
              (profile.join_date ? formatDate(profile.join_date, 'DD/MM/YYYY') : null) }}
          </b>
        </div>
        <div class="mt-2">
          <div v-for="(tag,idx) in profile.fixedTags || []" :key="'fixed_tag' + idx" :style="tag.style" class="d-inline-block pr-2 pl-2 mb-1">{{ tag.name }}</div>
          <template v-for="(tag,idx) in profile.tags">
            <div class="d-inline-block mr-1 cursor-pointer position-relative"
                 @mouseover="showIcon('iconDeleteTag' + tag.record_id + idx)"
                 @mouseout="showIcon('iconDeleteTag' + tag.record_id + idx, 'none')"
                 :key="idx"
                 @click="onDeleteTag(tag)"
            >
              <div class="d-inline-block tag pr-2 pl-2"
                   :style="JSON.parse(tag.style)"
              >
                {{ tag.name }}
              </div>
              <i class="fa fa-times-circle deleteTag" :id="'iconDeleteTag' + tag.record_id + idx"></i>
            </div>
          </template>
          <span v-if="editableTag" class="d-inline-block cursor-pointer text-ghtk ml-2" name="row-data-btn-new-tag" id="row-data-btn-new-tag" @click="$emit('action', {action: 'tag', data: {}})"><i class="fas fa-plus"></i> Tag</span>
        </div>
        <div class="profile-document mt-1">
          <template v-for="(documentType, idxType) in profile.documents.file_documents">
            <div :key="idxType" :class="(idxType < show_num_doc_type || show_doc_type_extend) ? 'd-inline-block' : 'd-none'" class="position-relative mr-1 mb-1" v-viewer>
              <div class="document-type-desc">
                {{ documentType.document_name }}
              </div>
              <div
                class="num-img-extend"
                v-show="numImageExtend && !show_doc_type_extend && idxType === show_num_doc_type - 1"
                @click="show_doc_type_extend = !show_doc_type_extend"
              >
                +{{ numImageExtend }}
              </div>
              <template v-for="(files, idxUpload) in documentType.files">
                <template v-for="(link, idxLink) in files.links">
                  <span :key="idxUpload + '_' + idxLink">
                    <img
                      v-if="isImage(link)"
                      :class="(idxLink || idxUpload) && 'd-none'"
                      class="image-document"
                      @click="documentType.document_name === 'CMND/CCCD' ? $emit('action', {action: 'view_document_list', data: {doc_idx: idxType}}) : ''"
                      :src="link"
                      alt=""
                    />
                    <span
                      class="image-document"
                      v-if="isPdf(link)"
                      :class="(idxLink || idxUpload) && 'd-none'"
                      @click="$emit('action', {action: 'view_file_pdf', data: {name: documentType.document_name,link: link}})"
                    >
                      <pdf :src="link" class="view-pdf"></pdf>
                    </span>
                  </span>
                </template>
              </template>
            </div>
          </template>
          <span v-show="show_doc_type_extend" class="img-collapse cursor-pointer" @click="show_doc_type_extend = !show_doc_type_extend">
            <i class="fas fa-angle-up icon-collapse text-ghtk-hover"></i>
          </span>
        </div>
      </div>
    </td>
    <!-- onboard status, logs, ..  -->
    <td class="border-right">
      <OnboardLine
        :onboardStatus="profile.onboard_status"
        :handlers="profile.handlers"
        :master-profile-id="profile.id"
        itemClass="pb-2"
        @action="action"
        :contentStyle="{'padding-left': '0.5rem', 'width': '40%'}"
      />
      <div class="mt-2 mb-1">
        <b>Chi tiết log</b>
<!--        <i>(Cập nhật {{ formatDate(profile.update_time, 'HH:mm') }})</i>-->
      </div>
      <LogLine
        :logs="profile.logs"
      />
    </td>
    <!-- action  -->
    <td class="text-center">
      <div v-if="!profile.hideAction" class="onboard-action">
        <button
          @click="$emit('action', {action: 'note' || null, data: {}})"
          class="btn btn-sm btn-outline-ghtk btn-pill w-51 mb-1"
          id="row-data-btn-note"
          name="row-data-btn-note"
          v-if="showAction"
        >
          Ghi chú
        </button>
        <button
          v-for="(action, idx) in profile.actions || []"
          :key="idx"
          @click="$emit('action', {action: action.alias || null, data: {}})"
          class="btn btn-sm btn-outline-ghtk btn-pill w-51 mb-1"
          :id="'row-data-btn-action-' + action.alias"
          :name="'row-data-btn-action-' + action.alias"
        >
          {{ action.desc }}
        </button>
        <button
          v-if="profile.can_handover"
          @click="$emit('action', {action: 'handover_staff' || null, data: {}})"
          class="btn btn-sm btn-outline-ghtk btn-pill w-51 mb-1"
          id="row-data-btn-handover-staff"
          name="row-data-btn-handover-staff"
        >
          Bàn giao NS
        </button>
        <a href="/admin/modules/listChildModules" target="_blank"
            v-if="profile.can_attach_group"
            class="btn btn-sm btn-outline-ghtk btn-pill w-51 mb-1"
          >
            Gán nhóm
        </a>
        <button
          v-if="profile.can_reject"
          @click="$emit('action', {action: 'reject' || null, data: {}})"
          class="btn btn-sm btn-outline-danger btn-pill w-51 mb-1"
          id="row-data-btn-reject"
          name="row-data-btn-reject"
        >
          Từ chối
        </button>
        <button
          v-if="profile.can_action_explain"
          @click="$emit('action', {action: 'showModalExplainOnboard' || null, data: {}})"
          class="btn btn-sm btn-outline-danger btn-pill w-51 mb-1"
        >
          Giải trình
        </button>
      </div>
    </td>
  </tr>
</template>

<style scoped lang="scss">
.view-pdf {
  position: unset !important;
}
.image-document {
  width: 65px;
  height: 92px;
  display: inline-block;
  border: 1px solid #ccc;
  vertical-align: middle;
}
.w-51 {
  width: 51% !important;
}
.deleteTag {
  position: absolute;
  top: -5px;
  right: -5px;
  color: black;
  display: none;
}
.document-type-desc {
  text-align: center;
  font-size: xx-small;
  color: white;
  background-color: rgba(0, 0, 0, 0.64);
  width: 100%;
  position: absolute;
  bottom: 0;
  pointer-events: none;
}
.num-img-extend {
  text-align: center;
  font-size: initial;
  color: white;
  background-color: rgba(0, 0, 0, 0.47);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  cursor: pointer;
}
.icon-collapse {
  transform: rotate(-90deg);
  font-size: xx-large;
  color: #aaa;
}
</style>

<script>
// custom component
import OnboardLine from './OnboardLine.vue'
import LogLine from './LogLine.vue'

// helper
import helper from 'infrastructures/helpers/common-helpers'
// service
import hrTagService from 'domain/services/hr-tag-service'

// entities

// library
import { mapGetters } from 'vuex'
import Vue from 'vue'
import pdf from 'vue-pdf'
import Viewer from 'v-viewer'
Vue.use(Viewer)

export default {
  name: 'row-data',

  components: {
    OnboardLine,
    LogLine,
    pdf
  },

  props: {
    profile: {
      type: Object,
      default: _ => ({})
    },
    editableTag: {
      default: true
    },
    actionSearch: {
      default: false
    },
    showAction: {
      type: Boolean,
      default: true
    }
  },

  data: _ => ({
    show_num_doc_type: 3,
    show_doc_type_extend: false
  }),

  computed: {
    ...mapGetters({
      curUser: 'userInfo'
    }),

    numImageExtend () {
      return this.profile.documents.num_document_type > this.show_num_doc_type ? this.profile.documents.num_document_type - this.show_num_doc_type : 0
    }
  },

  methods: {
    action (data) {
      this.$emit('action', data)
    },

    formatDate (date, format = 'DD-MM-YYYY HH:mm:ss') {
      return helper.formatDate(date, format)
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
            let log = {
              ...data.data.log
            }
            this.$emit('action', {action: 'deleteTag', data: tag, log: log})
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

    showIcon (id, display = 'inline-block') {
      document.getElementById(id).style.display = display
    },

    isImage (file) {
      return helper.getFileType(file) === 'image'
    },

    isPdf (file) {
      return helper.getFileType(file) === 'pdf'
    }
  }
}
</script>
