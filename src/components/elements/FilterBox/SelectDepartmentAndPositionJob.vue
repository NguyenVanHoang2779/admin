<template>
    <div class="department-position row">
        <b-form-group label="Bộ phận làm việc" class="col-sm-6 ">
            <multiselect
                v-model="selectedDepartment"
                :options="departments"
                :multiple="false"
                :placeholder="departmentPlaceholder"
                track-by="name"
                selectLabel=""
                selectedLabel=""
                deselectLabel="x"
                label="name" @select="onSelectDepartment" @remove="onRemoveDepartment"
              >
                <template slot="placeholder">
                  <span class="placeholder">{{departmentPlaceholder}}</span>
                </template>
              </multiselect>
        </b-form-group>
        <b-form-group label="Vị trí làm việc" class="col-sm-6">
            <multiselect
                v-model="selectedPositionJob"
                :options="position_job"
                :multiple="false"
                :placeholder="positionPlaceholder"
                track-by="name"
                selectLabel=""
                selectedLabel=""
                deselectLabel="x"
                label="name" @select="onSelectPosition" @remove="onRemovePositionJob"
              >
                <template slot="placeholder">
                  <span class="placeholder">{{positionPlaceholder}}</span>
                </template>
              </multiselect>
        </b-form-group>
    </div>
</template>

<script>
import config from 'config/app.base'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
export default {
  name: 'select-department-and-position-job',

  props: {
    departmentPlaceholder: {
      type: String,
      default: 'Chọn bộ phận'
    },
    positionPlaceholder: {
      type: String,
      default: 'Chọn vị trí'
    }
  },

  components: {
    Multiselect
  },
  data: () => ({
    departments: [],
    position_job: [],
    selectedDepartment: [],
    selectedPositionJob: []
  }),
  methods: {
    getOptions: function () {
      // Header check login
      axios.get(config.baseApiUrl + 'AdSearchStaff/getOptionForSearchBox').then(response => {
        if (response.data.success) {
          this.departments = response.data.data.options.departments
          this.departments.unshift({
            code: '',
            name: this.departmentPlaceholder
          })
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    onSelectDepartment: function (selectedOption, id) {
      let dataSend = {
        'department_name': selectedOption.name
      }
      // Update position job
      this.position_job = []
      this.selectedPositionJob = []
      axios.get(config.baseApiUrl + 'AdUsers/apiGetPositionForSearch', {'params': dataSend}).then(response => {
        if (response.data.length > 0) {
          this.position_job = response.data
          this.position_job.unshift({
            code: '',
            name: this.positionPlaceholder
          })
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.app_mode = 'running'
      })
      this.$emit('getDepartment', selectedOption.code)
      this.$emit('getPositionJobName', '')
    },
    onRemoveDepartment: function () {
      this.position_job = []
      this.$emit('getDepartment', '')
    },
    onSelectPosition: function (selectedOption, id) {
      this.$emit('getPositionJobName', selectedOption.code)
    },
    onRemovePositionJob: function () {
      this.selectedPositionJob = []
      this.$emit('getPositionJobName', '')
    },
    reset: function () {
      this.selectedPositionJob = []
      this.selectedDepartment = []
    }
  },
  created () {
    this.getOptions() // Get option filters
  }
}
</script>

<style scoped>

</style>
