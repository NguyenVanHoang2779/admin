<template>
  <div>
    <b-modal
      v-model="openModal"
      :title="`Tạo và quản lý thẻ phân loại`"
      :header-class="'text-center justify-content-center d-flex'"
      static
      scrollable
      hide-footer
      @hidden="close()"
      @show="onShow()">

      <div class="col-md-12 form">

        <b-form @submit="onSubmit">

          <div class="form-group">
            <vue-simple-suggest
              id="tag_suggest"
              v-model="selected_tag"
              :mode="'select'"
              :list="suggest_tags"
              :max-suggestions="10"
              :min-length="2"
              :display-attribute="'name'"
              :value-attribute="'id'"
              :filter-by-query="true"
              :styles="suggestStyle"
              @input="onInputChanged"
              @suggestion-click="onSuggestClick"
              @select="onSuggestSelect"
              ref="suggestTag"
              placeholder="Nhập tên tag mới">
              <input class="form-control" placeholder="Nhập tên tag mới" required>
              <b-input-group-append>
                <b-button variant="outline-success" name='btn-modal-save-tag' id='btn-modal-save-tag' :disabled="!selected_tag" @click="onSubmit">
                  <i class="fa fa-save"></i>
                </b-button>
              </b-input-group-append>
            </vue-simple-suggest>

            <div class="position-relative mih-5re" v-loading="loading">
              <b-list-group v-if="user">
                <b-list-group-item class="d-flex align-items-center mb-2" v-for="(tag, idx) in user.tags || []" :key="idx">
                  <span class="mr-auto" :id="'tag_'+tag.id">{{ tag.name }}</span>

                  <b-button
                    v-if="attachPermission"
                    class="add-tag"
                    variant="outline-warning"
                    size="sm"
                    @click="onDetachTag(tag)">
                    <i class="fa fa-minus-square"></i>
                  </b-button>

                  <b-button
                    v-if="deletePermission"
                    variant="outline-danger"
                    size="sm"
                    @click="onDeteleTag(tag)">
                    <i class="fa fa-trash"></i>
                  </b-button>
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
import newStaffService from 'domain/services/new-staff.service'
import commonHelper from 'infrastructures/helpers/common-helpers'

import VueSimpleSuggest from '@/vendor/libs/vue-simple-suggest'
// import '@/vendor/libs/vue-simple-suggest/styles.css' // Optional CSS

export default {
  components: {
    VueSimpleSuggest
  },

  props: {
    open: {
      default: false
    },
    options: {
      default: {}
    },
    user: {
      default: null
    },
    canAccess: {
      type: Boolean,
      default: false
    },
    attachPermission: {
      type: Boolean,
      default: true
    },
    deletePermission: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      openModal: false,
      loading: false,
      suggest_tags: null,
      selected_tag: null,
      checkInput: true,
      suggestStyle: {
        vueSimpleSuggest: 'position-relative',
        inputWrapper: 'input-group mb-3',
        defaultInput: 'form-control'
        // suggestions: 'position-absolute list-group z-1000',
        // suggestItem: 'list-group-item'
      }
    }
  },

  watch: {
    open (v) {
      this.openModal = v
    },
    canAccess (v) {
      if (v) {
        this.getTags()
      }
    }
  },

  methods: {
    close () {
      this.openModal = false
      this.selected_tag = null
      this.$refs.suggestTag.setText(null)
      this.$refs.suggestTag.select(null)
      this.$emit('onCloseModal', 'tagModal')
    },

    onShow () {
      if (!this.user.tags) {
        this.getUserTags()
      }
    },

    onInputChanged (text) {
      if (this.checkInput) {
        this.selected_tag = text
      }
      this.$refs.suggestTag.input.focus()
      this.checkInput = true
    },

    onSuggestClick (suggest, e) {
      this.checkInput = false
    },

    onSuggestSelect (suggest) {
      this.selected_tag = suggest
    },

    async onSubmit (e) {
      if (!this.selected_tag) {
        return
      }

      e.preventDefault()
      try {
        this.loading = true
        let res
        let isAttach = Object(this.selected_tag).hasOwnProperty('id')
        if (!isAttach) {
          const isExits = this.suggest_tags.find(tag => tag.name.toString().toLowerCase().trim() === this.selected_tag.toString().toLowerCase().trim())
          if (isExits) {
            isAttach = true
            this.selected_tag = isExits
          }
        }

        if (isAttach) {
          // attach tag for user
          if (this.user.tags.find(tag => tag.id === this.selected_tag.id)) {
            return
          }
          res = await newStaffService.attachTag({
            tag_id: this.selected_tag.id,
            user_id: this.user.id
          })
        } else {
          this.selected_tag = this.selected_tag.toString().trim()
          this.selected_tag = this.selected_tag.charAt(0).toUpperCase() + this.selected_tag.slice(1)
          res = await newStaffService.createTag({
            tag_name: this.selected_tag,
            user_id: this.user.id
          })
        }

        const {success, message, data} = res.data

        if (success) {
          this.user.tags.push(data)
          if (!isAttach) {
            await this.getTags()
          }
        } else {
          commonHelper.showMessage(message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'error')
      } finally {
        this.$refs.suggestTag.setText(null)
        this.$refs.suggestTag.select(null)
        this.loading = false
      }
    },

    async onDetachTag (tag) {
      try {
        if (confirm('Bạn có chắc muốn gỡ tag ' + tag.name + ' ?')) {
          this.loading = true

          const res = await newStaffService.detachTag({
            user_id: this.user.id,
            tag_id: tag.id
          })
          const {success, message} = res.data
          if (success) {
            this.user.tags = this.user.tags.filter(item => item.id !== tag.id)
          } else {
            commonHelper.showMessage(message, 'warning')
          }
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'error')
      } finally {
        this.loading = false
      }
    },

    async onDeteleTag (tag) {
      try {
        if (confirm('Bạn có chắc muốn xóa tag ' + tag.name + ' ?')) {
          this.loading = true
          const res = await newStaffService.deleteTag({tag_id: tag.id})
          const {success, message} = res.data
          if (success) {
            this.user.tags = this.user.tags.filter(item => item.id !== tag.id)
            this.suggest_tags = this.suggest_tags.filter(item => item.id !== tag.id)
          } else {
            commonHelper.showMessage(message, 'warning')
          }
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'error')
      } finally {
        this.loading = false
      }
    },

    async getUserTags () {
      try {
        this.loading = true
        const res = await newStaffService.getUserTags({user_ids: [this.user.id]})
        const {success, message, data} = res.data
        if (success) {
          this.user.tags = data[this.user.id] || []
        } else {
          commonHelper.showMessage(message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'error')
      } finally {
        this.loading = false
      }
    },

    async getTags () {
      try {
        const res = await newStaffService.getTags()
        const {success, message, data} = res.data
        if (success) {
          this.suggest_tags = data
        } else {
          commonHelper.showMessage(message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'error')
      }
    }

  }
}
</script>

<style lang="scss" scoped>

$ghtk-color: #069255;
$ghtk-color-focus: #037a46;

.add-tag {
  margin: 0 10px;
}

.vue-simple-suggest /deep/ > ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.vue-simple-suggest.designed {
  position: relative;
}

.vue-simple-suggest.designed, .vue-simple-suggest.designed * {
  box-sizing: border-box;
}

.vue-simple-suggest.designed .input-wrapper input {
  width: auto !important;
}

.vue-simple-suggest.designed /deep/ .suggestions {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  top: calc(100% + 5px);
  border-radius: 3px;
  border: 1px solid #aaa;
  background-color: #fff;
  opacity: 1;
  z-index: 1000;
}

.vue-simple-suggest.designed /deep/ .suggestions .suggest-item {
  cursor: pointer;
  user-select: none;
}

.vue-simple-suggest.designed /deep/ .suggestions .suggest-item,
.vue-simple-suggest.designed /deep/ .suggestions .misc-item {
  padding: 5px 10px;
}

.vue-simple-suggest.designed /deep/ .suggestions .suggest-item.hover {
  background-color: $ghtk-color !important;
  color: #fff !important;
}

.vue-simple-suggest.designed /deep/ .suggestions .suggest-item.selected {
  background-color: $ghtk-color-focus;
  color: #fff;
}

</style>
