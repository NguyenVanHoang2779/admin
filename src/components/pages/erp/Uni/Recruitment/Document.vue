<template>
  <div>
    <i v-if="loadingDocument" class="fas fa-spinner fa-pulse text-success ml-auto mr-1"></i>
    <div v-else-if="documents">
      <span>Hồ sơ:</span>
      <strong v-if="(documents.count_required || 0) == 0">Không yêu cầu</strong>
      <span v-else>
        <strong>{{documents.count_current || 0 }}/{{documents.count_required || 0 }} - {{documents.status || '' }} </strong>
        <span @click="showDocument()" class="ghtk-color cursor-pointer">(Xem)</span>
      </span>
    </div>
  </div>
</template>

<script>
import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'
import helper from 'infrastructures/helpers/common-helpers'

export default {
  props: {
    candidateId: {
      type: Number
    },
    documents: {
      type: Object,
      default: () => {
        return {
          count_required: 0,
          count_current: 0,
          status: ''
        }
      }
    }
  },
  data () {
    return {
      loadingDocument: false
    }
  },
  methods: {
    async getDocument () {
      this.loadingDocument = true
      return recruitmentService.getDocument({'candidate_id': this.candidateId})
        .then(res => {
          if (res.data.success) {
            return res.data.data
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi lấy document!')
          }
        })
        .catch(e => {
          helper.showMessage(e.message || 'Lỗi xảy ra, vui lòng liên hệ IT để được hỗ trợ!', 'error')
        })
        .finally(() => {
          this.loadingDocument = false
        })
    },
    async showDocument () {
      const files = await this.getDocument()
      this.$emit('showDocumentCandidate', files)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
