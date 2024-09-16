<template>
  <div style="width: 100%;">
    <div style="text-align: center; width: 100%; height: 100px; position: relative" v-show="loading">
      <i style="position: absolute; top: 2rem;left: 41rem;" class="fas fa-spinner fa-pulse"></i>
    </div>
    <div class="row wrap-cus" v-show="!loading">
      <div class="col-4 category-container" :class="dataTypeIndividual.length > 8 ? 'category-scroll' : ''">
        <!--      cI = category Individual-->
        <div class="category-content" v-for="(cI, idI) in dataTypeIndividual" :id="idI">
          <div class="category-name-cus">{{cI.categoryName}}</div>
          <div class="list-tag">
            <span class="tag-cus" v-for="(tag, idT) in cI.listTags || []" :id="idT" :style="tag.type === 'good' ? 'background-color: #00904A' : 'background-color: #FD0000'"># {{tag.name}}</span>
            <span class="add-tag" @click="showModal(userId, cI.categoryId, cI.listTags || [], cI.categoryName, 'individual', idI)">
            + Tag
          </span>
          </div>
        </div>
      </div>
      <div class="col-4 category-container category-family" :class="dataTypeFamily.length > 6 ? 'category-scroll' : ''">
        <div class="category-content" v-for="(cF, idF) in dataTypeFamily" :id="idF">
          <div class="category-name-cus">{{cF.categoryName}}</div>
          <div class="list-tag">
            <span class="tag-cus" v-for="(tag, idT) in cF.listTags || []" :id="idT" :style="tag.type === 'good' ? 'background-color: #00904A' : 'background-color: #FD0000'"># {{tag.name}}</span>
            <span class="add-tag" @click="showModal(userId, cF.categoryId, cF.listTags || [], cF.categoryName, 'family', idF)">
            + Tag
          </span>
          </div>
        </div>
      </div>
      <div class="col-4 category-container" :class="dataTypeWork.length > 6 ? 'category-scroll' : ''">
        <div class="category-content" v-for="(cW, idW) in dataTypeWork" :id="idW">
          <div class="category-name-cus">{{cW.categoryName}}</div>
          <div class="list-tag">
            <span class="tag-cus" v-for="(tag, idT) in cW.listTags || []" :id="idT" :style="tag.type === 'good' ? 'background-color: #00904A' : 'background-color: #FD0000'"># {{tag.name}}</span>
            <span class="add-tag" @click="showModal(userId, cW.categoryId, cW.listTags || [], cW.categoryName, 'work', idW)">
            + Tag
          </span>
          </div>
        </div>
      </div>
      <change-tag-modal
        :open="isShowModal"
        :data-modal-tag="dataModal"
        @onCloseModal="closeModal"
        @updateTagSuccess="updateTagSuccess"
      >
      </change-tag-modal>
    </div>
  </div>

</template>

<script>
import commonHelpers from '../../../../../../infrastructures/helpers/common-helpers'
import ChangeTagModal from './ChangeTagModal'
import ManageTagService from 'domain/services/manage-tags-service'
import {mapGetters} from 'vuex'
export default {
  name: 'staffTag',
  props: {
    userId: {
      default: null
    }
  },
  components: {
    ChangeTagModal
  },

  data: _ => ({
    loading: false,
    dataTypeIndividual: [],
    dataTypeWork: [],
    dataTypeFamily: [],
    isShowModal: false,
    dataModal: null

  }),

  created () {
    this.getListCategoryByUser()
  },

  computed: {
    ...mapGetters({
      curInfo: 'userInfo'
    })
  },

  watch: {
  },

  methods: {
    showModal (userId, categoryId, listTags, nameCategory, type, indexCategory) {
      this.dataModal = {
        userId: userId,
        categoryId: categoryId,
        listTagsChoice: listTags,
        nameCategory: nameCategory,
        type: type,
        indexCategory: indexCategory
      }
      this.isShowModal = true
    },

    closeModal () {
      this.isShowModal = false
    },

    updateTagSuccess (options) {
      let {dataModal, dataChoice} = options
      let indexCategory = dataModal.indexCategory
      let type = dataModal.type
      let categoryId = dataModal.categoryId
      if (String(type) === 'individual') {
        if (this.dataTypeIndividual[indexCategory] && +this.dataTypeIndividual[indexCategory].categoryId === +categoryId) {
          this.dataTypeIndividual[indexCategory].listTags = dataChoice
        }
      } else if (String(type) === 'family') {
        if (this.dataTypeFamily[indexCategory] && +this.dataTypeFamily[indexCategory].categoryId === +categoryId) {
          this.dataTypeFamily[indexCategory].listTags = dataChoice
        }
      } else {
        if (this.dataTypeWork[indexCategory] && +this.dataTypeWork[indexCategory].categoryId === +categoryId) {
          this.dataTypeWork[indexCategory].listTags = dataChoice
        }
      }
    },

    async getListCategoryByUser () {
      if (!this.userId) {
        return commonHelpers.showMessage('Thiếu userId', 'warning')
      }
      try {
        this.loading = true
        const res = await ManageTagService.getListCategoryByUser({
          user_id: this.userId
        })
        if (res.data.success) {
          this.dataTypeIndividual = res.data.data.individual
          this.dataTypeFamily = res.data.data.family
          this.dataTypeWork = res.data.data.work
        } else {
          if (res.data.hasOwnProperty('code') && +res.data.code === 1101) {
            return commonHelpers.showMessage('Không có quyền xem danh sách Tag', 'warning')
          }
          return commonHelpers.showMessage(res.data.message, 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrap-cus {
    width: 100%;
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
  .category-container {
    padding-left: 2.8rem;
    .category-content {
      margin-bottom: 0.6rem;
      .category-name-cus {
        font-size: 17.5px;
        color: #4E5155;
        margin-top: -0.4rem;
      }
      .list-tag {
        display: flex;
        flex-wrap: wrap;
        .tag-cus {
          padding: 3px 6px;
          color: white;
          font-size: 14px;
          margin-top: 0.2rem;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
          line-height: 22px;
          height: 1.6rem;
        }
        .add-tag {
          font-size: 15px;
          cursor: pointer;
          color: #00904A;
          line-height: 2.1rem;
        }
      }
    }
  }
  .category-scroll {
    max-height: 50vh;
    overflow-y: scroll;
  }
  .category-scroll::-webkit-scrollbar
  {
    width: 5px;
    background-color: #dddddd;
    border-radius: 10px;
  }

  .category-scroll::-webkit-scrollbar-thumb
  {
    background-color: #b3b2b2;
    border-radius: 10px;
  }
  .category-family {
    border-right: 1px solid #dddddd;
    border-left: 1px solid #dddddd;
  }

</style>
