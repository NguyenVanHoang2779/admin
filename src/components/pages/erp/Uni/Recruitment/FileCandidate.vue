<template>
  <b-form-row class="form-file">
    <b-form-group class="col-md-6 border rounded"  label="CMND/CCCD">
      <span slot="label">CMND/CCCD <span class="text-danger" v-show="!!edit">(*)</span></span>
      <file-view-upload
        input-id="CMND/CCCD"
        :input-style="{ width: '5rem' }"
        :allow-delete="allowDelete"
        :hide-upload-button="true"
        height="5rem"
        :edit="edit"
        :files="fileExist.personal_id_file"
        :file-add="fileAdd.personal_id_file"
        :is-thumbnail="true"
      ></file-view-upload>
    </b-form-group>
    <b-form-group class="col-md-6 border rounded"  label="Giấy bảo lãnh trách nhiệm dân sự">
      <!-- <span slot="label">File bảo lãnh trách nhiệm dân sự<span class="text-danger" v-show="!!edit">(*)</span></span> -->
      <file-view-upload
        input-id="guarantee_file"
        :input-style="{ width: '5rem' }"
        :allow-delete="allowDelete"
        :hide-upload-button="true"
        height="5rem"
        :edit="edit"
        :files="fileExist.guarantee_file"
        :file-add="fileAdd.guarantee_file"
      ></file-view-upload>
    </b-form-group>
    <b-form-group class="col-md-12 border rounded"  label="Sổ hộ khẩu">
      <span slot="label">Sổ hộ khẩu <span class="text-danger" v-show="!!edit">(*)</span></span>
      <file-view-upload
        input-id="curriculum_vitae_file"
        :input-style="{ width: '5rem' }"
        :allow-delete="allowDelete"
        :hide-upload-button="true"
        height="5rem"
        :edit="edit"
        :files="fileExist.curriculum_vitae_file"
        :file-add="fileAdd.curriculum_vitae_file"
      ></file-view-upload>
    </b-form-group>
    <b-form-group class="col-md-6 border rounded"  label="Hợp đồng dịch vụ">
      <span slot="label">Hợp đồng dịch vụ <span class="text-danger" v-show="!!edit">(*)</span></span>
      <file-view-upload
        input-id="contract_file"
        :input-style="{ width: '5rem' }"
        :allow-delete="allowDelete"
        :hide-upload-button="true"
        height="5rem"
        :edit="edit"
        :files="fileExist.contract_file"
        :file-add="fileAdd.contract_file"
      ></file-view-upload>
    </b-form-group>
    <b-form-group class="col-md-6 border rounded"  label="Hợp đồng trách nhiệm vật chất">
      <span slot="label">Hợp đồng trách nhiệm vật chất <span class="text-danger" v-show="!!edit">(*)</span></span>
      <file-view-upload
        input-id="asset_responsibility_file"
        :input-style="{ width: '5rem' }"
        :allow-delete="allowDelete"
        :hide-upload-button="true"
        height="5rem"
        :edit="edit"
        :files="fileExist.asset_responsibility_file"
        :file-add="fileAdd.asset_responsibility_file"
      ></file-view-upload>
    </b-form-group>
    <b-form-group class="col-md-6 border rounded"  label="Cam kết không gian lận">
      <span slot="label">Cam kết không gian lận <span class="text-danger" v-show="!!edit">(*)</span></span>
      <file-view-upload
        input-id="commitment_cheat_file"
        :input-style="{ width: '5rem' }"
        :allow-delete="allowDelete"
        :hide-upload-button="true"
        height="5rem"
        :edit="edit"
        :files="fileExist.commitment_cheat_file"
        :file-add="fileAdd.commitment_cheat_file"
      ></file-view-upload>
    </b-form-group>
    <b-form-group class="col-md-6 border rounded"  label="Cam kết bảo mật thông tin">
      <span slot="label">Cam kết bảo mật thông tin <span class="text-danger" v-show="!!edit">(*)</span></span>
      <file-view-upload
        input-id="commitment_security_file"
        :input-style="{ width: '5rem' }"
        :allow-delete="allowDelete"
        :hide-upload-button="true"
        height="5rem"
        :edit="edit"
        :files="fileExist.commitment_security_file"
        :file-add="fileAdd.commitment_security_file"
      ></file-view-upload>
    </b-form-group>
  </b-form-row>
</template>

<style lang="css" scoped>
.form-file >>> legend {
  width: auto;
}
</style>

<script>
// helper
import commonHelper from 'infrastructures/helpers/common-helpers'

// custom component
import FileViewUpload from 'components/elements/common/FileViewUpload'

// service
import candidateService from 'domain/services/candidate-service'

export default {
  name: 'file-candidate',

  components: {
    FileViewUpload
  },

  props: {
    idCandidate: {
      default: null
    },
    fileExist: {
      type: Object,
      default: _ => ({
        avatar_file: [],
        personal_id_file: [],
        curriculum_vitae_file: [],
        guarantee_file: [],
        contract_file: [],
        asset_responsibility_file: [],
        commitment_cheat_file: [],
        commitment_security_file: [],
        driver_license_file: []
      })
    },
    fileAdd: {
      type: Object,
      default: _ => ({
        avatar_file: [],
        personal_id_file: [],
        curriculum_vitae_file: [],
        guarantee_file: [],
        contract_file: [],
        asset_responsibility_file: [],
        commitment_cheat_file: [],
        commitment_security_file: [],
        driver_license_file: []
      })
    },
    edit: {
      default: true
    },
    allowDelete: {
      default: false
    }
  },

  data: _ => ({
  }),

  created () {
    if (this.idCandidate) this.getFileCandidate()
  },

  watch: {
    idCandidate (newVal, oldVal) {
      if (newVal) this.getFileCandidate(newVal)
    }
  },

  methods: {
    getFileCandidate (candidateId) {
      if (!candidateId) candidateId = this.idCandidate || null
      if (!candidateId) return
      candidateService.getFileCandidate({ candidate_id: candidateId })
        .then(res => {
          if (res.data.success) {
            if (!this.fileExist) this.fileExist = {}
            this.fileExist.avatar_file = res.data.data.avatar_file || []
            this.fileExist.personal_id_file = res.data.data.personal_id_file || []
            this.fileExist.curriculum_vitae_file = res.data.data.curriculum_vitae_file || []
            this.fileExist.guarantee_file = res.data.data.guarantee_file || []
            this.fileExist.contract_file = res.data.data.contract_file || []
            this.fileExist.asset_responsibility_file = res.data.data.asset_responsibility_file || []
            this.fileExist.commitment_cheat_file = res.data.data.commitment_cheat_file || []
            this.fileExist.commitment_security_file = res.data.data.commitment_security_file || []
          } else {
            commonHelper.showMessage(res.data.message || 'Không lấy được file hồ sơ ứng viên !', 'warning')
          }
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra, không lấy được file hồ sơ ứng viên !', 'warning')
        })
    }
  }
}
</script>
