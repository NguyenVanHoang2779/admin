<template>
  <div>
    <div>
      <multiselect
        v-model="value"
        placeholder="Nhập để tìm kiếm"
        label="name"
        track-by="id"
        :options="options"
        :multiple="true"
        :taggable="true"
        :searchable="true"
        :internal-search="false"
        :clear-on-select="true"
        :close-on-select="true"
        :hide-selected="true"
        @input="onSelectUser"
        @search-change="search"
        >
      </multiselect>
    </div>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import ticketTypeServices from 'domain/services/ticket-type-services'
import sosService from 'domain/services/internal-sos-service'

export default {
  props: ['data'],
  name: 'multi-select-group',
  components: {
    Multiselect,
    ticketTypeServices
  },
  data: () => ({
    // value: [],
    options: []
  }),

  created () {

  },
  computed: {
    value: {
      get () {
        return this.data
      },
      set (data) {
        return data
      }
    }
  },
  methods: {
    async search (term) {
      if (term.length < 2) {
        return false
      }
      try {
        const {data} = await sosService.apiGetListUsers({
          term
        })

        if (data.success) {
          this.options = data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async onSelectUser (value) {
      this.$emit('usersHandleSelected', value)
    }
    // async getData (data) {
    //   try {
    //     const {data} = await sosService.getListGroupHandleTicketType(data)

    //     if (data.success) {
    //       this.options = data.data
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
  }
}
</script>

<style scoped lang="scss">
</style>
