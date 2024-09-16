<template>
  <b-modal id="update-approval-penalties" modal-class="modal-md" hide-footer @close="close()">
    <template v-slot:modal-title>
      <h3 class="text-success"> Update người duyệt thẻ phạt</h3>
    </template>
    <b-row>
      <b-col>
        <b-row>
          <b-col class="label-penalty-search" sm="3">
            <label class="font-italic">Loại phạt:</label>
          </b-col>
          <b-col sm="6">
            <select-type-penalty @model="editData.selectTypePenalty = $event" :edit-data="editData"></select-type-penalty>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-row class="my-1">
          <b-col class="label-penalty-search" sm="3">
            <label class="font-italic">Loại đối tượng:</label>
          </b-col>
          <b-col sm="6">
            <multiselect
              class="multiselect-info"
              :options="subjectTypeOptions"
              v-model="editData.selectSubjectType"
              disabled
              selectLabel="Chọn"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              placeholder="Chọn loại đối tượng"
              label="name"
              track-by="id"
              :preserve-search="true"
              :hide-selected="false"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <div class="col-md">
        <div>
          <b-row class="my-1">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Đối tượng:</label>
            </b-col>
            <b-col sm="6" v-if="editData.selectSubjectType.id == 1">
              <multiselect
                v-model="editData.selectSubjects"
                label="name"
                track-by="id"
                placeholder=""
                selectLabel=""
                :options="asyncFound"
                :multiple="true"
                :searchable="true"
                :loading="asyncLoading"
                :internal-search="false"
                :clear-on-select="true"
                :close-on-select="true"
                :hide-selected="true"
                @search-change="asyncFind">
                <span slot="noResult">{{ message }}</span>
                <span slot="noOptions">{{ message }}</span>
              </multiselect>
            </b-col>
            <b-col sm="6" v-if="editData.selectSubjectType.id == 2 || editData.selectSubjectType.id == 4">
              <multiselect
                label="name"
                track-by="id"
                placeholder="Chọn đối tượng"
                :options="subjectPositionOptions"
                v-model="editData.selectSubjects"
                :multiple="true"
                :searchable="true"
                :loading="asyncLoading"
                :preserve-search="true"
                :clear-on-select="true"
                :close-on-select="true"
                :hide-selected="true"
                selectLabel="Chọn"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
              />
            </b-col>
            <b-col sm="6" v-if="editData.selectSubjectType.id == 3">
              <multiselect
                label="name"
                track-by="id"
                placeholder="Chọn đối tượng"
                :options="subjectGroupOptions"
                v-model="editData.selectSubjects"
                :multiple="true"
                :searchable="true"
                :loading="asyncLoading"
                :preserve-search="true"
                :clear-on-select="true"
                :close-on-select="true"
                :hide-selected="true"
                selectLabel="Chọn"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
              />
            </b-col>
          </b-row>
        </div>
      </div>
    </b-row>
    <b-row class="mt-3">
      <b-col class="d-flex justify-content-end">
        <b-btn variant="outline-secondary" @click="close()">Hủy bỏ</b-btn>
        <b-btn class="ml-3" variant="outline-success" :disabled="isProcessing" @click="updateConfig()">Chỉnh sửa <i v-if="isProcessing" class="fa fa-spinner fa-spin"></i></b-btn>
      </b-col>
    </b-row>
  </b-modal>
</template>
<style scoped type="text/css">
label {
  font-weight: 700;
}
</style>
<script>
import SelectTypePenalty from '../../approvalPenalties/component/SelectTypePenalty'
import SelectUserPenalty from '../../approvalPenalties/component/SelectUserPenalty'
import ApprovalPenalty from 'domain/services/approval-penalty-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
import debounce from 'debounce'

export default {
  name: 'modal-update',
  components: {
    SelectTypePenalty,
    SelectUserPenalty,
    Multiselect
  },
  props: ['editData', 'subjectGroupOptions', 'listData', 'subjectPositionOptions'],

  data: () => ({
    subjectTypeOptions: [
      {id: 1, name: 'User'},
      {id: 2, name: 'Positions'},
      {id: 3, name: 'Group'},
      {id: 4, name: 'Quản lý duyệt'}
    ],
    isProcessing: false,
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    message: 'Nhập ít nhất 2 ký tự',
    selectSubjectType: {}
  }),
  watch: {
    // asyncSelected () {
    //   console.log(this.asyncSelected)
    //   // this.$emit('model', this.asyncSelected.map(a => a.id))
    // },
    'editData.selectSubjects' () {
      this.asyncSelected = this.editData.selectSubjects
    }
    // 'editData.selectSubjectType': function (newValue, oldValue) {
    //   if (newValue !== oldValue) {
    //     this.asyncSelected = []
    //   }
    // }
  },
  created () {
    this.asyncSelected = this.editData.selectSubjects
    // this.asyncSelected = this.editData.selectSubjects
    // this.$emit('model', this.asyncSelected.map(a => a.id))
  },
  methods: {
    close () {
      this.$bvModal.hide('update-approval-penalties')
    },
    updateConfig () {
      this.isProcessing = true
      let dataSend = {
        type_penalty: this.editData.selectTypePenalty,
        subject_type: this.editData.selectSubjectType,
        subject_id: this.asyncSelected,
        list_id: this.editData.list_id
      }

      if (dataSend.type_penalty.length === 0 || dataSend.subject_id.length === 0) {
        commonHelper.showMessage('Loại phạt hoặc đối tượng không được để trống', 'failed')
        this.isProcessing = false
        return 1
      }
      ApprovalPenalty.apiSaveApprovalPenaltyData(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.listData()
          return this.close()
        }
        commonHelper.showMessage(res.data.message)
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra vui lòng thử lại')).finally(() => {
        this.isProcessing = false
      })
    },
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      sosService.apiGetListUsers({term: query}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.asyncFound = response.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    }, 500)
  }
}
</script>
