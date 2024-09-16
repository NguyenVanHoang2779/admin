<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading text-center">Đối soát thủ công</h4>
            <div class="col-md-6 center">
                <b-button
                        @click="showImportModal"
                        class="btn btn-success"
                >
                    <i class="sidenav-icon ion ion-md-cloud-upload"></i>
                    Đối soát bù
                </b-button>
                <b-button
                        @click="auditShopActiveLow"
                        class="btn btn-danger"
                >
                    <i class="sidenav-icon ion ion-md-airplane"></i>
                    Đối soát quý
                </b-button>
                <b-button
                  @click="showImportWOModal"
                  class="btn btn-info"
                >
                    <i class="sidenav-icon ion ion-md-filing"></i>
                    Upload đơn hàng writeoff
                </b-button>
                <b-button
                        @click="genBillWriteOff"
                        class="btn btn-warning"
                >
                    <i class="sidenav-icon ion ion-md-camera"></i>
                   Đối soát đơn hàng writeoff
                </b-button>
            </div>
            <div>
                <form>
                    <div class="form-filter">
                        <b-form-row>
                            <div class="col-md-6">
                                <b-form-group label="Mã shop">
                                    <b-input type="text" placeholder="Nhiều mã cách nhau bởi dấu phẩy. Ví dụ: S1,S2..." v-model="shopCode"/>
                                </b-form-group>
                            </div>
                            <div class="col-md-6">
                                <b-form-group label="Đối soát">
                                  <multiselect
                                    v-model="selectAuditType"
                                    track-by="name"
                                    label="name"
                                    placeholder="Chọn kiểu đối soát"
                                    :options="auditType"
                                    selectLabel=""
                                    selectedLabel=""
                                    deselectLabel=""
                                    :allow-empty="false">
                                  </multiselect>
                                </b-form-group>
                            </div>
                        </b-form-row>
                    </div>
                    <b-form-row>
                        <div class="align-content-center center">
                            <b-button @click="resetForm" class="btn">
                                Nhập lại
                            </b-button>
                            <ladda-btn
                                    :loading="loading[1]"
                                    @click.native="searchShop(pageData.currentPage, true, 1)"
                                    data-style="zoom-out"
                                    class="btn btn-success"
                            >
                                <i class="sidenav-icon ion ion-md-search"></i>
                                Tìm kiếm
                            </ladda-btn>
                        </div>
                    </b-form-row>
                </form>
            </div>
            <div v-if="successAudit">
                <b-alert :show="dismissCountDownSE" dismissible variant="success" @dismissed="dismissCountDownSE=0">
                    {{ msgNotify }}
                </b-alert>
            </div>
            <!-- Fill data -->
            <div class="result" id="results" v-if="checkResult">
                <b-card no-body v-if="listShops.length > 0">
                    <!-- / Table controls -->
                    <div class="table-result">
                        <!-- Pagination -->
                        <b-card-body class="pt-0 pb-3">
                            <div class="row">
                                <div class="col-sm pt-3">
                                    <b-pagination :total-rows="pageData.totalItems"
                                                  v-model="pageData.currentPage"
                                                  :per-page="pageData.perPage"
                                                  v-on:change="pageChanged"
                                    />
                                    Tổng số shop: {{ pageData.totalItems }}
                                </div>
                                <div class="col-sm text-sm-left text-center pt-3">
                                    <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                                </div>
                            </div>
                        </b-card-body>
                        <!-- / Pagination -->
                        <!-- Table -->
                        <div class="table-responsive mb-4">
                            <table class="table mb-0 table-bordered table-striped">
                                <thead class="" style="width: 100%">
                                <tr>
                                    <th width="10%">Tự động</th>
                                    <th width="10%">Cấu hình</th>
                                    <th width="40%">Thông tin shop</th>
                                    <th width="40%">Đối soát</th>
                                    <th width="10%">Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(dataShops, index) in listShops" class="tr-bill">
                                    <td>
                                        <div class="center auto-audit">
                                            <div v-if="dataShops.Shop.audit === 'auto'" @click="changeAuditShop(dataShops, index)">
                                              <div class="checkbox-audit"><i class="fas fa-check"></i></div>
                                            </div>
                                            <div v-if="dataShops.Shop.audit === 'manual'" @click="changeAuditShop(dataShops, index)">
                                              <div class="checkbox-audit"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                      <div class="center auto-audit" v-if="dataShops.ShopProfile.wallet_active !== '1'">
                                        <div v-if="dataShops.AuditShopConfig.audit_one_bill === '1'" @click="changeAuditShopOneBill(dataShops, index)">
                                          <div class="checkbox-audit"><i class="fas fa-check"></i></div>
                                        </div>
                                        <div v-if="dataShops.AuditShopConfig.audit_one_bill === '0' || dataShops.AuditShopConfig.audit_one_bill === null" @click="changeAuditShopOneBill(dataShops, index)">
                                          <div class="checkbox-audit"></div>
                                        </div>
                                        <div>Sinh 1 bill</div>
                                      </div>
                                    </td>
                                    <td>
                                        <span class="badge align-text-bottom badge-success" v-if="dataShops.Shop.shop_type == 1">PRO</span>
                                        <span class="badge align-text-bottom badge-danger" v-if="dataShops.Shop.shop_type == 2">VIP</span>
                                        <span class="badge align-text-bottom badge-info" v-if="dataShops.Shop.shop_type == 3">PRE</span>
                                        <span class="font-weight-bold">{{ dataShops.Shop.code_name }}</span> <br/> <br/>
                                        <span class="font-weight-bold">Email: </span><span>{{ dataShops.Shop.email }}</span> <br/>
                                        <span class="font-weight-bold">Kiểu đối soát: </span>
                                        <span v-if="dataShops.Shop.audit == 'manual'">Đối soát thủ công</span>
                                        <span v-if="dataShops.Shop.audit == 'auto'">Đối soát tự động</span><br/>
                                        <span class="font-weight-bold">Trạng thái kích hoạt ví: </span>
                                        <span v-if="dataShops.ShopProfile.wallet_active == '1'">Đã kích hoạt</span>
                                        <span v-if="['0', null].includes(dataShops.ShopProfile.wallet_active)">Chưa kích hoạt</span><br/><br/>
                                        <span class="font-weight-bold">Email đối soát: </span><span>{{ dataShops.Shop.against_email }}</span> <br/>
                                        <span class="font-weight-bold">Số tài khoản: </span><span>{{ dataShops.Shop.against_bank_account }}</span> <br/>
                                        <span class="font-weight-bold">Tên người hưởng: </span><span>{{ dataShops.Shop.against_bank_own }}</span> <br/>
                                        <span class="font-weight-bold">Mã Ngân hàng: </span><span>{{ dataShops.Shop.against_bank_name }}</span> <br/>
                                        <span  class="font-weight-bold">Lịch đối soát: </span>
                                        <span v-if="(dataShops.paymentPeriodConfig !== null && paymentPeriod !== null)">{{paymentPeriod[dataShops.paymentPeriodConfig.value]}}</span><br/>
                                    </td>
                                    <td class="bill-info">
                                        <span class="font-weight-bold">Thu hộ: </span><span>{{ parseFloat(dataShops.revenue.done.total_pick_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí ship: </span><span>{{ parseFloat(dataShops.revenue.done.total_ship_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Shop trả ship khi trả hàng: </span><span>{{ parseFloat(dataShops.revenue.done.total_return_debt_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí bảo hiểm: </span><span>{{ parseFloat(dataShops.revenue.done.total_insurance_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Shop trả trước: </span><span>{{ parseFloat(dataShops.revenue.done.total_prepayment) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Đồng kiểm: </span><span>{{ parseFloat(dataShops.revenue.done.total_co_check_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Chuyển hoàn: </span><span>{{ parseFloat(dataShops.revenue.done.total_return_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Khuyến mại: </span><span>{{ parseFloat(dataShops.revenue.done.total_discount_amount) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí chuyển khoản: </span><span>{{ parseFloat(dataShops.revenue.done.transfer_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí thay đổi địa chỉ: </span><span>{{ parseFloat(dataShops.revenue.done.total_change_add_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí lưu kho: </span><span>{{ parseFloat(dataShops.revenue.done.total_store_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Thanh toán tạm ứng: </span><span>{{ parseFloat(dataShops.revenue.done.total_quick_transfer_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Cấn trừ: </span><span>{{ parseFloat(dataShops.revenue.done.total_prepayment_transaction) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Nợ tồn: </span><span>{{ parseFloat(dataShops.revenue.done.total_debt_bill_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Tip Cod: </span><span>{{ parseFloat(dataShops.revenue.done.total_tip_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Bồi hoàn: </span><span>{{ parseFloat(dataShops.revenue.done.total_refund_audit_money) | toCurrency }}</span><br/>
                                        <span class="font-weight-bold">Truy thu bồi hoàn: </span><span>{{ parseFloat(dataShops.revenue.done.total_arrears_fee) | toCurrency }}</span><br/>
                                        <span class="font-weight-bold">Phí đơn hoàn đã thanh toán: </span><span>{{ parseFloat(dataShops.revenue.done.total_paid_other_fee_trans) | toCurrency }}</span><br/>
                                        <span class="font-weight-bold">Ứng tiền hàng: </span><span>{{ parseFloat(dataShops.revenue.done.total_cash_advance) | toCurrency }}</span><br/>
                                        <span class="font-weight-bold">Phí nguyên vật liệu: </span><span>{{ parseFloat(dataShops.revenue.done.total_materials_fee) | toCurrency }}</span><br/>
                                        <span class="font-weight-bold">Phí giao lại: </span><span>{{ parseFloat(dataShops.revenue.done.total_redelivery_fee) | toCurrency }}</span><br/>
                                        <span class="font-weight-bold">Phí xuất trả lại: </span><span>{{ parseFloat(dataShops.revenue.done.total_re_return_fee) | toCurrency }}</span><br/>
                                        <span class="font-weight-bold">Phí đổi địa chỉ trả hàng: </span><span>{{ parseFloat(dataShops.revenue.done.total_change_return_add_fee) | toCurrency }}</span><br/>
                                        <span class="font-weight-bold">Đã thanh toán qua ví: </span><span>{{ parseFloat(dataShops.revenue.done.total_paid_wallet_money) | toCurrency }}</span><br/><br/>
                                        <span class="font-weight-bold">Phí dịch vụ đã thanh toán: </span><span>{{ parseFloat(dataShops.revenue.done.total_paid_other_methods_money) | toCurrency }}</span><br/><br/>
                                        <span class="font-weight-bold">Đối soát: </span><span>{{ parseFloat(dataShops.revenue.done.total_cash_back) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Số lượng Đơn hàng: </span><span>{{ dataShops.revenue.done.count }}</span> <br/>
                                    </td>
                                    <td class="bill-info text-center action-audit">
                                      <div v-if="dataShops.ShopsExtra.hold_audit == 1">
                                        <span class="red-text">Giữ đối soát</span>
                                      </div>
                                        <div v-else-if="dataShops.Shop.auditing_locked == 1">
                                          <span class="red-text">Đang đối soát</span>
                                        </div>
                                        <div v-else>
                                          <ladda-btn
                                            @click.native="auditShopManual(dataShops, index, 2)"
                                            data-style="zoom-out"
                                            class="btn btn-success"
                                          >
                                              Đối soát
                                          </ladda-btn>
                                        </div>
                                        <br/><br/>
                                        <a href="javascript:void(0);" @click="showModal(dataShops.Shop.id)">
                                            <span>Xem đơn hàng</span>
                                        </a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- Pagination -->
                        <b-card-body class="pt-0 pb-3">
                            <div class="row">
                                <div class="col-sm pt-3">
                                    <b-pagination :total-rows="pageData.totalItems"
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
                    </div>
                </b-card>
                <div class="no-data" v-if="listShops.length == 0">
                    <b-alert show dismissible variant="warning">
                        <i class="sidenav-icon ion ion-ios-warning"></i>
                        Không có dữ liệu phù hợp, vui lòng thử lại.
                    </b-alert>
                </div>
            </div>
            <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
            <!-- Import file Modal Component -->
            <b-modal ref="importExcelModal" title="Upload file shop đối soát bù" static>
                <div class="d-block text-center">
                    <b-alert variant="success" show v-if="isUploadSuccess == 1">{{ uploadMsg ? uploadMsg : 'Upload file thành công' }}</b-alert>
                    <b-alert variant="danger" show v-if="isUploadSuccess == -1">{{ uploadMsg ? uploadMsg : 'Upload file không thành công' }}</b-alert>
                    <!-- <h3>Hello From My Modal!</h3> -->
                    <b-form-file v-model="importFile" variant="outline-default" :state="Boolean(importFile)" placeholder="Chọn file..."
                                 accept=".xls*" ref="importFile"
                    >
                    </b-form-file>
                    <div class="mt-3">File đã chọn: {{importFile && importFile.name}}</div>
                    <ladda-btn
                            :loading="loading[0]"
                            @click.native="uploadFile(0)"
                            data-style="zoom-out"
                            class="btn btn-primary"
                            v-if="importFile"
                    >
                        <i class="sidenav-icon ion ion-md-filing"></i>
                        Upload
                    </ladda-btn>
                </div>
                <div slot="modal-footer" class="w-100">
                    <b-btn class="float-right" variant="default" @click="hideImportModal">
                        Đóng
                    </b-btn>
                </div>
            </b-modal>
            <!-- Import file Modal Component -->
            <b-modal ref="importExcelWOModal" title="Upload đơn hàng writeoff cho shop" static>
                <div class="d-block text-center">
                    <b-alert variant="success" show v-if="isUploadSuccess == 1">{{ uploadMsg ? uploadMsg : 'Upload file thành công' }}</b-alert>
                    <b-alert variant="danger" show v-if="isUploadSuccess == -1">{{ uploadMsg ? uploadMsg : 'Upload file không thành công' }}</b-alert>
                    <!-- <h3>Hello From My Modal!</h3> -->
                    <b-form-file v-model="importFile" variant="outline-default" :state="Boolean(importFile)" placeholder="Chọn file..."
                                 accept=".xls*" ref="importFile"
                    >
                    </b-form-file>
                    <div class="mt-3">File đã chọn: {{importFile && importFile.name}}</div>
                    <ladda-btn
                            :loading="loading[0]"
                            @click.native="uploadFileWO(0)"
                            data-style="zoom-out"
                            class="btn btn-primary"
                            v-if="importFile"
                    >
                        <i class="sidenav-icon ion ion-md-filing"></i>
                        Upload
                    </ladda-btn>
                </div>
                <div slot="modal-footer" class="w-100">
                    <b-btn class="float-right" variant="default" @click="hideImportWOModal">
                        Đóng
                    </b-btn>
                </div>
            </b-modal>
            <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="htmlTransfer" v-if="loadingAudit" />
            <b-modal ref="listPackageModal" size="lg" scrollable title="Danh sách đơn hàng" hide-footer :no-close-on-backdrop="true">
                <div class="d-block scrollable strip">
                    <div class="table-responsive mb-4">
                        <form>
                          <div class="form-filter">
                            <b-form-row>
                              <b-form-group label="Mã đơn hàng" class="code-search">
                                <b-input type="text" placeholder="Mã đơn hàng hoặc Alias" v-model="packageCode"/>
                              </b-form-group>
                              <b-form-group label="Ngày bắt đầu hiệu lực" class="date-start-search">
                                <datepicker
                                  v-model="dateStart"
                                  format="dd-MM-yyyy"
                                  :bootstrapStyling="true"
                                  :monday-first="true"
                                  :full-month-name="true"
                                  :clear-button="true"
                                  placeholder="Từ ngày"
                                />
                              </b-form-group>
                              <b-form-group label="Ngày kết thúc hiệu lực" class="date-end-search">
                                <datepicker
                                  v-model="dateEnd"
                                  format="dd-MM-yyyy"
                                  :bootstrapStyling="true"
                                  :monday-first="true"
                                  :full-month-name="true"
                                  :clear-button="true"
                                  placeholder="Đến ngày"
                                />
                              </b-form-group>
                            </b-form-row>
                            <b-form-row>
                              <div class="align-content-center center">
                                <b-button @click="resetFormPackage" class="btn">
                                  Nhập lại
                                </b-button>
                                <ladda-btn
                                  :loading="loading[4]"
                                  @click.native="listAuditPackage(shopIdCurrent, pageDataPackage.currentPage, true, 4)"
                                  data-style="zoom-out"
                                  class="btn btn-success"
                                >
                                  <i class="sidenav-icon ion ion-md-search"></i>
                                  Tìm kiếm
                                </ladda-btn>
                              </div>
                            </b-form-row>
                          </div>
                        </form>
                        <!-- Pagination -->
                        <b-card-body class="pt-0 pb-3">
                          <div class="row">
                            <div class="col-sm pt-3">
                              <b-pagination :total-rows="pageDataPackage.totalItems"
                                            v-model="pageDataPackage.currentPage"
                                            :per-page="pageDataPackage.perPage"
                                            v-on:change="pagePackageChanged"
                              />
                              Tổng số đơn hàng: {{ pageDataPackage.totalItems }}
                            </div>
                            <div class="col-sm text-sm-left text-center pt-3">
                              <span class="text-muted" v-if="pageDataPackage.totalItems">Trang {{ pageDataPackage.currentPage }} trên {{ pageDataPackage.totalPages }}</span>
                            </div>
                          </div>
                        </b-card-body>
                        <!-- / Pagination -->
                        <table class="table mb-0 table-bordered table-striped">
                            <thead class="" style="width: 100%">
                            <tr>
                                <th width="60%">Thông tin đơn hàng</th>
                                <th width="40%">Ghi chú</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="no-data" v-if="listPkgOrder.length == 0">
                                <td colspan="3" style="height: 200px; vertical-align: middle">
                                    <b-alert show variant="warning">Không có dữ liệu phù hợp, vui lòng thử lại.</b-alert>
                                </td>
                            </tr>
                            <tr v-for="pkg in listPkgOrder" class="tr-bill">
                                <td>
                                    <a :href="clickAlias(pkg.Package.alias)" target="_blank" class="text-decoration-none text-alias">
                                        {{ pkg.Package.alias }}
                                    </a> <br />
                                    <span class="font-weight-bold">Tiền thu hộ: </span> {{ pkg.Package.getFinalPickMoney }}<br/>
                                    <span class="font-weight-bold">Phí dịch vụ: </span> {{pkg.Package.isExcludeInsuranceFee }}<br/>
                                    <span class="font-weight-bold">Shop trả trước: </span> {{ pkg.Package.getFinalPrePaidAmount }}<br/>
                                    <span class="font-weight-bold">Shop trả ship khi trả hàng: </span>
                                      <span v-if="pkg.ReturnDebtMoney.money">{{ parseFloat(pkg.ReturnDebtMoney.money) | toCurrency }}</span>
                                      <span v-else>0</span><br/>
                                    <span class="font-weight-bold">Phí đồng kiểm: </span> {{ pkg.Package.getFinalCoCheckFee }}<br/>
                                    <span class="font-weight-bold">Phí chuyển hoàn: </span> {{ pkg.Package.getFinalReturnFee }}<br/>
                                    <span class="font-weight-bold">Giá trị đóng bảo hiểm: </span> {{ parseFloat(pkg.Package.value) | toCurrency }}<br/>
                                    <span class="font-weight-bold">Phí bảo hiểm: </span>
                                      <span v-if="pkg.Package.insuranceFee">{{ pkg.Package.insuranceFee }}</span>
                                      <span v-else>0</span><br/>
                                    <span class="font-weight-bold">Khuyến mãi: </span> {{ pkg.Package.discountAmount }}<br/>
                                    <span class="font-weight-bold">Phí đổi địa chỉ giao: </span>
                                      <span v-if="pkg.Package.PackagesExtra.change_address_fee">{{ parseFloat(pkg.Package.PackagesExtra.change_address_fee) | toCurrency }}</span>
                                      <span v-else>0</span><br/>
                                    <span class="font-weight-bold">Tiền trả shop: </span> {{ pkg.Package.finalCashBack }}<br/>
                                    <span class="font-weight-bold">Trạng thái: </span> {{ packageStatuses[pkg.Package.package_status_id] }}<br/>
                                    <span v-if="pkg.Package.client_id">
                                      <span class="font-weight-bold">Mã ĐH KH: </span>
                                      <span>{{ pkg.Package.client_id }}</span>
                                    </span><br/>
                                    <span class="font-weight-bold">Thời gian tạo: </span> {{ pkg.Package.created }}<br/>
                                    <span class="font-weight-bold">Lưu kho trước khi đối soát: </span>
                                      <i class="error">{{ pkg.Package.rt_delay }} ngày</i><br/>
                                    <span class="font-weight-bold">Phí lưu kho: </span>
                                      <span v-if="pkg.Package.store_fee">{{ parseFloat(pkg.Package.store_fee) | toCurrency }}</span>
                                      <span v-else>0</span><br/>
                                    <span class="font-weight-bold">Phí đơn hoàn đã thanh toán: </span>
                                      <span v-if="pkg.Package.paid_other_fee_trans">{{ parseFloat(pkg.Package.paid_other_fee_trans) | toCurrency }}</span>
                                      <span v-else>0</span><br/>
                                    <span class="font-weight-bold">Phí nguyên vật liệu: </span>
                                    <span v-if="pkg.Package.materials_fee_money">{{ parseFloat(pkg.Package.materials_fee_money) | toCurrency }}</span>
                                    <span v-else>0</span><br/>
                                    <span class="font-weight-bold">Phí giao lại: </span>
                                    <span v-if="pkg.Package.re_delivery_fee">{{ parseFloat(pkg.Package.re_delivery_fee) | toCurrency }}</span>
                                    <span v-else>0</span><br/>
                                    <span class="font-weight-bold">Phí xuất trả lại: </span>
                                    <span v-if="pkg.Package.re_return_fee">{{ parseFloat(pkg.Package.re_return_fee) | toCurrency }}</span>
                                    <span v-else>0</span><br/>
                                    <span class="font-weight-bold">Phí đổi địa chỉ trả hàng: </span>
                                    <span v-if="pkg.Package.change_return_add_fee">{{ parseFloat(pkg.Package.change_return_add_fee) | toCurrency }}</span>
                                    <span v-else>0</span><br/>
                                    <span class="font-weight-bold">Đã thanh toán qua ví: </span>
                                    <span v-if="pkg.Package.paid_wallet_money">{{ parseFloat(pkg.Package.paid_wallet_money) | toCurrency }}</span>
                                    <span class="font-weight-bold">Phí dịch vụ đã thanh toán: </span>
                                    <span v-if="pkg.Package.paid_wallet_money">{{ parseFloat(pkg.Package.paid_other_methods_money) | toCurrency }}</span>
                                    <span v-else>0</span><br/>
                                </td>
                                <td class="bill-info">
                                  <span class="font-weight-bold">Đơn hàng: </span><br/>
                                  <span v-if="pkg.Package.is_freeship">Free ship cho khách</span>
                                  <span v-else>Khách trả tiền ship</span>
                                  <span v-html="pkg.Package.desc"></span><br/>
                                  <span v-html="pkg.Package.message"></span><br/>
                                  <span v-html="pkg.Package.private_message"></span><br/><br/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <!-- Pagination -->
                        <b-card-body class="pt-0 pb-3">
                          <div class="row">
                            <div class="col-sm pt-3">
                              <b-pagination :total-rows="pageDataPackage.totalItems"
                                v-model="pageDataPackage.currentPage"
                                :per-page="pageDataPackage.perPage"
                                v-on:change="pagePackageChanged"
                              />
                            </div>
                            <div class="col-sm text-sm-left text-center pt-3">
                              <span class="text-muted" v-if="pageDataPackage.totalItems">Trang {{ pageDataPackage.currentPage }} trên {{ pageDataPackage.totalPages }}</span>
                            </div>
                          </div>
                        </b-card-body>
                        <!-- End Pagination -->
                    </div>
                </div>
            </b-modal>
        </div>
    </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import auditService from 'domain/services/audit-service'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import { SidenavRouterLink } from '@/vendor/libs/sidenav'

Vue.use(BlockUI)

export default {
  components: {
    Datepicker,
    Multiselect,
    LaddaBtn,
    LoadingMiniBottom,
    SidenavRouterLink
  },
  data: () => ({
    htmlTransfer: `<div class="sk-folding-cube sk-primary">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
        </div>
        <h5 class="text-center mb-0">LOADING...</h5>`,
    shopCode: '',
    shopIdCurrent: '',
    dateStart: '',
    dateEnd: '',
    packageCode: '',
    loading: [false, false, false, false, false],
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    },
    pageDataPackage: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    },
    checkResult: false,
    appLoading: false,
    loadingAudit: false,
    listShops: [],
    paymentPeriod: [],
    packageStatuses: [],
    successAudit: false,
    dismissSeconds: 5,
    dismissCountDownSE: 0,
    msgNotify: '',
    message: '',
    listPkgOrder: [],
    auditDone: false,
    selectAuditType: { name: 'Tất cả', code: '' },
    auditType: [
      { name: 'Tất cả', code: '' },
      { name: 'Đối soát thủ công', code: 'manual' },
      { name: 'Đối soát tự động', code: 'auto' }
    ],
    isUploadSuccess: 0,
    importFile: null,
    uploadMsg: ''
  }),
  methods: {
    resetForm: function () {
      this.shopCode = ''
      this.selectAuditType = { name: 'Tất cả', code: '' }
    },
    resetFormPackage: function () {
      this.packageCode = ''
      this.dateStart = ''
      this.dateEnd = ''
    },
    changeAuditShop: function (dataShops, index) {
      let self = this
      if (!confirm('Bạn chắc chắn muốn cập nhật kiểu đối soát ?')) {
        return
      }
      self.loadingAudit = true
      auditService.changeAuditShop(dataShops.Shop.id).then(response => {
        if (response.data.success) {
          dataShops.Shop.audit = (dataShops.Shop.audit === 'auto') ? 'manual' : 'auto'
          this.listShops.splice(index, 1, dataShops)
        } else {
          alert(response.data.msg)
        }
      }).catch().then(function () {
        self.loadingAudit = false
      })
    },
    changeAuditShopOneBill: function (dataShops, index) {
      let self = this
      if (!confirm('Bạn chắc chắn muốn cập nhật đối soát sinh 1 bill ?')) {
        return
      }
      self.loadingAudit = true
      auditService.changeAuditShopOneBill(dataShops.Shop.order).then(response => {
        if (response.data.success) {
          if (dataShops.AuditShopConfig.audit_one_bill === '0') {
            dataShops.AuditShopConfig.audit_one_bill = '1'
          } else if (dataShops.AuditShopConfig.audit_one_bill === null) {
            dataShops.AuditShopConfig.audit_one_bill = '1'
          } else {
            dataShops.AuditShopConfig.audit_one_bill = '0'
          }
          this.listShops.splice(index, 1, dataShops)
        } else {
          alert(response.data.msg)
        }
      }).catch().then(function () {
        self.loadingAudit = false
      })
    },
    showModal: function (shopId) {
      this.shopIdCurrent = shopId
      this.listAuditPackage(1, 1, 3)
      this.$refs.listPackageModal.show()
    },
    hideModal: function () {
      this.$refs.listPackageModal.hide()
    },
    clickAlias: function (alias) {
      return '/admin?alias=' + alias
    },
    listAuditPackage: function (page, newSearchConditions, i) {
      let self = this
      if (self.dateStart && self.dateEnd && self.dateStart > self.dateEnd) {
        alert('Bạn phải nhập Thời gian tạo từ ngày nhỏ hơn hoặc bằng thời gian tạo đến ngày!')
        return
      }
      let dataSend = {
        'shop_id': this.shopIdCurrent,
        'page': page,
        'package_code': self.packageCode,
        'date_start': self.dateStart,
        'date_end': self.dateEnd
      }
      if (newSearchConditions) {
        this.pageDataPackage.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }

      this.startLoading(i)
      auditService.listAuditPackage(dataSend).then(response => {
        if (response.data.success) {
          self.listPkgOrder = response.data.options.packages
          self.pageDataPackage.totalItems = response.data.options.total
          self.pageDataPackage.perPage = response.data.options.per_page
          self.pageDataPackage.totalPages = response.data.options.total_page
          self.updateLoadingValue(i, false)
        } else {
          this.listPkgOrder = []
          self.updateLoadingValue(i, false)
        }
      }).catch(error => {
        if (error) {
          self.updateLoadingValue(i, false)
        }
      })
    },
    searchShop: function (page, newSearchConditions, i) {
      let self = this
      if (!self.shopCode && self.selectAuditType.code !== 'manual') {
        alert('Bạn phải nhập mã shop mới thực hiện tìm kiếm được!')
        return
      }
      let dataSend = {
        'shop_code': self.shopCode,
        'audit': self.selectAuditType.code,
        'page': page
      }
      // Truong hop nguoi dung tim kiem voi dieu kien loc moi
      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      // Enable loading
      self.loadingAudit = true
      this.startLoading(i)
      auditService.getListShop(dataSend).then(response => {
        if (response.data.success) {
          self.packageStatuses = response.data.options.packageStatuses
          self.checkResult = response.data.success
          self.pageData.totalItems = response.data.options.total
          self.pageData.perPage = response.data.options.per_page
          self.pageData.totalPages = response.data.options.total_page
          self.listShops = response.data.options.shops
          self.paymentPeriod = response.data.options.paymentPeriod
          self.updateLoadingValue(i, false)
        } else {
          self.updateLoadingValue(i, false)
        }
      }).catch(error => {
        if (error) {
          self.updateLoadingValue(i, false)
        }
      }).then(function () {
        self.updateLoadingValue(i, false)
        self.loadingAudit = false
      })
    },
    startLoading (i) {
      if (this.loading[i]) {
        return
      }
      this.updateLoadingValue(i, true)
    },
    updateLoadingValue (index, value) {
      this.loading[index] = value
      // Trigger update
      this.loading = this.loading.slice(0)
    },
    pageChanged: function (page) { // Event check pagination change
      this.searchShop(page)
      this.pageData.currentPage = page
    },
    pagePackageChanged: function (page) { // Event check pagination change
      this.listAuditPackage(page)
      this.pageDataPackage.currentPage = page
    },
    auditShopManual: function (dataShops, index, i) {
      if (!confirm('Bạn chắc chắn muốn đối soát cho shop ?')) {
        return
      }
      let self = this
      self.loadingAudit = true
      self.startLoading(i)
      auditService.auditShopManual(dataShops.Shop.id).then(result => {
        if (result.data.success) {
          self.loadingAudit = false
          self.msgNotify = result.data.msg
          dataShops.Shop.auditing_locked = 1
          this.listShops.splice(index, 1, dataShops)
        } else {
          self.loadingAudit = false
          self.message = result.data.msg
        }
        self.updateLoadingValue(i, false)
      }).catch(error => {
        if (error) {
          self.loadingAudit = false
          alert('Có lỗi xảy ra. Vui lòng kiểm tra lại!')
        }
        self.updateLoadingValue(i, false)
      }).then(function () {
        self.successAudit = true
        self.dismissCountDownSE = self.dismissSeconds
        self.updateLoadingValue(i, false)
      })
    },
    auditShopActiveLow: function () {
      if (!confirm('Bạn chắc chắn muốn khởi động đối soát quý cho shop kém hoạt động?')) {
        return
      }
      let self = this
      let dataSend = {
        'run_audit': 1
      }
      self.loadingAudit = true
      auditService.auditShopActiveLow(dataSend).then(result => {
        if (result.data.success) {
          self.loadingAudit = false
          self.msgNotify = result.data.msg
        } else {
          self.loadingAudit = false
          self.msgNotify = result.data.msg
        }
      }).catch(error => {
        if (error) {
          self.loadingAudit = false
          alert('Có lỗi xảy ra. Vui lòng kiểm tra lại!')
        }
      }).then(function () {
        self.successAudit = true
        self.dismissCountDownSE = self.dismissSeconds
      })
    },
    resetModal: function () {
      this.isUploadSuccess = 0
      this.uploadMsg = ''
      this.$refs.importFile.reset()
    },
    showImportModal: function () {
      this.resetModal()
      this.$refs.importExcelModal.show()
    },
    hideImportModal: function () {
      this.$refs.importExcelModal.hide()
    },
    showImportWOModal: function () {
      this.resetModal()
      this.$refs.importExcelWOModal.show()
    },
    hideImportWOModal: function () {
      this.$refs.importExcelWOModal.hide()
    },
    uploadFile: function (i) {
      let self = this

      if (!self.importFile) {
        alert('Bạn chưa chọn file upload!')
        return
      }

      let fileExtension = this.importFile.name.split('.').pop()
      if (['xlsx', 'xls'].indexOf(fileExtension) < 0) {
        alert('Bạn phải upload file định dạng Excel .xlsx hoặc .xls !')
        return
      }

      let dataSend = new FormData()
      dataSend.append('file_upload', self.importFile)

      self.uploadMsg = ''
      self.startLoading(i)
      auditService.uploadFileAuditException(dataSend).then(response => {
        if (response.data.success) {
          self.isUploadSuccess = 1
          if (response.data.message) {
            self.uploadMsg = response.data.message
          }
          self.updateLoadingValue(i, false)
        } else {
          self.isUploadSuccess = -1
          if (response.data.message) {
            self.uploadMsg = response.data.message
          }
          self.updateLoadingValue(i, false)
        }
      }).catch(error => {
        if (error) {
          self.isUploadSuccess = -1
          self.updateLoadingValue(i, false)
        }
      }).then(function () {
        self.updateLoadingValue(i, false)
        self.appLoading = false
      })
    },
    genBillWriteOff: function () {
      let self = this
      if (!confirm('Bạn chắc chắn muốn đối soát đơn hàng writeoff ?')) {
        return
      }
      self.loadingAudit = true
      auditService.auditDebtBillWriteOff().then(response => {
        if (response.data.success) {
          self.loadingAudit = false
          self.msgNotify = response.data.msg
        } else {
          self.loadingAudit = false
          self.msgNotify = response.data.msg
        }
      }).catch(error => {
        if (error) {
          self.loadingAudit = false
          alert('Có lỗi xảy ra. Vui lòng kiểm tra lại!')
        }
      }).then(function () {
        self.successAudit = true
        self.dismissCountDownSE = self.dismissSeconds
      })
    },
    uploadFileWO: function (i) {
      let self = this

      if (!self.importFile) {
        alert('Bạn chưa chọn file upload!')
        return
      }

      let fileExtension = this.importFile.name.split('.').pop()
      if (['xlsx', 'xls'].indexOf(fileExtension) < 0) {
        alert('Bạn phải upload file định dạng Excel .xlsx hoặc .xls !')
        return
      }

      let dataSend = new FormData()
      dataSend.append('file_upload', self.importFile)
      self.uploadMsg = ''
      self.startLoading(i)
      auditService.uploadFileWriteOff(dataSend).then(response => {
        if (response.data.success) {
          self.isUploadSuccess = 1
          if (response.data.message) {
            self.uploadMsg = response.data.message
          }
          self.updateLoadingValue(i, false)
        } else {
          self.isUploadSuccess = -1
          if (response.data.message) {
            self.uploadMsg = response.data.message
          }
          self.updateLoadingValue(i, false)
        }
      }).catch(error => {
        if (error) {
          self.isUploadSuccess = -1
          self.updateLoadingValue(i, false)
        }
      }).then(function () {
        self.updateLoadingValue(i, false)
        self.appLoading = false
      })
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  filters: {
    toCurrency: function (value) {
      if (typeof value !== 'number' || value === 0) {
        return value
      }
      let formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      })
      return formatter.format(value)
    }
  }
}
</script>
<style src="@/vendor/libs/spinkit/spinkit.scss" lang="scss"></style>
<style lang="scss" scoped>
    .center {
        text-align: center;
        margin: 0 auto;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .form-filter {
        border: 1px solid #ccc;
        border-radius: 5px;
        background: white;
        padding: 20px;
    }
    .bill-info {
        position: relative;
    }
    .multiselect--active {
        z-index: 99;
    }
    .errorClass {
        border: 1px solid red;
    }
    .emptyInput {
        border: 1px solid red;
    }
    >>> .modal-body {
        padding: 5px;
    }
    .fee-count-transfer > div {
        padding: 0 50px;
    }
    .loading-container .loading-backdrop {
        background: #fff !important;
        opacity: .7 !important;
    }
    .loading-container .loading {
        background: none !important;
        box-shadow: none !important;
    }
    .bill-info {
        position: relative;
    }
    .text-alias {
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #468847;
        color: #fff;
    }
    span >>> .summary-content, span >>> table {
        display: none;
    }
    .multiselect--active {
        z-index: 99;
    }
    .scrollable {
        max-height: 700px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .strip>div:nth-child(odd){
        background: #f8f8f8;
    }
    .error {
      color: #ff0000;
    }
    .checkbox-audit {
      height: 20px;
      width: 20px;
      border: 1px solid #afa7a7;
      background-color: #fff;
      cursor: pointer;
      border-radius: 4px;
      margin: 0 auto;
    }
    .code-search {
      width: 185px;
      float:left;
      margin-right: 10px;
    }
    .date-start-search {
      width: 250px;
      float:left;
      margin-right: 5px;
    }
    .date-end-search {
      width: 250px;
      float:left;
    }
</style>
