<template>
  <div>
    <b-modal
      @hidden="close()"
      :title="`Tạo và quản lý thẻ phân loại`"
      id='candidate-tag-modal'
      scrollable
      @shown="getTags"
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
              <b-button variant="outline-success" id='hr-tag-modal-btn-save' name='hr-tag-modal-btn-save' @click="createTag"><i class="fa fa-save"></i></b-button>
            </b-input-group-append>
          </b-input-group>
          <div v-if="globalTags">
            <b-list-group>
              <b-list-group-item class="d-flex align-items-center" v-for="(tag, index) in globalTags" :key="index">
                <span class="mr-auto">{{ tag.name }}</span>
                <b-button
                  v-if="recordId && !tag.attached"
                  class="add-tag"
                  variant="outline-success"
                  @click="attachTag(tag)">
                  <i class="fa fa-tag"></i>
                </b-button>
                <b-button
                  v-if="canManageGlobalTags()"
                  variant="outline-danger"
                  @click="deleteTag(tag)"
                >
                  <i class="fa fa-trash"></i>
                </b-button>
              </b-list-group-item>
            </b-list-group>
          </div>
        </div>
        <b-form>
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
                <b-button variant="outline-success" id='hr-tag-modal-btn-save' name='hr-tag-modal-btn-save' @click="createTag"><i class="fa fa-save"></i></b-button>
              </b-input-group-append>
            </b-input-group>
            <div>
              <b-list-group>
                <b-list-group-item class="d-flex align-items-center" v-for="(tag, index) in personalTags" :key="index">
                  <span class="mr-auto">{{ tag.name }}</span>
                  <b-button
                    v-if="recordId && !tag.attached"
                    class="add-tag"
                    variant="outline-success"
                    @click="attachTag(tag)">
                    <i class="fa fa-tag"></i>
                  </b-button>
                  <b-button variant="outline-danger" @click="deleteTag(tag)"><i class="fa fa-trash"></i></b-button>
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
import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'CandidateTagModal',
  props: {
    recordId: {
      default: null
    },

    tagsCandidate: {
      default: null
    },

    attachPermission: {
      type: Boolean,
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
      personalTags: [],
      globalTags: [],
      loading: false,
      tag: '',
      tagGlobal: ''
    }
  },
  methods: {
    async getTags () {
      this.tag = ''
      this.loading = true
      try {
        let params = {}
        const {data} = await recruitmentService.getTags(params)
        if (data.success) {
          this.globalTags = data.data.tag_global ? this.convertObjectToArray(data.data.tag_global) : []
          this.personalTags = data.data.tag_personal ? this.convertObjectToArray(data.data.tag_personal) : []
          let tagIdsCandidate = []
          if (this.tagsCandidate) {
            tagIdsCandidate = this.tagsCandidate.map(function (tag) {
              return tag.tag_id
            })
          }
          if (this.globalTags) {
            this.globalTags = this.globalTags.map(function (tag) {
              if (tagIdsCandidate.includes(tag.id)) {
                return {
                  id: tag.id,
                  name: tag.name,
                  attached: true
                }
              }
              return {
                id: tag.id,
                name: tag.name,
                attached: false
              }
            })
          }

          if (this.personalTags) {
            this.personalTags = this.personalTags.map(function (tag) {
              if (tagIdsCandidate.includes(tag.id)) {
                return {
                  id: tag.id,
                  name: tag.name,
                  attached: true
                }
              }
              return {
                id: tag.id,
                name: tag.name,
                attached: false
              }
            })
          }
        } else {
          commonHelper.showMessage(data.message || 'Không thuộc vùng quản lý !', 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    convertObjectToArray (object) {
      return Object.keys(object).map(function (key) {
        return object[key]
      })
    },

    close () {
      this.resetData()
      this.$bvModal.hide('candidate-tag-modal')
    },

    resetData () {
      this.personalTags = []
      this.globalTags = []
    },

    canManageGlobalTags () {
      return (this.permissions && this.permissions.manageGlobalTag)
    },

    async createTag (e, type) {
      if (this.tag.length > 20) {
        commonHelper.showMessage('Độ dài tag cần nhỏ hơn 20 kí tứ', 'warning')
        return
      }
      e.preventDefault()
      try {
        let params = {
          name: this.tag,
          type: type
        }
        const {data} = await recruitmentService.createTag(params)
        if (data.success) {
          this.getTags()
          commonHelper.showMessage(data.message, 'success')
        } else {
          commonHelper.showMessage(data.message || 'Không thuộc vùng quản lý !', 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
      }
    },

    async deleteTag (tag) {
      try {
        if (confirm('Bạn có chắc muốn xóa tag ' + tag.name + ' ?')) {
          const data = await recruitmentService.deleteTag({
            tag_id: tag.id
          })
          if (data.data.success) {
            commonHelper.showMessage(data.data.message, 'success')
            this.getTags()
          } else {
            commonHelper.showMessage(data.data.message, 'warning')
          }
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
      }
    },

    async attachTag (tag) {
      try {
        this.loading = true

        const response = await recruitmentService.attachTag({
          tag_id: tag.id,
          candidate_id: this.recordId
        })

        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.$emit('attach', {
            candidate_id: this.recordId,
            tag_id: tag.id,
            tag_name: tag.name,
            tag_type: tag.type
          })
          this.$bvModal.hide('candidate-tag-modal')
        } else {
          commonHelper.showMessage(response.data.message || 'Không gắn được tag', 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add-tag {
  margin: 0 10px;
}
</style>
