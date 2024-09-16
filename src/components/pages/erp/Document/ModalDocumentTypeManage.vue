<template>
    <div>
        <b-modal id = "modal-document-type-manage" modal-class="modal-md" ref="typeDocumentsModal" title="Quản lý loại văn bản" @hidden="resetModal" centered hide-footer>
            <b-tabs
              active-nav-item-class="font-weight-bold text-success"
              active-tab-class="font-weight-bold text-success"
              content-class="mt-3"
            >
              <b-tab v-if="permissionDocument.global" title="Văn bản chung" active>
                <div v-if="listDocumentTypes && listDocumentTypes.global && listDocumentTypes.global.length > 0" class="d-flex">
                  <div>
                    <span class="types" v-for="documentType in listDocumentTypes.global" :key="documentType.id">
                      <span class="document-type">
                        <a href="javascript:void(0)" class="position-relative">
                          <i class="ion ion-md-close-circle-outline position-absolute" @click="deleteDocumentType(documentType)"></i>
                          <span>{{documentType.name}}</span>
                        </a>
                      </span>
                    </span>
                  </div>
                </div>
                <div v-else>Không có loại văn bản nào!</div>
                  <div v-if="!formAddDocumentTypeGlobal" class="mt-3"><b-button variant="outline-success" @click="addFormType('global')">+ Thêm loại văn bản chung</b-button></div>
                  <div v-else class="mt-3">
                    <b-row>
                        <b-col md="4">
                            <b-input v-model="documentTypeName" placeholder="Nhập tên loại văn bản" class="only-bottom-border" @keyup.enter="addTagByHr"></b-input>
                        </b-col>
                        <b-col md="4" class="d-flex">
                            <b-button variant="success" @click="addDocumentType('global')" style="padding: 5px"><i class="ion ion-md-save"></i> Lưu loại văn bản</b-button>
                            <i class="ion ion-md-close cancel-attach-type" @click="addFormType('global')"></i>
                        </b-col>
                    </b-row>
                </div>
              </b-tab>
              <b-tab v-if="permissionDocument.legislation" title="Văn bản pháp chế">
                <div v-if="listDocumentTypes && listDocumentTypes.legislation && listDocumentTypes.legislation.length > 0" class="d-flex">
                  <div>
                    <span class="types" v-for="documentType in listDocumentTypes.legislation" :key="documentType.id">
                      <span class="document-type">
                        <a href="javascript:void(0)" class="position-relative">
                          <i class="ion ion-md-close-circle-outline position-absolute" @click="deleteDocumentType(documentType)"></i>
                          <span>{{documentType.name}}</span>
                        </a>
                      </span>
                    </span>
                  </div>
                </div>
                <div v-else>Không có loại văn bản nào!</div>
                  <div v-if="!formAddDocumentTypeLegislation" class="mt-3"><b-button variant="outline-success" @click="addFormType('legislation')">+ Thêm loại văn bản pháp lý</b-button></div>
                  <div v-else class="mt-3">
                    <b-row>
                        <b-col md="4">
                            <b-input v-model="documentTypeName" placeholder="Nhập tên loại văn bản pháp chế" class="only-bottom-border" @keyup.enter="addTagByHr"></b-input>
                        </b-col>
                        <b-col md="4" class="d-flex">
                            <b-button variant="success" @click="addDocumentType('legislation')" style="padding: 5px"><i class="ion ion-md-save"></i> Lưu loại văn bản</b-button>
                            <i class="ion ion-md-close cancel-attach-type" @click="addFormType('legislation')"></i>
                        </b-col>
                    </b-row>
                </div>
              </b-tab>
            </b-tabs>

        </b-modal>
    </div>
</template>
<script>

// service
import documentService from 'domain/services/document-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-document-type-manage',

  props: [
    'permissionDocument'
  ],

  data: () => ({
    documentTypeName: '',
    formAddDocumentTypeGlobal: false,
    formAddDocumentTypeLegislation: false,
    listDocumentTypes: {}
  }),

  created () {
    this.getListDocumentType()
  },

  watch: {
  },

  methods: {
    addFormType: function (type) {
      if (type === 'global') {
        this.formAddDocumentTypeGlobal = !this.formAddDocumentTypeGlobal
      }

      if (type === 'legislation') {
        this.formAddDocumentTypeLegislation = !this.formAddDocumentTypeLegislation
      }
    },

    resetModal: function () {
      this.formAddDocumentTypeGlobal = false
      this.formAddDocumentTypeLegislation = false
    },

    getListDocumentType: function () {
      documentService.getListDocumentType()
        .then(res => {
          if (res.data.success) {
            this.listDocumentTypes = res.data.data
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    addDocumentType: function (type) {
      let data = {
        'name': this.documentTypeName,
        'type': type
      }
      documentService.addDocumentType(data)
        .then(res => {
          if (res.data.success) {
            this.getListDocumentType()
            this.addFormType(type)
            commonHelper.showMessage('Thêm mới loại văn bản thành công', 'success')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    deleteDocumentType: function (documentType) {
      if (!confirm(`Bạn có chắc chắn muốn xóa loại văn bản?`)) return

      let data = {
        'documentTypeId': documentType.id
      }
      documentService.deleteDocumentType(data)
        .then(res => {
          if (res.data.success) {
            this.getListDocumentType()
            commonHelper.showMessage('Xóa loại văn bản thành công', 'success')
          }
        })
        .catch(e => {
          console.log(e)
        })
    }

  }
}
</script>

<style lang="scss" scoped>
    .only-bottom-border {
        border: 0;
        border-bottom: solid 1px;
        border-radius: 0;
        border-bottom-color: #8b949d;
    }

    .cancel-attach-type {
        height: 32px;
        line-height: 32px;
        width: 32px;
        color: #6b778c;
        font-size: 24px;
        justify-content: center;
        align-items: center;
        display: flex;
        cursor: pointer;
    }
    .types a {
      margin-top: 5px;
      float: left;
      position: relative;
      margin-right: 20px;
      width: auto;
      height: 30px;
      padding: 0 12px;
      line-height: 30px;
      background: #1f8dd6;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      i {
        display: none;
        top: -8px;
        left: -5px;
        color: #6e7a8a;
        background: white;
        border-radius: 16px;
      }
    }

    .types a:before {
      content: "";
      position: absolute;
      top: 0;
      width: 0;
      height: 0;
      border-style: solid;
    }

    .types a:after {
      content: "";
      position: absolute;
      top: 13px;
      width: 4px;
      height: 4px;
      -moz-border-radius: 2px;
      -webkit-border-radius: 2px;
      border-radius: 2px;
      background: #fff;
      -moz-box-shadow: -1px -1px 2px #004977;
      -webkit-box-shadow: -1px -1px 2px #004977;
      box-shadow: -1px -1px 2px #004977;
    }
    /* Add rounded corners to left end of the anchor tag */
    .document-type a {
      -moz-border-radius-bottomleft: 4px;
      -webkit-border-bottom-left-radius: 4px;
      border-bottom-left-radius: 4px;
      -moz-border-radius-topleft: 4px;
      -webkit-border-top-left-radius: 4px;
      border-top-left-radius: 4px;
    }

    /* Position right and show only left border of triangle  */
    .document-type a:before {
      right: -15px;
      border-color: transparent transparent transparent #1f8dd6;
      border-width: 15px 0 15px 15px;
    }

    /* Fix the circle between anchor box and triangle right to it  */
    .document-type a:after {
      right: -2px;
    }

    .types a:hover {
      background: #1d85ca;
      i {
        display: inline;
      }
    }

    .document-type a:hover:before {
      border-color: transparent transparent transparent #1d85ca;
    }
</style>
