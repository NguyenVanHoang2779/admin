<template>
  <div>
    <b-table striped hover :items="userData"></b-table>
  </div>
</template>

<script>
import salaryService from 'domain/services/salary-service'

export default {
  name: 'ecom-table-job-log-report',

  props: ['users'],

  components: {
    salaryService
  },

  data: function () {
    return {
      userData: this.users,
      breakInterVal: ''
    }
  },
  mounted () {
    this.checkJobLogStatus(this.userData)
  },
  methods: {
    // function check job log status
    checkJobLogStatus: function (data) {
      var needContinue = false
      var arr = []
      this.breakInterVal = setInterval(function () {
        data.forEach(function (ele) {
          let dataSend = {
            userId: ele.id,
            time: ele.time
          }
          salaryService.getJobLogStatus(dataSend).then(response => {
            if (response.data.success) {
              ele.job_status = response.data.data.status
              arr.push(response.data.data.status)
            }
          }).catch(error => {
            if (error) {
            }
          })
        })
        if (arr.indexOf('Running') !== -1) {
          needContinue = true
        }
        if (needContinue === false) {
          clearInterval(this.breakInterVal)
        }
      }.bind(this), 3000)
    }

  }
}
</script>
