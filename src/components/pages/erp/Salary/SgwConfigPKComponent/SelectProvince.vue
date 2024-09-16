<template>
  <div>
    <multiselect class="multiselect-primary"
     v-model="option"
     :options="options"
     :multiple="true"
     placeholder="Chọn tỉnh"
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
  name: 'select-province',

  components: {
    Multiselect
  },

  props: ['regionIds', 'data', 'reload', 'action', 'reloadOption'],
  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getList()
  },
  watch: {
    option: function (newValue, oldValue) {
      if (newValue) {
        this.$emit('handleProvinceSelected', newValue)
      }
    },
    regionIds: function (newValue, oldValue) {
      if (newValue === null) {
      } else if (newValue) {
        this.getList(newValue)
      }
    },
    data: function (newValue, oldValue) {
      if (newValue) {
        this.option = [...newValue]
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
    getList: function (data) {
      let dataSend = {
        region_ids: data
      }
      // this.option = null
      // this.option = this.data ? [...this.data, ...this.option] : this.option
      salaryService.getListProvinceByRegion(dataSend)
        .then((res) => {
          if (res.data.success) {
            if (this.data) {
              this.options = [...res.data.data, ...this.data]
            }
            this.options = [...res.data.data]
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
