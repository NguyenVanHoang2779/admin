<template>
    <multiselect
      :class="{'stateTrue': state === true, 'stateFalse' : state === false}"
      v-model="option"
      :options="options"
      :placeholder="placeholder"
      :disabled="isDisabled"
      label="name"
      track-by="id"
      selectedLabel=""
      deselectLabel="X"
      selectLabel="Chọn"
      :searchable="true"
      @select="op => { $emit('select', op) }"
      @remove="op => { $emit('remove', op) }"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
    </multiselect>
</template>

<script>
import addressService from 'domain/services/address-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-poi-identity-card',

  components: {
    Multiselect
  },

  props: {
    placeholder: {
      type: String,
      default: 'Chọn nơi cấp'
    },
    provinceId: {
    },
    isDisabled: {
      type: Boolean
    },
    state: {
      type: Boolean,
      default: null
    }
  },
  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getAllOption()
  },

  watch: {
    option (newVal, oldVal) {
      this.$emit('handleSelectedProvince', newVal)
    },

    provinceId (newValue, oldValue) {
      if (!newValue) {
        this.option = null
        return
      }
      this.setSelectedOption()
    },

    unselect (newValue, oldValue) {
      if (newValue) {
        this.option = null
      }
    },

    reset () {
      this.option = null
    }
  },

  methods: {
    setSelectedOption () {
      if (this.options && this.options.length && this.provinceId) {
        this.option = this.options.find(option => (parseInt(option.id) === parseInt(this.provinceId))) || null
      }
    },

    getAllOption () {
      let dataCache = sessionStorage.getItem('allPoiIdentityCard')
      if (dataCache) {
        this.options = JSON.parse(dataCache)
      } else {
        addressService.getAllProvince()
          .then((response) => {
            if (response.data.success) {
              let moreOptions = [
                {
                  id: '-2',
                  name: 'Cục Cảnh sát quản lý hành chính về trật tự xã hội'
                },
                {
                  id: '-1',
                  name: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư'
                }
              ]
              this.options = [...moreOptions, ...response.data.data]
              this.setSelectedOption()
              sessionStorage.setItem('allPoiIdentityCard', JSON.stringify(this.options))
            }
          })
          .catch((e) => {
            console.log(e)
          })
      }

      this.setSelectedOption()
    }
  }
}
</script>

<style scoped>
  .stateTrue >>> .multiselect__tags {
    border-color: #28a745;
  }
  .stateFalse >>> .multiselect__tags {
    border-color: #d9534f;
  }
</style>
