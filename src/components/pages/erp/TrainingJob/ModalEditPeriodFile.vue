<template>
  <b-modal
    :id="id"
    title-class="font-weight-bold w-100"
    header-class="text-center"
    modal-class="modal-md"
    hide-footer
  >
    <h4 class="w-100 m-0" slot="modal-header">Tài liệu học buổi {{ order_number }}</h4>
    <ViewDocument
      :lessons="files"
    />
  </b-modal>
</template>

<script>
import moment from 'moment'
import ViewDocument from './ViewDocument.vue'

export default {
  name: 'modal-edit-period-file',
  components: {
    ViewDocument
  },

  props: {
    id: {
      default: 'modal-edit-period-file'
    },
    period: {
      type: Object,
      default: _ => ({
        filePeriod: [],
        fileExtract: []
      })
    }
  },

  data: _ => ({
  }),

  computed: {
    order_number () {
      return this.period && this.period.ErpTpPeriod && this.period.ErpTpPeriod.order_number
    },

    files () {
      if (!this.period) return []
      let files = []

      this.period.file.forEach(file => {
        if (file) files.push(file)
      })

      return files
    }
  },

  methods: {
    formatDate (date, format) {
      return moment(date || null).format(format || 'DD-MM-YYYY')
    }
  }
}
</script>
