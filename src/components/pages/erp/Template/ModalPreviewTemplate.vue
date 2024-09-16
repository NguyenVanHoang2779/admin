<template>
    <div>
        <b-modal id="preview-template" hide-footer hide-header @hidden="resetModal" static>
            <div v-if="template && template.type === 'candidate'">
                <h5>Chọn ứng viên để xem thử:</h5>
                <multi-select-candidate @onChange="selectedCandidate" :multi="false"></multi-select-candidate>
            </div>
            <div v-else>
                <h5>Chọn user để xem thử:</h5>
                <single-select-user :user="user"  @onChange="selectedUser"></single-select-user>
            </div>
            <div class="text-center mt-3">
                <b-btn variant="success" @click="downloadFile" style="padding: 5px 15px"><i class="ion ion-md-cloud-download"></i>Tải xuống</b-btn>
            </div>
        </b-modal>
    </div>
</template>

<script>
import ProfileService from 'domain/services/profile-service'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import MultiSelectCandidate from 'components/elements/common/MultiSelectCandidate'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-preview-template',

  components: {
    SingleSelectUser,
    MultiSelectCandidate
  },

  props: {
    template: {
      type: Object,
      default: function () {
        return {
          id: null,
          type: null
        }
      }
    }
  },

  data: () => ({
    listVariable: [],
    user: null,
    candidateId: null
  }),

  created () {
  },

  computed: {
  },

  watch: {
  },

  methods: {
    downloadFile () {
      let dataSend = {
        user_id: this.user.id,
        template_id: this.template.id,
        candidate_id: this.candidateId
      }
      ProfileService.downloadFile(dataSend)
        .then((res) => {
          if (res.data.success) {
            if (res.data.data[0] && res.data.data[0].url) {
              window.open(res.data.data[0].url, '_blank')
              commonHelper.showMessage(res.data.message, 'success')
            } else commonHelper.showMessage('Không nhận được link file được trả về, vui lòng liên hệ với IT để được hỗ trợ !')
            this.$bvModal.hide('preview-template')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    resetModal () {
      this.user = null
    },

    selectedUser (option) {
      this.user = option || null
    },

    selectedCandidate (option) {
      this.candidateId = option.id || null
    }
  }
}
</script>

<style scoped lang="scss">
</style>
