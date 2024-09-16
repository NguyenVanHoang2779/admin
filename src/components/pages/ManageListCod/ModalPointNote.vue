<template>
  <div>
    <b-modal
      v-model="show"
      title="Nhập ghi chú"
      size="lg"
      header-bg-variant="white"
      header-text-variant="black"
      static
      centered
      hide-footer
    >
      <b-form>
        <b-form-textarea v-model="note" autofocus size="lg" placeholder="Nhập ghi chú ..."/>
        <div class="text-right">
          <b-button class="mt-2 save-button" size="sm" variant="primary" @click.prevent="show = false">
            Đóng
          </b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ModalPointNote',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    note: {
      get () {
        return this.value || ''
      },
      set (value) {
        this.$emit('input', (value || ''))
      }
    }
  },
  data () {
    return {
      show: false
    }
  },
  mounted () {
    this.show = true
    this.$root.$on('bv::modal::hidden', () => {
      this.$emit('closed')
    })
  }
}
</script>
