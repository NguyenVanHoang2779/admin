<template>
  <div>
    <b-row class="mb-1">
      <b-col>
        <h4>Quản lý quyền của nhân viên</h4>
      </b-col>
      <b-col class="text-right">
        <b-btn
          variant="outline-success"
          @click="functionActionType = 'add',
          $bvModal.show('update-function')"
          v-if="allowEditFunction"
        >
          + Thêm chức năng
        </b-btn>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="3" md="4" sm="6" class="mb-1">
        <multi-select-department
          :department-ids="filters.departments.join()"
          @handleDepartmentSelected="handleSelectField('departments', ...arguments)"
          :auto-close="true"
        ></multi-select-department>
      </b-col>
      <b-col lg="3" md="4" sm="6" class="mb-1">
        <select-group
          :group-ids="filters.groups.join()"
          :auto-close="true"
          @handleGroupSelected="handleSelectField('groups', ...arguments)"
        ></select-group>
      </b-col>
      <b-col lg="3" md="4" sm="6" class="mb-1">
        <multi-select-position
          :position-ids="filters.positions.join()"
          @handlePositionSelected="handleSelectField('positions', ...arguments)"
          :auto-close="true"
        ></multi-select-position>
      </b-col>
      <b-col lg="3" md="4" sm="6" class="mb-1">
        <select-user
          :user-ids="filters.users.join()"
          :multiple="true"
          :group-user="groupUser"
          @handleSelectedUser="handleSelectField('users', ...arguments)"
        ></select-user>
      </b-col>
      <b-col lg="3" md="4" sm="6" class="mb-1">
        <select-group-function
          :group-function-ids="filters.group_functions.join()"
          @handleGroupFunctionSelected="handleSelectField('group_functions', ...arguments)"
          :multiple="true"
        ></select-group-function>
      </b-col>
      <b-col lg="3" md="4" sm="6" class="mb-1">
        <select-function
          :function-ids="filters.function_ids.join()"
          @handleFunctionSelected="handleSelectField('function_ids', ...arguments)"
          :multiple="true"
        ></select-function>
      </b-col>
      <b-col lg="6" md="12" sm="12" class="text-right mb-1">
        <b-btn variant="primary" @click="getData">Tìm kiếm</b-btn>
        <b-btn @click="resetFilter">Xóa lọc</b-btn>
      </b-col>
    </b-row>
    <br/>
    <b-row class="mb-1">
      <b-col v-for="(value, field) in employeeDesc" :key="Math.random() + field">
        <b-badge :variant="value.variant">&nbsp;&nbsp;</b-badge> {{ value.desc }}
      </b-col>
    </b-row>

    <b-table
      responsive
      bordered
      hover
      head-variant="light"
      :items="permissionData"
      :fields="fields"
    >
      <template v-slot:cell(stt)="data">
        {{ (filters.page - 1) * page.perPage + data.index + 1 }}
      </template>
      <template v-slot:cell(type)="data">
        <b-badge :variant="typeDesc[data.item.ErpFunctionPermission.type].variant" v-if="data.item.ErpFunctionPermission.type">{{ typeDesc[data.item.ErpFunctionPermission.type].desc}}</b-badge>
      </template>
      <template v-slot:cell(user)="data">
        <template v-for="(value, field) in data.item.ErpFunctionPermission">
          <template v-if="value && typeof value === 'object'">
            <template v-for="(employee, idx) in value">
              <b-badge :variant="employeeDesc[field.replace('_id', '')].variant" :key="idx + field" class="mr-1">{{ employee }}</b-badge>
            </template>
          </template>
        </template>
      </template>
      <template v-slot:cell(action)="data">
        <div class="text-center">
          <b-btn
            class="mb-1"
            title="Chỉnh sửa config quyền"
            variant="outline-success"
            @click="currentPermissionEdit = data.item.ErpFunctionPermission.id, permissionActionType = 'edit', $bvModal.show('update-permission')"
            size="sm"
          ><i class="ion ion-md-create"></i>
          </b-btn>
          <b-btn
            class="mb-1"
            title="Copy config quyền"
            variant="outline-primary"
            @click="currentPermissionEdit = data.item.ErpFunctionPermission.id, permissionActionType = 'copy', $bvModal.show('update-permission')"
            size="sm"
          ><i class="ion ion-md-copy"></i>
          </b-btn>
          <b-btn
            v-if="allowEditFunction"
            class="mb-1"
            title="Chỉnh sửa chức năng"
            variant="outline-warning"
            @click="currentPermissionEdit = data.item.ErpFunctionPermission.id, functionActionType = 'edit', $bvModal.show('update-function')"
            size="sm"
          ><i class="ion ion-md-create"></i>
          </b-btn>
        </div>
      </template>
    </b-table>
    <div class="text-center" v-if="!permissionData || permissionData.length === 0 && !loading">Không có dữ liệu</div>
    <div class="mt-3" v-if="page.total >= 0">
      <b-row>
        <b-col>
          <b-pagination
            :total-rows="page.total"
            v-model="filters.page"
            :per-page="page.perPage"
            v-on:input="getData"
            align="center"
          />
        </b-col>
      </b-row>
    </div>

    <modal-update-function
      :type="functionActionType"
      :current-edit="currentPermissionEdit"
      @dataChange="getData()"
    ></modal-update-function>
    <modal-update-permission
      :type="permissionActionType"
      :current-edit="currentPermissionEdit"
      @dataChange="getData()"
    ></modal-update-permission>
  </div>
</template>

<script>
// entities
import Permission from 'domain/entities/Permission'
// custom components
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import SelectUser from './SelectUser'
import SelectGroup from 'components/elements/common/SelectGroup'
import ModalUpdateFunction from './ModalUpdateFunction'
import ModalUpdatePermission from './ModalUpdatePermission'
import SelectFunction from './SelectFunction'
import SelectGroupFunction from './SelectGroupFunction'

// utilities
import commonHelper from 'infrastructures/helpers/common-helpers'

// service
import permissionService from 'domain/services/permission-managerment-service'

export default {
  name: 'permission-manager-dashboard',

  components: {
    MultiSelectDepartment,
    MultiSelectPosition,
    SelectGroup,
    ModalUpdateFunction,
    SelectGroupFunction,
    SelectFunction,
    ModalUpdatePermission,
    SelectUser
  },

  props: {},

  data: () => ({
    filters: {
      departments: [],
      positions: [],
      groups: [],
      users: [],
      group_functions: [],
      function_ids: [],
      page: 1
    },
    permissionData: [],
    fields: [
      {label: 'STT', key: 'stt'},
      {label: 'Nhóm chức năng', key: 'FunctionGroup.name'},
      {label: 'Tên chức năng', key: 'ErpFunctionPermission.name'},
      {label: 'Loại', key: 'type'},
      {label: 'Nhân viên', key: 'user'},
      {label: 'Thao tác', key: 'action'}
    ],
    loading: false,
    typeDesc: null,
    employeeDesc: null,
    currentPermissionEdit: null,
    permissionActionType: null,
    functionActionType: null,
    allowEditFunction: false, // cho phép thao tác với thông tin cảu các chức năng (thêm, xóa, sửa chức năng)
    groupUser: [],
    page: {
      total: 0,
      perPage: 5
    }
  }),

  created () {
    this.getData()
    this.typeDesc = Permission.typeDesc
    this.employeeDesc = Permission.employeeDesc
  },

  methods: {
    handleSelectField (field, value) {
      this.filters[field] = []
      if (value) value.map((el) => (this.filters[field].push(el.id)))
    },

    resetFilter () {
      this.filters.departments = []
      this.filters.groups = []
      this.filters.positions = []
      this.filters.users = []
      this.filters.group_functions = []
      this.filters.function_ids = []
      this.filters.page = 1
      this.getData()
    },

    getData () {
      this.loading = true
      this.$startLoading()
      permissionService.getPermission(this.filters).then((res) => {
        if (res.data.success) {
          this.permissionData = res.data.data
          this.page.total = res.data.total
          if (res.data.isIt) {
            this.groupUser.push(3, 9, 8, 10, 22, 6, 19, 24, 15, 25) // hr, sale, sale B2C, BMR , it, kế toán, điều phối
            this.allowEditFunction = true
            this.fields.splice(-1, 0, {label: 'Trạng thái', key: 'ErpFunctionPermission.status'})
          } else {
            this.groupUser.push(3, 9, 8, 10, 22, 6, 19, 24, 25) // hr, sale,sale B2C, BMR, kế toán
            this.allowEditFunction = false
          }
        } else {
          this.permissionData = []
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch((err) => {
        console.log(err)
      }).then(() => {
        this.$stopLoading()
        this.loading = false
      })
    }
  }
}
</script>
