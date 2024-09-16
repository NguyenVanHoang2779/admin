<template>
  <b-modal header-bg-variant="green" static no-close-on-esc no-close-on-backdrop :title="'Xác nhận báo mất Kit ' + erpAlias" v-model="showModal" hide-footer scrollable id="reportLostBoxDialog" @hidden="hideModal">
    <div class="text-center pb-3">
      Vui lòng chọn kho chịu trách nhiệm trước khi xác nhận mất Kit!
    </div>

    <multi-select-station placeholder="Nhập kho chịu trách nhiệm" :multiple="false" v-model="station"
                          :disabled="isSubmitting" :is-report-missing-or-find="true"/>

    <div class="text-center pt-3">
      <b-button variant="primary" @click="doReportMissingKit" :disabled="isSubmitting">
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
  name: 'ReportMissingKit',
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
      station: null,
      isMissing: false,
      isSubmitting: false
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
        isMissing: this.isMissing
      })
      this.resetModal()
    },
    resetModal () {
      this.station = null
      this.isMissing = false
    },
    async doReportMissingKit () {
      try {
        if (!this.station) {
          throw new Error('Bạn chưa chọn kho chịu trách nhiệm')
        }

        this.isSubmitting = true
        const message = await manageListBagBoxService.reportMissingKit(this.kitId, this.kitUserId, this.station.id, this.userId)
        this.isMissing = true
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
