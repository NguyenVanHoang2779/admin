<template>
  <div>
      <div class="ui-block">
        <b-form-row>
            <b-form-group class="col-md-6">
                <h4 class="ui-block-heading col-md-10">Cấu hình lý do chặn đăng đơn</h4>
            </b-form-group>
            <b-form-group class="col-md-6">
                <b-button
                  class="btn btn-success add-reason"
                  @click="isShowModalAdd = true"
                >
                  <i class="fas fa-plus"></i>
                  Thêm lý do mới
                </b-button>
                <b-button
                  class="btn btn-primary back-to-area"
                  :to="'/area/manager'"
                >
                  <i class="fas fa-long-arrow-alt-left"></i>
                  Quay về màn hình quản lý khu vực
                </b-button>
            </b-form-group>
        </b-form-row>

        <b-modal id="modal-scrollable" scrollable hide-footer title="Thêm mới lý do" v-model="isShowModalAdd">
          <b-form-group>
            <span class="ml-2" v-show="errors.first('reason-content')" style="color: red">(Cần nhập vào lý do)</span>
            <b-form-input
              name="reason-content"
              v-validate="'required'"
              v-model="reasonContent"
            />
          </b-form-group>
          <div class="mt-1">
            <ladda-btn
              :loading="loading[7]"
              @click.native="isShowModalAdd = false"
              data-style="zoom-out"
              class="btn btn-secondary float-right ml-1"
              v-b-modal.modal-1
            >
              <i class="far fa-hand-point-left"></i>
              Quay lại
            </ladda-btn>

            <ladda-btn
              :loading="loading[7]"
              @click.native="addReason(7)"
              data-style="zoom-out"
              class="btn btn-success float-right"
              v-b-modal.modal-1
            >
              <i class="fas fa-check"></i>
              Tiếp tục
            </ladda-btn>
          </div>
        </b-modal>

        <b-modal id="modal-scrollable" scrollable hide-footer title="Xác nhận sửa lý do" v-model="isShowModalUpdate">
          <div>
            <h4>Bạn có chắc muốn sửa lý do này không?</h4>
          </div>
          <div class="mt-1">
            <ladda-btn
              :loading="loading[7]"
              @click.native="isShowModalUpdate = false"
              data-style="zoom-out"
              class="btn btn-secondary float-right ml-1"
              v-b-modal.modal-1
            >
              <i class="far fa-hand-point-left"></i>
              Thôi, cho nghĩ lại đã!
            </ladda-btn>

            <ladda-btn
              :loading="loading[7]"
              @click.native="updateReason(7)"
              data-style="zoom-out"
              class="btn btn-success float-right"
              v-b-modal.modal-1
            >
              <i class="fas fa-check"></i>
              Chắc chắn, tiếp tục sửa!
            </ladda-btn>
          </div>
        </b-modal>

        <b-modal id="modal-scrollable" scrollable hide-footer title="Xác nhận xóa lý do" v-model="isShowModalDelete">
          <div>
            <h4>Bạn có chắc muốn xóa lý do này không?</h4>
          </div>
          <div class="mt-1">
            <ladda-btn
              :loading="loading[7]"
              @click.native="isShowModalDelete = false"
              data-style="zoom-out"
              class="btn btn-secondary float-right ml-1"
              v-b-modal.modal-1
            >
              <i class="far fa-hand-point-left"></i>
              Thôi, cho nghĩ lại đã!
            </ladda-btn>

            <ladda-btn
              :loading="loading[7]"
              @click.native="removeReason(7)"
              data-style="zoom-out"
              class="btn btn-success float-right"
              v-b-modal.modal-1
            >
              <i class="fas fa-check"></i>
              Chắc chắn, tiếp tục xóa!
            </ladda-btn>
          </div>
        </b-modal>

        <div class="result" id="results">
        <b-card no-body>
          <!-- / Table controls -->
          <div class="table-result">
            <!-- Table -->
            <div class="table-responsive mb-4">
              <table class="table mb-0 table-bordered">
                  <tr class="text-center">
                      <th>
                        <i class="fas fa-code"></i>
                        ID
                      </th>
                      <th>
                        <i class="far fa-sticky-note"></i>
                        Lý do
                      </th>
                      <th>
                        <i class="fas fa-exclamation-triangle"></i>
                        Thao tác
                      </th>
                  </tr>
                  <tr class="text-center" v-for="(reason, index) in reasonConfigs" :key="index">
                      <td>
                          <b-form-input
                            class="text-center"
                            v-model="reason.code"
                            disabled
                          />
                      </td>
                      <td>
                          <b-form-input
                            class="text-center"
                            v-model="reason.name"
                          />
                      </td>
                      <td>
                          <b-button
                            class="btn btn-warning"
                            @click="confirmUpdateReason(reason.code, reason.name)"
                          >
                            <i class="far fa-edit"></i>
                            Sửa
                          </b-button>
                          <b-button
                            class="btn btn-danger"
                            @click="confirmRemoveReason(reason.code)"
                          >
                            <i class="fas fa-trash"></i>
                            Xóa
                          </b-button>
                      </td>
                  </tr>
              </table>
            </div>
          </div>
        </b-card>
      </div>
      </div>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>

import areasService from 'domain/services/areas-service'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'

Vue.use(VeeValidate)
export default {
  name: 'BlockReason',
  components: {
    'ladda-btn': LaddaBtn
  },
  data: () => ({
    loading: [false, false, false, false, false, false, false, false, false, false, false, false],
    reasonId: null,
    reasonContent: null,
    reasonConfigs: [{
      'code': null,
      'name': null
    }],
    isShowModalAdd: false,
    isShowModalUpdate: false,
    isShowModalDelete: false
  }),
  methods: {
    confirmUpdateReason (reasonId, reasonContent) {
      this.reasonId = reasonId
      this.reasonContent = reasonContent
      this.isShowModalUpdate = true
    },
    updateReason (timeLoading) {
      let saveData = {
        id: this.reasonId,
        title: this.reasonContent
      }
      this.startLoading(timeLoading)
      areasService.updateBlockReason(saveData).then(response => {
        if (response.data.success) {
          this.$notify({
            group: 'default',
            type: 'text-white bg-success',
            title: 'Thông báo',
            text: 'Cập nhật lý do thành công!'
          })
          this.isShowModalUpdate = false
          setTimeout(function () {
            location.reload()
          }, 400)
          // this.getListBlockReasons()
        } else {
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.updateLoadingValue(timeLoading, false)
      })
    },
    confirmRemoveReason (reasonId) {
      this.reasonId = reasonId
      this.isShowModalDelete = true
    },
    removeReason (timeLoading) {
      let reasonId = this.reasonId
      this.startLoading(timeLoading)
      areasService.removeBlockReason(reasonId).then(response => {
        if (response.data.success) {
          this.$notify({
            group: 'default',
            type: 'text-white bg-success',
            title: 'Thông báo',
            text: 'Xoá lý do thành công!'
          })
          this.isShowModalDelete = false
          setTimeout(function () {
            location.reload()
          }, 400)
          // this.getListBlockReasons()
        } else {
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.updateLoadingValue(timeLoading, false)
      })
    },
    getListBlockReasons () {
      areasService.getListBlockReasons().then(response => {
        if (response.data.success) {
          this.reasonConfigs = response.data.data
        } else {
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      })
    },
    addReason (timeLoading) {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let saveData = {
            reason: this.reasonContent ? this.reasonContent : null
          }
          this.startLoading(timeLoading)
          areasService.addBlockReason(saveData).then(response => {
            if (response.data.success) {
              this.$notify({
                group: 'default',
                type: 'text-white bg-success',
                title: 'Thông báo',
                text: 'Thêm mới lý do thành công!'
              })
              this.isShowModalAdd = false
              setTimeout(function () {
                location.reload()
              }, 400)
              // this.getListBlockReasons()
            } else {
              this.$notify({
                group: 'default',
                type: 'text-white bg-danger',
                title: 'Thông báo',
                text: response.data.message
              })
            }
          }).then(() => {
            this.updateLoadingValue(timeLoading, false)
          })
        }
      })
    },
    startLoading (timeLoading) {
      if (this.loading[timeLoading]) {
        return
      }
      this.updateLoadingValue(timeLoading, true)
    },
    updateLoadingValue (timeLoading, value) {
      this.loading[timeLoading] = value
      // Trigger update
      this.loading = this.loading.slice(0)
    }
  },
  created () {
    this.getListBlockReasons()
  },
  computed: {
  },
  watch: {
  },
  metaInfo: {
    title: 'Màn hình cấu hình lý do chặn đăng đơn'
  }
}
</script>
<style>
.add-reason {
  position: absolute;
  top: 0;
  right: 275px;
}
.back-to-area {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
