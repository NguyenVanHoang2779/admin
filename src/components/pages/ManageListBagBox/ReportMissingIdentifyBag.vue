<template>
  <b-modal header-bg-variant="green" static no-close-on-esc no-close-on-backdrop :title="'Xác nhận báo mất bao ' + bagErpAlias" v-model="showModal" hide-footer scrollable id="reportLostBoxDialog" @hidden="hideModal">
    <div class="text-center pb-3">
      Vui lòng chọn kho chịu trách nhiệm trước khi xác nhận mất bao!
    </div>

    <multi-select-station placeholder="Nhập kho chịu trách nhiệm" :multiple="false" v-model="station"
                          :disabled="isSubmitting" :is-report-missing-or-find="true"/>

    <div class="text-center pt-3">
      <b-button variant="primary" @click="doReportMissingIdentifyBag" :disabled="isSubmitting">
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
  name: 'ReportMissingIdentifyBag',
  components: {MultiSelectStation},
  props: {
    cycleIdentifyBagId: String,
    identifyBagId: Number,
    bagErpAlias: String,
    bagOrder: Number,
    userId: Number,
    username: String,
    action: Number
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
    identifyBagId (newValue) {
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
        identifyBagId: this.identifyBagId,
        isMissing: this.isMissing
      })
      this.resetModal()
    },
    resetModal () {
      this.station = null
      this.isMissing = false
    },
    async doReportMissingIdentifyBag () {
      try {
        if (!this.station) {
          throw new Error('Bạn chưa chọn kho chịu trách nhiệm')
        }

        this.isSubmitting = true
        const message = await manageListBagBoxService.reportIdentifyBag(
          this.cycleIdentifyBagId,
          this.identifyBagId,
          this.bagOrder,
          parseInt(this.station.id),
          this.userId,
          this.username,
          this.action,
          null
        )
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
