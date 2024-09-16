<template>
  <b-modal :id="id" :title="title" centered title-class="w-100" header-class="text-center" hide-footer @shown="note = null">
    <textarea
      class="rounded form-control"
      v-model.trim="note"
      name="note"
      rows="4"
      placeholder="Nhập ghi chú"
    ></textarea>
    <div class="d-flex justify-content-between mt-2">
      <button class="btn rounded btn-secondary" @click="close">Đóng</button>
      <button class="btn btn-ghtk rounded text-white lh-0-8" @click="saveNote">Lưu</button>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'modal-note',

  props: {
    id: {
      default: 'modal-note'
    },
    title: {
      default: 'Ghi chú'
    },
    preNote: {
      default: null
    }
  },

  data: _ => ({
    note: null
  }),

  watch: {
    preNote: {
      immediate: true,
      handler: function () {
        if (this.preNote) this.note = this.preNote
      }
    }
  },

  methods: {
    close () {
      this.$bvModal.hide(this.id)
    },

    saveNote () {
      this.$emit('save', this.note)
    }
  }
}
</script>
