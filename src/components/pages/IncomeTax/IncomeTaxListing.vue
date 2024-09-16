<template>
  <IncomeTaxTable :dataSearchInput="dataSearch" />
</template>

<script>
import IncomeTaxTable from './IncomeTaxTable'

export default {
  name: 'income-tax-certification-listing',

  components: {
    IncomeTaxTable
  },

  data () {
    return {
      dataSearch: {
        year: new Date().getFullYear(),
        page: 1
      }
    }
  }

}
</script>
