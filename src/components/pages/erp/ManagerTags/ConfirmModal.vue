<template>
  <!-- Xoá danh mục -->
  <b-modal
    v-model="openModal"
    :title="'Xoá danh mục'"
    modal-class="modal-custom"
    :header-class="'text-center justify-content-center d-flex'"
    centered
    static
    id="modal-confirm"
    hide-footer
    @show="onShow()"
    @hide="onClose()">
    <div class="modal-confirm" v-loading="loading">
      <div style="text-align: center">
        <p class="mb-0">Bạn có chắc chắn muốn Xoá Danh Mục</p>
        <p class="mb-0">{{this.category.categoryName}} không ?</p>
      </div>
    </div>
    <div class="text-center mb-2">
      <b-btn variant="ghtk" id='btn-save-add-note' name='btn-save-add-note' class="button-deny-modal" @click="onSave()">Xác nhận</b-btn>
    </div>
  </b-modal>
</template>
<style lang="scss" scoped>
::placeholder {
  color: #828282;
}
.button-close-modal-contact {
  border-radius: 5px;
  padding: 5px 30px;
}
.button-deny-modal {
  width: 100px;
  border-radius: 5px;
  padding: 5px 0px;
}

/deep/ .modal-header {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

/deep/ .modal-content {
  width: 82%;
}

.modal-confirm {
  padding: 20px;
  font-size: 16px;
  color: #000;
}

</style>

<script>

// helper
import commonHelper from 'infrastructures/helpers/common-helpers'

// service
import ManageTagService from 'domain/services/manage-tags-service'

export default {
  name: 'ConfirmModal',

  props: {
    open: {
      default: false
    },
    dataModal: {
      default: null
    }
  },

  data () {
    return {
      loading: false,
      openModal: false,
      category: {}
    }
  },

  watch: {
    open (v) {
      this.openModal = v
      this.category = this.dataModal
    }
  },

  methods: {
    onShow () {

    },

    onClose () {
      this.openModal = false
      this.$emit('onCloseModal', 'ConfirmModal')
    },

    async onSave () {
      if (!this.category.idCategory) { return commonHelper.showMessage('Thiếu category Id') }
      try {
        this.loading = true
        const res = await ManageTagService.ApiDeleteCategory({category_id: this.category.idCategory})
        if (res.data.success) {
          this.$emit('updateCategorySuccess', {subjectId: this.category.subjectId})
          commonHelper.showMessage('Xoá danh mục thành công', 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'error')
      } finally {
        this.loading = false
      }
    }

  }
}
</script>

<style scoped>
/deep/ .close {
  font-size: 1.5rem;
}
</style>
