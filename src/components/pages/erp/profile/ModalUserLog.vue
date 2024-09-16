<template>
    <b-modal scrollable id="modal-user-logs" size="lg" ref="modal-log" @hidden="$emit('close', false)"
    title="Lịch sử thay đổi tài khoản" static>
      <template slot="modal-title">
          <div>
            <span>Lịch sử thay đổi tài khoản</span>
          </div>
      </template>
    <div>
      <section>
        <div class="scrollable">
          <table role="table" class="table b-table table-striped table-hover">
            <thead class="font-weight-bold">
            <tr>
              <th>Loại thay đổi</th>
              <th>Giá trị trước khi thay đổi</th>
              <th>Giá trị sau khi thay đổi</th>
              <th>Thời gian</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(log) in logs">
              <td>{{ log.column_desc }}</td>
              <td>{{ log.old_value_detail }}</td>
              <td>{{ log.new_value_detail }}</td>
              <td class="text-center">
                <router-link class="mt-2" :to="{name: 'edit-user', params: { id: log.created_by }}">{{ log.created_by_username }}</router-link> <br/>
                {{ formatDate(log.created) }}
              </td>
            </tr>
            </tbody>
          </table>
          <div v-if="!loading && logs.length <= 0">
            Không có lịch sử thay đổi tài khoản
          </div>
          <infinite-loading :identifier="infiniteId" spinner="spiral" @infinite="getLogs">
            <div slot="no-more">Đã đến cuối trang</div>
            <div slot="no-results"></div>
          </infinite-loading>
        </div>
      </section>
    </div>
    <div slot="modal-footer">
        <b-button
        variant="primary"
        @click="hideModal()"
        >
        Đóng
        </b-button>
    </div>
    </b-modal>
</template>

<style src="@/vendor/libs/spinkit/spinkit.scss" lang="scss"></style>
<style lang="scss" scoped>
    .scrollable {
      max-height: 600px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .strip>div:nth-child(odd){
      background: #f8f8f8;
    }
    .sub-modal-title {
      font-size: 14px;
      font-weight: normal;
      cursor: pointer;
      color: #0000EE;
    }
</style>

<script>
import userService from 'domain/services/user-service'
import moment from 'moment'
import helper from 'infrastructures/helpers/common-helpers'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'modal-user-log',

  components: {
    InfiniteLoading
  },

  props: {
    userId: {
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    loading: true,
    logs: [],
    currentPage: 1,
    infiniteId: +new Date()
  }),

  watch: {
    show: function (newVal, oldVal) {
      if (newVal) {
        this.resetInfiniteLoading()
        this.$refs['modal-log'].show()
      }
    }
  },

  methods: {
    resetInfiniteLoading () {
      this.logs = []
      this.currentPage = 1
      this.infiniteId = this.infiniteId + 1
    },

    hideModal () {
      this.$refs['modal-log'].hide()
    },

    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },

    getLogs ($state) {
      this.loading = true
      let sendData = {
        user_id: this.userId,
        page: this.currentPage
      }
      userService.getUserChangeLog(sendData)
        .then(response => {
          if (response.data.success) {
            this.currentPage = this.currentPage + 1
            this.logs = [...this.logs, ...response.data.data]
            if (!helper.isEmpty(response.data.data)) {
              $state.loaded()
            } else {
              $state.complete()
            }
          }
        }).catch(e => {
          $state.complete()
        }).then(() => {
          this.loading = false
        })
    }
  }
}
</script>
