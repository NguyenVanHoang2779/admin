<template>
    <multiselect class="multiselect-primary"
      v-model="option"
      :options="options"
      placeholder="Chọn nhân sự"
      :custom-label="customLabel"
      track-by="username"
      selectedLabel=""
      deselectLabel="X"
      selectLabel="Chọn"
      :searchable="true"
      @select="op => $emit('select', op)"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import executiveService from 'domain/services/executive-service'

export default {
  name: 'single-select-executive-team-member',

  components: {
    Multiselect
  },

  props: {
    memberId: {}
  },

  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getList()
  },

  watch: {
    memberId: function (newVal, oldVal) {
      if (!newVal) {
        this.option = null
        return
      }
      this.setList()
    },

    option: function (newValue, oldValue) {
      this.$emit('on-select', newValue)
    }
  },

  methods: {
    customLabel ({fullname, username, stationname}) {
      return fullname + ' (' + username + ')'
    },

    setList () {
      if (this.memberId) {
        this.option = this.options.find(op => (+op.id === +this.memberId))
      }
    },

    getList: function () {
      executiveService.getSelectableMember()
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setList()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }

  }
}
</script>
