<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading text-center">Xác Nhận Chuyển Tiền Realtime</h4>
            <div>
                <form>
                    <div class="form-filter">
                        <b-form-row>
                            <div class="col-md-6">
                                <b-form-group label="Mã shop">
                                    <b-input type="text" placeholder="Nhiều mã cách nhau bởi dấu phẩy. Ví dụ: S1,S2..." v-model="shops.shop_code"/>
                                </b-form-group>
                            </div>
                            <div class="col-md-6">
                                <b-form-group label="Chọn ngân hàng">
                                    <select-bank-shop @selected="selected.banks = $event" ref="select_banks"></select-bank-shop>
                                </b-form-group>
                            </div>
                        </b-form-row>
                        <b-form-row>
                            <div class="col-md-6">
                                <b-form-group label="Trạng thái yêu cầu chuyển tiền">
                                    <multiselect
                                            v-model="selectRequestStatus"
                                            track-by="name"
                                            label="name"
                                            placeholder="Chọn trạng thái"
                                            :options="requestStatus"
                                            :searchable="false"
                                            :allow-empty="false">
                                    </multiselect>
                                </b-form-group>
                            </div>
                            <div class="col-md-3">
                                <b-form-group label="Từ:">
                                    <datepicker
                                            v-model="from"
                                            :bootstrapStyling="true"
                                            :format="customFormatter"
                                            class="from-date"
                                            v-on:selected="dateSelectedFromInChild"
                                            v-bind:disabled="inputDisable"
                                    />
                                </b-form-group>
                            </div>
                            <div class="col-md-3">
                                <b-form-group label="Đến:">
                                    <datepicker
                                            v-model="to"
                                            :bootstrapStyling="true"
                                            :format="customFormatter"
                                            class="to-date"
                                            v-on:selected="dateSelectedToInChild"
                                            v-bind:disabled="inputDisable"
                                    />
                                </b-form-group>
                            </div>
                        </b-form-row>
                    </div>
                    <b-form-row>
                        <div class="align-content-center center">
                            <b-button
                                    @click="resetForm"
                                    class="btn"
                            >
                                Nhập lại
                            </b-button>
                            <ladda-btn
                                    :loading="loading[7]"
                                    @click.native="searchShop(pageData.currentPage, true, 7)"
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
            <div v-if="successTransfer">
                <b-alert :show="dismissCountDownSE" dismissible variant="success" @dismissed="dismissCountDownSE=0">
                    {{ msgNotify }}
                </b-alert>
            </div>
            <div v-if="failTransfer">
                <b-alert :show="dismissCountDownER" dismissible variant="warning" @dismissed="dismissCountDownER=0">
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
                            <table class="table mb-0 table-bordered">
                                <thead class="" style="width: 100%">
                                <tr>
                                    <th width="30%">Thông tin shop</th>
                                    <th width="30%">Chi tiết yêu cầu chuyển tiền</th>
                                    <th width="30%">Tiền đối soát thực tế</th>
                                    <th width="10%" class="text-center">Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="dataShops in listShops" class="tr-bill" v-bind:class="{ 'table-danger': dataShops.Shop.isConflict }">
                                    <td>
                                        <span class="badge align-text-bottom badge-success" v-if="dataShops.Shop.shop_type == 1">PRO</span>
                                        <span class="badge align-text-bottom badge-danger" v-if="dataShops.Shop.shop_type == 2">VIP</span>
                                        <span class="badge align-text-bottom badge-info" v-if="dataShops.Shop.shop_type == 3">PRE</span>
                                        <span class="font-weight-bold">{{ dataShops.Shop.code }} - {{ dataShops.Shop.name }}</span> <br/>
                                        <br/>
                                        <span class="font-weight-bold">Email: </span><span>{{ dataShops.Shop.email }}</span> <br/>
                                        <span class="font-weight-bold">Kiểu đối soát: </span>
                                        <span v-if="dataShops.Shop.audit == 'manual'">
                                              Đối soát thủ công
                                            </span>
                                        <span v-if="dataShops.Shop.audit == 'auto'">
                                              Đối soát tự động
                                            </span>
                                        <br/><br/>
                                        <span class="font-weight-bold">Email đối soát: </span><span>{{ dataShops.Shop.against_email }}</span> <br/>
                                        <span class="font-weight-bold">Số tài khoản: </span><span>{{ dataShops.Shop.against_bank_account }}</span> <br/>
                                        <span class="font-weight-bold">Tên người hưởng: </span><span>{{ dataShops.Shop.against_bank_own }}</span> <br/>
                                        <span class="font-weight-bold">Mã Ngân hàng: </span><span>{{ dataShops.Shop.against_bank_name }}</span> <br/>
                                        <br/>
                                        <span class="font-weight-bold">Mã yêu cầu: </span><span class="text-danger">{{ dataShops.RequestTransferRealtime.code }}</span> <br/>
                                        <span class="font-weight-bold">TG tạo yêu cầu: </span><span>{{ dataShops.RequestTransferRealtime.created }}</span> <br/>
                                        <div v-if="status === 'confirmed'">
                                            <span class="font-weight-bold">Mã hóa đơn: </span><span class="text-danger">{{ dataShops.BillQuickTransfer.code }}</span> <br/>
                                            <span class="font-weight-bold">Người xác nhận: </span><span>{{ dataShops.RequestTransferRealtime.modified_username }}</span> <br/>
                                            <span class="font-weight-bold">TG xác nhận: </span><span>{{ dataShops.RequestTransferRealtime.modified }}</span> <br/>
                                        </div>
                                        <div v-if="status === 'rejected'">
                                            <span class="font-weight-bold">Lý do từ chối yêu cầu: </span><span class="text-danger">{{ dataShops.RequestTransferRealtime.desc }}</span> <br/>
                                            <span class="font-weight-bold">Người từ chối: </span><span>{{ dataShops.RequestTransferRealtime.modified_username }}</span> <br/>
                                            <span class="font-weight-bold">TG từ chối: </span><span>{{ dataShops.RequestTransferRealtime.modified }}</span> <br/>
                                        </div>
                                    </td>
                                    <td class="bill-info">
                                        <span class="font-weight-bold">Tổng thu hộ: </span><span>{{ parseFloat(dataShops.Shop.total_pick_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí ship: </span><span>{{ parseFloat(dataShops.Shop.total_ship_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí bảo hiểm: </span><span>{{ parseFloat(dataShops.Shop.total_insurance) | toCurrency }}</span><br/>
                                        <span class="font-weight-bold">Shop trả trước: </span><span>{{ parseFloat(dataShops.Shop.total_prepayment) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí chuyển hoàn: </span><span>{{ parseFloat(dataShops.Shop.total_return_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Khuyến mãi: </span><span>{{ parseFloat(dataShops.Shop.total_discount) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí thay đổi địa chỉ giao: </span><span>{{ parseFloat(dataShops.Shop.total_ch_addr_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Shop trả ship khi trả hàng: </span><span>0</span> <br/>
                                        <span class="font-weight-bold">Phí lưu kho: </span><span>0</span> <br/>
                                        <span class="font-weight-bold">Phí chuyển khoản: </span><span>{{ parseFloat(dataShops.Shop.transfer_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí COD nhanh: </span><span>{{ parseFloat(dataShops.Shop.quick_fee) | toCurrency }}</span> <br/><br/>
                                        <span class="font-weight-bold">Tổng tiền chuyển: </span><span class="font-weight-bold text-danger">{{ parseFloat(dataShops.Shop.fn_cashback) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Số lượng ĐH: </span><span>{{ dataShops.Shop.count_pkg }}</span> <br/>
                                    </td>
                                    <td class="bill-info">
                                        <span class="font-weight-bold">Tổng thu hộ: </span><span>{{ parseFloat(dataShops.Audit.total_pick_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí ship: </span><span>{{ parseFloat(dataShops.Audit.total_ship_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí bảo hiểm: </span><span>{{ parseFloat(dataShops.Audit.total_insurance) | toCurrency }}</span><br/>
                                        <span class="font-weight-bold">Shop trả trước: </span><span>{{ parseFloat(dataShops.Audit.total_prepayment) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí chuyển hoàn: </span><span>{{ parseFloat(dataShops.Audit.total_return_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Khuyến mãi: </span><span>{{ parseFloat(dataShops.Audit.total_discount) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí thay đổi địa chỉ giao: </span><span>{{ parseFloat(dataShops.Audit.total_ch_addr_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Shop trả ship khi trả hàng: </span><span>{{ parseFloat(dataShops.Audit.total_return_debt) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí lưu kho: </span><span>{{ parseFloat(dataShops.Audit.total_store_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí chuyển khoản: </span><span>{{ parseFloat(dataShops.Audit.transfer_fee) | toCurrency }}</span> <br/><br/>
                                        <br/>
                                        <span class="font-weight-bold">Tổng tiền chuyển: </span><span>{{ parseFloat(dataShops.Audit.fn_cashback) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Số lượng ĐH: </span><span>{{ dataShops.Audit.count_pkg }}</span> <br/>
                                    </td>
                                    <td class="bill-info text-center">
                                        <ladda-btn
                                                v-if="status === 'process'"
                                                :disabled="!dataShops.Shop.canTransfer"
                                                @click.native="showConfirmModal(dataShops.RequestTransferRealtime.id, dataShops.Shop.order, dataShops.Shop.count_pkg, dataShops.Shop.fn_cashback, dataShops.RequestTransferRealtime.code)"
                                                data-style="zoom-out"
                                                class="btn btn-success"
                                                size="sm" style="width: 110px"
                                        >
                                            Xác nhận
                                        </ladda-btn>
                                        <br/><br/>
                                        <ladda-btn
                                                v-if="status === 'process'"
                                                @click.native="showRejectModal(dataShops.RequestTransferRealtime.id, dataShops.Shop.order, dataShops.Shop.code)"
                                                data-style="zoom-out"
                                                class="btn btn-danger"
                                                size="sm" style="width: 110px"
                                        >
                                            Từ chối
                                        </ladda-btn>
                                        <br/><br/>
                                        <ladda-btn
                                                v-if="dataShops.Shop.isConflict && status === 'process'"
                                                @click.native="showPackageModal(dataShops.RequestTransferRealtime.id, dataShops.Shop.order)"
                                                data-style="zoom-out"
                                                class="btn btn-info"
                                                size="sm" style="width: 110px"
                                        >
                                            Chênh lệch
                                        </ladda-btn>
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
            <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="htmlTransfer" v-if="loadingTransfer" />
            <b-modal ref="viewPkgModal" size="lg" scrollable title="Chi tiết đơn hàng chênh lệch tiền">
                <div class="d-block scrollable strip">
                    <div class="table-responsive mb-4">
                        <table class="table mb-0 table-bordered table-striped">
                            <thead class="" style="width: 100%">
                            <tr>
                                <th width="10%">Mã đơn hàng</th>
                                <th width="45%">Yêu cầu chuyển tiền</th>
                                <th width="45%">Thông tin đối soát</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="no-data" v-if="packageConflict.length === 0">
                                <td colspan="3" style="height: 200px; vertical-align: middle">
                                    <b-alert show variant="warning">Không tìm thấy dữ liệu phù hợp, vui lòng kiểm tra lại!</b-alert>
                                </td>
                            </tr>
                            <tr v-for="pkg in packageConflict" class="tr-bill">
                                <td>
                                    <a
                                            :href="clickAlias(pkg.alias)"
                                            target="_blank"
                                            class="text-decoration-none text-alias"
                                    >
                                        {{ pkg.alias }}
                                    </a> <br />
                                </td>
                                <td class="bill-info">
                                    <span class="font-weight-bold">Trạng thái: </span><br/>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.current_package_status_id, pkg.package_status_id) }">
                                        {{ packageStatuses[pkg.current_package_status_id] }}</span> <br/>
                                    <span class="font-weight-bold">Tiền thu hộ: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.pick_money, pkg.audit_pick_money) }">
                                        {{ parseFloat(pkg.pick_money) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Phí ship: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.ship_money, pkg.audit_ship_money) }">
                                        {{ parseFloat(pkg.ship_money) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Phí bảo hiểm: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.insurance, pkg.audit_insurance) }">
                                        {{ parseFloat(pkg.insurance) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Shop trả trước: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.prepayment, pkg.audit_prepayment) }">
                                        {{ parseFloat(pkg.prepayment) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Phí chuyển hoàn: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.return_fee, pkg.audit_return_fee) }">
                                        {{ parseFloat(pkg.return_fee) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Khuyến mãi: </span> {{ parseFloat(pkg.discount) | toCurrency }}<br/>
                                    <span class="font-weight-bold">Phí thay đổi địa chỉ giao: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.ch_addr_fee, pkg.audit_ch_addr_fee) }">
                                        {{ parseFloat(pkg.ch_addr_fee) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Shop trả ship khi trả hàng: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup('0', pkg.audit_return_debt) }">0</span><br/>
                                    <span class="font-weight-bold">Phí lưu kho: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup('0', pkg.audit_store_fee) }">0</span><br/>
                                    <span class="font-weight-bold">Tiền chuyển shop: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.cashback, pkg.audit_cashback) }">
                                        {{ parseFloat(pkg.cashback) | toCurrency }} </span><br/>
                                </td>
                                <td class="bill-info">
                                    <span class="font-weight-bold">Trạng thái: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.current_package_status_id, pkg.package_status_id) }"><br/>
                                        {{ packageStatuses[pkg.package_status_id] }}</span> <br/>
                                    <span class="font-weight-bold">Tiền thu hộ: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.pick_money, pkg.audit_pick_money) }">
                                        {{ parseFloat(pkg.audit_pick_money) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Phí ship: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.ship_money, pkg.audit_ship_money) }">
                                        {{ parseFloat(pkg.audit_ship_money) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Phí bảo hiểm: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.insurance, pkg.audit_insurance) }">
                                        {{ parseFloat(pkg.audit_insurance) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Shop trả trước: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.prepayment, pkg.audit_prepayment) }">
                                        {{ parseFloat(pkg.audit_prepayment) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Phí chuyển hoàn: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.return_fee, pkg.audit_return_fee) }">
                                        {{ parseFloat(pkg.audit_return_fee) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Khuyến mãi: </span> {{ parseFloat(pkg.audit_discount) | toCurrency }}<br/>
                                    <span class="font-weight-bold">Phí thay đổi địa chỉ giao: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.ch_addr_fee, pkg.audit_ch_addr_fee) }">
                                        {{ parseFloat(pkg.audit_ch_addr_fee) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Shop trả ship khi trả hàng: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup('0', pkg.audit_return_debt) }">
                                        {{ parseFloat(pkg.audit_return_debt) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Phí lưu kho: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup('0', pkg.audit_store_fee) }">
                                        {{ parseFloat(pkg.audit_store_fee) | toCurrency }}</span><br/>
                                    <span class="font-weight-bold">Tiền chuyển shop: </span>
                                    <span v-bind:class="{ 'font-weight-bold text-danger': isDup(pkg.cashback, pkg.audit_cashback) }">
                                        {{ parseFloat(pkg.audit_cashback) | toCurrency }} </span><br/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div slot="modal-footer" class="w-100">
                    <ladda-btn class="float-right btn btn-success" variant="default" @click.native="hidePackageModal">
                        Đóng
                    </ladda-btn>
                </div>
            </b-modal>
            <b-modal ref="rejectRequestModal" scrollable :title="rejectTitle">
                <div class="d-block scrollable strip">
                    <div  class="no-data" v-if="successSubmit === false">
                        <b-alert show dismissible variant="warning">
                            <i class="sidenav-icon ion ion-ios-warning"></i>
                            {{ notEmpty }}
                        </b-alert>
                    </div>
                    <div v-if="failReject">
                        <b-alert show dismissible variant="danger">
                            <i class="sidenav-icon ion ion-ios-warning"></i>
                            {{ message }}
                        </b-alert>
                    </div>
                    <b-form-textarea id="textarea1"
                                     style="overflow:auto"
                                     v-model="rejectDesc"
                                     placeholder="Nhập lý do từ chối yêu cầu chuyển tiền của shop"
                                     :rows="3"
                                     :max-rows="6"
                                     v-bind:class="{ errorClass: errorDesc }"
                                     @keyup.native="errorDesc = false"
                    >
                    </b-form-textarea>
                </div>
                <template v-slot:modal-footer="{ ok }">
                    <ladda-btn
                            :loading="loading[1]"
                            @click.native="handleRejectOk(1)"
                            data-style="zoom-out"
                            class="btn btn-danger"
                    >
                        Xác nhận
                    </ladda-btn>
                </template>
            </b-modal>
            <b-modal ref="confirmRequestModal" scrollable title="Xác nhận yêu cầu chuyển tiền">
                <div v-if="failConfirm">
                    <b-alert show dismissible variant="danger">
                        <i class="sidenav-icon ion ion-ios-warning"></i>
                        {{ message }}
                    </b-alert>
                </div>
                <div>
                    <div class="fee-transfer"></div>
                    <div class="fee-transfer">
                        <span class="font-weight-bold">Mã yêu cầu: {{ confirmRequestCode }}</span><br/>
                        <span class="font-weight-bold">Số ĐH: {{ confirmCountPkg }}</span><br/>
                        <span class="font-weight-bold">Tổng tiền chuyển: {{ parseFloat(confirmCashback) | toCurrency }}</span>
                    </div>
                </div>
                <template v-slot:modal-footer="{ ok }">
                    <ladda-btn
                            :loading="loading[2]"
                            @click.native="handleConfirmOk(2)"
                            data-style="zoom-out"
                            class="btn btn-success"
                    >
                        Xác nhận
                    </ladda-btn>
                </template>
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
import transferService from 'domain/services/transfer-service'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import { SidenavRouterLink } from '@/vendor/libs/sidenav'
import SelectStations from 'components/elements/FilterBox/SelectStations'
import SelectBankShop from 'components/elements/FilterBox/SelectBankShop'
import moment from 'moment'

Vue.use(BlockUI)

export default {
  components: {
    Datepicker,
    Multiselect,
    LaddaBtn,
    LoadingMiniBottom,
    SidenavRouterLink,
    SelectStations,
    SelectBankShop
  },
  data: () => ({
    selected: {
      banks: []
    },
    shops: {
      shop_code: ''
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
    checkResult: false,
    appLoading: false,
    loadingTransfer: false,
    htmlTransfer: `<div class="sk-folding-cube sk-primary">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
        </div>
        <h5 class="text-center mb-0">LOADING...</h5>`,
    listShops: [],
    packageStatuses: [],
    successTransfer: false,
    failTransfer: false,
    dismissSeconds: 5,
    dismissCountDownSE: 0,
    dismissCountDownER: 0,
    msgNotify: '',
    message: '',
    packageConflict: [],
    transferDone: false,
    inputDisable: false,
    disableConfirm: true,
    selectRequestStatus: { name: 'Đang chờ duyệt', code: 'process' },
    requestStatus: [
      { name: 'Đang chờ duyệt', code: 'process' },
      { name: 'Đã duyệt', code: 'confirmed' },
      { name: 'Đã từ chối', code: 'rejected' }
    ],
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
    status: '',
    rejectShopOrder: '',
    rejectShopCode: '',
    rejectRequestId: '',
    rejectDesc: '',
    rejectTitle: '',
    failReject: false,
    errorDesc: false,
    notEmpty: '',
    successSubmit: true,
    rejectDone: false,
    confirmShopOrder: '',
    confirmRequestId: '',
    confirmRequestCode: '',
    confirmCountPkg: '',
    confirmCashback: '',
    failConfirm: false,
    confirmDone: false
  }),
  methods: {
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    dateSelectedFromInChild: function (date) {
      this.from = date
    },
    dateSelectedToInChild: function (date) {
      this.to = date
    },
    resetForm: function () {
      // Reset data of component select box
      this.shops.shop_code = ''
      this.$refs.select_banks.reset()
    },
    showRejectModal: function (requestId, shopOrder, shopCode) {
      this.failReject = false
      this.errorDesc = false
      this.successSubmit = true
      this.rejectShopOrder = shopOrder
      this.rejectShopCode = shopCode
      this.rejectRequestId = requestId
      this.rejectDesc = ''
      this.rejectTitle = 'Từ chối yêu cầu chuyển tiền ' + shopCode
      this.$refs.rejectRequestModal.show()
    },
    hideRejectModal: function () {
      this.$refs.rejectRequestModal.hide()
    },
    handleRejectOk (i) {
      this.errorDesc = false
      if (!this.rejectDesc) {
        this.errorDesc = true
        this.notEmpty = 'Vui lòng nhập lý do từ chối yêu cầu chuyển tiền!'
        this.successSubmit = false
      } else {
        this.errorDesc = false
        this.successSubmit = true
        this.notEmpty = ''
        let data = {
          'shop_order': this.rejectShopOrder,
          'request_id': this.rejectRequestId,
          'desc': this.rejectDesc
        }
        this.handleRejectSubmit(data, i)
      }
    },
    handleRejectSubmit: function (data, i) {
      let self = this
      this.startLoading(i)
      transferService.rejectTransferRealtime(data).then(result => {
        if (result.data.success) {
          self.$refs.rejectRequestModal.hide()
          self.searchShop(self.pageData.currentPage, true, 7)
          self.rejectDone = true
          self.msgNotify = result.data.message
          self.failReject = false
        } else {
          self.failReject = true
          self.rejectDone = false
          self.message = result.data.message
        }
        self.updateLoadingValue(i, false)
      }).catch(error => {
        if (error) {
          alert('Có lỗi xảy ra. Vui lòng kiểm tra lại!')
        }
        self.updateLoadingValue(i, false)
      }).then(function () {
        if (self.rejectDone) {
          self.successTransfer = true
          self.dismissCountDownSE = self.dismissSeconds
        }
        self.updateLoadingValue(i, false)
      })
    },
    clickAlias: function (alias) {
      return '/admin?alias=' + alias
    },
    searchShop: function (page, newSearchConditions, i) {
      let self = this

      let dataSend = {
        'shop_code': self.shops.shop_code,
        'against_bank_name': self.selected.banks,
        'rq_status': self.selectRequestStatus.code,
        'created_from': self.customFormatter(self.from),
        'created_to': self.customFormatter(self.to),
        'page': page
      }
      // Truong hop nguoi dung tim kiem voi dieu kien loc moi
      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      // Enable loading
      self.loadingTransfer = true
      this.startLoading(i)
      transferService.searchRequestWaitConfirm(dataSend).then(response => {
        if (response.data.success) {
          self.packageStatuses = response.data.options.packageStatuses
          self.checkResult = response.data.success
          self.pageData.totalItems = response.data.options.total
          self.pageData.perPage = response.data.options.per_page
          self.pageData.totalPages = response.data.options.total_page
          self.listShops = response.data.options.shops
          self.status = response.data.options.status
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
        self.loadingTransfer = false
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
    showConfirmModal: function (requestId, shopOrder, countPkg, cashback, requestCode) {
      this.failConfirm = false
      this.confirmShopOrder = shopOrder
      this.confirmRequestId = requestId
      this.confirmRequestCode = requestCode
      this.confirmCountPkg = countPkg
      this.confirmCashback = cashback
      this.$refs.confirmRequestModal.show()
    },
    hideConfirmModal: function () {
      this.$refs.confirmRequestModal.hide()
    },
    handleConfirmOk (i) {
      let data = {
        'shop_order': this.confirmShopOrder,
        'request_id': this.confirmRequestId,
        'type': 'shop_request'
      }
      this.handleConfirmSubmit(data, i)
    },
    handleConfirmSubmit: function (data, i) {
      let self = this
      self.failConfirm = false
      this.startLoading(i)
      transferService.confirmTransferRealtime(data).then(result => {
        if (result.data.success) {
          self.$refs.confirmRequestModal.hide()
          self.searchShop(self.pageData.currentPage, true, 7)
          self.confirmDone = true
          self.msgNotify = result.data.message
          self.failConfirm = false
        } else {
          self.failConfirm = true
          self.confirmDone = false
          self.message = result.data.message
        }
        self.updateLoadingValue(i, false)
      }).catch(error => {
        if (error) {
          alert('Có lỗi xảy ra. Vui lòng kiểm tra lại!')
        }
        self.updateLoadingValue(i, false)
      }).then(function () {
        if (self.confirmDone) {
          self.successTransfer = true
          self.dismissCountDownSE = self.dismissSeconds
        }
        self.updateLoadingValue(i, false)
      })
    },
    showPackageModal: function (requestId, shopOrder) {
      let data = {
        'shop_order': shopOrder,
        'request_id': requestId
      }
      this.packageConflict = []
      transferService.viewPackageConflict(data).then(result => {
        if (result.data.success) {
          this.packageConflict = result.data.options.packages
        } else {
          this.packageConflict = []
        }
      }).catch(error => {
        if (error) {
          alert('Có lỗi xảy ra. Vui lòng kiểm tra lại!')
        }
      })
      this.$refs.viewPkgModal.show()
    },
    hidePackageModal: function () {
      this.$refs.viewPkgModal.hide()
    },
    isDup: function (value, otherValue) {
      return value !== otherValue
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
  },
  mounted: function () {
    this.searchShop(this.pageData.currentPage, true)
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
    .fee-count {
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
    .fee-transfer {
        display: table-cell;
        vertical-align: top;
        padding-left: 15px;
    }
    .form-filter {
        border: 1px solid #ccc;
        border-radius: 5px;
        background: white;
        padding: 20px;
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
    .log-bill {
        margin: 10px;
    }
    .scrollable {
        max-height: 600px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .strip>div:nth-child(odd){
        background: #f8f8f8;
    }
    .show-package {
        position: absolute;
        top: 10px;
        right: 0;
        border: 1px solid #ccc;
        padding: 0px;
        border-radius: 5px;
        color: #1e70cd;
    }
    .errorClass {
        border: 1px solid red;
    }
</style>
