<template>
  <div>
    <b-modal
      v-model="openModal"
      @hidden="close"
      :title="`Tạo và quản lý thẻ phân loại`"
      scrollable
    >
      <div class="col-md-12 form" v-loading="loading">
        <b-form @submit="onSubmit">
          <div class="form-group">
            <b-input-group
              class="mb-3"
            >
              <b-form-input
                v-model="tag"
                type="text"
                placeholder="Nhập tên tag mới">
              </b-form-input>
              <b-input-group-append>
                <b-button variant="outline-success" @click="onSubmit"><i class="fa fa-save"></i></b-button>
              </b-input-group-append>
            </b-input-group>
            <div>
              <b-list-group>
                <b-list-group-item class="d-flex align-items-center" v-for="(tag, index) in tags" :key="index">
                  <span class="mr-auto">{{ tag.name }}</span>
                  <b-button class="add-tag" variant="outline-success" @click="onAddTagToMp(tag)"><i class="fa fa-tag"></i></b-button>
                  <b-button variant="outline-danger" @click="onDeleteTag(tag)"><i class="fa fa-trash"></i></b-button>
                </b-list-group-item>
              </b-list-group>
            </div>
          </div>
        </b-form>
        </div>
      <template slot="modal-footer">
          <button type="button" class="btn btn-success" @click="close">Đóng</button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import newMemberService from 'domain/services/new-member-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import { eventBus } from '../../../../main'

export default {
  props: ['open', 'member', 'idx', 'tags'],
  data () {
    return {
      openModal: false,
      loading: false,
      tag: ''
    }
  },
  methods: {
    close () {
      this.openModal = false
      this.$emit('toggleTagManage', {member: this.member, state: false})
    },
    async onSubmit (e) {
      e.preventDefault()
      try {
        this.loading = true
        const data = await newMemberService.createTag({
          name: this.tag
        })
        if (data.data.success) {
          this.tag = ''
          this.$emit('refreshTags')
        } else {
          commonHelper.showMessage(data.data.message, 'warning')
        }
        // this.close()
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    async onDeleteTag (tag) {
      try {
        if (confirm('Bạn có chắc muốn xóa tag ' + tag.name + ' ?')) {
          this.loading = true
          const data = await newMemberService.deleteTag({
            id: tag.id
          })
          if (data.data.success) {
            this.$emit('refreshTags')
          } else {
            commonHelper.showMessage(data.data.message, 'warning')
          }
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    async onAddTagToMp (tag) {
      try {
        this.loading = true
        const data = await newMemberService.addTagToMasterProfile({
          new_member_tag_id: tag.id,
          master_profile_id: this.member.ErpMasterProfile.id
        })

        if (data.data.success) {
          eventBus.$emit('refreshTagMp')
          this.openModal = false
        } else {
          commonHelper.showMessage(data.data.message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    done () {
      this.openModal = false
      this.$emit('toggleTagManage', {member: this.member, state: false})
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
.add-tag{
  margin: 0 10px;
}
</style>
