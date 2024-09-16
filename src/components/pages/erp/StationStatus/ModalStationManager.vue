<template>
  <b-modal :id="id" static hide-footer @shown="getStationManager" body-class="mih-15re" header-class="px-3 py-2">
    <b-row slot="modal-header" class="w-100 mx-0 px-0">
      <b-col md="8" class="px-0 align-self-center">
        <h4 class="m-0">
          <i class="ion ion-ios-arrow-back cursor-pointer" @click="close"></i>
          <span>Quản lý kho <span v-if="station">{{ station.name || '' }}</span></span>
        </h4>
      </b-col>
      <b-col md="4" class="text-right px-0">
        <b-btn variant="ghtk" @click="chatGroup" v-if="managers && managers.length">Chat nhóm</b-btn>
      </b-col>
    </b-row>
    <div v-loading="loading" class="position-relative mih-15re">
    <b-row v-for="manager in managers" :key="manager.id" class="font-larger align-items-center mb-3">
      <b-col md="2" v-viewer>
        <img :src="manager.avatar" alt="avatar" height="50" width="50" class="rounded-circle">
      </b-col>
      <b-col md="8" class="px-0">
        <span class="text-ghtk">{{ manager.fullname }}</span> - <span class="text-ghtk">{{ manager.username }}</span>
        <br />
        <span>{{ manager.position }} - {{ manager.station || station.name }} - {{ manager.work_type }}</span>
      </b-col>
      <b-col md="2" class="text-right">
        <b-btn size="sm" variant="outline-ghtk" class="btn-pill font-initial" @click="chatUser(manager.user_id)"><i class="fas fa-comment"></i> Chat</b-btn>
      </b-col>
    </b-row>
    </div>
    <div v-if="(!managers || !managers.length) && !loading" class="mih-10re text-center align-middle">
      <b>Không tìm thấy quản lý cho kho này !</b>
    </div>
  </b-modal>
</template>

<script>
// service
import stationStatusService from 'domain/services/station-status-service'
// helper
import helper from 'infrastructures/helpers/common-helpers'
import IframeHelper from 'domain/entities/iframeHelper'

import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)

export default {
  name: 'modal-station-manager',

  props: {
    station: {
      default: null
    },
    id: {
      default: 'modal-station-manager'
    }
  },

  data: _ => ({
    managers: [],
    loading: false
  }),

  methods: {
    getStationManager () {
      this.managers = []
      if (!this.station || !this.station.id) {
        this.managers = []
        return
      }
      this.loading = true

      stationStatusService.getStationManager({station: this.station.id})
        .then(res => {
          if (res.data.success) this.managers = res.data.data || []
          else helper.showMessage(res.data.message || 'Có lỗi khi lấy quản lý kho !', 'warning', 'Lỗi')
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi khi lấy quản lý kho !', 'warning', 'Lỗi')
        })
        .finally(_ => {
          this.loading = false
        })
    },

    chatGroup () {
      if (!this.managers || !this.managers.length) return

      let members = []
      let srcChat = 'station_status_group_chat_' + this.station.id
      if (this.station.chat_channel_id && this.station.chat_src) {
        members = this.station.chat_src
        srcChat = this.station.chat_init_member
      } else {
        this.managers.forEach(ele => {
          members.push({id: +ele.user_id})
        })
      }

      IframeHelper.sendMessage({
        type: 'create_group_chat_by_members',
        payload: {
          members: members,
          src: srcChat,
          channel_name: 'Tình hình kho ' + this.station.name
        }
      }, null)
    },

    chatUser (userId = null) {
      if (!userId) return
      IframeHelper.sendMessage({
        type: 'create_direct_chat',
        payload: {
          user: {
            // id: 'user_' + userId
            id: +userId
          }
        }
      }, null)
    },

    close () {
      this.$bvModal.hide(this.id)
    }
  }
}
</script>
