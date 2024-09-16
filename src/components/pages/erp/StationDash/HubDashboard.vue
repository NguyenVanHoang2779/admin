<template>
  <div class="small-scrollbar mr-1">
    <!-- header  -->
    <b-row class="align-items-center">
      <b-col md="4">
        <h2 class="m-0 font-weight-bold text-dark">Tổng quan vận hành các hub</h2>
        <h6 class="mt-4 font-italic">Cập nhật {{ lastUpdateTime }}</h6>
      </b-col>
      <b-col class="text-right">
        <b-button class="badge-pill mr-1" v-bind:class="btnFocusIndex === 0 ? 'btn-ghtk': 'btn-light'"
                  @click="filterTime(0)">Hôm nay
        </b-button>
        <b-button class="badge-pill mr-1" v-bind:class="btnFocusIndex === 1 ? 'btn-ghtk': 'btn-light'"
                  @click="filterTime(1)">7 ngày
        </b-button>
      </b-col>
    </b-row>
    <!-- filter  -->
    <b-row class="mt-4">
      <b-col class="col-md-2 mr-0">
        <SingleSelectRegion
          @handleSelectedRegion="option => filter.region = option ? option.id : null" :reset="reset"
          class="multiselect-ghtk"/>
      </b-col>
      <b-col class="col-md-2 mr-0">
        <SingleSelectProvince @handleSelectedProvince="option => filter.provinceId = option ? option.id
          : null" :regionName="filter.region" :reset="reset"
                              custom-class="multiselect-ghtk"/>
      </b-col>
      <b-col class="col-md-2 mr-0">
        <SingleSelectStation
          @handleSelectedStation="opt => filter.station = opt ? opt.id : null"
          :provinceId="filter.provinceId" :reset="reset"
          custom-class="multiselect-ghtk"/>
      </b-col>
      <b-col class="col-md-1 mr-5">
        <b-btn class="btn-center" variant="ghtk" @click="search"><i class="fas fa-search"></i> Tìm kiếm</b-btn>
      </b-col>
      <b-col class="col-md-1 mr-0">
        <b-btn class="btn-center" variant="ghtk" @click="clearFilter"><i class="fas fa-sync-alt"></i> Xóa lọc
        </b-btn>
      </b-col>
    </b-row>
    <b-row class="m-2">
        <span class="cursor-pointer font-weight-bold mx-2"
              v-bind:class="orderByIndex === 0 ? 'text-dark': 'text-success'" @click="filterOrder(0)">SL thấp</span>
      <div class="vr"></div>
      <!--        <span class="cursor-pointer font-weight-bold mx-2" v-bind:class="orderByIndex === 1 ? 'text-dark': 'text-success'" @click="orderByIndex=1">CL thấp</span>-->
      <!--        <div class="vr"></div>-->
      <span class="cursor-pointer font-weight-bold mx-2"
            v-bind:class="orderByIndex === 1 ? 'text-dark': 'text-success'"
            @click="filterOrder(1)">Tồn trễ nhiều</span>
      <div class="vr"></div>
      <span class="cursor-pointer font-weight-bold mx-2"
            v-bind:class="orderByIndex === 2 ? 'text-dark': 'text-success'"
            @click="filterOrder(2)">Tồn vật lý nhiều</span>
    </b-row>
    <!--paginate-->
    <div class="row mb-1">
      <div class="col-sm text-sm-left text-center pt-2 ml-1">
        <span class="text-muted">Trang {{ pagination.currentPage }} trên {{ totalPages }}</span>
      </div>
      <div class="col-sm pt-1">
        <b-pagination class="justify-content-center justify-content-sm-end m-0 paginator-ghtk"
                      v-model="pagination.currentPage"
                      :total-rows="pagination.total"
                      :per-page="pagination.limit"
                      @input="getList()"
                      size="sm"
        >
        </b-pagination>
      </div>
    </div>
    <!--Dashboard Data-->
    <div class="border text-size fixed-thead" v-loading="loading">
      <table class="table table-responsive table-hover m-0 table-bordered">
        <tr class="border-0">
          <td colspan="2" class="border-0"></td>
          <td colspan="5" class="border-0">
            <row>
              <b-button class="col-md-3 btn-sm btn-outline-success th-custom-pill">Chỉ số vận hành</b-button>
              <div class="col-md-8 horizontal"></div>
            </row>
          </td>
          <td colspan="5" class="border-0">
            <row>
              <b-button class="col-md-3 btn-sm btn-outline-success th-custom-pill">Nhân sự & Năng suất</b-button>
              <div class="col-md-8 horizontal"></div>
            </row>
          </td>
          <td colspan="6" class="border-0">
            <row>
              <b-button class="col-md-3 btn-sm btn-outline-success th-custom-pill">Chi phí trên ĐH (VNĐ)</b-button>
              <div class="col-md-8 horizontal"></div>
            </row>
          </td>
        </tr>
        <tr>
          <th class="border-right-0">
            <div class="font-weight-bold pl-3 text-left w-12">Hub</div>
          </th>
          <th class="border-left-0">
            <div class="text-center font-weight-bold p-1"></div>
          </th>
          <th class="border-right-0">
            <div class="text-nowrap text-center font-weight-bold p-1">
                  <span class="cursor-pointer" @click="sortByField('overall_quantity')">Sản lượng
                    <!--                    <small class="text-second_custom">(ĐH)</small>-->
                    <span>
                      <span v-if="filter.orderField !== 'overall_quantity'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
            </div>
          </th>
          <th class="border-left-0 border-right-0">
            <div class="text-center font-weight-bold p-1">
                  <span class="text-nowrap cursor-pointer text-center" @click="sortByField('ex_right_rate_total')">Đúng mốc
                    <span>
                      <span v-if="filter.orderField !== 'ex_right_rate_total'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
            </div>
          </th>
          <th class="border-left-0 border-right-0">
            <div class="text-center font-weight-bold p-1">
                  <span class=" text-nowrap cursor-pointer text-center" @click="sortByField('lead_time_total')">Leadtime (h)
                    <span>
                      <span v-if="filter.orderField !== 'lead_time_total'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
            </div>
          </th>
          <th class="border-left-0 border-right-0">
            <div class="text-nowrap text-center font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('inhouse_late_ex_total')">Tồn trễ
                    <span>
                      <span v-if="filter.orderField !== 'inhouse_late_ex_total'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
            </div>
          </th>
          <th class="border-left-0">
            <div class="text-nowrap text-center font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('inhouse_not_ex_total')">Tồn vật lý
                    <span>
                      <span v-if="filter.orderField !== 'inhouse_not_ex_total'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
            </div>
          </th>
          <th class="border-right-0">
            <b-row class="pl-4 wr-3">
              <b-col class="md-10 text-nowrap text-center font-weight-bold p-1 pl-3">
                  <span class="text-center cursor-pointer" @click="sortByField('total_xlhh_checkin')">XLHH
                    <br>
                    <span class="text-center">check-in</span>
                  </span>
              </b-col>
              <b-col class="md-2 d-flex align-items-center pl-1">
                    <span>
                      <span v-if="filter.orderField !== 'total_xlhh_checkin'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
              </b-col>
            </b-row>
          </th>
          <th class="border-left-0 border-right-0">
            <div class="text-nowrap text-center font-weight-bold p-1">
                  <span class="text-center cursor-pointer">Năng suất
                    <br>
                    <span class="text-center">/ XLHH</span>
                    <!--                    <span>-->
                    <!--                      <span v-if="filter.orderField !== 'salary_expense'"><i-->
                    <!--                        class="icon ion-md-arrow-dropdown"></i><i-->
                    <!--                        class="icon ion-md-arrow-dropup"></i></span>-->
                    <!--                      <span v-else>-->
                    <!--                        <i class="icon text-ghtk"-->
                    <!--                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>-->
                    <!--                      </span>-->
                    <!--                    </span>-->
                  </span>
            </div>
          </th>
          <th class="border-left-0 border-right-0">
            <b-row class="pl-3 wr-3">
              <b-col class="md-10 text-nowrap text-center font-weight-bold p-1 pl-4">
                    <span class="text-center cursor-pointer" @click="sortByField('total_gskv_checkin')">GSKV
                    <br>
                    <span class="text-center">check-in</span>
                  </span>
              </b-col>
              <b-col class="md-2 d-flex align-items-center pl-1">
                    <span>
                      <span v-if="filter.orderField !== 'total_gskv_checkin'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
              </b-col>
            </b-row>
          </th>
          <th class="border-left-0 border-right-0">
            <div class="text-nowrap text-center font-weight-bold p-1">
                  <span class="text-center cursor-pointer">Năng suất
                    <br>
                    <span class="text-center">/ GSKV</span>
                    <!--                    <span>-->
                    <!--                      <span v-if="filter.orderField !== 'salary_expense'"><i-->
                    <!--                        class="icon ion-md-arrow-dropdown"></i><i-->
                    <!--                        class="icon ion-md-arrow-dropup"></i></span>-->
                    <!--                      <span v-else>-->
                    <!--                        <i class="icon text-ghtk"-->
                    <!--                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>-->
                    <!--                      </span>-->
                    <!--                    </span>-->
                  </span>
            </div>
          </th>
          <th class="border-left-0">
            <b-row class="pl-4 wr-3">
              <b-col class="md-10 text-nowrap text-center font-weight-bold p-1 pl-3">
                  <span class="text-center cursor-pointer" @click="sortByField('total_truck_driver_checkin')">Tài xế
                    <br>
                    <span class="text-center">check-in</span>
                  </span>
              </b-col>
              <b-col class="md-2 d-flex align-items-center pl-1">
                    <span>
                      <span v-if="filter.orderField !== 'total_truck_driver_checkin'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
              </b-col>
            </b-row>
          </th>
          <th class="border-right-0">
            <div class="text-nowrap text-center font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('salary_expense')">Lương
                    <!--                    <span class="text-center">check-in</span>-->
                    <!--                    <br>-->
                    <span>
                      <span v-if="filter.orderField !== 'salary_expense'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
            </div>
          </th>
          <th class="border-left-0 border-right-0">
            <div class="text-nowrap text-center font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('refund_expense')">Bồi hoàn
                    <!--                    <span class="text-center">check-in</span>-->
                    <!--                    <br>-->
                    <span>
                      <span v-if="filter.orderField !== 'refund_expense'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
            </div>
          </th>
          <th class="border-left-0 border-right-0">
            <div class="text-nowrap text-center font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('allocation_expense')">Cấp phát
                    <!--                    <span class="text-center">check-in</span>-->
                    <!--                    <br>-->
                    <span>
                      <span v-if="filter.orderField !== 'allocation_expense'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
            </div>
          </th>
          <th class="border-left-0 border-right-0">
            <div class="text-nowrap text-center font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('location_expense')">Địa điểm
                    <!--                    <span class="text-center">check-in</span>-->
                    <!--                    <br>-->
                    <span>
                      <span v-if="filter.orderField !== 'location_expense'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
            </div>
          </th>
          <th class="border-left-0 border-right-0">
            <div class="text-nowrap text-center font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('office_expense')">HC-VP
                    <!--                    <span class="text-center">check-in</span>-->
                    <!--                    <br>-->
                    <span>
                      <span v-if="filter.orderField !== 'office_expense'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
            </div>
          </th>
          <th class="border-left-0 border-right-0">
            <div class="text-nowrap text-center font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('total_expense')">Tổng chi phí
                    <!--                    <span class="text-center">check-in</span>-->
                    <!--                    <br>-->
                    <span>
                      <span v-if="filter.orderField !== 'total_expense'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
            </div>
          </th>
        </tr>
        <template v-for="statistic in list">
          <tr class="text-nowrap pay-label">
            <td class="border-left-0 border-right-0 border-bottom-0 w-12">
                  <span class=" text-left pl-3 text-dark text-fw-500 ">
                    {{ statistic.station_name }}
                  </span>
              <span class="text-secondary text-fw-500">
                    (ID: {{ statistic.station_id }})
                  </span>
            </td>
            <td class="text-left p-2 border-left-0  border-bottom-0 w-10">Tổng</td>
            <td class="text-center p-2 border-right-0 border-bottom-0">{{ statistic.overall_quantity }}</td>
            <td class="text-center p-2 border-right-0 border-left-0 border-bottom-0">
              {{ statistic.ex_right_rate_total }}%
            </td>
            <td class="text-center p-2 border-right-0 border-left-0  border-bottom-0">
              {{ statistic.lead_time_total }}h
            </td>
            <td class="text-center p-2 border-right-0 border-left-0  border-bottom-0">
              {{ statistic.inhouse_late_ex_total | formatNumber }}
            </td>
            <td class="text-center p-2 border-left-0  border-bottom-0">
              {{ statistic.inhouse_not_ex_total | formatNumber }}
            </td>
            <td class="text-center p-2 border-right-0 border-bottom-0">
              <span class=" text-nowrap cursor-pointer" :id="`popover-xlhh-${statistic.station_id}`">
                {{ statistic.total_xlhh_checkin }} / {{ statistic.total_xlhh }}
              </span>
              <b-popover :target="`popover-xlhh-${statistic.station_id}`">
                <b-row>
                  <b-col md="3" class="text-center text-nowrap">{{statistic.xlhhStaff}}</b-col>
                  <b-col md="9" class="text-nowrap">XLHH</b-col>
                </b-row>
                <hr class="mt-0-2">
                <b-row>
                  <b-col md="3" class="text-center text-nowrap">{{statistic.xlhhPartTime}}</b-col>
                  <b-col md="9" class="text-nowrap">XLHH thời vụ</b-col>
                </b-row>
                <hr class="mt-0-2">
                <b-row>
                  <b-col md="3" class="text-center text-nowrap">{{statistic.xlhhLeader}}</b-col>
                  <b-col md="9" class="text-nowrap">Trưởng nhóm</b-col>
                </b-row>
                <hr class="mt-0-2">
                <b-row>
                  <b-col md="3" class="text-center text-nowrap">{{statistic.xlhhBigSize}}</b-col>
                  <b-col md="9" class="text-nowrap">XLHH Big size</b-col>
                </b-row>
              </b-popover>
            </td>
            <td class="text-center p-2 border-left-0 border-bottom-0 border-right-0">
              {{ statistic.quantity_per_xlhh | formatNumber }}
            </td>
            <td class="text-center p-2 border-right-0 border-left-0 border-bottom-0">
              {{ statistic.total_gskv_checkin }} / {{ statistic.total_gskv }}
            </td>
            <td class="text-center p-2 border-left-0 border-right-0 border-bottom-0">
              {{ statistic.quantity_per_gskv | formatNumber }}
            </td>
            <td class="text-center p-2 border-left-0 border-bottom-0">
              {{ statistic.total_truck_driver_checkin }} / {{ statistic.total_truck_driver }}
            </td>
            <td class="text-center p-2 border-bottom-0 border-right-0">
              {{ statistic.salary_expense | formatNumber }}
            </td>
            <td class="text-center p-2 border-left-0 border-right-0 border-bottom-0">
              {{ statistic.refund_expense | formatNumber }}
            </td>
            <td class="text-center p-2 border-left-0 border-right-0 border-bottom-0">
              {{ statistic.allocation_expense | formatNumber }}
            </td>
            <td class="text-center p-2 border-left-0 border-right-0 border-bottom-0">
              {{ statistic.location_expense | formatNumber }}
            </td>
            <td class="text-center p-2 border-left-0 border-right-0 border-bottom-0">
              {{ statistic.office_expense | formatNumber }}
            </td>
            <td class="text-center p-2 border-left-0 border-right-0 border-bottom-0">
              {{ statistic.total_expense | formatNumber }}
            </td>
          </tr>
          <tr class="text-nowrap pay-label">
            <td class="border-0 w-12"></td>
            <td class="text-left p-2 border-top-0 border-bottom-0 border-left-0 w-10">ĐH Làm hàng</td>
            <td class="text-center p-2 border-0">{{ statistic.pkg_sorting | formatNumber }}</td>
            <td class="text-center p-2 border-0">
              {{ statistic.ex_right_rate_sorting }}%
            </td>
            <td class="text-center p-2 border-0">
              {{ statistic.lead_time_sorting }}h
            </td>
            <td class="text-center p-2 border-0">
              {{ statistic.inhouse_late_ex_sorting | formatNumber }}
            </td>
            <td class="text-center p-2 border-0">
              {{ statistic.inhouse_not_ex_sorting | formatNumber }}
            </td>
            <td colspan="5" class="border-top-0 border-bottom-0"></td>
            <td colspan="6" class="border-top-0 border-bottom-0 border-right-0"></td>
          </tr>
          <tr class="text-nowrap pay-label">
            <td class="border-left-0 border-right-0 border-top-0"></td>
            <td class="text-left p-2 border-left-0  border-top-0 w-10">ĐH trung chuyển</td>
            <td class="text-center p-2 border-0">{{ statistic.pkg_transit | formatNumber }}</td>
            <td class="text-center p-2 border-right-0 border-left-0 border-top-0">
              {{ statistic.ex_right_rate_transit }}%
            </td>
            <td class="text-center p-2 border-right-0 border-left-0  border-top-0">
              {{ statistic.lead_time_transit }}h
            </td>
            <td class="text-center p-2 border-right-0 border-left-0  border-top-0">
              {{ statistic.inhouse_late_ex_transit | formatNumber }}
            </td>
            <td class="text-center p-2 border-left-0  border-top-0">
              {{ statistic.inhouse_not_ex_transit | formatNumber }}
            </td>
            <td colspan="5" class="border-top-0"></td>
            <td colspan="6" class="border-top-0 border-right-0"></td>
          </tr>
        </template>
        <tr v-show="!list || list.length === 0">
          <td class="text-center align-middle no-result" colspan="100"><b>Rất tiếc, Không có bản ghi nào !</b></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import stationDashService from 'domain/services/station-dash-service'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectRegion from 'components/elements/common/SingleSelectProfileRegion'
import Vue from 'vue'
import numeral from 'numeral'
import moment from 'moment'

Vue.filter('formatNumber', function (value) {
  return numeral(value).format('0,0') // displaying other groupings/separators is possible, look at the docs
})
export default {
  name: 'hub-dashboard',
  props: {
    smallScreen: {
      default: false,
      type: Boolean
    },
    blankMode: {
      default: null
    },
    scrollMode: {
      default: false,
      type: Boolean
    }
  },
  components: {SingleSelectStation, SingleSelectProvince, SingleSelectRegion},
  mounted () {
    this.initialData()
    this.filterTime(0)
  },
  data () {
    return {
      loading: false,
      pagination: {
        currentPage: 1,
        limit: 5,
        total: 0
      },
      list: [],
      filter: {
        station: null,
        start: null,
        end: null,
        region: null,
        provinceId: null,
        orderField: null,
        orderType: null,
        type: 'HUB'
      },
      reset: false,
      lastUpdateTime: '',
      isFocus: [
        {id: 1, orderBy: 'overall_quantity', orderType: 'asc'},
        {id: 2, orderBy: 'inhouse_late_ex_total', orderType: 'desc'},
        {id: 3, orderBy: 'inhouse_not_ex_total', orderType: 'desc'}
      ],
      btnFocus: null,
      orderByIndex: null,
      btnFocusIndex: 0
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.pagination.total / this.pagination.limit)
    }
  },
  methods: {
    async getList () {
      try {
        this.loading = true
        const {data} = await stationDashService.getAllStationStatistic({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.filter
        })
        if (data.success === false) {
          this.list = []
          return commonHelper.showMessage(data.message, 'warning')
        }
        commonHelper.showMessage(data.message, 'success')
        this.list = data.data
        this.pagination.total = data.count ? data.count : 0
        this.lastUpdateTime = data.lastUpdateTime
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    onPageChange (page) {
      this.pagination.currentPage = page
      this.getList()
    },
    async search () {
      this.resetPagination()
      this.getList()
    },
    async clearFilter () {
      this.filter = {
        station: null,
        start: null,
        end: null,
        region: null,
        provinceId: null,
        orderField: null,
        orderType: null,
        type: 'HUB'
      }
      this.resetFocusText()
      this.orderByIndex = null
      this.reset = !this.reset
      await this.resetPagination()
      this.filterTime(0)
    },
    resetFocusText () {
      this.isFocus = [
        {id: 1, orderBy: 'overall_quantity', orderType: 'asc'},
        // {id: 2, orderBy: 'overall_quality', orderType: 'asc'},
        {id: 2, orderBy: 'total_expense', orderType: 'desc'},
        {id: 3, orderBy: 'total_penalty', orderType: 'desc'},
        {id: 4, orderBy: 'total_layoff', orderType: 'desc'}
      ]
    },

    resetPagination () {
      this.pagination = {
        currentPage: 1,
        limit: 5,
        total: 0
      }
    },

    sortByField (field) {
      this.orderByIndex = null
      if (this.filter.orderField === field) {
        if (!this.filter.orderType) this.filter.orderType = 'asc'
        else if (this.filter.orderType === 'asc') this.filter.orderType = 'desc'
        else if (this.filter.orderType === 'desc') {
          this.filter.orderField = null
          this.filter.orderType = null
        }
      } else {
        this.filter.orderField = field
        this.filter.orderType = 'asc'
      }
      this.search()
    },

    initialData () {
      let currentDate = moment().format('YYYY-MM-DD')
      this.btnFocus = [
        {id: 1, start: currentDate, end: currentDate},
        {id: 2, start: moment().subtract(6, 'days').format('YYYY-MM-DD'), end: currentDate}
      ]
    },

    filterOrder (orderByIdx) {
      this.orderByIndex = orderByIdx
      this.filter.orderType = this.isFocus[orderByIdx].orderType
      this.filter.orderField = this.isFocus[orderByIdx].orderBy
      this.search()
    },

    filterTime (btnFocusIdx) {
      this.btnFocusIndex = btnFocusIdx
      this.filter.start = this.btnFocus[btnFocusIdx].start
      this.filter.end = this.btnFocus[btnFocusIdx].end
      this.search()
    }
  }
}
</script>

<style scoped lang="scss">
.scroll-mode {
  max-height: 70vh;
  overflow: auto;

  &-small {
    max-height: 65vh;
    overflow: auto;
  }
}

.vr {
  border-left: 2px solid #82c8aa;
  display: inline-block;
  height: 20px;
}

.text-second_custom {
  font-weight: 400 !important;
  color: #979797 !important;
}

.th-custom-pill {
  border-radius: 8px !important;
  display: inline-block;
}

.horizontal {
  display: inline-block;
  border-top: 1px solid #069255;
  height: 3px;
  overflow: hidden;
}

.address-custom {
  max-width: 180px !important;
}

.text-fw-500 {
  font-weight: 500;
}

.btn-ghtk {
  background: #069255 !important;
}

.w-12 {
  width: 12% !important;
}

.small-screen {
  width: 82vw;
  float: right;
}

.wr-3 {
  width: 9rem !important;
}

.ml-20 {
  margin-left: 20rem !important;
}

.mt-0-2 {
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
}
</style>
