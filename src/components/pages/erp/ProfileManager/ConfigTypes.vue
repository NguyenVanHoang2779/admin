<template>
  <div class="wrapper">
    <div class="ui-block">
      <div class="top">
        <h4 class="ui-block-heading">Danh mục hồ sơ nhân sự</h4>
      </div>
      <hr>
    </div>
  <div class="mb-2">
    <b-row>
      <b-col md="3">
          <b-form-input placeholder="Mã hồ sơ" v-model="filter.code"></b-form-input>
      </b-col>
      <b-col md="3">
        <SingleSelectDocumentType
          @handleSelected="option => filter.type = option ? option.id : null"
          :reset="resetSelectDocument"
        />
      </b-col>
      <b-col md="6">
        <div class="custom-btn-group">
          <b-button variant="light" @click="clearFilter">
            <i class="ion ion-md-trash"></i> Xóa lọc
          </b-button>
          <b-button variant="warning" class="custom-btn-filter" @click="getDocumentTypes">
            <i class="sidenav-icon ion ion-md-search"></i>Tìm kiếm
          </b-button>
          <b-button variant="success" @click="openAddModal = true">
            <i class="ion ion-md-add"></i>Thêm loại hồ sơ
          </b-button>
        </div>
      </b-col>
    </b-row>
  </div>
  <Create
    :open="openAddModal"
    :loading="loading"
    :deadline_opts="deadlineOpts"
    @updateOpen="updateOpen"
    @done="done"
  />
  <EditConfigType
    :conf="selected"
    :open="openEditBox"
    :loading="loading"
    :deadline_opts="deadlineOpts"
    @done="updateConfigType"
    @updateOpen="updateOpenEdit"
  />
  <div class="main">
    <Types
      :loading="loading"
      :list="list"
      @deleteDocumentType="deleteDocumentType"
      @editDocumentType="editDocumentType"
    />
    <b-pagination
      :total-rows="pagination.total"
      v-model="pagination.currentPage"
      :limit="pagination.limit"
      v-on:change="onPageChange"
      :per-page="pagination.limit"
    />
  </div>
  </div>
</template>
<script>
import profileService from 'domain/services/profile-mamanger-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Create from './CreateDocumentType'
import Types from './Types'
import EditConfigType from './EditConfigType'
import SingleSelectDocumentType from 'components/elements/common/SingleSelectDocumentType'

export default {
  components: {Create, Types, EditConfigType, SingleSelectDocumentType},
  mounted () {
    this.loadDeadlineOpts()
    this.getDocumentTypes()
  },
  data () {
    return {
      loading: false,
      openAddModal: false,
      selected: null,
      deadlineOpts: [],
      list: [],
      pagination: {
        currentPage: 1,
        limit: 10,
        total: 0
      },
      filter: {
        code: null,
        type: null,
        name: null
      },
      openEditBox: false,
      resetSelectDocument: false
    }
  },
  methods: {
    async done (req) {
      try {
        this.loading = true
        const {data} = await profileService.addDocumentType(req)
        if (data.success) {
          this.list = data.data.list
          this.resetPagination()
          this.pagination.total = data.data.total
          commonHelper.showMessage('Thêm danh mục hồ sơ thành công', 'success')
          this.close()
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    async loadDeadlineOpts () {
      try {
        this.loading = true
        const {data} = await profileService.getDeadlineOpts()
        this.deadlineOpts = data.data
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    async getDocumentTypes () {
      try {
        this.loading = true
        const {data} = await profileService.getDocumentTypes({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.filter
        })
        this.list = data.data.list
        this.pagination.total = data.data.total
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    close () {
      this.openAddModal = false
    },
    onPageChange (page) {
      this.pagination.currentPage = page
      this.getDocumentTypes()
    },
    clearFilter () {
      this.filter = {
        code: null,
        type: null,
        name: null
      }
      this.resetSelectDocument = !this.resetSelectDocument
      this.getDocumentTypes()
    },
    updateOpen (status) {
      this.openAddModal = status
    },
    updateOpenEdit (status) {
      this.openEditBox = status
    },
    resetPagination () {
      this.pagination = {
        currentPage: 1,
        limit: 10,
        total: 10
      }
    },
    deleteDocumentType (id) {
      this.$bvModal.msgBoxConfirm('Bạn có chắc muốn xóa?', {
        title: 'Xóa danh mục hồ sơ',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Tiếp tục',
        cancelTitle: 'Hủy',
        hideHeaderClose: false,
        centered: true
      })
        .then(ok => {
          if (ok) this.executeDetele(id)
        })
        .catch(_ => {})
    },
    async executeDetele (id) {
      try {
        this.loading = true
        const {data} = await profileService.deleteDocumentType({id})
        if (data.success) {
          this.list = data.data.list
          this.resetPagination()
          this.pagination.total = data.data.total
          commonHelper.showMessage('Xóa danh mục hồ sơ thành công', 'success')
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    editDocumentType (data) {
      this.selected = data
      this.openEditBox = true
    },
    async updateConfigType (req) {
      try {
        this.loading = true
        const {data} = await profileService.updateDocumentType(req)
        if (data.success) {
          this.list = data.data.list
          this.resetPagination()
          this.pagination.total = data.data.total
          this.openEditBox = false
          commonHelper.showMessage('Update danh mục hồ sơ thành công', 'success')
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped lang="scss">
.top {
  display: flex;
  justify-content:space-between;
  align-items: center;
}
.row{
  &-custom{
    margin-top: 10px;
  }
  &-last {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
  }
}
.custom-btn{
  &-filter{
    margin-left: 5px;
    margin-right: 5px;
  }
  &-group{
    display: flex;
    justify-content: flex-end;
  }
}
.custom-pagination{
  margin-top: 2vh;
}
.analytic{
  &-bar{
    display: flex;
    justify-content: space-between;
  }
}
.row-last{
  display: flex;
  align-items: center;
}
.main{
  margin-top: 2vh;
}
</style>
