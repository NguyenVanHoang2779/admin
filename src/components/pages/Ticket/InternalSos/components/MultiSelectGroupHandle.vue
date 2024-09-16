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
        @input="onSelectGroup"
        >
      </multiselect>
    </div>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import ticketTypeServices from 'domain/services/ticket-type-services'

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
    this.getGroups()
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
    async getGroups () {
      const {data} = await ticketTypeServices.getListGroupTicketType()

      if (data.success) {
        this.options = data.data.map((item) => {
          return {
            id: item.code,
            name: item.name
          }
        })
      }
    },
    async onSelectGroup (value) {
      this.$emit('groupsHandleSelected', value)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
