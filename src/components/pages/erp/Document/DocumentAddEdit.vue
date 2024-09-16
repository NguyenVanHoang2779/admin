<template>
    <div class="update-master">
        <div class="top-title">
            <h2 v-if="!isEdit">Thêm văn bản</h2>
            <h2 v-else>Cập nhật văn bản</h2>
            <div class="top-title__right-button">
                <b-btn v-if="!this.$route.params.id" type="button" variant="btn btn-primary" @click="addDocument">
                    <i class="ion ion-ios-add"></i> Thêm văn bản
                </b-btn>
                <b-btn v-else type="button" variant="btn btn-info" @click="updateDocument">
                    <i class="icon ion-md-archive"></i> Cập nhật
                </b-btn>
                <router-link :to="{name: 'manage-document'}" class="btn btn-default"><i class="ion ion-ios-return-left"></i> Quay lại</router-link>
            </div>
        </div>
        <div>
            <div class="row">
                <div class="col-md-12">
                    <div class="card mb-4">
                        <div class="row no-gutters">
                            <div class="col-md-12 col-lg-12 col-xl-12">
                                <h6 class="card-header ttcn-header">
                                    <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-ttcn><i class="ion  ion-ios-add-circle"></i> Thông tin văn bản</a>
                                </h6>
                                <b-collapse id="accordion-ttcn" visible>
                                  <div class="card-body">
                                      <b-form-row>
                                          <div class="col-md-12 col-lg-12 col-xl-12">
                                              <b-form-row>
                                                <b-form-radio-group
                                                  v-model="status"
                                                  :options="optionStatus"
                                                  class="mb-3"
                                                  value-field="item"
                                                  text-field="name"
                                                  disabled-field="notEnabled"
                                                ></b-form-radio-group>
                                              </b-form-row>
                                              <b-form-row>
                                                <b-form-group v-if="isEdit" label="Văn bản hiện tại" class="col-xl-4 col-md-4">
                                                  <div class="link-current">
                                                    <a :href="url" target="_blank">{{nameCurrent}}</a>
                                                  </div>
                                                </b-form-group>
                                                <b-form-group  class="col-xl-4 col-md-4">
                                                  <template v-if="isEdit" slot='label'>
                                                    Tải lên văn bản mới
                                                  </template>
                                                  <template v-else slot='label'>
                                                    Tải lên văn bản mới <span class='red-text'>(*)</span>
                                                  </template>
                                                  <b-form-file
                                                    v-model="uploadFile"
                                                    accept=".xlsx, .xls, .pdf, .doc, .docx"
                                                    placeholder="Tải lên văn bản mới..."
                                                  ></b-form-file>
                                                </b-form-group >
                                                <b-form-group  class="col-xl-4 col-md-4">
                                                  <div v-if="status === '2'" class="d-block">
                                                    <b-form-group label="Văn bản bị thay thế" >
                                                      <select-document :document="documentReplaced" :documentId="this.$route.params.id"  @onChange="selectedDocument" :multiple="true"></select-document>
                                                    </b-form-group>
                                                  </div>
                                                  <div v-else class="d-none">
                                                    <b-form-group label="Văn bản bị thay thế">
                                                      <select-document :document="documentReplaced" :documentId="this.$route.params.id" @onChange="selectedDocument" :multiple="true"></select-document>
                                                    </b-form-group>
                                                  </div>
                                                </b-form-group>
                                              </b-form-row>
                                              <b-form-row>
                                                  <b-form-group class="col-xl-6 col-md-6">
                                                    <template slot='label'>
                                                      Mã số <span class='red-text'>(*)</span>
                                                    </template>
                                                    <b-form-input
                                                        v-model="code"
                                                        name="code"
                                                        v-validate="'required'"
                                                        placeholder="Mã số"
                                                        :class="{'is-danger': errors.has('code')}"
                                                    >
                                                    </b-form-input>
                                                    <span v-show="errors.firstRule('code') == 'required'" class="help is-danger">Không để trống trường này</span>
                                                  </b-form-group >
                                                  <b-form-group class="col-xl-6 col-md-6">
                                                    <template slot='label'>
                                                      Mức độ bảo mật <span class='red-text'>(*)</span>
                                                    </template>
                                                    <b-form-select :disabled="isDisableLegislationType" v-model="securityLevel" :options="optionSecurityLevels"></b-form-select>
                                                  </b-form-group>
                                              </b-form-row>
                                              <b-form-row>
                                                <b-form-group class="col-xl-6 col-md-6">
                                                  <template slot='label'>
                                                    Tên văn bản <span class='red-text'>(*)</span>
                                                  </template>
                                                  <b-form-input
                                                    v-model="name"
                                                    name="name"
                                                    v-validate="'required'"
                                                    placeholder="Tên văn bản"
                                                    :class="{'is-danger': errors.has('name')}"
                                                  >
                                                  </b-form-input>
                                                  <span v-show="errors.firstRule('name') == 'required'" class="help is-danger">Không để trống trường này</span>
                                                </b-form-group >
                                                <b-form-group class="col-xl-6 col-md-6">
                                                  <template slot='label'>
                                                    Loại văn bản <span class='red-text'>(*)</span>
                                                  </template>
                                                  <multiselect
                                                    v-model="type.selected"
                                                    label="name"
                                                    track-by="id"
                                                    placeholder="Loại văn bản"
                                                    :options="type.options"
                                                    group-label="type"
                                                    group-values="documents"
                                                    :group-select="false"
                                                    :multiple="false"
                                                    :searchable="true"
                                                    :loading="type.loading"
                                                    selectedLabel="Đã chọn"
                                                    deselectLabel="Bỏ chọn"
                                                    selectLabel=""
                                                    :internal-search="false"
                                                    :clear-on-select="false"
                                                    :close-on-select="true"
                                                    :hide-selected="false">
                                                    <span slot="noResult">Không có kết quả phù hợp</span>
                                                    <span slot="noOptions">Không có dữ liệu</span>
                                                  </multiselect>
                                                </b-form-group>
                                              </b-form-row>
                                              <b-form-row>
                                                <b-form-group class="col-xl-6 col-md-6">
                                                  <template slot='label'>
                                                    Phiên bản <span class='red-text'>(*)</span>
                                                  </template>
                                                  <b-form-input
                                                    v-model="version"
                                                    name="version"
                                                    v-validate="'required'"
                                                    placeholder="Phiên bản"
                                                    :class="{'is-danger': errors.has('version')}"
                                                  >
                                                  </b-form-input>
                                                  <span v-show="errors.firstRule('version') == 'required'" class="help is-danger">Không để trống trường này</span>
                                                </b-form-group >
                                                <b-form-group class="col-xl-6 col-md-6">
                                                  <template slot='label'>
                                                    Nguồn văn bản <span class='red-text'>(*)</span>
                                                  </template>
                                                  <b-form-select v-model="source" :options="optionSources"></b-form-select>
                                                </b-form-group >
                                              </b-form-row>
                                              <b-form-row>
                                                <b-form-group class="col-xl-6 col-md-6">
                                                  <template slot='label'>
                                                    Tình trạng hiệu lực <span class='red-text'>(*)</span>
                                                  </template>
                                                  <b-form-select v-model="statusEffect" :options="optionStatusEffects"></b-form-select>
                                                </b-form-group>
                                                <b-form-group class="col-xl-6 col-md-6">
                                                  <template slot='label'>
                                                    Người phê duyệt <span class='red-text'>(*)</span>
                                                  </template>
                                                  <multi-select-user :users="user"  @onChange="selectedUser" :multi="false"></multi-select-user>
                                                </b-form-group >
                                              </b-form-row>
                                                <b-form-row>
                                                  <b-form-group label="Phạm vi áp dụng (Được phép)" class="col-xl-6 col-md-6">
                                                    <multi-select-region :auto-close="true" :hide-selected="true" :regions="scopeAllowRegionIds" @handleSelectedRegion="handleScopeAllowSelectedRegion"></multi-select-region><br/>
                                                    <multi-select-province :province-ids="scopeAllowProvinceIds" @handleProvinceSelected="handleScopeAllowProvinceSelected" :display-all="false" :limit-prop=99999 :auto-close="false" :hide-selected="true"></multi-select-province><br/>
                                                    <multiselect class="multiselect-success"
                                                       v-model="scopeAllowDistrictIds.selected"
                                                       :options="scopeAllowDistrictIds.options"
                                                       placeholder="Chọn Quận/huyện"
                                                       selectedLabel="Đã chọn"
                                                       deselectLabel="Bỏ chọn"
                                                       selectLabel="Chọn"
                                                       track-by="name"
                                                       label="name"
                                                       :loading="scopeAllowDistrictLoading"
                                                       :disabled="false"
                                                       :searchable="true"
                                                       :multiple="true"
                                                       :hide-selected="true"
                                                       :allow-empty="true"
                                                       :close-on-select="false"
                                                    >
                                                      <span slot="noResult">Rất tiếc, không tìm thấy!</span>
                                                    </multiselect><br/>
                                                    <multi-select-station :station-ids="scopeAllowStationIds" @handleStationSelected="handleScopeAllowStationSelected" :auto-close="false" :hide-selected="true"></multi-select-station><br/>
                                                    <multi-select-department :department-ids="scopeAllowDepartmentIds" @handleDepartmentSelected="handleScopeAllowDepartmentSelected" :auto-close="false" :hide-selected="true"></multi-select-department><br/>
                                                    <multi-select-position :position-ids="scopeAllowPositionIds" @handlePositionSelected="handleScopeAllowPositionSelected" :auto-close="false" :hide-selected="true"></multi-select-position>
                                                  </b-form-group >
                                                  <b-form-group label="Phạm vi áp dụng (Ngoại trừ)" class="col-xl-6 col-md-6">
                                                    <multi-select-region
                                                      :auto-close="true"
                                                      :hide-selected="true"
                                                      :regions="scopeExceptRegionIds"
                                                      @handleSelectedRegion="handleScopeExceptSelectedRegion"
                                                    ></multi-select-region><br/>
                                                    <multi-select-province :province-ids="scopeExceptProvinceIds" @handleProvinceSelected="handleScopeExceptProvinceSelected" :display-all="false" :limit-prop=99999 :auto-close="false" :hide-selected="true"></multi-select-province><br/>
                                                    <multiselect class="multiselect-success"
                                                       v-model="scopeExceptDistrictIds.selected"
                                                       :options="scopeExceptDistrictIds.options"
                                                       placeholder="Chọn Quận/huyện"
                                                       selectedLabel="Đã chọn"
                                                       deselectLabel="Bỏ chọn"
                                                       selectLabel="Chọn"
                                                       track-by="name"
                                                       label="name"
                                                       :loading="scopeExceptDistrictLoading"
                                                       :disabled="false"
                                                       :searchable="true"
                                                       :multiple="true"
                                                       :hide-selected="true"
                                                       :allow-empty="true"
                                                       :close-on-select="false"
                                                    >
                                                      <span slot="noResult">Rất tiếc, không tìm thấy!</span>
                                                    </multiselect><br/>
                                                    <multi-select-station :station-ids="scopeExceptStationIds" @handleStationSelected="handleScopeExceptStationSelected" :auto-close="false" :hide-selected="true"></multi-select-station><br/>
                                                    <multi-select-department :department-ids="scopeExceptDepartmentIds" @handleDepartmentSelected="handleScopeExceptDepartmentSelected" :auto-close="false" :hide-selected="true"></multi-select-department><br/>
                                                    <multi-select-position :position-ids="scopeExceptPositionIds" @handlePositionSelected="handleScopeExceptPositionSelected" :auto-close="false" :hide-selected="true"></multi-select-position>
                                                  </b-form-group >
                                                </b-form-row>
                                              <b-form-row>
                                                <b-form-group class="col-xl-4 col-md-4">
                                                  <template slot='label'>
                                                    Bộ phận phụ trách <span class='red-text'>(*)</span>
                                                  </template>
                                                  <multi-select-department @handleDepartmentSelected="handleDepartmentSelected" :department-ids="departmentIds" :auto-close="false" :hide-selected="true"></multi-select-department>
                                                </b-form-group>
                                                <b-form-group class="col-xl-4 col-md-4">
                                                  <template slot='label'>
                                                    Ngày bắt đầu hiệu lực <span class='red-text'>(*)</span>
                                                  </template>
                                                  <datepicker
                                                    v-model="dateStart"
                                                    format="dd-MM-yyyy"
                                                    :bootstrapStyling="true"
                                                    :monday-first="true"
                                                    :full-month-name="true"
                                                    :calendar-button="true"
                                                    calendar-button-icon="ion ion-md-calendar"
                                                    :clear-button="true"
                                                  />
                                                </b-form-group >
                                                <b-form-group label="Ngày hết hạn hiệu lực" class="col-xl-4 col-md-4">
                                                  <datepicker
                                                    v-model="dateEnd"
                                                    format="dd-MM-yyyy"
                                                    :bootstrapStyling="true"
                                                    :monday-first="true"
                                                    :full-month-name="true"
                                                    :calendar-button="true"
                                                    calendar-button-icon="ion ion-md-calendar"
                                                    :clear-button="true"
                                                  />
                                                </b-form-group >
                                              </b-form-row>
                                          </div>
                                      </b-form-row>
                                  </div>
                                </b-collapse>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="card mb-4">
                  <div class="row no-gutters">
                    <div class="col-md-12 col-lg-12 col-xl-12">
                      <h6 class="card-header vblq-header">
                        <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-vblq><i class="ion  ion-ios-add-circle"></i> Văn bản liên quan</a>
                      </h6>
                      <b-collapse id="accordion-vblq" visible>
                        <div class="card-body">
                          <select-document placeholder="Chọn Văn bản liên quan" :document="documentReplated" :documentId="this.$route.params.id" @onChange="selectedDocumentReplate" :multiple="true"></select-document>
                        </div>
                      </b-collapse>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="card mb-4">
                  <div class="row no-gutters">
                    <div class="col-md-12 col-lg-12 col-xl-12">
                      <h6 class="card-header pq-header">
                        <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-pq><i class="ion  ion-ios-add-circle"></i> Phân quyền </a>
                      </h6>
                      <b-collapse id="accordion-pq" visible>
                        <div class="card-body">
                          <b-form-row>
                            <div class="col-md-12 col-lg-12 col-xl-12">
                              <b-form-row>
                                <b-form-group label="Được xem" class="col-xl-6 col-md-6">
                                  <multi-select-region :isDisabled="isDisableLegislationType" :auto-close="true" :hide-selected="true" :regions="allowRegionIds" @handleSelectedRegion="handleAllowSelectedRegion"></multi-select-region><br/>
                                  <multi-select-province :isDisabled="isDisableLegislationType" :province-ids="allowProvinceIds" @handleProvinceSelected="handleAllowProvinceSelected" :display-all="false" :limit-prop=99999 :auto-close="false" :hide-selected="true"></multi-select-province><br/>
                                  <multiselect class="multiselect-success"
                                     v-model="allowDistrictIds.selected"
                                     :options="allowDistrictIds.options"
                                     placeholder="Chọn Quận/huyện"
                                     selectedLabel="Đã chọn"
                                     deselectLabel="Bỏ chọn"
                                     selectLabel="Chọn"
                                     track-by="name"
                                     label="name"
                                     :loading="allowDistrictLoading"
                                     :disabled="isDisableLegislationType"
                                     :searchable="true"
                                     :multiple="true"
                                     :hide-selected="true"
                                     :allow-empty="true"
                                     :close-on-select="false"
                                  >
                                    <span slot="noResult">Rất tiếc, không tìm thấy!</span>
                                  </multiselect><br/>
                                  <multi-select-station :isDisabled="isDisableLegislationType" :station-ids="allowStationIds" @handleStationSelected="handleAllowStationSelected" :auto-close="false" :hide-selected="true"></multi-select-station><br/>
                                  <multi-select-department :disabled="isDisableLegislationType" :department-ids="allowDepartmentIds" @handleDepartmentSelected="handleAllowDepartmentSelected" :auto-close="false" :hide-selected="true"></multi-select-department><br/>
                                  <multi-select-position :disabled="isDisableLegislationType" :position-ids="allowPositionIds" @handlePositionSelected="handleAllowPositionSelected" :auto-close="false" :hide-selected="true"></multi-select-position><br/>
                                  <multi-select-user :users="allowUserIds" @onChange="handleAllowUserSelected" :multi="true" ></multi-select-user>
                                </b-form-group >
                                <b-form-group label="Ngoại trừ (Không được xem)" class="col-xl-6 col-md-6">
                                  <multi-select-region :isDisabled="isDisableLegislationType" :auto-close="true" :hide-selected="true" :regions="exceptRegionIds" @handleSelectedRegion="handleExceptSelectedRegion"></multi-select-region><br/>
                                  <multi-select-province :isDisabled="isDisableLegislationType" :province-ids="exceptProvinceIds" @handleProvinceSelected="handleExceptProvinceSelected" :display-all="false" :limit-prop=99999 :auto-close="false" :hide-selected="true"></multi-select-province><br/>
                                  <multiselect class="multiselect-success"
                                     v-model="exceptDistrictIds.selected"
                                     :options="exceptDistrictIds.options"
                                     placeholder="Chọn Quận/huyện"
                                     selectedLabel="Đã chọn"
                                     deselectLabel="Bỏ chọn"
                                     selectLabel="Chọn"
                                     track-by="name"
                                     label="name"
                                     :loading="exceptDistrictLoading"
                                     :disabled="isDisableLegislationType"
                                     :searchable="true"
                                     :multiple="true"
                                     :hide-selected="true"
                                     :allow-empty="true"
                                     :close-on-select="false"
                                  >
                                    <span slot="noResult">Rất tiếc, không tìm thấy!</span>
                                  </multiselect><br/>
                                  <multi-select-station :isDisabled="isDisableLegislationType" :station-ids="exceptStationIds" @handleStationSelected="handleExceptStationSelected" :auto-close="false" :hide-selected="true"></multi-select-station><br/>
                                  <multi-select-department :disabled="isDisableLegislationType" :department-ids="exceptDepartmentIds" @handleDepartmentSelected="handleExceptDepartmentSelected" :auto-close="false" :hide-selected="true"></multi-select-department><br/>
                                  <multi-select-position :disabled="isDisableLegislationType" :position-ids="exceptPositionIds" @handlePositionSelected="handleExceptPositionSelected" :auto-close="false" :hide-selected="true"></multi-select-position><br/>
                                  <multi-select-user :users="exceptUserIds" @onChange="handleExceptUserSelected" :multi="true" ></multi-select-user>
                                </b-form-group >
                              </b-form-row>
                            </div>
                          </b-form-row>
                        </div>
                      </b-collapse>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer border-0 text-center py-3">
                <b-btn v-if="this.$route.params.id == null" type="button" variant="btn btn-primary" @click="addDocument">
                    <i class="ion ion-ios-add"></i> Thêm văn bản
                </b-btn>
                <div v-else>
                    <b-btn type="button" variant="btn btn-info" @click="updateDocument">
                        <i class="icon ion-md-archive"></i> Cập nhật
                    </b-btn>
                    <router-link :to="{name: 'manage-document'}" class="btn btn-default"><i class="ion ion-ios-return-left"></i> Quay lại</router-link>
                </div>
            </div>
            <notifications group='add-emp'></notifications>
        </div>
    </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style lang="scss" scoped>
  @import "src/assets/sass/components/master-profile";
  .link-current {
    a {
      font-size: 15px;
      text-decoration: underline;
    }
  }
</style>

<script>
import documentService from 'domain/services/document-service'
import Multiselect from 'vue-multiselect'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectModule from 'components/elements/common/MultiSelectModule'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import MultiSelectUser from 'components/elements/document/MultiSelectUser'
import SelectDocument from 'components/elements/document/SelectDocument'
import Datepicker from 'vuejs-datepicker'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Document from 'domain/entities/Document'
import moment from 'moment'

Vue.use(VeeValidate)

export default {
  name: 'document-edit',

  components: {
    Notification,
    Multiselect,
    MultiSelectRegion,
    MultiSelectProvince,
    MultiSelectStation,
    MultiSelectModule,
    MultiSelectDepartment,
    MultiSelectPosition,
    MultiSelectUser,
    Datepicker,
    SelectDocument,
    commonHelper
  },

  data: () => ({
    toggleLog: false,
    isLoading: false,
    notify: {
      message: '',
      class: '',
      title: ''
    },
    securityLevel: 0,
    statusEffect: 0,
    source: 0,
    status: 1,
    code: '',
    name: '',
    version: '',
    option_scope: {
      selected: null,
      options: Document.scopeOptions
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
    scopeStationIds: '',
    scopeDepartmentIds: '',
    user: '',
    uploadFile: null,
    moduleIds: '',
    departmentIds: '',
    departmentEffectIds: '',
    dateStart: '',
    dateEnd: '',
    documentReplated: '',
    documentReplaced: '',
    type: {
      loading: false,
      options: [],
      selected: []
    },
    optionStatus: Document.statusOptions,
    optionSecurityLevels: Document.securityLevelOptions,
    optionStatusEffects: Document.statusEffectOptions,
    optionSources: Document.sourceOptions,
    scopeAllowRegionIds: '',
    scopeAllowProvinceIds: '',
    scopeAllowDistrictIds: {
      loading: false,
      options: [],
      selected: []
    },
    scopeAllowStationIds: '',
    scopeAllowDepartmentIds: '',
    scopeAllowPositionIds: '',
    scopeAllowUserIds: '',
    scopeExceptRegionIds: '',
    scopeExceptProvinceIds: '',
    scopeExceptDistrictIds: {
      loading: false,
      options: [],
      selected: []
    },
    scopeExceptStationIds: '',
    scopeExceptDepartmentIds: '',
    scopeExceptPositionIds: '',
    scopeExceptUserIds: '',
    scopeAllowDistrictLoading: false,
    scopeExceptDistrictLoading: false,
    allowRegionIds: '',
    allowProvinceIds: '',
    allowDistrictIds: {
      loading: false,
      options: [],
      selected: []
    },
    allowStationIds: '',
    allowDepartmentIds: '',
    allowPositionIds: '',
    allowUserIds: '',
    exceptRegionIds: '',
    exceptProvinceIds: '',
    exceptDistrictIds: {
      loading: false,
      options: [],
      selected: []
    },
    exceptStationIds: '',
    exceptDepartmentIds: '',
    exceptPositionIds: '',
    exceptUserIds: '',
    allowDistrictLoading: false,
    exceptDistrictLoading: false,
    showReplace: false,
    url: '',
    nameCurrent: '',
    documentTypes: {},
    permissionDocument: {
      global: false,
      legislation: false
    },
    isDisableLegislationType: false
  }),

  computed: {
    isEdit: function () {
      return this.$route.params.id > 0
    },
    getScopeValue: function () {
      if (this.option_scope.selected) {
        return this.option_scope.selected.id
      }
    }
  },

  async created () {
    await this.checkPermissionFull()
    await this.getListTypes()
    await this.getDistrict()
    await this.getRegion()
    if (this.$route.params.id) {
      await this.getDocument()
    }
  },

  watch: {
    'type.selected': {
      handler: function (newValue, oldValue) {
        if (newValue && newValue.type === 'legislation') {
          this.securityLevel = 3
          this.isDisableLegislationType = true
          this.allowDepartmentIds = '16'
          this.allowPositionIds = '53'
        } else {
          this.isDisableLegislationType = false
        }
      },
      deep: true
    }
  },
  methods: {
    checkPermissionFull () {
      this.$startLoading()
      documentService.checkPermissionFull()
        .then(res => {
          if (res.data.success) {
            this.permissionDocument = res.data.data
            if (!this.hasAtLeastOnePermision(res.data.data)) {
              alert('Bạn không có quyền thực hiện thao tác này!', 'error')
              this.$router.push({ name: 'manage-document' })
            }
          }
        }).then(() => {
          this.$stopLoading()
        })
    },
    handlePositionSelected: function (option) {
      this.positionIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleDepartmentSelected: function (option) {
      this.departmentIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleAllowSelectedRegion (option) {
      this.allowRegionIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleAllowProvinceSelected: function (option) {
      this.allowProvinceIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleAllowDistrictSelected: function (option) {
      this.allowDistrictIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleAllowStationSelected: function (option) {
      this.allowStationIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleAllowDepartmentSelected: function (option) {
      this.allowDepartmentIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleAllowPositionSelected: function (option) {
      this.allowPositionIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleExceptSelectedRegion (option) {
      this.exceptRegionIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleExceptProvinceSelected: function (option) {
      this.exceptProvinceIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleExceptDistrictSelected: function (option) {
      this.exceptDistrictIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleExceptStationSelected: function (option) {
      this.exceptStationIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleExceptDepartmentSelected: function (option) {
      this.exceptDepartmentIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleExceptPositionSelected: function (option) {
      this.exceptPositionIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopeAllowSelectedRegion (option) {
      this.scopeAllowRegionIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopeAllowProvinceSelected: function (option) {
      this.scopeAllowProvinceIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopeAllowDistrictSelected: function (option) {
      this.scopeAllowDistrictIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopeAllowStationSelected: function (option) {
      this.scopeAllowStationIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopeAllowDepartmentSelected: function (option) {
      this.scopeAllowDepartmentIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopeAllowPositionSelected: function (option) {
      this.scopeAllowPositionIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopeExceptSelectedRegion (option) {
      this.scopeExceptRegionIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopeExceptProvinceSelected: function (option) {
      this.scopeExceptProvinceIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopeExceptDistrictSelected: function (option) {
      this.scopeExceptDistrictIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopeExceptStationSelected: function (option) {
      this.scopeExceptStationIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopeExceptDepartmentSelected: function (option) {
      this.scopeExceptDepartmentIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleScopeExceptPositionSelected: function (option) {
      this.scopeExceptPositionIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleAllowUserSelected: function (option) {
      this.allowUserIds = option || null
    },

    getAllowUserSelected: function (option) {
      return option ? option.map((item) => item.id).toString() : ''
    },

    handleExceptUserSelected: function (option) {
      this.exceptUserIds = option || null
    },

    getExceptUserSelected: function (option) {
      return option ? option.map((item) => item.id).toString() : ''
    },

    getDocumentReplacedSelected: function (option) {
      return option ? option.map((item) => item.id).toString() : ''
    },

    getDocumentRelatedSelected: function (option) {
      return option ? option.map((item) => item.id).toString() : ''
    },

    selectedUser (option) {
      this.user = option || null
    },

    selectedDocument (option) {
      this.documentReplaced = option || null
    },

    selectedDocumentReplate (option) {
      this.documentReplated = option || null
    },

    getDocument () {
      this.$startLoading()
      let dataRequest = {
        id: this.$route.params.id
      }
      documentService.get(dataRequest)
        .then(res => {
          if (res.data.success) {
            this.setData(res.data.data)
          } else {
            alert('Bạn không có quyền thực hiện thao tác này!', 'error')
            this.$router.push({ name: 'manage-document' })
          }
        }).then(() => {
          this.$stopLoading()
        })
    },

    async getDistrict () {
      this.$startLoading()
      await documentService.apiGetDistricts()
        .then(res => {
          if (res.data.success) {
            this.scopeAllowDistrictIds.options = res.data.data
            this.scopeExceptDistrictIds.options = res.data.data
            this.allowDistrictIds.options = res.data.data
            this.exceptDistrictIds.options = res.data.data
            this.district.options = res.data.data
          }
        }).then(() => {
          this.$stopLoading()
        })
    },

    async getRegion () {
      this.$startLoading()
      await documentService.apiGetRegions()
        .then(res => {
          if (res.data.success) {
            this.region.options = res.data.data
          }
        }).then(() => {
          this.$stopLoading()
        })
    },

    setData: function (data) {
      this.id = data.id
      this.status = data.status
      this.url = data.url
      this.documentReplaced = JSON.parse(JSON.stringify(data.listDocumentReplaceIdName))
      this.code = data.code
      this.securityLevel = data.security_level
      this.name = data.name
      this.nameCurrent = data.name
      this.type.selected = this.setSelectedDocumentType(this.documentTypes, data.type)
      this.version = data.version
      this.source = data.source
      this.statusEffect = data.status_effect
      this.user = {'id': data.approver, 'name': data.approverName}
      // Xóa dấu , lưu thêm vào CSDL
      if (data.department.substr(-1, 1) === ',' && data.department.substr(0, 1) === ',') {
        this.departmentIds = data.department.slice(1, -1)
      } else {
        this.departmentIds = data.department
      }
      if (data.date_start_effect && data.date_start_effect !== '0000-00-00 00:00:00') {
        this.dateStart = moment(data.date_start_effect).format('YYYY-MM-DD')
      }
      if (data.date_end_effect && data.date_end_effect !== '0000-00-00 00:00:00') {
        this.dateEnd = moment(data.date_end_effect).format('YYYY-MM-DD')
      }
      this.documentReplated = JSON.parse(JSON.stringify(data.listDocumentRelatedIdName))
      // Xóa dấu , lưu thêm vào CSDL
      if (data.scope_allow_region.substr(-1, 1) === ',' && data.scope_allow_region.substr(0, 1) === ',') {
        this.scopeAllowRegionIds = data.scope_allow_region.slice(1, -1)
      } else {
        this.scopeAllowRegionIds = data.scope_allow_region
      }
      if (data.scope_allow_province.substr(-1, 1) === ',' && data.scope_allow_province.substr(0, 1) === ',') {
        this.scopeAllowProvinceIds = data.scope_allow_province.slice(1, -1)
      } else {
        this.scopeAllowProvinceIds = data.scope_allow_province
      }
      if (data.scope_allow_district.substr(-1, 1) === ',' && data.scope_allow_district.substr(0, 1) === ',') {
        this.scopeAllowDistrictIds.selected = this.setSelectedOption(this.scopeAllowDistrictIds.options, data.scope_allow_district.slice(1, -1))
      } else {
        this.scopeAllowDistrictIds.selected = this.setSelectedOption(this.scopeAllowDistrictIds.options, data.scope_allow_district)
      }
      if (data.scope_allow_station.substr(-1, 1) === ',' && data.scope_allow_station.substr(0, 1) === ',') {
        this.scopeAllowStationIds = data.scope_allow_station.slice(1, -1)
      } else {
        this.scopeAllowStationIds = data.scope_allow_station
      }
      if (data.scope_allow_department.substr(-1, 1) === ',' && data.scope_allow_department.substr(0, 1) === ',') {
        this.scopeAllowDepartmentIds = data.scope_allow_department.slice(1, -1)
      } else {
        this.scopeAllowDepartmentIds = data.scope_allow_department
      }
      if (data.scope_allow_position.substr(-1, 1) === ',' && data.scope_allow_position.substr(0, 1) === ',') {
        this.scopeAllowPositionIds = data.scope_allow_position.slice(1, -1)
      } else {
        this.scopeAllowPositionIds = data.scope_allow_position
      }
      if (data.scope_except_region.substr(-1, 1) === ',' && data.scope_except_region.substr(0, 1) === ',') {
        this.scopeExceptRegionIds = data.scope_except_region.slice(1, -1)
      } else {
        this.scopeExceptRegionIds = data.scope_except_region
      }
      if (data.scope_except_province.substr(-1, 1) === ',' && data.scope_except_province.substr(0, 1) === ',') {
        this.scopeExceptProvinceIds = data.scope_except_province.slice(1, -1)
      } else {
        this.scopeExceptProvinceIds = data.scope_except_province
      }
      if (data.scope_except_district.substr(-1, 1) === ',' && data.scope_except_district.substr(0, 1) === ',') {
        this.scopeExceptDistrictIds.selected = this.setSelectedOption(this.scopeExceptDistrictIds.options, data.scope_except_district.slice(1, -1))
      } else {
        this.scopeExceptDistrictIds.selected = this.setSelectedOption(this.scopeExceptDistrictIds.options, data.scope_except_district)
      }
      if (data.scope_except_station.substr(-1, 1) === ',' && data.scope_except_station.substr(0, 1) === ',') {
        this.scopeExceptStationIds = data.scope_except_station.slice(1, -1)
      } else {
        this.scopeExceptStationIds = data.scope_except_station
      }
      if (data.scope_except_department.substr(-1, 1) === ',' && data.scope_except_department.substr(0, 1) === ',') {
        this.scopeExceptDepartmentIds = data.scope_except_department.slice(1, -1)
      } else {
        this.scopeExceptDepartmentIds = data.scope_except_department
      }
      if (data.scope_except_position.substr(-1, 1) === ',' && data.scope_except_position.substr(0, 1) === ',') {
        this.scopeExceptPositionIds = data.scope_except_position.slice(1, -1)
      } else {
        this.scopeExceptPositionIds = data.scope_except_position
      }
      this.allowRegionIds = data.allow_region
      this.allowProvinceIds = data.allow_province
      this.allowDistrictIds.selected = this.setSelectedOption(this.allowDistrictIds.options, data.allow_district)
      this.allowStationIds = data.allow_station
      this.allowDepartmentIds = data.allow_department
      this.allowPositionIds = data.allow_position
      if (data.allow_user_ids) {
        this.allowUserIds = JSON.parse(JSON.stringify(data.allow_user_ids))
      }
      this.exceptRegionIds = data.except_region
      this.exceptProvinceIds = data.except_province
      this.exceptDistrictIds.selected = this.setSelectedOption(this.exceptDistrictIds.options, data.except_district)
      this.exceptStationIds = data.except_station
      this.exceptDepartmentIds = data.except_department
      this.exceptPositionIds = data.except_position
      if (data.except_user_ids) {
        this.exceptUserIds = JSON.parse(JSON.stringify(data.except_user_ids))
      }
    },

    showNotification (success) {
      let classNotify = 'bg-success text-white'
      if (!success) {
        classNotify = 'bg-warning text-dark'
      }
      this.$notify({
        group: 'add-emp',
        title: this.notify.title,
        text: this.notify.message,
        type: classNotify
      })
    },

    setDataSend (dataSend) {
      dataSend.append('code', this.code)
      dataSend.append('name', this.name)
      dataSend.append('version', this.version)
      if (this.uploadFile === null) {
        dataSend.append('uploadFile', '')
      } else {
        dataSend.append('uploadFile', this.uploadFile)
      }
      dataSend.append('status', this.status)
      dataSend.append('status_effect', this.statusEffect)
      if (this.type.selected.hasOwnProperty('id')) {
        dataSend.append('type', this.type.selected.id)
      } else if (this.type.selected[0] && this.type.selected[0].hasOwnProperty('id')) {
        dataSend.append('type', this.type.selected[0].id)
      }
      dataSend.append('source', this.source)
      // Thêm dấu , để lưu vào CSDL
      if (this.departmentIds) {
        dataSend.append('department', ',' + this.departmentIds + ',')
      } else {
        dataSend.append('department', this.departmentIds)
      }
      if (this.user.hasOwnProperty('id')) {
        dataSend.append('approver', this.user.id)
      }
      dataSend.append('security_level', this.securityLevel)
      if (this.documentReplated) {
        dataSend.append('document_related', this.getDocumentRelatedSelected(this.documentReplated))
      }
      if (this.documentReplaced && this.status === '2') {
        dataSend.append('document_replace', this.getDocumentReplacedSelected(this.documentReplaced))
      }
      // Thêm dấu , để lưu vào CSDL
      dataSend.append('scope_allow_province', this.scopeAllowProvinceIds ? ',' + this.scopeAllowProvinceIds + ',' : '')
      dataSend.append('scope_allow_region', this.scopeAllowRegionIds ? ',' + this.scopeAllowRegionIds + ',' : '')
      dataSend.append('scope_allow_district', (this.scopeAllowDistrictIds.selected.length) ? ',' + this.scopeAllowDistrictIds.selected.map((item) => item.id).toString() + ',' : '')
      dataSend.append('scope_allow_station', this.scopeAllowStationIds ? ',' + this.scopeAllowStationIds + ',' : '')
      dataSend.append('scope_allow_department', this.scopeAllowDepartmentIds ? ',' + this.scopeAllowDepartmentIds + ',' : '')
      dataSend.append('scope_allow_position', this.scopeAllowPositionIds ? ',' + this.scopeAllowPositionIds + ',' : '')
      dataSend.append('scope_except_region', this.scopeExceptRegionIds ? ',' + this.scopeExceptRegionIds + ',' : '')
      dataSend.append('scope_except_province', this.scopeExceptProvinceIds ? ',' + this.scopeExceptProvinceIds + ',' : '')
      dataSend.append('scope_except_district', (this.scopeExceptDistrictIds.selected.length) ? ',' + this.scopeExceptDistrictIds.selected.map((item) => item.id).toString() + ',' : '')
      dataSend.append('scope_except_station', this.scopeExceptStationIds ? ',' + this.scopeExceptStationIds + ',' : '')
      dataSend.append('scope_except_department', this.scopeExceptDepartmentIds ? ',' + this.scopeExceptDepartmentIds + ',' : '')
      dataSend.append('scope_except_position', this.scopeExceptPositionIds ? ',' + this.scopeExceptPositionIds + ',' : '')

      dataSend.append('allow_province', this.allowProvinceIds)
      dataSend.append('allow_region', this.allowRegionIds)
      dataSend.append('allow_district', this.allowDistrictIds.selected ? this.allowDistrictIds.selected.map((item) => item.id).toString() : '')
      dataSend.append('allow_station', this.allowStationIds)
      dataSend.append('allow_department', this.allowDepartmentIds)
      dataSend.append('allow_position', this.allowPositionIds)
      dataSend.append('allow_user', this.getAllowUserSelected(this.allowUserIds))
      dataSend.append('except_region', this.exceptRegionIds)
      dataSend.append('except_province', this.exceptProvinceIds)
      dataSend.append('except_province', this.exceptProvinceIds)
      dataSend.append('except_district', this.exceptDistrictIds.selected ? this.exceptDistrictIds.selected.map((item) => item.id).toString() : '')
      dataSend.append('except_station', this.exceptStationIds)
      dataSend.append('except_department', this.exceptDepartmentIds)
      dataSend.append('except_position', this.exceptPositionIds)
      dataSend.append('except_user', this.getExceptUserSelected(this.exceptUserIds))
      if (this.dateStart) {
        dataSend.append('date_start_effect', moment(this.dateStart).format('YYYY-MM-DD'))
      }
      if (this.dateEnd) {
        dataSend.append('date_end_effect', moment(this.dateEnd).format('YYYY-MM-DD'))
      }
      return dataSend
    },

    addDocument () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (this.dateStart && this.dateEnd && this.dateStart > this.dateEnd) {
            return commonHelper.showMessage('Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 'warning')
          }
          let data = new FormData()
          let dataSend = this.setDataSend(data)
          documentService.add(dataSend)
            .then(response => {
              if (!response.data.success) {
                this.notify = {
                  title: 'Tạo văn bản thất bại',
                  message: response.data.message ? response.data.message : 'Tạo văn bản thất bại'
                }
                this.showNotification(false)
              } else {
                commonHelper.showMessage('Tạo văn bản thành công', 'success')
                this.$router.push({name: 'manage-document'})
              }
            })
        } else {
          this.isProcessingUpdate = false
          this.notify.success = false
          this.notify.message = 'Vui lòng nhập đủ thông tin yêu cầu'
          this.showNotification(false)
        }
      })
    },

    updateDocument () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (this.dateStart && this.dateEnd && this.dateStart > this.dateEnd) {
            return commonHelper.showMessage('Ngày bắt đầu nhỏ hơn ngày kết thúc', 'warning')
          }
          let data = new FormData()
          let dataSend = this.setDataSend(data)
          dataSend.append('id', this.id)
          documentService.update(dataSend).then(response => {
            if (!response.data.success) {
              this.notify = {
                title: 'Lỗi',
                message: response.data.message ? response.data.message : 'Cập nhật văn bản thất bại'
              }
              this.showNotification(false)
            } else {
              commonHelper.showMessage('Cập nhật văn bản thành công', 'success')
              this.$router.push({name: 'manage-document'})
            }
          })
        } else {
          this.isProcessingUpdate = false
          this.notify.success = false
          this.notify.message = 'Vui lòng nhập đủ thông tin yêu cầu'
          this.showNotification(false)
        }
      })
    },
    async getListTypes () {
      this.type.loading = true

      await documentService.getListDocumentType().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.type.options = Object.keys(response.data.data).map((docType) => {
              if (docType === 'global') {
                const documents = this.permissionDocument.global ? response.data.data[docType] : response.data.data[docType].push({$isDisable: true})
                return {
                  type: 'Văn bản chung',
                  documents
                }
              }
              if (docType === 'legislation') {
                const documents = this.permissionDocument.legislation ? response.data.data[docType] : response.data.data[docType].push({$isDisable: true})
                return {
                  type: 'Văn bản pháp chế',
                  documents
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
    setSelectedOption (options, selected) {
      let option = []
      if (options.length > 0 && selected) {
        selected.split(',').forEach(se => {
          let op = options.find(o => ('' + o.id === '' + se))
          if (op) {
            option.push(op)
          }
        })
      }
      return option
    },
    setSelectedDocumentType (options, id) {
      const formatOptions = [].concat.apply([], Object.values(options))
      return formatOptions.find(op => (op.id === id))
    },

    hasAtLeastOnePermision (permissionDocument) {
      if (Object.values(permissionDocument).indexOf(true) > -1) {
        return true
      }
      return false
    }
  }
}
</script>
