<template>
  <div class="wrapper">
    <div class="ui-block">
      <div class="top">
        <h4 class="ui-block-heading">Cấu hình hồ sơ nhân sự</h4>
      </div>
      <hr>
    </div>
  <div class="mb-2">
    <b-row>
<!--      <b-col md="2">-->
<!--        <b-form-input placeholder="Hồ sơ" v-model="filter.name"></b-form-input>-->
<!--      </b-col>-->
      <b-col md="2">
        <SingleSelectDocumentType
          @handleSelected="option => filter.documentTypeId = option ? option.id : null"
          :reset="resetSelectDocument"
        />
      </b-col>
      <b-col md="2">
        <SingleSelectPosition
          @handleSelectedPosition="selectPosition"
          :reset="resetSelectPosition"
        />
      </b-col>
      <b-col md="2">
        <single-select-work-type
          @handleSelectedWorkType="op => (filter.workTypeId = op ? op.id : null)"
          :position-job="filter.positionId"
          :work-type-id="filter.workTypeId"
        >
        </single-select-work-type>
      </b-col>
      <b-col md="6">
        <div class="custom-btn-group">
          <b-button variant="light" @click="clearFilter">
            <i class="ion ion-md-trash"></i> Xóa lọc
          </b-button>
          <b-button variant="warning" class="custom-btn-filter" @click="getConfigs">
            <i class="sidenav-icon ion ion-md-search"></i>Tìm kiếm
          </b-button>
          <b-button variant="success" @click="openAddModal = true">
            <i class="ion ion-md-add"></i>Thêm cấu hình
          </b-button>
        </div>
      </b-col>
    </b-row>
  </div>
  <div class="main" v-loading="loading">
    <div class="list">
      <div class="list-header">
        <div>
          <b>Mã hồ sơ</b>
        </div>
        <div>
          <b>Hồ sơ</b>
        </div>
        <div>
          <b>Loại hồ sơ</b>
        </div>
        <div>
          <b>Vị trí</b>
        </div>
        <div>
          <b>Hình thức</b>
        </div>
        <div>
          <b>Deadline</b>
        </div>
        <div>
          <b>Hành động</b>
        </div>
      </div>
      <div class="list-line" v-for="(item, index) in list" :key="`config-${index}`">
        <div>
          {{ `HS${item.ErpDocument.id}` }}
        </div>
        <div>
          {{ item.ErpDocument.name }}
        </div>
        <div>
         {{ item.ErpDocument.sub_type || 'Không xác định'}}
        </div>
        <div>
          {{ item.EmpPosition.position_name }}
        </div>
        <div>
          {{ item.WorkType.work_type_description || 'Không'}}
        </div>
        <div>
          {{ item.ErpDocument.deadline || 'Không'}}
        </div>
        <div>
          <b-button variant="success" size="sm" @click="edit(item)">
            <i class="ion ion-md-create"></i>
          </b-button>
          <b-button variant="danger" size="sm" @click="remove(item.ErpPositionDocument.id)">
            <i class="ion ion-md-trash"></i>
          </b-button>
        </div>
      </div>
      <b-pagination
      :total-rows="pagination.total"
      v-model="pagination.currentPage"
      :limit="pagination.limit"
      v-on:change="onPageChange"
      :per-page="pagination.limit"
    />
    </div>
  </div>
  <Create
    :open="openAddModal"
    :loading="loading"
    @updateOpen="updateOpenAddModal"
    @onDone="createConfig"
  />
  <Edit
    :open="openEditModal"
    :loading="loading"
    :conf="selected"
    @onDone="update"
    @updateOpen="status => openEditModal = status"/>
  </div>
</template>
<script>
import profileService from 'domain/services/profile-mamanger-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Create from './CreateConfigPositionDocument'
import Edit from './EditConfigPositionDocument'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectWorkType from 'components/elements/common/SingleSelectWorkType'
import SingleSelectDocumentType from 'components/elements/common/SingleSelectDocumentType'

export default {
  components: {Create, Edit, SingleSelectPosition, SingleSelectWorkType, SingleSelectDocumentType},
  mounted () {
    this.getConfigs()
  },
  data () {
    return {
      loading: false,
      openAddModal: false,
      openEditModal: false,
      currentPage: 1,
      list: [],
      pagination: {
        currentPage: 1,
        limit: 10,
        total: 0
      },
      filter: {
        positionId: null,
        documentTypeId: null,
        workTypeId: null
      },
      selected: {},
      resetSelectPosition: false,
      resetSelectDocument: false
    }
  },
  methods: {
    async getConfigs () {
      try {
        this.loading = true
        const {data} = await profileService.getPositionDocumentConfig({
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
    updateOpenAddModal (status) {
      this.openAddModal = status
    },
    selectPosition (p) {
      this.filter.positionId = p.id
    },
    async createConfig (req) {
      try {
        this.loading = true
        const {data} = await profileService.addPositionDocumentConfig(req)
        if (data.success) {
          this.resetPagination()
          this.list = data.data.list
          this.pagination.total = data.data.total
          this.openAddModal = false
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    remove (id) {
      this.$bvModal.msgBoxConfirm('Bạn có chắc muốn xóa config?', {
        title: 'Xóa config hồ sơ - nhân sự',
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
        const {data} = await profileService.removePositionDocumentConfig({id})
        if (data.success) {
          this.list = data.data.list
          this.resetPagination()
          this.pagination.total = data.data.total
          commonHelper.showMessage('Xóa config hồ sơ thành công', 'success')
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    resetPagination () {
      this.pagination = {
        currentPage: 1,
        limit: 10,
        total: 0
      }
    },
    edit (data) {
      this.selected = {
        id: data.ErpPositionDocument.id,
        docId: data.ErpDocument.id,
        positionId: data.EmpPosition.id,
        workTypeId: data.WorkType.id
      }
      this.openEditModal = true
    },
    async update (req) {
      try {
        this.loading = true
        const {data} = await profileService.updatePositionDocumentConfig(req)
        if (data.success) {
          this.list = data.data.list
          this.resetPagination()
          this.pagination.total = data.data.total
          commonHelper.showMessage('Update config hồ sơ thành công', 'success')
          this.openEditModal = false
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    clearFilter () {
      this.filter = {
        positionId: null,
        documentTypeId: null,
        workTypeId: null
      }
      this.resetSelectPosition = !this.resetSelectPosition
      this.resetSelectDocument = !this.resetSelectDocument
      this.getConfigs()
    },
    onPageChange (page) {
      this.pagination.currentPage = page
      this.getConfigs()
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
.list{
  border: solid #f8f9fa;
  background-color: #fff;
  padding: 1.5rem;
  &-header,&-line{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;
  }

  &-header{
    margin-bottom: 2vh;
  }

  &-line{
    border-top: 1px solid #dee2e6;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  &-line:hover{
    color: #212529;
    background-color: rgba(0,0,0,.075);
  }
}
</style>
