<template>
  <div>
    <div class="ui-block">
      <b-form-row>
        <h4 class="ui-block-heading col-md-8">Quản lý hóa đơn COD</h4>
        <div class="col-md-4 center">
        </div>
      </b-form-row>
      <div>
        <form>
          <div class="form-filter">
            <b-form-row>
              <div class="col-md-3">
                <b-form-group label="Chọn COD">
                  <select-cods @selected="selected.cods = $event" ref="select_cods"></select-cods>
                </b-form-group>
              </div>
                <div class="col-md-3">
                    <b-form-group label="Người tạo hóa đơn">
                        <select-cashier @selected="selected.cashier = $event" ref="select_cashier"></select-cashier>
                    </b-form-group>
                </div>
              <div class="col-md-3">
                <b-form-group label="Chọn kho">
                  <select-stations @selected="selected.stations = $event" ref="select_stations"></select-stations>
                </b-form-group>
              </div>
                <div class="col-md-3">
                    <b-form-group label="Chọn ngày tạo hóa đơn:">
                        <datepicker
                                v-model="createdDate"
                                :bootstrapStyling="true"
                                :format="customFormatter"
                                class="created-date"
                                v-on:selected="dateSelectedCreatedInChild"
                                v-bind:disabled="inputDisable"
                        />
                    </b-form-group>
                </div>
            </b-form-row>
            <b-form-row>
              <div class="col-md-3">
                <b-form-group label="Mã hóa đơn">
                  <b-input type="text" placeholder="Nhập mã hóa đơn cách nhau bởi dấu phẩy hoặc dấu cách" v-model="bills.bill_code"/>
                </b-form-group>
              </div>
              <div class="col-md-3">
                <b-form-group label="Mã đơn hàng">
                  <b-input type="text" placeholder="Nhập mã đơn hàng cách nhau bởi dấu phẩy" v-model="bills.cod_bill_alias"/>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group label="Kiểu hóa đơn">
                  <select-bill-type @selected="selected.types = $event" ref="select_billType"></select-bill-type>
                </b-form-group>
              </div>
            </b-form-row>
          </div>
          <b-form-row>
            <div class="align-content-center center">
              <ladda-btn
                      @click="resetForm"
                      data-style="zoom-out"
                      class="btn"
              >
                Nhập lại
              </ladda-btn>
              <ladda-btn
                      :loading="loading[7]"
                      @click.native="searchBill(pageData.currentPage, true, 7)"
                      data-style="zoom-out"
                      class="btn btn-success"
              >
                <i class="sidenav-icon ion ion-md-search"></i>
                Xem hóa đơn
              </ladda-btn>
              <b-button
                      class="btn btn-success"
                      @click="exportDetailV2()"
              >
                <i class="sidenav-icon ion ion-md-filing"></i>
                Xuất File Chi Tiết
              </b-button>
              <b-button
                      class="btn btn-success"
                      @click="exportByStation()"
              >
                <i class="sidenav-icon ion ion-md-filing"></i>
                Xuất file theo kho
              </b-button>
              <button class="btn btn-warning" @click="redirectDownload">
                <i class="sidenav-icon ion ion-md-filing"></i>
                Quản lý Download
              </button>
            </div>
          </b-form-row>
        </form>
      </div>
      <div v-if="successExport">
        <b-alert :show="dismissCountDownSE" dismissible variant="success" @dismissed="dismissCountDownSE=0">
          {{ msgNotify }}
        </b-alert>
      </div>
      <!-- Sinh file chi tiết hóa đơn -->
      <div class="row checkbox-bill table-responsive" v-if="listBills.length > 0">
        <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="loadingExcelHtml" v-if="loadingExcel" />
        <a href="javascript:void(0);" @click="exportPackage"><span class="badge badge-primary float-right">Sinh file chi tiết hóa đơn</span></a>
      </div>
      <!-- Error message -->
      <div class="no-data" v-if="errorExport === true">
        <b-alert show dismissible variant="warning">
          <i class="sidenav-icon ion ion-ios-warning"></i>
          {{ msgErr }}
        </b-alert>
      </div>
      <!-- File Detail -->
      <div class="download-file-banks" v-if="listBills.length > 0">
        <div>
          <div class="total-fee">
            <span class="font-weight-bold" v-if="exportedFilesRefund.length > 0">
              Download file chi tiết:
              <a
                      :href="domainDownload + exportedFilesRefund"
                      target="_blank"
              >
                Hóa đơn thu tiền
              </a>
            </span> <br v-if="exportedFilesRefund.length > 0"/>
            <span class="font-weight-bold" v-if="exportedFilesRefundOnline.length > 0">
              Download file chi tiết:
              <a
                      :href="domainDownload + exportedFilesRefundOnline"
                      target="_blank"
              >
                Hóa đơn thu tiền online
              </a>
            </span> <br v-if="exportedFilesRefundOnline.length > 0"/>
            <span class="font-weight-bold" v-if="exportedFilesRefundPayment.length > 0">
              Download file chi tiết:
              <a
                      :href="domainDownload + exportedFilesRefundPayment"
                      target="_blank"
              >
                Hóa đơn buyer thanh toán
              </a>
            </span> <br v-if="exportedFilesRefundPayment.length > 0"/>
            <span class="font-weight-bold" v-if="exportedFilesPrepayment.length > 0">
              Download file chi tiết:
              <a
                      :href="domainDownload + exportedFilesPrepayment"
                      target="_blank"
              >
                Hóa đơn trả trước
              </a>
            </span> <br v-if="exportedFilesPrepayment.length > 0"/>
            <span class="font-weight-bold" v-if="exportedFilesPrepaymentOnline.length > 0">
              Download file chi tiết:
              <a
                      :href="domainDownload + exportedFilesPrepaymentOnline"
                      target="_blank"
              >
                Hóa đơn trả trước online
              </a>
            </span> <br v-if="exportedFilesPrepaymentOnline.length > 0"/>
            <span class="font-weight-bold" v-if="exportedFilesPrepaymentQR.length > 0">
              Download file chi tiết:
              <a
                      :href="domainDownload + exportedFilesPrepaymentQR"
                      target="_blank"
              >
                Hóa đơn trả trước QR
              </a>
            </span> <br v-if="exportedFilesPrepaymentQR.length > 0"/>
            <span class="font-weight-bold" v-if="exportedFilesReturnDebt.length > 0">
              Download file chi tiết:
              <a
                      :href="domainDownload + exportedFilesReturnDebt"
                      target="_blank"
              >
                Hóa đơn thu nợ trả hàng
              </a>
            </span> <br v-if="exportedFilesReturnDebt.length > 0"/>
            <span class="font-weight-bold" v-if="exportedFilesReturnDebtOnline.length > 0">
              Download file chi tiết:
              <a
                :href="domainDownload + exportedFilesReturnDebtOnline"
                target="_blank"
              >
                Hóa đơn thu nợ trả hàng online
              </a>
            </span> <br v-if="exportedFilesReturnDebtOnline.length > 0"/>
            <span class="font-weight-bold" v-if="exportedFilesReturnDebtQR.length > 0">
              Download file chi tiết:
              <a
                :href="domainDownload + exportedFilesReturnDebtQR"
                target="_blank"
              >
                Hóa đơn thu nợ trả hàng QR
              </a>
            </span> <br v-if="exportedFilesReturnDebtQR.length > 0"/>
            <span class="font-weight-bold" v-if="exportedFilesDebt.length > 0">
              Download file chi tiết:
              <a
                      :href="domainDownload + exportedFilesDebt"
                      target="_blank"
              >
                Hóa đơn shop nợ
              </a>
            </span> <br v-if="exportedFilesDebt.length > 0"/>
            <span class="font-weight-bold" v-if="exportedFilesDebtOnline.length > 0">
              Download file chi tiết:
              <a
                      :href="domainDownload + exportedFilesDebtOnline"
                      target="_blank"
              >
                Hóa đơn shop nợ online
              </a>
            </span> <br v-if="exportedFilesDebtOnline.length > 0"/>
            <span class="font-weight-bold" v-if="exportedFilesDebtQR.length > 0">
              Download file chi tiết:
              <a
                      :href="domainDownload + exportedFilesDebtQR"
                      target="_blank"
              >
                Hóa đơn shop nợ QR
              </a>
            </span> <br v-if="exportedFilesDebtQR.length > 0"/>
            <span class="font-weight-bold" v-if="exportedFilesRefundPaymentQr.length > 0">
              Download file chi tiết:
              <a
                      :href="domainDownload + exportedFilesRefundPaymentQr"
                      target="_blank"
              >
                Hóa đơn chốt ca QR
              </a>
            </span> <br v-if="exportedFilesRefundPaymentQr.length > 0"/>
          </div>
        </div>
      </div>
      <!-- Count Money -->
      <div class="row fee-count" v-if="listBills.length > 0">
        <div>
          <div v-if="loadingSum" class="text-center loading-sum">
            <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
              <div></div><div></div><div></div><div></div><div></div>
            </div>
          </div>
          <div class="total-fee">
            <span class="font-weight-bold">Tổng thu: {{ codTotal }}</span> <br />
          </div>
          <div class="total-fee">
            <span class="font-weight-bold">Tổng tiền CoD: {{ codTotalPickMoney}}</span> <br />
            <span class="font-weight-bold">Tổng shop trả trước: {{ codTotalPrepayment }}</span> <br />
          </div>
          <div class="total-fee">
            <span class="font-weight-bold">Tổng thu shop nợ: {{ codTotalDebtMoney}}</span> <br />
            <span class="font-weight-bold">Tổng thu nợ trả hàng: {{ codTotalReturnDebtMoney}}</span> <br />
          </div>
          <div class="total-fee">
            <span class="font-weight-bold">Tổng thu buyer nợ: {{ codTotalIDebtMoney}}</span> <br />
          </div>
        </div>
      </div>
      <!-- Fill data -->
      <div class="result" id="results" v-if="checkResult">
        <b-card no-body v-if="listBills.length > 0">
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
                  Tổng số hóa đơn: {{ pageData.totalItems }}
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
                    <th width="25%">Thông tin hóa đơn</th>
                    <th width="75%">Nội dung chi tiết</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(dataBills, index) in listBills" class="tr-bill">
                    <td>
                      <div v-if="['prepayment','prepayment_online','prepayment_qr'].includes(dataBills.Bill.action)">
                        <span class="badge badge-outline-success">{{ dataBills.Bill.code }}</span><br/>
                        <span class="font-weight-bold">Shop trả trước:</span>
                        <span v-if="['prepayment','prepayment_online'].includes(dataBills.Bill.action)" class="font-weight-bold float-right">{{ dataBills.Bill.total_prepayment }}</span>
                        <span v-if="['prepayment_qr'].includes(dataBills.Bill.action)" class="font-weight-bold float-right">{{ dataBills.qr_money }}</span>
                        <br/>
                        <br/>
                        <span class="font-weight-bold">SL ĐH: </span><span class="font-weight-bold">{{ dataBills.Bill.count_packages }}</span> <br/>
                      </div>
                      <div v-if="['refund','refund_online','refund_payment', 'refund_payment_qr'].includes(dataBills.Bill.action)">
                        <span class="badge badge-outline-success">{{ dataBills.Bill.code }}</span><br/>
                        <span class="font-weight-bold">Tổng tiền thu:</span><span class="font-weight-bold float-right">{{ dataBills.Bill.total_pick_money }}</span> <br/>
                        <br/>
                        <span class="font-weight-bold">SL ĐH: </span><span class="font-weight-bold">{{ dataBills.Bill.count_packages }}</span> <br/>
                        <span class="font-weight-bold">SL ĐH đã đối soát: </span><span class="font-weight-bold">{{ dataBills.Bill.count_done_packages }}</span> <br/>
                        <span class="font-weight-bold">SL ĐH đã trả: </span><span class="font-weight-bold">{{ dataBills.Bill.count_failed_packages }}</span> <br/>
                        <span class="font-weight-bold">SL ĐH delay: </span><span class="font-weight-bold">{{ dataBills.Bill.count_delay_packages }}</span> <br/>
                        <span class="font-weight-bold">SL ĐH thực nhận: </span><span class="font-weight-bold">{{ dataBills.Bill.no_hold_packages }}</span> <br/>
                      </div>
                      <div v-if="['debt','debt_online','debt_qr'].includes(dataBills.Bill.action)">
                        <span class="badge badge-outline-success">{{ dataBills.Bill.code }}</span><br/>
                        <span class="font-weight-bold">Tổng thu shop nợ:</span>
                        <span v-if="['debt','debt_online'].includes(dataBills.Bill.action)" class="font-weight-bold float-right">{{ dataBills.DebtBill.money }}</span>
                        <span v-if="['debt_qr'].includes(dataBills.Bill.action)" class="font-weight-bold float-right">{{ dataBills.qr_money }}</span>
                        <br/>
                      </div>
                      <div v-if="dataBills.Bill.action === 'idebt'">
                        <span class="badge badge-outline-success">{{ dataBills.Bill.code }}</span><br/>
                        <span class="font-weight-bold">Tổng thu buyer nợ:</span><span class="font-weight-bold float-right">{{ dataBills.IghtkDebtBill.money }}</span> <br/>
                      </div>
                      <div v-if="['return_debt','return_debt_online','return_debt_qr'].includes(dataBills.Bill.action)">
                        <span class="badge badge-outline-success">{{ dataBills.Bill.code }}</span><br/>
                        <span class="font-weight-bold">Tổng thu nợ trả hàng:</span><span class="font-weight-bold float-right">{{ dataBills.ReturnDebtMoney.money }}</span> <br/>
                      </div>
                      <span class="font-weight-bold">Người tạo: </span><span class="font-weight-bold">{{ dataBills.Bill.created_username }}</span>  <br/>
                      <span class="font-weight-bold">TG tạo: </span><span class="font-weight-bold" >{{ dataBills.Bill.created }}</span> <br />
                    </td>
                    <td class="bill-info">
                      <span v-if="dataBills.Cod != null" class="badge align-text-bottom badge-success">{{ dataBills.Cod.alias}} - {{ dataBills.Cod.fullname }}</span> <br/>
                      <a
                              v-b-toggle="'toggle-' + index"
                              href="javascript:void(0)"
                              class="d-flex justify-content-between text-decoration-none bill-show-package"
                              @click="getPackageForBill(dataBills.Bill.id, index)"
                              v-if="(['debt','debt_online','debt_qr','return_debt','return_debt_online','return_debt_qr','idebt'].includes(dataBills.Bill.action)) === false"
                      >
                        Xem đơn hàng &nbsp;&nbsp;
                        <span class="collapse-icon"></span>
                      </a>
                      <a
                              v-b-toggle="'toggle-return-debt-' + index"
                              href="javascript:void(0)"
                              class="d-flex justify-content-between text-decoration-none bill-show-package"
                              @click="getPackageForReturnDebtBill(dataBills.Bill.id, index)"
                              v-if="['return_debt','return_debt_online','return_debt_qr'].includes(dataBills.Bill.action)"
                      >
                        Xem đơn hàng &nbsp;&nbsp;
                        <span class="collapse-icon"></span>
                      </a>
                      <a
                              :href="domainDownload + dataBills.Bill.filepath"
                              target="_blank"
                      >
                        Download file excel - {{ dataBills.Bill.created }}
                      </a>
                      <div>
                        <b-collapse v-bind:id="'toggle-' + index">
                          <b-card v-for="(pkg, indexChild) in packageAjax[index]" v-bind:key="pkg.order" class="package-bill">
                            <a
                                    :href="clickAlias(pkg.alias)"
                                    target="_blank"
                                    class="text-decoration-none text-alias"
                            >
                              {{ pkg.alias }}
                            </a> <br />
                            <span class="font-weight-bold" v-if="pkg.is_freeship == 1">Free Ship cho khách</span>
                            <span class="font-weight-bold" v-if="pkg.is_freeship == 0">Khách trả tiền Ship</span>
                            <br/><br/>
                            <span class="font-weight-bold">Trạng thái: </span> {{ packageStatuses[pkg.package_status_id] }} <br/>
                            <span class="font-weight-bold">Tiền thu hộ: </span> {{ pkg.getFinalPickMoney }}<br/>
                            <span class="font-weight-bold">Coupon giảm tiền: </span> {{ pkg.discountPickMoney }}<br/>
                            <span class="font-weight-bold">Coupon trả trước: </span> {{ pkg.couponPrepayment }}<br/>
                            <span class="font-weight-bold">Phí dịch vụ: </span> {{ pkg.isExcludeInsuranceFee }}<br/>
                            <span class="font-weight-bold">Shop trả trước: </span> {{ pkg.getFinalPrePaidAmount }}<br/>
                            <span class="font-weight-bold">Tiền cấn trừ: </span> {{ pkg.prepayTrans }}<br/>
                            <span class="font-weight-bold">Tên KH: </span> {{ pkg.customer_fullname }} <br/>
                            <span class="font-weight-bold">Địa chỉ: </span>
                            <span v-if="pkg.show_first_address">{{ pkg.customer_first_address }}</span>
                            <a href="javascript:void(0)"
                               @click="getCustomerAddress(pkg.order, index, indexChild)"
                               v-b-tooltip.hover title="Bấm để xem chi tiết! Thông tin người bấm sẽ được lưu lại!"
                               v-if="!pkg.show_first_address"
                            >
                              Bấm xem địa chỉ
                            </a>
                            - {{ pkg.customer_last_address }} <br/>
                            <span class="font-weight-bold">ĐT KH: </span>
                            <span v-if="pkg.show_tel">{{ pkg.customer_tel }}</span>
                            <a href="javascript:void(0)"
                              @click="getCustomerTel(pkg.order, index, indexChild)"
                               v-b-tooltip.hover title="Bấm để xem chi tiết! Thông tin người bấm sẽ được lưu lại!"
                               v-if="!pkg.show_tel"
                            >
                              {{ pkg.customer_tel }}
                            </a>
                            <br/>
                          </b-card>
                        </b-collapse>
                      </div>
                      <b-alert show dismissible variant="warning" v-if="packageAjax[index] === false && ((['debt','debt_online','return_debt','return_debt_online','idebt','return_debt_qr'].includes(dataBills.Bill.action)) === false)">
                        <i class="sidenav-icon ion ion-ios-warning"></i>
                        Không có đơn hàng
                      </b-alert>
                      <div>
                        <b-collapse v-bind:id="'toggle-return-debt-' + index">
                          <b-card v-for="pkgRDB in packageReturnDebtBill[index]" v-bind:key="pkgRDB.order" class="package-bill">
                            <a
                                    :href="clickAlias(pkgRDB.alias)"
                                    target="_blank"
                                    class="text-decoration-none text-alias"
                            >
                              {{ pkgRDB.alias }}
                            </a> <br />
                            <span class="font-weight-bold" v-if="pkgRDB.is_freeship == 1">Free Ship cho khách</span>
                            <span class="font-weight-bold" v-if="pkgRDB.is_freeship == 0">Khách trả tiền Ship</span>
                            <br/><br/>
                            <span class="font-weight-bold">Trạng thái: </span> {{ packageStatuses[pkgRDB.package_status_id] }} <br/>
                            <span class="font-weight-bold">Tiền thu hộ: </span> {{ pkgRDB.getFinalPickMoney }}<br/>
                            <span class="font-weight-bold">Phí dịch vụ: </span> {{ pkgRDB.isExcludeInsuranceFee }}<br/>
                            <span class="font-weight-bold">Phí bảo hiểm: </span> {{ pkgRDB.insuranceFee }}<br/>
                            <span class="font-weight-bold">Shop trả trước: </span> {{ pkgRDB.getFinalPrePaidAmount }}<br/>
                            <span class="font-weight-bold">Phí chuyển hoàn: </span> {{ pkgRDB.getFinalReturnFee }}<br/>
                            <span class="font-weight-bold">Phí thay đổi địa chỉ: </span> {{ pkgRDB.changeAddressFee }}<br/>
                            <span class="font-weight-bold">Khuyến mãi: </span> {{ pkgRDB.discountAmount }}<br/>
                            <span class="font-weight-bold">Tên KH: </span> {{ pkgRDB.customer_fullname }} <br/>
                          </b-card>
                        </b-collapse>
                      </div>
                      <b-alert show dismissible variant="warning" v-if="packageReturnDebtBill[index] === false && (dataBills.Bill.action === 'return_debt' || dataBills.Bill.action === 'return_debt_online' || dataBills.Bill.action === 'return_debt_qr')">
                        <i class="sidenav-icon ion ion-ios-warning"></i>
                        Không có đơn hàng
                      </b-alert>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </b-card>
        <div class="no-data" v-if="listBills.length == 0">
          <b-alert show dismissible variant="warning">
            <i class="sidenav-icon ion ion-ios-warning"></i>
            Không có dữ liệu phù hợp, vui lòng thử lại.
          </b-alert>
        </div>
      </div>
      <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import SelectStations from 'components/elements/FilterBox/SelectStations'
import SelectCods from 'components/elements/FilterBox/SelectCods'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import SelectBillType from 'components/elements/FilterBox/SelectBillType'
import SelectCashier from 'components/elements/FilterBox/SelectCashier'
import Multiselect from 'vue-multiselect'
import billService from 'domain/services/bill-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import config from 'config/app.base'

Vue.use(BlockUI)

export default {
  components: {
    SelectCashier,
    SelectBillType,
    SelectStations,
    SelectCods,
    Datepicker,
    Multiselect,
    LaddaBtn,
    LoadingMiniBottom
  },
  data: () => ({
    selected: {
      stations: [],
      cods: [],
      types: [],
      cashier: []
    },
    from: new Date(),
    to: new Date(),
    createdDate: new Date(),
    bills: {
      bill_code: '',
      cod_bill_alias: ''
    },
    loading: [false, false, false, false, false, false, false, false, false, false, false, false],
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    },
    appLoading: false,
    listBills: [],
    packageAjax: [],
    inputDisable: false,
    codTotalPickMoney: '',
    codTotalPrepayment: '',
    codTotalDebtMoney: '',
    codTotalIDebtMoney: '',
    codTotalBill: '',
    codTotal: '',
    codTotalReturnDebtMoney: '',
    checkResult: false,
    packageStatuses: [],
    bills_export_url: 'https://newkt.ghtk.vn/adm/bills-export',
    packageDebtBill: [],
    packageReturnDebtBill: [],
    loadingSum: false,
    loadingExcel: false,
    loadingExcelHtml: `
      <div class="sk-folding-cube sk-primary">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
      </div>
      <h5 class="text-center mb-0">LOADING...</h5>
    `,
    errorExport: false,
    msgErr: '',
    exportedFilesRefund: '',
    exportedFilesRefundOnline: '',
    exportedFilesRefundPayment: '',
    exportedFilesRefundPaymentQr: '',
    exportedFilesPrepayment: '',
    exportedFilesReturnDebt: '',
    exportedFilesPrepaymentOnline: '',
    exportedFilesReturnDebtOnline: '',
    exportedFilesReturnDebtQR: '',
    exportedFilesPrepaymentQR: '',
    exportedFilesDebt: '',
    exportedFilesDebtOnline: '',
    exportedFilesDebtQR: '',
    successExport: false,
    dismissSeconds: 10,
    dismissCountDownSE: 0,
    msgNotify: '',
    validDateFrom: true,
    validDateTo: true,
    domainDownload: config.domainDownloadFile
  }),
  methods: {
    clearExcels: function () {
      this.exportedFilesRefund = ''
      this.exportedFilesRefundOnline = ''
      this.exportedFilesRefundPayment = ''
      this.exportedFilesPrepayment = ''
      this.exportedFilesReturnDebt = ''
      this.exportedFilesPrepaymentOnline = ''
      this.exportedFilesReturnDebtOnline = ''
      this.exportedFilesReturnDebtQR = ''
      this.exportedFilesPrepaymentQR = ''
      this.exportedFilesDebt = ''
      this.exportedFilesDebtOnline = ''
      this.exportedFilesDebtQR = ''
      this.exportedFilesRefundPaymentQr = ''
    },
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    dateSelectedFromInChild: function (date) {
      this.from = date
    },
    dateSelectedToInChild: function (date) {
      this.to = date
    },
    dateSelectedCreatedInChild: function (date) {
      this.createdDate = date
    },
    resetForm: function () {
      // Reset data of component select box
      this.$refs.select_stations.reset()
      this.$refs.select_billType.reset()
      this.$refs.select_cashier.reset()
      this.$refs.select_cods.reset()
      this.bills.bill_code = ''
      this.bills.cod_bill_alias = ''
    },
    getSummaries: function (dataSend) {
      let self = this

      this.loadingSum = true
      self.codTotalPickMoney = ''
      self.codTotalPrepayment = ''
      self.codTotalDebtMoney = ''
      self.codTotalIDebtMoney = ''
      self.codTotalBill = ''
      self.codTotal = ''
      self.codTotalReturnDebtMoney = ''
      billService.getSummariesCod(dataSend).then(response => {
        if (response.data.success && response.data.data) {
          let d = response.data.data
          self.codTotalPickMoney = d.codTotalPickMoney
          self.codTotalPrepayment = d.codTotalPrepayment
          self.codTotalDebtMoney = d.codTotalDebtMoney
          self.codTotalIDebtMoney = d.codTotalIDebtMoney
          self.codTotalBill = d.codTotalBill
          self.codTotal = d.codTotal
          self.codTotalReturnDebtMoney = d.codTotalReturnDebtMoney
          this.loadingSum = false
        } else {
          this.loadingSum = false
        }
      })
    },
    searchBill: function (page, newSearchConditions, i) {
      let self = this

      self.errorExport = false
      let dataSend = {
        'cod_id': self.selected.cods,
        'station_id': self.selected.stations,
        'bill_code': self.bills.bill_code,
        'cod_bill_alias': self.bills.cod_bill_alias,
        'action': self.selected.types,
        'created_user_id': self.selected.cashier,
        'cod_bill_created': this.customFormatter(self.createdDate),
        'page': page
      }
      // Truong hop nguoi dung tim kiem voi dieu kien loc moi
      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      if (page === 1) {
        this.getSummaries(dataSend)
        this.clearExcels()
      }
      // Enable loading
      self.appLoading = true
      this.startLoading(i)
      billService.searchBillCod(dataSend).then(response => {
        if (response.data.success) {
          self.checkResult = response.data.success
          self.packageStatuses = response.data.options.packageStatuses
          self.pageData.totalItems = response.data.options.total
          self.pageData.perPage = response.data.options.per_page
          self.pageData.totalPages = response.data.options.total_page
          self.listBills = response.data.options.bills
          self.packageAjax.length = response.data.options.bills.length
          for (let i = 0; i < self.packageAjax.length; i++) {
            self.packageAjax[i] = 0
          }
          self.packageDebtBill.length = response.data.options.bills.length
          for (let i = 0; i < self.packageDebtBill.length; i++) {
            self.packageDebtBill[i] = 0
          }
          self.packageReturnDebtBill.length = response.data.options.bills.length
          for (let i = 0; i < self.packageReturnDebtBill.length; i++) {
            self.packageReturnDebtBill[i] = 0
          }
          self.updateLoadingValue(i, false)
        } else {
          let msg = response.data.msg ? response.data.msg : 'Có lỗi xảy ra. Hãy thử lại nhé!'
          alert(msg)
          self.updateLoadingValue(i, false)
        }
      }).catch(error => {
        if (error) {
          self.updateLoadingValue(i, false)
        }
      }).then(function () {
        self.updateLoadingValue(i, false)
        self.appLoading = false
      })
    },
    exportDetailV2: function () {
      let self = this

      let dataSend = {
        'cod_id': self.selected.cods,
        'station_id': self.selected.stations,
        'bill_code': self.bills.bill_code,
        'cod_bill_alias': self.bills.cod_bill_alias,
        'action': self.selected.types,
        'created_user_id': self.selected.cashier,
        'cod_bill_created': this.customFormatter(self.createdDate),
        'is_export': 1
      }
      self.loadingExcel = true
      self.successExport = false
      billService.exportDetailExcel(dataSend).then(response => {
        if (response.data.success) {
          window.open('/adm/bills/download-manage?type=detail_cod')
          self.successExport = true
          self.dismissCountDownSE = self.dismissSeconds
          self.msgNotify = response.data.message ? response.data.message : 'Xuất file thành công. Vui lòng chuyển sang màn hình "Quản lý Download" để tải file.'
        } else {
          let msg = response.data.msg ? response.data.msg : 'Có lỗi xảy ra. Hãy thử lại nhé!'
          alert(msg)
        }
      }).catch(error => {
        if (error) {
          alert('Có lỗi xảy ra. Hãy thử lại nhé!')
        }
      }).then(function () {
        self.loadingExcel = false
      })
    },
    exportByStation: function () {
      let self = this

      let dataSend = {
        'cod_id': self.selected.cods,
        'station_id': self.selected.stations,
        'bill_code': self.bills.bill_code,
        'cod_bill_alias': self.bills.cod_bill_alias,
        'action': self.selected.types,
        'created_user_id': self.selected.cashier,
        'cod_bill_created': this.customFormatter(self.createdDate),
        'is_export_stations': 1
      }

      self.loadingExcel = true
      billService.exportStationExcel(dataSend).then(response => {
        if (response.data.success) {
          window.location.href = response.data.data
        } else {
          let msg = response.data.msg ? response.data.msg : 'Có lỗi xảy ra. Hãy thử lại nhé!'
          alert(msg)
        }
      }).catch(error => {
        if (error) {
          alert('Có lỗi xảy ra. Hãy thử lại nhé!')
        }
      }).then(function () {
        self.loadingExcel = false
      })
    },
    exportPackage: function () {
      let self = this

      self.errorExport = false
      self.loadingExcel = true
      let dataSend = {
        'cod_id': self.selected.cods,
        'station_id': self.selected.stations,
        'bill_code': self.bills.bill_code,
        'cod_bill_alias': self.bills.cod_bill_alias,
        'action': self.selected.types,
        'created_user_id': self.selected.cashier,
        'cod_bill_created': this.customFormatter(self.createdDate),
        'is_export_packages': 1
      }
      billService.exportPackageExcel(dataSend).then(response => {
        if (response.data.success && response.data.data.files) {
          var files = response.data.data.files
          for (var i in files) {
            self[i] = files[i]
          }
          self.errorExport = false
        } else {
          self.errorExport = true
          self.msgErr = response.data.msg ? response.data.msg : 'Có lỗi khi sinh file. Hãy thử lại nhé!'
        }
      }).catch(error => {
        if (error) {
          self.errorExport = true
          self.msgErr = 'Có lỗi khi sinh file. Hãy thử lại nhé!'
        }
      }).then(function () {
        self.loadingExcel = false
      })
    },
    downloadExcel: function (fileName) {
      return '/admin/bills/downloadExcel/' + fileName
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
    clickAlias: function (alias) {
      return '/admin?alias=' + alias
    },
    pageChanged: function (page) { // Event check pagination change
      this.searchBill(page)
      this.pageData.currentPage = page
    },
    getPackageForBill: function (billId, index) {
      let self = this
      billService.listCodPackages(billId).then(response => {
        if (response.data.Package.length > 0) {
          self.packageAjax.splice(index, 1, response.data.Package)
        } else {
          self.packageAjax.splice(index, 1, false)
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
      })
    },
    billsExport: function () {
      let url = this.bills_export_url
      return url
    },
    getPackageForDebtBill: function (billId, index) {
      let self = this
      billService.listPackagesDebtBill(billId).then(response => {
        if (response.data.Package.length > 0) {
          self.packageDebtBill.splice(index, 1, response.data.Package)
        } else {
          self.packageDebtBill.splice(index, 1, false)
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
      })
    },
    getPackageForReturnDebtBill: function (billId, index) {
      let self = this
      billService.listPackagesReturnDebtBill(billId).then(response => {
        if (response.data.Package.length > 0) {
          self.packageReturnDebtBill.splice(index, 1, response.data.Package)
        } else {
          self.packageReturnDebtBill.splice(index, 1, false)
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
      })
    },
    getCustomerTel: function (pkgOrder, index, indexChild) {
      let dataSend = {
        'package_order': pkgOrder
      }
      billService.saveLogCustomerTelAdd(dataSend).then(response => {
        this.$set(this.packageAjax[index][indexChild], 'show_tel', true)
        this.$set(this.packageAjax[index][indexChild], 'customer_tel', response.data.data)
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
      })
    },
    getCustomerAddress: function (pkgOrder, index, indexChild) {
      let dataSend = {
        'package_order': pkgOrder
      }
      billService.saveLogCustomerTelAdd(dataSend).then(response => {
        this.$set(this.packageAjax[index][indexChild], 'show_first_address', true)
        this.$set(this.packageAjax[index][indexChild], 'customer_first_address', response.data.customer_ad)
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
      })
    },
    redirectDownload: function () {
      window.open('/adm/bills/download-manage?type=detail_cod')
    },
    checkDate: function (dateFrom, dateTo) {
      return (moment(dateFrom).format('YYYY-MM-DD') > moment(dateTo).subtract('7', 'day').format('YYYY-MM-DD'))
    }
  },
  computed: {
    totalItems () {
      return this.listBills.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  watch: {
    from: function (newVal, oldVal) {
      if (!this.checkDate(newVal, this.to)) {
        alert('Vui lòng chọn khoảng thời gian tìm kiếm tối đa trong 7 ngày để tiếp tục!')
        this.validDateFrom = false
      } else {
        this.validDateFrom = true
      }

      if (!this.validDateFrom) {
        this.from = this.customFormatter(oldVal)
        this.from = new Date(this.from)
      }
    },
    to: function (newVal, oldVal) {
      if (!this.checkDate(this.from, newVal)) {
        alert('Vui lòng chọn khoảng thời gian tìm kiếm tối đa trong 7 ngày để tiếp tục!')
        this.validDateTo = false
      } else {
        this.validDateTo = true
      }

      if (!this.validDateTo) {
        this.to = this.customFormatter(oldVal)
        this.to = new Date(this.to)
      }
    }
  }
}
</script>
<style scoped>
  .center {
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .fee-count, .download-file-banks {
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 20px;
    display: block;
    margin: 10px 0;
    padding: 12px;
    position: relative;
    background-color: white;
  }
  .total-fee {
    box-sizing: border-box;
    display: table-cell;
    vertical-align: top;
    padding-left: 60px;
  }
  .form-filter {
    border: 1px solid #ccc;
    border-radius: 5px;
    background: white;
    padding: 20px;
  }
  .bill-show-package {
    position: absolute;
    top: 10px;
    right: 0;
    border: 1px solid #ccc;
    padding: 0px;
    border-radius: 5px;
    color: #1e70cd;
  }
  .bill-info {
    position: relative;
  }
  .package-bill {
    margin: 10px;
  }
  .text-alias {
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  span >>> .summary-content, span >>> table {
    display: none;
  }
  .multiselect--active {
    z-index: 99;
  }
  .loading-sum {
    position: absolute;
    top:50%;
    left:48%;
    transform: translate(-50%, -50%);
    height: 100px;
  }
  .lds-spinner {
    color: #26B4FF;
    display: inline-block;
    position: relative;
    width: 0px;
    height: 0px;
  }
  .lds-spinner div {
    transform-origin: 32px 32px;
    animation: lds-spinner 1.2s linear infinite;
  }
  .lds-spinner div:after {
    content: " ";
    display: block;
    position: absolute;
    top: 3px;
    left: 29px;
    width: 5px;
    height: 14px;
    border-radius: 20%;
    background: #26B4FF;
    z-index: 10;
  }
  .lds-spinner div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
  }
  .lds-spinner div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
  }
  .lds-spinner div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
  }
  .lds-spinner div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
  }
  .lds-spinner div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
  }
  .lds-spinner div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
  }
  .lds-spinner div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  .lds-spinner div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
  }
  .lds-spinner div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
  }
  .lds-spinner div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
  }
  .lds-spinner div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
  }
  .lds-spinner div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
  }
  @keyframes lds-spinner {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .checkbox-bill {
    margin: 0 auto;
  }
  .table-responsive {
    min-height: auto;
  }

</style>
