<template>
  <b-modal id="create-approval-penalties" modal-class="modal-md" hide-footer @close="close()">
    <template v-slot:modal-title>
      <h3 class="text-success"> {{ modelPopUpName }}</h3>
    </template>
    <b-row>
      <b-col>
        <b-row>
          <b-col class="label-penalty-search" sm="3">
            <label class="font-italic">Loại phạt:</label>
          </b-col>
          <b-col sm="6">
            <select-type-penalty @model="selectTypePenalty = $event" :edit-data="editData"></select-type-penalty>
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
              v-model="selectSubjectType"
              selectLabel="Chọn"
              selectedLabel="Đã chọn"
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
          <b-row class="my-1" v-if="selectSubjectType != null">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Đối tượng:</label>
            </b-col>
            <b-col sm="6" v-if="selectSubjectType.id == 1">
              <b-form-checkbox
                v-model="checkShow"
                value="1"
                unchecked-value="0"
                class="mb-2"
              >
                Nhập chuỗi username:
              </b-form-checkbox>
              <select-user-penalty v-if="checkShow == 0"
                @model="selectSubjectId = $event"
              >
              </select-user-penalty>
              <b-form-textarea
                v-else
                id="textarea"
                v-model="stringUsername"
                placeholder="Nhập username cách nhau bởi dấu ' , '"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-col>

            <b-col sm="6" v-if="selectSubjectType.id == 2 || selectSubjectType.id == 4">
              <multiselect
                class="multiselect-info"
                :options="subjectPositionOptions"
                v-model="selectSubjectId"
                :multiple="true"
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
            <b-col sm="6" v-if="selectSubjectType.id == 3">
              <multiselect
                class="multiselect-info"
                :options="subjectGroupOptions"
                v-model="selectSubjectId"
                :multiple="true"
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
    </b-row>
    <b-row class="mt-3">
      <b-col class="d-flex justify-content-end">
        <b-btn variant="outline-secondary" @click="close()">Hủy bỏ</b-btn>
        <b-btn class="ml-3" variant="outline-success" :disabled="isProcessing" @click="createConfig()">Tạo mới <i v-if="isProcessing" class="fa fa-spinner fa-spin"></i></b-btn>
      </b-col>
    </b-row>
  </b-modal>
</template>
<style scoped>
</style>
<script>
import SelectTypePenalty from '../../approvalPenalties/component/SelectTypePenalty'
import SelectUserPenalty from '../../approvalPenalties/component/SelectUserPenalty'
import ApprovalPenalty from 'domain/services/approval-penalty-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'

export default {
  name: 'create-approval-penalties',
  components: {
    SelectTypePenalty,
    SelectUserPenalty,
    Multiselect
  },
  props: ['modelPopUpName', 'subjectGroupOptions', 'listData', 'subjectPositionOptions'],
  watch: {
    selectSubjectType () {
      this.selectSubjectId = []
    }
  },
  data: () => ({
    subjectTypeOptions: [
      {id: 1, name: 'User'},
      {id: 2, name: 'Positions'},
      {id: 3, name: 'Group'},
      {id: 4, name: 'Quản lý duyệt'}
    ],
    selectTypePenalty: [],
    checkShow: 0,
    stringUsername: '',
    editData: {
      selectTypePenalty: ''
    },
    selectSubjectType: {id: 1, name: 'User'},
    selectSubjectId: [],
    isProcessing: false
  }),
  computed: {
    usernames: function () {
      return this.stringUsername.replace(/\s/g, '').split(',')
    }
  },
  methods: {
    close () {
      this.selectTypePenalty = []
      this.selectSubjectId = []
      this.$bvModal.hide('create-approval-penalties')
    },
    createConfig () {
      this.isProcessing = true
      let subjectId = []
      if (this.selectSubjectType === null) {
        commonHelper.showMessage('Loại đối tượng chưa được chọn', 'failed')
        this.isProcessing = false
        return 1
      }
      if ([2, 3, 4].includes(this.selectSubjectType.id)) {
        for (let i = 0; i < this.selectSubjectId.length; i++) {
          subjectId.push(this.selectSubjectId[i].id)
        }
      } else {
        subjectId = this.selectSubjectId
      }
      let dataSend = {
        type_penalty: this.selectTypePenalty,
        subject_type: this.selectSubjectType,
        subject_id: subjectId,
        check_show: this.checkShow,
        usernames: this.usernames
      }
      ApprovalPenalty.apiCreateApprovalPenaltyData(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.listData()
          return this.close()
        }
        commonHelper.showMessage(res.data.message)
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra vui lòng thử lại')).finally(() => {
        this.isProcessing = false
      })
    }
  }
}
</script>
<style scoped type="text/css">
label {
  font-weight: 700;
}
</style>
