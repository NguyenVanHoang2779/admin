<template>
  <div class="payslip-page" v-if="hasDataLoaded">
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
      <div>Chi tiết bảng lương: {{profile.fullname}} - Tháng {{payslipData.month}}/{{payslipData.year}}</div>
      <b-btn variant="primary btn-round" class="d-block" @click="saveData()"><span class="ion ion-md-save"></span>&nbsp;Save changes</b-btn>
    </h4>

    <div class="row">
      <div class="col-md-1"><h5>Trạng thái</h5></div>
      <div class="col-md-11">
        <b-radio-group v-model="payslipData.status" :options="statusOptions" />
      </div>
    </div>

    <ecom-payslip-detail-info
      :profile="profile" :work-type="workType" :payslip="payslipData"
      :contract="contract" :contract-salary="contractSalary">
    </ecom-payslip-detail-info>

    <b-card header="Ngày công" header-tag="h5" class="mb-4">
      <b-form-row>
        <div class="col-md-6">
          <b-form-row>
            <b-form-group label="Công chuẩn" class="col-md-3">
              <b-input type="number" v-model="payslipData.total_workday" readonly />
            </b-form-group>
            <b-form-group label="Công thử việc" class="col-md-3">
              <b-input type="number" v-model="payslipData.trial_workday" readonly />
            </b-form-group>
            <b-form-group label="Công chính thức" class="col-md-3">
              <b-input type="number" v-model="payslipData.workday" readonly />
            </b-form-group>
            <b-form-group label="Số ngày nghỉ phép" class="col-md-3">
              <b-input type="number" v-model="payslipData.leave_number" readonly />
            </b-form-group>
          </b-form-row>
        </div>
        <div class="col-md-6">
          <b-form-row>
            <b-form-group label="Nghỉ lễ thử việc" class="col-md-3">
              <b-input type="number" v-model="payslipData.trial_leave_holiday" readonly />
            </b-form-group>
            <b-form-group label="Nghỉ lễ chính thức" class="col-md-3">
              <b-input type="number" v-model="payslipData.leave_holiday" readonly />
            </b-form-group>
            <b-form-group label="Công trực thử việc" class="col-md-3">
              <b-input type="number" v-model="payslipData.ot_trial_workday" readonly />
            </b-form-group>
            <b-form-group label="Công trực chính thức" class="col-md-3">
              <b-input type="number" v-model="payslipData.ot_workday" readonly />
            </b-form-group>
          </b-form-row>
        </div>
      </b-form-row>
    </b-card>
    <b-card header="Dữ liệu lương" header-tag="h5" class="mb-4">
      <b-form-row>
        <b-form-group label="Lương cơ bản theo ngày công" class="col-md-4">
          <b-input type="number" v-model="payslipData.basic_salary_by_workday" readonly />
        </b-form-group>
        <b-form-group label="Phụ cấp theo ngày công" class="col-md-4">
          <b-input type="number" v-model="payslipData.allowance_by_workday" readonly />
        </b-form-group>
        <b-form-group label="Lương NS/KPI" class="col-md-4">
          <b-input type="number" v-model="payslipData.kpi_salary" readonly />
        </b-form-group>
      </b-form-row>
      <b-form-row>
        <b-form-group label="Thưởng NVXS" class="col-md-4">
          <b-input type="number" v-model="payslipData.bonus_good_employee" />
        </b-form-group>
        <b-form-group label="Thưởng lễ" class="col-md-4">
          <b-input type="number" v-model="payslipData.bonus_holiday" />
        </b-form-group>
        <b-form-group label="Lương ngoài giờ" class="col-md-4">
          <b-input type="number" :value="otSalary" readonly />
        </b-form-group>
      </b-form-row>
      <h5>Các khoản trợ cấp khác</h5>
      <div class="table-responsive">
        <table class="table is_align_middle">
          <tbody>
          <tr v-for="(allowance, index) in payslipData.other_allowances">
            <td>
              <b-input type="number" v-model="allowance.amount" placeholder="Số tiền" />
            </td>
            <td><b-input type="text" v-model="allowance.description" placeholder="Diễn giải" /></td>
            <td>
              <b-btn variant="default md-btn-flat icon-btn" size="sm" @click="removeOtherAllowance(index)">
                <i class="ion ion-md-close"></i>
              </b-btn>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <b-btn variant="outline-primary" class="btn-sm" @click="addOtherAllowance()">
        <i class="ion ion-md-add"></i>&nbsp; Thêm trợ cấp
      </b-btn>
      <h5>Thu nhập</h5>
      <p class="income-box">
        Tổng thu nhập: <b><span v-numeral v-text="totalIncome"></span></b> <br/>
        Thu nhập chịu thuế: <b><span v-numeral v-text="incomeBeTax"></span></b> <br/>
        Thu nhập tính thuế: <b><span v-numeral v-text="lastIncomeBeTax"></span></b> <br/>
        Thuế TNCN: <b><span v-numeral v-text="personalIncomeTax"></span></b> <br/>
        Thu nhập sau nghĩa vụ NN: <b><span v-numeral v-text="incomeAfterTax"></span></b>
      </p>
    </b-card>
    <b-card header="Các khoản trừ" header-tag="h5" class="mb-4">
      <div class="table-responsive">
        <table class="table is_align_middle">
          <tbody>
            <tr v-for="(deduction, index) in payslipData.deductions">
              <td>
                <b-select v-model="deduction.type" :options="listDeductions" />
              </td>
              <td>
                <b-input type="number" v-model="deduction.amount" placeholder="Số tiền" />
              </td>
              <td><b-input type="text" v-model="deduction.description" placeholder="Diễn giải" /></td>
              <td>
                <b-btn variant="default md-btn-flat icon-btn" size="sm" @click="removeDeduction(index)">
                  <i class="ion ion-md-close"></i>
                </b-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <b-btn variant="outline-primary" class="btn-sm" @click="addDeduction()">
        <i class="ion ion-md-add"></i>&nbsp; Thêm khoản trừ
      </b-btn>
    </b-card>
    <b-card header="Truy thu/hoàn" header-tag="h5" class="mb-4">
      <div class="table-responsive">
        <table class="table is_align_middle">
          <tbody>
          <tr v-for="(adjustment, index) in payslipData.adjustments">
            <td>
              <b-select v-model="adjustment.type" :options="listAdjustments" />
            </td>
            <td>
              <b-input type="text" v-model="adjustment.amount" placeholder="Số tiền" />
            </td>
            <td><b-input type="text" v-model="adjustment.description" placeholder="Diễn giải" /></td>
            <td>
              <b-btn variant="default md-btn-flat icon-btn" size="sm" @click="removeAdjustment(index)">
                <i class="ion ion-md-close"></i>
              </b-btn>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <b-btn variant="outline-primary" class="btn-sm" @click="addAdjustment()">
        <i class="ion ion-md-add"></i>&nbsp; Thêm truy thu/hoàn
      </b-btn>

      <div class="total-net-salary">Tổng thu nhập NET: <b><span v-numeral v-text="netSalary"></span></b></div>
    </b-card>
    <div class="text-right mt-3">
      <b-btn variant="primary" @click="saveData()">Save changes</b-btn>&nbsp;
      <b-btn variant="default" @click="clickCancel()">Cancel</b-btn>
    </div>
  </div>
</template>

<script src="./PayslipDetail.js"></script>

<style scoped lang="scss">
  .payslip-page {
    h5, h6 {
      margin-top: 1rem;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  .top-detail {
    .card-body {
      font-size: 12px;
    }
  }

  .income-box {
    line-height: 26px;
  }

  .total-net-salary {
    font-size: 18px;
    margin-top: 26px
  }
</style>
