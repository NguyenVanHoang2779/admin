<template>
    <div v-loading="loading">
        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header ttcn-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-ttcn><i class="ion  ion-ios-add-circle"></i> Thông tin nhân viên được đánh giá</a>
                            </h6>
                            <b-collapse id="accordion-ttcn" visible>
                                <div class="card-body">
                                    <b-form-row>
                                        <div class="col-4">
                                            <b-card no-body>
                                                <b-card-body>
                                                    <div class="row" v-if="!isEmptyUserInfo(this.userInfo)">
                                                        <div class="pr-2">
                                                          <img :src="userInfo.Mas.image_profile" width="120" height="160" alt="avatar">
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <p>Mã nhân viên: {{ userInfo.Mas.staff_code }}</p>
                                                                <p>Tên nhân viên: {{ userInfo.Mas.fullname }}</p>
                                                                <p>Email công ty: {{ userInfo.Mas.company_email }}</p>
                                                                <p>Ngày vào: {{ formatDate(userInfo.Mas.join_date) }}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </b-card-body>
                                            </b-card>
                                        </div>
                                        <div class="col-md-8">
                                            <b-card no-body style="height: 100%">
                                                <b-card-header header-tag="h6" class="with-elements" v-if="!isEmptyUserInfo(this.userInfo)">
                                                    <div class="row">
                                                        <div>Thống kê thông tin đánh giá của nhân viên {{ userInfo.Mas.fullname }} năm {{ new Date().getFullYear() }}</div>
                                                    </div>
                                                </b-card-header>
                                                <b-card-body>
                                                    <div class="row">
                                                        <div class="col-6">
                                                            <div class="row">
                                                                <div class="month-evaluation col-6 p-1" v-for="(avg,index) in avgEvaluation" @click="getEvaluationByMonth(index)">
                                                                    <span :class="+currMonth === +index ? 'underline' : ''">Tháng {{index}}:</span>
                                                                    <span v-html="transferToEmotionByEvaluation(Number(avg))"></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-3">
                                                            <div class="p-1"><i class="ion ion-md-thumbs-up" style="font-size: 24px; color: #02BC77"></i> : Tuyệt vời </div>
                                                            <div class="p-1"><i class="ion ion-ios-happy" style="font-size: 24px; color: orange"></i> : Đáng khen ngợi </div>
                                                            <div class="p-1"><i class="ion ion-md-happy" style="font-size: 24px; color: orange"></i> : Bình thường </div>
                                                            <div class="p-1"><i class="ion ion-ios-sad" style="font-size: 24px"></i> : Cần cải thiện </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-12 p-1">
                                                            <strong>Đánh giá đến thời điểm hiện tại :</strong>
                                                            <span v-html="transferToEmotionByEvaluation(Number(avgFinalEvaluation))"></span>
                                                        </div>
<!--                                                        <div>-->
<!--                                                            Mô tả tiêu chí đánh giá: <a href="https://docs.google.com/document/d/1I64jQM9laZkM19CZK0AbXxcBPWjqO_BxhOeY4-NxZDU/edit" target="_blank"> Xem chi tiết</a>-->
<!--                                                        </div>-->
                                                    </div>
                                                </b-card-body>
                                            </b-card>
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
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header ttcn-header d-inline-block border-bottom-0" v-if="!isEmptyUserInfo(this.userInfo)">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.evaluation-detail><i class="ion  ion-ios-add-circle"></i>
                                    Thông tin đánh giá của {{ userInfo.Mas.fullname }}
                                    <span> từ {{reverseFormatDate($route.query.from)}} đến  {{reverseFormatDate($route.query.to)}}</span>
                                </a>
                            </h6>
                            <b-button @click="setEvaluation(null,2,null)" data-style="zoom-out" class="btn btn-outline-primary add-evaluation" v-if="checkNotEnoughEva(evaluations)">
                                Thêm đánh giá
                            </b-button>
                            <hr class="m-0">
                            <b-collapse id="evaluation-detail" visible>
                                <div class="card-body">
                                    <b-form-row v-if="evaluations.length > 0">
                                        <table class="table b-table table-striped table-hover table-bordered">
                                            <thead>
                                            <tr>
                                                <th class="d-none">STT</th>
                                                <th>Người đánh giá</th>
                                                <th>Bắt đầu</th>
                                                <th>Kết thúc</th>
                                                <template v-for="cri in criteria">
                                                    <th>{{cri.name}}</th>
                                                </template>
                                                <th v-if="isManagement === 1 && userInfo.ErpUser && +userInfo.ErpUser.group_id !== 15">Tiêu chí quản lí</th>
                                                <th>Nhận xét</th>
                                                <th>Tình trạng</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(evaluation, index) in evaluations" class="is_align_middle" :key="`evaluations${index}`">
                                                <td class="d-none">{{index + 1}}</td>
                                                <td>{{evaluation.created_by_name}}</td>
                                                <td>{{evaluation.start_date}}</td>
                                                <td>{{evaluation.end_date}}</td>
                                                <td v-html="transferToEmotionByEvaluation(Number(evaluation.honest))"></td>
                                                <td v-html="transferToEmotionByEvaluation(Number(evaluation.responsibility))"></td>
                                                <td v-html="transferToEmotionByEvaluation(Number(evaluation.disciplinary))"></td>
                                                <td v-html="transferToEmotionByEvaluation(Number(evaluation.effective))"></td>
                                                <td v-html="transferToEmotionByEvaluation(Number(evaluation.core_values))"></td>
                                                <td v-html="transferToEmotionByEvaluation(Number(evaluation.resolve_problem))"></td>
                                                <td v-html="transferToEmotionByEvaluation(Number(evaluation.creation))"></td>
                                                <td v-if="isManagement === 1 && userInfo.ErpUser && +userInfo.ErpUser.group_id !== 15">
                                                    <b-button @click="setEvaluation(evaluation,3,null)" data-style="zoom-out" class="btn btn-outline-primary">Xem kết quả</b-button>
                                                </td>
                                                <td class="evaluation-comment">{{evaluation.descrip}}</td>
                                                <td>
                                                    <b-form-select
                                                            class="cursor-pointer"
                                                            v-model="evaluation.status"
                                                            :options="optionStatusEvaluation"
                                                            placeholder="Chọn mức độ đánh giá"
                                                            v-on:change="changeStatusEvaluationOfStaff($event,evaluation.id)"
                                                    ></b-form-select>
                                                </td>
                                                <td>
                                                    <b-button @click="setEvaluation(evaluation,1,1)" data-style="zoom-out" class="btn btn-outline-primary">
                                                        Xem ghi chú
                                                    </b-button>
                                                    <b-button @click="setEvaluation(evaluation,2,null)" data-style="zoom-out" class="btn btn-outline-primary">
                                                        Chỉnh sửa
                                                    </b-button>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </b-form-row>
                                    <b-form-row v-else>
                                        Không có thông tin đánh giá trong thời gian này
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
            <div class="row no-gutters row-bordered">
              <div class="col-md-12 col-lg-12 col-xl-12">
                <h6 class="card-header ttcn-header d-inline-block border-bottom-0" v-if="!isEmptyUserInfo(this.userInfo)">
                  <a class="text-dark" href="javascript:void(0)">
                    Thông tin thưởng phạt của {{ userInfo.Mas.fullname }}
                    <span> từ {{reverseFormatDate($route.query.from)}} đến  {{reverseFormatDate($route.query.to)}}</span>
                  </a>
                </h6>
                <hr class="m-0">
                <div class="card-body" v-loading="loadingFstarCount">
                  <div class="w-100 d-flex justify-content-between align-content-center button-action-fstar">
                    <div class="d-inline-flex custom-tab cursor-pointer my-auto">
                      <div class="px-3 py-1 my-auto" :class="{'active-tab': tab === 'reward'}" @click="changeTab('reward')"><span class="tab-title">Thưởng ({{ totalReward }})</span></div>
                      <div class="px-3 py-1 my-auto" :class="{'active-tab': tab === 'penalty'}" @click="changeTab('penalty')"><span class="tab-title">Phạt ({{ totalPenalty }})</span></div>
                    </div>
                    <button @click="handleShowModalPenaltyAction" v-if="tab === 'penalty'" style="background-color: #00904A !important;" data-style="zoom-out" type="button" class="btn btn-success btn-action-f">
                      <i class="fa fa-plus" aria-hidden="true"></i>
                      Thêm thẻ phạt
                    </button>
                    <button @click="handleShowModalRewardAction" v-if="tab === 'reward'" style="background-color: #00904A !important;" data-style="zoom-out" type="button" class="btn btn-success btn-action-f">
                      <i class="fa fa-plus" aria-hidden="true"></i>
                      Thêm thưởng
                    </button>
                  </div>
                  <UserPenalty
                    v-if="tab === 'penalty'"
                    :userId="$route.params.id"
                    :from="$route.query.from"
                    :to="$route.query.to"
                    :key="keyReloadFstar"
                  />
                  <UserReward
                    v-if="tab === 'reward'"
                    :userId="$route.params.id"
                    :from="$route.query.from"
                    :to="$route.query.to"
                    :key="keyReloadFstar"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        <modal-evaluation-note :evaluation="evaluationModal" :typeNote="typeNote"></modal-evaluation-note>
        <modal-edit-evaluation
            :evaluated-permission-expired="evaluatedPermissionExpired"
            :manager-criteria="managerCriteria"
            :group-id="userInfo.ErpUser && userInfo.ErpUser.group_id"
            :criteria="criteria" :evaluation="evaluationModal"
            :isManagement="isManagement" @update-evaluation="getEvaluationByUser">
        </modal-edit-evaluation>
        <modal-criteria-for-manager v-bind:evaluation="evaluationModal"></modal-criteria-for-manager>
        <modal-recompense :user-id="this.$route.params.id" @update-recompense="getRecompenseAndVoteOfUser"></modal-recompense>
        <b-modal centered id="upload-image" :title="currEditingDocument.name" @hide="currEditingDocument = {files: []}">
            <div v-viewer v-loading="isLoadingFile">
                <template v-for="(file, idx) in currEditingDocument.files">
                    <div class="img-bounder" :key="idx">
                        <span @click.stop="deleteFile($event, file, idx)" title="Xóa" v-if="!file.deleted" class="btn-disable-file"><i class="icon ion-md-close-circle"></i></span>
                        <span @click.stop="deleteFile($event, file, idx)" title="Lấy lại" v-else class="btn-disable-file"><i class="icon ion-md-refresh-circle"></i></span>
                        <b-img
                                v-if="file.path && isImage(file.name)"
                                :src="file.path"
                                height="100"
                                rounded
                                class="border border-secondary mr-1 mb-1"
                        ></b-img>
                        <b-link :href="file.path" target="_blank" v-else-if="file.path && !isImage(file.name)">
                            <h5 class="d-inline-block mr-1 mb-1"><b-badge variant="primary">{{file.name}}</b-badge></h5>
                        </b-link>
                        <b-img
                                v-else-if="file.type && file.type.indexOf('image') === 0"
                                :src="getUrl(file)"
                                :alt="file.name"
                                rounded
                                height="100"
                                class="border border-secondary mr-1 mb-1"
                        ></b-img>
                        <h5 v-else class="d-inline-block mr-1 mb-1"><b-badge variant="primary">{{file.name}}</b-badge></h5>
                    </div>
                </template>
                <div class="dragdrop d-inline-block">
                    <b-form-file
                            @input="addFile"
                            multiple
                            accept="image/*, .pdf"
                            placeholder="+"
                            :file-name-formatter="() => ('+')"
                    >
                    </b-form-file>
                </div>
            </div>
            <template slot="modal-footer">
                <b-btn variant="secondary" @click="$bvModal.hide('upload-image')">Đóng</b-btn>
                <b-btn variant="primary" @click="updateImages()" :disabled="isLoadingFile">Cập nhật</b-btn>
            </template>
        </b-modal>
      <ModalFstar
        :actionModal="'create'"
        :dataReward="dataReward"
        @reloadListFstar="reloadListFstar"
        :userId="$route.params.id"
        :fstar-type="'reward'"
        :type-options="typeRewardOptions"
      />
      <ModalFstar
        :actionModal="'create'"
        :dataReward="dataPenalty"
        @reloadListFstar="reloadListFstar"
        :userId="$route.params.id"
        :fstar-type="'penalty'"
        :type-options="typePenaltyOptions"
      />
    </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import evaluationService from 'domain/services/evaluation-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import ModalEvaluationNote from 'components/pages/Evaluation/ModalEvaluationNote'
import ModalEditEvaluation from 'components/pages/Evaluation/ModalEditEvaluation'
import ModalCriteriaForManager from 'components/pages/Evaluation/ModalCriteriaForManager'
import ModalRecompense from 'components/pages/Evaluation/ModalRecompense'
import User from 'domain/entities/User'
import commonHelper from 'infrastructures/helpers/common-helpers'
import cycleTime from 'infrastructures/helpers/date.js'
import VueLazyload from 'vue-lazyload'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import UserPenalty from './Fstar/Penalty/UserPenalty.vue'
import UserReward from './Fstar/Reward/UserReward.vue'
import Vue from 'vue'
import fstarService from 'domain/services/fstar-service'
import ModalFstar from './Fstar/ModalFstar.vue'

Vue.use(Viewer)

export default {
  name: 'detail-evaluation',

  components: {
    ModalFstar,
    UserReward,
    UserPenalty,
    evaluationService,
    LaddaBtn,
    ModalEvaluationNote,
    ModalEditEvaluation,
    ModalCriteriaForManager,
    ModalRecompense,
    VueLazyload
  },

  props: [
  ],

  data: () => ({
    currEditingDocument: {
      files: []
    },
    isLoadingFile: false,
    recompense: {
      manager_recompense: [],
      cs_recompense: [],
      shop_vote: []
    },
    evaluations: [],
    avgEvaluation: [],
    avgFinalEvaluation: null,
    userInfo: {},
    evaluationModal: {},
    maRecompenseModal: {},
    optionStatusEvaluation: [
      { value: 1, text: 'Chưa duyệt' },
      { value: 2, text: 'Duyệt' }
    ],
    optionStatusRecompense: [
      { value: 1, text: 'Chưa duyệt' },
      { value: 2, text: 'Đã Duyệt' },
      { value: 3, text: 'Không Duyệt' },
      { value: 4, text: 'Xóa' }
    ],
    typeNote: '',
    isManagement: '',
    recompenseId: null,
    evaluatedPermissionExpired: false,
    managerCriteria: User.defaultManagerCriteriaFstar,
    currMonth: null,
    loading: false,
    tab: 'reward',
    keyReloadFstar: 0,
    dataPenalty: null,
    dataReward: null,
    totalReward: 0,
    totalPenalty: 0,
    loadingFstarCount: false,
    typeRewardOptions: [],
    typePenaltyOptions: []
  }),

  created () {
    this.checkIsManagement()
    this.getEvaluationByUser()
    this.getRecompenseAndVoteOfUser()
    this.getAvgEvaluationOfUserByMonth()
    this.getPermissionEvaluationExpired()
    this.getCurrMonth()
    this.getCountReward()
    this.getCountPenalty()
    this.getTypeReward()
    this.getTypePenalty()
  },

  computed: {
    criteria () {
      if (!this.userInfo.ErpUser) return User.techCriteriaFstar
      let groupId = this.userInfo.ErpUser.group_id
      if (+groupId !== 15) {
        return User.defaultCriteriaFstar
      }
      return User.techCriteriaFstar
    },
    helper: _ => commonHelper
  },

  methods: {
    async getCountReward () {
      this.loadingFstarCount = true
      const dataSend = {
        user_id: this.$route.params.id,
        from: this.$route.query.from,
        to: this.$route.query.to
      }

      await fstarService.totalReward(dataSend)
        .then(response => {
          if (response.data.success) {
            this.totalReward = response.data.data.total_fstar
          }
        })
        .catch(error => {
          commonHelper.showMessage(error.response.data.message, 'error')
        })
      this.loadingFstarCount = false
    },
    async getCountPenalty () {
      this.loadingFstarCount = true
      const dataSend = {
        user_id: this.$route.params.id,
        from: this.$route.query.from,
        to: this.$route.query.to
      }

      await fstarService.totalPenalty(dataSend)
        .then(response => {
          if (response.data.success) {
            this.totalPenalty = response.data.data.total_fstar
          }
        })
        .catch(error => {
          commonHelper.showMessage(error.response.data.message, 'error')
        })
      this.loadingFstarCount = false
    },
    async reloadListFstar () {
      await this.getCountReward()
      await this.getCountPenalty()
      this.keyReloadFstar = this.keyReloadFstar + 1
    },
    handleShowModalRewardAction () {
      this.dataReward = {}
      this.$bvModal.show('modal-reward-fstar-create')
    },
    handleShowModalPenaltyAction () {
      this.dataPenalty = {}
      this.$bvModal.show('modal-penalty-fstar-create')
    },
    changeTab (tab) {
      this.tab = tab
    },
    getCurrMonth () {
      let to = new Date(this.$route.query.to)
      this.currMonth = to.getMonth() + 1
    },
    getPermissionEvaluationExpired () {
      evaluationService.getPermissionEvaluationExpired()
        .then(response => {
          if (response.data.success) {
            this.evaluatedPermissionExpired = response.data.allowed
          }
        })
    },

    checkNotEnoughEva (eva) {
      if (this.evaluatedPermissionExpired) return true
      if (this.userInfo.ErpUser && parseInt(this.userInfo.ErpUser.group_id) === 15) {
        return true
      }
      let now = new Date()
      let dd = now.getDate()
      if ((dd > 9 && dd < 21) || dd > 24) return false
      if (dd > 20 && dd < 25) {
        if (eva.length < 2) return true
      }
      if (dd > 4 && dd < 9) {
        if (eva.length < 1) return true
      }
      return false
    },

    reverseFormatDate (date) {
      return date.split('-').reverse().join('-')
    },
    formatDate (date, type) {
      type = type || 'DD-MM-YYYY'
      return commonHelper.formatDate(date, type)
    },

    isImage (path) {
      if (!path) return null
      let imageReg = /[/.](gif|jpg|jpeg|tiff|png)$/i
      return imageReg.test(path)
    },

    deleteFile (event, file, index) {
      if (file.path) {
        if (!file.deleted) this.$set(file, 'deleted', 1)
        else file.deleted = 0

        event.currentTarget.nextElementSibling.classList.toggle('file-deleted')
      } else {
        this.currEditingDocument.files.splice(index, 1)
      }
    },

    addFile (files) {
      let fileAllowRegex = /[/.](gif|jpg|jpeg|tiff|png|pdf)$/i
      if (typeof files === 'object' && files.length > 0) {
        files.forEach(file => {
          if (fileAllowRegex.test(file.name)) this.currEditingDocument.files.push(file)
          else commonHelper.showMessage(`Định dạng file ${file.name} không được hỗ trợ`, 'warning')
        })
      }
    },

    getUrl (file) {
      let url = URL.createObjectURL(file)
      URL.revokeObjectURL(file)
      return url
    },

    openModal (recompenseId) {
      this.$bvModal.show('upload-image')
      this.recompenseId = recompenseId
      let dataSend = {
        'recompense_id': recompenseId
      }
      evaluationService.getImageMinutes(dataSend)
        .then(response => {
          if (response.data.success) {
            this.currEditingDocument = {
              'files': response.data.data
            }
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: response.data.message
            })
          }
        })
    },

    updateImages () {
      let dataSend = new FormData()
      dataSend.append('user_id', this.$route.params.id)
      dataSend.append('recompense_id', this.recompenseId)
      for (let [idx, file] of this.currEditingDocument.files.entries()) {
        if (!file.path) {
          dataSend.append('fileAdded[' + idx + ']', file)
        }
      }

      dataSend.append('files', JSON.stringify(this.currEditingDocument.files))

      evaluationService.updateImageMinutes(dataSend)
        .then(response => {
          if (response.data.success) {
            this.$notify({
              group: 'default',
              type: 'bg-success text-white',
              title: 'Thông báo',
              text: response.data.message
            })
            this.currEditingDocument = {
              'files': []
            }
            this.$bvModal.hide('upload-image')
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: response.data.message
            })
          }
        })
    },

    checkIsManagement: function () {
      let params = {
        id: this.$route.params.id
      }
      evaluationService.checkIsManagement(params)
        .then((res) => {
          if (res.data.success) {
            this.isManagement = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    uploadReport: function (index, id) {
      let fileInput = 'fileInput' + index
      let formData = new FormData()
      formData.append('file', this.$refs[fileInput][0].$refs.input.files[0])
      formData.append('id', id)

      evaluationService.uploadReport(formData)
        .then((res) => {
          if (res.data.success) {
            this.$notify({
              group: 'default',
              type: 'text-white bg-primary',
              text: res.data.message
            })
            this.getRecompenseAndVoteOfUser()
          } else {
            this.$notify({
              group: 'default',
              type: 'text-white bg-warning',
              title: 'Xảy ra lỗi',
              text: res.data.message
            })
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    transferToEmotionByEvaluation: function (eva) {
      if (eva === 1) {
        return '<i class="ion ion-ios-sad" style="font-size: 24px"></i>'
      }
      if (eva === 2) {
        return '<i class="ion ion-md-happy" style="font-size: 24px; color: orange"></i>'
      }
      if (eva === 3) {
        return '<i class="ion ion-ios-happy" style="font-size: 24px; color: orange"></i>'
      }
      if (eva === 4) {
        return '<i class="ion ion-md-thumbs-up" style="font-size: 24px; color: #02BC77"></i>'
      }
    },

    getRecompenseAndVoteOfUser: function () {
      let params = {
        id: this.$route.params.id,
        from: this.$route.query.from,
        to: this.$route.query.to
      }
      evaluationService.getRecompenseAndVoteOfUser(params)
        .then((res) => {
          if (res.data.success) {
            this.recompense.manager_recompense = res.data.data.manager_recompense
            this.recompense.cs_recompense = res.data.data.cs_recompense
            this.recompense.shop_vote = res.data.data.shop_vote
            this.loading = false
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getAvgEvaluationOfUserByMonth: function () {
      let params = {
        user_id: this.$route.params.id,
        year: new Date().getFullYear()
      }
      evaluationService.getAvgEvaluationOfUserByMonth(params)
        .then((res) => {
          if (res.data.success) {
            this.avgEvaluation = res.data.data.month
            this.avgFinalEvaluation = res.data.data.final
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getEvaluationByUser: function () {
      this.loading = true
      let params = {
        id: this.$route.params.id,
        from: this.$route.query.from,
        to: this.$route.query.to
      }
      evaluationService.getEvaluationByUser(params)
        .then((res) => {
          if (res.data.success) {
            this.userInfo = res.data.data.UserInfo
            this.evaluations = res.data.data.Evaluations
          }
        })
        .catch((e) => {
          console.log(e)
        })
      this.loading = false
    },

    setEvaluation: function (eva, show, type) {
      this.evaluationModal = eva
      this.typeNote = type
      if (show === 1) {
        setTimeout(() => { this.$bvModal.show('modal-evaluation-note') }, 0.01)
      }
      if (show === 2) {
        setTimeout(() => { this.$bvModal.show('modal-edit-evaluation') }, 0.01)
      }
      if (show === 3) {
        setTimeout(() => { this.$bvModal.show('modal-criteria-for-manager') }, 0.01)
      }
    },

    showModalRecompense: function () {
      this.$bvModal.show('modal-recompense')
    },

    changeStatusEvaluationOfStaff: function (value, id) {
      let data = {
        id: id,
        status: value
      }
      evaluationService.changeStatusEvaluationOfStaff(data)
        .then((res) => {
          if (res.data.success) {
            this.$notify({
              group: 'default',
              type: 'text-white bg-primary',
              text: res.data.message
            })
            this.getEvaluationByUser()
          } else {
            this.$notify({
              group: 'default',
              type: 'text-white bg-warning',
              title: 'Xảy ra lỗi',
              text: res.data.message
            })
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    changeStatusRecompenseOfStaff: function (value, id) {
      let data = {
        id: id,
        status: value
      }
      if (value === 4) {
        if (!confirm('Đề xuất thưởng,phạt này sẽ bị xóa. Bạn chắc chắn muốn tiếp tục?')) {
          this.getRecompenseAndVoteOfUser()
          return
        }
      }
      evaluationService.changeStatusRecompenseOfStaff(data)
        .then((res) => {
          if (res.data.success) {
            this.$notify({
              group: 'default',
              type: 'text-white bg-primary',
              text: res.data.message
            })
            this.getRecompenseAndVoteOfUser()
            this.getEvaluationByUser()
            this.getAvgEvaluationOfUserByMonth()
          } else {
            this.$notify({
              group: 'default',
              type: 'text-white bg-warning',
              title: 'Xảy ra lỗi',
              text: res.data.message
            })
            this.getRecompenseAndVoteOfUser()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    isEmptyUserInfo (userInfo) {
      return Object.keys(userInfo).length === 0 && userInfo.constructor === Object
    },
    getEvaluationByMonth (month) {
      let firstDayOfMonth = new Date().getFullYear() + (month < 10 ? '-0' : '-') + String(month) + '-01'
      let cycle = cycleTime.getMonthSalaryByDate(firstDayOfMonth)
      this.$route.query.from = cycle.from
      this.$route.query.to = cycle.to
      this.currMonth = month
      this.getEvaluationByUser()
      this.getRecompenseAndVoteOfUser()
    },
    async getTypePenalty () {
      await fstarService.getTypePenalty()
        .then(response => {
          if (response.data.success) {
            this.typePenaltyOptions = response.data.data
          } else {
            commonHelper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          commonHelper.showMessage(error.response.data.message, 'error')
        })
    },
    async getTypeReward () {
      await fstarService.getTypeReward()
        .then(response => {
          if (response.data.success) {
            this.typeRewardOptions = response.data.data
          } else {
            commonHelper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          commonHelper.showMessage(error.response.data.message, 'error')
        })
    }
  }
}
</script>

<style scoped>
    .add-evaluation {
        float: right;
        margin: 5px 20px;
    }
    .border-bottom-0 {
        border-bottom: 0px;
    }
    .recompense-detail-note {
        color: #26B4FF
    }
    .recompense-component {
        border-bottom: 2px solid white;
    }
    .recompense-detail-note:hover {
        cursor: pointer;
    }
    .recompense {
        padding: 10px;
        margin-top: 5px;
        border-bottom: solid 1px;
    }
    .font-size-24 {
        font-size: 24px !important;
    }
    .font-size-36 {
        font-size: 36px !important;
    }
    .infor-small {
        font-size: 13px;
        color: #a79e9e
    }
    .recompense-container {
        padding: 10px 20px;
    }
    .background-ecf6f1 {
        background: #ecf6f1;
    }
    .background-fdfffe {
        background: #fdfffe;
    }
    .recompense-container:hover {
        background: #e0efe7;
        padding: 10px 20px;
    }
    .collapse-title {
        border: solid 1px #28c3d7;
        background: transparent;
        color: #28c3d7;
        cursor: pointer;
        border-radius: 5px;
        padding: 5px 20px;
        font-size: 1rem;
        margin-top: 15px;
    }
    .collapse-title i {
        margin-right: 5px;
    }
    .collapse-title:hover {
        color: white;
        background: #28c3d7;
    }
    .image-user img {
        width: 100%;
        height: 140px;
    }
    .modal-update-document .group-name {
        font-weight: bold;
        padding: 10px 0;
    }
    .modal-update-document .row-item {
        font-weight: normal;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .img-bounder {
        position: relative;
        display: inline-block;
    }
    .img-bounder:hover > .btn-disable-file {
        z-index: 10000;
        display: inline;
    }
    .btn-disable-file {
        font-size: 20px;
        display: none;
        position: absolute;
        top: -6px;
        right: 6px;
    }
    .dragdrop {
        width: 2rem;
    }
    .dragdrop >>> .custom-file-input {
        position: absolute;
    }
    .dragdrop >>> .custom-file-label {
        border: 1px solid #28a745;
        text-align: center;
        color: #28a745;
        font-size: 12px;
        position: inherit;
        line-height: inherit;
        height: auto;
    }
    .dragdrop >>> .custom-file-label::after {
        display: none;
    }

    .dragdrop .custom-file:hover >>> .custom-file-label {
        background: #28a745;
        color: #fff;
    }
    .file-deleted {
        opacity: 0.2;
    }
    .comment{
      max-width: 25vw;
    }
    .evaluation-comment{
      max-width: 25vw;
    }
    .month-evaluation {
        cursor: pointer;
        color: #1e70cd;
    }
    .month-evaluation:hover {
        color: #007bff;
        text-decoration: underline;
    }
    .underline {
        text-decoration-line: underline;
    }
    .custom-tab {
      padding: 1px;
      border: 1px solid #828282;
      border-radius: 40px;
    }
    .active-tab {
      background-color: #00904A;
      color: #FFFFFF;
      border: 2px solid #00904A;
      border-radius: 20px;
      padding-left: 2px;
      padding-right: 2px;
    }
    .tab-title {
      padding: 20px;
    }
    .btn-action-f {
      margin-right: 10px;
    }

    @media (max-width: 525px) {
      .button-action-fstar {
        display: block !important;
        text-align: center;
      }

      .button-action-fstar button {
        margin-top: 10px;
      }
    }
</style>
