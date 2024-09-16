<template>
  <b-modal header-bg-variant="green" static no-close-on-esc no-close-on-backdrop :title="'Xác nhận tìm thấy bao ' + bagErpAlias" v-model="showModal" hide-footer scrollable id="reportLostBoxDialog" @hidden="hideModal">
    <div class="text-center pb-3 font-weight-bold">
      Vui lòng chọn kho hiện tại của bao!
    </div>

    <b-form-group label="Kho hiện tại" label-cols-sm="3" label-cols-md="2" label-align="right">
      <multi-select-station placeholder="Kho hiện tại" v-model="currentStation" :disabled="isSubmitting"
                            :multiple="false" :is-report-missing-or-find="true"/>
    </b-form-group>

    <div class="text-center pt-3">
      <b-button variant="primary" @click="doReportFoundIdentifyBag" :disabled="isSubmitting">
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
  name: 'ReportFoundIdentifyBag',
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
      isSubmitting: false,
      isFound: false,
      currentStation: null
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
  computed: {
    excludes: function () {
      let excludes = []
      if (this.originStation) {
        excludes.push(this.originStation.id.toString())
      }

      if (this.currentStation) {
        excludes.push(this.currentStation.id.toString())
      }

      return excludes
    }
  },
  methods: {
    hideModal () {
      this.showModal = false
      this.$emit('changed', {
        identifyBagId: this.identifyBagId,
        isFound: this.isFound
      })
      this.resetModal()
    },
    resetModal () {
      this.currentStation = null
      this.isFound = false
    },
    async doReportFoundIdentifyBag () {
      try {
        if (!this.currentStation) {
          throw new Error('Bạn chưa chọn kho hiện tại của hộp.')
        }

        this.isSubmitting = true
        const message = await manageListBagBoxService.reportIdentifyBag(
          this.cycleIdentifyBagId,
          this.identifyBagId,
          this.bagOrder,
          parseInt(this.currentStation.id),
          this.userId,
          this.username,
          this.action,
          null
        )
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
