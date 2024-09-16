<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Tool xuất lương nhân viên văn phòng
    </h4>
    <hr class="border-light container-m--x mt-0 mb-5">
    <!------------------------------------------------1. Xuất lương nhân viên DPLV Tỉnh -------------------------------------------------------------->
<!--    <b-card no-body class="mb-1">-->
<!--      <b-card-header>-->
<!--        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion-1>-->
<!--          Xuất lương nhân viên DPLV Tỉnh-->
<!--          <div class="collapse-icon"></div>-->
<!--        </a>-->
<!--      </b-card-header>-->
<!--      <b-collapse id="accordion-1" :visible="one.visible" accordion="accordion">-->
<!--        <export-sal-l-v-tinh/>-->
<!--      </b-collapse>-->
<!--    </b-card>-->
    <!------------------------------------------------2. Xuất lương nhân viên DPLV City -------------------------------------------------------------->
<!--    <b-card no-body class="mb-1">-->
<!--      <b-card-header>-->
<!--        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion-2>-->
<!--          Xuất lương nhân viên DPLV City-->
<!--          <div class="collapse-icon"></div>-->
<!--        </a>-->
<!--      </b-card-header>-->
<!--      <b-collapse id="accordion-2" :visible="two.visible" accordion="accordion">-->
<!--        <export-sal-l-v-city/>-->
<!--      </b-collapse>-->
<!--    </b-card>-->
    <!------------------------------------------------3. Export lương Quản lý Bưu cục 2021 --------------------------------------------------------------->
<!--    <b-card no-body class="mb-1">-->
<!--      <b-card-header>-->
<!--        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion-3>-->
<!--          Export lương Quản lý Bưu cục 2021-->
<!--          <div class="collapse-icon"></div>-->
<!--        </a>-->
<!--      </b-card-header>-->
<!--      <b-collapse id="accordion-3" :visible="three.visible" accordion="accordion">-->
<!--        <export-sal-po-manager2021/>-->
<!--      </b-collapse>-->
<!--    </b-card>-->
    <!------------------------------------------------4. Export lương Giám sát kho vận 2021-------------------------------------------------------------->
<!--    <b-card no-body class="mb-1">-->
<!--      <b-card-header>-->
<!--        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion-4>-->
<!--          Export lương Giám sát kho vận 2021-->
<!--          <div class="collapse-icon"></div>-->
<!--        </a>-->
<!--      </b-card-header>-->
<!--      <b-collapse id="accordion-4" :visible="four.visible" accordion="accordion">-->
<!--        <export-sal-ws2021/>-->
<!--      </b-collapse>-->
<!--    </b-card>-->
    <!------------------------------------------------5. Export lương FulFillment 2021-------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion-5>
          Export lương FulFillment 2021
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion-5" :visible="five.visible" accordion="accordion">
        <export-sal-ff2021/>
      </b-collapse>
    </b-card>
    <!------------------------------------------------6. Export lương NVBC & Key BC 2022-------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion-6>
          Export lương NVBC & Key BC 2022
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion-6" :visible="six.visible" accordion="accordion">
        <export-sal-n-v-b-c2022/>
      </b-collapse>
    </b-card>
    <!------------------------------------------------7. Export lương Onsite-------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion-7>
          Export lương Onsite
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion-7" :visible="seven.visible" accordion="accordion">
        <export-sal-onsite/>
      </b-collapse>
    </b-card>
    <!------------------------------------------------8. Export lương GSK 2022-------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion-8>
          Export lương GSK 2022
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion-8" :visible="eight.visible" accordion="accordion">
        <ExportSalGSK2022/>
      </b-collapse>
    </b-card>
    <!------------------------------------------------9. Export lương GS XFAST 2022-------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion-9>
          Export lương GSXFAST 2022
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion-9" :visible="nine.visible" accordion="accordion">
        <ExportSalGSXFAST2022/>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import VueMonthlyPicker from 'vue-monthly-picker'
import Multiselect from 'vue-multiselect'
import ExportSalFf2021 from './ExportSalary/ExportSalFf2021'
import ExportSalNVBC2022 from './ExportSalary/ExportSalNVBC2022'
import ExportSalPoManager2021 from './ExportSalary/ExportSalPoManager2021'
import ExportSalWs2021 from './ExportSalary/ExportSalWs2021'
import ExportSalLVCity from './ExportSalary/ExportSalLVCity'
import ExportSalLVTinh from './ExportSalary/ExportSalLVTinh'
import ExportSalOnsite from './ExportSalary/ExportSalOnsite'
import ExportSalGSK2022 from './ExportSalary/ExportSalGSK2022'
import ExportSalGSXFAST2022 from './ExportSalary/ExportSalGSXFAST2022'

export default {
  components: {
    VueMonthlyPicker,
    Multiselect,
    ExportSalFf2021,
    ExportSalNVBC2022,
    ExportSalWs2021,
    ExportSalLVCity,
    ExportSalLVTinh,
    ExportSalPoManager2021,
    ExportSalOnsite,
    ExportSalGSK2022,
    ExportSalGSXFAST2022
  },
  data () {
    return {
      one: {
        visible: true,
        loadingButton: false
      },
      two: {
        visible: false,
        loadingButton: false
      },
      three: {
        visible: false,
        loadingButton: false
      },
      four: {
        visible: false,
        loadingButton: false
      },
      five: {
        visible: false,
        loadingButton: false
      },
      six: {
        visible: false,
        loadingButton: false
      },
      seven: {
        visible: false,
        loadingButton: false
      },
      eight: {
        visible: false,
        loadingButton: false
      },
      nine: {
        visible: false,
        loadingButton: false
      }
    }
  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss" scoped></style>
