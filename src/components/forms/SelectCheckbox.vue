<template>
  <div class="select-checkbox-custom">
    <div v-click-outside="hide" @click="opened = !opened">
      <span class="text-filter">
        Chọn loại đơn
        <i class="ion d-block" :class="[ opened ? 'ion-ios-arrow-up' : 'ion-ios-arrow-down' ]"></i>
      </span>
    </div>
    <div>
      <ul class="dropdown-menu list-select-checkbox" :class="{ 'show' : opened }" >
        <li>
          <b-form-checkbox
            v-model="allSelected"
            @change="selectAll"
          >
            <span class="font-weight-bold">{{ allSelected ? 'Bỏ chọn' : 'Chọn tất cả' }}</span>
          </b-form-checkbox>
        </li>
        <b-dropdown-divider></b-dropdown-divider>
        <li class="pb-2"  v-for="typePkg in packageTypes">
          <b-form-checkbox
            v-model="selectTypePkgs"
            :value="typePkg.code"
          >
            <span class="font-weight-bold">{{ typePkg.name }}</span>
          </b-form-checkbox>
        </li>
        <li>
          <b-button size="sm" @click="emptySelectPkg">Chọn lại đơn hàng</b-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
export default {
  props: ['dataSelect'],
  data () {
    return {
      opened: false,
      packageTypes: [
        { name: 'Nội tỉnh', code: 'noitinh' },
        { name: 'Nội miền', code: 'noimien' },
        { name: 'Liên miền', code: 'lienmien' },
        { name: 'Đặc biệt', code: 'dacbiet' }
      ],
      selectTypePkgs: [],
      allSelected: false
    }
  },
  methods: {
    toggle () {
      this.opened = true
    },
    hide () {
      this.opened = false
    },
    selectAll (checked) {
      this.selectTypePkgs = []
      if (checked) {
        let list = []
        for (const type in this.packageTypes) {
          list.push(this.packageTypes[type].code)
        }
        this.selectTypePkgs = list
      }
    },
    emptySelectPkg () {
      this.$emit('re-selected-pkg', 1)
    }
  },
  mounted () {
    this.popupItem = this.$el
  },
  created () {
    this.selectTypePkgs = this.dataSelect
    if (this.dataSelect.length === 0) {
      let list = []
      for (const type in this.packageTypes) {
        list.push(this.packageTypes[type].code)
      }
      this.selectTypePkgs = list
    }
  },
  directives: {
    ClickOutside
  },
  watch: {
    selectTypePkgs: function (newVal, oldVal) {
      if (newVal.length === 0) {
        this.allSelected = false
      } else if (newVal.length === this.packageTypes.length) {
        this.allSelected = true
      } else {
        this.allSelected = false
      }
      this.$emit('selected-type', newVal)
    }
  }
}
</script>
<style scoped>
  .select-checkbox-custom {
    position: relative;
  }
  .text-filter {
    position: relative;
    padding-right: 18px;
    display: inline-block;
  }
  .text-filter > i {
    position: absolute;
    top: 4px;
    right: 0;
  }
  .list-select-checkbox {
    padding: 15px;
  }
  .list-select-checkbox li:last-child {
    padding-bottom: 0 !important;
  }
</style>
