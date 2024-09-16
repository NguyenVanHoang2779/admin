<template>
  <b-modal
    v-loading="loading"
    class="modal-lg"
    v-model="openModal"
    :title="typeModal === 'Add' ? 'Thêm chủ đề và tag': 'Sửa danh mục và tag'"
    modal-class="modal-custom"
    :header-class="'text-center justify-content-center d-flex'"
    centered
    static
    id="modal-topic"
    hide-footer
    @show="onShow()"
    @hide="onClose()">
    <div class="modal-topic">
        <div class="topic-cus row mt-2 mx-4 div-reset">
          <label class="col-md-2 mt-2 text-left pl-0 text-black">Chủ đề<span class="text-danger ml-1">*</span></label>
          <b-form-input
            placeholder="Nhập nội dung chủ đề"
            class="rounded col-md-10"
            size="xs"
            type="text"
            v-model="params.subject_name"
          />
          <span v-if="params.subject_name" class="span-reset" @click="resetData('name')"><i class="ion ion-md-close"></i></span>
        </div>
      <div class="topic-cus row mt-2 mx-4" :class="departmentIds ? 'div-reset' : ''">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">
          Bộ phận
          <span class="text-danger ml-1">*</span>
        </label>
        <multi-select-department
          :custom-class="typeModal === 'Edit' ? 'col-md-10 p-0 multiselect-ghtk multiselect-no-horizontal cus-x': 'col-md-10 p-0 multiselect-ghtk multiselect-no-horizontal'"
          :auto-close="true"
          :is-multiple="true"
          :placeholder="'Chọn bộ phận'"
          :disabled="typeModal === 'Edit'"
          :department-ids="departmentIds"
          @handleDepartmentSelected="handleDepartmentSelected">
        </multi-select-department>
        <span v-if="typeModal !== 'Edit' && departmentIds" class="span-reset" @click="resetData('department')"><i class="ion ion-md-close"></i></span>
      </div>
      <div class="topic-cus row mt-2 mx-4" :class="params.position_ids.length > 0 ? 'div-reset' : ''">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">
          Vị trí
          <span class="text-danger ml-1">*</span>
        </label>
        <multi-select-position-v2
          ref="reset"
          :class="typeModal === 'Edit' ? 'col-md-10 p-0 multiselect-ghtk multiselect-no-horizontal cus-x' : 'col-md-10 p-0 multiselect-ghtk multiselect-no-horizontal'"
          :is-multiple="true"
          :position-ids="positionIds"
          :department-ids="departmentIds"
          :auto-close="true"
          :hide-selected="true"
          :disabled="typeModal === 'Edit' || !departmentIds"
          :placeholder="!departmentIds ? 'Vui lòng chọn bộ phận trước khi chọn vị trí' : 'Chọn vị trí'"
          @handlePositionSelected="handlePositionSelected"/>
        <span v-if="typeModal !== 'Edit' && params.position_ids.length > 0" class="span-reset" @click="resetData('position')"><i class="ion ion-md-close"></i></span>
      </div>
      <div class="topic-cus row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">
          Loại
          <span class="text-danger ml-1">*</span>
        </label>
        <b-form-radio-group
          v-model="typeCheckbox"
          :options="optionsType"
          class="col-md-10 p-0 mt-2 radio-cus"
          value-field="id"
          text-field="name"
          disabled-field="notEnabled"
        ></b-form-radio-group>
      </div>
      <div class="topic-cus row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 pt-3 text-black">
          Danh mục
          <span class="text-danger ml-1">*</span>
        </label>
        <div class="col-md-10 p-0 mt-2" :class="list_category_choice.length > 4 ? 'cus-scroll' : ''">
          <div class="d-flex mb-2" v-for="(c, idx) in list_category_choice" :key="idx">
            <div class="col-md-11 p-0 justify-content-between">
              <div class="p-0" :class="c.tags.length > 0 ? 'input-category-cus' : 'input-category'">
                <b-form-input
                  placeholder="Nhập danh mục"
                  class="rounded"
                  size="xs"
                  type="text"
                  v-model="c.name"
                />
                <div class="add-list-tag">
                  <span class="span-tag"
                        :style="(tag.type === 'bad')? 'background-color:#FD0000 ': 'background-color: #00904A;'"
                        v-for="(tag, idT) in c.tags || []" :id="idT"
                        @mouseover="toggleShowItemClose(tag.id, true)"
                        @mouseleave="toggleShowItemClose(tag.id, false)"
                  >
                    <span :id="'modal_topic_'+tag.id" @click="deleteTag(idx, idT)" class="close-cus"><i class="ion ion-md-close" aria-hidden="true"></i></span>
                    # {{tag.name}}</span>
                  <span class="span-add" @click="openTagModal('TagModal', 'AddTag', {category: c, from: 'fromTopic', type: typeCheckbox, indexCategory: idx})"><i class="ion ion-ios-add"></i>Tag</span>
                </div>
              </div>
            </div>
            <div class="p-0 cusIcon-trash" style="position: relative">
              <span style="cursor: pointer;" @click="deleteCategory(idx, typeModal, c.category_id, c.name)">
                <svg class="cus-svg" width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.52386 6.54961V19.2436C1.52386 19.9939 1.79898 20.6985 2.27958 21.204C2.75797 21.711 3.42374 21.9988 4.12049 22H13.8686C14.5656 21.9988 15.2313 21.711 15.7095 21.204C16.1901 20.6985 16.4653 19.9939 16.4653 19.2436V6.54961C17.4206 6.29603 18.0397 5.37306 17.9119 4.39273C17.7839 3.4126 16.9489 2.67942 15.9603 2.67922H13.3224V2.03519C13.3254 1.4936 13.1113 0.973553 12.7279 0.590962C12.3445 0.208571 11.8236 -0.00435998 11.2821 6.76958e-05H6.70706C6.16547 -0.00435998 5.64462 0.208571 5.26122 0.590962C4.87783 0.973553 4.66369 1.4936 4.66671 2.03519V2.67922H2.02881C1.04023 2.67942 0.205215 3.4126 0.0772145 4.39273C-0.0505843 5.37306 0.568486 6.29603 1.52386 6.54961ZM13.8686 20.9696H4.12049C3.23958 20.9696 2.5543 20.2128 2.5543 19.2436V6.59489H15.4348V19.2436C15.4348 20.2128 14.7495 20.9696 13.8686 20.9696ZM5.69715 2.03519C5.69373 1.76691 5.79918 1.5087 5.98957 1.31931C6.17976 1.12993 6.43858 1.02588 6.70706 1.03051H11.2821C11.5505 1.02588 11.8094 1.12993 11.9995 1.31931C12.1899 1.5085 12.2954 1.76691 12.292 2.03519V2.67922H5.69715V2.03519ZM2.02881 3.70966H15.9603C16.4725 3.70966 16.8877 4.12485 16.8877 4.63705C16.8877 5.14926 16.4725 5.56445 15.9603 5.56445H2.02881C1.51661 5.56445 1.10142 5.14926 1.10142 4.63705C1.10142 4.12485 1.51661 3.70966 2.02881 3.70966Z" fill="#EA0505" fill-opacity="0.8"/>
              </svg>
              <span class="vector-cus">|||</span>
              </span>
            </div>
          </div>
          <div class="d-flex" v-if="typeModal !== 'Edit'">
            <div class="col-md-11 p-0 justify-content-between">
              <button class="btn btn-outline-ghtk rounded btn-sm btn-add-category"
                      @click="AddTopic()"><span class=""><i class="ion ion-ios-add"></i> Danh mục</span></button>
            </div>
            <div class="p-0 cusIcon-trash">
              <i class='fas fa-times-circle i-trash' style='color: #ffffff !important;'></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center mb-2">
      <b-btn variant="ghtk" id='btn-save-add-note' name='btn-save-add-note' class="button-deny-modal btn-save" @click="onSave()">Xác nhận</b-btn>
    </div>
  </b-modal>
</template>
<style lang="scss" scoped>
::placeholder {
  color: #828282;
}
.button-close-modal-contact {
  border-radius: 5px;
  padding: 5px 30px;
}
.button-deny-modal {
  width: 100px;
  border-radius: 5px;
  padding: 5px 0px;
}

/deep/ .modal-header {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

/deep/ #modal-topic {
  padding-left: 0 !important;
}

.cus-scroll {
  max-height: 52vh;
  overflow-y: scroll;
}

.modal-topic {
  padding: 20px;
  font-size: 16px;
  color: #000;
}
.btn-save {
  width: 58%;
  margin-left: 4.3rem;
  margin-bottom: 0.8rem;
}
.btn-add-category {
  width: 100%;
  height: 37px;
  margin-top: 0.6%;
  font-size: 15px !important;
  font-weight: 500;
  color: inherit;
  border-radius: 10px !important;
  cursor: pointer;

}
.topic-cus {
  label {
    font-weight: 500;
    font-size: 15px;
    span {
      color: #EA0505;
    }
  }
  /deep/ input, /deep/ .multiselect__tags {
    border-radius: 10px !important;
  }
}
/deep/ .custom-control {
  margin-right: 4rem !important;
}
/deep/ .close {
  font-size: 1.5rem;
}

.cus-x /deep/ .multiselect__tag-icon {
  display: none;
}

.input-category{
  width: 100%;
  font-size: 14px !important;
  padding: 10px 6px !important;
  background-color: #FFFFFF !important;
  border: 1px solid #00904A !important;
  border-radius: 10px;
}
.input-category-cus {
  width: 100%;
  font-size: 14px !important;
  padding: 10px 6px !important;
  background-color: #EDF9EF;
  border-radius: 10px;
}
.cusIcon-trash {
  margin-left:1.5%;
  .i-trash{
    font-size: 18px;
    margin-left: 0.8rem;
    color: red;
    margin-top: 1rem;
    cursor: pointer;
  }
  .cus-svg {
    margin-left: 0.6rem;
    margin-top: 0.8rem;
    cursor: pointer;
  }
  .vector-cus{
  color: red;
  position: absolute;
  top: 1.02rem;
  right: 0.26rem;
  font-size: 13px;
  }
}
.add-list-tag {
  flex-wrap: wrap;
  font-size: 12px;
  padding-top: 11px;
  margin-left: 0.4rem;
  display: flex;
  .span-tag {
    margin-bottom: 0.3rem;
    color: #FFFFFF;
    padding: 5px;
    margin-right: 0.45rem;
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
  .span-add {
    color: #00904A;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
    margin-left: 0.6rem;
    margin-top: 0.3rem;
  }
}
.div-reset {
  position: relative;
  .span-reset {
    position: absolute;
    font-size: 0.7rem;
    top: 11px;
    right: 17px;
    cursor: pointer;
    color: #837a7a;
  }
  /deep/ .multiselect__select {
    display:  none;
  }
}
</style>

<script>

// helper
import commonHelper from 'infrastructures/helpers/common-helpers'

// service
import ManageTagService from 'domain/services/manage-tags-service'

import MultiSelectPositionV2 from './MultiSelectPositionV2'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'

export default {
  name: 'TopicModal',
  components: {
    MultiSelectDepartment,
    MultiSelectPositionV2
  },

  props: {
    open: {
      default: false
    },
    typeModal: {
      default: 'Add'
    },
    dataModal: {
      default: null
    },
    dataUpdateTopic: {
      default: null
    },
    funcCallback: null
  },

  data: _ => ({
    loading: false,
    openModal: false,
    category: '',
    typeCheckbox: 1,
    subjectId: null,
    departmentIds: null,
    positionIds: null,
    optionsType: [
      {
        id: 1,
        name: 'Cá nhân',
        type: 'individual'
      },
      {
        id: 2,
        name: 'Gia đình',
        type: 'family'
      },
      {
        id: 3,
        name: 'Công việc',
        type: 'work'
      }
    ],
    params: {
      subject_name: null,
      position_ids: [],
      categories: [
      ]
    },
    categoryType: {
      family: [],
      individual: [],
      work: []
    },
    list_category_choice: [],
    showTagModal: false,
    idIndividualRandom: 1,
    idFamilyRandom: 1,
    idWorkRandom: 1,
    listTagBefore: []
  }),
  created () {
    this.list_category_choice = this.categoryType.individual
  },

  watch: {
    open (v) {
      this.openModal = v
      if (this.typeModal === 'Edit' && this.dataModal) {
        this.optionsType = [{id: 1, name: 'Cá nhân', type: 'individual'}, {id: 2, name: 'Gia đình', type: 'family'}, {id: 3, name: 'Công việc', type: 'work'}]
        this.setDataModalTopic()
      } else {
        this.resetDataModal()
      }
    },
    typeCheckbox (newVal, oldVal) {
      if (+this.typeCheckbox === 1) {
        // 1 = Loại cá nhân
        this.list_category_choice = this.categoryType.individual
      } else if (+this.typeCheckbox === 2) {
        // 2 = Cá nhân
        this.list_category_choice = this.categoryType.family
      } else {
        // 3 = Gia đình
        this.list_category_choice = this.categoryType.work
      }
    },
    dataUpdateTopic (newVal, oldVal) {
      let indexCategory = this.dataUpdateTopic.indexCategory
      let dataTag = this.dataUpdateTopic.listTag.map((item) => item.tags)

      if (+this.dataUpdateTopic.type === 1) {
        this.categoryType.individual[indexCategory].tags = dataTag
      } else if (+this.dataUpdateTopic.type === 2) {
        this.categoryType.family[indexCategory].tags = dataTag
      } else {
        this.categoryType.work[indexCategory].tags = dataTag
      }
    }
  },

  methods: {
    onShow () {

    },

    toggleShowItemClose (idItem, status) {
      idItem = 'modal_topic_' + idItem
      if (status) {
        document.getElementById(idItem).style.display = 'inline-block'
      } else {
        document.getElementById(idItem).style.display = 'none'
      }
    },

    // indexTag: chỉ số vị trí của tag , idTag: id của tag trong DB
    deleteTag (indexCategory, indexTag, idTag) {
      this.list_category_choice[indexCategory].tags.splice(indexTag, 1)
    },

    resetDataModal () {
      this.params.subject_name = null
      this.departmentIds = null
      this.subjectId = null
      this.positionIds = null
      this.typeCheckbox = 1
      this.params.categories = []
      this.categoryType.family = []
      this.categoryType.individual = []
      this.categoryType.work = []
      this.list_category_choice = this.categoryType.individual
      this.optionsType = [{id: 1, name: 'Cá nhân', type: 'individual'}, {id: 2, name: 'Gia đình', type: 'family'}, {id: 3, name: 'Công việc', type: 'work'}]
    },

    setDataModalTopic () {
      this.params.subject_name = this.dataModal.subjectName
      this.departmentIds = String(this.dataModal.departmentId)
      this.subjectId = this.dataModal.subjectId
      this.positionIds = String(this.dataModal.positionId)
      this.optionsType = this.optionsType.filter(item => String(item.type) === String(this.dataModal.type))
      let dataCategory = this.dataModal.category
      let dataTagConvert = dataCategory.tags.map(item => { return {id: item.tags.id, name: item.tags.name, type: item.tags.type} })
      let dataConvert = [{category_id: dataCategory.category_id, name: dataCategory.category_name, tags: dataTagConvert, type: this.dataModal.type}]
      this.listTagBefore = dataCategory.tags.map(item => item.tags.id)
      this.categoryType[this.dataModal.type] = dataConvert
      this.typeCheckbox = (this.dataModal.type === 'individual') ? 1 : (this.dataModal.type === 'family' ? 2 : 3)
      this.list_category_choice = this.categoryType[this.dataModal.type]
    },

    onClose () {
      this.openModal = false
      this.$emit('onCloseModal', 'TopicModal')
    },

    async onSave () {
      if (this.typeModal === 'Add') {
        this.AddTopicAndTag()
      } else {
        this.EditTopicAndTag()
      }
    },

    async AddTopicAndTag () {
      if (!this.validateAndConvertData()) { return false }
      try {
        this.loading = true
        const res = await ManageTagService.ApiAddTopicAndTag(this.params)
        if (res.data.success) {
          commonHelper.showMessage('Thêm chủ đề và tag thành công', 'success')
          this.$emit('AddTopicAndTagSuccess')
          this.onClose()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.response.data.message, 'warning')
      } finally {
        this.loading = false
      }
    },

    async EditTopicAndTag () {
      if (this.params.subject_name === null) {
        return commonHelper.showMessage('Thiếu tên chủ đề', 'warning')
      }
      if (this.params.position_ids.length === 0) {
        return commonHelper.showMessage('Thiếu vị trí', 'warning')
      }
      let params = this.convertDataUpdate()
      if (params.subject_name === this.dataModal.subjectName && params.category_name === this.dataModal.category.category_name && params.tags_add.length === 0 && params.tags_remove.length === 0) {
        return commonHelper.showMessage('Vui lòng nhập thay đổi', 'warning')
      }
      try {
        const res = await ManageTagService.ApiUpdateTopicAndTag(params)
        if (res.data.success) {
          commonHelper.showMessage('Cập nhật chủ đề và tag thành công', 'success')
          this.$emit('updateCategorySuccess', {subjectId: this.dataModal.subjectId})
          this.onClose()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.response.data.message, 'warning')
      } finally {
        this.loading = false
      }
    },

    resetData (type) {
      if (type === 'name') {
        this.params.subject_name = null
      }
      if (type === 'department') {
        this.departmentIds = null
      }
      if (type === 'position') {
        this.positionIds = null
        this.$refs.reset.setList()
      }
    },

    convertDataUpdate () {
      let params = {
        subject_name: this.params.subject_name,
        category_id: this.list_category_choice[0].category_id,
        category_name: this.list_category_choice[0].name,
        tags_add: [],
        tags_remove: []
      }
      let dataTags = this.list_category_choice[0].tags
      let listIdTagAfter = this.list_category_choice[0].tags.map(item => item.id)
      dataTags.forEach((item) => {
        if (!this.listTagBefore.includes(item.id)) {
          if (String(item.id).includes('new')) {
            params.tags_add.push({
              name: item.name,
              type: item.type
            })
          }
        }
      })
      params.tags_remove = this.listTagBefore.filter(idBefore => !listIdTagAfter.includes(idBefore))
      return params
    },

    validateAndConvertData () {
      if (this.params.subject_name === null || this.params.subject_name === '') {
        commonHelper.showMessage('Thiếu tên chủ đề', 'warning')
        return false
      }
      if (this.departmentIds === null || this.departmentIds === '') {
        commonHelper.showMessage('Thiếu bộ phận', 'warning')
        return false
      }
      if (this.params.position_ids.length === 0) {
        commonHelper.showMessage('Thiếu vị trí', 'warning')
        return false
      }
      let checkFalse = 0
      let dataTotal = [...this.categoryType.individual, ...this.categoryType.work, ...this.categoryType.family]
      let dataCategories = []
      if (dataTotal.length > 0) {
        // dataTotal.forEach((item) => {
        //   if (item.name == null || item.tags.length === 0) {
        //     let type = item.type === 'work' ? 'công việc' : (item.type === 'family' ? 'gia đình' : 'cá nhân')
        //     commonHelper.showMessage('Vui lòng điền đầy đủ các truờng ở loại ' + type)
        //     checkFalse = 1
        //   }
        //   dataCategories.push({
        //     name: item.name,
        //     type: item.type,
        //     tags: item.tags.map(i => { return {name: i.name, type: i.type} })
        //   })
        // })
        // this.params.categories = dataCategories
        // return true

        for (let i = 0; i < dataTotal.length; i++) {
          let item = dataTotal[i]
          if (item.name == null || item.tags.length === 0) {
            let type = item.type === 'work' ? 'công việc' : (item.type === 'family' ? 'gia đình' : 'cá nhân')
            commonHelper.showMessage('Vui lòng điền đầy đủ các trường ở loại ' + type)
            checkFalse = 1
            break
          }
          dataCategories.push({
            name: item.name,
            type: item.type,
            tags: item.tags.map(i => { return {name: i.name, type: i.type} })
          })
        }
        this.params.categories = dataCategories
      } else {
        this.params.categories = []
      }
      if (checkFalse === 1) {
        return false
      }
      if (this.params.categories.length === 0) {
        commonHelper.showMessage('Thiếu danh mục', 'warning')
        return false
      }
      return true
    },

    handleDepartmentSelected (ops) {
      if (ops !== null) {
        // trường hợp là single select
        if (!Array.isArray(ops)) {
          ops = [ops]
        }
      }
      this.departmentIds = ops ? ops.map(item => item.id).toString() : ''
    },
    handlePositionSelected (ops) {
      if (ops !== null) {
        // trường hợp là single select
        if (!Array.isArray(ops)) {
          ops = [ops]
        }
      }
      this.params.position_ids = ops ? ops.map(item => item.id) : []
    },
    AddTopic () {
      if (+this.typeCheckbox === 1) {
        this.categoryType.individual.push({
          category_id: 'individual_' + this.idIndividualRandom,
          name: null,
          type: 'individual',
          tags: []
        })
        this.idIndividualRandom++
      } else if (+this.typeCheckbox === 2) {
        this.categoryType.family.push({
          category_id: 'family_' + this.idFamilyRandom,
          name: null,
          type: 'family',
          tags: []
        })
        this.idFamilyRandom++
      } else {
        this.categoryType.work.push({
          category_id: 'work_' + this.idWorkRandom,
          name: null,
          type: 'work',
          tags: []
        })
        this.idWorkRandom++
      }
    },
    deleteCategory (idx, type, categoryId, categoryName) {
      if (type === 'Add') {
        if (+this.typeCheckbox === 1) {
          this.categoryType.individual.splice(idx, 1)
        } else if (+this.typeCheckbox === 2) {
          this.categoryType.family.splice(idx, 1)
        } else {
          this.categoryType.work.splice(idx, 1)
        }
      } else {
        if (this.typeModal === 'Edit') {
          if (!this.departmentIds) {
            return commonHelper.showMessage('Thiếu bộ phận')
          }
          if (!this.positionIds) {
            return commonHelper.showMessage('Thiếu vị trí')
          }
          if (!this.subjectId) {
            return commonHelper.showMessage('Thiếu id chủ đề')
          }
        }
        this.$emit('openModalConfirm', {nameModal: 'ConfirmModal', type: 'Confirm', options: {idCategory: categoryId, categoryName: categoryName, subjectId: this.subjectId}})
      }
    },
    openTagModal (nameModal, type, options) {
      this.$emit('openAddTag', {nameModal, type, options})
    }
  }
}
</script>

<style scoped>

</style>
