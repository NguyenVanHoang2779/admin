<template>
  <b-modal
    :title=title
    id="id_modalShowDetails" >
    <b-form v-loading="loading">
      <b-row class="mb-3">
        <b-col>
          <b-form-group
            label=""
          >
            <b-form-textarea
              :disabled="true"
              v-model="listData"
              max-rows="9"
            ></b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <template slot="modal-footer">
      <button  type="button" class="btn btn-success" @click="closeModal()" style="margin-right: 44%">Đóng</button>
    </template>
  </b-modal>
</template>

<script>

import ConfigRoleService from 'domain/services/config-role-service'
import Datepicker from 'vuejs-datepicker'
import Moment from 'moment'

export default {
  name: 'showDetail',
  components: {
    ConfigRoleService,
    Datepicker,
    Moment
  },
  props: {
    listData: ''
  },

  data () {
    return {
      loading: false,
      title: 'Thông tin chi tiết'
    }
  },
  watch: {
  },
  methods: {
    closeModal () {
      this.$bvModal.hide('id_modalShowDetails')
    }
  }
}
</script>

<style scoped>

.css_holiday_custom{
  border: 1px solid #e7e8e8;
  padding: 5px 22px;
  margin-bottom: 9px;
}
.lb_holiday{
  margin: -19px 5px 5px -5px;
  padding: 5px 5px 5px 5px;
  font-weight: 500;
  font-size: 13px;
}
.lb_holiday_2{
  margin-top: 10px;
}
</style>
