<template>
  <b-modal header-bg-variant="green" static no-close-on-esc no-close-on-backdrop :title="'Xác nhận tìm thấy Kit ' + erpAlias" v-model="showModal" hide-footer scrollable id="reportLostBoxDialog" @hidden="hideModal">
    <div class="text-center pb-3 font-weight-bold">
      Vui lòng chọn kho hiện tại của kit để trung chuyển về kho nguồn. Hệ thống sẽ dựa trên những kho
      hiện tại được chọn để ép xuất kit từ kho hiện tại về kho nguồn.
    </div>

    <b-form-group label="Kho hiện tại" label-cols-sm="3" label-cols-md="2" label-align="right">
      <multi-select-station placeholder="Kho hiện tại" v-model="station" :disabled="isSubmitting" :multiple="false"
                            :is-report-missing-or-find="true"/>
    </b-form-group>

    <div class="text-center pt-3">
      <b-button variant="primary" @click="doReportFoundKit" :disabled="isSubmitting">
        <i class="fa fa-spin fa-spinner" v-if="isSubmitting" />
        <i class="fa fa-check" v-else />
        Xác nhận
      </b-button>
    </div>
  </b-modal>
</template>

<script>
import commonHelper from './../../../infrastructures/helpers/common-helpers'
import MultiSelectStation from './../../elements/common/MultiSelectStationV2'
import manageListBagBoxService from './../../../domain/services/manage-list-bag-box-service'

export default {
  name: 'ReportFoundKit',
  components: {MultiSelectStation},
  props: {
    erpAlias: String,
    kitId: Number,
    kitUserId: Number,
    originStation: Object,
    userId: Number
  },
  data () {
    return {
      showModal: false,
      isSubmitting: false,
      isFound: false,
      station: null
    }
  },
  watch: {
    erpAlias (newValue) {
      if (newValue) {
        this.resetModal()
        this.showModal = true
      }
    }
  },
  methods: {
    hideModal () {
      this.showModal = false
      this.$emit('changed', {
        kitErpAlias: this.erpAlias,
        isFound: this.isFound
      })
      this.resetModal()
    },
    resetModal () {
      this.station = null
      this.isFound = false
    },
    async doReportFoundKit () {
      try {
        if (!this.station) {
          throw new Error('Bạn chưa chọn kho hiện tại')
        }

        this.isSubmitting = true
        const message = await manageListBagBoxService.reportFoundKit(this.kitId, this.kitUserId, this.station.id, this.userId)
        this.isFound = true
        this.hideModal()
        commonHelper.showMessage(message, 'success')
      } catch (reason) {
        commonHelper.showMessage(reason.toString(), 'error')
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>

</style>
