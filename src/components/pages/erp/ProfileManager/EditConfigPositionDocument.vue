<template>
  <b-modal
    title="Chỉnh sửa cấu hình hồ sơ"
    v-model="openAddModal"
    @hidden="openAddModal = false"
  >
    <b-form v-loading="loading">
      <b-form-group label="Hồ sơ">
        <SingleSelectDocumentType
          @handleSelected="selectDocType"
          :documentId="docId"
        />
      </b-form-group>
      <b-form-group label="Vị trí">
        <SingleSelectPosition
          @handleSelectedPosition="selectPosition"
          :positionJob="positionId"
        />
      </b-form-group>
      <b-form-group label="Hình thức làm việc" v-if="positionId">
        <SingleSelectWorkType
          @handleSelectedWorkType="selectWorkType"
          :positionJob="positionId"
          :workTypeId="workTypeId"
        />
      </b-form-group>
    </b-form>
    <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="openAddModal = false">Hủy</button>
        <button type="button" class="btn btn-success" @click="done">Xong</button>
    </template>
  </b-modal>
</template>

<script>
import SingleSelectDocumentType from 'components/elements/common/SingleSelectDocumentType'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectWorkType from 'components/elements/common/SingleSelectWorkType'

export default {
  components: {SingleSelectDocumentType, SingleSelectPosition, SingleSelectWorkType},
  props: ['open', 'loading', 'conf'],
  data () {
    return {
      id: null,
      docId: null,
      positionId: null,
      workTypeId: null,
      openAddModal: false
    }
  },
  methods: {
    selectDocType (v) {
      this.docId = v.id
    },
    selectPosition (v) {
      this.positionId = v.id
    },
    selectWorkType (v) {
      this.workTypeId = v ? v.id : -1
    },
    done () {
      this.$emit('onDone', {
        id: this.id,
        docId: this.docId,
        positionId: this.positionId,
        workTypeId: this.workTypeId
      })
    }
  },
  watch: {
    open (v) {
      this.openAddModal = v
    },

    openAddModal (v) {
      this.$emit('updateOpen', v)
    },

    conf (v) {
      this.id = v.id
      this.docId = v.docId
      this.positionId = v.positionId
      this.workTypeId = v.workTypeId
    }
  }
}
</script>
