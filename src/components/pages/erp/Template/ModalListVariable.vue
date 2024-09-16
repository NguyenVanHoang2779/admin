<template>
  <b-modal size="xl" id="modal-list-variable" :hide-footer="true" body-class="mih-75 modal-overflow-auto modal-xl" class="modal-xl"
           :hide-header="true"
           static>
    <div class="deposit-history">
      <h4>Danh sách biến được dùng trong template:</h4>
      <b-row>
        <b-col lg="6" class="mb-3">
          <div class="deposit-history__search d-flex">
            <div role="group">
              <label for="input-var">Tên biến:</label>
              <b-form-input
                id="input-var"
                aria-describedby="input-var-help input-var-feedback"
                placeholder="Nhập tên biến" v-model="filterVariable"
                trim
              ></b-form-input>
            </div>
            <div role="group" class="mr-2 ml-2">
            </div>
            <div class="btn__search d-flex align-items-end">
              <b-btn class="btn-primary"  @click="searchVariable(filterVariable)">
                <i class="sidenav-icon ion ion-md-search"></i>
              </b-btn>
            </div>
          </div>
        </b-col>
        <b-col lg="6" class="d-flex align-items-end justify-content-lg-end mb-3">
          <b-btn variant="success" @click="openEditModal('create', null)"><i class="ion ion-md-add"></i> Thêm mới biến
            template
          </b-btn>
        </b-col>
      </b-row>
      <table class="table mb-0 table-hover table-bordered table-sm ">
        <thead>
        <tr>
          <th>STT</th>
          <th>Tên biến</th>
          <th>Chức năng</th>
          <th>Ví dụ cách sử dụng</th>
          <th width="10%">Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(variable,index) in listVariable">
          <td class="infor">{{ index + 1 }}</td>
          <td class="infor">{{ variable.variable }}</td>
          <td class="infor">{{ variable.descrip }}</td>
          <td class="infor">
            <p>{{ variable.example }}</p>
            <div v-if="variable.link">
              <file-view-upload
                class="d-inline-block"
                :input-id="'show_file_' + varEditting"
                :allow-delete="false"
                :hideUploadButton="true"
                height="5rem"
                :edit="false"
                :files="variable.link"
              ></file-view-upload>
            </div>
          </td>
          <td class="infor">
            <div>
              <b-btn class="btn btn-outline-info mb-1" @click="openEditModal('edit', variable.id)"><i
                class="ion ion-md-create"></i></b-btn>
              <b-btn class="btn btn-outline-danger mb-1" @click="deleteTemplateVariable(variable)"><i
                class="ion ion-md-trash"></i></b-btn>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="mt-3" v-if="totalPages > 1">
        <b-row>
          <b-col>
            <b-pagination
              :total-rows="totalItems"
              v-model="currentPage"
              :per-page="perPage"
              v-on:input="getListVariable(filterVariable)"
              align="center"
            />
          </b-col>
        </b-row>
      </div>
      <modal-edit-variable :showLink="showLink" :varEditting="varEditting" :trigger="triggerEdit" :type="typeEdit"
                           @on-updated="updateTemplateVariable"></modal-edit-variable>
    </div>
  </b-modal>
</template>

<script>
import TemplateService from 'domain/services/template-service'
import ModalEditVariable from './ModalEditVariable'
import commonHelper from 'infrastructures/helpers/common-helpers'
import FileViewUpload from 'components/elements/common/FileViewUpload'
export default {
  name: 'modal-list-refund',

  components: {ModalEditVariable, FileViewUpload},

  props: ['groupId', 'showLink'],

  data: () => ({listVariable: [],
    typeEdit: '',
    triggerEdit: false,
    varEditting: null,
    currentPage: 1,
    totalItems: 0,
    perPage: 10,
    filterVariable: null,
    files: []
  }),

  created () { this.getListVariable() },
  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  watch: {},
  methods: {
    getListVariable: function (filterVariable = null) {
      let dataSend = {
        page: this.currentPage,
        limit: this.perPage,
        filterVariable: filterVariable
      }

      TemplateService.getListVariable(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.listVariable = res.data.data
            this.listVariable.map(function (value, i) {
              if (value.link) {
                var links = []
                var arrLinks = value.link.split(',').map(s => s.trim())
                arrLinks.map(function (item, i) {
                  links.push({link: item, name: value.variable + '_' + i})
                })

                value.link = links
              }
            })
            this.totalItems = res.data.total
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    deleteTemplateVariable (Variable) {
      if (!confirm(`Bạn có chắc chắn muốn xóa biến (${Variable.variable}) có chức năng (${Variable.descrip}) không ?`)) {
        return
      }
      let id = {
        id: Variable.id
      }
      this.$startLoading()
      TemplateService.deleteVariable(id)
        .then(res => {
          if (res.data.success) {
            this.$notify({
              group: 'default',
              type: 'bg-success text-white',
              title: 'Thông báo',
              text: 'Xóa bản ghi thành công!'
            })
            this.getListVariable()
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: res.data.message
            })
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình xóa bản ghi.'
          })
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    openEditModal (type, variableId) {
      this.varEditting = variableId
      this.triggerEdit = !this.triggerEdit
      this.typeEdit = type
    },
    updateTemplateVariable (success) {
      if (success) {
        commonHelper.showMessage('Cập nhật biến template thành công', 'success')
        this.getListVariable(this.filterVariable)
      } else {
        commonHelper.showMessage('Có lỗi xảy ra trong quá trình cập nhật biến template', 'fail')
      }
    },
    searchVariable (filterVariable = null) {
      this.currentPage = 1
      this.getListVariable(filterVariable)
    }
  }
}
</script>

<style scoped lang="scss">
.infor {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.infor:hover {
  overflow: visible;
  white-space: normal;
  height: auto;
}

.mh-tb {
  min-height: 750px;
}
</style>
