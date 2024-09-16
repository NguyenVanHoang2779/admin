<template>
  <b-modal
    title="Thêm cấu hình hồ sơ"
    v-model="openAddModal"
    @hidden="openAddModal = false"
  >
    <b-form v-loading="loading">
      <b-form-group label="Hồ sơ">
        <SingleSelectDocumentType @handleSelected="selectDocType"/>
      </b-form-group>
      <b-form-group label="Vị trí">
        <SingleSelectPosition @handleSelectedPosition="selectPosition"/>
      </b-form-group>
      <b-form-group label="Hình thức làm việc" v-if="positionId">
<!--        <SingleSelectWorkType-->
<!--          @handleSelectedWorkType="selectWorkType"-->
<!--          :positionJob="positionId"-->
<!--        />-->
        <MultiSelectWorkType
          @handleSelectedWorkType="onSelectedWorkTypes"
          :positionCustom="positionId"
          :multiple="true"
          :workTypeId="workTypeId"
        >
        </MultiSelectWorkType>
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
import MultiSelectWorkType from 'components/elements/common/MultiSelectWorkType'

export default {
  components: {SingleSelectDocumentType, SingleSelectPosition, SingleSelectWorkType, MultiSelectWorkType},
  props: ['open', 'loading'],
  data () {
    return {
      docId: null,
      positionId: null,
      workTypeId: null,
      workTypeIds: [],
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
    done () {
      this.$emit('onDone', {
        docId: this.docId,
        positionId: this.positionId,
        workTypeId: this.workTypeIds
      })
    },
    // selectWorkType (v) {
    //   this.workTypeId = v.id
    // },
    onSelectedWorkTypes (options) {
      this.workTypeIds = options ? options.map(option => option.id) : []
    },
    resetModal () {
      this.docId = null
      this.positionId = null
      this.workTypeId = null
      this.workTypeIds = []
    }
  },
  watch: {
    open (v) {
      this.openAddModal = v
    },

    openAddModal (v) {
      this.resetModal()
      this.$emit('updateOpen', v)
    },

    workTypes (values) {
      this.workTypeIds = values ? values.join() : null
    }
  }
}
</script>
