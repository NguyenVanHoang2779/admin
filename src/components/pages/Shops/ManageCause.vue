<template>
  <div>
    <div class="ui-block">
      <h4 class="ui-block-heading">Lý do đánh giá</h4>
      <div class="search-form">
        <form>
          <b-form-row>
            <div class="col-md-6">
              <b-form-group label="Nguồn đánh giá">
                <b-form-select v-model="selected.source" :options="optionSources"></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group label="Loại đánh giá">
                <b-form-select v-model="selected.rate" :options="optionRates"></b-form-select>
              </b-form-group>
            </div>
          </b-form-row>
          <b-form-row>
            <div class="col-md-12">
              <b-form-group>
                <div style="text-align: center">
                  <b-btn type="button" variant="success" @click="addModal">
                    <i class="sidenav-icon ion ion-md-add"></i> Thêm lý do
                  </b-btn>
                  <b-btn type="button" variant="primary" @click="searchListCauses(pageData.currentPage, true, false)">
                    <i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
                  </b-btn>
                  <b-btn type="button" @click="getListCause" variant="info">Lấy danh sách</b-btn>
                </div>
              </b-form-group>
            </div>
          </b-form-row>
        </form>
      </div>
      <div class="result" id="results">
        <div class="col-sm text-sm-left text-center pt-3">
          <span class="text-muted" v-if="pageData.totalItems">Tìm thấy {{ pageData.totalItems }} bản ghi</span>
        </div>
        <br/>
        <b-card no-body v-if="listCauses">
          <!-- / Table controls -->
          <div class="table-result" >
            <!-- Table -->
            <div class="table-responsive mb-4">
              <table class="table mb-0 table-bordered">
                <thead style="width: 100%">
                <tr>
                  <th width="80px">Mã lý do</th>
                  <th width="250px">Tên lý do</th>
                  <th width="80px">Phản hồi</th>
                  <th>Nguồn</th>
                  <th>Sao</th>
                  <th>Trạng thái</th>
                  <th>COD ảnh hưởng</th>
                  <th>Loại ảnh hưởng</th>
                  <th>Nhóm</th>
                  <th>Ngày tạo</th>
                  <th width="100px">Hành động</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="dataCause in listCauses">
                  <th scope="row">{{ dataCause.cause_id }}</th>
                  <td>{{ dataCause.cause_name }}</td>
                  <td>{{ dataCause.fbTypeId }}</td>
                  <td>{{ dataCause.cause_source }}</td>
                  <td>{{ dataCause.cause_rate }}</td>
                  <td>{{ dataCause.deleted == 0 ? 'Bật': 'Tắt' }}</td>
                  <td>
                    <span>{{ dataCause.affect_cod_deliver == 1 ? 'COD giao' : '' }}</span>
                    <span>{{ dataCause.affect_cod_pick == 1 ? 'COD lấy' : '' }}</span>
                    <span>{{ dataCause.affect_cod_return == 1 ? 'COD trả' : '' }}</span>
                  </td>
                  <td>{{ dataCause.affect_user }}</td>
                  <td>{{ dataCause.group_review }}</td>
                  <td>{{ moment(dataCause.created).format('DD-MM-YYYY') }}</td>
                  <td>
                    <button id="btnUpdateCause"
                            :cause_id="dataCause.cause_id"
                            :cause_name="dataCause.cause_name"
                            :fbtype_id="dataCause.fbTypeId"
                            :cause_source="dataCause.cause_source"
                            :cause_rate="dataCause.cause_rate"
                            :cause_type="dataCause.cause_type"
                            :deleted="dataCause.deleted"
                            :affect_cod_pick="dataCause.affect_cod_pick"
                            :affect_cod_deliver="dataCause.affect_cod_deliver"
                            :affect_cod_return="dataCause.affect_cod_return"
                            :cause_private="dataCause.cause_private"
                            :affect_user="dataCause.affect_user"
                            :is_chat="dataCause.is_chat"
                            :review_type="dataCause.review_type"
                            :is_review="dataCause.is_review"
                            :group_review="dataCause.group_review"
                            :field_addition="dataCause.field_addition"
                            class="btn btn-primary mb-1"
                            data-style="expand-left"
                            style="width: 100%"
                            @click="showUpdateModal">
                      Cập nhật lý do
                    </button>
                    <button id="btnRemoveCause" :cause_id="dataCause.cause_id" class="btn btn-danger mb-1" data-style="expand-left" style="width: 100%" @click="removeCauses">
                      Xóa lý do
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination -->
            <b-card-body class="pt-0 pb-3">
              <div class="row">
                <div class="col-sm pt-3">
                  <b-pagination
                    :total-rows="pageData.totalItems"
                    v-model="pageData.currentPage"
                    :per-page="pageData.perPage"
                    v-on:change="pageChanged"
                  />
                </div>
                <div class="col-sm text-sm-left text-center pt-3">
                  <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                </div>
              </div>
            </b-card-body>
            <!-- / Pagination -->
          </div>
        </b-card>
        <div class="no-data" v-if="!listCauses">
          Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.
        </div>
      </div>
    </div>
    <b-modal size="lg" id="modal-add-cause" title="Thêm lý do đánh giá" hide-footer v-model="showModal" no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="search-form">
        <form>
          <b-form-row>
            <b-form-group label="Tên lý do" class="col-md-6">
              <b-form-input v-model="selected.nameCause" placeholder="Thêm tên lý do"></b-form-input>
            </b-form-group>
            <b-form-group label="Chọn phản hồi" class="col-md-6">
              <b-form-input v-model="selected.feedbacktypes" :feedbackTypeId="selected.feedbacktypes" placeholder="Thêm phản hồi"></b-form-input>
<!--              <select-feedbacktype @selected="selected.feedbacktypes = $event" :feedbackTypeId="selected.feedbacktypes" placeholder="Chọn phản hồi"></select-feedbacktype>-->
            </b-form-group>
          </b-form-row>
          <b-form-row>
            <b-form-group label="Nguồn đánh giá" class="col-md-4">
              <b-form-select v-model="selected.source" :options="optionSources"></b-form-select>
            </b-form-group>
            <b-form-group label="Type" class="col-md-3">
              <b-form-select v-model="selected.type" :options="optionTypes"></b-form-select>
            </b-form-group>
            <b-form-group label="Loại đánh giá" class="col-md-3">
              <b-form-select v-model="selected.rate" :options="optionRates"></b-form-select>
            </b-form-group>
            <b-form-group label="Trạng thái" class="col-md-2">
              <b-form-checkbox v-model="selected.onOff" value="0" unchecked-value="1" name="on-off-cause" id="on-off-cause">Bật</b-form-checkbox>
            </b-form-group>
          </b-form-row>
          <b-form-row>
            <b-form-group label="Cod lấy" class="col-md-2">
              <b-form-checkbox v-model="selected.affectCodPick" value="1" unchecked-value="0" name="affectCodPick" id="affectCodPick"></b-form-checkbox>
            </b-form-group>
            <b-form-group label="Cod giao" class="col-md-2">
              <b-form-checkbox v-model="selected.affectCodDeliver" value="1" unchecked-value="0" name="affectCodDeliver" id="affectCodDeliver"></b-form-checkbox>
            </b-form-group>
            <b-form-group label="Cod trả" class="col-md-2">
              <b-form-checkbox v-model="selected.affectCodReturn" value="1" unchecked-value="0" name="affectCodReturn" id="affectCodReturn"></b-form-checkbox>
            </b-form-group>
            <b-form-group label="Private" class="col-md-2">
              <b-form-checkbox v-model="selected.isPrivate" value="1" unchecked-value="0" name="isPrivate" id="isPrivate"></b-form-checkbox>
            </b-form-group>
            <b-form-group label="Chat" class="col-md-2">
              <b-form-checkbox v-model="selected.isChat" value="1" unchecked-value="0" name="isChat" id="isChat"></b-form-checkbox>
            </b-form-group>
            <b-form-group label="Review" class="col-md-2">
              <b-form-checkbox v-model="selected.isReview" value="1" unchecked-value="0" name="isReview" id="isReview"></b-form-checkbox>
            </b-form-group>
          </b-form-row>
          <b-form-row>
            <b-form-group label="Loại ảnh hưởng" class="col-md-6">
              <b-form-input v-model="selected.affectUser" placeholder="Thêm loại ảnh hưởng"></b-form-input>
            </b-form-group>
            <b-form-group label="Loại đánh giá" class="col-md-6">
              <b-form-input v-model="selected.reviewType" placeholder="Thêm loại đánh giá"></b-form-input>
            </b-form-group>
          </b-form-row>
          <b-form-row>
            <b-form-group label="Nhóm đánh giá" class="col-md-6">
              <b-form-input v-model="selected.groupReview" placeholder="Thêm nhóm đánh giá"></b-form-input>
            </b-form-group>
            <b-form-group label="Loại phản hồi" class="col-md-6">
              <b-form-input v-model="selected.fieldAddition" type="number" min="0" placeholder="Loại phản hồi"></b-form-input>
            </b-form-group>
          </b-form-row>
        </form>
      </div>
      <div class="button-presenter mt-3">
        <b-button variant="default" class="mr-1" @click="closeModal">Đóng</b-button>
        <b-button variant="success" @click="addCauses" v-if="loadingButton == false">Thêm</b-button>
        <b-button variant="success" disabled v-if="loadingButton">
          Đang lưu...
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import shopService from 'domain/services/shop-service'
import SelectFeedbackType from 'components/elements/FilterBox/SelectFeedbackType'
import moment from 'moment'

export default {
  name: 'ManageCause',
  components: {
    'select-feedbacktype': SelectFeedbackType
  },
  data: () => ({
    success: true,
    statusAdd: true,
    idCause: null,
    selected: {
      feedbacktypes: '',
      nameCause: null,
      source: null,
      rate: null,
      type: 'text',
      onOff: 1,
      affectCodPick: 0,
      affectCodDeliver: 0,
      affectCodReturn: 0,
      isPrivate: 0,
      isChat: 0,
      isReview: 0,
      affectUser: null,
      reviewType: null,
      groupReview: null,
      fieldAddition: 0
    },
    optionSources: [
      {value: null, text: 'Chọn nguồn đánh giá'},
      {value: 'shop', text: 'Đánh giá shop'},
      {value: 'postoff', text: 'Đánh giá bưu cục'},
      {value: 'customer', text: 'Đánh giá khách hàng'},
      {value: 'customercare', text: 'Đánh giá CSKH'},
      {value: 'operator', text: 'Đánh giá quản lý'}
    ],
    optionRates: [
      {value: null, text: 'Chọn loại đánh giá'},
      {value: 1, text: 'Không hài lòng'},
      {value: 5, text: 'Hài lòng'}
    ],
    optionTypes: [
      {value: 'text', text: 'Text'},
      {value: 'comment', text: 'Comment'},
      {value: 'dropdown', text: 'Dropdown'}
    ],
    listCauses: [],
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    },
    showModal: false,
    loadingButton: false
  }),
  methods: {
    pageChanged: function (page) {
      this.searchListCauses(page)
      this.pageData.currentPage = page
    },
    searchListCauses: function (page, newSearchConditions) {
      let dataSend = {
        'source': this.selected.source,
        'rate': this.selected.rate,
        'page': page
      }
      if (newSearchConditions) {
        this.pageData.currentPage = 1
        dataSend.page = 1
      }
      this.$startLoading()
      shopService.getListCause(dataSend).then(response => {
        if (response.data.success) {
          this.pageData.totalItems = response.data.pagination.total
          this.pageData.perPage = response.data.pagination.per_page
          this.pageData.totalPages = response.data.pagination.total_page
          this.listCauses = response.data.data
        } else {
          this.success = false
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.$stopLoading()
      })
    },
    addCauses: function (event) {
      this.loadingButton = true
      if (this.statusAdd) {
        shopService.addCause(this.selected).then(response => {
          if (response.hasOwnProperty('data')) {
            if (response.data.hasOwnProperty('success')) {
              if (!response.data.success) {
                this.$notify({
                  group: 'default',
                  type: 'text-white bg-danger',
                  title: 'Thông báo',
                  text: response.data.message
                })
              } else {
                this.$notify({
                  group: 'default',
                  type: 'text-white bg-success',
                  title: 'Thông báo',
                  text: response.data.message
                })
              }
            }
          }
        }).catch(error => {
          console.log(error)
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: 'Đã có lỗi xảy ra, vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ'
          })
          this.closeModal()
        }).then(() => {
          this.loadingButton = false
          this.searchListCauses(this.pageData.currentPage)
          this.closeModal()
        }, 50)
      } else {
        // Update cause
        let data = {
          'id': this.idCause,
          ...this.selected
        }
        shopService.updateCause(data).then(response => {
          if (response.hasOwnProperty('data')) {
            if (response.data.hasOwnProperty('success')) {
              if (!response.data.success) {
                this.$notify({
                  group: 'default',
                  type: 'text-white bg-danger',
                  title: 'Thông báo',
                  text: response.data.message
                })
              } else {
                this.$notify({
                  group: 'default',
                  type: 'text-white bg-success',
                  title: 'Thông báo',
                  text: response.data.message
                })
              }
            }
          }
        }).catch(error => {
          console.log(error)
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: 'Đã có lỗi xảy ra, vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ'
          })
          this.closeModal()
        }).then(() => {
          this.loadingButton = false
          this.closeModal()
          this.searchListCauses(this.pageData.currentPage)
        }, 50)
      }
    },
    removeCauses: function (event) {
      event.target.innerHTML = 'Đang xóa lý do...'
      event.target.setAttribute('disabled', 'true')
      let causeId = event.target.getAttribute('cause_id')
      shopService.removeCause(causeId).then(response => {
        if (response.hasOwnProperty('data')) {
          if (response.data.hasOwnProperty('success')) {
            if (!response.data.success) {
              this.$notify({
                group: 'default',
                type: 'text-white bg-danger',
                title: 'Thông báo',
                text: response.data.message
              })
            } else {
              this.$notify({
                group: 'default',
                type: 'text-white bg-success',
                title: 'Thông báo',
                text: response.data.message
              })
            }
          }
        }
      }).catch(error => {
        console.log(error)
        this.$notify({
          group: 'default',
          type: 'text-white bg-danger',
          title: 'Thông báo',
          text: 'Đã có lỗi xảy ra, vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ'
        })
      }).then(() => {
        this.getListCause()
        event.target.innerHTML = 'Xóa lý do'
        event.target.removeAttribute('disabled')
        this.selected.rate = null
        this.selected.source = null
      }, 50)
    },
    addModal: function () {
      this.statusAdd = true
      this.showModal = true
      this.selected.rate = null
      this.selected.source = null
    },
    showUpdateModal: function (event) {
      this.statusAdd = false
      this.showModal = true
      this.idCause = event.target.getAttribute('cause_id')
      this.selected.nameCause = event.target.getAttribute('cause_name')
      this.selected.feedbacktypes = event.target.getAttribute('fbtype_id')
      this.selected.source = event.target.getAttribute('cause_source')
      this.selected.rate = event.target.getAttribute('cause_rate')
      this.selected.type = event.target.getAttribute('cause_type')
      this.selected.onOff = event.target.getAttribute('deleted') ? 1 : 0
      this.selected.affectCodPick = event.target.getAttribute('affect_cod_pick') ? 1 : 0
      this.selected.affectCodDeliver = event.target.getAttribute('affect_cod_deliver') ? 1 : 0
      this.selected.affectCodReturn = event.target.getAttribute('affect_cod_return') ? 1 : 0
      this.selected.isPrivate = event.target.getAttribute('cause_private') ? 1 : 0
      this.selected.affectUser = event.target.getAttribute('affect_user')
      this.selected.isChat = event.target.getAttribute('is_chat') ? 1 : 0
      this.selected.reviewType = event.target.getAttribute('review_type')
      this.selected.isReview = event.target.getAttribute('is_review') ? 1 : 0
      this.selected.groupReview = event.target.getAttribute('group_review')
      this.selected.fieldAddition = event.target.getAttribute('field_addition')
    },
    closeModal: function () {
      this.idCause = null
      this.statusAdd = true
      this.showModal = false
      this.selected.rate = null
      this.selected.source = null
      this.selected.nameCause = null
      this.selected.feedbacktypes = ''
      this.selected.type = 'text'
      this.selected.onOff = 1
      this.selected.affectCodReturn = 0
      this.selected.affectCodPick = 0
      this.selected.affectCodDeliver = 0
      this.selected.isChat = 0
      this.selected.isPrivate = 0
      this.selected.isReview = 0
      this.selected.affectUser = null
      this.selected.reviewType = null
      this.selected.groupReview = null
      this.selected.fieldAddition = 0
    },
    moment (data) {
      return moment(data)
    },
    getListCause: function () {
      let dataSend = {
        'source': null,
        'rate': null,
        'page': 1
      }
      this.$startLoading()
      shopService.getListCause(dataSend).then(response => {
        if (response.data.success) {
          this.pageData.totalItems = response.data.pagination.total
          this.pageData.perPage = response.data.pagination.per_page
          this.pageData.totalPages = response.data.pagination.total_page
          this.listCauses = response.data.data
        } else {
          this.success = false
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.$stopLoading()
        this.pageData.currentPage = 1
        this.selected.rate = null
        this.selected.source = null
      })
    }
  },
  created: function () {
    this.searchListCauses(this.pageData.currentPage)
  },
  computed: {
    totalItems () {
      return this.listCauses.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  metaInfo: {
    title: 'Quản lý Lý do đánh giá'
  }
}
</script>

<style scoped>

</style>
