<template>
    <tr>
      <td class="pt-3">
        <InfoUser :masterProfile="masterProfile" @eventViewProfile="viewProfile(masterProfile)" @eventViewPhone="viewPhone(masterProfile)"></InfoUser>
      </td>
      <td class="pt-3 small-scrollbar">
        <div class="row">
          <div class="button-slide-document p-0 col-md position-relative text-center">
            <span @click="switchBlock('pre')"  v-if="start > 0"  class="fas fa-chevron-left position-absolute" style="top: 50%; margin-left: -5px" aria-hidden="true"></span>
          </div>
          <div class="data-document-scroll col-md p-0" style="min-width: 90%; max-width: 90%">
            <div class="data-document" :class="{'pr-2': (key+1) % step !== 0}" v-for="(value, key) in documents" v-if="key >= start && key < start + step">
              <DocumentUploadItem
                :key="`upload-item-${key}`" :item="value"
                :masterProfile="masterProfile"
                @approve="approve"
                @remove="remove"
                :permissions="permissions"
                @showCicDetail="showCicDetail"
              >
              </DocumentUploadItem>
            </div>
          </div>
          <div class="button-slide-document col-md p-0 position-relative text-center">
              <span @click="switchBlock('next')" v-if="(start + step) < documents.length" class="fas fa-chevron-right position-absolute" style="top: 50%; margin-left: -15px" aria-hidden="true"></span>
          </div>
        </div>
      </td>
      <td class="text-center box-btn-action">
        <b-button v-if="masterProfile.has_pending_doc" class="btn btn-outline-ghtk mb-2" @click="approveAll(masterProfile.has_duplicated_doc, masterProfile.has_cic_doc_pending)" :disabled="masterProfile.has_duplicated_doc"> Duyệt tất cả </b-button>
        <b-button v-if="masterProfile.has_pending_doc" class="btn btn-outline-ghtk btn-outline-danger mb-2" @click="refuseAll(masterProfile.master_profile_id, masterProfile.user_id)">Từ chối tất cả</b-button>
        <b-button class="btn btn-outline-ghtk mb-2" @click="sendChat(masterProfile.master_profile_id, masterProfile.user_id, masterProfile.position_id)">Gửi chat</b-button>
      </td>
    </tr>
</template>

<style scoped lang="scss">
.data-document-scroll {
  display: flex;
}
.data-document-scroll .data-document {
  position: relative;
}
.data-document {
  max-width: 33.33333%;
  min-width: 33.33333%;
}
.button-slide-document {
  min-width: 5%;
  flex-grow: 0 !important;
}
.button-slide-document span {
  color: #858585;
  font-size: 35px;
}

.button-slide-document span:hover {
  color: #b2b2b2;
  cursor: pointer;
}
.small-scrollbar::-webkit-scrollbar {
  height: 3px;
  width: 3px;
}
.box-btn-action {
  .btn {
    width: 90%;
    border-radius: 30px;
    padding: 1px;
  }
}
</style>

<script>
// custom component
import InfoUser from './InfoUser'
import DocumentUploadItem from './DocumentUploadItem'
import commonHelper from 'infrastructures/helpers/common-helpers'

import profileService from 'domain/services/profile-mamanger-service'

import ManageListCod from 'domain/entities/ManageListCod'

// helper

export default {
  name: 'row-data',

  components: {
    InfoUser,
    DocumentUploadItem
  },

  props: {
    permissions: {},
    documents: {},
    masterProfile: {},
    slideStart: null
  },

  data () {
    return {
      start: 0,
      step: 3,
      dataUpdate: []
    }
  },
  watch: {
    slideStart: function (newVal) {
      if (this.slideStart !== null) {
        this.start = this.slideStart
      }
    }
  },
  computed: {
  },

  mounted () {
  },

  created () {
  },
  methods: {
    viewProfile (profile) {
      ManageListCod.redirectProfile(profile.group_id, profile.user_id, profile.master_profile_id)
    },
    viewPhone (masterProfile) {
      this.$emit('eventViewPhone', masterProfile)
    },
    getDocumentIds () {
      let documentIds = []
      this.documents.forEach(function (document) {
        documentIds.push(document.ProfileDocument.id)
      })
      return documentIds
    },
    approveAll (hasDuplicatedDoc, hasCicDocPending) {
      if (hasCicDocPending) {
        this.$emit('eventHaveCicPending')
        return false
      }
      if (hasDuplicatedDoc) {
        return false
      }

      let currentMasterProfile = this.masterProfile
      let curDocument = this.documents
      let currentIds = this.getDocumentIds()
      let statusAll = true
      let status = true

      this.$emit('eventApproveAll', {currentMasterProfile, curDocument, currentIds, statusAll, status})
    },
    refuseAll (masterProfileId, userId) {
      let currentIds = this.getDocumentIds()
      let statusAll = false
      let status = false
      let currentMasterProfile = this.masterProfile
      let action = 'document_refused'

      this.$emit('eventConfirmRefuseAll', {masterProfileId, userId, currentIds, statusAll, status, currentMasterProfile, action})
    },
    // Gửi chat cho trường hợp thiếu hồ sơ
    sendChat (masterProfileId, userId, positionId) {
      this.$parent.currentMpId = masterProfileId
      this.$parent.currentUserId = userId
      this.$parent.currentPositionId = positionId
      this.$parent.action = 'document_missing'
      this.$bvModal.show('modal-send-chat')
    },
    async execApprove (status) {
      try {
        this.loading = true
        let documentIds = this.getDocumentIds()
        const {data} = await profileService.approveDocument({
          info: {id: documentIds, status: status},
          dataUpdate: this.dataUpdate,
          query: {
            page: this.$parent.pagination.currentPage,
            limit: this.$parent.pagination.limit,
            ...this.$parent.filter
          }
        })
        if (data.success) {
          commonHelper.showMessage('Duyệt hồ sơ thành công', 'success')
          this.list = data.data.list
          this.pagination.total = data.data.total
          this.$bvModal.hide('modal-conform-approve-document-all')
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    approve (data) {
      this.$parent.dataUpdate.statusAll = null
      this.$parent.currentMasterProfile = this.masterProfile
      let doc = data.doc
      let status = data.status
      this.$emit('eventApprove', {doc, status})
    },

    remove (id) {
      this.$parent.currentMasterProfile = this.masterProfile
      this.$emit('delete', id)
    },

    showCicDetail (item) {
      this.$emit('showCicDetail', { doc: item, masterProfile: this.masterProfile })
    },

    switchBlock (type) {
      console.log(type)
      let max = this.documents.length
      let min = 0
      if (type === 'next') {
        if (this.start + this.step > max) return
        this.start += this.step
      }
      if (type === 'pre') {
        if (this.start - this.step < min) return
        this.start -= this.step
      }
    }
  }
}
</script>
