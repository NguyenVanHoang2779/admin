<template>
  <div>
    <div>
      <multiselect v-model="value"
                   placeholder="Nhập để tìm kiếm" label="name"
                   track-by="code" :options="groupTicketType" :multiple="true"
                   :taggable="true"  @select="selectGroup" @remove="removeGroup">
      </multiselect>
    </div>
    <notifications group="notifications-default"/>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import ticketTypeServices from 'domain/services/ticket-type-services'

export default {
  props: ['idTkT', 'type', 'groupTicketType'],
  name: 'multi-select-group',
  components: {
    Multiselect,
    ticketTypeServices
  },
  data: () => ({
    value: [],
    options: [],
    formGetData: {
      id: ''
    },
    formDataSend: {
      ticket_type_id: '',
      rule: '',
      type: 'group'
    }
  }),

  created () {
    this.formGetData.id = this.idTkT
    this.formGetData.type = this.type
    // ticketTypeServices.getListGroupTicketType().then(response => {
    //   if (response.data.success === true) {
    //     this.options = response.data.data
    //   } else {
    //     // something
    //   }
    // }).catch((error) => {
    //   console.log(error)
    // })
    ticketTypeServices.getListGroupHandleTicketType(this.formGetData).then(response => {
      if (response.data.success === true) {
        this.value = response.data.data.map((item) => {
          return {
            code: item.rule,
            name: item.rule_name
          }
        })
      } else {
        // something
      }
    }).catch((error) => {
      console.log(error)
    })
  },
  computed: {
    // groupTicketTypes: function () {
    //   return this.groupTicketType.map((item) => {
    //     return {
    //       code: item.rule,
    //       name: item.rule_name
    //     }
    //   })
    // }
  },
  methods: {
    removeGroup (selectedOption) {
      console.log(selectedOption)
      this.formDataSend.ticket_type_id = this.idTkT
      this.formDataSend.rule = selectedOption.code
      this.formDataSend.type = this.type
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
    selectGroup (selectedOption) {
      this.formDataSend.ticket_type_id = this.idTkT
      this.formDataSend.rule = selectedOption.code
      this.formDataSend.type = this.type
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
    }
  }
}
</script>

<style scoped lang="scss">
</style>
