<template>
  <div>
    <div style="min-height: 200px">
      <profile-management :permissionsClosShift="permissions" :teamId="teamId" :filterClose="filter" :paginationClose="pagination" :dataClosingShift="list" :isClosingShift="true"></profile-management>
    </div>
    <infinite-loading ref="infiniteLoading" spinner="spiral" @infinite="infiniteHandler">
      <div slot="no-more"></div>
      <div slot="no-results"></div>
    </infinite-loading>

  </div>
</template>
<script>
// service
import profileService from 'domain/services/profile-mamanger-service'
import driverLicenseService from 'domain/services/driver-license-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// custom components
import DocumentUploadItem from 'components/pages/erp/ProfileManager/DocumentUploadItem'
import InfiniteLoading from 'vue-infinite-loading'
import ProfileManagement from 'components/pages/erp/ProfileManager/ProfileManagement'

export default {
  name: 'document-board',
  components: {
    DocumentUploadItem, InfiniteLoading, ProfileManagement},
  data: _ => ({
    list: [],
    curDocument: null,
    dataUpdate: {
      status: true,
      driverLicense: {
        no_number: null,
        class: null,
        beginning_date: null,
        expiry_date: null
      }
    },
    loading: false,
    pagination: {
      currentPage: 1,
      limit: 4,
      perRow: 4
    },
    filter: {
      status: {
        name: 'Chưa duyệt'
      },
      mp_status: 'pause,disable'
    },
    permissions: {}
  }),
  props: {
    teamId: {
      default: null
    },
    getDocumentTrigger: {
      default: false
    }
  },
  watch: {
    getDocumentTrigger: {
      immediate: true,
      handler: function (newValue, oldValue) {
        this.getList(null, true)
      }
    }
  },
  computed: {
    helper: function () {
      return helper
    }
  },
  methods: {
    reset () {
      this.list = []
      if (this.$refs.infiniteLoading) {
        this.$refs.infiniteLoading.stateChanger.reset()
      }
      this.pagination = {
        currentPage: 1,
        limit: 4,
        perRow: 4
      }
    },
    resetData () {
      this.curDocument = null
      helper.resetData(this.dataUpdate, 2)
    },
    infiniteHandler ($state) {
      this.pagination.currentPage += 1
      this.getList($state)
    },
    approve (doc) {
      this.curDocument = doc.doc
      this.dataUpdate.status = doc.status
      // lấy thông tin bằng lái xen nếu có
      if (+doc.doc.ProfileDocument.document_id === 13) {
        this.getDriverLiense(doc.doc.ProfileDocument.master_profile_id)
      }
      this.$bvModal.show('modal-conform-approve-document')
    },
    async execApprove ({id, status}) {
      try {
        this.loading = true
        const {data} = await profileService.approveDocument({
          info: {id, status},
          dataUpdate: this.dataUpdate,
          query: {
            page: 1,
            limit: this.pagination.limit * this.pagination.currentPage,
            team_id: this.teamId,
            ...this.filter
          }
        })
        if (data.success) {
          helper.showMessage('Duyệt hồ sơ thành công', 'success')
          this.list = data.data.list
          this.$bvModal.hide('modal-conform-approve-document')
          this.$emit('modifyTotalDocument', {action: 'modify_total_statistic', data: {key: 'document', value: -1}})
        } else helper.showMessage(data.message, 'warning')
      } catch (e) {
        helper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    getDriverLiense (masterProfileId) {
      this.loading = true
      driverLicenseService.getDriverLicenseOfProfile({master_profile_id: masterProfileId})
        .then(res => {
          if (res.data.success) {
            this.dataUpdate.driverLicense.no_number = res.data.data.no_number
            this.dataUpdate.driverLicense.class = res.data.data.class
            this.dataUpdate.driverLicense.expiry_date = res.data.data.expiry_date ? new Date(res.data.data.expiry_date) : null
            this.dataUpdate.driverLicense.beginning_date = res.data.data.beginning_date ? new Date(res.data.data.beginning_date) : null
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi lấy thông tin bằng lái xe !')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.loading = false
        })
    },
    async getList ($state, reset = false) {
      if (reset) this.reset()
      try {
        this.filter.from = null
        this.loading = true
        const {data} = await profileService.getDocuments({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          team_id: this.teamId,
          ...this.filter
        })
        if (data.success) {
          if (!helper.isEmpty(data.data.list)) {
            if (!helper.isEmpty($state)) $state.loaded()
            if (reset) {
              this.list = data.data.list
            } else {
              let merged = {...this.list, ...data.data.list}
              this.list = merged
            }
            this.permissions = data.permissions || {}
          } else {
            if (!helper.isEmpty($state)) $state.complete()
          }
        } else {
          helper.showMessage(data.message)
        }
      } catch (e) {
        helper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
