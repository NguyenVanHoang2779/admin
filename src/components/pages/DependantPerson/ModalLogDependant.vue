<template>
  <b-modal hide-footer :id="id" title="Lịch sử" static centered size="lg" @show="getLog()">
    <div class="mh-75 overflow-auto">
      <div v-for="(de, idx) in logs" :key="idx" class="mb-1">
        <div class="mb-2">Người phụ thuộc : <b>{{ de.fullname }}</b></div>
        <table class="table table-hover table-bordered table-striped table-sm">
          <tbody class="position-relative" v-loading="loading">
            <tr v-for="log in de.logs" :key="log.id">
              <td width="50%"><b>{{ log.fullname }}</b> ({{ log.created }})</td>
              <td>{{ log.content }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </b-modal>
</template>

<script>
// service
import dependantService from 'domain/services/dependant-person-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-log-dependant',

  props: {
    profile: {
      default: null
    },

    id: {
      default: 'modal-log-dependant'
    }
  },

  data: _ => ({
    logs: [],
    loading: false
  }),

  methods: {
    getLog (profile) {
      if (!profile) profile = this.profile
      if (!profile) {
        helper.showMessage('Không có ID Profile người lao động cần lấy log NPT !', 'warning')
        return
      }
      this.loading = true
      dependantService.getHistoryDependant({masterProfileId: profile})
        .then(res => {
          if (res.data.success) {
            this.logs = res.data.data
          } else helper.showMessage(res.data.message || 'Không lấy được log', 'warning')
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Đã có lỗi xảy ra !', 'warning')
        })
        .then(_ => {
          this.loading = false
        })
    }
  }
}
</script>
