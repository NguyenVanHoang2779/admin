<template>
  <div>
    <multiselect
      :class="{'custom-multiselect': !checkViewAll, 'custom-multiselect-user': true}"
      v-model="asyncSelected"
      label="name"
      track-by="id"
      @remove="removeUser"
      @select="selectUser"
      placeholder=""
      :options="asyncFound"
      :multiple="true"
      :searchable="true"
      :loading="asyncLoading"
      :internal-search="false"
      :clear-on-select="true"
      :close-on-select="true"
      :hide-selected="true"
      @search-change="asyncFind">
      <span slot="noResult">{{message}}</span>
      <span slot="noOptions">{{message}}</span>
    </multiselect>
    <notifications group="notifications-default"/>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import ticketTypeServices from 'domain/services/ticket-type-services'
import sosService from 'domain/services/internal-sos-service'
import debounce from 'debounce'

export default {
  props: ['idTkT'],
  name: 'multi-select-user',
  components: {
    Multiselect,
    sosService,
    debounce
  },
  watch: {
  },
  data: () => ({
    checkViewAll: false,
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    message: 'Nhập ít nhất 2 ký tự',
    formDataSend: {
      ticket_type_id: '',
      rule: '',
      type: 'user'
    },
    formGetData: {
      id: ''
    }
  }),
  computed: {
  },
  created () {
    this.formGetData.id = this.idTkT
    ticketTypeServices.getListUserHandleTicketType(this.formGetData).then(response => {
      if (response.data.success === true) {
        this.asyncSelected = response.data.data
      } else {
        // something
      }
    }).catch((error) => {
      console.log(error)
    })
  },
  methods: {
    removeUser (selectedOption) {
      this.formDataSend.ticket_type_id = this.idTkT
      this.formDataSend.rule = selectedOption.id
      ticketTypeServices.deleteHandleTicketType(this.formDataSend).then(response => {
        if (response.data.success === true) {
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: response.data.message
          })
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    selectUser (selectedOption) {
      this.formDataSend.ticket_type_id = this.idTkT
      this.formDataSend.rule = selectedOption.id
      ticketTypeServices.addHandleTicketType(this.formDataSend).then(response => {
        if (response.data.success === true) {
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: response.data.message
          })
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
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
    }, 500)
  }
}
</script>

<style scoped lang="scss">
</style>
