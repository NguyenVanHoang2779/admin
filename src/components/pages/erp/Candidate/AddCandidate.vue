<template>
    <div class="search-button-container">
      <b-row class="mx-0 filter pb-1 border-bottom">
        <b-col md="12" class="text-right">
          <b-btn right variant="ghtk" class="float-right" style="border-radius: 5px; width: 100%" @click="openModalAddCandidate()">
              <span slot="button-content">
                <i class="fas fa-plus"></i> Thêm ứng viên
              </span>
          </b-btn>
        </b-col>
      </b-row>
      <ModalAddCandidate @openModalImportData="openModalImportData"></ModalAddCandidate>
      <ModalImportData
        :isUploading="isUploading"
        :fileExcelCandidateDisabled="fileExcelCandidateDisabled"
        @changeFileExcelCandidateDisabled="changeFileExcelCandidateDisabled"
      >
      </ModalImportData>
    </div>
</template>

<script>
import ModalAddCandidate from './ModalAddCandidate'
import ModalImportData from './ModalImportData'
export default {
  name: 'AddCandidate',
  components: {ModalImportData, ModalAddCandidate},
  props: {
    isUploading: {
      default: null
    },
    fileExcelCandidateDisabled: {
      default () {
        return []
      }
    }
  },
  methods: {
    openModalAddCandidate () {
      this.$bvModal.show('modal-add-candidate')
    },
    openModalImportData () {
      this.$bvModal.hide('modal-add-candidate')
      this.$bvModal.show('modal-import-data-candidate')
    },
    changeFileExcelCandidateDisabled (data) {
      this.$emit('changeFileExcelCandidateDisabled', data)
    }
  }
}
</script>

<style scoped>

</style>
