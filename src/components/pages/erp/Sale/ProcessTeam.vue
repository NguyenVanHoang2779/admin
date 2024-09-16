<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <h3>Danh sách Team Process:</h3>
        <hr>
        <b-row>
          <b-col>
            <b-form-input class="search-size" size='sm' v-model="filter" placeholder="Tìm kiếm ..."></b-form-input>
          </b-col>
          <b-col class="text-right">
            <b-button class="pt-1 pb-1" :disabled="false"  variant="outline-primary" @click="openModal"><i class="ion ion-md-add"></i> Tạo Team</b-button>
          </b-col>
        </b-row>
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
            style="text-align:center;"
            :filter="filter"
            @filtered='onFiltered'
          >
            <template v-slot:cell(members)="row">
              <div class="text-right text-show">
                <span v-if="row.item.member_ids.length != 0"><b>{{ row.item.member_ids.length }}</b> thành viên</span>
              </div>
              <div class="non-blur custom-multiselect">
                <multiselect class="multiselect-primary"
                  v-model="row.item.members"
                  :options="allSale"
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
                  :custom-label="customRecordMember"
                >
                  <span slot="noResult">Rất tiếc, không tìm thấy!</span>
                </multiselect>
              </div>
            </template>
             <template v-slot:cell(shops)="row">
              <div class="text-right text-show">
                <span v-if="row.item.shops.length != 0"><b>{{ row.item.shops.length }}</b> shop</span>
              </div>
              <div class="non-blur custom-multiselect">
                <multiselect class="multiselect-primary"
                  v-model="row.item.shops"
                  :options="allSale"
                  placeholder="Không có shop"
                  selectedLabel="Đã chọn"
                  deselectLabel="Bỏ chọn"
                  selectLabel="Chọn"
                  :disabled="true"
                  :searchable="true"
                  :multiple="true"
                  :hide-selected="true"
                  :allow-empty="true"
                  :custom-label="customRecordShop"
                >
                  <span slot="noResult">Rất tiếc, không tìm thấy!</span>
                </multiselect>
              </div>
            </template>
            <template v-slot:cell(actions)="row">
            <div class="pl-3">
              <b-button :disabled="!isLeader" class="pt-1 pb-1 mt-1 w-button" variant="outline-info" @click="editTeam(row.item)"><i class="ion ion-md-create"></i> Chỉnh sửa</b-button>
              <b-button :disabled="!isLeader" class="pt-1 pb-1 mt-1 w-button" variant="outline-danger" @click="deleteTeam(row.item)"><i class="ion ion-md-trash"></i> Xóa team</b-button>
            </div>
          </template>
          </b-table>
          <div v-if="isLoadTable" class="sk-folding-cube sk-primary">
            <div class="sk-cube1 sk-cube"></div>
            <div class="sk-cube2 sk-cube"></div>
            <div class="sk-cube4 sk-cube"></div>
            <div class="sk-cube3 sk-cube"></div>
          </div>
          <b-pagination v-if="paginConfig.total_row > 0"
            class="mt-2"
            v-model="paginConfig.current_page"
            :total-rows="paginConfig.total_row"
            :per-page="paginConfig.per_page"
            align="center"
            size="sm"
          ></b-pagination>
        </div>
        <!-- Create and Update -->
        <b-modal ref="modal-pteam" no-close-on-backdrop size="lg" title="Tạo Team Process"
          cancel-title="Hủy bỏ" static @ok="ok" @cancel="cancel" @close="close">
          <b-row>
          <b-col md="2"><h5 class="mt-2">Tên team: <span class="red">(*)</span></h5></b-col>
          <b-col><b-form-input v-model="team.teamName" placeholder="Nhập tên team"></b-form-input></b-col>
          </b-row>
          <br>
          <div class="mt-2">
            <b-row>
              <b-col><h5>Chọn thành viên:</h5></b-col>
              <b-col class="text-right">{{ team.members.length }} thành viên</b-col>
            </b-row>
            <multiselect class="multiselect-primary"
              v-model="team.members"
              :options="allSale"
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
              :custom-label="customRecordMember"
            >
              <span slot="noResult">Rất tiếc, không tìm thấy!</span>
            </multiselect>
          </div>
          <br>
          <div v-if="isBusy" class="sk-folding-cube sk-primary">
            <div class="sk-cube1 sk-cube"></div>
            <div class="sk-cube2 sk-cube"></div>
            <div class="sk-cube4 sk-cube"></div>
            <div class="sk-cube3 sk-cube"></div>
          </div>
        </b-modal>
      </b-card-body>
    </b-card>
  </div>
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
  .red {
    color: red
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
import saleService from 'domain/services/sale-service'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'

export default {
  name: 'show-sale-salary',

  components: {
    Moment,
    commonHelper,
    saleService,
    Multiselect
  },

  data: () => ({
    triggerShow: false,
    isLeader: false,
    isLoadTable: true,
    isBusy: false,
    team: {
      teamID: null,
      teamName: null,
      members: []
    },
    allSale: [],
    filter: null,
    paginConfig: {
      per_page: 5,
      current_page: 1,
      total_row: 0
    },
    teams: null,
    fields: [
      { key: 'id', label: 'ID', sortable: true, thStyle: 'width: 5%' },
      { key: 'name', label: 'Tên team', thStyle: 'width: 20%' },
      { key: 'members', label: 'Thành viên', sortable: true, thStyle: 'width: 25%' },
      { key: 'shops', label: 'Shop', sortable: true, thStyle: 'width: 30%' },
      { key: 'actions', label: 'Chỉnh sửa', sortable: true, thStyle: 'width: 20%' }
    ]
  }),

  created () {
    this.isLeaderProcessTeam()
    this.getAllUsers()
  },

  mounted () {
  },

  watch: {
    triggerShow: function (newVal, oldVal) {
      this.$refs['modal-pteam'].show()
    }
  },

  computed: {},

  methods: {
    isLeaderProcessTeam: function () {
      saleService.isLeaderProcessTeam().then(res => {
        if (res.data.success) {
          this.isLeader = res.data.success
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      })
    },

    openModal: function () {
      this.triggerShow = !this.triggerShow
    },

    onFiltered (filteredItems) {
      this.paginConfig.total_row = filteredItems.length
      this.paginConfig.current_page = 1
    },

    getAllUsers: function () {
      saleService.getAllSalesForTeamProcess().then(res => {
        if (res.data.success) {
          this.allSale = res.data.data
          this.getTeamProcess()
        }
      })
    },

    getTeamProcess: function () {
      saleService.getTeamProcess().then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.teams = res.data.data
          this.teams.forEach(element => {
            element.members = this.convertMember(element.member_ids)
          })
          this.paginConfig.total_row = this.teams.length
          this.isLoadTable = false
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
          this.isLoadTable = false
        }
      })
    },

    customRecordMember: function ({ErpUser, ErpStation, ErpAddress}) {
      return `${ErpUser.fullname} (${ErpUser.username} - ${ErpStation.name} - ${ErpAddress.name})`
    },

    customRecordShop: function ({code, name}) {
      return `${code} - ${name}`
    },

    convertMember: function (data) {
      if (data.length > 0 && this.allSale.length > 0) {
        return this.allSale.filter((item) => data.includes(item.ErpUser.id))
      }
      return []
    },

    ok: function (curModal) {
      curModal.preventDefault()
      if (this.team.teamName == null) {
        commonHelper.showMessage('Hãy nhập tên team!', 'warning')
      } else {
        this.isBusy = true
        let memberIds = null
        if (this.team.members.length > 0) {
          memberIds = this.team.members.map(item => {
            return item.ErpUser.id
          })
        }
        let data = {
          // team-process
          type: 4,
          team_id: this.team.teamID,
          team_name: this.team.teamName,
          member_ids: memberIds
        }
        saleService.createTeamProcess(data).then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.$refs['modal-pteam'].hide()
            this.getTeamProcess()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
          this.isBusy = false
        })
      }
    },

    clearData: function () {
      this.team.teamID = null
      this.team.teamName = null
      this.team.members = []
    },

    close: function () {
      this.clearData()
    },

    cancel: function () {
      this.clearData()
    },

    editTeam: function (data) {
      this.openModal()
      this.team.teamID = data.id
      this.team.teamName = data.name
      this.team.members = this.convertMember(data.member_ids)
    },

    deleteTeam: function (data) {
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
          saleService.deleteTeamProcess(data.id).then(res => {
            if (res.data.success) {
              commonHelper.showMessage(res.data.message, 'success')
              this.getTeamProcess()
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
