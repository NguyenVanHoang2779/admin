<template>
  <div>
    <h4 class="ui-block-heading mb-5">Quản lý tài nguyên doanh nghiệp</h4>
    <div>
      <b-row class="mb-4">
        <b-col md="12">
          <b-card-group>
            <b-card no-body>
              <b-card-header header-tag="h6" class="with-elements">
                <div class="card-header-title">Quản lý nhân sự</div>
              </b-card-header>
              <b-card-body>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/profile/masters' class="blink">Quản lý hồ sơ chính (master profile)</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-md-search text-primary"></i>
                  <router-link to='/staff/search' class="blink">Tra cứu thông tin nhân viên</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-md-stats text-primary"></i>
                  <router-link to='/profile-statistic/charts' class="blink">Thống kê nhân sự</router-link>
                </div>
<!--                <div class="mb-4">-->
<!--                  <i class="ion ion-md-ribbon text-primary"></i>-->
<!--                  <router-link to='/hr-order/list' class="blink">Quản lý đề xuất nhân sự</router-link>-->
<!--                </div>-->
                <div class="mb-4" v-if="['22'].includes(groupId)">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to="/profile/user-lock" class="blink">Quản lý nhân viên bị khóa app</router-link>
                </div>
<!--                <div class="mb-4">-->
<!--                  <i class="ion ion-md-attach text-primary"></i>-->
<!--                  <router-link to="/profile-manager" class="blink">Quản lý hồ sơ</router-link>-->
<!--                </div>-->
<!--                <div class="mb-4">-->
<!--                  <i class="ion ion-md-bicycle text-primary"></i>-->
<!--                  <router-link to="/driverx/jobs" class="blink">Driverx</router-link>-->
<!--                </div>-->
<!--                <div class="mb-4">-->
<!--                  <i class="ion ion-ios-construct text-primary"></i>-->
<!--                  <router-link to='/candidate/list' class="blink">Quản lý ứng viên</router-link>-->
<!--                </div>-->
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to="/hrteam/working-overtime" class="blink">Quản lý tăng ca</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to="/kpi/modules/manage" class="blink">Quản lý nhân viên Module (KPI)</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to="/work-schedule/manage" class="blink">Quản lý lịch làm việc của Cod</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to="/work-schedule/config" class="blink">Config lịch làm việc cho Cod</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to="/dxteam/manage" class="blink">Chuyển đổi tài khoản Dxteam</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-md-cloud-upload text-primary"></i>
                  <router-link to="/upload-file/tax-or-account" class="blink">Upload file số tài khoản và mã số thuế</router-link>
                </div>
              </b-card-body>
            </b-card>
            <b-card no-body>
              <b-card-header header-tag="h6" class="with-elements">
                <div class="card-header-title">Lương & Phúc lợi</div>
              </b-card-header>
              <b-card-body>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/contract/manager' class="blink">Quản lý hợp đồng</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/erp/payslip/manager' class="blink">Quản lý lương NET NVVP</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/erp/partnership-payslip/manager' class="blink">Quản lý lương NET NV HTKD</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-md-mail-unread text-primary"></i>
                  <router-link to='/cods/message' class="blink">Thông báo lỗi hệ thống lương</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/erp/payslip/deposit' class="blink">Quản lý thông tin tiền đặt cọc</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to="/erp/payslip/deposit/config/manage" class="blink">Config cọc đầu vào</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <a href="/admin/timesheet/manager-checkin" class="blink">Quản lý công - phép</a>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/dependant-person/manager' class="blink">QL Người phụ thuộc của NV</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-md-search text-primary"></i>
                  <router-link to='/insurance/list' class="blink">Tra cứu thông tin NV đóng bảo hiểm</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/union/manager' class="blink">Quản lý công đoàn</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-md-ribbon text-primary"></i>
                  <router-link to='/coupon/manage' class="blink">Quản lý coupon</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-md-ribbon text-primary"></i>
                  <router-link to='/ref-reward/' class="blink">Danh sách thưởng giới thiệu</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-md-ribbon text-primary"></i>
                  <router-link to='/holiday-workshift/manage' class="blink">Danh sách ngày nghỉ lễ</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-md-ribbon text-primary"></i>
                  <router-link to='/income-tax' class="blink">Quản lý chứng từ thuế</router-link>
                </div>
              </b-card-body>
            </b-card>
            <b-card no-body>
              <b-card-header header-tag="h6" class="with-elements">
                <div class="card-header-title">Đào tạo & Phát triển</div>
              </b-card-header>
              <b-card-body>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/erp/document/manage' class="blink">Quản lý văn bản</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-md-ribbon text-primary"></i>
                  <router-link to='/erp/profile/template-manage' class="blink">Quản lý E-Template</router-link>
                </div>
                <div v-if="userInfo && userInfo.User && userInfo.User.group_id ==15" class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to="/staff-review" class="blink">Quản lý review nhân viên</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/evaluation/manage' class="blink">Quản lý thông tin đánh giá NV</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-md-cloud-upload text-primary"></i>
                  <router-link to='/erp/payslip/adjust-upload' class="blink">Upload thông tin thưởng phạt</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/shop-vote/manage' class="blink">Quản lý thẻ tự động</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-md-ribbon text-primary"></i>
                  <router-link to='/sos-noi-bo/config-type' class="blink">SOS nội bộ</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link :to="{ name: 'position-detail-edit' }" class="blink">Quản lý nội dung công việc</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-md-flower text-primary"></i>
                  <router-link :to="{ name: 'medal-manage' }" class="blink">Quản lý danh hiệu</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-body text-primary"></i>
                  <router-link :to="{ name: 'training-list' }" class="blink">Quản lý đào tạo</router-link>
                </div>
              </b-card-body>
            </b-card>
            <b-card no-body>
              <b-card-header header-tag="h6" class="with-elements">
                <div class="card-header-title">Cấu hình</div>
              </b-card-header>
              <b-card-body>
                <div class="mb-4">
                  <i class="ion ion-md-ribbon text-primary"></i>
                  <router-link to='/permission/manage' class="blink">Quản lý quyền nhân sự</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/hrteam/manage' class="blink">Cơ cấu team nhân sự</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/position/manage' class="blink">Quản lý leader bộ phận, vị trí</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link :to="{ name: 'list-kpi-config'}" class="blink">Config tính KPI</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/emp-position/manage' class="blink">Quản lý vị trí công việc</router-link>
                </div>
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/kpi/shift-manage' class="blink">Quản lý ca làm việc XLHH</router-link>
                </div>
<!--                <div class="mb-4">-->
<!--                  <i class="ion ion-ios-construct text-primary"></i>-->
<!--                  <router-link to='/team-config/list' class="blink">Cơ cấu team trung tâm công nghệ</router-link>-->
<!--                </div>-->
                <div class="mb-4">
                  <i class="ion ion-ios-construct text-primary"></i>
                  <router-link to='/team-config/list-new' class="blink">Cơ cấu team trung tâm công nghệ</router-link>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
      <b-row class="mb-4">
        <b-col>
          <b-card no-body>
            <b-card-header header-tag="h6" class="with-elements">
              <div class="card-header-title">Xe thuê</div>
            </b-card-header>
            <div class="no-gutters row-bordered">
              <b-card-body>
                <b-row>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/profile-company/masters" class="blink"
                          >Quản lý hồ sơ công ty (master profile
                          company)</router-link
                        >
                      </b-col>
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/air-line/awbs" class="blink"
                          >Quản lý AWB của công ty vận tải hàng
                          không</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/truck/manage" class="blink"
                          >Quản lý xe tải</router-link
                        >
                      </b-col>
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link
                          to="/salary/export-rent-truck-price"
                          class="blink"
                          >Xuất cước xe thuê</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/truck-routes/manage" class="blink"
                          >Quản lý lộ trình</router-link
                        >
                      </b-col>
                       <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to='/air-line/awb-price' class="blink">Quản lý AWB Price</router-link>
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/train/train-bill" class="blink"
                        >Quản lý bill tàu</router-link
                        >
                      </b-col>
                      <b-col>
                        <i class="ion ion-md-cloud-upload text-primary"></i>
                        <router-link to="/truck/config-oil-limit" class="blink"
                        >Upload định mức dầu</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/rent-truck/config-province" class="blink">Config cước liên miền theo tỉnh</router-link>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card-body>
            </div>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="mb-4">
        <b-col>
          <b-card no-body>
            <b-card-header header-tag="h6" class="with-elements">
              <div class="card-header-title">Xe nhà</div>
            </b-card-header>
            <div class="no-gutters row-bordered">
              <b-card-body>
                <b-row>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <a v-if="domainKpiSalary" target="_blank" :href="domainKpiSalary" class="blink">Chạy và xuất lương tháng</a>
                        <router-link
                          v-else
                          to="/salary/export-driver-salary"
                          class="blink"
                        >Chạy và xuất lương tháng</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link
                          to="/salary/export-bot-driver"
                          class="blink"
                          >Xuất điểm bot tài xế</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to='/export-driver-session-point' class="blink">Xuất dữ liệu điểm dừng tài xế</router-link>
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to='/route/manage-conf-min-wage-driver' class="blink">Màn config lương tối thiểu</router-link>
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to='/config-driver-value' class="blink">Màn config mở bỏ phạt tài xế</router-link>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link
                          to="/salary/review-driver-ot-session"
                          class="blink"
                          >Duyệt phiên tăng ca tài xế</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-search text-primary"></i>
                        <router-link
                          to="/salary/driver-session-data"
                          class="blink"
                          >Tìm kiếm phiên làm việc tài xế</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to='/route/manage-difficult-route' class="blink">Quản lý Lộ Trình Khó</router-link>
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to='/driverx/driver-penalties' class="blink">Đề xuất bỏ và duyệt thẻ phạt</router-link>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card-body>
            </div>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="mb-4">
        <b-col>
          <b-card no-body>
            <b-card-header header-tag="h6" class="with-elements">
              <div class="card-header-title">Sale</div>
            </b-card-header>
            <div class="no-gutters row-bordered">
              <b-card-body>
                <b-row>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-search text-primary"></i>
                        <router-link to="/sales/show-salary" class="blink"
                          >Xem lương</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-search text-primary"></i>
                        <router-link
                          to="/sales/check-duplicate-shop"
                          class="blink"
                          >Kiểm tra shop trùng</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/sales/manager-sale-team" class="blink"
                          >Gán Sale cho người quản lý</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-search text-primary"></i>
                        <router-link
                          to="/sales/manage-export-sale-salary"
                          class="blink"
                          >Chạy Và Xuất Bảng Lương</router-link
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/sales/team-process" class="blink"
                          >Gán Team-Process</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-create text-primary"></i>
                        <router-link
                          to="/sales/update-shop-package"
                          class="blink"
                          >Update shop package</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-create text-primary"></i>
                        <router-link
                          to="/sales/support-salary-sale"
                          class="blink"
                        >Support salary sale</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to="/sales/export-data-shop" class="blink"
                          >Xuất data shop chi tiết</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-create text-primary"></i>
                        <router-link to="/sales/sale-formula" class="blink"
                        >Sale Formula</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-create text-primary"></i>
                        <router-link to="/sales/sale-region" class="blink"
                        >Đánh Sale trái miền</router-link
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card-body>
            </div>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="mb-4">
        <b-col>
          <b-card no-body>
            <b-card-header header-tag="h6" class="with-elements">
              <div class="card-header-title">COD cộng tác viên</div>
            </b-card-header>
            <div class="no-gutters row-bordered">
              <b-card-body>
                <b-row>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/kpi/cods/cod-ctv-config" class="blink"
                        >Màn config lương Cộng tác viên</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-search text-primary"></i>
                        <router-link to="/cods/cod-order" class="blink"
                        >Tool thống kê đơn/ điểm COD</router-link
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to="/cods/ctv" class="blink"
                        >Tool xuất lương cộng tác viên</router-link
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card-body>
            </div>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="mb-4">
        <b-col>
          <b-card no-body>
            <b-card-header header-tag="h6" class="with-elements">
              <div class="card-header-title">CSKH B2C</div>
            </b-card-header>
            <div class="no-gutters row-bordered">
              <b-card-body>
                <b-row>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                          to="/customer-cares/leader-member-b2c"
                          class="blink"
                          >Gán CSKH cho người quản lý</router-link
                        >
                      </b-col>
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                          to="/customer-cares/run-export-salary-c2c"
                          class="blink"
                        >Chạy & Xuất Lương Cho Cskh C2c</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link
                                to="/customer-cares/check-data-salary"
                                class="blink"
                        >Check Dữ Liệu Lương</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link
                                to="/customer-cares/manage-shop-duplicate"
                                class="blink"
                        >Quản lý shop trùng</router-link
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link
                          to="/customer-cares/export-salary"
                          class="blink"
                          >Chạy và xuất excel bảng lương CSKH</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link
                          to="/customer-cares/export-shop-gone-away"
                          class="blink"
                        >Xem & Xuất Danh Sách Shop Rời Bỏ</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link
                                to="/customer-cares/export-order"
                                class="blink"
                        >Xuất chi tiết Shop B2C</router-link
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card-body>
            </div>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="mb-4">
        <b-col>
          <b-card no-body>
            <b-card-header header-tag="h6" class="with-elements">
              <div class="card-header-title">Nhân viên văn phòng</div>
            </b-card-header>
            <div class="no-gutters row-bordered">
              <b-card-body>
                <b-row>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                          to="/salary/quality-config-v2"
                          class="blink"
                        >Quản lý bỏ toàn trình</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                          to="/quality-config/ws-quality-config"
                          class="blink"
                        >Quản lý phiên toàn trình</router-link
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to='/salary/export-salary' class="blink">Export lương NVVP</router-link>
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to='/truck-monitor/export-salary' class="blink">Export lương Giám sát xe tải</router-link>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card-body>
            </div>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="mb-4">
        <b-col>
          <b-card no-body>
            <b-card-header header-tag="h6" class="with-elements">
              <div class="card-header-title">Nhân viên xử lý hàng</div>
            </b-card-header>
            <div class="no-gutters row-bordered">
              <b-card-body>
                <b-row>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/profile/masters" class="blink"
                          >Quản lý profile chính của nhân viên</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/bag/bag-config" class="blink"
                        >Thông tin quản lý chia bao</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                                to="/quality-config/ws-quality-config"
                                class="blink"
                        >Quản lý phiên toàn trình</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                                to="/module/module-province"
                                class="blink"
                        >Quản lý Module</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                          to="/salary/sgw-config-pk-part-time"
                          class="blink"
                          >Quản lý Config NVXLH thời vụ</router-link
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to="/salary/export-salary-lv" class="blink"
                          >Export lương liên vùng</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to="/salary/export-salary-nv" class="blink"
                          >Export lương nội vùng</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to="/export-salary-pk-parttime" class="blink"
                          >Export lương XLH thời vụ</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to="/export-salary-xlh-2021" class="blink"
                          >Export lương XLH Lego - 2021</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to="/export-salary-xlh-buucuc-2021" class="blink"
                        >Export lương XLH Buu Cuc - 2021</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to="/salary/export-salary-xlh-onsite-2020" class="blink"
                        >Export lương XLH Onsite - 2020</router-link
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card-body>
            </div>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card no-body>
            <b-card-header header-tag="h6" class="with-elements">
              <div class="card-header-title">COD</div>
            </b-card-header>
            <div class="no-gutters row-bordered">
              <b-card-body>
                <b-row>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-create text-primary"></i>
                        <router-link to="/salary/update-area" class="blink"
                          >Update vùng đơn và xóa đơn COD</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-create text-primary"></i>
                        <router-link
                          to="/salary/update-package-area-excel"
                          class="blink"
                          >Update vùng đơn COD bằng excel</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-create text-primary"></i>
                        <router-link
                          to="/salary/update-area-by-cod"
                          class="blink"
                          >Update vùng đơn theo mã COD</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-create text-primary"></i>
                        <router-link
                          to="/salary/collection-salary-tools?id=5"
                          class="blink"
                          >Update đơn now COD và phụ cấp COD</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/profile/masters" class="blink"
                          >Quản lý profile chính của nhân viên</router-link
                        >
                      </b-col>
                    </b-row>

                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                          to="/salary/minimum-cod-salary/"
                          class="blink"
                          >Gán mức lương tối thiểu cho COD</router-link
                        >
                      </b-col>
                    </b-row>

                    <b-row class="mb-4">
                      <b-col>
                          <i class="ion ion-ios-construct text-primary"></i>
                          <router-link
                                  to="/manager-files/"
                                  class="blink"
                          >Quản lý file cơ chế lương</router-link
                          >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                          to="/XTeam/manageCoupons"
                          class="blink"
                        >Config coupon XTeam</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                          to="/xteam-route-new"
                          class="blink"
                        >Lộ trình XTeam</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                          to="/kpi/config-cancel-penalties"
                          class="blink"
                        >Config bỏ phạt</router-link
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-eye text-primary"></i>
                        <router-link
                          to="/salary/collection-salary-tools?id=1"
                          class="blink"
                          >Show lương COD</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-eye text-primary"></i>
                        <router-link
                          to="/salary/show-area-packages"
                          class="blink"
                          >Show vùng tính lương của COD</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to="/salary/export-work-data" class="blink"
                          >Export bảng lương COD</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-create text-primary"></i>
                        <router-link
                          to="/salary/collection-salary-tools?id=4"
                          class="blink"
                          >Update lương tối thiểu COD</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-create text-primary"></i>
                        <router-link
                          to="/salary/collection-salary-tools?id=3"
                          class="blink"
                          >Update công thức lương COD các tháng
                          trước</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                          to="/salary/config-checkin-cod-v3"
                          class="blink"
                          >Config checkin cho COD PK</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                          to="/salary/transit-data-work-manager"
                          class="blink"
                          >Check log dữ liệu COD trung chuyển
                          partime</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                          to="/salary/config-cod-index"
                          class="blink"
                        >Config chỉ số cod</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link
                          to="/salary/config-salary-cod"
                          class="blink"
                        >Config bỏ phạt cod tỉnh</router-link
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="5">
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-create text-primary"></i>
                        <router-link
                          to="/salary/extra-route-configs"
                          class="blink"
                          >Update lương tối thiểu và ngày công chuẩn tài xế theo
                          tuyến</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link
                                to="/salary/export-transit-cod"
                                class="blink"
                        >Tool bảng lương cod trung chuyển tỉnh</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to="/cods/configctv" class="blink">Quản lý Cod CTV</router-link>
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                          <i class="ion ion-md-cloud-download text-primary"></i>
                          <router-link to="/salary/training-cod" class="blink">Config giờ đào tạo COD STAR</router-link>
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-cloud-download text-primary"></i>
                        <router-link to="/salary/cod-start" class="blink">Tool chốt lương CodStar</router-link>
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/cods/cod-penalties" class="blink">Quản lý report hỏng đơn</router-link>
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/kpi/penalties" class="blink">Quản lý phạt</router-link>
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/kpi/cods/export-salary-cod-v2" class="blink">Xuất lương COD</router-link>
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/kpi/bonus" class="blink">Quản lý thưởng</router-link>
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/kpi/penalties/approval-penalties" class="blink">Quản lý người duyệt thẻ</router-link>
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/salary/dashboard" class="blink">Quản lý biến động lương</router-link>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card-body>
            </div>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card no-body>
            <b-card-header header-tag="h6" class="with-elements">
              <div class="card-header-title">Config</div>
            </b-card-header>
            <div class="no-gutters row-bordered">
              <b-card-body>
                <b-row>
                  <b-col>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-md-construct text-primary"></i>
                        <router-link to="/config-role/manage" class="blink"
                        >Config phân quyền</router-link
                        >
                      </b-col>
                    </b-row>
                    <b-row class="mb-4">
                      <b-col>
                        <i class="ion ion-ios-construct text-primary"></i>
                        <router-link to="/kpi/config-salary" class="blink">Config salary</router-link>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card-body>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<style>
.blink:hover {
  color: #242424;
  text-decoration: underline;
}
</style>

<script>
import depositService from 'domain/services/deposit-service'
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard-erp',

  components: {},

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },

  data: () => ({
    groupId: '',
    domainKpiSalary: process && process.env && process.env.VUE_APP_DOMAIN_KPI ? (process.env.VUE_APP_DOMAIN_KPI + '/adm/salary/export-driver-salary') : ''
  }),

  created () {
    this.getGroupIdOfUser()
  },

  methods: {
    getGroupIdOfUser: function () {
      depositService
        .getGroupIdOfUser()
        .then((res) => {
          if (res.data.success) {
            this.groupId = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
