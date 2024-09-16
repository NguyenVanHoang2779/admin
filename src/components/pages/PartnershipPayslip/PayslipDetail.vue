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

    <b-card no-body class="mb-4">
      <b-card-header header-tag="h5">Thông tin cá nhân</b-card-header>
      <b-card-body>
        <div class="row mb-2">
          <div class="col-md-4 text-muted">Họ và tên:</div>
          <div class="col-md-8" v-text="profile.fullname"></div>
        </div>
        <div class="row mb-2">
          <div class="col-md-4 text-muted">username:</div>
          <div class="col-md-8" v-text="profile.username"></div>
        </div>
        <div class="row mb-2">
          <div class="col-md-4 text-muted">Bộ phân:</div>
          <div class="col-md-8" v-text="profile.department"></div>
        </div>
        <div class="row mb-2">
          <div class="col-md-4 text-muted">Vị trí:</div>
          <div class="col-md-8" v-text="profile.position_name"></div>
        </div>
        <div class="row mb-2">
          <div class="col-md-4 text-muted">Kiểu nhân viên:</div>
          <div class="col-md-8" v-text="workType.work_type_description"></div>
        </div>
        <div class="row mb-2">
          <div class="col-md-4 text-muted">Kho:</div>
          <div class="col-md-8" v-text="profile.station_name"></div>
        </div>
      </b-card-body>
    </b-card>

    <b-card header="Dữ liệu lương" header-tag="h5" class="mb-4">
      <b-form-row>
        <b-form-group label="Doanh thu phân chia" class="col-md-3">
          <b-input type="number" v-model="payslipData.kpi_salary" readonly />
        </b-form-group>
        <b-form-group label="Thưởng doanh thu" class="col-md-3">
          <b-input type="number" v-model="payslipData.pro_reward_salary" readonly />
        </b-form-group>
        <b-form-group label="Thưởng chất lượng" class="col-md-3">
          <b-input type="number" v-model="payslipData.quality_salary" />
        </b-form-group>
        <b-form-group label="Thưởng đảm bảo" class="col-md-3">
          <b-input type="number" v-model="payslipData.min_salary" readonly />
        </b-form-group>
      </b-form-row>
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
