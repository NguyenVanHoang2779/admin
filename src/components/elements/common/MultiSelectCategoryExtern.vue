<template>
  <div class="w-100">
    <multiselect
      v-model="categoryExternOption"
      :options="categoryExternOptions"
      placeholder="Chọn danh mục cấp 2"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :disabled="disabled"
      :custom-label="customLabel"
      :allow-empty="empty"
      :multiple="multiple"
      :searchable="true"
      :max="maxSelected"
      :internal-search="false"
      :show-no-results="false"
      @search-change="search"
      @input="op => { if (op) {$emit('input', op)} }"
      @remove="removeOption"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span slot="maxElements">{{maxSelectedMessage}}</span>
    </multiselect>
  </div>
</template>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'multi-select-category-extern',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    categoryExtern: {
      default: null
    },
    level: {
      type: Number,
      default: 1
    },
    parentId: {
      default: ''
    },
    empty: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    maxSelected: {
      default: 2
    },
    maxSelectedMessage: {
      type: String,
      default: 'Không thể chọn thêm! vui lòng bỏ chọn 1 lựa chọn nếu muốn chọn thêm'
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    categoryExternOption: null,
    categoryExternOptions: [],
    saveAllCategoryExternOption: []
  }),

  created () {
    this.getCategoryExternList()
  },

  watch: {
    categoryExtern: {
      immediate: true,
      handler: function (newVal, oldVal) {
        if (newVal) this.categoryExternOption = newVal
        else this.categoryExternOption = null
      }
    }
  },
  methods: {
    getCategoryExternList: function () {
      let dataSend = {
        level: this.level,
        parentId: this.parentId
      }
      CompanyProfileService.getCategoryExtern(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.categoryExternOptions = res.data.data
            this.saveAllCategoryExternOption = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    },

    search: function (searchQuery) {
      let temp = this.saveAllCategoryExternOption.filter((item) => (item.name).search(searchQuery) !== -1)

      if (temp.length > 0) {
        this.categoryExternOptions = temp
      }
    },
    customLabel: function ({ level, name }) {
      return level ? `${name}` : `${name}`
    },
    removeOption: function (categoryExternOption) {
      this.$emit('removeCategoryExtern', {categoryExternOption: categoryExternOption, parentId: this.parentId})
    }
  }
}
</script>

<style scoped>

</style>
