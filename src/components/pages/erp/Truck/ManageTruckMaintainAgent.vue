<template>
  <div>
    <b-modal hide-footer ref="manageMaintainAgent" modal-class="modal-xl" header-bg-variant="success text-white" title="Quản lý gara bảo dưỡng" ok-only centered>
      <b-row>
          <b-card v-if="showNew" title="Thêm gara mới" class="mb-2 col-md-12">
            <b-row>
            <b-col md="2">
              <b-form-group >
                <label class="form-label">Mã NCC</label>
                <b-form-input
                    v-model="newAgent.provider_code">
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-group >
                <label class="form-label">Mã số thuế</label>
                <b-form-input
                    v-model="newAgent.tax_code">
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group >
                <label class="form-label">Tên NCC</label>
                <b-form-input
                  name="new_name"
                  v-validate="{required: true, max: 255}"
                  :class="{'is-danger': errors.has('new_name')}"
                  v-model="newAgent.name">
                </b-form-input>
                <span v-show="errors.firstRule('new_name') == 'required'" class="help is-danger">Không để trống trường này </span>
                <span v-show="errors.firstRule('new_name') == 'max'" class="help is-danger">Không nhập quá 255 kí tự</span>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group >
                <label class="form-label">Địa chỉ</label>
                <b-form-input
                  name="new_address_name"
                  v-validate="{required: true, max: 255}"
                  :class="{'is-danger': errors.has('new_address_name')}"
                    v-model="newAgent.address_name">
                </b-form-input>
                <span v-show="errors.firstRule('new_address_name') == 'required'" class="help is-danger">Không để trống trường này </span>
                <span v-show="errors.firstRule('new_address_name') == 'max'" class="help is-danger">Không nhập quá 255 kí tự</span>
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-group >
                <label class="form-label">Khu vực</label>
                <b-form-input
                  name="new_area_name"
                  v-validate="{required: true, max: 255}"
                  :class="{'is-danger': errors.has('new_area_name')}"
                    v-model="newAgent.area_name">
                </b-form-input>
                <span v-show="errors.firstRule('new_area_name') == 'required'" class="help is-danger">Không để trống trường này </span>
                <span v-show="errors.firstRule('new_area_name') == 'max'" class="help is-danger">Không nhập quá 255 kí tự</span>
              </b-form-group>
            </b-col>
            </b-row>
            <b-col md="12" align="end">
              <b-btn @click="saveNew()" variant="outline-success icon-btn" class="btn-md mb-1" title="Lưu">
                <span class="ion ion-md-checkmark"></span>
              </b-btn>
              <b-btn @click="cancelNew()" variant="outline-success icon-btn" class="btn-md mb-1" title="Bỏ qua">
                <span class="ion ion-md-close"></span>
              </b-btn>
            </b-col>
          </b-card>
          <b-col md="12" align="end" v-if="agents.length > 0">
            <b-btn v-if="!showNew" @click="showNew=!showNew" variant="success icon-btn" class="btn-md mb-1" title="Tạo mới">
              <span class="ion ion-md-add"></span>
            </b-btn>
          </b-col>
        </b-row>
      <b-card no-body v-if="agents.length > 0">
        <table class="table mb-0 table-hover">
          <thead>
          <tr>
              <th>STT</th>
              <th>Mã NCC</th>
              <th>Mã số thuế</th>
              <th>Tên NCC</th>
              <th>Địa chỉ</th>
              <th>Khu vực sửa chữa</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in agents" :key="index">
              <td>{{index + pageData.current * 10 - 9}}</td>
              <td v-if="!item.is_edit">{{item.provider_code}}</td>
              <td class="text-td" v-else><b-input v-model="draft.provider_code"></b-input></td>
              <td v-if="!item.is_edit">{{item.tax_code}}</td>
              <td class="text-td" v-else><b-input v-model="draft.tax_code"></b-input></td>
              <td v-if="!item.is_edit">{{item.name}}</td>
              <td v-else>
                <b-form-input v-model="draft.name"
                  name="name"
                 v-validate="{required: true, max: 255}"
                 :class="{'is-danger': errors.has('name')}">
                </b-form-input>
                <span v-show="errors.firstRule('name') == 'required'" class="help is-danger">Không để trống trường này</span>
                <span v-show="errors.firstRule('name') == 'max'" class="help is-danger">Không nhập quá 255 kí tự</span>
              </td>
              <td v-if="!item.is_edit">{{item.address_name}}</td>
              <td v-else>
                <b-form-input
                name="address_name"
                v-validate="{required: true, max: 255}"
                :class="{'is-danger': errors.has('address_name')}"
                v-model="draft.address_name"></b-form-input>
                <span v-show="errors.firstRule('address_name') == 'required'" class="help is-danger">Không để trống trường này </span>
                <span v-show="errors.firstRule('address_name') == 'max'" class="help is-danger">Không nhập quá 255 kí tự</span>
              </td>
              <td v-if="!item.is_edit">{{item.area_name}}</td>
              <td v-else>
                <b-form-input
                name="area_name"
                v-validate="{required: true, max: 255}"
                :class="{'is-danger': errors.has('area_name')}"
                v-model="draft.area_name"></b-form-input>
                <span v-show="errors.firstRule('area_name') == 'required'" class="help is-danger">Không để trống trường này </span>
                <span v-show="errors.firstRule('area_name') == 'max'" class="help is-danger">Không nhập quá 255 kí tự</span>
              </td>
              <td>{{+item.is_display == 1 ? 'Hiển thị' : 'Ẩn'}}</td>
              <td>
                <div v-if="!item.is_edit" class="action-td">
                  <b-btn @click="editItem(item, index)" variant="outline-primary icon-btn" class="btn-sm mb-1" title="Sửa">
                    <span class="ion ion-md-create"></span>
                  </b-btn>
                  <b-btn v-if="+item.is_display == 0" @click="enableItem(item, index)" variant="outline-success icon-btn" class="btn-sm mb-1" title="Hiển thị">
                    <span class="ion ion-md-eye"></span>
                  </b-btn>
                  <b-btn v-else @click="disableItem(item, index)" variant="outline-danger icon-btn" class="btn-sm mb-1" title="Ẩn">
                    <span class="ion ion-ios-eye-off"></span>
                  </b-btn>
                </div>
                <div v-else class="action-td">
                  <b-btn @click="saveChange(item, index)" variant="outline-success icon-btn" class="btn-sm mb-1" title="Lưu lại">
                    <span class="ion ion-md-checkmark"></span>
                  </b-btn>
                  <b-btn @click="discardChange(item, index)" variant="outline-danger icon-btn" class="btn-sm mb-1" title="Bỏ qua">
                    <span class="ion ion-md-close"></span>
                  </b-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </b-card>
      <div class="mt-3" v-if="pageData.totalPages > 1">
        <b-row>
          <b-col md="12">
            <b-pagination
            v-model="pageData.current"
            :total-rows="pageData.totalItems"
            :per-page="pageData.perPage"
            v-on:change="pageChanged"
            aria-controls="my-table"
            align="center"
            ></b-pagination>
          </b-col>
        </b-row>
      </div>
      <div v-else>Không thấy dữ liệu</div>
    </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import VeeValidate from 'vee-validate'
import Vue from 'vue'

Vue.use(VeeValidate)
export default {
  name: 'manage-truck-maintain-agent',
  components: {
  },

  props: [
    'trigger'
  ],

  data: () => ({
    showNew: false,
    isEdit: false,
    draft: {},
    newAgent: {},
    agents: [],
    pageData: {
      current: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      totalRow: 0
    }
  }),

  created () {
  },

  computed: {
  },

  watch: {
    trigger: function () {
      this.$refs['manageMaintainAgent'].show()
      this.getAgents()
    }
  },

  methods: {
    pageChanged (page) { // Event check pagination change
      this.pageData.current = page
      this.getAgents()
    },
    saveNew () {
      let params = {
        name: this.newAgent.name ? this.newAgent.name.trim() : '',
        provider_code: this.newAgent.provider_code ? this.newAgent.provider_code.trim() : '',
        tax_code: this.newAgent.tax_code ? this.newAgent.tax_code.trim() : '',
        address_name: this.newAgent.address_name ? this.newAgent.address_name.trim() : '',
        area_name: this.newAgent.area_name ? this.newAgent.area_name.trim() : ''
      }

      this.$validator.validateAll(['new_name', 'new_address_name', 'new_area_name']).then((result) => {
        if (!result) {
          return commonHelper.showMessage('Kiểm tra lại thông tin đã nhập', 'warn')
        }
        if (!params.name) {
          return commonHelper.showMessage('Thiếu thông tin Tên NCC', 'warn')
        }
        if (!params.address_name) {
          return commonHelper.showMessage('Thiếu thông tin địa chỉ', 'warn')
        }
        if (!params.area_name) {
          return commonHelper.showMessage('Thiếu thông tin khu vực', 'warn')
        }
        this.$startLoading()
        CompanyProfileService.updateTruckMaintenanceAgent(params)
          .then(res => {
            if (res.data.success) {
              commonHelper.showMessage('Thêm đại lý gara thành công', 'success')
            } else {
              commonHelper.showMessage(res.data.message, 'warn')
            }
          })
          .catch(e => {
            commonHelper.showMessage('Có lỗi xảy ra hoặc bạn không có quyền thao tác', 'warn')
            console.log(e)
          })
          .then(() => {
            // this.$stopLoading()
            this.getAgents()
            this.showNew = false
            this.newAgent = {}
          })
      }).catch(e => {
        commonHelper.showMessage('Kiểm tra lại thông tin đã nhập', 'warn')
      })
    },
    cancelNew () {
      this.showNew = false
      this.newAgent = {}
    },
    saveChange (item, index) {
      let params = {
        id: item.id,
        name: this.draft.name ? this.draft.name.trim() : '',
        provider_code: this.draft.provider_code ? this.draft.provider_code.trim() : '',
        tax_code: this.draft.tax_code ? this.draft.tax_code.trim() : '',
        address_name: this.draft.address_name ? this.draft.address_name.trim() : '',
        area_name: this.draft.area_name ? this.draft.area_name.trim() : ''
      }
      this.$validator.validateAll(['name', 'address_name', 'area_name']).then((result) => {
        if (!result) {
          return commonHelper.showMessage('Kiểm tra lại thông tin đã nhập', 'warn')
        }
        if (!params.name) {
          return commonHelper.showMessage('Thiếu thông tin Tên NCC', 'warn')
        }
        if (!params.address_name) {
          return commonHelper.showMessage('Thiếu thông tin địa chỉ', 'warn')
        }
        if (!params.area_name) {
          return commonHelper.showMessage('Thiếu thông tin khu vực', 'warn')
        }
        this.agents[index].is_edit = 0
        this.updateItem(params, index).catch(e => console.error(e))
      }).catch(e => {
        commonHelper.showMessage('Kiểm tra lại thông tin đã nhập', 'warn')
      })
    },
    discardChange (item, index) {
      item.is_edit = 0
      this.draft = {}
    },
    editItem (item, index) {
      for (let i = 0; i < this.agents.length; i++) {
        if (this.agents[i].is_edit) this.agents[i].is_edit = 0
      }
      this.draft = {
        id: item.id,
        name: item.name,
        area_name: item.area_name,
        address_name: item.address_name,
        provider_code: item.provider_code,
        tax_code: item.tax_code
      }
      item.is_edit = 1
    },
    updateItem (params, index) {
      this.$startLoading()
      return CompanyProfileService.updateTruckMaintenanceAgent(params)
        .then(res => {
          if (res.data.success) {
            Object.keys(params).forEach(key => {
              if (key !== 'id') this.agents[index][key] = params[key]
            })
            // this.agents[index] = {...this.agents[index], ...params}
            commonHelper.showMessage('Update gara thành công', 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warn')
          }
          this.$stopLoading()
          return res.data.success
        })
        .catch(e => {
          commonHelper.showMessage('Có lỗi xảy ra hoặc bạn không có quyền thao tác', 'warn')
          console.log(e)
        })
    },
    enableItem (item, index) {
      if (+item.is_display === 1) return
      let params = {
        id: item.id,
        is_display: 1
      }
      this.updateItem(params, index).then(result => {
        if (result) this.agents[index].is_display = 1
      }).catch(e => console.error(e))
    },
    disableItem (item, index) {
      if (+item.is_display === 0) return
      let params = {
        id: item.id,
        is_display: 0
      }
      this.updateItem(params, index).then(result => {
        if (result) this.agents[index].is_display = 0
      }).catch(e => console.error(e))
    },
    getAgents () {
      this.$startLoading()
      CompanyProfileService.getTruckMaintenanceAgents({page: this.pageData.current})
        .then(res => {
          if (res.data.success) {
            this.agents = []
            res.data.data.data.forEach(e => {
              this.agents.push({...e, is_edit: 0, provider_code: +e.provider_code ? e.provider_code : ''})
            })
            this.pageData = res.data.data.pagination
          }
        })
        .catch(e => {
          commonHelper.showMessage('Có lỗi xảy ra hoặc bạn không có quyền thao tác', 'warn')
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    }
  }
}
</script>

<style scoped>
.action-td {
  width: 4rem;
}
.text-td {
  min-width: 8rem;
}
.is-danger {
    border-color: #E0B4B4;
    color: #bf0400;
    box-shadow: none;
}
</style>
