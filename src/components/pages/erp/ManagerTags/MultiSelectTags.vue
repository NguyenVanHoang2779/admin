<template>
  <Multiselect
    v-model="option"
    :loading="isLoading"
    :options="options"
    :mutilple="false"
    :searchable="isSearchable"
    :placeholder="placeholder"
    label="tag_name"
    track-by="tag_id"
    selectedLabel=""
    deselectLabel="X"
    selectLabel=""
    :close-on-select="autoClose"
    :hide-selected="hideSelected"
    :disabled="disabled"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy kết quả</span>
    <span class="placeholder" slot="placeholder">{{placeholder}}</span>
  </Multiselect>
</template>

<script>
// import children component here
import Multiselect from 'vue-multiselect'

// import service here: ex import nameService 'domain/services/name-service'
import ManageTagService from 'domain/services/manage-tags-service'

// import helper here
// import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'multi-select-tags',

  components: {
    Multiselect
  },

  props: {
    placeholder: {
      default: 'Tag'
    },
    autoClose: {
      default: false
    },
    hideSelected: {
      default: false
    },
    disabled: {
      default: false
    },
    isSearchable: {
      default: true
    },
    listTagId: {
      default: null
    },
    listPositionId: {
      default: null
    }
  },

  computed: {
  },

  created () {
    this.getListOptions()
  },

  watch: {
    // gửi sự kiện đã chọn option và value đến component cha
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedTag', newValue)
    },
    listTagId: function (newValue, oldValue) {
      // Nhận thay đổi từ component cha và set lại option => kiểm tra xem có listoptions, nếu có mới set data cho model
      if (this.options && this.options.length > 0) {
        this.setList()
      }
    },
    listPositionId: function (newVal, oldVal) {
      // get lại data khi ô multiselect position thay đổi
      this.params = newVal
      this.option = null
      this.getListOptions()
    }
  },

  mounted () {
  },

  data: _ => ({
    option: null,
    options: [],
    isLoading: false,
    params: null
  }),

  methods: {
    setList: function () {
      if (this.listTagId) {
        this.option = []
        this.listTagId.split(',').forEach(item => {
          if (item) {
            let option = this.options.find(op => (+op.id === +item.id))
            if (option) this.option.push(option)
          }
        })
      } else {
        this.option = null
      }
    },
    getListOptions: async function () {
      let params = {
        position_id: this.params
      }
      this.isLoading = true
      const res = await ManageTagService.getListTags(params)
      try {
        if (res.data.success) {
          this.options = res.data.data
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
<style scoped>

</style>
