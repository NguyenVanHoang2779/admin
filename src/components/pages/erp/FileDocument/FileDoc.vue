<template>
    <div class="payslip-manager-page">
        <b-modal id="modal-1" v-if="showModal" @close="showModal = true" :hide-footer="true"
                 :hide-header="true">
            <form id="app2" method="post">
                <div class="row">
                    <div class="col-md-12">
                        <label class="form-label d-none d-md-block">Upload file (*.htm, *.html)</label>
                        <b-form-file v-model="uploadFileE" class="mt-3" plain></b-form-file>
                    </div>
                    <div class="col-md-12">
                        <label class="form-label d-none d-md-block">Tên file</label>
                        <b-input type="text" v-model="nameE" placeholder="Tên file"/>
                    </div>
                    <div class="col-md-12">
                        <label class="form-label d-none d-md-block">Mã cơ chế</label>
                        <b-input type="text" v-model="codeE" placeholder="Mã cơ chế"/>
                    </div>
                    <div class="col-md-12">
                        <label class="form-label d-none d-md-block">Mô tả</label>
                        <b-textarea rows="3" v-model="desE" placeholder="Mô tả cơ chế"/>
                    </div>
                </div>
                <br>
            </form>
            <br>
            <div class="mb-4 text-center">
                <b-btn type="button" class="btn btn-primary pl-4 pr-4" @click="updateItem">Sửa</b-btn>
                <b-btn type="button" @click="$bvModal.hide('modal-1')">Đóng</b-btn>
            </div>
        </b-modal>
        <div class="ui-block">
            <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
                <div>Quản lý file cơ chế</div>
            </h4>
            <form id="app" method="post">
                <div class="row">
                    <div class="col-md-2">
                        <label class="form-label d-none d-md-block">Upload file (*.htm, *.html)</label>
                        <b-form-file v-model="uploadFile" class="mt-3" plain></b-form-file>
                    </div>
                </div>
                <hr/>
                <div class="row">
                    <div class="col-md-4">
                        <label class="form-label d-none d-md-block">Tên file</label>
                        <b-input type="text" v-model="name" placeholder="Tên file"/>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label d-none d-md-block">Mã cơ chế</label>
                        <b-input type="text" v-model="code" placeholder="Mã cơ chế"/>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label d-none d-md-block">Mô tả</label>
                        <b-textarea rows="3" v-model="des" placeholder="Mô tả cơ chế"/>
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-md-6 text-left">
                    </div>
                    <div class="col-md-6 text-right">
                        <b-btn type="button" variant="outline-primary" @click="addItem">
                            <i class="fa fa-plus-square" aria-hidden="true"></i>
                            Thêm file
                        </b-btn>
                    </div>
                </div>
                <br>
            </form>
        </div>
        <b-card no-body>
            <!-- Table controls -->
            <b-card-body>
                <div class="row">
                    <div class="col">
                        Per page: &nbsp;
                        <b-select size="sm" v-model="perPage" :options="[10, 20, 30, 40, 50]" class="d-inline-block w-auto" />
                    </div>
                    <div class="col">
                        <b-input size="sm" placeholder="Search..." class="d-inline-block w-auto float-sm-right" @input="filter($event)" />
                    </div>
                </div>

            </b-card-body>
            <!-- / Table controls -->
            <b-card-body>
                <b-table
                    id="my-table"
                    class="table-file-mechanism text-center"
                    :items="loadData"
                    :fields="fields"
                    :per-page="perPage"
                    :current-page="currentPage"
                    responsive
                    striped
                    hover
                >
                  <template v-slot:head(id)="data">
                    <span class="text-danger">{{ data.label }}</span>
                  </template>
                  <template v-slot:head(name)="data">
                    <span class="text-primary">{{ data.label }}</span>
                  </template>
                  <template v-slot:head(code)="data">
                    <span class="text-primary">{{ data.label }}</span>
                  </template>
                  <template v-slot:head(groups)="data">
                    <span class="text-success">{{ data.label }}</span>
                  </template>
                  <template v-slot:head(des)="data">
                    <span class="text-info">{{ data.label }}</span>
                  </template>
                  <template v-slot:head(option)="data">
                    <span class="text-info">{{ data.label }}</span>
                  </template>
                  <template v-slot:cell(option)="data">
                      <a :href="data.item.detail" target= '_blank'><i class="ion ion-md-reorder"></i></a>
                      <b-btn variant="outline-success borderless icon-btn" class="btn-sm"
                             v-on:click="showItem(data.item)"><i class="ion ion-md-create"></i></b-btn>
                      <a :href="data.item.url"><i class="ion ion-md-download"></i></a>
                      <b-btn variant="outline-danger borderless icon-btn" class="btn-sm"
                             v-on:click="deleteItem(data.item.id)"><i
                              class="ion ion-md-close"></i>
                      </b-btn>
                  </template>
                </b-table>
              <br>
              <div class="d-flex justify-content-center">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalItems"
                  :per-page="perPage"
                  class="mt-4"
                >
                  <template v-slot:prev-text><span class="text-info">Trang trước</span></template>
                  <template v-slot:next-text><span class="text-info">Trang sau</span></template>
                  <template v-slot:page="{ page, active }">
                    <b v-if="active">{{ page }}</b>
                    <i v-else>{{ page }}</i>
                  </template>
                </b-pagination>
              </div>
            </b-card-body>
        </b-card>
    </div>
</template>
<script>
import SalaryService from 'domain/services/salary-service'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'file-document',
  metaInfo: {
    title: 'Quản lý file cơ chế'
  },
  data () {
    return {
      perPage: 20,
      currentPage: 1,
      totalItems: 0,
      fields: [
        {
          key: 'id',
          label: 'Id',
          sortable: true
        },
        {
          key: 'name',
          label: 'Tên cơ chế',
          sortable: true
        },
        {
          key: 'code',
          label: 'Mã cơ chế',
          sortable: true
        },
        {
          key: 'des',
          label: 'Mô tả',
          sortable: true
        },
        {
          key: 'option',
          label: 'Thao tác',
          sortable: true
        }
      ],
      dataTable: [],
      name: '',
      code: '',
      des: '',
      uploadFile: null,
      nameE: '',
      codeE: '',
      desE: '',
      idE: '',
      uploadFileE: null,
      showModal: true,
      originalArticlesData: [],
      searchKeys: ['id', 'name', 'code']
    }
  },
  components: {
    flatPickr
  },
  created () {
    this.listAll()
  },
  computed: {
    loadData () {
      return this.dataTable
    }
  },
  methods: {
    filter (value) {
      const val = value.toLowerCase()
      const filtered = this.originalArticlesData.filter(d => {
        return Object.keys(d)
          .filter(k => this.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      })
      this.dataTable = filtered
    },
    clearInput () {
      this.name = ''
      this.code = ''
      this.des = ''
      this.uploadFile = null
    },
    addItem () {
      let dataSend = new FormData()
      dataSend.append('fileUp', this.uploadFile)
      dataSend.append('name', this.name)
      dataSend.append('code', this.code)
      dataSend.append('des', this.des)
      SalaryService.addFileDoc(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.clearInput()
            this.listAll()
            return commonHelper.showMessage('Upload file thành công', 'success')
          } else {
            return commonHelper.showMessage(response.data.message, 'failed')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi khi lấy dữ liệu', 'failed')
      })
    },
    deleteItem (id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
        return
      }
      let parmas = {
        id: id
      }
      SalaryService.deleteFileDoc(parmas).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.listAll()
            return commonHelper.showMessage('Xóa file thành công', 'success')
          } else {
            return commonHelper.showMessage('Có lỗi xảy ra khi xóa dữ liệu. Vui lòng thử lại sau', 'failed')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi khi xóa dữ liệu', 'failed')
      })
    },
    listAll () {
      SalaryService.listAllFile().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataTable = this.originalArticlesData = response.data.data
            this.totalItems = this.dataTable.length
          } else {
            return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'failed')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi khi lấy dữ liệu', 'failed')
      })
    },
    showItem (item) {
      this.idE = item.id
      this.nameE = item.name
      this.codeE = item.code
      this.desE = item.des
      this.uploadFileE = null
      this.$bvModal.show('modal-1')
    },
    updateItem () {
      let dataSend = new FormData()
      dataSend.append('fileUp', this.uploadFileE)
      dataSend.append('name', this.nameE)
      dataSend.append('code', this.codeE)
      dataSend.append('des', this.desE)
      dataSend.append('id', this.idE)
      SalaryService.upateFileDoc(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.$bvModal.hide('modal-1')
            this.listAll()
            return commonHelper.showMessage('cập nhật thành công', 'success')
          } else {
            return commonHelper.showMessage('Có lỗi xảy ra khi cập nhật dữ liệu. Vui lòng thử lại sau', 'failed')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi khi cập nhật dữ liệu', 'failed')
      })
    }
  }
}
</script>
<style lang="scss">
    .table-file-mechanism td{
        max-width: 300px;
    }
</style>
