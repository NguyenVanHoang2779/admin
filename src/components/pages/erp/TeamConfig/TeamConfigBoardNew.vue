<template>
  <div>
    <div class="card">
      <div class="d-flex justify-content-between card-header row">
        <h4 class="title mt-auto mb-auto col-md-4">Cơ cấu team</h4>
        <div class="d-flex search col-md-8 w-100">
          <div class="input-team d-flex justify-content-between align-items-center mb-0 mr-1 w-50 pr-0">
            <input class="input" @keyup.enter="submitSearch" v-model="search" type="text" placeholder="Nhập tên team"/>
          </div>
          <div class="input-team d-flex justify-content-between align-items-center mb-0 w-50">
            <SelectUser v-model="searchUser" :multiple="false" placeholder="Chọn thành viên" @input="checkMemberAdded"/>
          </div>
          <div class="mt-auto mb-auto">
            <b-button class="btn-ghtk" @click="submitSearch">
              <i class="sidenav-icon ion ion-md-search text-white"></i>Tìm Kiếm
            </b-button>
          </div>
        </div>
      </div>
      <div class="card-body row" v-loading="loadingAll">
        <div class="col-lg-3 col-sm-12 col-md-12 border" style="max-height: calc(100vh - 200px); overflow: auto">
          <tree-item
            id="idItem"
            v-if="show"
            class="item mt-2"
            :data.sync="data"
            :currentTeam.sync="team"
            :focusedTeam.sync="focusedTeam"
            @reloadTeam="reloadTeam"
          ></tree-item>
        </div>
        <div class="col-lg-9 col-sm-12 col-md-12 border p-2" v-show="Object.keys(team).length !== 0">
          <div>
            <div class="team-name d-flex justify-content-between" v-if="!showEditTeam">
              <div>
                <span v-for="(value,index) in pathToTeam" :key="index">
                  <span class="no-active" v-if="index !== pathToTeam.length - 1">{{ value }} / </span>
                  <span v-else><b>{{ value }}</b></span>
                </span>
              </div>
              <div class="d-flex">
                <i v-if="loading" class="fas fa-spinner fa-pulse text-success ml-auto mr-1"></i>
                <span v-if="!loading" @click="showEdit"><i class="fas fa-pencil-alt cursor-pointer"
                                                           aria-hidden="true"></i></span>
                <span v-if="!loading" @click="actionModalDeleteTeam"><i class="fa fa-trash pl-2 cursor-pointer"
                                                                        aria-hidden="true"></i></span>
              </div>
            </div>
            <div v-else>
              <p v-if="Object.keys(childTeam).length !== 0">Thêm team con cho team {{ team.name }}</p>
              <div class="input-team team-bg-input d-flex justify-content-between align-items-center">
                <input @keyup.enter="submitEditOrCreateTeam" v-if="Object.keys(childTeam).length !== 0" class="input i-team" v-model="childTeam.name" type="text"
                       placeholder="Nhập tên team"/>
                <input @keyup.enter="submitEditOrCreateTeam" v-else class="input i-team" v-model="teamName" type="text" placeholder="Nhập tên team"/>
                <i v-if="loading" class="fas fa-spinner fa-pulse text-success ml-auto mr-1"></i>
                <span v-if="!loading" @click="showEditTeam = false" class="save-team-icon mr-4"><i class="fa fa-times"
                                                                                                   aria-hidden="true"></i></span>
                <span v-if="!loading" @click="submitEditOrCreateTeam" class="save-team-icon"><i class="fa fa-check"
                                                                                                aria-hidden="true"></i></span>
              </div>
            </div>
          </div>
          <TeamInfo
            v-if="!showEditTeam && !showModalDeleteTeam && Object.keys(team).length !== 0"
            :team="team"
            :key="keyInfoTeam"
          />
        </div>
        <SearchTeam
          v-if="showSearch"
          :loading="loading"
          :search-result="searchResult"
          @goToTeam="goToTeam"
        />
      </div>
    </div>
    <b-modal id="modal-scrollable" class="modal-delete-team" v-show="Object.keys(team).length !== 0" scrollable
             hide-footer title="Xác nhận xóa team" v-model="showModalDeleteTeam">
      <div style="word-wrap: break-word">
        <p>Bạn có chắc muốn xóa team {{ team.name }} không?</p>
        <p>Việc xóa team sẽ xóa vĩnh viễn team này và các team con cùng với các thành viên trong team.</p>
      </div>
      <div class="mt-1">
        <ladda-btn
          data-style="zoom-out"
          class="btn btn-secondary float-right ml-1"
          @click.native="showModalDeleteTeam = false"
        >
          Hủy
        </ladda-btn>

        <ladda-btn
          data-style="zoom-out"
          class="btn btn-success float-right"
          @click.native="submitRemoveTeam"
        >
          Đồng ý
        </ladda-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>

import helper from 'infrastructures/helpers/common-helpers'
import teamConfigService from 'domain/services/team-config-service'
import TreeItem from './TeamConfig/Tree.vue'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import {eventBus} from '@/main'
import SearchTeam from './TeamConfig/SearchTeam.vue'
import TeamInfo from './TeamConfig/TeamInfo.vue'
import SelectUser from 'components/elements/common/SelectUser'

export default {
  name: 'list-team-config-new',
  components: {
    SelectUser,
    TeamInfo,
    SearchTeam,
    LaddaBtn,
    TreeItem
  },
  created () {
    this.getTeamConfig()
    eventBus.$on('clickToTeam', this.clickToTeam)
    eventBus.$on('removeActiveCurrentTeam', this.removeActiveCurrentTeam)
    eventBus.$on('addChildToTeam', this.addChildToTeam)
  },
  data: () => ({
    loading: false,
    loadingAll: false,
    show: true,
    data: [],
    team: {},
    childTeam: {},
    pathToTeam: [],
    showEditTeam: false,
    showModalDeleteTeam: false,
    search: '',
    showSearch: false,
    searchResult: [],
    teamSearch: [],
    teamName: '',
    keyInfoTeam: '',
    searchUser: [],
    focusedTeam: false
  }),
  computed: {
    helper: _ => helper
  },
  methods: {
    actionModalDeleteTeam () {
      this.showModalDeleteTeam = true
    },
    async reloadTeam () {
      await this.getTeamConfig()
    },
    reload () {
      this.show = false
      this.show = true
    },
    generateUniqueString () {
      const randomString = Math.random().toString(36)
      const currentTime = Date.now().toString()
      return randomString + currentTime
    },
    async getTeamConfig () {
      const urlParams = new URLSearchParams(window.location.search)
      const teamId = urlParams.get('team_id')

      this.loadingAll = true
      await teamConfigService.getTeamConfigs({
        team_id: teamId
      })
        .then(response => {
          if (response.data.success) {
            this.data = response.data.data
            this.teamSearch = response.data.data
            if (typeof teamId === 'string' && teamId.length > 0 && this.data.length > 0) {
              this.focusedTeam = true
            }
          } else {
            helper.showMessage(response.data.message, 'error')
            this.searchResult = []
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
          this.searchResult = []
        })
      this.loadingAll = false
    },
    clickToTeam (data, checkAddChild) {
      this.keyInfoTeam = this.generateUniqueString()
      this.showEditTeam = false
      this.pathToTeam = []
      this.updateTeamByCursor(this.data, data.cursor, data)
      this.updatePathToTeam()
      this.team = data
      this.childTeam = {}
      this.resetSearch()
      if (checkAddChild) {
        this.addChildToTeam(data)
      }
    },
    updateTeamByCursor (obj, path, value) {
      const [head, ...rest] = String(path).split('.')
      if (value) {
        this.pathToTeam.push(obj[head].name)
      }
      obj[head] = rest.length ? this.updateTeamByCursor(obj[head], rest.join('.'), value) : value
      return obj
    },
    removeActiveCurrentTeam () {
      this.team = {}
    },
    async createTeamChild () {
      await teamConfigService.updateTeam(this.childTeam)
        .then(response => {
          if (response.data.success) {
            let result = response.data.data

            result.cursor = String(this.team.cursor + '.children.' + this.team.children.length)
            this.team.children.push(result)
            this.pathToTeam = []
            this.updateTeamByCursor(this.data, result.cursor, result)
            this.team = result
            this.updatePathToTeam()
            this.childTeam = {}
            this.reload()
            helper.showMessage(response.data.message, 'success')
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          console.log(error)
          if (typeof error.response.data.message !== 'undefined') {
            helper.showMessage(error.response.data.message, 'error')
          }
          this.searchResult = []
        })
      this.showEditTeam = false
    },
    async editTeam () {
      this.team.name = this.teamName
      await teamConfigService.updateTeam(this.team)
        .then(response => {
          if (response.data.success) {
            this.pathToTeam = []
            this.updateTeamByCursor(this.data, this.team.cursor, this.team)
            this.updatePathToTeam()
            this.showEditTeam = false
            helper.showMessage(response.data.message, 'success')
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
          this.searchResult = []
        })
    },
    async submitEditOrCreateTeam () {
      this.loading = true
      if (Object.keys(this.childTeam).length !== 0) {
        if (this.childTeam.name === '' || !this.childTeam.name) {
          helper.showMessage('Vui lòng nhập tên team')
          this.loading = false
          return
        }
        await this.createTeamChild()
      } else {
        if (this.teamName === '' || !this.teamName) {
          helper.showMessage('Vui lòng nhập tên team')
          this.loading = false
          return
        }
        await this.editTeam()
      }
      this.loading = false
    },
    async submitRemoveTeam () {
      this.showModalDeleteTeam = false
      this.loading = true
      this.showEditTeam = true
      await teamConfigService.removeTeam(this.team.id)
        .then(response => {
          if (response.data.success) {
            this.updateTeamByCursor(this.data, this.team.cursor, null)
            this.team = {}
            this.pathToTeam = []
            this.reload()
            helper.showMessage(response.data.message, 'success')
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
          this.searchResult = []
        })

      this.showEditTeam = false
      this.loading = false
    },
    addChildToTeam (data) {
      this.childTeam = {
        name: '',
        parent_id: data.id
      }
      this.team = data
      this.showEditTeam = true
      this.showSearch = false
    },
    updatePathToTeam () {
      this.pathToTeam = this.pathToTeam.filter(function (element) {
        return element !== undefined
      })
    },
    async submitSearch () {
      if ((this.search === '' || !this.search) && (typeof this.searchUser.id === 'undefined' || typeof this.searchUser.name === 'undefined')) {
        helper.showMessage('Vui lòng nhập tên team hoặc chọn thành viên')
        return
      }

      this.resetTeam()
      this.showSearch = true
      this.loading = true
      await teamConfigService.searchTeam({
        name: this.search,
        user_id: this.searchUser.id
      })
        .then(response => {
          if (response.data.success) {
            this.searchResult = response.data.data
          } else {
            helper.showMessage(response.data.message, 'error')
            this.searchResult = []
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
          this.searchResult = []
        })
      this.loading = false
    },
    checkMemberAdded () {
      if (this.searchUser.length > 1) {
        helper.showMessage('Chỉ được chọn một thành viên')
        this.searchUser.pop()
      }
    },
    async goToTeam (team) {
      this.resetTeam()
      this.resetSearch()
      this.loadingAll = true
      this.loading = true
      await teamConfigService.getTeamFromSearch({
        id: team.id
      })
        .then(async response => {
          if (response.data.success && response.data.data.length > 0) {
            const teamFromSearch = response.data.data
            const _teamSearch = this.teamSearch
            for (const dataKey in teamFromSearch) {
              for (const value of this.teamSearch) {
                // eslint-disable-next-line eqeqeq
                if (value.id == teamFromSearch[dataKey]) {
                  value.opened = true
                  let _this = this
                  let childrenTeam = await teamConfigService.getChildTeam({
                    parent_id: value.id
                  })
                  if (childrenTeam.data.success) {
                    let result = childrenTeam.data.data
                    result.forEach(function (itemChild, index) {
                      itemChild.cursor = String(value.cursor + '.children.' + index)
                      // eslint-disable-next-line eqeqeq
                      if (itemChild.id == team.id) {
                        _this.team = itemChild
                      }
                    })
                    value.children = result
                    this.clickToTeam(value, false)
                    this.teamSearch = value.children
                    break
                  } else {
                    helper.showMessage(childrenTeam.data.message)
                  }
                }
              }
            }
            this.teamSearch = _teamSearch
            this.showEditTeam = false
            this.showModalDeleteTeam = false
            this.resetSearch()
            this.reload()
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
          this.searchResult = []
        })

      this.loadingAll = false
      this.loading = false
    },
    showEdit () {
      this.teamName = this.team.name
      this.showEditTeam = true
      this.childTeam = {}
    },
    resetSearch () {
      this.showSearch = false
      this.search = ''
      this.searchUser = []
      this.searchResult = []
    },
    resetTeam () {
      this.team = {}
      this.childTeam = {}
      this.pathToTeam = []
      this.showEditTeam = false
      this.showModalDeleteTeam = false
    }
  }
}
</script>

<style scoped>
i {
  color: #646363;
}
.title {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.2rem;
}

.card {
  font-size: 0.894rem;
}

.modal-delete-team {
  font-size: 1rem;
}

.team-name {
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 10px;
  box-sizing: border-box;
  border-left: 3px #02a065 solid;
}

.no-active {
  color: #A4A0A0;
}

.input-team {
  outline: 0;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  display: inline-block;
}

.team-bg-input {
  background: #f2f2f2;
}

.input-team input {
  background: #fff;
  overflow-x: auto;
  width: 100%;
  box-sizing: border-box;
  padding: 7px;
  border: 1px #BDBDBD solid;
  border-radius: 4px;
}

.i-team {
  padding: 7px 50px 7px 7px !important;
}

.input:focus {
  border-color: #26b4ff;
}

.input::placeholder {
  color: #BDBDBD;
  opacity: 1;
}

input:focus {
  outline: none;
}

.input-team span {
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
}
</style>
