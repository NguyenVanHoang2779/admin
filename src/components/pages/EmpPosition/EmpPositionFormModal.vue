<template>
        <b-modal v-model="showModal" @hidden="handleHideModal" @ok="handleSubmit">
            <div>
                <b-row class="mb-3">
                <b-col md="6">
                  <b-form-group>
                    <label>Phòng ban <span class="text-danger">(*)</span></label>
                    <SingleSelectDepartment
                    v-if="formData"
                    @handleSelectedDepartment="handleSelectedDepartment"
                    :department-id="formData.department_id"
                    ></SingleSelectDepartment>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group>
                    <label>Vị trí <span class="text-danger">(*)</span></label>
                    <b-form-input v-model="formData.position_name" type="text"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Nhóm">
                    <SelectGroup
                    @handleGroupSelected="handleGroupSelected"
                    :groupIds="formData.group_id"
                    :multiple="false"
                    >
                    </SelectGroup>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Loại Nhóm">
                    <select class="form-control" v-model="formData.group_type">
                      <slot name="options">
                        <option v-for="(name, value, index) in groupTypes" :key="index" :value="value">{{ name }}</option>
                      </slot>
                    </select>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Hình thức trả lương">
                    <b-form-input
                     type="text"
                     v-model="formData.type_salary"
                     >
                     </b-form-input>

                  </b-form-group>
                </b-col>
                  <b-col md="6">
                    <b-form-group label="Trạng thái">
                      <select class="form-control" v-model="formData.status">
                        <slot name="options">
                          <option v-for="(option, index) in statusOptions" :key="index" :value="option.value">{{ option.name }}</option>
                        </slot>
                      </select>
                    </b-form-group>
                  </b-col>
            </b-row>
            </div>
      </b-modal>
</template>

<style scoped lang="scss">

</style>

<script>
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SelectGroup from 'components/elements/common/SelectGroup'
import SelectOption from 'components/elements/common/SelectOption'

export default {
  name: 'EmpPositionFormModal',
  components: {
    SingleSelectDepartment,
    SelectGroup,
    SelectOption
  },

  props: [
    'modalShow',
    'position',
    'groupTypes',
    'action'
  ],

  data: () => ({
    showModal: false,
    statusOptions: [
      { value: 'active', name: 'Active' },
      { value: 'disable', name: 'Disable' }
    ],
    formData: {
      id: '',
      type_salary: '',
      group_type: '',
      position_name: '',
      department_id: '',
      group_id: '',
      status: 'active'
    }
  }),

  watch: {
    modalShow (newValue) {
      this.showModal = newValue
    },
    position (newValue) {
      this.formData = {...newValue}
    }
  },

  computed: {

  },

  methods: {
    handleSelectedDepartment: function (option) {
      this.formData.department_id = option ? option.id : ''
    },

    handleGroupSelected: function (option) {
      this.formData.group_id = option ? option.id : ''
    },

    handleHideModal: function () {
      this.$emit('updateModalShow', false)
    },

    handleSubmit (evt) {
      evt.preventDefault()
      let action = ''
      if (this.action === 'CREATE') {
        action = 'handleCreate'
      } else if (this.action === 'UPDATE') {
        action = 'handleUpdate'
      }
      this.$emit(action, {
        'id': this.position.id,
        'type_salary': this.formData.type_salary,
        'group_type': this.formData.group_type,
        'position_name': this.formData.position_name,
        'department_id': this.formData.department_id,
        'group_id': this.formData.group_id,
        'status': this.formData.status
      })
    }
  }
}
</script>
