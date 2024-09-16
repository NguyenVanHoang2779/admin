<template>
  <div>
      <h3 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
          <div>Kiểu ticket</div>
          <div class="d-flex justify-content-end">
            <b-btn @click="showUpdateTicketModel = !showUpdateTicketModel" variant="primary btn-round" class="d-block"><span class="ion ion-md-add"></span>&nbsp;Tạo kiểu ticket</b-btn>
            <b-btn @click="showAllView = !showAllView" variant="primary btn-round" class="ml-2 d-block"><span class="ion ion-md-create"></span>&nbsp;Quyền view all sos</b-btn>
          </div>
      </h3>
    <b-modal v-model="showAllView" hide-footer  title="Quản lý quyền view all sos" ref="view-modal">
      <multi-select-user-view></multi-select-user-view>
    </b-modal>

    <b-modal v-model="showUpdateTicketModel" hide-footer :title="formData.id ? 'Cập nhập kiểu ticket' : (!formData.parent_id ? 'Tạo kiểu ticket' : 'Tạo kiểu ticket con')" ref="update-ticket" @hide="resetForm">
      <b-form @submit="onSubmit">
        <b-form-group label="Loại SOS" :disabled="!!formData.parent_id">
          <b-select
            :options="categoryOptions"
            v-model="formData.category"
          ></b-select>
        </b-form-group>
        <b-form-group :label="!formData.parent_id ? 'Tên kiểu ticket' : 'Tên kiểu ticket con'">
          <b-input
            v-model="formData.name"
            required
          ></b-input>
        </b-form-group>
        <div class="text-center">
          <b-button variant="primary" @click="updateTicket()" v-show="!!formData.id">Cập nhập</b-button>
          <b-button variant="primary" @click="createTicket()" v-show="!formData.id">Thêm</b-button>
        </div>
      </b-form>
    </b-modal>
        <v-client-table :data="tableData" :columns="columns" :options="options" ref="table-config" class="bg-white">
          <div slot="beforeTable" class="mb-1">
            <b-btn
              v-for="(category, idx) in categoryOptions"
              :key="idx"
              class="w-10 mr-2 outline-ghtk"
              @click="setCategory(category.value)"
              :class="category.value === curCategory && 'active'"
            >
              {{ category.text }}
            </b-btn>
          </div>
          <span slot="category" slot-scope="props">
            {{ categorySosDesc[props.row.category] }}
          </span>
          <div slot="edit" slot-scope="props">
            <b-btn variant="outline-primary" class="btn-sm mr-5 ml-2 font-initial"  @click="addSubticket(props.row)"><i class="ion ion-md-add"></i></b-btn>
            <b-btn variant="outline-success" class="btn-sm mr-5 ml-2 font-initial" @click.prevent="edit(props.row)"><i class="ion ion-md-create"></i></b-btn>
            <b-btn variant="outline-danger" class="btn-sm font-initial" @click.prevent="remove(props.row, props.index)"><i class="ion ion-md-close"></i></b-btn>
          </div>
          <child-ticket-type slot="child_row" slot-scope="props" :groupTicketType="groupTicketType" :parent_id="props.row.id"></child-ticket-type>
        </v-client-table>
  </div>
</template>

<style lang="scss" scoped>
</style>

<style src="@/vendor/libs/vue-data-tables/vue-data-tables.scss" lang="scss"></style>
<script>
import Vue from 'vue'
import { ClientTable } from 'vue-tables-2'
import ticketTypeServices from 'domain/services/ticket-type-services'
import ChildTicketType from './components/ChildTicketType'
import MultiSelectUserView from './components/MultiSelectUserView'

Vue.use(ClientTable)

export default {
  name: 'list-ticket-type',
  metaInfo: {
    title: 'Config loại SOS'
  },
  data: () => ({
    tableData: [],
    columns: ['category', 'id', 'name', 'edit'],
    options: {
      pagination: { chunk: 5 },
      headings: {
        category: 'Loại SOS',
        id: 'ID',
        name: 'Phân loại SOS',
        edit: 'Edit'
      },
      filterable: ['name', 'category'],
      filterAlgorithm: {
        category (row, query) {
          return row.category === query
        }
      }
    },
    curCategory: null,
    categorySosDesc: {
      sos_me: 'SOS-ME',
      sos_incident: 'SOS',
      sos_driver: 'SOS Xe tải'
    },
    categoryOptions: [
      { text: 'SOS-ME', value: 'sos_me' },
      { text: 'SOS', value: 'sos_incident' },
      { text: 'SOS tài xế', value: 'sos_driver' }
    ],
    showAllView: false,
    showUpdateTicketModel: false,
    formData: {
      id: null,
      name: null,
      parent_id: null,
      level: 1,
      category: null
    }
  }),

  created () {
    this.getData()
    this.getGroupCensor()
  },

  methods: {
    onSubmit (evt) {
      evt.preventDefault()
    },

    setCategory (category) {
      this.curCategory = category
      this.$refs['table-config'].setFilter(category)
    },

    resetForm () {
      for (const field in this.formData) {
        this.formData[field] = null
      }
      this.formData.level = 1
    },

    getData () {
      ticketTypeServices.getAllTicketTypes()
        .then(res => {
          if (res.data.success) this.tableData = res.data.data || []
          else {
            this.$notify({
              group: 'default',
              type: 'bg-waring text-dark',
              title: 'Thông báo',
              text: res.data.message
            })
          }
        })
        .catch(e => {
          this.errors.push(e)
          console.log(e)
        })
    },

    getGroupCensor () {
      ticketTypeServices.getListGroupTicketType()
        .then(res => {
          if (res.data.success) {
            this.groupTicketType = res.data.data
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
        })
    },

    edit (row) {
      this.showUpdateTicketModel = !this.showUpdateTicketModel
      this.formData.id = row.id
      this.formData.name = row.name
      this.formData.category = row.category
    },

    updateTicket () {
      if (!this.formData.category) {
        alert('Vui lòng chọn loại SOS')
        return
      }
      if (!this.formData.name) {
        alert('Vui lòng nhập tên phân loại nhóm SOS')
        return
      }
      ticketTypeServices.editTicketType(this.formData).then((response) => {
        if (response.data.success) {
          this.$refs['update-ticket'].hide()
          this.getData()
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: response.data.message
          })
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },

    remove (row) {
      if (!row || !row.id) return
      if (confirm('Bạn có chắc chắn muốn xóa "' + row.name + '" .Nếu bạn đồng ý, bạn sẽ xóa tất cả các kiểu ticket con của "' + row.name + '"')) {
        ticketTypeServices.deleteTicketType({id: row.id}).then((response) => {
          if (response.data.success) {
            this.getData()
            this.$notify({
              group: 'default',
              type: 'bg-success text-white',
              title: 'Thông báo',
              text: response.data.message
            })
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: response.data.message
            })
          }
        })
      } else {
        // something
      }
    },

    addSubticket (row) {
      this.showUpdateTicketModel = !this.showUpdateTicketModel
      this.formData.parent_id = row.id
      this.formData.level = 2
      this.formData.name = null
      this.formData.category = row.category
    },

    createTicket () {
      ticketTypeServices.createTicketType(this.formData).then((response) => {
        if (response.data.success) {
          this.$refs['update-ticket'].hide()
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: response.data.message
          })
          this.formData.name = ''
          this.getData()
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  },

  components: {
    ChildTicketType,
    MultiSelectUserView
  }
}
</script>
