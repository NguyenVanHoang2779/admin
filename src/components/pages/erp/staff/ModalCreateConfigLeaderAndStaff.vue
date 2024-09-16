<template>
  <div>
    <b-modal static id="modal-detail" size="lg" hide-footer ref="myModalRef" @show="loading = true" @hidden="resetDefault">
      <div slot="modal-title">
        Tạo Mới Config Quản Lý Và Nhân Viên
      </div>

      <div class="search-form">
        <form>
          <b-form-row>
            <b-form-group label="Chọn Kho Liên Vùng" class="col-md-12">
              <select-external-stations :multiple="false" @selected="setSelectedStation" ref="select_external_stations" placehoder="Nhập kho cần tìm kiếm"></select-external-stations>
            </b-form-group>
          </b-form-row>
          <b-form-row>
            <b-form-group label="Chọn Trưởng Module/Điều Phối" class="col-md-12">
              <select-leader-by-station :multiple="false" :stationId="selectedStation" @selected="setSelectedLeader" ref="select_leaders" placehoder="Nhập kho cần tìm kiếm"></select-leader-by-station>
            </b-form-group>
          </b-form-row>
          <b-form-row>
            <b-form-group label="Chọn Phụ Kho" class="col-md-12">
              <select-wh-staffs :stationId="selectedStation" :multiple="true" @selected="setSelectedWhStaffs" ref="select_staffs"></select-wh-staffs>
            </b-form-group>
          </b-form-row>
          <b-form-group label="&nbsp">
            <div class="align-content-center center">
              <b-btn type="button" variant="primary" @click="updateConfigLeaderAndStaff"> Save</b-btn>
              <b-btn type="button" variant="secondary" @click="hideModal"> Đóng</b-btn>
            </div>
          </b-form-group>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>

import SelectExternalStations from 'components/pages/erp/staff/SelectExternalStations'
import SelectLeaderByStation from 'components/pages/erp/staff/SelectLeaderByStation'
import SelectWhStaffs from 'components/elements/FilterBox/SelectWhStaffs'
import StaffService from 'domain/services/staff-service'

export default {
  name: 'modal-create-config-leader-and-staff',

  components: {
    SelectExternalStations,
    SelectLeaderByStation,
    SelectWhStaffs,
    StaffService
  },

  props: [
    'trigger'
  ],

  data: () => ({
    selectedStation: '',
    selectedLeader: '',
    selectedWhStaffs: '',
    responseMessage: ''

  }),

  created () {
  },

  watch: {
    trigger: function (newVal, oldVal) {
      this.$refs['myModalRef'].show()
    }
  },

  methods: {

    hideModal () {
      this.$refs.select_external_stations.reset()
      this.$refs.select_leaders.reset()
      this.$refs.select_staffs.reset()
      this.$refs.myModalRef.hide()
    },

    setSelectedStation (stationIds) {
      this.selectedStation = stationIds
    },

    setSelectedLeader (leaderIds) {
      this.selectedLeader = leaderIds
    },

    setSelectedWhStaffs (staffIds) {
      this.selectedWhStaffs = staffIds
    },

    updateConfigLeaderAndStaff () {
      if (!this.selectedStation || !this.selectedLeader || !this.selectedWhStaffs) return

      let data = {
        id_leader: this.selectedLeader,
        id_station: this.selectedStation
      }

      let dataSend = {
        id_leader: this.selectedLeader,
        id_staffs: this.selectedWhStaffs
      }
      StaffService.updateConfigReportLineMultipleStaff(dataSend).then(response => {
        this.responseMessage = response.data
        if (response.data.hasOwnProperty('success')) {
          this.$refs.select_external_stations.reset()
          this.$refs.select_leaders.reset()
          this.$refs.select_staffs.reset()
          this.$refs.myModalRef.hide()
          this.$emit('handleSuccess', response)
          this.$emit('autoSearch', data)
        }
      }).catch(e => {
        console.log(e)
      })
    },

    resetDefault: function () {
    }
  }
}
</script>
