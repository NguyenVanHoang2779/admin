<template>
  <div>
    <div class="ui-block">
      <b-row>
        <b-col md="6"><h4 class="ui-block-heading">Quản lý văn bản</h4></b-col>
        <b-col md="6" class="text-right" >
          <b-btn variant="outline-primary" v-b-modal.modal-document-type-manage v-if="hasAtLeastOnePermision()">
            <i class="ion ion-md-person"></i>
            Quản lý loại văn bản
          </b-btn>
          <b-btn variant="outline-primary" @click="notifyPermission()" v-else>
            <i class="ion ion-md-person"></i>
            Quản lý loại văn bản
          </b-btn>
          <b-btn variant="outline-info" v-b-modal.modal-user-manage v-if="hasAtLeastOnePermision()">
            <i class="ion ion-md-pricetag"></i>
            Quản lý User
          </b-btn>
          <b-btn variant="outline-info" @click="notifyPermission()" v-else>
            <i class="ion ion-md-pricetag"></i>
            Quản lý User
          </b-btn>
        </b-col>
      </b-row>
      <hr>
      <div class="mb-3">
        <b-form-row>
          <b-form-group label="Mã văn bản" class="col-md-2">
            <b-input type="text" placeholder="Mã văn bản" v-model="code"/>
          </b-form-group>
          <b-form-group label="Nguồn văn bản"  class="col-md-2">
            <b-form-select v-model="source" :options="optionSources"></b-form-select>
          </b-form-group>
          <b-form-group label="Loại văn bản" class="col-md-2">
            <multiselect
              v-model="type.selected"
              label="name"
              track-by="id"
              placeholder="Loại văn bản"
              :options="type.options"
              :multiple="false"
              group-label="type"
              group-values="documents"
              :group-select="false"
              :searchable="true"
              :loading="type.loading"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              selectLabel=""
              :internal-search="true"
              :clear-on-select="true"
              :close-on-select="true"
              :hide-selected="true">
              <span slot="noResult">Không có kết quả phù hợp</span>
              <span slot="noOptions">Không có dữ liệu</span>
            </multiselect>
          </b-form-group>
          <b-form-group label="Tên văn bản" class="col-md-2">
            <b-input type="text" placeholder="Tên văn bản" v-model="name"/>
          </b-form-group>
          <b-form-group label="Bộ phận phụ trách" class="col-md-2">
            <multi-select-department :departmentIds="departmentIds" @handleDepartmentSelected="handleDepartmentSelected" :auto-close="false" :hide-selected="true"></multi-select-department>
          </b-form-group>
          <b-form-group label="Tình trạng hiệu lực" class="col-md-2">
            <b-form-select size="md" @change="changeSelectStatusEffect" :options="optionStatusEffect" v-model="statusEffect" class="ui-block-heading"></b-form-select>
          </b-form-group>
        </b-form-row>
        <b-form-row>
          <b-form-group label="Phạm vi áp dụng" class="col-md-12">
            <b-row>
              <div class="col-md-2">
                <multiselect
                  class="custom-multiselect"
                  v-model="region.selected"
                  label="name"
                  track-by="id"
                  placeholder="Chọn miền"
                  :options="region.options"
                  :multiple="true"
                  :searchable="true"
                  :loading="region.loading"
                  selectedLabel="Đã chọn"
                  deselectLabel="Bỏ chọn"
                  selectLabel=""
                  :internal-search="true"
                  :clear-on-select="true"
                  :close-on-select="false"
                  :hide-selected="false">
                  <span slot="noResult">Không có kết quả phù hợp</span>
                  <span slot="noOptions">Không có dữ liệu</span>
                </multiselect>
              </div>
              <div class="col-md-2">
                <multi-select-province :province-ids="provinceIds" @handleProvinceSelected="handleSelectedProvince" :display-all="false" :limit-prop=99999 :auto-close="false" :hide-selected="true"></multi-select-province>
              </div>
              <div class="col-md-2">
                <multiselect
                  class="custom-multiselect"
                  v-model="district.selected"
                  label="name"
                  track-by="id"
                  placeholder="Chọn Quận/Huyện"
                  :options="district.options"
                  :multiple="true"
                  :searchable="true"
                  :loading="district.loading"
                  selectedLabel="Đã chọn"
                  deselectLabel="Bỏ chọn"
                  selectLabel=""
                  :internal-search="true"
                  :clear-on-select="true"
                  :close-on-select="false"
                  :hide-selected="false">
                  <span slot="noResult">Không có kết quả phù hợp</span>
                  <span slot="noOptions">Không có dữ liệu</span>
                </multiselect>
              </div>
              <div class="col-md-2">
                <multi-select-station :station-ids="stationIds" @handleStationSelected="handleSelectedStation" :auto-close="false" :hide-selected="true"></multi-select-station>
              </div>
              <div class="col-md-2">
                <multi-select-department :departmentIds="scopeDepartmentIds" @handleDepartmentSelected="handleScopeDepartmentSelected" :auto-close="false" :hide-selected="true"></multi-select-department>
              </div>
              <div class="col-md-2">
                <multi-select-position :positionIds="scopePositionIds" @handlePositionSelected="handleScopePositionSelected" :auto-close="false" :hide-selected="true"></multi-select-position>
              </div>
            </b-row>
          </b-form-group>
          <b-form-group label="Ngày bắt đầu hiệu lực" class="col-xl-3 col-md-3">
            <datepicker
              v-model="dateStartEffect"
              format="dd-MM-yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :clear-button="true"
              placeholder="Ngày bắt đầu hiệu lực"
            />
          </b-form-group>
          <b-form-group label="Ngày kết thúc hiệu lực" class="col-xl-3 col-md-3">
            <datepicker
              v-model="dateEndEffect"
              format="dd-MM-yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :clear-button="true"
              placeholder="Ngày kết thúc hiệu lực"
            />
          </b-form-group>
        </b-form-row>
        <b-form-row>
          <b-col md="12" class="text-right">
            <b-btn type="button" variant="primary" @click="currentPage = 1; search(true);"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
            <router-link :to="{name: 'document-add'}" v-if="hasAtLeastOnePermision()" class="btn btn-md btn-success ml-1"><i class="ion ion-md-add"></i> Thêm văn bản</router-link>
            <router-link :to="{name: 'document-add'}" v-else class="btn btn-md btn-success ml-1" v-on:click.native="notifyPermission()" event=""><i class="ion ion-md-add"></i> Thêm văn bản</router-link>
          </b-col>
        </b-form-row>
      </div>
      <div class="mb-3">
        <div class="table-responsive">
          <b-card no-body>
            <table class="table mb-0 table-bordered table-striped">
              <thead>
              <tr class="bg-header">
                <th>STT</th>
                <th>Mã văn bản</th>
                <th>Tên văn bản</th>
                <th>Phiên bản</th>
                <th>Tình trạng</th>
                <th>Phạm vi áp dụng</th>
                <th>Loại VB</th>
                <!--<th>Nguồn văn bản</th>-->
                <th>Bộ phận phụ trách</th>
                <!--<th>Mức độ bảo mật</th>-->
                <th>Ngày bắt đầu - Ngày hết hạn</th>
                <th>Hành động</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(document, index) in documents" :key="index">
                <td>{{(currentPage - 1) * perPage + index + 1}}</td>
                <td>{{document.code}}</td>
                <td>{{document.name}}</td>
                <td>{{document.version}}</td>
                <td v-if="document.status_effect == 1" class="bg-red">{{getStatusEffectName(document.status_effect)}}</td>
                <td v-else-if="document.status_effect == 2" class="bg-blue">{{getStatusEffectName(document.status_effect)}}</td>
                <td v-else>{{getStatusEffectName(document.status_effect)}}</td>
                <td>
                  {{getScopeAllow(document)}}<span class="scope-except" v-if="getScopeExcept(document)"> Ngoại trừ </span> {{getScopeExcept(document)}}
                </td>
                <td>{{getNameById (document.type, documentTypes)}}</td>
                <!--<td>{{getSourceName(document.source)}}</td>-->
                <td>{{getNameByIds (document.department, departmentList)}}</td>
                <!--<td>{{getSecurityLevel(document.security_level)}}</td>-->
                <td v-if="document.date_start_effect || document.date_end_effect">
                  <span v-if="document.date_start_effect && document.date_start_effect !== '0000-00-00 00:00:00'">{{moment(document.date_start_effect).format('DD/MM/YYYY')}}</span> - <span v-if="document.date_end_effect && document.date_end_effect !== '0000-00-00 00:00:00'">{{moment(document.date_end_effect).format('DD/MM/YYYY')}}</span>
                </td>
                <td v-else>-</td>
                <td style="min-width: 120px">
                  <div class="text-center w-100 document-action">
                    <span @click="detailDocument(document)"><i class="ion ion-ios-eye"></i></span>
                    <span @click="downloadDocument(document.id)"><i class="ion ion-md-cloud-download"></i></span>
                    <router-link :to="{name: 'document-edit', params: { id: document.id }}" v-if="hasTheRightPermision(document.document_type)"><i class="ion ion-md-create"></i></router-link>
                    <router-link :to="{name: 'document-edit', params: { id: document.id }}" v-else v-on:click.native="notifyPermission()" event=""><i class="ion ion-md-create"></i></router-link>
                    <span @click="deleteDocument(document)"><i class="ion ion-md-trash"></i></span>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="mt-3" v-if="totalPages > 1">
              <b-row>
                <b-col>
                  <b-pagination
                    :total-rows="totalItems"
                    v-model="currentPage"
                    :per-page="perPage"
                    v-on:input="search"
                    align="center"
                  />
                </b-col>
              </b-row>
            </div>
          </b-card>
        </div>
      </div>
    </div>
    <modal-document-type-manage :permissionDocument="permissionDocument"></modal-document-type-manage>
    <modal-user-manage :permissionDocument="permissionDocument"></modal-user-manage>
  </div>
</template>

<style lang="scss" scoped>
  table tr {
    background-color: #fff;
  }
  .bg-header {
    background-color: #26b4fd;
    color: #fff;
  }
  .bg-red {
    font-weight: 550;
    color: #ff0000;
    background-color: #fff;
  }
  .bg-blue {
    font-weight: 550;
    color: #02bc77;
    background-color: #fff;
  }
  .scope-except {
    color: #00B177;
  }
  .document-action {
    span {
      cursor: pointer;
    }
    .ion-ios-eye {
      color: #02bc77;
    }
    .ion-md-trash {
      color: #ff0000;
    }
  }
</style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<script>
import documentService from 'domain/services/document-service'
import profileService from 'domain/services/profile-service'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectModule from 'components/elements/common/SingleSelectModule'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import ModalDocumentTypeManage from './ModalDocumentTypeManage'
import ModalUserManage from './ModalUserManage'
import commonHelper from 'infrastructures/helpers/common-helpers'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import Document from 'domain/entities/Document'
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import axios from 'axios'

export default {
  name: 'document-manage',
  components: {
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectPosition,
    SingleSelectDepartment,
    SingleSelectModule,
    MultiSelectProvince,
    MultiSelectStation,
    MultiSelectPosition,
    Multiselect,
    ModalDocumentTypeManage,
    ModalUserManage,
    MultiSelectDepartment,
    commonHelper,
    flatPickr,
    Datepicker
  },

  data: () => ({
    code: '',
    source: 0,
    name: '',
    statusEffect: 0,
    optionStatusEffect: Document.statusEffectOptions,
    optionSources: Document.sourceOptions,
    type: {
      loading: false,
      options: [],
      selected: []
    },
    region: {
      loading: false,
      options: [],
      selected: []
    },
    provinceIds: '',
    district: {
      loading: false,
      options: [],
      selected: []
    },
    provinceList: [],
    stationList: [],
    departmentList: [],
    positionList: [],
    stationIds: '',
    positionIds: '',
    departmentIds: '',
    scopeEffect: '',
    scopeDepartmentIds: null,
    scopePositionIds: null,
    dateStartEffect: '',
    dateEndEffect: '',
    currentPage: 1,
    totalItems: 0,
    perPage: Document.PER_PAGE,
    documents: [],
    permissionDocument: {},
    documentTypes: {},
    cachePositionKey: 'allPosition'
  }),

  created () {
    this.checkPermissionFull()
    this.getListTypes()
    this.getRegions()
    this.getProvinces()
    this.getDistrict()
    this.getStations()
    this.getDepartments()
    this.getPositions()
    this.search()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {
  },

  methods: {
    moment (data) {
      return moment(data)
    },

    notifyPermission () {
      commonHelper.showMessage('Bạn không có quyền thực hiện thao tác này!', 'error')
    },

    handleSelectedModule (option) {
      this.moduleId = option ? option.id : null
    },

    changeSelectStatusEffect (option) {
      this.statusEffect = option
    },

    // lấy danh sách miền
    getRegions () {
      this.region.loading = true
      documentService.apiGetRegions().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.region.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách miền', 'error')
      }).then(() => {
        this.region.loading = false
      })
    },

    // lấy danh sách tỉnh thành
    getProvinces () {
      documentService.apiGetProvinces().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.provinceList = response.data.data
            sessionStorage.setItem('allProvinces', JSON.stringify(this.provinceList))
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh thành', 'error')
      })
    },

    getDistrict () {
      this.$startLoading()
      documentService.apiGetDistricts()
        .then(res => {
          if (res.data.success) {
            this.district.options = res.data.data
          }
        }).then(() => {
          this.$stopLoading()
        })
    },

    getStations () {
      documentService.apiGetStations()
        .then((res) => {
          if (res.data.success) {
            this.stationList = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getDepartments () {
      if (sessionStorage.getItem('allDepartment')) {
        this.departmentList = JSON.parse(sessionStorage.getItem('allDepartment'))
        return
      }
      profileService.getDepartmentList()
        .then((res) => {
          if (res.data.success) {
            this.departmentList = res.data.data
            sessionStorage.setItem('allDepartment', JSON.stringify(this.departmentList))
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getPositions: function () {
      if (sessionStorage.getItem(this.cachePositionKey)) {
        this.positionList = JSON.parse(sessionStorage.getItem(this.cachePositionKey))
        return
      }
      profileService.getPositionList()
        .then((res) => {
          if (res.data.success) {
            this.positionList = res.data.data
            sessionStorage.setItem(this.cachePositionKey, JSON.stringify(this.positionList))
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    search: function (actionSearch = false) {
      this.appLoading = true
      this.$startLoading()
      let params = {
        code: this.code,
        source: this.source,
        type: this.type.selected.id,
        name: this.name,
        department: this.departmentIds,
        status_effect: this.statusEffect,
        page: this.currentPage,
        limit: this.perPage,
        scope_region: this.region.selected ? this.region.selected.map((item) => item.id).toString() : '',
        scope_province: this.provinceIds,
        scope_district: this.district.selected ? this.district.selected.map((item) => item.id).toString() : '',
        scope_station: this.stationIds,
        scope_department: this.scopeDepartmentIds,
        scope_position: this.scopePositionIds
      }
      if (actionSearch === true) {
        params.is_tracking = true
        params.action_search = true
      } else {
        if (!localStorage.getItem('accessDocument') || (Date.now() - localStorage.getItem('accessDocument')) > 600000 // 10 phút
        ) {
          params.is_tracking = true
          localStorage.setItem('accessDocument', Date.now())
        }
      }
      if (this.dateStartEffect) {
        params.date_start_effect = moment(this.dateStartEffect).format('YYYY-MM-DD')
      }
      if (this.dateEndEffect) {
        params.date_end_effect = moment(this.dateEndEffect).format('YYYY-MM-DD')
      }
      documentService.getAll(params)
        .then(res => {
          if (res.data.success) {
            this.documents = res.data.data
            this.totalItems = res.data.total
            if (this.totalItems === 0) {
              this.documents = []
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    checkPermissionFull: function () {
      documentService.checkPermissionFull()
        .then(res => {
          if (res.data.success) {
            this.permissionDocument = res.data.data
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    handleSelectedProvince: function (option) {
      this.provinceIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleSelectedStation: function (option) {
      this.stationIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopeDepartmentSelected: function (option) {
      this.scopeDepartmentIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopePositionSelected: function (option) {
      this.scopePositionIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleSelectedPosition: function (option) {
      this.positionIds = option ? option.id : ''
    },

    handlePositionSelected: function (option) {
      this.positionIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleDepartmentSelected: function (option) {
      this.departmentIds = option ? option.map((item) => item.id).toString() : ''
    },

    downloadDocument (documentId) {
      documentService.download({id: documentId, is_tracking: true})
        .then(res => {
          if (res.data.success) {
            axios({
              url: res.data.data,
              method: 'GET',
              responseType: 'blob'
            }).then((response) => {
              let fileName = response.config.url.split('\\').pop().split('/').pop()
              let fileURL = window.URL.createObjectURL(new Blob([response.data]))
              let fileLink = document.createElement('a')

              fileLink.href = fileURL
              fileLink.setAttribute('download', fileName)
              document.body.appendChild(fileLink)
              fileLink.click()
            })
            // window.location = res.data.data
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'error')
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình download.'
          })
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    detailDocument (document) {
      if (this.hasTheRightPermision(document.document_type)) {
        this.$router.push({name: 'document-detail', params: {id: document.id, is_tracking: true}})
      } else {
        documentService.checkPermissionView({documentId: document.id})
          .then(res => {
            if (res.data.success) {
              if (res.data.data) {
                this.$router.push({name: 'document-detail', params: {id: document.id, is_tracking: true}})
              } else {
                this.notifyPermission()
              }
            } else {
              this.$notify({
                group: 'default',
                type: 'bg-warning text-dark',
                title: 'Thông báo',
                text: res.data.message
              })
            }
          })
          .catch(e => {
            console.log(e)
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: 'Có lỗi xảy ra.'
            })
          })
          .then(() => {
            this.appLoading = false
            this.$stopLoading()
          })
      }
    },

    deleteDocument (document) {
      if (!this.hasTheRightPermision(document.document_type)) {
        this.notifyPermission()
        return
      }
      if (!confirm(`Bạn có chắc chắn muốn xóa văn bản ${document.name} ?`)) {
        return
      }
      this.$startLoading()
      documentService.remove({id: document.id})
        .then(res => {
          if (res.data.success) {
            this.$notify({
              group: 'default',
              type: 'bg-success text-white',
              title: 'Thông báo',
              text: 'Xóa văn bản thành công!'
            })
            this.search()
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: res.data.message
            })
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình xóa văn bản.'
          })
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    getListTypes () {
      this.type.loading = true
      documentService.getListDocumentType().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.type.options = Object.keys(response.data.data).map((docType) => {
              if (docType === 'global') {
                return {
                  type: 'Văn bản chung',
                  documents: response.data.data[docType]
                }
              }
              if (docType === 'legislation') {
                return {
                  type: 'Văn bản pháp chế',
                  documents: response.data.data[docType]
                }
              }
            })

            this.documentTypes = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lấy loại văn bản', 'error')
      }).then(() => {
        this.type.loading = false
      })
    },

    getStatusEffectName (statusEffectId) {
      return Document.getStatusEffectName(statusEffectId)
    },

    getSourceName (sourceId) {
      return Document.getSourceName(sourceId)
    },

    // getSecurityLevel (securityLevelId) {
    //   return Document.getSecurityLevel(securityLevelId)
    // },

    getNameById (id, options) {
      const formatOptions = [].concat.apply([], Object.values(options))
      const option = formatOptions.find(op => (op.id === id))
      if (option) {
        return option.name
      } else {
        return '-'
      }
    },

    getNameByIds (ids, options) {
      let nameDisplay = ''
      ids.split(',').forEach(id => {
        if (id) {
          let option = options.find(op => ('' + op.id === id))
          if (option) {
            nameDisplay += option.name + ', '
          }
        }
      })
      return nameDisplay.slice(0, -2)
    },

    getScopeAllow (document) {
      let dataScopeAllow = ''
      if (document.scope_allow_region) {
        dataScopeAllow += 'Miền: ' + this.getNameByIds(document.scope_allow_region, this.region.options) + '. '
      }
      if (document.scope_allow_province) {
        dataScopeAllow += 'Tỉnh thành: ' + this.getNameByIds(document.scope_allow_province, this.provinceList) + '. '
      }
      if (document.scope_allow_district) {
        dataScopeAllow += 'Quận/Huyện: ' + this.getNameByIds(document.scope_allow_district, this.district.options) + '. '
      }
      if (document.scope_allow_station) {
        dataScopeAllow += 'Kho: ' + this.getNameByIds(document.scope_allow_station, this.stationList) + '. '
      }
      if (document.scope_allow_department) {
        dataScopeAllow += 'Bộ phận: ' + this.getNameByIds(document.scope_allow_department, this.departmentList) + '. '
      }
      if (document.scope_allow_position) {
        dataScopeAllow += 'Vị trí: ' + this.getNameByIds(document.scope_allow_position, this.positionList) + '. '
      }

      if (!dataScopeAllow) {
        return 'Cả nước'
      } else {
        return dataScopeAllow.slice(0, -2)
      }
    },

    getScopeExcept (document) {
      let dataScopeExcept = ''
      if (document.scope_except_region) {
        dataScopeExcept += 'Miền: ' + this.getNameByIds(document.scope_except_region, this.region.options) + '. '
      }
      if (document.scope_except_province) {
        dataScopeExcept += 'Tỉnh thành: ' + this.getNameByIds(document.scope_except_province, this.provinceList) + '. '
      }
      if (document.scope_except_district) {
        dataScopeExcept += 'Quận/Huyện: ' + this.getNameByIds(document.scope_except_district, this.district.options) + '. '
      }
      if (document.scope_except_station) {
        dataScopeExcept += 'Kho: ' + this.getNameByIds(document.scope_except_station, this.stationList) + '. '
      }
      if (document.scope_except_department) {
        dataScopeExcept += 'Bộ phận: ' + this.getNameByIds(document.scope_except_department, this.departmentList) + '. '
      }
      if (document.scope_except_position) {
        dataScopeExcept += 'Vị trí: ' + this.getNameByIds(document.scope_except_position, this.positionList) + '. '
      }
      return dataScopeExcept
    },

    hasAtLeastOnePermision () {
      if (Object.values(this.permissionDocument).indexOf(true) > -1) {
        return true
      }
      return false
    },

    hasTheRightPermision (documentType) {
      return this.permissionDocument[documentType]
    }
  }
}
</script>
