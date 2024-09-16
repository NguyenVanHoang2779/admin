<template>
    <b-modal hide-footer id="modal-change-ticket">
            <div slot="modal-title">
                Thay đổi mục SOS
            </div>
            <div v-if="this.data.length !== 0">
                <b-form-row>
                    <b><i style="font-size: 130%" class="ion ion-md-share-alt"></i><b>&nbsp;{{data.ticket_id}}/{{data.ticket_type_name}}</b></b>
                </b-form-row>
                <b-form-row>
                    <i style="font-size: 130%" class="ion ion-ios-contact"></i>
                    <span>&nbsp;
                    {{data.ticket_creator_info.username}}/
                    {{data.ticket_creator_info.fullname}}/
                    {{data.ticket_creator_info.tel}}/
                    {{data.ticket_creator_info.province_name}}/
                    {{data.ticket_creator_info.station_name}}/
                    {{data.ticket_creator_info.position_name}}
                </span>
                </b-form-row>
                <b-form-row>
                    <div class="content-ticket">
                        <text-read-more v-bind:text="data.ticket_desc" v-bind:words="80"></text-read-more>
                    </div>
                </b-form-row>
                <b-form-row>
                    <b-form-group class="col mb-0">
                        <label>Chọn mục SOS mới</label>
                        <multiselect
                                :allow-empty="false"
                                class="multiselect-success"
                                placeholder=""
                                v-model="multipleValue1"
                                :options="multipleOptions1"
                                @input="changeParentType"
                                :multiple="false"
                                selectedLabel = 'x'
                                selectLabel = ''
                                :loading = 'loadingOption1'
                                deselectLabel = ''
                                label="name"
                                :showPointer = true
                                track-by="id">
                            <span slot="noResult">Không tìm thấy kết quả</span>
                            <span slot="noOptions">Có lỗi xảy ra khi lấy danh sách loại ticket level 1</span>
                        </multiselect>
                    </b-form-group>
                    <b-form-group class="col mb-0">
                        <label>&nbsp;</label>
                        <multiselect
                                :allow-empty="false"
                                class="multiselect-success"
                                placeholder=""
                                v-model="multipleValue2"
                                :options="multipleOptions2"
                                @input="changeChildType"
                                :multiple="false"
                                selectedLabel = 'x'
                                selectLabel = ''
                                :loading = 'loadingOption2'
                                deselectLabel = ''
                                label="name"
                                :showPointer = true
                                track-by="id">
                            <span slot="noResult">Không tìm thấy kết quả</span>
                            <span slot="noOptions">Vui lòng chọn lý do cấp 1</span>
                        </multiselect>
                    </b-form-group>
                </b-form-row>
                <b-form-row>
                    <div class="col-md-12">
                        <b-check v-model="checkViewAll" class="no-select"><i>Xem tất cả người xử lý</i></b-check>
                        <multiselect
                                :class="{'custom-multiselect': !checkViewAll, 'custom-multiselect-user': true}"
                                v-model="asyncSelected"
                                label="name"
                                track-by="id"
                                placeholder=""
                                :options="asyncFound"
                                :multiple="true"
                                :searchable="true"
                                :loading="asyncLoading"
                                :internal-search="false"
                                :clear-on-select="false"
                                :close-on-select="false"
                                :hide-selected="true"
                                @search-change="asyncFind">
                            <span slot="noResult">{{message}}</span>
                            <span slot="noOptions">{{message}}</span>
                        </multiselect>
                    </div>
                </b-form-row>
                <b-form-row>
                    <div class="col-md-12">
                        <b-check v-model="checkViewAll" class="no-select"><i>Xem tất cả người theo dõi</i></b-check>
                        <multiselect
                                :class="{'custom-multiselect': !checkViewAll, 'custom-multiselect-user': true}"
                                v-model="asyncWatchSelected"
                                label="name"
                                track-by="id"
                                placeholder=""
                                :options="asyncWatchFound"
                                :multiple="true"
                                :searchable="true"
                                :loading="asyncWatchLoading"
                                :internal-search="false"
                                :clear-on-select="false"
                                :close-on-select="false"
                                :hide-selected="true"
                                @search-change="asyncWatchFind">
                            <span slot="noResult">{{message}}</span>
                            <span slot="noOptions">{{message}}</span>
                        </multiselect>
                    </div>
                </b-form-row>
            </div>
        <div class="float-right">
            <b-btn @click="$bvModal.hide('modal-change-ticket')" variant="secondary">Hủy</b-btn>
            <b-btn @click="submitChangeTypeTicket" variant="primary">Xác nhận</b-btn>
        </div>
        </b-modal>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>
import Multiselect from 'vue-multiselect'
import TicketButton from './TicketButton'
import TextReadMore from './TextReadMore'
import debounce from 'debounce'
import sosService from 'domain/services/internal-sos-service'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
export default {
  name: 'modal-change-type-ticket',

  components: {
    Multiselect,
    TicketButton,
    TextReadMore,
    sosService,
    SweetModal,
    SweetModalTab
  },
  watch: {
  },
  data: () => ({
    multipleOptions1: [],
    multipleValue1: null,
    multipleOptions2: [],
    multipleValue2: null,
    loadingOption1: false,
    loadingOption2: false,
    optionParentToChild: [],
    data: [],
    checkViewAll: true,
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    asyncWatchSelected: [],
    asyncWatchFound: [],
    asyncWatchLoading: false,
    message: 'Nhập ít nhất 2 ký tự'
  }),
  computed: {
  },
  created () {
    this.getListTypeTicket()
    this.getRelationParentToChild()
    this.$root.$on('clickChangeTypeTicket', (row) => {
      this.data = row
      this.asyncSelected = row.list_users
      this.asyncWatchSelected = row.list_watch_users
      this.multipleValue2 = {id: row.ticket_type_id, name: row.ticket_type_name}
      this.multipleOptions2 = this.optionParentToChild[row.parent_ticket_type_id]
      this.multipleValue1 = {id: row.parent_ticket_type_id, name: row.parent_ticket_type_name}
      this.$bvModal.show('modal-change-ticket')
    })
  },
  methods: {
    // Todo: Lấy danh sách ticket level 1
    getListTypeTicket () {
      sosService.apiGetAllReasonTicket().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.multipleOptions1 = response.data.data
          }
        }
      }).catch(() => {
      }).then(() => {
      })
    },

    // Todo: Lấy danh sách quan hệ giữa lý do level 1 và level 2
    getRelationParentToChild () {
      sosService.apiGetRelationParentToChild().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.optionParentToChild = response.data.data.parent_to_child
          }
        }
      }).catch(() => {
      }).then(() => {
      })
    },

    // Todo: Bắt sự kiện thay đổi type level 1 để đổi type level 2
    changeParentType () {
      if (typeof this.multipleValue1 === 'undefined') {
        this.multipleOptions2 = []
        this.multipleValue2 = null
      } else {
        this.multipleOptions2 = this.optionParentToChild[this.multipleValue1.id]
        this.multipleValue2 = this.multipleOptions2[0]
        this.changeChildType()
      }
    },

    // Todo: Bắt sự kiện thay đổi type level 2 để gán thêm người xử lý mới
    changeChildType () {
      if (typeof this.multipleValue2.id === 'undefined') return
      if (this.data.ticket_type_id === this.multipleValue2.id) {
        this.asyncSelected = this.data.list_users
        this.asyncWatchSelected = this.data.list_watch_users
        return
      }
      sosService.apiGetListUsersHandleTicket({
        user_id: this.data.ticket_creator_info.user_id,
        ticket_id: this.data.ticket_id,
        new_type_id: this.multipleValue2.id
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success && response.data.data) {
            // let temp = this.data.list_users.concat(response.data.data)
            // let result = []
            // let map = new Map()
            // for (const item of temp) {
            //   if (!map.has(item.id)) {
            //     map.set(item.id, true)
            //     result.push(item)
            //   }
            // }
            this.asyncSelected = response.data.data.group
            this.asyncWatchSelected = response.data.data.group_watch
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    },

    // Todo: Tìm kiếm người xử lý
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      sosService.apiGetListUsers({term: query}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.asyncFound = response.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    }, 500),

    // Todo: Tìm kiếm người xử lý
    asyncWatchFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncWatchFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncWatchLoading = true
      this.asyncWatchFound = []
      sosService.apiGetListUsers({term: query}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.asyncWatchFound = response.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncWatchLoading = false
      })
    }, 500),

    // Todo: Xác nhận thay đổi loại ticket
    submitChangeTypeTicket () {
      let dataSend = {
        new_type_id: parseInt(this.multipleValue2.id),
        new_type_name: this.multipleValue2.name,
        old_type_id: parseInt(this.data.ticket_type_id),
        old_type_name: this.data.ticket_type_name,
        list_users: this.asyncSelected.map(({ id }) => id),
        list_watch_users: this.asyncWatchSelected.map(({ id }) => id),
        ticket_id: this.data.ticket_id
      }
      console.log(dataSend)
      if (dataSend.new_type_id === dataSend.old_type_id) {
        this.$root.$notify({
          group: 'notifications-default',
          type: 'bg-danger',
          title: 'Thông báo',
          text: 'Bạn chưa thay đổi loại ticket'
        })
        return
      }
      sosService.apiChangeTypeTicket(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.$emit('changeType', dataSend)
            this.$bvModal.hide('modal-change-ticket')
          }
          this.$root.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
        }
      }).catch(() => {
        this.$root.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
      })
    }
  }
}
</script>

<style scoped lang="scss">
    .content-ticket {
        margin: 1%;
        padding: 1% 1% 0 2%;
        border-left: 4px solid green;
        background-color: #e8f1ff;
        width: 100%;
    }
    .form-row {
        margin-bottom: 1%;
    }
</style>
