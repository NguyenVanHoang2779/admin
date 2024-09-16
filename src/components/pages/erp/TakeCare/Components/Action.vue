<template>
  <div class="action">
    <div class="btn">
      <!-- button -->
      <div
        v-if="!isSuccess"
        class="btn-action"
      >
        <button @click="openExplanationModal()">
          Hoàn thành
        </button>
        <button @click="openNoteModal()">
          Ghi chú
        </button>
      </div>
      <div
        v-else
        class="btn-detail"
      >
        <button @click="openExplanationModal()">
          Chi tiết
        </button>
      </div>
    </div>
    <!-- Explanation Modal -->
    <ExplanationModal
      :explanationModalId="explanationModalId"
      :title="'Giải trình'"
      :isReadOnly="isSuccess"
      :ticketInfo="ticketInfo"
    >
    </ExplanationModal>
    <!-- Note Modal -->
    <NoteModal
      :noteModalId="noteModalId"
      :title="'Ghi chú'"
      :ticketId="ticketInfo.id"
    >
    </NoteModal>
  </div>
</template>

<script>
// helper
import helpers from '../../../../../infrastructures/helpers/common-helpers'

// components
import ExplanationModal from './Modals/ExplanationModal.vue'
import NoteModal from '../../../../elements/common/modal/NoteModal.vue'

export default {
  name: 'Action',
  components: {
    NoteModal,
    ExplanationModal
  },
  props: {
    ticketInfo: {
      type: Object
    }
  },
  data: () => ({
    explanationModalId: 'explanation-modal',
    noteModalId: 'note-modal'
  }),
  created () {
    this.explanationModalId = helpers.generateUniqueId('explanation-modal')
    this.noteModalId = helpers.generateUniqueId('note-modal')
  },
  computed: {
    isSuccess () {
      return this.ticketInfo.status === 1
    }
  },
  methods: {
    openExplanationModal () {
      this.$bvModal.show(this.explanationModalId)
    },
    openNoteModal () {
      this.$bvModal.show(this.noteModalId)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../../../assets/sass/components/take-care-staff.scss';
</style>
