<template>
  <Multiselect
    v-model="option"
    :loading="isLoading"
    :options="options"
    :mutilple="false"
    :searchable="isSearchable"
    :placeholder="placeholder"
    label="name"
    track-by="id"
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
  name: 'multi-select-topics',

  components: {
    Multiselect
  },

  props: {
    placeholder: {
      default: 'Chủ đề'
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
    listTopicId: {
      default: null
    },
    addDataTopic: {
      default: 0
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
      this.$emit('handleSelectedTopic', newValue)
    },
    listTopicId: function (newValue, oldValue) {
      // Nhận thay đổi từ component cha và set lại option => kiểm tra xem có listoptions, nếu có mới set data cho model
      if (this.options && this.options.length > 0) {
        this.setList()
      }
    },
    addDataTopic: function (newVal, oldVal) {
      if (newVal > 0) {
        this.getListOptions()
      }
    }
  },

  mounted () {
  },

  data: _ => ({
    option: null,
    options: [],
    isLoading: false
  }),

  methods: {
    setList: function () {
      if (this.listTopicId) {
        this.option = []
        this.listTopicId.split(',').forEach(item => {
          if (item) {
            let option = this.options.find(op => (+op.id === +item))
            if (option) {
              this.option.push(option)
            }
          }
        })
      } else {
        this.option = null
      }
    },
    getListOptions: async function () {
      this.isLoading = true
      const res = await ManageTagService.getListTopics()
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
