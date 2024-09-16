<template>
  <div class="select-provinces">
    <b-row>
      <b-col class="col-md-3 btn-province-select">
        <b-button :variant="variantALL" @click="handerSelectedAll(variantALL)" v-model="variantALL">Tất cả</b-button>
        <b-button :variant="variantOther" @click="handerSelectOther(variantOther)" v-model="variantOther">Các tỉnh khác</b-button>
      </b-col>
      <b-col class="col-md-9 province-multi-select">
        <multiselect class="multiselect-success" v-model="multipleValue" :options="multipleOptions" :multiple="true" :searchable="true" :max-height="250" label="name" track-by="name" placeholder="Chọn tỉnh" selectedLabel="Đã chọn" :limit="10" selectLabel="Nhấn enter để chọn tỉnh" deselectLabel="Nhấn enter để bỏ chọn"/>
      </b-col>
    </b-row>
  </div>
</template>

<style>
.select-provinces {
  margin-bottom: 30px;
}

.btn-province-select {
  padding: 0;
}

.btn-province-select :first-child{
  margin-right: 9%;
  margin-left: 0;
}

.province-multi-select {
  margin-left: 0;
}
</style>

<script>
import Multiselect from 'vue-multiselect'
import dashboardV2 from 'domain/admin/dashboardV2'

export default {
  name: 'select-provinces',

  components: {
    Multiselect
  },

  data: () => ({
    multipleValue: [],
    multipleOptions: []
  }),

  created () {
    this.getProvinceList()
  },

  watch: {
    multipleValue: function (newMultipleValue, oldMultipleValue) {
      let selectedValue = newMultipleValue.map(option => {
        return option.id
      })
      selectedValue = selectedValue.toString()
      this.$emit('selectedProvinces', selectedValue)
    }
  },

  computed: {
    variantALL: {
      get: function () {
        if (this.multipleValue.length === this.multipleOptions.length && this.multipleOptions.length > 0) {
          return 'success'
        } else {
          return 'primary'
        }
      },
      set: function (value) {
      }
    },

    variantOther: {
      get: function () {
        let multipleOptionsOther = this.multipleOptions.filter(option => [1, 126, 129].includes(option.id) === false)
        let equalOther = this.multipleValue.every(e => multipleOptionsOther.includes(e)) && (this.multipleValue.length === multipleOptionsOther.length) && this.multipleOptions.length > 0
        if (equalOther) {
          return 'success'
        } else {
          return 'primary'
        }
      },
      set: function (value) {
      }
    }
  },

  methods: {
    getProvinceList: function () {
      dashboardV2.getProvinceList()
        .then((response) => {
          if (response.data.success) {
            this.multipleOptions = response.data.data
            // this.multipleValue = [this.multipleOptions[0], this.multipleOptions[1], this.multipleOptions[2]]
            this.multipleValue = [...this.multipleOptions]
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    handerSelectedAll: function (variantALL) {
      if (variantALL === 'primary') {
        this.variantALL = 'success'
        this.multipleValue = this.multipleOptions
      } else {
        this.variantALL = 'primary'
        this.multipleValue = []
      }
    },

    handerSelectOther: function (variantOther) {
      if (variantOther === 'primary') {
        this.variantOther = 'success'
        this.multipleValue = this.multipleOptions.filter(option => [1, 126, 129].includes(option.id) === false)
      } else {
        this.variantOther = 'primary'
        this.multipleValue = []
      }
    }
  }
}
</script>
