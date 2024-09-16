<template>
  <div>
    <b-modal
      class="modal-hr-tag-modal"
      v-model="openModal"
      hide-footer
      @hidden="close()"
      :title="`Tạo và quản lý thẻ phân loại`"
      static
      :header-class="'text-center justify-content-center d-flex'"
      scrollable
      @show="getTags()"
    >
      <div class="col-md-12 form">
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
                <b-button variant="outline-success" name='stop-work-btn-modal-save-tag' id='stop-work-btn-modal-save-tag' @click="onSubmit"><i class="fa fa-save"></i></b-button>
              </b-input-group-append>
            </b-input-group>
            <div class="position-relative mih-5re" v-loading="loading">
              <b-list-group>
                <b-list-group-item class="d-flex align-items-center" v-for="(tag, index) in tagList" :key="index">
                  <span class="mr-auto">{{ tag.name }}</span>
                  <b-button v-if="attachPermission" class="add-tag" variant="outline-ghtk" size="sm" @click="onAttach({
                    hr_tag_id: tag.id,
                    table_name: tag.table_name,
                    record_id: recordId
                  })">
                    <i class="fa fa-tag"></i>
                  </b-button>
                  <b-button variant="outline-danger" size="sm" @click="onDeleteTag(tag)"><i class="fa fa-trash"></i></b-button>
                </b-list-group-item>
              </b-list-group>
            </div>
          </div>
        </b-form>
      </div>
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
    }
  },
  data () {
    return {
      openModal: false,
      loading: false,
      tag: '',
      tagList: []
    }
  },
  created () {
    this.getTags()
  },

  watch: {
    tableName (newVal, oldVal) {
      if (newVal) this.getTags()
      else this.tagList = []
    },
    open (v) {
      this.openModal = v
    }
  },
  methods: {
    close () {
      this.openModal = false
      this.$emit('action', {action: 'closeHrTag'})
      // this.$emit('toggleTagManage', {member: this.member, state: false})
    },
    async onSubmit (e) {
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
          this.tagList.push(data.data.data)
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
            this.tagList = this.tagList.filter(x => {
              return +x.id !== +tag.id
            })
            this.$emit('refresh')
            this.$emit('action', {action: 'refresh', data: {}})
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

        const data = await hrTagService.attach({
          hr_tag_id: tag.hr_tag_id,
          table_name: tag.table_name,
          record_id: tag.record_id
        })

        if (data.data.success) {
          commonHelper.showMessage(data.data.message, 'success')
          let newTag = {
            ...data.data.data,
            record_id: tag.record_id
          }
          let log = data.data.log || null
          this.$emit('action', {action: 'attachTag', data: newTag, log: log})
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
    async getTags () {
      try {
        this.loading = true
        let self = this
        const data = await hrTagService.getList({
          table_name: self.tableName
        })
        if (data.data.success) {
          this.tagList = data.data.data
          this.$emit('refresh')
        } else {
          commonHelper.showMessage(data.data.message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-hr-tag-modal {
  .modal-header {
    padding: 0.7rem !important;
    .close {
      font-size: 1.5rem !important;
    }
  }
  /deep/ .modal {
    .close {
      display: inline-block !important;
    }
  }
}

.add-tag {
  margin: 0 10px;
}
</style>
