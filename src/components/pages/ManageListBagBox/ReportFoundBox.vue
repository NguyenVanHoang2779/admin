<template>
  <b-modal header-bg-variant="green" static no-close-on-esc no-close-on-backdrop :title="'Xác nhận tìm thấy hộp ' + erpAlias" v-model="showModal" hide-footer scrollable id="reportLostBoxDialog" @hidden="hideModal">
    <div class="text-center pb-3 font-weight-bold">
      Vui lòng chọn kho hiện tại và kho trung chuyển hộp sẽ đi qua để về kho nguồn. Hệ thống sẽ dựa trên những kho
      được chọn để ép xuất hộp từ kho hiện tại về kho nguồn.
    </div>

    <b-form-group label="Kho hiện tại" label-cols-sm="3" label-cols-md="2" label-align="right">
      <multi-select-station placeholder="Kho hiện tại" v-model="currentStation" :disabled="isSubmitting"
                            :multiple="false" :is-report-missing-or-find="true"/>
    </b-form-group>

    <b-form-group label="Kho TC" label-cols-sm="3" label-cols-md="2" label-align="right">
      <div class="mb-3 d-flex" v-for="(station, stationIndex) in stations" :key="station.id">
        <div class="col pl-0">
          <multi-select-station v-model="stations[stationIndex].station" :disabled="isSubmitting" :multiple="false"
                                   :excludes="excludes" :is-report-missing-or-find="true"/>
        </div>
        <b-button variant="secondary" @click="removeStation(stationIndex)" :disabled="isSubmitting">Xóa</b-button>
      </div>

      <b-button variant="primary" @click="addStation" :disabled="isSubmitting">
        <i class="fa fa-plus" /> Thêm kho
      </b-button>
    </b-form-group>

    <b-form-group label="Kho nguồn" label-cols-sm="3" label-cols-md="2" label-align="right">
      <multi-select-station placeholder="Kho hiện tại" :value="originStation" :disabled="true" :multiple="false"
                            :is-report-missing-or-find="true"/>
    </b-form-group>

    <div class="text-center pt-3">
      <b-button variant="primary" @click="doReportFoundBox" :disabled="isSubmitting">
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
  name: 'ReportFoundBox',
  components: {MultiSelectStation},
  props: {
    erpAlias: String,
    originStation: Object
  },
  data () {
    return {
      showModal: false,
      isSubmitting: false,
      isFound: false,
      currentStation: null,
      stations: []
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
        boxErpAlias: this.erpAlias,
        isFound: this.isFound
      })
      this.resetModal()
    },
    resetModal () {
      this.currentStation = null
      this.stations = []
      this.isFound = false
    },
    addStation () {
      this.stations.push({
        id: 'station_' + new Date().getTime() + '_' + Math.random().toString(16).replace('.', ''),
        station: null
      })
    },
    removeStation (stationIndex) {
      if (!this.stations.length || this.stations.length <= stationIndex) {
        return
      }
      this.stations.splice(stationIndex, 1)
    },
    async doReportFoundBox () {
      try {
        if (!this.currentStation) {
          throw new Error('Bạn chưa chọn kho hiện tại của hộp.')
        }

        const stationIds = this.stations.map(station => station.station ? station.station.id : null)
        if (stationIds.some(stationId => !stationId)) {
          throw new Error('Bạn chưa nhập hết các kho trung chuyển.')
        }

        this.isSubmitting = true
        const message = await manageListBagBoxService.reportFoundBox(this.erpAlias, [
          this.originStation.id,
          ...stationIds.reverse(),
          this.currentStation.id
        ])
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
