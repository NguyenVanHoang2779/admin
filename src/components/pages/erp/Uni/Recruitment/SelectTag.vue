<template>
  <div>
    <multiselect
      v-model="selectedOption"
      :options="options"
      placeholder="Chọn tag"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
      :multiple="true"
      :class="customClass"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<script>
import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'SelectTag',
  components: {Multiselect},
  props: {
    tags: [],
    customClass: ''
  },
  data () {
    return {
      options: [], // Danh sách options lấy từ server
      selectedOption: ''// Option được chọn
    }
  },
  mounted () {
    // Gọi API để lấy danh sách options từ server
    this.fetchOptions()
  },

  created () {
  },

  watch: {
    selectedOption: function (newValue, oldValue) {
      this.$emit('handleTagsSelected', newValue)
    }
  },

  methods: {
    async fetchOptions () {
      const response = await recruitmentService.getTags()
      if (response.data.success) {
        const tags = [...Object.values(response.data.data.tag_global), ...Object.values(response.data.data.tag_personal)]
        this.options = tags.map(function (tag) {
          return {
            id: tag.id,
            name: tag.name
          }
        })
      } else {
        console.log(response.data.message || 'Không lấy được tag')
      }
    }
  }
}
</script>
