<template>
  <!-- Modal thay đổi người quản lý -->
  <b-modal
    class="modal-cus"
    v-model="openModal"
    :title="'Sửa người quản lý'"
    modal-class="modal-custom"
    :header-class="'text-center justify-content-center d-flex'"
    centered
    static
    id="modal-change-acc"
    hide-footer
    @hide="onClose()"
  >
    <div class="modal-title">
      <div class="title-cus">
        <p class="title-cus-p1">Vui lòng chọn 01 hoặc nhiều Người quản lý cho nhân viên {{typeof(user) == null ? user.username : ''}}</p>
      </div>
    </div>
    <div class="modal-change-acc" v-loading="loading">
      <div>
        <MultiSelectUser
          style="margin-top: 0rem !important;"
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal mt-0'"
          :custom-multiselect-class="'z-3'"
          :auto-close="true"
          :multiple="true"
          :placeholder="'Nhập username người quản lý'"
          :users="listLeader"
          :stationId="typeof(user) == null ? user.station_id : ''"
          @onChange="leaderIds = $event"
        >
        </MultiSelectUser>
      </div>
    </div>
    <div class="text-center mb-2">
      <b-btn variant="ghtk" id='btn-save-change' name='btn-save-change' class="button-deny-modal" @click="onSaveChangeOwner()">Xác nhận</b-btn>
    </div>
  </b-modal>
</template>
<style lang="scss" scoped>
::placeholder {
  color: #828282;
}
.button-close-modal-contact {
  border-radius: 5px;
  padding: 5px 30px;
}
.button-deny-modal {
  width: 100px;
  border-radius: 5px;
  padding: 5px 0px;
  margin-bottom: 0.5rem;
}

/deep/ .modal-header {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.modal-change-acc {
  padding: 20px;
  font-size: 16px;
  color: #000;
}

.modal-change-acc {
  margin-top: -1rem;
}

.title-cus {
  font-size: 16px;
  text-align: center;
  font-weight: 400;
  .title-cus-p1{
    margin-top: 1rem;
  }
  .title-cus-p2 {
    margin-top: -1rem;
  }
  .title-cus-p3 {
    margin-top: -1rem;
  }
}

</style>
<style lang="css" scoped>
.modal-cus >>> .modal-content {
  /*width: 82% !important;*/
}
</style>

<script>

// helper
import commonHelper from 'infrastructures/helpers/common-helpers'
// service
import staffService from 'domain/services/staff-management-service'

import MultiSelectUser from 'components/elements/common/MultiSelectUser'
import Multiselect from 'vue-multiselect'

export default {
  name: 'ModalChangeLeader',
  components: {
    Multiselect,
    MultiSelectUser
  },

  props: {
    title: {
      type: String,
      default: 'Sửa người quản lý'
    },
    open: {
      default: false
    },
    options: {
      default: {}
    },
    authUser: {
      default: {}
    },
    user: {
      default: {}
    },
    listLeader: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      loading: false,
      openModal: false,
      leaderIds: []
    }
  },

  watch: {
    open (v) {
      this.openModal = v
    }
  },

  methods: {
    onClose () {
      this.user = null
      this.listLeader = []
      this.leaderIds = []
      this.$emit('onCloseModal', 'changeLeader')
    },

    async onSaveChangeOwner () {
      let reqData = {
        staff_id: this.user.id,
        leader_ids: this.leaderIds.map(item => item.hasOwnProperty('id') ? item.id : item.id_leader),
        view_mode: this.options.viewMode
      }
      if (reqData.leader_ids === null || reqData.leader_ids.length === 0) {
        return commonHelper.showMessage('Vui lòng chọn người quản lý', 'warning')
      }
      try {
        this.loading = true
        const res = await staffService.apiChangeOwnerUser(reqData)
        const {success, message, data} = res.data
        if (success) {
          const canAccessStaffData = await staffService.canAccessStaffData({staff_id: this.user.id})
          if (canAccessStaffData.data.success) {
            if (this.options.callback) {
              let newLeaderList = data.leaders
              if (!Array.isArray(newLeaderList)) {
                newLeaderList = Object.values(newLeaderList)
              }
              this.options.callback({listLeader: [...newLeaderList], log: data.log})
            }
          } else {
            this.$emit('reduceStaffList', this.user.id)
          }

          commonHelper.showMessage('Chỉnh sửa người quản lý thành công', 'success')
          this.$emit('changeSuccess', true)
          this.onClose()
        } else {
          commonHelper.showMessage(message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e)
      } finally {
        this.loading = false
      }
    }

  }
}
</script>

<style scoped>

</style>
