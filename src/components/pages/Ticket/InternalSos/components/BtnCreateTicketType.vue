<template>
  <div id="parent">
    <b-form @submit="onSubmit"  v-if="show" id="btnCreate" >
      <b-form-group
        id="input-group-1"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.name"
          type="text"
          required
          placeholder="Tên của kiểu ticket"
        ></b-form-input>
      </b-form-group>
      <b-button  variant="primary" @click="create()"> Thêm</b-button>
    </b-form>
  </div>
</template>

<script>
import ticketTypeServices from 'domain/services/ticket-type-services'
export default {
  data () {
    return {
      form: {
        name: ''
      },
      show: true,
      tableData: []
    }
  },
  props: ['showModel'],
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
    },
    create () {
      ticketTypeServices.createTicketType(this.form).then((response) => {
        ticketTypeServices.getAllTicketTypes()
          .then(response => {
            let arrListTicketTypes = []
            for (let i = 0; i < response.data.data.length; i++) {
              arrListTicketTypes[i] = response.data.data[i]
            }
            this.tableData = arrListTicketTypes
          })
          .catch(e => {
            this.errors.push(e)
          })
        this.$emit('senDatatable', this.tableData)

        if (response.data.success === true) {
          this.$emit('exit', true)
          this.$notify({
            group: 'default',
            type: 'bg-success text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
          this.form.name = ''
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

<style lang="scss">
  #parent {
    display: table;
    width: 100%;
  }
  #btnCreate{
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }
</style>
