<template>
  <b-modal ref="my_modal" size="lg" title="Tạo team CSKH/Sale:"
    no-close-on-backdrop @ok="ok" @cancel="cancel"
    @close="close" cancel-title="Hủy bỏ" static>
    <b-row>
      <b-col md="2"><h5 class="mt-2">Tên team: <span class="red">(*)</span></h5></b-col>
      <b-col><b-form-input v-model="teamName" placeholder="Nhập tên team"></b-form-input></b-col>
    </b-row>
    <br>
    <b-row>
      <b-col md="2"><h5 class="mt-2">Leader: <span class="red">(*)</span></h5></b-col>
      <b-col>
        <multiselect class="multiselect-primary"
          v-model="teamLead"
          :options="allUsers"
          placeholder="Chọn Leader"
          selectedLabel="Đã chọn"
          deselectLabel="Bỏ chọn"
          selectLabel="Chọn"
          track-by="ErpUser"
          label="ErpUser"
          :searchable="true"
          :multiple="false"
          :hide-selected="true"
          :allow-empty="false"
          :custom-label="customRecord"
        >
          <span slot="noResult">Rất tiếc, không tìm thấy!</span>
        </multiselect>
      </b-col>
    </b-row>
    <br>
    <b-row>
     <b-col md="2"><h5 class="mt-2">Chọn tỉnh:</h5></b-col>
      <b-col>
        <multi-select-province @handleProvinceSelected="handleProvinceSelected" :display-all="true" :province-ids="provinceIds" :limit-prop=99999 :auto-close="false" :hide-selected="true"></multi-select-province>
      </b-col>
    </b-row>
    <br>
    <b-row>
     <b-col md="2"><h5 class="mt-2">Chọn kho:</h5></b-col>
      <b-col>
        <multi-select-station :limit-prop=200 :provinceIds="provinceIds" :station-ids="stationIds" @handleStationSelected="handleStationSelected" :auto-close="false" :hide-selected="true"></multi-select-station>
      </b-col>
    </b-row>
    <br>
    <div class="mt-2">
      <b-row>
        <b-col><h5>Chọn thành viên:</h5></b-col>
        <b-col class="text-right">{{ members.length }} thành viên</b-col>
      </b-row>
      <multiselect class="multiselect-primary"
        v-model="members"
        :options="allUsers"
        placeholder="Chọn thành viên"
        selectedLabel="Đã chọn"
        deselectLabel="Bỏ chọn"
        selectLabel="Chọn"
        track-by="ErpUser"
        label="ErpUser"
        :searchable="true"
        :multiple="true"
        :hide-selected="true"
        :allow-empty="true"
        :custom-label="customRecord"
      >
        <span slot="noResult">Rất tiếc, không tìm thấy!</span>
      </multiselect>
    </div>
    <div v-if="isBusy" class="sk-folding-cube sk-primary">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
    </div>
  </b-modal>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
  .red {
    color: red
  }
</style>

<script>
import Multiselect from 'vue-multiselect'
import commonHelper from 'infrastructures/helpers/common-helpers'
import CustomerCareService from 'domain/services/customer-care-service'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import { SweetModal } from 'sweet-modal-vue'

export default {
  name: 'assign-member',

  components: {
    Multiselect,
    commonHelper,
    CustomerCareService,
    MultiSelectProvince,
    MultiSelectStation,
    SweetModal
  },

  props: [
    'triggerShow',
    'allUsers',
    'propObj',
    'type'
  ],

  data: () => ({
    teamID: null,
    teamName: null,
    teamLead: null,
    provinceIds: null,
    stationIds: null,
    members: [],
    propsObj: {},
    isBusy: false
  }),

  created () {},

  mounted () {},

  watch: {
    triggerShow: function (newVal, oldVal) {
      this.$refs['my_modal'].show()
      let data = this.propsObj = Object.assign({}, this.propObj)
      this.assignValue(data)
    },

    propObj: function (newVal, oldVal) {
      if (newVal) {
        this.propsObj = Object.assign({}, newVal)
      }
    },

    propsObj: function (newVal, oldVal) {
      if (newVal) {
        this.assignValue(newVal)
      }
    }
  },

  computed: {},

  methods: {
    assignValue: function (newVal) {
      this.teamID = newVal.id
      this.teamName = newVal.name
      this.teamLead = this.convertMember(newVal.leader_id)[0]
      this.provinceIds = newVal.province_id
      this.stationIds = newVal.station_id
      if (newVal.member_id !== undefined) {
        this.members = newVal.member_id
      }
    },

    customRecord: function ({ErpUser, ErpStation, ErpAddress}) {
      return `${ErpUser.fullname} (${ErpUser.username} - ${ErpStation.name} - ${ErpAddress.name})`
    },

    handleProvinceSelected: function (option) {
      this.provinceIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleStationSelected: function (option) {
      this.stationIds = option ? option.map((item) => item.id).toString() : ''
    },

    close: function () {
      this.clearData()
      this.propsObj = null
    },

    ok: function (curModal) {
      this.isBusy = true
      if (this.teamName == null) {
        commonHelper.showMessage('Hãy nhập tên team!', 'warning')
        curModal.preventDefault()
      } else if (this.teamLead == null) {
        commonHelper.showMessage('Hãy chọn Leader!', 'warning')
        curModal.preventDefault()
      } else {
        let dataMember = null
        if (this.members.length > 0) {
          dataMember = this.members.map((item) => {
            return item.ErpUser.id
          })
        }
        let data = {
          team_id: this.teamID,
          leader_id: this.teamLead.ErpUser.id,
          team_name: this.teamName,
          type: this.type,
          province_id: this.provinceIds,
          station_id: this.stationIds,
          member_id: dataMember
        }
        // 1, 2, 3: cskh-b2c cskh-c2c sale
        if ([1, 2, 3].includes(this.type)) {
          curModal.preventDefault()
          CustomerCareService.insertCustomerCareTeam(data).then(res => {
            if (res.data.success) {
              this.isBusy = false
              commonHelper.showMessage(res.data.message, 'success')
              this.clearData()
              this.propsObj = null
              this.$emit('success')
              this.$refs['my_modal'].hide()
            } else {
              this.isBusy = false
              commonHelper.showMessage(res.data.message, 'warning')
            }
          })
        }
      }
    },
    cancel: function () {
      this.clearData()
      this.propsObj = null
    },
    clearData: function () {
      this.teamID = null
      this.teamName = null
      this.teamLead = null
      this.provinceIds = null
      this.stationIds = null
      this.members = []
    },
    convertMember: function (data) {
      data = Array.from(data)
      if (data) {
        if (data.length > 0 && this.allUsers.length > 0) {
          return this.allUsers.filter((item) => data.includes(item.ErpUser.id))
        }
      }
      return []
    }
  }
}
</script>
