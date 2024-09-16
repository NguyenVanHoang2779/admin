<template>
  <div>
    <b-modal title="Thêm cơ cấu keyperson" ref="modal-create" static centered>
      <b-form-group label="Chọn thành viên">
          <single-select-executive-team-member :member-id="team.member_id" @on-select="setMember"></single-select-executive-team-member>
      </b-form-group>
      <b-form-group label="Chọn tỉnh quản lý">
          <multi-select-province :province-id="team.province_id" :limit-prop=9999 @handleProvinceSelected="setProvince"></multi-select-province>
      </b-form-group>
      <b-form-group label="Chọn kho quản lý">
          <multi-select-station :province-ids="provinceIds" @handleStationSelected="setStation" :auto-close="false" :limit-prop=9999></multi-select-station>
      </b-form-group>
      <template v-slot:modal-footer>
        <div class="text-center w-100">
          <b-btn variant="primary" @click="createTeam">Thêm</b-btn>
        </div>
      </template>
    </b-modal>
    <sweet-modal ref="successModal" icon="success"><b>Thêm keyperson thành công</b></sweet-modal>
  </div>
</template>

<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>

<script>
import {SweetModal} from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'

import executiveService from 'domain/services/executive-service'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import SingleSelectExecutiveTeamMember from './SingleSelectExecutiveTeamMember'

export default {
  name: 'modal-create-executive-team',

  components: {
    SingleSelectProvince,
    MultiSelectProvince,
    MultiSelectStation,
    SingleSelectExecutiveTeamMember,
    SweetModal
  },

  props: {
    trigger: {
      type: Boolean
    }
  },

  data: () => ({
    team: {
      province_id: null,
      station_id: null,
      member_id: null
    }
  }),

  watch: {
    trigger: function (newVal, oldVal) {
      this.team.province_id = null
      this.team.station_id = null
      this.team.member_id = null
      this.$refs['modal-create'].show()
    }
  },

  computed: {
    provinceIds: function () {
      return this.team.province_id ? this.team.province_id.join(',') : ''
    }
  },

  methods: {
    showSuccessModal () {
      this.$refs['successModal'].open()
      setTimeout(() => { this.$refs['successModal'].close() }, 1200)
    },

    setProvince (provinces) {
      if (!provinces) this.team.province_id = null
      else this.team.province_id = provinces.map(item => item.id)
    },

    setStation (stations) {
      if (!stations) this.team.station_id = null
      else this.team.station_id = stations.map(item => item.id)
    },

    setLeader (member) {
      if (!member) this.team.leader_id = null
      else this.team.leader_id = member.id
    },

    setMember (member) {
      if (!member) this.team.member_id = null
      else this.team.member_id = member.id
    },

    createTeam () {
      executiveService.createTeam(this.team)
        .then(response => {
          if (response.data.success) {
            this.$emit('on-created')
            this.$refs['modal-create'].hide()
            this.$refs['successModal'].open()
            setTimeout(() => { this.$refs['successModal'].close() }, 1200)
          } else {
            commonHelper.showMessage(response.data.message, 'fail')
          }
        })
    }
  }
}
</script>
