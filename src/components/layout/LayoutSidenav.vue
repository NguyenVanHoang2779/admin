<template>
  <sidenav :orientation="orientation" :class="curClasses">
    <!-- Inner -->
    <div class="sidenav-inner" :class="{ 'py-1': orientation !== 'horizontal' }">
      <!-- Brand -->
      <div class="app-brand">
      <b-navbar-brand to="/" class="app-brand-logo">
        <img src="https://admin.giaohangtietkiem.vn/img/logo_57.png" alt="ECOM JSC" class="logo" data-aui-responsive-header-index="0" v-bind:width="36">
      </b-navbar-brand>
        <a href="https://admin.giaohangtietkiem.vn" class='text-logo app-brand-text demo sidenav-text font-weight-normal ml-2'> Giaohangtietkiem.vn</a>
      </div>
      <li class="sidenav-header small font-weight-semibold">DANH MỤC</li>
      <!-- Home -->
      <li class="sidenav-item">
        <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
          <i class="sidenav-icon ion ion-md-home"></i>
          <div>Home</div>
        </a>
        <ul class="sidenav-menu">
          <li class="sidenav-item" v-if="userInfo && userInfo.Group && [3, 8, 25].includes(parseInt(userInfo.Group.id))">
            <sidenav-router-link to="/dashboard/erp">Dashboard ERP</sidenav-router-link>
          </li>
          <li class="sidenav-item"><sidenav-router-link to="/dashboard/v2">Dashboard V2</sidenav-router-link></li>
          <!-- Dashboard V4 -->
          <li class="sidenav-item">
            <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
              <div>Dashboard V4</div>
            </a>
            <ul class="sidenav-menu">
              <li class="sidenav-item"><sidenav-router-link to="/dashboard/v4/overview-shop">Tổng quan shop</sidenav-router-link></li>
              <li class="sidenav-item"><sidenav-router-link to="/dashboard/v4/overview-package">Tổng quan đơn</sidenav-router-link></li>
              <li class="sidenav-item"><sidenav-router-link to="/dashboard/v4/overview-operation">Vận hành</sidenav-router-link></li>
            </ul>
          </li>
          <li class="sidenav-item"><sidenav-router-link to="/dashboard/external/overview-external">Dashboard liên vùng</sidenav-router-link></li>
          <li class="sidenav-item"><sidenav-router-link to="/dashboard/v5">Dashboard V5</sidenav-router-link></li>
        </ul>
      </li>
      <!-- Tìm kiếm nhân viên -->
      <sidenav-router-link to="/staff/search"  icon="ion ion-md-search" >Tìm kiếm nhân viên
      </sidenav-router-link>
      <!-- Quản lý khu vực lấy giao -->
      <sidenav-router-link to="/area/manager"  icon="fas fa-map-marker" >
        Quản lý khu vực lấy giao
      </sidenav-router-link>

      <!-- Layouts -->
      <!--<sidenav-menu icon="ion ion-ios-albums" :active="isMenuActive('/contract')" :open="isMenuOpen('/contract')">-->
        <!--<template slot="link-text">Quản lý hợp đồng</template>-->
        <!--<sidenav-router-link to="/contract/create" :exact="true">Tạo hợp đồng mới</sidenav-router-link>-->
      <!--</sidenav-menu>-->
      <!--<sidenav-menu icon="ion d-block ion-md-boat" :active="isMenuActive('/erp')" :open="isMenuOpen('/erp')">-->
        <!--<template slot="link-text">ERP</template>-->
        <!--<sidenav-router-link to="/erp/payslip/manager" :exact="true">Bảng lương</sidenav-router-link>-->
      <!--</sidenav-menu>-->
      <!-- Shop -->
      <li class="sidenav-item">
        <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
          <i class="sidenav-icon ion ion-md-speedometer"></i>
          <div>Shop</div>
        </a>
        <ul class="sidenav-menu">
          <li class="sidenav-item"><a href="/admin/shops" class="sidenav-link"><div>Danh sách shop</div></a></li>
          <li class="sidenav-item"><sidenav-router-link to="/shops/shopIncorrectBankInfo">Shop sai thông tin NH</sidenav-router-link></li>
          <li class="sidenav-item"><a href="/admin/shops/add" class="sidenav-link"><div>Thêm Shop</div></a></li>
          <li class="sidenav-item"><a href="/admin/shops/feedbacks/index" class="sidenav-link"><div>Yêu cầu</div></a></li>
          <li class="sidenav-item"><a href="/admin/shops/consultants" class="sidenav-link"><div>Thống kê TeleSale</div></a></li>
          <li class="sidenav-item"><a href="/admin/events/index" class="sidenav-link"><div>Events</div></a></li>
          <li class="sidenav-item"><a href="/admin/shops/shopHeaders" class="sidenav-link"><div>Shop headers</div></a> </li>
          <li class="sidenav-item"><a href="/admin/reviews" class="sidenav-link"><div>Đánh giá dịch vụ</div></a></li>
          <li class="sidenav-item"><sidenav-router-link to="/shops/leader-sale-b2c">Gán leader Sale B2C</sidenav-router-link></li>
          <li class="sidenav-item"><sidenav-router-link to="/shops/assign-pkonsite">Gán phụ kho onsite</sidenav-router-link></li>
          <li class="sidenav-item"><sidenav-router-link to="/shops/assign-presenter">Gán người giới thiệu shop</sidenav-router-link></li>
          <li class="sidenav-item"><sidenav-router-link to="/shops/export-shop-vat-info">Export thông tin Shop yêu cầu xuất hóa đơn VAT</sidenav-router-link></li>
          <li class="sidenav-item">
         <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
              <div>Cam kết hoàn</div>
            </a>
            <ul class="sidenav-menu">
              <li class="sidenav-item"><sidenav-router-link to="/shops/return-coupon">Gán cam kết hoàn</sidenav-router-link></li>
              <li class="sidenav-item"><sidenav-router-link to="/shops/return-coupon-result">Kết quả cam kết hoàn</sidenav-router-link></li>
              <li class="sidenav-item"><sidenav-router-link to="/shops/return-coupon-update">Điều chỉnh cam kết hoàn</sidenav-router-link></li>
            </ul>
          </li>
          <li class="sidenav-item">
            <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
              <div>Chiết khấu mới</div>
            </a>
            <ul class="sidenav-menu">
              <li class="sidenav-item"><sidenav-router-link to="/shops/new-deduction">Gán gói chiết khấu</sidenav-router-link></li>
              <li class="sidenav-item"><sidenav-router-link to="/shops/new-deduction-result">Kết quả chiết khấu</sidenav-router-link></li>
              <li class="sidenav-item"><sidenav-router-link to="/shops/new-deduction-update">Điều chỉnh chiết khấu</sidenav-router-link></li>
            </ul>
          </li>
          <li class="sidenav-item"><sidenav-router-link to="/shops/info-shop-debt">Phiến đối soát sắp tới</sidenav-router-link></li>
          <li class="sidenav-item"><sidenav-router-link to="/shops/cause">Quản lý Lý do đánh giá</sidenav-router-link></li>
          <li class="sidenav-item"><sidenav-router-link to="/shops/branch">Quản lý đại lý</sidenav-router-link></li>
        </ul>
      </li>

      <!-- COD -->
      <li class="sidenav-item">
        <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
          <i class="sidenav-icon ion ion-ios-people d-block"></i>
          <div>COD</div>
        </a>
      <ul class="sidenav-menu">
        <li class="sidenav-header small font-weight-semibold">CODS</li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/cods">Danh sách COD</a></li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/cods/add">Thêm COD</a></li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/cods/luong">Lương COD</a></li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/cods/statistic">Báo cáo COD</a></li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/cods/workPoints">Chấm công COD</a></li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/cods/smses">Tin nhắn COD</a></li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/assess/index">COD vote</a></li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/adm/cods/note">COD Ghi chú chốt ca</a></li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/stations">Quản lý kho</a></li>

        <li class="sidenav-header small font-weight-semibold">TUYẾN</li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/carts/index">Tuyến lấy/giao hàng</a></li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/carts/schedule">Chốt tuyến</a></li>

        <li class="sidenav-header small font-weight-semibold">MODULE</li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/modules">Quản lý Module</a></li>
        <li class="sidenav-header small font-weight-semibold">TEMPLATE</li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/notify/template">Mẫu thông báo</a></li>
        <!-- xe tải -->

        <li class="sidenav-header small font-weight-semibold">XE TẢI</li>
        <li class="sidenav-item"><sidenav-router-link to="/trucks/post-offices">Bưu cục BBS chuyên tuyến</sidenav-router-link></li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/trucks/listTrucks">Danh sách xe tải</a></li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/trucks/addTruck">Thêm xe tải</a></li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/trucks/listTruckRoutes">Danh sách tuyến</a></li>
        <li class="sidenav-item"><a class="sidenav-link"  href="/admin/trucks/addTruckRoute">Thêm tuyến mới</a></li>
      </ul></li>

      <li class="sidenav-item">
        <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
          <i class="sidenav-icon ion ion-md-planet d-block"></i>
          <div>Vận hành</div>
        </a>
        <ul class="sidenav-menu">
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin">Tiếp nhận đơn hàng</a></li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin/distributespick/instantly">Chốt giỏ hàng</a></li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin/checkpackages/recently">Đối soát hàng</a></li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin/picking">Quản lý lấy hàng</a></li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin/delivering">Quản lý thu tiền</a></li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin/returning">Quản lý trả hàng</a></li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin/transferring/import">Quản lý chuyển kho</a></li>
          <li class="sidenav-item"><sidenav-router-link to="/manage-list-bag-box">Quản lý bao hàng</sidenav-router-link></li>
          <li class="sidenav-item"><sidenav-router-link to="/log-bag-order/list">Quản lý log bao hàng</sidenav-router-link></li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin/transfer_to_return?type=2">Quản lý trả hàng liên vùng</a></li>
          <li class="sidenav-item">
            <a href="javascript:void(0)" class="sidenav-link sidenav-toggle"><div>Đối soát</div></a>
            <ul class="sidenav-menu">
              <li class="sidenav-item"><a class="sidenav-link"  href="/admin/audits/refund">Đối soát bồi hoàn</a></li>
              <li class="sidenav-item"><sidenav-router-link to="/new-audit-manual">Đối soát thủ công</sidenav-router-link></li>
              <li class="sidenav-item"><sidenav-router-link to="/audit-shopee">Đối soát Shopee</sidenav-router-link></li>
              <li class="sidenav-item"><sidenav-router-link to="/export-bill-audit">Xuất lại file Đối soát</sidenav-router-link></li>
              <li class="sidenav-item"><sidenav-router-link to="/audit-config-holiday">Đối soát nghỉ lễ</sidenav-router-link></li>
            </ul>
          </li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin/audits/audited">Gửi email đối soát</a></li>
          <li class="sidenav-item"><sidenav-router-link to="/auto-assign/list">Quản lý chia tự động </sidenav-router-link></li>
          <li class="sidenav-item">
            <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
              <div>Chiết khấu shop</div>
            </a>
            <ul class="sidenav-menu">
              <li class="sidenav-item"><a class="sidenav-link"  href="/admin/deduction-manager/shop">Quản lý chiết khấu shop</a></li>
              <li class="sidenav-item"><sidenav-router-link to="/deduction-again">Chạy lại chiết khấu Shop</sidenav-router-link></li>
            </ul>
          </li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin/bills">Hoá đơn</a></li>
          <li class="sidenav-item"><sidenav-router-link to="/bills/billCod">Hoá đơn COD</sidenav-router-link></li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin/delivers/endOfDay">Chốt ngày</a></li>
          <li class="sidenav-item">
            <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
              <div>Chuyển tiền realtime</div>
            </a>
            <ul class="sidenav-menu">
              <li class="sidenav-item"><sidenav-router-link to="/new-quick-transfer">Chuyển tiền realtime</sidenav-router-link></li>
              <li class="sidenav-item"><sidenav-router-link to="/confirm-quick-transfer">Xác nhận chuyển tiền realtime</sidenav-router-link></li>
            </ul>
          </li>
          <li class="sidenav-item"><sidenav-router-link to="/bills/pay-part-debt">Thanh toán nợ một phần</sidenav-router-link></li>
          <li class="sidenav-item">
            <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
              <div>G3PL</div>
            </a>
            <ul class="sidenav-menu">
              <li class="sidenav-item"><sidenav-router-link to="">Danh sách lộ trình</sidenav-router-link></li>
              <li class="sidenav-item"><sidenav-router-link to="/g3pl/booking/create">Tạo lộ trình</sidenav-router-link></li>
            </ul>
          </li>
          <li class="sidenav-item">
            <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
              <div>Sản phẩm</div>
            </a>
            <ul class="sidenav-menu">
              <li class="sidenav-item"><sidenav-router-link to="/prohibit-package/image-product">Quản lí hình ảnh</sidenav-router-link></li>
            </ul>
          </li>
          <li class="sidenav-item"><sidenav-router-link to="/frail-package/list">Quản lý hàng dễ vỡ</sidenav-router-link></li>
<!--          <li class="sidenav-item"><sidenav-router-link to="/config-bag/list">Quản lý Config Bao</sidenav-router-link></li>-->
          <li class="sidenav-item"><sidenav-router-link to="/manage-list-cod/list">Danh sách cấu hình COD</sidenav-router-link></li>
          <li class="sidenav-item"><sidenav-router-link to="/config-station/station">Quản lý Config kho</sidenav-router-link></li>
          <li class="sidenav-item"><sidenav-router-link to="/manage-list-cart/list">Quản lý tuyến</sidenav-router-link></li>
          <li class="sidenav-item"><sidenav-router-link to="/smart-locker">Quản lý tủ thông minh</sidenav-router-link></li>
        </ul>
      </li>

      <!-- Quản lý -->
      <li class="sidenav-item">
        <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
          <i class="sidenav-icon ion ion-md-business d-block"></i>
          <div>Quản lý</div>
        </a>
        <ul class="sidenav-menu">
          <li class="sidenav-item"><a class="sidenav-link"  href="/adm/erp/document/manage">Quản lý văn bản</a></li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin/fee-manager">Danh sách phí ship</a></li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin/device">Thiết bị</a></li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/admin/deduction-manager">Danh sách gói chiết khấu</a></li>
          <li class="sidenav-item"><hr class="sidenav-divider mb-2"></li>
          <li class="sidenav-item"><a class="sidenav-link"  href="/adm/wifi/manage">Wifi tại kho</a ></li>
          <li class="sidenav-item"><hr class="sidenav-divider mb-2"></li>
<!--          <li class="sidenav-item"><a href="/adm/candidate/list" class="sidenav-link">Quản lí nhân sự</a> </li>-->
          <li class="sidenav-item"><a href="/adm/hrteam/work-manage" class="sidenav-link">Danh sách quản lý công việc nhân sự</a> </li>
          <li class="sidenav-item"><a href="/adm/hrteam/manage" class="sidenav-link">Cơ cấu team nhân sự</a> </li>
          <li class="sidenav-item"><hr class="sidenav-divider mb-2"></li>
          <li class="sidenav-item"><a href="/adm/executive/manage" class="sidenav-link">Cơ cấu ban điều hành</a> </li>
          <li class="sidenav-item"><hr class="sidenav-divider mb-2"></li>
          <li class="sidenav-item"><a href="/adm/parking/manage" class="sidenav-link"><div>Gửi xe</div></a></li>
          <li class="sidenav-item"><a href="/adm/hrteam/working-overtime" class="sidenav-link"><div>Tăng ca</div></a></li>
        </ul>
      </li>

      <!-- Kho -->
      <li class="sidenav-item">
        <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
          <i class="sidenav-icon ion ion-ios-cube d-block"></i>
          <div>Kho</div>
        </a>
        <ul class="sidenav-menu">
          <li class="sidenav-item"><a href="/admin/product-categories/index" class="sidenav-link"><div>Danh mục</div></a></li>
          <li class="sidenav-item"><a href="/admin/products/index" class="sidenav-link"><div>Sản phẩm</div></a></li>
        </ul>
      </li>

      <li class="sidenav-divider mb-1"></li>

      <!-- Ticket -->
      <li class="sidenav-item">
        <a href="javascript:void(0)" class="sidenav-link sidenav-toggle">
          <i class="sidenav-icon ion ion-md-chatboxes d-block"></i>
          <div>Quản lý ticket</div>
        </a>

        <ul class="sidenav-menu">
          <li class="sidenav-item"><a href="/admin/issues" class="sidenav-link"><div>Ticket</div></a></li>
          <li class="sidenav-item"><a href="/admin/issues-refund" class="sidenav-link"><div>Bồi hoàn</div></a></li>
        </ul>
      </li>
      <!-- Thao tác nhanh -->
      <li class="sidenav-item">
        <a href="/admin/operations/quick" class="sidenav-link">
          <i class="sidenav-icon ion ion-ios-flash d-block"></i>
          <div>Thao tác nhanh</div>
        </a>
      </li>
    </div>
  </sidenav>
</template>

<script>
import { Sidenav, SidenavLink, SidenavRouterLink, SidenavMenu, SidenavHeader, SidenavBlock, SidenavDivider } from '@/vendor/libs/sidenav'
import { mapGetters } from 'vuex'

export default {
  name: 'app-layout-sidenav',
  components: {
    Sidenav,
    SidenavLink,
    SidenavRouterLink,
    SidenavMenu,
    SidenavHeader,
    SidenavBlock,
    SidenavDivider
  },

  props: {
    orientation: {
      type: String,
      default: 'vertical'
    }
  },

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    curClasses () {
      let bg = this.layoutSidenavBg

      if (this.orientation === 'horizontal' && (bg.indexOf(' sidenav-dark') !== -1 || bg.indexOf(' sidenav-light') !== -1)) {
        bg = bg
          .replace(' sidenav-dark', '')
          .replace(' sidenav-light', '')
          .replace('-darker', '')
          .replace('-dark', '')
      }

      return `bg-${bg} ` + (
        this.orientation !== 'horizontal'
          ? 'layout-sidenav'
          : 'layout-sidenav-horizontal container-p-x flex-grow-0'
      )
    }
  },

  methods: {
    isMenuActive (url) {
      return this.$route.path.indexOf(url) === 0
    },

    isMenuOpen (url) {
      return this.$route.path.indexOf(url) === 0 && this.orientation !== 'horizontal'
    },

    toggleSidenav () {
      this.layoutHelpers.toggleCollapsed()
    }
  }
}
</script>

<style scoped>
  .text-logo{
    color:#000!important;
    font-weight: bold!important;
    font-size: 16px;
  }
  .sidenav-vertical .app-brand {
    background: #02a065;
    margin-top: -4px;
    height: 60px;
  }
</style>
