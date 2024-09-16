<template>
  <b-card no-body>
    <b-card-body>
      <h3>Danh sách team CSKH B2C:</h3>
      <hr>
      <b-row>
        <b-col>
          <b-form-input class="search-size" size='sm' v-model="filter" placeholder="Tìm kiếm ..."></b-form-input>
        </b-col>
        <b-col class="text-right">
          <b-button class="pt-1 pb-1" :disabled="!isLeader"  variant="outline-primary" @click="createTeam"><i class="ion ion-md-add"></i> Tạo Team</b-button>
        </b-col>
      </b-row>
      <assign-member @success="getCusotmerCareB2CTeams" :trigger-show="triggerShow" :all-users="customerCares" :type=1 :propObj="propObj"></assign-member>
      <br>
      <div class="table-responsive">
        <b-table
          class="card-table"
          id="data-shop-city"
          ref="dataTable"
          :items="teams"
          :fields="fields"
          :striped="false"
          :bordered="true"
          :outlined="true"
          :hover="true"
          :per-page="paginConfig.per_page"
          :current-page="paginConfig.current_page"
          style="text-align: center;"
          :filter="filter"
          @filtered='onFiltered'
        >
          <template v-slot:cell(leader_name)='row'>
            <a class="blue" :href="`https://admin.giaohangtietkiem.vn/admin/users/detail/` + row.item.leader_id" target="_blank">{{ row.item.leader_name }}</a>
          </template>
          <template v-slot:cell(team_member)="row">
            <div class="text-right text-show">
              <span v-if="row.item.member_id.length != 0"><b>{{ row.item.member_id.length }}</b> thành viên</span>
            </div>
            <div class="non-blur custom-multiselect">
              <multiselect class="multiselect-primary"
                v-model="row.item.member_id"
                :options="customerCares"
                placeholder="Không có thành viên"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel="Chọn"
                track-by="ErpUser"
                label="ErpUser"
                :disabled="true"
                :searchable="true"
                :multiple="true"
                :hide-selected="true"
                :allow-empty="true"
                :custom-label="customRecord"
              >
                <span slot="noResult">Rất tiếc, không tìm thấy!</span>
              </multiselect>
            </div>
          </template>
          <template v-slot:cell(actions)="row">
            <div class="pl-3">
              <b-button :disabled="!isLeader" class="pt-1 mb-2 pb-1 w-button" variant="outline-info" @click="editTeam(row.item)"><i class="ion ion-md-create"></i> Chỉnh sửa</b-button>
              <b-button :disabled="!isLeader" class="pt-1 pb-1 w-button" variant="outline-danger" @click="deleteCustomerCareTeam(row.item)"><i class="ion ion-md-trash"></i> Xóa team</b-button>
            </div>
          </template>
          <template v-slot:cell(provinces)="row">
            <div class="text-right text-show">
              <span v-if="row.item.province_id != null"><b>{{ row.item.province_id.toString().split(',').length }}</b> tỉnh</span>
            </div>
            <multi-select-province @handleProvinceSelected="handleProvinceSelected" :class='`non-blur custom-multiselect`' :isDisabled="true" :display-all="true" :province-ids="row.item.province_id" :limit-prop=99999 :auto-close="false" :hide-selected="true"></multi-select-province>
          </template>
          <template v-slot:cell(stations)="row">
            <div class="text-right text-show">
              <span v-if="row.item.station_id != null"><b>{{ row.item.station_id.toString().split(',').length }}</b> kho</span>
            </div>
            <multi-select-station :limitProp='200' :provinceIds="row.item.province_id" :station-ids="row.item.station_id" :class='`non-blur custom-multiselect`' :isDisabled="true" @handleStationSelected="handleStationSelected" :auto-close="false" :hide-selected="true"></multi-select-station>
          </template>
        </b-table>
         <div v-if="!isBusy" class="sk-folding-cube sk-primary">
          <div class="sk-cube1 sk-cube"></div>
          <div class="sk-cube2 sk-cube"></div>
          <div class="sk-cube4 sk-cube"></div>
          <div class="sk-cube3 sk-cube"></div>
        </div>
      </div>
      <b-pagination v-if="paginConfig.total_row > 0"
        class="mt-2"
        v-model="paginConfig.current_page"
        :total-rows="paginConfig.total_row"
        :per-page="paginConfig.per_page"
        align="center"
        size="sm"
      ></b-pagination>
    </b-card-body>
  </b-card>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
  .search-size {
    height: 32px;
    width: 300px;
  }
  .w-button {
    width: 110px;
  }
  .text-show {
    font-size: 11px;
  }
  .non-blur >>> .multiselect--disabled {
    opacity: 1!important;
    pointer-events: auto;
  }
  .non-blur >>> .multiselect__tags {
    background: white;
  }
  .non-blur >>> .multiselect__tag-icon {
    display: none
  }
  .blue {
    color: #26B4ff
  }
  .hide {
    display: none;
  }
  .custom-multiselect {
    max-height: 200px;
    overflow: auto;
  }
  .custom-multiselect::-webkit-scrollbar {
    width: 6px;
    border-radius: 5px;
    background-color:#F5F5F5;
  }
  .custom-multiselect::-webkit-scrollbar-thumb {
    background-color: black;
    border-radius: 5px;
  }
  .custom-multiselect::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
  }
</style>

<script>
import Multiselect from 'vue-multiselect'
import commonHelper from 'infrastructures/helpers/common-helpers'
import AssignMember from './AssignMember'
import CustomerCareService from 'domain/services/customer-care-service'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'

export default {
  name: 'manager-cskh-b2c',

  components: {
    Multiselect,
    AssignMember,
    commonHelper,
    MultiSelectProvince,
    MultiSelectStation,
    CustomerCareService
  },

  data: () => ({
    isLeader: false,
    triggerShow: false,
    paginConfig: {
      per_page: 5,
      current_page: 1,
      total_row: 0
    },
    filter: null,
    customerCareMember: [],
    customerCares: [],
    teams: null,
    fields: [
      { key: 'id', label: 'ID', sortable: true, thStyle: 'width: 3%' },
      { key: 'name', label: 'Tên team', sortable: true, thStyle: 'width: 15%' },
      { key: 'leader_name', label: 'Tên leader', sortable: true, thStyle: 'width: 15%' },
      { key: 'team_member', label: 'Thành viên team', sortable: true, thStyle: 'width: 23%' },
      { key: 'provinces', label: 'Tỉnh', sortable: true, thStyle: 'width: 17%' },
      { key: 'stations', label: 'Kho', sortable: true, thStyle: 'width: 20%' },
      { key: 'actions', label: 'Chỉnh sửa', thStyle: 'width: 7%' }
    ],
    propObj: null,
    isBusy: false
  }),

  created () {
    this.isLeaderTeam()
    this.getCustomterCares()
  },

  mounted () {},

  watch: {},

  computed: {},

  methods: {
    isLeaderTeam: function () {
      CustomerCareService.isLeaderB2C().then(res => {
        if (res.data.success) {
          this.isLeader = res.data.success
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      })
    },
    triggerShowModal: function () {
      this.triggerShow = !this.triggerShow
    },
    createTeam: function () {
      this.propObj = null
      this.triggerShowModal()
    },
    getCustomterCares: function () {
      CustomerCareService.getCustomerCares().then(res => {
        if (res.data.success) {
          this.customerCares = res.data.data
          this.getCusotmerCareB2CTeams()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      })
    },

    onFiltered (filteredItems) {
      this.paginConfig.total_row = filteredItems.length
      this.paginConfig.current_page = 1
    },

    customRecord: function ({ErpUser, ErpStation, ErpAddress}) {
      return `${ErpUser.fullname} (${ErpUser.username} - ${ErpStation.name} - ${ErpAddress.name})`
    },

    customCellToSearchMember (memberId) {
      let data = this.convertMember(memberId)
      return data.map(element => {
        return `${element.ErpUser.fullname} - ${element.ErpUser.username} - ${element.ErpStation.name} - ${element.ErpAddress.name}`
      })
    },

    handleProvinceSelected: function (option) {
      this.provinceIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleStationSelected: function (option) {
      this.stationIds = option ? option.map((item) => item.id).toString() : ''
    },

    getCusotmerCareB2CTeams: function () {
      let data = {
        type: 1
      }
      CustomerCareService.getCustomerCareTeams(data).then(res => {
        if (res.data.success) {
          this.isBusy = true
          this.teams = res.data.data
          this.teams.forEach(element => {
            element.member_id = this.convertMember(element.member_id)
          })
          this.paginConfig.total_row = this.teams.length
          this.$refs.dataTable.refresh()
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          this.isBusy = true
          commonHelper.showMessage(res.data.message, 'warning')
        }
      })
    },

    convertMember: function (data) {
      if (data.length > 0 && this.customerCares.length > 0) {
        return this.customerCares.filter((item) => data.includes(item.ErpUser.id))
      }
      return []
    },

    editTeam: function (data) {
      this.propObj = data
      this.triggerShowModal()
    },

    deleteCustomerCareTeam: function (data) {
      this.$bvModal.msgBoxConfirm('Bạn có chắc chắn muốn xóa team ' + data.name + ' không ?', {
        title: 'Xin hãy xác nhận:',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Xác nhận',
        cancelTitle: 'Hủy bỏ',
        footerClass: 'p-2',
        hideHeaderClose: false,
        noCloseOnBackdrop: true,
        centered: true
      }).then(result => {
        if (result) {
          let members = []
          if (data.member_id.length > 0) {
            members = data.member_id.map(item => {
              return item.ErpUser.id
            })
          }
          let team = {
            team_id: data.id,
            leader_id: data.leader_id,
            member_ids: members
          }
          CustomerCareService.deleteTeam(team).then(res => {
            if (res.data.success) {
              commonHelper.showMessage(res.data.message, 'success')
              this.getCusotmerCareB2CTeams()
            } else {
              commonHelper.showMessage(res.data.message, 'warning')
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
