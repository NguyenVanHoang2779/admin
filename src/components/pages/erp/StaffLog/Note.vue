<template>
  <div v-if="member">
    <b-modal
      v-model="openModal"
      @hidden="close"
      :title="`Ghi chú chăm sóc ${member.ErpMasterProfile.fullname}`"
    >
      <div class="col-md-12 form" v-loading="loading">
          <div class="form-group">
            <p class="form-title">Ghi chú</p>
            <b-form-textarea
              id="note"
              v-model="note"
              placeholder="Ghi chú"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </div>
        </div>
      <template slot="modal-footer">
          <button type="button" class="btn btn-success" @click="done">Xong</button>
          <button type="button" class="btn btn-secondary" @click="close">Đóng</button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import newMemberService from 'domain/services/new-member-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  props: ['open', 'pkgOrder', 'member', 'idx'],
  data () {
    return {
      openModal: false,
      loading: false,
      note: ''
    }
  },
  methods: {
    close () {
      this.openModal = false
      this.$emit('toggleNotePopup', {member: null, state: false})
    },
    async done () {
      try {
        this.loading = true
        await newMemberService.addNote({
          masterProfileId: this.member.ErpMasterProfile.id,
          content: this.note,
          userId: this.member.User.id
        })
        this.$emit('refreshMember')
        this.close()
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    }
  },
  watch: {
    open (v) {
      this.openModal = v
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
