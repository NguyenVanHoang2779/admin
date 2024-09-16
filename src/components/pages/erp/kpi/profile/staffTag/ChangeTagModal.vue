<template>
  <b-modal
    v-model="openModal"
    :title="'Gắn tag'"
    modal-class="modal-custom"
    :header-class="'text-center justify-content-center d-flex'"
    centered
    static
    id="modal-tag"
    hide-footer
    @show="onShow()"
    @hide="onClose()">
    <div class="modal-tag" v-show="!loading">
      <div class="header-modal" v-if="listTags.length > 0 || (listTags.length === 0 && isQuickSearch)">
        <p>Vui lòng chọn các tag để gắn đến danh</p>
        <p>mục {{ nameCategory }}</p>

        <div class="search-cus">
          <b-form-input
            class="input-search-cus"
            v-model="dataSearch"
            @input="quickSearch"
            placeholder="Tìm kiếm tag"
          >
          </b-form-input>
          <b-button class="btSearch" @click="quickSearch">
            <i class="ion ion-md-search"></i>
          </b-button>
        </div>
      </div>

      <div class="header-modal" v-if="listTags.length === 0 && isQuickSearch">
        <p>Không tìm thấy kết quả phù hợp !</p>
      </div>

      <div class="header-modal" v-if="listTags.length === 0 && message === '' && !isQuickSearch">
        <p>Danh mục {{ nameCategory }} hiện chưa có tag nào</p>
        <p>Vui lòng tạo tag tại màn quản lý tag</p>
      </div>
      <div class="header-modal" v-if="message">
        <p>Danh mục {{ nameCategory }} {{message.slice(8)}}</p>
        <p>Vui lòng reload lại trang để cập nhật</p>
      </div>
      <div ref="listTagUpdate" :class="listTags.length > 6 ? 'list-tag' : ''">
        <div class="row mt-3 mx-4 checkbox-cus" v-for="(tag) in listTags" :id="'index_' + tag.id" :key="'checkbox_' + tag.id">
          <div class="check-box-tag">
            <CheckboxTag
              @check="changeListTag"
              :created-checked="tag.status"
              :data-tag="tag"
              :id="'tagId_' + tag.id"
            >
            </CheckboxTag>
          </div>
          <div class="name-tag"> <span :style="tag.type === 'good' ? 'background-color: #00904A' : 'background-color: #FD0000'" style="line-height: 21px;"># {{tag.name}}</span></div>
        </div>
      </div>
    </div>
    <div class="text-center mb-2" v-show="!loading">
      <b-btn v-if="listTags.length > 0" :disabled="loadingSave" variant="ghtk" id='btn-save-add-note' name='btn-save-add-note' class="button-deny-modal" @click="onSave()">Xác nhận <i v-show="loadingSave" class="fas fa-spinner fa-pulse"></i></b-btn>
      <b-btn v-if="listTags.length === 0 && message === ''" variant="ghtk" id='btn-close' name='btn-save-add-note' class="button-deny-modal" @click="onClose()">Đóng</b-btn>
      <b-btn v-if="message" variant="ghtk" id='btn-reload' name='btn-save-add-note' class="button-deny-modal" @click="reload()">Tải lại ngay</b-btn>
    </div>
    <div style="text-align: center; width: 100%; height: 222px; position: relative" v-show="loading">
      <i style="position: absolute;top: 6rem;left: 12rem;" class="fas fa-spinner fa-pulse"></i>
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
  width: 155px;
  border-radius: 5px;
  padding: 5px 0px;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
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
  h5 {
    margin-left: 1.3rem;
    font-style: normal;
    font-size: 21px;
    text-align: center;
    color: #FFFFFF;
    font-weight: 400;
  }
}

/deep/ #modal-tag {
  padding-left: 0 !important;
}

/deep/ .close {
  font-size: 1.5rem;
  margin-right: -0.5rem !important;
}

.modal-tag {
  color: #000;
  padding-top: 1rem;
}

.mt-3 {
  margin-top: 0.8rem !important;
}
/deep/ .modal-content {
  width: 70%;
  margin-left: 4.4rem;
}
.modal-tag {
  font-size: 17px;
  .header-modal {
    text-align: center;
    p {
      margin: 0px;
    }
  }
}

.list-tag {
  max-height: 234px;
  overflow-y: scroll;
  width: 98%;
}

.list-tag::-webkit-scrollbar
{
  width: 5px;
  background-color: #dddddd;
  border-radius: 10px;
}

.list-tag::-webkit-scrollbar-thumb
{
  background-color: #b3b2b2;
  border-radius: 10px;
}

.checkbox-cus {
  margin-left: 1rem;
  .check-box-tag {
      margin-left: 2.2rem;
  }
  .name-tag {
    width: 75%;
    margin-left: 0.5rem;
    word-break: break-all;
    span{
      font-size: 14px;
      padding: 4.5px 8px;
      color: white;
    }
  }
}

.search-cus {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  .input-search-cus {
    width: 60%;
    border-bottom-right-radius: 0 !important;
    border-top-right-radius: 0 !important;
    transform: translateY(-7px);
    padding-left: 1rem !important;
  }
  .btSearch {
    margin-left: 0.4rem;
    background-color: #069255;
    transform: translateY(-7px);
  }

}

</style>

<script>

// helper
import commonHelper from 'infrastructures/helpers/common-helpers'
import CheckboxTag from './CheckboxTag'
// service
import ManageTagService from 'domain/services/manage-tags-service'

export default {
  name: 'TagModal',

  components: {
    CheckboxTag
  },

  props: {
    open: {
      default: false
    },
    dataModalTag: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      loading: false,
      loadingSave: false,
      openModal: false,
      listTags: [],
      tagAdd: [],
      tagRemove: [],
      params: {
        user_id: null,
        category_id: null,
        tags_add: [],
        tags_remove: []
      },
      nameCategory: '',
      listTagsChoice: [],
      listIdTagsBefore: [],
      message: '',
      dataSearch: null,
      isQuickSearch: false,
      listTagsBefore: []
    }
  },

  watch: {
    open (v) {
      this.message = ''
      this.openModal = v
      this.listTags = []
      this.params.category_id = null
      this.params.tags_add = []
      this.params.tags_remove = []
      this.listIdTagsBefore = []
      this.listTagsBefore = []
      this.dataSearch = null
      this.isQuickSearch = false
      if (this.dataModalTag && this.openModal) {
        this.setDataModal()
      }
    }
  },

  mounted () {
  },

  methods: {
    onShow () {
    },

    reload () {
      window.location.reload()
    },

    setDataModal () {
      this.params.category_id = this.dataModalTag.categoryId
      this.params.user_id = this.dataModalTag.userId
      this.nameCategory = this.dataModalTag.nameCategory
      this.listTagsChoice = JSON.parse(JSON.stringify(this.dataModalTag.listTagsChoice)) || []
      this.listIdTagsBefore = []
      if (this.dataModalTag.listTagsChoice.length > 0) {
        this.listIdTagsBefore = this.dataModalTag.listTagsChoice.map((item) => (item.id))
      }
      if (this.params.category_id) {
        this.getListTagByCategory()
      } else {
        return commonHelper.showMessage('Thiếu category Id', 'warning')
      }
    },

    onClose () {
      this.openModal = false
      this.dataSearch = null
      this.isQuickSearch = false
      this.$emit('onCloseModal')
    },

    quickSearch () {
      if (this.dataSearch.length > 0) {
        this.listTags = this.listTagsBefore.filter((item) => item.name.toUpperCase().includes(this.dataSearch.toUpperCase()))
        this.isQuickSearch = true
      } else {
        this.listTags = JSON.parse(JSON.stringify(this.listTagsBefore))
      }
    },

    changeListTag ({data, status}) {
      if (status) {
        this.listTagsChoice.push(data)
        // Thêm vào list tag add nếu chưa có trong list tag ban đầu hoặc chưa có trong list tags_add
        if (!this.listIdTagsBefore.includes(+data.id) && !this.params.tags_add.includes(+data.id)) {
          this.params.tags_add.push(+data.id)
        }
        // nếu có trong tags_remove thì loại ra:
        if (this.params.tags_remove.includes(+data.id)) {
          this.params.tags_remove = this.params.tags_remove.filter((item) => +item !== +data.id)
        }
      } else {
        this.listTagsChoice = this.listTagsChoice.filter((item) => +item.id !== +data.id)
        // bỏ 1 tag trong list tag ban đầu (Nhưng chưa có trong list tags_remove)
        if (this.listIdTagsBefore.includes(+data.id) && !this.params.tags_remove.includes(+data.id)) {
          this.params.tags_remove.push(+data.id)
        }
        // nếu có trong tags_add thì loại ra:
        if (this.params.tags_add.includes(+data.id)) {
          this.params.tags_add = this.params.tags_add.filter((item) => +item !== +data.id)
        }
      }

      // check vào các ô trong listTagBefore:
      for (let i = 0; i < this.listTagsBefore.length; i++) {
        if (this.listTagsBefore[i] && +this.listTagsBefore[i].id === +data.id) {
          this.listTagsBefore[i].status = status
          break
        }
      }
    },

    async getListTagByCategory () {
      this.loading = true
      try {
        const res = await ManageTagService.getListTagByCategory({
          category_id: this.params.category_id
        })
        if (res.data.success) {
          this.listTags = this.convertData(res.data.data)
          this.listTagsBefore = JSON.parse(JSON.stringify(this.listTags))
        } else {
          if (res.data.hasOwnProperty('code') && +res.data.code === 1610) {
            this.message = String(res.data.message)
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    async onSave () {
      let params = {
        user_id: +this.params.user_id || null,
        tags_add: this.params.tags_add || [],
        tags_remove: this.params.tags_remove || []
      }

      if (params.tags_add.length === 0 && params.tags_remove.length === 0) {
        return commonHelper.showMessage('Vui lòng thực hiện thao tác thay đổi', 'warning')
      }
      this.loadingSave = true
      try {
        const res = await ManageTagService.apiChangeTagStaffs(params)
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.$emit('updateTagSuccess', {dataModal: this.dataModalTag, dataChoice: this.listTagsChoice})
          this.onClose()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.response.data.message, 'warning')
      } finally {
        this.loadingSave = false
      }
    },

    convertData (data) {
      let listIdTagsChoice = []
      if (this.listTagsChoice.length > 0) {
        listIdTagsChoice = this.listTagsChoice.map(item => item.id)
      }
      let listTags = []
      if (Array.isArray(data)) {
        data.forEach((item) => {
          listTags.push({
            id: item.id,
            name: item.name,
            type: item.type,
            status: listIdTagsChoice.includes(item.id)
          })
        })
      }
      return listTags
    }

  }
}
</script>

<style scoped>

</style>
