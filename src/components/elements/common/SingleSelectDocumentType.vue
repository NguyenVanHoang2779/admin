<template>
  <div>
    <multiselect
      v-model="option"
      :options="options"
      placeholder="Loại hồ sơ"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
      :class="customClass"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Loại hồ sơ</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import profileService from 'domain/services/profile-mamanger-service'

export default {
  components: {
    Multiselect
  },
  props: {
    documentId: null,
    reset: false,
    positionId: null,
    customClass: ''
  },
  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getList()
  },

  watch: {
    option (v) {
      this.$emit('handleSelected', v)
    },

    documentId (v) {
      if (v) this.setSelectedOption()
      else this.option = null
    },

    reset () {
      this.option = null
    },

    positionId (v) {
      this.positionId = v
      this.getList()
    }
  },

  methods: {
    getList: function () {
      profileService.getDocumentTypes({positionId: this.positionId})
        .then(({data}) => {
          if (data.success) {
            let options = []
            data.data.list.map(item => {
              options.push({ id: item.ErpDocument.id, name: `${item.ErpDocument.sub_type ? item.ErpDocument.sub_type : 'Không xác định'} - ${item.ErpDocument.name}` })
            })
            this.options = options
            this.setSelectedOption()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    setSelectedOption () {
      if (this.options.length > 0 && this.documentId) {
        this.option = this.options.find((option) => {
          return parseInt(option.id) === parseInt(this.documentId)
        })
      }
    }
  }
}
</script>
