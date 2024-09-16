<template>
  <div>
    <div class="row align-items-center">
      <b-btn class="btn btn-default btn-circle borderless" variant="outline-primary"
             @click="addRow">
        <!--              <b-btn variant="outline-primary" @click="test">-->
        <i class="ion ion-md-add"></i>
      </b-btn>
      <div class="font-weight-bold">{{data.role_name}}</div>
    </div>
    <div>
      <table class="table-sm table mb-0 table-striped text-center">
        <tbody>
        <tr v-for="(user, index) in data.users" v-if="user.status || has_disabled">
          <td style="width: 35%">
            <single-select-user-module @onChange="user.user_object = $event" :station_id="station_id" :user="user.user_object"></single-select-user-module>
            <div v-if="user.error_message">
              <p class="mb-0 text-left text-danger font-italic" v-for="mess in user.error_message">{{mess}}</p>
            </div>
          </td>
          <td style="width: 20%">
            <datepicker
              v-model="user.from"
              format="dd-MM-yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              placeholder="Từ vô hạn"
            />
          </td>
          <td style="width: 20%">
            <datepicker
              v-model="user.to"
              format="dd-MM-yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              placeholder="Đến vô hạn"
            />
          </td>
          <td style="width: 15%">
            <p v-if="user.modified_by">
              <span class="font-weight-bold">{{ user.modified_by }}</span>
              <span class="font-italic">({{ user.modified }})</span>
            </p>
          </td>
          <td>
            <div v-if="user.add">
              <b-btn size="sm" variant="outline-danger" @click="removeRow(index)">
                <i class="ion ion-md-close"></i>
              </b-btn>
            </div>
            <div v-else>
              <b-btn size="sm" v-if="user.status" variant="secondary" @click="user.status = 0">
                Xóa bản ghi
              </b-btn>
              <b-btn size="sm" v-else variant="success" @click="user.status = 1">
                Khôi phục lại
              </b-btn>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <hr/>
  </div>
</template>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Multiselect from 'vue-multiselect'
import SingleSelectUserModule from './SingleSelectUserModule'
import kpiModuleService from 'domain/services/kpi-module-service'
import Datepicker from 'vuejs-datepicker'

export default {
  props: {
    data: {
      type: Object
    },
    station_id: {},
    has_disabled: {}
  },
  name: 'role-user-config',

  components: {
    Multiselect,
    kpiModuleService,
    SingleSelectUserModule,
    Datepicker
  },
  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    }
  },

  data: () => ({
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    message: 'Nhập ít nhất 2 ký tự'
  }),

  computed: {
  },

  created () {
  },

  methods: {
    addRow () {
      this.data.users.push({from: null, to: null, user_object: {}, status: 1, add: true})
      this.$forceUpdate()
    },
    removeRow (index) {
      this.data.users.splice(index, 1)
      this.$forceUpdate()
    }
  }
}
</script>
