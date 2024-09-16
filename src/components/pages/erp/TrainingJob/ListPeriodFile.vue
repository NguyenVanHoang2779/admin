<template>
  <div class="profile-document">
    <template v-for="(period, idx) in periods || []">
      <div
        :key="period.ErpTpClassPeriod.id"
        class="profile-document__element"
        v-if="period.num_file > 0"
        :class="'file-' + idx && period.num_file > idx ? 'mr-1' : ''"
        @click="showPeriodFile(period)"
      >
        <div class="document-type-desc">
          Tài liệu buổi {{ period.ErpTpPeriod.order_number }}
        </div>
        <div
          class="num-img-extend"
          v-show="period.num_file > 1"
        >
          +{{ period.num_file - 1 }}
        </div>
        <span>
          <img
            class="image-document"
            :src="imageUrlRender()"
            :alt="'Tài liệu buổi '+ period.ErpTpPeriod.order_number"
          />
        </span>
      </div>
    </template>
    <ModalEditPeriodFile :period="curPeriod" :id="modalEditPeriodFileId"/>
  </div>
</template>

<style scoped>
  .profile-document {
    max-height: 134px !important;
    white-space: nowrap;
  }
  .image-document {
    width: 100%;
    height: 120px;
    display: inline-block;
    vertical-align: middle;
    object-fit: cover;
  }
  .profile-document__element {
    width: 23%;
    position: relative;
    height: 99%;
    display: inline-block;
    cursor: pointer;
    margin-left: 5px;
  }
  .document-type-desc {
    text-align: center;
    font-size: 12px;
    color: white;
    background-color: rgba(0, 0, 0, 0.64);
    width: 100%;
    position: absolute;
    bottom: 0;
    pointer-events: none;
    padding: 3px;
  }
  .num-img-extend {
    pointer-events: none;
    text-align: center;
    font-size: unset;
    color: white;
    background-color: rgba(0, 0, 0, 0.47);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media only screen and (max-width: 1280px) {
    .image-document {
      font-size: 0.4em;
      width: 100%;
    }
    .document-type-desc {
      width: 100%;
      font-size: 0.4em;
    }
    .num-img-extend {
      width: 100%;
    }
  }
</style>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'
import linkDefault from '@/const/linkDefault'

import ModalEditPeriodFile from './ModalEditPeriodFile.vue'

export default {
  name: 'list-period-file',

  components: {
    ModalEditPeriodFile
  },

  props: {
    periods: {
      type: Array,
      default: _ => ([])
    }
  },

  data: _ => ({
    curPeriod: null
  }),

  computed: {
    helper: function () {
      return helper
    },

    modalEditPeriodFileId () {
      return 'modal-edit-period-file-' + Math.random()
    }
  },

  methods: {

    getFirstFile (period) {
      let firstFile = period.file && period.file[0]
      if (firstFile) {
        return firstFile
      } else {
        return null
      }
    },

    // show hình ảnh, nếu là file pdf, mp4 then open link, nếu là file docx then download
    showPeriodFile (period) {
      console.log(period)
      this.curPeriod = period
      this.$bvModal.show(this.modalEditPeriodFileId)
    },

    imageUrlRender () {
      return linkDefault.DEFAULT_THUMBNAIL
    }
  }

}
</script>
