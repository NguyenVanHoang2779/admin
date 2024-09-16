<template>
    <b-row>
        <b-col sm="12">
            <multiselect
                    v-model="asyncSelected"
                    selectLabel=""
                    label="name"
                    track-by="id"
                    placeholder="Nhập ít nhất 2 kí tự để tìm kiếm"
                    :options="asyncFound"
                    :multiple="multiple"
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
        </b-col>
    </b-row>
</template>
<script>
import Multiselect from 'vue-multiselect'
import documentService from 'domain/services/document-service'

import debounce from 'debounce'

export default {
  props: [
    'document',
    'documentId',
    'multiple'
  ],
  name: 'select-document',

  components: {
    Multiselect,
    documentService,
    debounce
  },
  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    },
    document () {
      this.asyncSelected = this.document
    }
  },

  data: () => ({
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    message: 'Nhập ít nhất 2 ký tự'
  }),

  computed: {},

  created () {
  },

  methods: {
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      documentService.apiGetListDocumentOther({term: query, documentId: this.documentId}).then(response => {
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
