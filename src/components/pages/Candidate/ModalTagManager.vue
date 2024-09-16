<template>
    <div>
        <b-modal id = "modal-tag-manager" modal-class="modal-md" ref="tagsModal" title="Quản lý tags ứng viên" @hidden="resetModal" centered hide-footer>
            <div v-if="listTags.length > 0" class="d-flex">
                <tag :list-tag="listTags" :is-manage-tag="1" @getListTagByHr="getListTagByHr"></tag>
            </div>
            <div v-else>Không có tag nào!</div>
            <div  v-if="!formAddTag" class="mt-3"><b-button variant="outline-success" @click="formAddTag = true"><i class="fas fa-plus"></i> Thêm tag</b-button></div>
            <div v-else class="mt-3">
                <b-row>
                    <b-col md="6">
                        <b-input v-model="tagName" placeholder="Nhập tên tag" class="only-bottom-border" @keyup.enter="addTagByHr"></b-input>
                    </b-col>
                    <b-col md="6" class="d-flex align-items-end">
                        <b-btn size="sm" variant="outline-success mr-1" @click="addTagByHr()" title="Thêm tag"><i class="ion ion-md-save"></i> Lưu tag</b-btn>
                        <b-btn size="sm" variant="outline-danger" @click="formAddTag = false" title="Hủy"><i class="fas fa-times"></i></b-btn>
                    </b-col>
                </b-row>
            </div>
        </b-modal>
    </div>
</template>
<script>

// service
import candidateService from 'domain/services/candidate-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

// Components
import Tag from 'components/elements/common/Tag'

export default {
  name: 'modal-tag-manager',

  components: {
    Tag
  },

  props: [
  ],

  data: () => ({
    tagName: null,
    formAddTag: false,
    listTags: []
  }),

  created () {
    this.getListTagByHr()
  },

  watch: {
  },

  methods: {
    resetModal: function () {
      this.formAddTag = false
    },

    getListTagByHr: function () {
      candidateService.getListTagByHr()
        .then(res => {
          if (res.data.success) {
            this.listTags = res.data.data
          } else commonHelper.showMessage('Không lấy được danh sách tag !', 'warning')
        })
        .catch(e => {
          commonHelper.showMessage('Không lấy được danh sách tag !', 'warning')
          console.log(e)
        })
    },

    addTagByHr: function () {
      if (!this.tagName) {
        alert('Vui lòng nhập tên tag')
        return
      }
      candidateService.addTagByHr({ name: this.tagName })
        .then(res => {
          if (res.data.success) {
            this.getListTagByHr()
            this.formAddTag = false
            commonHelper.showMessage(res.data.mesage || 'Thêm mới tag thành công', 'success')
          } else commonHelper.showMessage(res.data.mesage || 'Không thể thêm tag !', 'success')
        })
        .catch(e => {
          commonHelper.showMessage('Có lỗi xảy ra, không thể thêm tag !', 'success')
          console.log(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
    .only-bottom-border {
        border: 0;
        border-bottom: solid 1px;
        border-radius: 0;
        border-bottom-color: #8b949d;
    }
</style>
