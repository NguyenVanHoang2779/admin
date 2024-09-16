<template>
    <div>
      <b-row class="top align-items-center">
        <b-col md="4">
          <h4 class="m-0">Màn hình config công thức lương</h4>
        </b-col>
        <b-col md="8" class="text-right">
          <b-btn variant="ghtk" @click="showModalDetail(`addListFormula`)"><span class="ion ion-ios-construct"></span>&nbsp; Thêm huyện vào công thức lương</b-btn>
          <b-btn variant="ghtk" @click="showModalDetail(`create`)"><span class="ion ion-md-add"></span>&nbsp; Tạo mới</b-btn>
        </b-col>
      </b-row>
      <div class="seperate-xs my-1"></div>
      <div class="mb-3">
        <b-card v-loading="tableLoading" no-body>

            <!-- Table controls -->
            <b-card-body>

                <div class="row">
                    <b-check v-model="checkViewAll" class="no-select"><i>only active formula</i></b-check>
<!--                    <div class="col">-->
<!--                        <b-input size="sm" placeholder="Search..." class="d-inline-block w-auto float-sm-right" @input="filter($event)" />-->
<!--                    </div>-->
                </div>

            </b-card-body>
            <!-- / Table controls -->
            <div class="table-responsive mb-4 text-center" style="overflow-y: scroll; overflow-x: hidden;">
                <table class="table mb-0 table-bordered table-striped" >
                    <thead>
                    <tr style="background-color: #02bc77;">
                        <th width="10%">Công thức</th>
                        <th width="40%">Tên</th>
                        <th width="10%">Trạng thái</th>
                        <th width="10%">Người chỉnh sửa</th>
                        <th width="15%">Chỉnh sửa lần cuối</th>
                        <th width="15%">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="data in listFormulas" v-if="(!checkViewAll) || (checkViewAll && data.status === '1')" class="tr-bill">
                        <td class="font-weight-bold">{{data.formula}}</td>
                        <td class="text-left">{{data.name}}</td>
                        <td>
                            <b-badge variant="outline-success" v-if="data.status === '1'">Khả dụng</b-badge>
                            <b-badge variant="outline-danger" v-if="data.status === '0'">Vô hiệu hóa</b-badge>
                        </td>
                        <td class="font-italic">{{data.modified_by}}</td>
                        <td class="font-italic">{{data.modified}}</td>
                        <td>
                            <div class="row justify-content-center">
                                <b-btn v-b-tooltip.hover title="Edit" variant="outline-success borderless icon-btn" @click="showModalDetail(`edit`, data)"><i class="ion ion-md-create"></i></b-btn>
                                <b-btn v-if="data.status === '1'" v-b-tooltip.hover title="Disable" variant="outline-danger borderless icon-btn" @click="changeStatusFormula(data.formula, 0)"><i class="ion ion-md-close"></i></b-btn>
                                <b-btn v-if="data.status === '0'" v-b-tooltip.hover title="Active" variant="outline-info borderless icon-btn" @click="changeStatusFormula(data.formula, 1)"><i class="ion ion-md-checkmark"></i></b-btn>
                                <b-btn v-b-tooltip.hover title="Clone" variant="outline-primary borderless icon-btn" @click="showModalDetail(`clone`, data)"><i class="ion ion-ios-copy"></i></b-btn>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!-- Table -->
            <hr class="border-light m-0">
            <div>
                <modal-detail-config-formula
                        :type="typeModal"
                        :listFormulaIds="listFormulaIds"
                        :currentFormula="currentFormula"
                        :list-formulas="listFormulas"
                ></modal-detail-config-formula>
            </div>
        </b-card>
      </div>
        <notifications group="notifications-default" />
    </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/cod-formula-config.scss" lang="scss"></style>

<script>
import kpiCodService from 'domain/services/kpi-cod-service'
import modalDetailConfigFormula from './components/ModalDetailConfigFormula'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'formula-config',
  metaInfo: {
    title: 'Formula Config'
  },
  components: {
    kpiCodService,
    modalDetailConfigFormula,
    SweetModal,
    SweetModalTab,
    commonHelper
  },
  data: () => ({
    tableLoading: false,
    checkViewAll: true,
    listFormulas: null,
    listFormulaIds: [],
    typeModal: '',
    currentFormula: null
  }),

  computed: {
  },

  methods: {
    getAllFormula () {
      this.tableLoading = true
      kpiCodService.apiGetAllFormulaByDistrict().then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
          if (response.data.success) {
            this.listFormulas = response.data.data
            this.listFormulaIds = this.listFormulas.map(a => a.formula)
          } else {
            return commonHelper.showMessage('Đã xảy ra lỗi khi lấy dữ liệu !', 'warning')
          }
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.tableLoading = false
      })
    },
    showModalDetail (type, formula = null, dataFormula) {
      this.$bvModal.show('modal-detail-config-formula')
      this.currentFormula = formula
      this.typeModal = type
    },
    changeStatusFormula (formula, newVal) {
      if (!confirm('Bạn chắc chắn muốn thay đổi trạng thái công thức lương ' + formula)) {
        return
      }
      kpiCodService.apiChangeStatusFormula({
        formula: formula,
        new_value: newVal
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
          if (response.data.success) {
          } else {
            return 0
          }
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.getAllFormula()
      })
    }
  },

  created () {
    this.getAllFormula()
  }
}
</script>
