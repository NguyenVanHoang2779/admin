<template>
    <b-card class="col-md-12" style="margin-bottom: 10px" no-body>
      <b-row>
        <b-col md="9">
          <perfect-scrollbar @ps-scroll-down="scrollHandle" :id="`log-tab-${data.item.ticket_id}`" :options="{wheelSpeed: 0.2,  wheelPropagation: false }" style="height: 300px">
              <br>
              <div v-for="(log, i) in data.item.ticket_logs" :key="i">
  <!--                <ticket-comment v-if="log.type === 'comment'" v-bind:data="log"></ticket-comment>-->
  <!--                <ticket-log v-else v-bind:text="log.content"></ticket-log>-->
  <!--                <ticket-comment v-bind:data="log"></ticket-comment>-->
                  <ticket-comment-v2 v-bind:data="log" class="mt-3"></ticket-comment-v2>
                  <a v-for="image in log.images" class="mt-3 ml-3" href="javascript:void(0)">
                    <img v-img="{group: `${data.index}`}" :src="image.file_path" :alt="image.file_name" class="rounded" style="height: 200px;">
                  </a>
              </div>
          </perfect-scrollbar>
          <!-- Chat footer -->
          <hr class="border-light m-0">
          <div class="flex-grow-0 py-3 px-4">
              <b-input-group class="mb-3">
                  <template v-slot:prepend>
                      <multiselect :allow-empty="false" label="name" track-by="code" v-model="value" :options="typeComment" :searchable="false" :close-on-select="false" :show-labels="false"></multiselect>
                  </template>
                  <b-button v-b-toggle.add-image variant="primary" @click="$refs.filesInput.click()" slot="append"><span class="icon ion-md-camera"></span></b-button>
                  <b-input :id="`input-chat-${data.item.ticket_id}`" @keyup.enter="insertTicketComment" v-model="ticketComment" placeholder="Viết phản hồi..." />
                  <b-btn @click="insertTicketComment" variant="primary" slot="append">Gửi</b-btn>
              </b-input-group>
              <span style="position: relative;"><b-img v-if="url1 != null" :src="url1" rounded class="image-comment ml-3 mb-3"></b-img><span v-if="url1 != null" @click="removeImage(1)" class="icon ion-md-close-circle icon-comment-image"></span></span>
              <span style="position: relative;"><b-img v-if="url2 != null" :src="url2" rounded class="image-comment ml-3 mb-3"></b-img><span v-if="url2 != null" @click="removeImage(2)" class="icon ion-md-close-circle icon-comment-image"></span></span>
              <span style="position: relative;"><b-img v-if="url3 != null" :src="url3" rounded class="image-comment ml-3 mb-3"></b-img><span v-if="url3 != null" @click="removeImage(3)" class="icon ion-md-close-circle icon-comment-image"></span></span>
              <span style="position: relative;"><b-img v-if="url4 != null" :src="url4" rounded class="image-comment ml-3 mb-3"></b-img><span v-if="url4 != null" @click="removeImage(4)" class="icon ion-md-close-circle icon-comment-image"></span></span>
              <input style="display: none;" @change="fileChange($event)" multiple type="file" ref="filesInput"/>
          </div>
          <notifications group="notifications-default"/>
        </b-col>
        <b-col md="3" class="border-left border-light p-0">
          <b-list-group>
              <b-list-group-item class="bg-primary text-white rounded-0"><strong>Liên kết nhanh</strong></b-list-group-item>
              <b-list-group-item><router-link :to="'/profile/master/edit/' + data.item.ticket_creator_info.master_profile_id">Master profile</router-link></b-list-group-item>
              <!-- <b-list-group-item><router-link :to="'/profile/master/edit/' + data.item.ticket_creator_info.master_profile_id">Tình trạng BHXH</router-link></b-list-group-item> -->
              <b-list-group-item class="bg-primary text-white mt-3 d-flex justify-content-between align-items-center">
                <strong>Đề xuất liên quan</strong>
                <router-link v-if="data.item.ticket_type_id == TICKET_TYPE_BHXH" :to="'/hr-order/create/' + data.item.ticket_creator_info.master_profile_id +'?sos_id=' + data.item.ticket_id" target='_blank'><i class="ion ion-ios-add"></i></router-link>
              </b-list-group-item>
              <div v-for="(refer, i) in data.item.ticket_refs" :key="i">
                <b-list-group-item class="bg-light d-flex justify-content-between align-items-center">
                  <span>BH{{refer.id}}</span>
                  <router-link :to="'/hr-order/update/' + refer.id" target='_blank'><i class="ion ion-ios-create"></i></router-link>
                </b-list-group-item>
                <b-list-group-item style="padding-top: 0.5rem;"><strong>Loại đề xuất: </strong>{{refer.name}}</b-list-group-item>
                <b-list-group-item style="padding-top: 0.5rem;"><strong>Tình trạng:</strong> <div :class="'bg-' + (statusDesc[refer.status] && statusDesc[refer.status].variant)" class="d-inline border px-2">{{statusDesc[refer.status].desc}}</div></b-list-group-item>
              </div>
          </b-list-group>
        </b-col>
      </b-row>
    </b-card>
</template>
<script>
import sosService from 'domain/services/internal-sos-service'
import Multiselect from 'vue-multiselect'
import TicketLog from './TicketLog'
import TicketComment from './TicketComment'
import TicketCommentV2 from './TicketCommentV2'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import Order from 'domain/entities/Order'

import Vue from 'vue'
import VueImg from 'v-img'
Vue.use(VueImg, {
  altAsTitle: true
})

const optionTypeComment = [
  {code: 1, name: 'Công khai'},
  {code: 0, name: 'Nội bộ'}
]
export default {
  props: ['data', 'user'],
  name: 'ticket-log-tab',

  components: {
    sosService,
    TicketLog,
    TicketComment,
    PerfectScrollbar,
    Multiselect,
    TicketCommentV2
  },
  watch: {
  },
  data: () => ({
    TICKET_TYPE_BHXH: 22,
    value: optionTypeComment[0],
    typeComment: optionTypeComment,
    ticketComment: '',
    imageComments: [],
    url1: null,
    url2: null,
    url3: null,
    url4: null,
    statusDesc: Order.statusDesc
  }),
  computed: {
  },
  created () {
  },
  methods: {
    removeImage (number) {
      if (number === 1) {
        this.url1 = this.url2
        this.url2 = this.url3
        this.url3 = this.url4
        this.url4 = null
      }
      if (number === 2) {
        this.url2 = this.url3
        this.url3 = this.url4
        this.url4 = null
      }
      if (number === 3) {
        this.url3 = this.url4
        this.url4 = null
      }
      if (number === 4) {
        this.url4 = null
      }
      if (this.imageComments.length === 1) this.imageComments = []
      this.imageComments.splice(number - 1, 1)
    },
    fileChange (event) {
      let file = event.target.files
      for (let i = 0; i < file.length; i++) {
        if (this.imageComments.length === 4) return alert('Vượt quá số lượng ảnh cho phép...')
        if (file[i].size > 5019809) return alert('Ảnh vượt quá dung lượng cho phép...')
        if (file[i].type === 'image/png' || file[i].type === 'image/jpeg') {
          if (this.url1 == null) {
            this.url1 = URL.createObjectURL(file[i])
            if (this.imageComments.length < 4) this.imageComments.push(file[i])
          } else if (this.url2 == null) {
            this.url2 = URL.createObjectURL(file[i])
            if (this.imageComments.length < 4) this.imageComments.push(file[i])
          } else if (this.url3 == null) {
            this.url3 = URL.createObjectURL(file[i])
            if (this.imageComments.length < 4) this.imageComments.push(file[i])
          } else if (this.url4 == null) {
            this.url4 = URL.createObjectURL(file[i])
            if (this.imageComments.length < 4) this.imageComments.push(file[i])
          }
        } else {
          return alert('Vui lòng chọn file là một ảnh...')
        }
      }
    },
    scrollHandle (evt) {
    },
    insertTicketComment () {
      if (this.ticketComment === '') return alert('Vui lòng nhập nội dung comment...')
      let promise = new Promise((resolve, reject) => {
        let content = this.ticketComment
        this.ticketComment = ''
        let d = new Date()
        // let lastLogId = this.data.item.ticket_logs[this.data.item.ticket_logs.length - 1].id
        this.data.item.ticket_logs.push({
          content: content,
          created_text: `Hôm nay ${d.getHours()}:${d.getMinutes()}`,
          created_fullname: this.user.fullname,
          created_username: this.user.username,
          has_image: false,
          is_public: true,
          status_wait: 1,
          type: 'comment'
        })
        resolve()
        this.callApiInsertComment(this.user.user_id, this.data.item.ticket_id, content, 1, 0)
      })
      promise.then(
        () => {
          setTimeout(() => { this.scrollToEnd() }, 0.01)
        }
      )
    },
    callApiInsertComment (userId, ticketId, content, isPublic, hasImage) {
      let formData = new FormData()
      if (this.imageComments.length > 0) {
        for (var i = 0; i < this.imageComments.length; i++) {
          formData.append(`files[${i}]`, this.imageComments[i])
          hasImage = 1
        }
        this.imageComments = []
        this.url1 = this.url2 = this.url3 = this.url4 = null
      }
      formData.append('created_user_id', userId)
      formData.append('ticket_id', ticketId)
      formData.append('content', content)
      formData.append('type', 'comment')
      formData.append('is_public', isPublic)
      formData.append('has_image', hasImage)
      sosService.apiInsertLogTicket(formData).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.data.item.ticket_logs = response.data.data
            if (this.data.item.ticket_status_id === 1 && this.data.item.ticket_logs.length >= 1) {
              this.data.item.ticket_status_id = 2
            }
          } else {
            this.$notify({
              group: 'notifications-default',
              type: 'bg-danger text-white',
              title: 'Thông báo',
              text: 'Có lỗi xảy ra khi lưu log'
            })
          }
        }
      }).catch(() => {
      }).then(() => {
        this.scrollToEnd()
      })
    },
    scrollToEnd () {
      const container = this.$el.querySelector('.ps--active-y')
      if (typeof container !== 'undefined') container.scrollTop = container.scrollHeight
    }
  }
}
</script>

<style scoped lang="scss">
  .image-comment {
    // width: 206px;
    height: 211px;
    position: relative;
  }
  .icon-comment-image {
    position: absolute;
    top: -103px;
    right: 2%;
    cursor: pointer;
  }
  .fast-ref {

  }
</style>
