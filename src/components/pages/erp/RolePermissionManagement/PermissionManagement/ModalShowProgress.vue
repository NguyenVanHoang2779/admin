<template>
  <div>
    <b-modal
      class="modal-notice"
      id="id-modal-show-progress"
      hide-header
      hide-header-close
      hide-footer
      static
      :no-close-on-backdrop="true"
      @hide="onClose()"
    >
      <div>
        <div>
          <label>{{ progressTitle }} : {{ valueProgress + ' / ' +  maxProgress}} user</label>
          <b-progress :max="maxProgress" height="0.8rem" style="margin-top: 1rem; margin-bottom: 2rem">
            <b-progress-bar :value="valueProgress" :label="`${((valueProgress / Number(maxProgress)) * 100).toFixed(2)}%`"></b-progress-bar>
          </b-progress>
        </div>
      </div>
      <div class="btn-cus mt-4 mb-3">
        <button v-if="isShowButton" type="button" class="btn btn-success" :style="'background-color: green;'" @click="done()">Đóng</button>
      </div>
    </b-modal>
  </div>
</template>

<script>

import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
export default {
  name: 'Modal-Show-Progress',
  components: {
  },
  props: {
    maxProgress: null,
    cacheKey: '',
    typeUpdate: ''
  },

  data () {
    return {
      progressTitle: 'Tiến trình assign role đang chạy',
      valueProgress: 0,
      checkRunProgress: null,
      loading: false,
      isShowButton: false
    }
  },
  computed: {
  },
  watch: {
    cacheKey: function (val, oldVal) {
      if (this.cacheKey) {
        this.checkProgress()
      }
    },
    typeUpdate: function (val, oldVal) {
      if (this.typeUpdate) {
        this.progressTitle = (this.typeUpdate === 'assign') ? 'Tiến trình assign role đang chạy' : 'Tiến trình remove role đang chạy'
      }
    }
  },
  created () {
  },
  destroyed () {
    if (this.checkRunProgress) {
      clearInterval(this.checkRunProgress)
    }
  },
  methods: {
    onClose () {

    },

    done () {
      this.$bvModal.hide('id-modal-show-progress')
      if (+this.valueProgress === +this.maxProgress) {
        this.$emit('progressComplete')
      }
    },
    checkProgress () {
      this.checkRunProgress = setInterval(() => {
        if (this.valueProgress === this.maxProgress) {
          clearInterval(this.checkRunProgress)
        } else {
          this.checkCompleteJobAssignRole()
        }
      }, 2500)
    },

    checkCompleteJobAssignRole: async function () {
      if (this.loading) {
        return
      }
      this.loading = true
      try {
        const res = await PermissionManagement.checkCompleteJobAssignRole({cache_key: this.cacheKey})
        if (res.data.success) {
          if (res.data.data) {
            let data = res.data.data
            if (data.number_job_done) {
              this.valueProgress = Number(data.number_job_done)
            }
            if (+this.valueProgress === +this.maxProgress) {
              this.progressTitle = 'Đã xong'
              clearInterval(this.checkRunProgress)
              this.isShowButton = true
            }
          }
        } else {
          clearInterval(this.checkRunProgress)
          this.progressTitle = 'Đã xảy ra lỗi khi chạy tiến trình'
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra khi chạy tiến trình assign role', 'warning')
          this.isShowButton = true
        }
      } catch (e) {
        clearInterval(this.checkRunProgress)
        this.isShowButton = true
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi chạy tiến trình assign role', 'warning')
        }
      } finally {
        this.loading = false
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.modal-notice {
  /deep/ .modal-dialog {
    max-width: 32rem !important;
    margin-top: 10.5rem !important
  }
  /deep/ .modal-content {
    border-radius: 15px !important;
  }
}

.logo-cus, .status-cus, .message-cus {
  justify-content: center;
  font-family: 'Roboto';
}
.logo-cus {
  font-size: 6.5rem;
}
.status-cus {
  font-size: 2rem;
  font-weight: 600;
  margin-top: -0.7rem;
  margin-bottom: 0.5rem;
}

.message-cus {
  font-size: 1.5rem;
  font-weight: 100;
}

.message-data-cus{
  color: chocolate;
  font-size: 15px;
  text-align: center;
}
.btn-cus {
  display: flex;
  justify-content: center;
  button {
    display: block;
    width: 8.5rem;
    font-weight: 500;
    border-radius: 0.8rem;
  }
}

</style>
