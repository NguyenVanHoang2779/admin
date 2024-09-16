<template>
  <div v-loading="loading" class="position-relative">
    <template v-for="(censor, idx) in censorData.censors">
      <div :key="idx" class="d-flex justify-content-between align-self-center ml-1 mb-3" v-if="censor.handler_info">
        <div class="align-items-center d-flex">
          <img :src="censor.handler_info.avatar" alt="Avatar"
               class="p-0 censor-avatar mr-2">
          <div class="">
            <span class="pt-1">{{ censor.handler_info.fullname || '' }} - {{ censor.handler_info.username || '' }} -
              {{ censor.handler_info.position_name || '' }}</span>
            <i style="color: #069255" class="ml-1 fa fa-comment-dots cursor-pointer" @click="gotoGroupChat(censor)"
               aria-hidden="true"></i>
          </div>
        </div>
        <div class="">
          <b-btn class="btn-outline-danger btn btn-sm btn-delete"
            @click="deleteCensor(censor)">Xóa
          </b-btn>
        </div>
      </div>
    </template>
    <div class="d-flex justify-content-between border-0">
      <SelectUser
        :class="(smallView ? 'font-12' : 'font-13') + ' multiselect-ghtk multiselect-no-horizontal col-sm-10 pl-0'"
        placeholder="Nhập người xử lý"
        @select="updateNewCensor(...arguments, 'add')"
        @remove="updateNewCensor(...arguments, 'delete')"
        :reset="resetSelectUser"
      />
      <div class="col-sm-2 text-right p-0">
        <b-btn class="btn-ghtk btn btn-delete" @click="updateCensor('add')">Thêm</b-btn>
      </div>
    </div>

  </div>
</template>

<script>
// custom component
import SelectUser from 'components/elements/common/SingleSelectUser'

// service
import hrOrderService from 'domain/services/hr-order-service'
import staffWorkHandlerService from 'domain/services/staff-work-handler-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'censor-v3',

  props: {
    smallView: {
      default: false
    },
    censorData: {}
  },

  components: {
    SelectUser
  },

  data: _ => ({
    loading: false,
    curCensor: {},
    resetSelectUser: null
  }),

  methods: {
    gotoGroupChat (censor) {
      if (!censor || !censor.id) return
      this.loading = true
      if (censor.channel_id) {
        window.open('https://ghtk.me/channel/internal/' + censor.channel_id, '_blank')
      } else { // Tạo group chat nếu chưa có
        hrOrderService.createDirectChat({userId: censor.id})
          .then(res => {
            if (res.data.success) {
              let channelId = res.data.data.channel_id
              window.open('https://ghtk.me/channel/internal/' + channelId, '_blank')
            } else {
              helper.showMessage(res.data.message || 'Tạo direct chat thất bại !')
            }
          })
          .catch(e => {
            helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
            console.log(e)
          })
          .finally(_ => {
            this.loading = false
          })
      }
    },

    updateCensor (type, id = null) {
      if ((helper.isEmpty(type) || (type !== 'add' && type !== 'delete')) || helper.isEmpty(this.curCensor)) return helper.showMessage('Dữ liệu người xử lý không hợp lệ, Vui lòng chọn lại!')
      let censor = {
        action: this.censorData.action,
        master_profile_id: this.censorData.masterProfileId
      }
      if (type === 'add' && this.curCensor.id) censor.handler_id = this.curCensor.id
      if (type === 'delete' && id) censor.id = id
      this.loading = true
      staffWorkHandlerService.updateHandler({ handler: censor, type: type })
        .then(res => {
          if (!res.data.success) return helper.showMessage(res.data.message || 'Không cập nhật được người duyệt, vui lòng thử lại sau !', 'warning')
          helper.showMessage(res.data.message || (type === 'add' ? 'Thêm người duyệt thành công' : 'Xóa người duyệt thành công'), 'success')
          if (type === 'add' && res.data.data) {
            this.censorData.censors.push(res.data.data)
            this.$emit('action', {action: 'add_censor', data: {censor: res.data.data}})
          }
          if (type === 'delete') {
            this.censorData.censors = this.censorData.censors.filter(x => {
              return +x.id !== +id
            })
            this.$emit('action', {action: 'delete_censor', data: {id: id}})
          }
          this.curCensor = null
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Không cập nhật được người duyệt, vui lòng thử lại sau !', 'warning')
        })
        .finally(_ => {
          this.loading = false
          this.resetSelectUser = !this.resetSelectUser
        })
    },

    updateNewCensor (op, type) {
      if (!type || (type !== 'add' && type !== 'delete')) return
      if (type === 'add') this.curCensor = op
      if (type === 'delete') this.curCensor = null
    },

    deleteCensor (censor) {
      this.curCensor = censor
      this.updateCensor('delete', censor.id)
    }
  }
}
</script>

<style>
.censor-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
.btn-delete {
  font-weight: bold;
  border-radius: 6px;
}
</style>
