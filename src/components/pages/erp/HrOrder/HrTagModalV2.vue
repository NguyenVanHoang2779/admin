<template>
  <div>
    <b-modal
      v-model="openModal"
      @hidden="close()"
      :title="`Tạo và quản lý thẻ phân loại`"
      scrollable
    >
      <div class="col-md-12 form" v-loading="loading">
        <div class="form-group">
          <label for="">Tag chung</label>
          <b-input-group class="mb-3" v-if="canManageGlobalTags()">
            <b-form-input
              v-model="tag"
              type="text"
              placeholder="Nhập tên tag mới">
            </b-form-input>
            <b-input-group-append>
              <b-button variant="outline-success" id='hr-tag-modal-btn-save' name='hr-tag-modal-btn-save' @click="onSubmit"><i class="fa fa-save"></i></b-button>
            </b-input-group-append>
          </b-input-group>
          <div v-if="globalTags">
            <b-list-group>
              <b-list-group-item class="d-flex align-items-center" v-for="(tag, index) in globalTags" :key="index">
                <span class="mr-auto">{{ tag.name }}</span>
                <b-button
                    v-if="attachPermission"
                    class="add-tag"
                    variant="outline-success"
                    @click="onAttach(tag)">
                    <i class="fa fa-tag"></i>
                </b-button>
                <b-button
                  v-if="canManageGlobalTags()"
                  variant="outline-danger"
                  @click="onDeleteTag(tag)"
                >
                  <i class="fa fa-trash"></i>
                </b-button>
              </b-list-group-item>
            </b-list-group>
          </div>
        </div>
        <b-form @submit="onSubmit" v-if="havePersonalTag">
          <div class="form-group">
            <label for="">Tag cá nhân</label>
            <b-input-group class="mb-3">
              <b-form-input
                  v-model="tag"
                  type="text"
                  placeholder="Nhập tên tag mới"
              >
              </b-form-input>
              <b-input-group-append>
                <b-button variant="outline-success" id='hr-tag-modal-btn-save' name='hr-tag-modal-btn-save' @click="onSubmit"><i class="fa fa-save"></i></b-button>
              </b-input-group-append>
            </b-input-group>
            <div>
              <b-list-group>
                <b-list-group-item class="d-flex align-items-center" v-for="(tag, index) in tags" :key="index">
                  <span class="mr-auto">{{ tag.name }}</span>
                  <b-button
                      v-if="attachPermission"
                      class="add-tag"
                      variant="outline-success"
                      @click="onAttach(tag)">
                      <i class="fa fa-tag"></i>
                  </b-button>
                  <b-button variant="outline-danger" @click="onDeleteTag(tag)"><i class="fa fa-trash"></i></b-button>
                </b-list-group-item>
              </b-list-group>
            </div>
          </div>
        </b-form>
      </div>
      <template slot="modal-footer">
        <button type="button" class="btn btn-success" @click="close()">Đóng</button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import hrTagService from 'domain/services/hr-tag-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  props: {
    open: {
      default: false
    },
    scope: {
      type: String,
      default: 'private'
    },
    tags: {
      default: null
    },
    tableName: {
      default: null
    },
    recordId: {
      default: null
    },
    attachPermission: {
      type: Boolean,
      default: true
    },
    globalTags: {
      default: null
    },
    isStaffShiftPage: {
      default: false
    },
    havePersonalTag: {
      default: true
    },
    permissions: {
      default () {
        return {
          manageGlobalTag: false
        }
      }
    }
  },
  data () {
    return {
      openModal: false,
      loading: false,
      tag: '',
      tagGlobal: ''
    }
  },
  methods: {
    close () {
      this.openModal = false
      this.$emit('action', {action: 'closeHrTag'})
    },

    canManageGlobalTags () {
      return (this.permissions && this.permissions.manageGlobalTag)
    },

    async onSubmit (e) {
      if (this.tag.length > 20) {
        commonHelper.showMessage('Độ dài tag cần nhỏ hơn 20 kí tứ', 'warning')
        return
      }
      e.preventDefault()
      try {
        this.loading = true
        const data = await hrTagService.create({
          name: this.tag,
          table_name: this.tableName,
          scope: this.scope
        })
        if (data.data.success) {
          commonHelper.showMessage(data.data.message, 'success')
          this.tag = ''
          this.$emit('refresh')
          this.$emit('action', {action: 'refreshHrTag'})
        } else {
          commonHelper.showMessage(data.data.message, 'warning')
        }
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
          const data = await hrTagService.delete({
            id: tag.id
          })
          if (data.data.success) {
            commonHelper.showMessage(data.data.message, 'success')
            this.$emit('action', {action: 'refreshHrTag'})
            this.$emit('refresh')
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

    async onAttach (tag) {
      try {
        this.loading = true

        const response = await hrTagService.attach({
          hr_tag_id: tag.id,
          table_name: tag.table_name,
          record_id: this.recordId
        })

        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          const log = response.data.candidate_log ? response.data.candidate_log : null
          this.$emit('attachTagSuccess', {tag: tag, log: log})
          this.openModal = false
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
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
.add-tag {
  margin: 0 10px;
}
</style>
