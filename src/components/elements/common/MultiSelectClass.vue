<template>
    <b-row class="mb-1">
        <b-col sm="12">
            <multiselect
              :select-label="''"
              :disabled="disabled"
              v-model="asyncSelected"
              :class="customClass"
              label="name"
              track-by="id"
              :placeholder="placeholder"
              :options="asyncFound"
              :multiple="multiple"
              :searchable="true"
              :loading="asyncLoading"
              :internal-search="false"
              :clear-on-select="clearOnSelect"
              :close-on-select="autoClose"
              :hide-selected="hideSelected"
              @search-change="asyncFind"
              @select="op => { $emit('select', op) }"
              @remove="op => { $emit('remove', op) }"
              @input="ops => { $emit('input', ops) }"
            >
              <span slot="noResult">Không có kết quả phù hợp !</span>
              <span slot="noOptions">{{ message }}</span>
              <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
            </multiselect>
        </b-col>
    </b-row>
</template>
<script>
import Multiselect from 'vue-multiselect'
import trainingService from 'domain/services/training-service'
import debounce from 'debounce'

export default {
  props: {
    classCode: {

    },
    customClass: {
      default: ''
    },
    placeholder: {
      default: null
    },
    hideSelected: {
      default: true
    },
    autoClose: {
      default: true
    },
    clearOnSelect: {
      default: true
    },
    disabled: {
      default: false
    },
    multiple: {
      default: true
    }
  },
  name: 'multi-select-class',

  components: {
    Multiselect,
    trainingService,
    debounce
  },
  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    },
    classCode: {
      immediate: true,
      handler: function () {
        this.asyncSelected = this.classCode
      }
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
      trainingService.apiGetListClass({term: query}).then(response => {
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
