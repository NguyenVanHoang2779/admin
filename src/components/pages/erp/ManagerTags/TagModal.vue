<template>
  <b-modal
    v-model="openModal"
    :title="'Tạo tag mới'"
    modal-class="modal-custom"
    :header-class="'text-center justify-content-center d-flex'"
    centered
    static
    id="modal-tag"
    hide-footer
    @show="onShow()"
    @hide="onClose()">
    <div class="modal-tag">
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left text-black" style="font-size: 14px; font-weight: 600; line-height: 21px">Thêm tag</label>
        <b-form-input
          class="col-md-9 rounded"
          placeholder="Nhập nội dung tag"
          size="xs"
          type="text"
          v-model="nameTag"
          v-on:keyup.enter="onEnter(nameTag)"
        ></b-form-input>
        <b-button style="margin-left: 0.5rem;" class="col-md-1 p-0" variant="outline-success" name='btn-modal-save-tag' id='btn-modal-save-tag' :disabled="!nameTag" @click="AddTag()">
          <i class="fa fa-save" style="margin: auto"></i>
        </b-button>
      </div>
      <div class="row mt-3 mx-4 checkbox-cus">
          <label class="col-md-2 mt-2 text-left text-black"></label>
          <div class="col-md-4 d-flex p-0">
            <div>
              <checkbox
                @check="isTagGood = $event"
                :created-checked="true"
                :item-two-checked="isTagBad"
                id="idTagGood"
              >
              </checkbox>
            </div>
            <div style="line-height: 21px;">Tag ưu điểm</div>
          </div>
        <div class="col-md-6 d-flex p-0">
          <div>
            <checkbox
              @check="isTagBad = $event"
              :created-checked="false"
              :item-two-checked="isTagGood"
              id="idTagBad"
            >
            </checkbox>
          </div>
          <div style="line-height: 21px;">Tag lưu ý</div>
        </div>
      </div>
      <div class="row mx-4 add-list-tag">
        <label class="col-md-2 mt-2 text-left text-black"></label>
        <div class="col-md-9 p-0" style="font-size: 12px;">
          <span class="span-tag"
                :style="tag.tags.type === 'bad' ? 'background-color:#FD0000 ': 'background-color: #00904A;'"
                v-for="(tag, idT) in listTags || []" :id="idT"
                @mouseover="toggleShowItemClose(tag.tags.id, true)"
                @mouseleave="toggleShowItemClose(tag.tags.id, false)">
            # {{tag.tags.name}} <span :id="'modal_tag_'+tag.tags.id" @click="deleteTag(tag.tags.id, idT)" class="close-cus"><i class="ion ion-md-close" aria-hidden="true"></i></span>
          </span>
        </div>
      </div>
    </div>
    <div class="text-center mb-2">
      <b-btn variant="ghtk" id='btn-save-add-note' name='btn-save-add-note' class="button-deny-modal" @click="onSave()">Xác nhận</b-btn>
    </div>
  </b-modal>
</template>
<style lang="scss" scoped>
::placeholder {
  color: #828282;
}
.col-md-9 {
  max-width: 70% !important;
}
.button-close-modal-contact {
  border-radius: 5px;
  padding: 5px 30px;
}
.button-deny-modal {
  width: 100px;
  border-radius: 5px;
  padding: 5px 0px;
  margin-top: 0.5rem;
}
.add-list-tag {
  flex-wrap: wrap;
  padding-top: 13px;
  display: flex;
  .span-tag {
    margin-bottom: 0.3rem;
    color: #FFFFFF;
    padding: 5px 5px 5px 5px;
    margin-right: 0.45rem;
    display: inline-block;
    position: relative;
    .close-cus {
      position: absolute;
      top: -8px;
      right: -5px;
      cursor: pointer;
      display: none;
      i {
        font-size: 9px;
        padding: 2px 3px 2px 3px;
        background-color: #000000;
        color: white;
        border-radius: 50%;
      }
    }
  }
}
/deep/ .modal-header {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

/deep/ #modal-tag {
  padding-left: 0 !important;
}

/deep/ .close {
  font-size: 1.5rem;
}

.modal-tag {
  font-size: 14px;
  color: #000;
  padding-top: 1rem;
}

.mt-3 {
  margin-top: 0.8rem !important;
}

</style>

<script>

// helper
import commonHelper from 'infrastructures/helpers/common-helpers'
import checkbox from './Checkbox'
import CheckboxCustom from '../Education/CheckboxCustom'
// service
import ManageTagService from 'domain/services/manage-tags-service'

export default {
  name: 'TagModal',

  components: {
    checkbox,
    CheckboxCustom
  },

  props: {
    open: {
      default: false
    },
    dataModalTag: {
      type: Object,
      default: () => {}
    },
    departmentIndex: {
      default: null
    },
    positionIndex: {
      default: null
    },
    typeIndex: {
      default: null
    }
  },

  data () {
    return {
      loading: false,
      openModal: false,
      nameTag: null,
      isTagGood: true,
      isTagBad: false,
      listTags: [],
      tagAdd: [],
      tagRemove: [],
      params: {
        category_id: null,
        tags_add: [],
        tags_remove: []
      },
      idRandom: 1
    }
  },

  watch: {
    open (v) {
      this.openModal = v
      this.listTags = []
      this.nameTag = null
      this.params.category_id = null
      this.params.tags_add = []
      this.params.tags_remove = []
      if (this.dataModalTag) {
        this.setDataModal()
      }
    }
  },

  mounted () {
  },

  methods: {
    onShow () {
    },

    setDataModal () {
      if (this.dataModalTag.category) {
        this.params.category_id = this.dataModalTag.category.category_id
        let data = this.dataModalTag.category.tags
        data.forEach((item) => {
          this.listTags.push({
            category_id: this.dataModalTag.category.category_id || null,
            category_name: this.dataModalTag.category.category_name || null,
            tags: {
              id: item.hasOwnProperty('tags') ? item.tags.id : item.id,
              name: item.hasOwnProperty('tags') ? item.tags.name : item.name,
              type: item.hasOwnProperty('tags') ? item.tags.type : item.type
            }
          })
        })
      }
    },

    onClose () {
      this.openModal = false
      this.$emit('onCloseModal', 'TagModal')
    },

    toggleShowItemClose (idItem, status) {
      idItem = 'modal_tag_' + idItem
      if (status) {
        document.getElementById(idItem).style.display = 'inline-block'
      } else {
        document.getElementById(idItem).style.display = 'none'
      }
    },

    deleteTag (idTag, location) {
      this.listTags.splice(location, 1)
      if (!String(idTag).includes('new')) {
        this.params.tags_remove.push(idTag)
      } else {
        // xoá những tag vừa thêm (chưa có bản ghi trong db)
        this.params.tags_add = this.params.tags_add.filter((item) => item.id !== idTag)
      }
    },

    onEnter (data) {
      if (data) {
        this.AddTag()
      }
    },

    AddTag () {
      this.listTags.push({
        category_id: this.dataModalTag.category.category_id || null,
        category_name: this.dataModalTag.category.category_name || null,
        tags: {
          id: 'new_' + this.idRandom,
          name: this.nameTag,
          type: this.isTagGood ? 'good' : 'bad'
        }
      })
      this.params.tags_add.push({
        id: 'new_' + this.idRandom,
        name: this.nameTag,
        type: this.isTagGood ? 'good' : 'bad'
      })
      this.idRandom++
      this.nameTag = null
    },

    async onSave () {
      // Thêm tag từ modal chủ đề
      if (this.dataModalTag.from === 'fromTopic') {
        this.$emit('updateListTag', {listTag: this.listTags, ...this.dataModalTag})
        this.onClose()
      } else {
        if (this.params.tags_add.length === 0 && this.params.tags_remove.length === 0) {
          return commonHelper.showMessage('Vui lòng thêm tag mới', 'warning')
        }
        // Thêm tag từ màn list
        this.loading = true
        try {
          const res = await ManageTagService.changeTagCategories(this.params)
          if (res.data.success) {
            let dataRes = []
            if (res.data.data.tags_added.length > 0) {
              dataRes = res.data.data.tags_added.map(item => {
                return {
                  category_id: this.dataModalTag.category.category_id || null,
                  category_name: this.dataModalTag.category.category_name || null,
                  tags: {
                    id: item.id,
                    name: item.name,
                    type: item.type
                  }
                }
              })
            }
            this.listTags = [...this.listTags, ...dataRes].filter((item) => !String(item.tags.id).includes('new'))
            this.$emit('updateTagSuccess', {dataModalOld: this.dataModalTag, tags: this.listTags})
            commonHelper.showMessage(res.data.message, 'success')
            this.onClose()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        } catch (e) {
          commonHelper.showMessage(e.response.data.message, 'warning')
        } finally {
          this.loading = false
        }
      }
    }

  }
}
</script>

<style scoped>

</style>
