<template>
  <div>
    <div>
      <!-- start modal edit -->
      <b-modal ref="show-modal-edit" id="show-modal-edit" size="lg" hide-footer>
        <template v-slot:modal-title>
          Sửa gói tiền công cộng tác viên thời vụ
        </template>
        <div class="d-block">
          <b-form>
            <b-form-group
              id="input-group-1"
              label="Tên gói: "
              label-for="input-1"
            >
              <b-form-input
                name = 'nameEdit'
                id="input-1"
                required
                placeholder="Tên gói"
                v-model="formEdit.name"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label="Loại nhân viên:" label-for="input-2" >
              <b-form-select
                id="input-2"
                :options="staff"
                required
                v-model="formEdit.typeStaff"
                placeholder="Chọn loại nhân viên"
                @change="changeStaffTypeEdit(formEdit.typeStaff)"
              >
                <template v-slot:first>
                  <option :value="null" disabled>-- Chọn Loại nhân viên --</option>
                </template>
              </b-form-select>
            </b-form-group>
            <b-form-group v-if="formEdit.typeStaff" id="input-group-3" label="Cách tính:" label-for="input-3">
              <b-form-select
                id="input-3"
                :options="caculs"
                v-model="formEdit.cacul.name"
                required
                @change="changeSelectEdit(formEdit.cacul.name)"
              >
                <template v-slot:first>
                  <option :value="null" disabled>-- Chọn cách tính --</option>
                </template>
              </b-form-select>
            </b-form-group>
            <b-form-group>
              <template>
                <div class="conditional-rendering">
                  <div class="block-1" v-if="formEdit.cacul.name == 'theo_gio'">
                    <b-input-group size="lg" prepend="$" append="đ">
                      <b-input
                        @keypress="isNumber($event)"
                        type="number"
                        placeholder="Nhập số tiền mà mỗi giờ nhận được"
                        v-model="formEdit.cacul.value" min="1"
                      ></b-input>
                    </b-input-group>
                  </div>
                  <div class="block-2" v-else-if="formEdit.cacul.name == 'theo_don'">
                    <b-input-group size="lg" prepend="$" append="đ">
                      <b-input
                        @keypress="isNumber($event)"
                        type="number"
                        placeholder="Số tiền mỗi đơn thành công sẽ nhận được"
                        v-model="formEdit.cacul.value" min="1"
                      ></b-input>
                    </b-input-group>
                  </div>
                  <div class="block-2" v-else-if="formEdit.cacul.name == 'theo_vung'">
                    <div v-for="vung in listVung" >
                      <b-row>
                        <b-col cols="2">{{vung.name}} : </b-col>
                        <b-col>
                          <b-input-group size="lg" prepend="$" append="đ">
                            <b-input type="number" v-model="vung.value" @keypress="isNumber($event)" min="1"></b-input>
                          </b-input-group>
                        </b-col>
                      </b-row>
                      <br>
                    </div>
                  </div>
                </div>
              </template>
            </b-form-group>
            <b-form-group v-if="formEdit.typeStaff == 'cod'" id="input-group-4" label="Phụ cấp ngày công:" label-for="input-4">
              <b-form-select
                id="input-4"
                :options="pcnc"
                required
                v-model="formEdit.pcnc"
              >
                <template v-slot:first>
                  <option :value="null" disabled>-- Chọn Loại phụ cấp --</option>
                </template>
              </b-form-select>
            </b-form-group>
          </b-form>
<!--          <b-card class="mt-3" header="Form Data Result">-->
<!--            <pre class="m-0">{{ formEdit }}</pre>-->
<!--          </b-card>-->
        </div>
        <b-button class="mt-3" variant="primary" block @click="update">Cập nhập </b-button>
      </b-modal>
      <!-- end modal edit -->
      <!-- start modal add -->
      <b-modal id="bv-modal-example" ref="bv-modal-example" size="lg" hide-footer>
        <template v-slot:modal-title>
          Thêm gói tiền công cộng tác viên thời vụ
        </template>
        <div class="d-block">
          <b-form>
            <b-form-group
              id="input-group-1"
              label="Tên gói: "
              label-for="input-1"
            >
              <b-form-input
                name = 'name'
                id="input-1"
                required
                placeholder="Tên gói"
                v-model="form.name"
                v-validate="'required'"
                :class="{'has-error': errors.has('name')}"
              ></b-form-input>
              <p v-if="errors.has('name')" class="alert-danger">
                {{ errors.first('name') }}
              </p>
            </b-form-group>
            <b-form-group id="input-group-2" label="Loại nhân viên:" label-for="input-2" >
              <b-form-select
                id="input-2"
                :options="staff"
                required
                v-model="form.typeStaff"
                placeholder="Chọn loại nhân viên"
                @change="changeStaffType(form.typeStaff)"
              >
                <template v-slot:first>
                  <option :value="null" disabled>-- Chọn Loại nhân viên --</option>
                </template>
              </b-form-select>
            </b-form-group>
            <b-form-group v-if="form.typeStaff" id="input-group-3" label="Cách tính:" label-for="input-3">
              <b-form-select
                id="input-3"
                :options="caculs"
                v-model="form.cacul.name"
                required
                @change="changeSelect(form.cacul.name)"
              >
                <template v-slot:first>
                  <option :value="null" disabled>-- Chọn cách tính --</option>
                </template>
              </b-form-select>
            </b-form-group>
            <b-form-group>
              <template>
                <div class="conditional-rendering">
                  <div class="block-1" v-if="form.cacul.name == 'theo_gio'">
                    <b-input-group size="lg" prepend="$" append="đ">
                    <b-input @keypress="isNumber($event)"
                      type="number"
                      placeholder="Nhập số tiền mà mỗi giờ nhận được"
                      v-model="form.cacul.value" min="1"
                    ></b-input>
                    </b-input-group>
                  </div>
                  <div class="block-2" v-else-if="form.cacul.name == 'theo_don'">
                    <b-input-group size="lg" prepend="$" append="đ">
                    <b-input
                      @keypress="isNumber($event)"
                      type="number"
                      placeholder="Số tiền mỗi đơn thành công sẽ nhận được"
                      v-model="form.cacul.value" min="1"
                    ></b-input>
                    </b-input-group>
                  </div>
                  <div class="block-2" v-else-if="form.cacul.name == 'theo_vung'">
                    <div v-for="vung in listVung" >
                      <b-row>
                        <b-col cols="2">{{vung.name}} : </b-col>
                        <b-col>
                          <b-input-group size="lg" prepend="$" append="đ">
                          <b-input @keypress="isNumber($event)" type="number" v-model="vung.value" min="1"></b-input>
                          </b-input-group>
                        </b-col>
                      </b-row>
                      <br>
                    </div>
                  </div>
                </div>
              </template>
            </b-form-group>
            <b-form-group v-if="form.typeStaff == 'cod'" id="input-group-4" label="Phụ cấp ngày công:" label-for="input-4">
              <b-form-select
                id="input-4"
                :options="pcnc"
                v-model="form.pcnc"
                required
              >
                <template v-slot:first>
                  <option :value="null" disabled>-- Chọn Loại phụ cấp --</option>
                </template>
              </b-form-select>
            </b-form-group>
            <b-button class="mt-3" variant="primary" block @click="create">Thêm</b-button>
          </b-form>
<!--          <b-card class="mt-3" header="Form Data Result">-->
<!--            <pre class="m-0">{{ form }}</pre>-->
<!--          </b-card>-->
        </div>
      </b-modal>
      <!-- end modal add -->
    </div>
    <b-row>
      <h3>Quản lí gói tiền công cộng tác viên thời vụ</h3>
    </b-row>
    <h3 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
      <div></div>
      <b-btn id="show-btn" @click="$bvModal.show('bv-modal-example')" variant="primary btn-round" class="d-block"><span class="ion ion-md-add"></span>&nbsp;Thêm gói tiền</b-btn>
    </h3>
    <b-card>
    <b-table
      id="my-table"
      small :fields="fields"
      :items="items"
      :per-page="perPage"
      :current-page="currentPage"
      responsive="sm">
      <!-- A virtual column -->
      <template v-slot:cell(stt)="data">
        {{data.index + 1}}
      </template>
      <template v-slot:cell(tengoi)="data">
        {{data.item.remuneration_package_name}}
      </template>
      <template v-slot:cell(loainv)="data">
        {{data.item.type_staff}}
      </template>
      <template v-slot:cell(cachtinh)="data">
        {{data.item.calculation_method_name}}
      </template>
      <template v-slot:cell(pcnc)="data">
        {{data.item.allowance_workday}}
      </template>
      <template v-slot:cell(btnedit)="data">
        <b-btn @click="edit(data)" variant="outline-info icon-btn" class="d-block btn-lg"><span class="ion ion-md-create"></span></b-btn>
<!--        <btn-edit-remuneration :rowData="data"></btn-edit-remuneration>-->
      </template>
      <template v-slot:cell(btnremove)="data">
        <b-btn @click = "remove(data)" variant="outline-danger icon-btn" class="btn-lg"><i class="ion ion-md-close"></i></b-btn>
      </template>
    </b-table>
    </b-card>
    <br>
    <div class="overflow-auto">
      <b-pagination
        v-model="currentPage"
        :items="items"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        align="right"
      ></b-pagination>
    </div>
    <div>
      <b-btn @click="redirectCampaign" variant="success btn-round">Xem các campaign dàng cho CTVTV hiện có</b-btn>
    </div>
    <!--    start modal thông báo không tìm thấy dữ liệu-->
    <b-modal ref="modal-noti" hide-footer title="Thông báo">
      <div class="d-block text-center">
        <h3>Chưa có Gói tiền công cho cộng tác viên thời vụ, đóng thông báo để tạo chúng</h3>
      </div>
      <b-button class="mt-3" variant="outline-danger" block @click="hideModal">Đóng</b-button>
    </b-modal>
    <!--    end modal thông báo không tìm thấy dữ liệu-->
  </div>
</template>
<script>
import Vue from 'vue'
import CtvtvService from 'domain/services/ctvtv-service'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})
export default {
  components: {
  },

  computed: {
    rows () {
      return this.items.length
    }
  },

  created () {
    CtvtvService.getTypeStaff().then(response => {
      if (response.data.success) {
        this.staff = response.data.data
      }
    }).catch(e => {
      this.errors.push(e)
    })
    CtvtvService.getCalcuMethod().then(response => {
      if (response.data.success) {
        for (let i = 0; i < response.data.data.length; i++) {
          this.caculs[i].value = response.data.data[i].value
          this.caculs[i].text = response.data.data[i].text
        }
      }
    }).catch(e => {
      this.errors.push(e)
    })
    CtvtvService.getAllowanceWorkday().then(response => {
      if (response.data.success) {
        this.pcnc = response.data.data
      }
    }).catch(e => {
      this.errors.push(e)
    })
    this.viewData()
  },

  data () {
    return {
      isDisabled: false,
      stt: 1,
      items: [],
      fId: {
        id: '3'
      },
      rowData: '',
      form: {
        name: null,
        typeStaff: '',
        cacul: {name: '', value: '', vungvalue: []},
        pcnc: '0'
      },
      formEdit: {
        id: '',
        name: '',
        typeStaff: '',
        cacul: {name: '', value: '', vungvalue: []},
        pcnc: ''
      },
      perPage: 9,
      currentPage: 1,
      staff: [],
      caculs: [
        {value: '', text: '', disabled: false},
        {value: '', text: '', disabled: false},
        {value: '', text: '', disabled: false}
      ],
      pcnc: [],
      fieldsVung: [
        'STT',
        { key: 'name', label: 'Tên vùng' },
        { key: 'inputx', label: 'Giá trị' }
      ],
      fields: [
        { key: 'stt', label: 'STT' },
        { key: 'tengoi', label: 'Tên gói' },
        { key: 'loainv', label: 'Loại nhân viên' },
        { key: 'cachtinh', label: 'Cách tính' },
        { key: 'pcnc', label: 'Phụ cấp ngày công' },
        { key: 'btnedit', label: ' ' },
        { key: 'btnremove', label: ' ' }
      ],
      listVung: [
        {id: '1', name: 'Vùng 1', value: ''},
        {id: '2', name: 'Vùng 2', value: ''},
        {id: '3', name: 'Vùng 3', value: ''},
        {id: '4', name: 'Vùng 4', value: ''},
        {id: '5', name: 'Vùng 5', value: ''},
        {id: '6', name: 'Vùng 6', value: ''},
        {id: '7', name: 'Vùng 7', value: ''},
        {id: '8', name: 'Vùng 8', value: ''}
      ]
    }
  },

  methods: {
    hideModal () {
      this.$refs['modal-noti'].hide()
    },

    redirectCampaign () {
      this.$router.push({ name: 'manager-campaign' })
    },

    isNumber (evt) {
      evt = (evt) || window.event
      let charCode = (evt.which) ? evt.which : evt.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
        evt.preventDefault()
      } else {
        return true
      }
    },

    viewData () {
      this.$startLoading()
      CtvtvService.getListRemunerationPackage().then(response => {
        if (response.data.success) {
          this.items = response.data.data
          this.$stopLoading()
        } else {
          this.$refs['modal-noti'].show()
        }
      }).catch(e => {
        this.errors.push(e)
      })
    },

    create () {
      this.isDisabled = false
      this.$startLoading()
      CtvtvService.addRemunerationPackage(this.form).then(response => {
        if (response.data.success) {
          this.form.name = ''
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: response.data.message
          })
          this.$refs['bv-modal-example'].hide()
          this.$stopLoading()
          this.form.typeStaff = ''
          this.form.cacul.name = ''
          this.form.cacul.value = ''
          this.form.cacul.vungvalue = null
          this.viewData()
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
        this.isDisabled = true
      }).catch(e => {
        this.errors.push(e)
      })
    },

    update () {
      this.$startLoading()
      CtvtvService.editRemunerationPackage(this.formEdit).then(response => {
        if (response.data.success) {
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: response.data.message
          })
          this.$refs['show-modal-edit'].hide()
          this.$stopLoading()
          this.viewData()
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).catch(e => {
        this.errors.push(e)
      })
    },

    remove (row) {
      if (confirm('Bạn có chắc chắn muốn xóa "' + row.item.remuneration_package_name + '"')) {
        this.$startLoading()
        CtvtvService.removeRemunerationPackage(row.item).then((response) => {
          if (response.data.success) {
            this.$notify({
              group: 'default',
              type: 'bg-success text-white',
              title: 'Thông báo',
              text: response.data.message
            })
            this.$stopLoading()
            this.viewData()
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: response.data.message
            })
          }
        }).catch(e => {
          this.errors.push(e)
        })
      } else {
        // something
      }
    },

    changeSelect (selected) {
      if (selected === 'theo_vung') {
        for (let i = 0; i < 7; i++) {
          this.listVung[i].value = ''
        }
        this.form.cacul.vungvalue = this.listVung
        this.form.cacul.value = ''
      }
      if (selected === 'theo_don') {
        this.form.cacul.vungvalue = null
      }
    },

    changeSelectEdit (selected) {
      if (selected === 'theo_vung') {
        for (let i = 0; i < 8; i++) {
          this.listVung[i].value = ''
        }
        this.formEdit.cacul.vungvalue = this.listVung
        this.formEdit.cacul.value = ''
      }
      if (selected === 'theo_don') {
        this.formEdit.cacul.vungvalue = null
        this.formEdit.cacul.value = ''
      }
      if (selected === 'theo_gio') {
        this.formEdit.cacul.vungvalue = null
        this.formEdit.cacul.value = ''
      }
    },

    changeStaffType (typeStaff) {
      if (typeStaff === 'cod') {
        this.form.cacul.name = ''
        if (this.caculs[1].disabled === true && this.caculs[2].disabled === true) {
          this.caculs[0].disabled = true
          this.caculs[1].disabled = false
          this.caculs[2].disabled = false
        } else {
          this.caculs[0].disabled = true
        }
      }
      if (typeStaff === 'xlhh') {
        this.form.cacul.name = 'theo_gio'
        this.form.cacul.value = ''
        if (this.caculs[0].disabled === true) {
          this.caculs[0].disabled = false
          this.caculs[1].disabled = true
          this.caculs[2].disabled = true
        } else {
          this.caculs[1].disabled = true
          this.caculs[2].disabled = true
        }
      }
    },

    changeStaffTypeEdit (typeStaff) {
      if (typeStaff === 'cod') {
        this.formEdit.cacul.name = ''
        if (this.caculs[1].disabled === true && this.caculs[2].disabled === true) {
          this.caculs[0].disabled = true
          this.caculs[1].disabled = false
          this.caculs[2].disabled = false
        } else {
          this.caculs[0].disabled = true
        }
      }
      if (typeStaff === 'xlhh') {
        this.formEdit.cacul.name = 'theo_gio'
        this.formEdit.cacul.value = ''
        this.formEdit.cacul.vungvalue = null
        if (this.caculs[0].disabled === true) {
          this.caculs[0].disabled = false
          this.caculs[1].disabled = true
          this.caculs[2].disabled = true
        } else {
          this.caculs[1].disabled = true
          this.caculs[2].disabled = true
        }
      }
    },

    edit (row) {
      this.$refs['show-modal-edit'].show()
      this.fId.id = row.item.id
      this.formEdit.id = row.item.id
      CtvtvService.getRemunerationPackage(this.fId).then(response => {
        if (response.data.success) {
          this.formEdit.name = response.data.data.remuneration_package_name
          this.formEdit.typeStaff = response.data.data.type_staff
          this.changeStaffType(this.formEdit.typeStaff)
          this.formEdit.cacul.name = response.data.data.calculation_method_name
          this.formEdit.pcnc = response.data.data.allowance_workday
          if (this.formEdit.cacul.name === 'theo_don') {
            this.formEdit.cacul.vungvalue = null
          }
          if (this.formEdit.cacul.name === 'theo_gio') {
            this.formEdit.cacul.vungvalue = null
          }
          if (this.formEdit.cacul.name === 'theo_vung') {
            this.formEdit.cacul.value = ''
            if (response.data.datax) {
              for (let i = 0; i < response.data.datax.length; i++) {
                this.listVung[i].value = response.data.datax[i].value
              }
              this.formEdit.cacul.vungvalue = this.listVung
            }
          } else {
            if (response.data.data.calculation_method_value) {
              this.formEdit.cacul.value = response.data.data.calculation_method_value
            }
          }
        }
      })
    }
  }
}
</script>
