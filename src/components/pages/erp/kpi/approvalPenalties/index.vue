<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-3">
      <div>Quản lý người duyệt thẻ phạt</div>
    </h4>
    <b-card class="mb-2">
      <div class="row mb-2">
        <div class="col-md">
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Loại phạt:</label>
              </b-col>
              <b-col sm="9">
                <select-type-penalty @model="searchData.selectTypePenalty = $event"></select-type-penalty>
              </b-col>
            </b-row>
          </div>
        </div>
        <div class="col-md">
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Loại đối tượng:</label>
              </b-col>
              <b-col sm="9">
                <multiselect
                  class="multiselect-info"
                  :options="subjectTypeOptions"
                  v-model="searchData.selectSubjectType"
                  selectLabel="Chọn"
                  placeholder="Chọn loại đối tượng"
                  :multiple="false"
                  :preserve-search="true"
                  :hide-selected="false"
                />
              </b-col>
            </b-row>
          </div>
        </div>
        <div class="col-md">
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Đối tượng:</label>
              </b-col>
              <b-col sm="9" v-if="searchData.selectSubjectType == 'User'">
                <select-user-penalty
                  @model="searchData.selectSubjectId = $event"
                >
                </select-user-penalty>
              </b-col>
              <b-col sm="9" v-else-if="searchData.selectSubjectType == 'Positions'">
                <multiselect
                  class="multiselect-info"
                  :options="subjectPositionOptions"
                  v-model="searchData.selectSubjectId"
                  selectLabel="Chọn"
                  selectedLabel="Đã chọn"
                  deselectLabel="Bỏ chọn"
                  placeholder="Chọn đối tượng"
                  label="name"
                  track-by="id"
                  :preserve-search="true"
                  :hide-selected="false"
                />
              </b-col>
              <b-col sm="9" v-else>
                <multiselect
                  class="multiselect-info"
                  :options="subjectGroupOptions"
                  v-model="searchData.selectSubjectId"
                  selectLabel="Chọn"
                  selectedLabel="Đã chọn"
                  deselectLabel="Bỏ chọn"
                  placeholder="Chọn đối tượng"
                  label="name"
                  track-by="id"
                  :preserve-search="true"
                  :hide-selected="false"
                />
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
      <b-row class="action mb-2">
        <ladda-btn :loading="loading.search" @click.native="listData" class="btn btn-success w-200px mr-3" style="z-index: 0;">
          <i class="ion ion-md-search"></i> Tìm kiếm
        </ladda-btn>
        <b-btn variant="btn btn btn-info w-200px btn-secondary" @click="createConfig()" style="margin-right: 0.75rem;">
          Tạo mới <i class="fa fa-plus-circle"></i>
        </b-btn>
      </b-row>
    </b-card>
      <b-card class="mb-1">
        <b-table
          ref="dataTable"
          :items="dataTable"
          :fields="fields"
          :striped="false"
          :bordered="true"
          :outlined="true"
          :hover="true"
          style="text-align: center;"
          class="card-table"
          :per-page="perPage"
          :current-page="currentPage"
          responsive>
          <template v-slot:cell(info_user)="data">
            <div class="custom-column p-1">
                <b-list-group-item class="mx-2 mb-1 pl-2 info-user"
                                   variant="success"
                                   v-for="(item,index) in data.item.info_user" :key="index">
                  {{ item }}
                </b-list-group-item>
            </div>
          </template>
          <template v-slot:cell(options)="data">
            <b-btn class="ml-1 mt-1 mb-1 mr-1" size="sm" variant="outline-success"
                   @click="editItem(data.item)"><i
              class="ion ion-md-create"></i>
            </b-btn>
            <b-btn class="ml-1 mt-1 mb-1 mr-1" size="sm" variant="outline-danger"
                   v-on:click="deleteItem(data.item)"><i
              class="ion ion-md-close"></i>
            </b-btn>
          </template>
        </b-table>
        <hr>
        <b-pagination
          v-model="currentPage"
          :total-rows="totalTable"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
      </b-card>
      <CreateApprovalPenalties
        :model-pop-up-name="`Thêm người duyệt thẻ phạt`"
        :listData="listData"
        :subjectGroupOptions="subjectGroupOptions"
        :subjectPositionOptions ="subjectPositionOptions"
      >
      </CreateApprovalPenalties>
      <modal-update
        :edit-data="editData"
        :listData="listData"
        :subjectGroupOptions="subjectGroupOptions"
        :subjectPositionOptions ="subjectPositionOptions"
      >
      </modal-update>
  </div>
</template>

<script>
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import SelectTypePenalty from '../penalties/SelectTypePenalty'
import Multiselect from 'vue-multiselect'
import SelectUserPenalty from '../approvalPenalties/component/SelectUserPenalty'
import ModalUpdate from '../approvalPenalties/component/ModalUpdate'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import CreateApprovalPenalties from './component/CreateApprovalPenalties'
import ApprovalPenalty from 'domain/services/approval-penalty-service'
import kpiPenaltyService from 'domain/services/kpi-penalty-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'approval-penalties',
  components: {
    LoadingMiniBottom,
    SelectTypePenalty,
    'multiselect': Multiselect,
    SelectUserPenalty,
    LaddaBtn,
    CreateApprovalPenalties,
    ModalUpdate
  },
  data: () => ({
    subjectTypeOptions: ['User', 'Group', 'Positions', 'Quản lý duyệt'],
    subjectGroupOptions: [],
    subjectPositionOptions: [],
    searchData: {
      selectTypePenalty: [],
      selectSubjectType: '',
      selectSubjectId: []
    },
    editData: {
      selectTypePenalty: {
        id: 0,
        name: ''
      },
      selectSubjectType: {
        id: 0,
        name: ''
      },
      selectSubjectId: [],
      selectSubjects: []
    },
    loading: {
      search: false
    },
    fields: [
      {key: 'penalty_type', label: 'Loại phạt', sortable: true},
      {key: 'subject_type', label: 'Loại đối tượng', sortable: true},
      {key: 'info_user', label: 'Đối tượng', sortable: true},
      {key: 'options', label: 'Tuỳ chọn', sortable: true}
    ],
    dataTable: [],
    totalItems: 0,
    currentPage: 1,
    perPage: 10,
    showModal: true
  }),
  watch: {
    'searchData.selectSubjectType' () {
      this.searchData.selectSubjectId = []
    }
  },
  created () {
    this.listData()
    this.getListGroup()
    this.getSubjectPositionsOptions()
  },
  computed: {
    totalTable () {
      return this.dataTable.length
    }
  },
  methods: {
    listData () {
      let selectSubjectType = 0
      if (this.searchData.selectSubjectType === 'User') {
        selectSubjectType = 1
      } else if (this.searchData.selectSubjectType === 'Positions') {
        selectSubjectType = 2
      } else if (this.searchData.selectSubjectType === 'Group') {
        selectSubjectType = 3
      } else if (this.searchData.selectSubjectType === 'Quản lý duyệt') {
        selectSubjectType = 4
      }
      let dataSend = {
        alias: this.searchData.selectTypePenalty ? this.searchData.selectTypePenalty : [],
        subject_type: selectSubjectType,
        subject_id: this.searchData.selectSubjectId
      }
      ApprovalPenalty.apiGetDataApprovalPenaltyData(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataTable = response.data.data
            return commonHelper.showMessage(response.data.message, 'success')
          } else {
            return commonHelper.showMessage(response.data.message, 'warning')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau', 'warning')
      })
    },
    getSubjectPositionsOptions () {
      ApprovalPenalty.apiGetSubjectPositionsOptions().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.subjectPositionOptions = response.data.data
            return commonHelper.showMessage(response.data.message, 'success')
          } else {
            return commonHelper.showMessage(response.data.message, 'warning')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau', 'warning')
      })
    },
    getListGroup () {
      kpiPenaltyService.apiGetAllGroups().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.subjectGroupOptions = response.data.data
          }
        }
      })
    },
    editItem (item) {
      this.editData.selectTypePenalty = [
        {
          id: item.alias,
          name: item.penalty_type
        }
      ]
      this.editData.selectSubjectType = {
        id: item.subject_type_id,
        name: item.subject_type
      }
      this.editData.selectSubjects = item.item
      this.editData.list_id = item.list_id
      this.$bvModal.show('update-approval-penalties')
    },
    createConfig () {
      this.isCreateConfig = true
      this.$bvModal.show('create-approval-penalties')
    },
    deleteItem (item) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
        return
      }
      let data = {
        ids: item.list_id
      }
      ApprovalPenalty.deleteApprovalPenalty(data).then(response => {
        if (response.data.success) {
          this.listData()
          return commonHelper.showMessage(response.data.message, 'success')
        } else {
          return commonHelper.showMessage(response.data.message, 'warning')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xẩy ra, vui lòng thử lại sau', 'warning')
      })
    }
  }
}
</script>

<style scoped type="text/css">
  .action {
    float: right;
  }
  .label-penalty-search {
    /*line-height: 38px;*/
  }
  .info-user {
    text-align: left;
  }
  .table .thead-dark th {
    color: #fff;
    background-color: rgba(24,28,33,.9);
    border-color: #3f454a;
  }
  .custom-column {
    max-height: 200px;
    overflow-y: auto;
  }
  label {
    font-weight: 700;
  }
</style>
