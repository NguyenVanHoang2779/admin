<template>
    <b-modal hide-footer id="modal-list-ticket-ignore" @show="getTickets" scrollable>
        <div slot="modal-title">
            Danh sách ticket bạn đã bỏ qua
        </div>
        <div class="d-block" v-if="this.tableTicket.articlesData.length !== 0">
            <b-table
                    :busy="tableTicket.isBusy"
                    :items="tableTicket.articlesData"
                    :fields="tableTicket.fields"
                    :sort-by.sync="tableTicket.sortBy"
                    :sort-desc.sync="tableTicket.sortDesc"
                    :striped="false"
                    :borderless="true"
                    :bordered="false"
                    :fixed="false"
                    tbody-tr-class="rowClass"
                    :current-page="tableTicket.currentPage"
                    :per-page="tableTicket.perPage"
                    class="ticket-table">
                <template v-slot:cell(content)="data">
                    <div class="row">
                        <div class="col">
                            <h5><i style="font-size: 130%" class="ion ion-md-share-alt"></i><b>&nbsp;{{data.item.ticket_id}}/{{data.item.ticket_type_name}}</b>
                            </h5>
                        </div>
                    </div>
                    <div class="row">
                        <!--Nội dung ticket -->
                        <div class="col-md-2">
                            <ticket-image v-bind:data="data"></ticket-image>
                        </div>
                        <div class="col-md-10 content-ticket">
                            <text-read-more v-bind:text="data.item.ticket_desc" v-bind:words="80"></text-read-more>
                        </div>
                    </div>
                </template>
                <template v-slot:cell(info)="data">
                    <div class="row">
                        <div class="col-md-8">
                            <i style="font-size: 130%" class="ion ion-ios-contact"></i>
                            <span>
                            {{data.item.ticket_creator_info.username}}/
                            {{data.item.ticket_creator_info.fullname}}/
                            {{data.item.ticket_creator_info.tel}}/
                            {{data.item.ticket_creator_info.province_name}}/
                            {{data.item.ticket_creator_info.station_name}}/
                            {{data.item.ticket_creator_info.position_name}}
                        </span>
                        </div>
                        <div class="col-md-4">
                            <i style="font-size: 130%" class="ion ion-md-time"></i>
                            <span>
                            {{data.item.ticket_created_text}}
                        </span>
                        </div>
                    </div>
                    <hr class="m-1">
                    <div>
                        <multi-select-user v-bind:data="data" v-bind:isDisabled="true"></multi-select-user>
                    </div>
                </template>
                <template v-slot:cell(status)="data">
                </template>

                <template v-slot:cell(created)="data">
                    <p>{{data.item.ticket_created_text}}</p>
                </template>
                <template v-slot:cell(actions)="data">
                    <ticket-button v-bind:classBT="`ticket-button-danger`" @click.native="restoreTicket(data.item.ticket_id)" v-bind:labelBT="`Xử lý lại`"></ticket-button>
                </template>

            </b-table>
        </div>
        <div v-else>Danh sách rỗng</div>
    </b-modal>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>
import sosService from 'domain/services/internal-sos-service'
import MultiSelectUser from './MultiselectUser'
import TicketAction from './TicketAction'
import TicketButton from './TicketButton'
import TicketImage from './TicketImage'
import TextReadMore from './TextReadMore'

export default {
  props: [],
  name: 'modal-list-ticket-ignore',

  components: {
    MultiSelectUser,
    TicketAction,
    TicketImage,
    TextReadMore,
    TicketButton
  },
  watch: {},
  data: () => ({
    tableTicket: {
      searchKeys: ['id', 'title'],
      sortBy: 'id',
      sortDesc: false,
      perPage: 20,
      fields: [
        {key: 'content', label: 'Nội dung', sortable: false, thStyle: 'width: 55%'},
        {key: 'info', label: 'Thông tin', sortable: false, thStyle: 'width: 35%'},
        {key: 'actions', label: 'Hành động', sortable: false, thStyle: 'width: 10%'}
        // { key: 'created', label: 'Thời gian', sortable: false, thStyle: 'width: 10%' },
        // { key: 'actions', label: ' ', thStyle: 'width: 5%' }
      ],
      articlesData: [],
      originalArticlesData: [],
      currentPage: 1,
      searchText: '',
      isBusy: false
    }
  }),
  computed: {},
  created () {
  },
  methods: {
    // Todo: Lấy danh sách ticket
    getTickets () {
      this.loading = true
      let dataSend = {
        ignore: 0
      }
      sosService.apiGetTickets(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let data = response.data.data
            this.tableTicket.articlesData = data
            this.tableTicket.originalArticlesData = data.slice(0)
          } else {
            this.tableTicket.articlesData = []
            this.tableTicket.originalArticlesData = []
          }
        }
      }).catch(() => {
      }).then(() => {
        this.loading = false
      })
    },

    // Todo: Thay đổi trạng thái ticket user
    restoreTicket (idTicket) {
      sosService.apiChangeStatusTicketUser({
        ticket_id: idTicket,
        status: 1
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.getTickets()
            this.$emit('getTickets')
          }
        }
      }).catch(() => {
      }).then(() => {
      })
    }
  }
}
</script>

<style lang="scss">
</style>
