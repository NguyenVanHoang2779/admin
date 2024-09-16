<template>
  <div>
    <multiselect class="multiselect-primary"
     v-model="option"
     :options="options"
     :multiple="true"
     placeholder="Chọn vùng"
     label="name"
     track-by="name"
     selectedLabel="Đã chọn"
     deselectLabel="Bỏ chọn"
     selectLabel="Chọn"
     :close-on-select="false"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<style scoped>
  .non-blur >>> .multiselect--disabled {
    opacity: 1!important;
  }
  .non-blur >>> .multiselect__tags {
    background: white;
  }
  .non-blur >>> .multiselect__tag-icon {
    display: none
  }
  .custom-multiselect {
    max-height: 200px;
    overflow: auto;
  }
</style>

<script>
import Multiselect from 'vue-multiselect'
import salaryService from 'domain/services/salary-service'

export default {
  name: 'select-region',

  components: {
    Multiselect
  },

  props: [
    'data', 'reload', 'action', 'reloadOption'
  ],
  data: () => ({
    option: null,
    options: []
  }),
  created () {
    this.getList()
  },
  mounted () {
    this.option = null
    this.option = this.data
  },
  watch: {
    option: function (newValue, oldValue) {
      if (newValue) {
        this.$emit('handleRegionSelected', newValue)
      }
    },
    data: function (newValue, oldValue) {
      if (newValue) {
        this.option = newValue
      } else this.option = null
    },
    reload: function (newVal, oldValue) {
      this.getList()
    },
    action: function (newValue, oldValue) {
      // tạo mới
      if (newValue === 1) this.option = []
    },
    reloadOption: function (newValue, oldValue) {
      this.option = null
    }
  },

  methods: {
    getList: function () {
      this.option = null
      this.option = this.data
      salaryService.getListRegion()
        .then((res) => {
          if (res.data.success) {
            this.options = [...res.data.data] // [id=>A, name=>B]
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
