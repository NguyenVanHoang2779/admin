<template>
  <ManageDependant :dataSearchInput="dataSearch" />
</template>

<script>
import ManageDependant from './ManageDependant'

export default {
  name: 'dependant-people-dashboard',

  components: {
    ManageDependant
  },

  data () {
    return {
      dataSearch: {
        provinceId: null,
        stationId: null,
        regionId: null,
        taxIdenNumberPersonalId: null,
        fullnameUsername: null,
        month: null,
        status: null,
        page: null
      }
    }
  },

  created () {
    if (this.$route.params.id) this.dataSearch.taxIdenNumberPersonalId = this.$route.params.id
    if (this.$route.query.status) this.dataSearch.status = this.$route.query.status
  }
}
</script>
