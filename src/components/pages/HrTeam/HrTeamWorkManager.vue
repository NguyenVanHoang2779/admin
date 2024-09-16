<template>
  <div class="ui-block user-select-none">
    <b-row>
      <b-col lg="8" offset-lg="2">
        <b-card header="Quản lý công việc khối nhân sự" header-tag="header">
            <div class="mb-3">
                <b-row>
                    <b-col md="9"></b-col>
                    <b-col md="1" class="center-middle">
                        <strong>Add Filter</strong>
                    </b-col>
                    <b-col md="2">
                        <b-form-select v-model="selectFilter" :options="filters" @change="updateFilter"></b-form-select>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col md="2" class="center-middle"><strong>Khu vực:</strong></b-col>
                    <b-col md="3" class="mt-3">
                        <single-select-profile-region @handleSelectedRegion="handleSelectedRegion">></single-select-profile-region>
                    </b-col>
                    <b-col md="3" class="mt-3">
                        <single-select-province @handleSelectedProvince="handleSelectedProvince" :region-name="filterDetail.region"></single-select-province>
                    </b-col>
                    <b-col md="3" class="mt-3">
                        <single-select-station :province-id="filterDetail.province_id" @handleSelectedStation="handleSelectedStation"></single-select-station>
                    </b-col>
                </b-row>
                <b-row v-if="showStatisticType">
                    <b-col md="2" class="center-middle"><strong>Loại thống kê:</strong></b-col>
                    <b-col md="9" class="center-middle">
                        <b-form-group label="" class="mb-0">
                            <b-form-checkbox-group
                                    id="checkbox-group-1"
                                    v-model="statisticTypeSelected"
                                    :options="optionStatisticTypes"
                                    name="flavour-1"
                            ></b-form-checkbox-group>
                        </b-form-group>
                        <i class="ion ion-ios-close icon-remove-field" @click="removeFieldFilter(1)"></i>
                    </b-col>
                </b-row>
                <b-row class = mt-3 v-if="showFieldFilter">
                    <b-col md="2" class="center-middle"><strong>Trường cần lọc:</strong></b-col>
                    <b-col md="7" lg="5" class="d-flex">
                        <multi-select-field-filter @onChange="selectedFieldFilter" :field-filters="fieldFilters"></multi-select-field-filter>
                        <i class="ion ion-ios-close icon-remove-field" @click="removeFieldFilter(2)"></i>
                    </b-col>
                </b-row>
                <b-row class="mt-1">
                    <b-col md="12"><b-button variant="success" @click="callApiByFilter()">Lọc <i class="ion ion-md-funnel"></i></b-button></b-col>
                </b-row>
            </div>
          <b-row v-b-toggle.working-now class="font-title content-type" @click="toggleContent('work_now')">
            <b-col class="p-3">
              <div>
                <i :class="{'fas fa-angle-down': isShow.work_now, 'fas fa-angle-right': !isShow.work_now}"></i>
                <b>CẦN LÀM NGAY</b>
              </div>
            </b-col>
          </b-row>
          <b-collapse id="working-now" visible accordion="" role="tabpanel">
            <ul class="list-group position-relative">
              <li v-b-toggle.candidate class="row" @click="toggleContent('candidate')">
                  <b-col sm="6">
                    <i :class="{'fas fa-angle-down': isShow.candidate, 'fas fa-angle-right': !isShow.candidate}"></i>
                    <span class="font-title">Ứng viên</span>
                  </b-col>
                  <b-col sm="6">
                    <b-row>
                      <b-col sm="8" class="text-sm-right">
                        <div class="content-value">
                          <LoadingFadeCircle v-if="isLoading.dataCheckin" class="loading-number"></LoadingFadeCircle>
                          <span v-else v-text="dataStatistic.totalCandidate.contact + dataStatistic.totalCandidate.interview + dataStatistic.totalCandidate.expect_join"></span>
                          {{postfix(dataStatistic.totalCandidate.contact + dataStatistic.totalCandidate.interview + dataStatistic.totalCandidate.expect_join, 'candidate')}}
                          (+ <LoadingFadeCircle v-if="isLoading.dataCheckin" class="loading-number"></LoadingFadeCircle>
                          <span v-else v-text="dataStatistic.todayCandidate.contact + dataStatistic.todayCandidate.interview + dataStatistic.todayCandidate.expect_join" class="text-success"></span>
                          {{postfix(dataStatistic.todayCandidate.contact + dataStatistic.todayCandidate.interview + dataStatistic.todayCandidate.expect_join)}})
                        </div>
                      </b-col>
                      <b-col sm="4" class="text-sm-right">
                      </b-col>
                    </b-row>
                  </b-col>
              </li>
              <b-collapse id="candidate" accordion="" role="tabpanel">
                <b-col class="child-list position-relative">
                  <ul class="list-group">
                    <li class="row">
                        <b-col sm="6">
                            <span class="font-title">Cần liên hệ</span>
                        </b-col>
                        <b-col sm="6">
                            <b-row>
                                <b-col sm="8" class="text-sm-right">
                                    <div class="content-value">
                                        <LoadingFadeCircle v-if="isLoading.candidate" class="loading-number"></LoadingFadeCircle>
                                        <span v-else v-text="dataStatistic.totalCandidate.contact"></span> {{postfix(dataStatistic.totalCandidate.contact, 'candidate')}} (+
                                        <LoadingFadeCircle v-if="isLoading.candidate" class="loading-number"></LoadingFadeCircle>
                                        <span v-else v-text="dataStatistic.todayCandidate.contact" class="text-success"></span> {{postfix(dataStatistic.todayCandidate.contact, 'candidate')}})
                                    </div>
                                </b-col>
                                <b-col sm="4" class="text-sm-right">
                                    <span class="font-title">
                                        <b-button  class="button-control" size="sm" variant="primary" @click="openModalListDetail('candidate')">Chi tiết</b-button>
                                    </span>
                                </b-col>
                            </b-row>
                        </b-col>
                    </li>
                    <li class="row">
                        <b-col sm="6">
                            <span class="font-title">Đang phỏng vấn</span>
                        </b-col>
                        <b-col sm="6">
                            <b-row>
                                <b-col sm="8" class="text-sm-right">
                                    <div class="content-value">
                                        <LoadingFadeCircle v-if="isLoading.candidate" class="loading-number"></LoadingFadeCircle>
                                        <span v-else v-text="dataStatistic.totalCandidate.interview"></span> {{postfix(dataStatistic.totalCandidate.interview, 'candidate')}} (+
                                        <LoadingFadeCircle v-if="isLoading.candidate" class="loading-number"></LoadingFadeCircle>
                                        <span v-else v-text="dataStatistic.todayCandidate.interview" class="text-success"></span> {{postfix(dataStatistic.todayCandidate.interview, 'candidate')}})
                                    </div>
                                </b-col>
                                <b-col sm="4" class="text-sm-right">
                                    <span class="font-title">
                                        <b-button  class="button-control" size="sm" variant="primary" @click="openModalListDetail('candidate', 1)">Chi tiết</b-button>
                                    </span>
                                </b-col>
                            </b-row>
                        </b-col>
                    </li>
                    <li class="row last-row">
                        <b-col sm="6">
                            <span class="font-title">Chờ nhận việc</span>
                        </b-col>
                        <b-col sm="6">
                            <b-row>
                                <b-col sm="8" class="text-sm-right">
                                    <div class="content-value">
                                        <LoadingFadeCircle v-if="isLoading.candidate" class="loading-number"></LoadingFadeCircle>
                                        <span v-else v-text="dataStatistic.totalCandidate.expect_join"></span> {{postfix(dataStatistic.totalCandidate.expect_join, 'candidate')}} (+
                                        <LoadingFadeCircle v-if="isLoading.candidate" class="loading-number"></LoadingFadeCircle>
                                        <span v-else v-text="dataStatistic.todayCandidate.expect_join" class="text-success"></span> {{postfix(dataStatistic.todayCandidate.expect_join, 'candidate')}})
                                    </div>
                                </b-col>
                                <b-col sm="4" class="text-sm-right">
                                    <span class="font-title">
                                        <b-button  class="button-control" size="sm" variant="primary" @click="openModalListDetail('candidate', 2)">Chi tiết</b-button>
                                    </span>
                                </b-col>
                            </b-row>
                        </b-col>
                    </li>
                  </ul>
                </b-col>
              </b-collapse>
              <li v-b-toggle.vacation class="row" @click="toggleContent('vacation')">
                  <b-col sm="6">
                    <i :class="{'fas fa-angle-down': isShow.vacation, 'fas fa-angle-right': !isShow.vacation}"></i>
                    <span class="font-title">Duyệt nghỉ</span>
                  </b-col>
                  <b-col sm="6">
                    <b-row>
                      <b-col sm="8" class="text-sm-right">
                        <div class="content-value">
                          <LoadingFadeCircle v-if="isLoading.dataCheckin" class="loading-number"></LoadingFadeCircle><span v-else v-text="checkinStatistic.dataOnLeave.total_user"></span> {{postfix(checkinStatistic.dataOnLeave.total_user)}}
                          (+ <LoadingFadeCircle v-if="isLoading.dataCheckin" class="loading-number"></LoadingFadeCircle><span v-else v-text="checkinStatistic.dataOnLeaveToday.total_user" class="text-success"></span> {{postfix(checkinStatistic.dataOnLeaveToday.total_user)}})
                        </div>
                      </b-col>
                      <b-col sm="4" class="text-sm-right">
                      </b-col>
                    </b-row>
                  </b-col>
              </li>
              <b-collapse id="vacation" accordion="" role="tabpanel">
                <b-col class="child-list position-relative">
                  <ul class="list-group">
                    <li class="row">
                        <b-col sm="6">
                            <span class="font-title">Nghỉ không lương</span>
                        </b-col>
                        <b-col sm="6">
                            <b-row>
                                <b-col sm="8" class="text-sm-right">
                                    <div class="content-value">
                                        <LoadingFadeCircle v-if="isLoading.dataCheckin" class="loading-number"></LoadingFadeCircle><span v-else v-text="checkinStatistic.dataOnLeave.total_user_no_sal"></span> {{postfix(checkinStatistic.dataOnLeave.total_user_no_sal)}} (+
                                        <LoadingFadeCircle v-if="isLoading.dataCheckin" class="loading-number"></LoadingFadeCircle><span v-else v-text="checkinStatistic.dataOnLeaveToday.total_user_no_sal" class="text-success"></span> {{postfix(checkinStatistic.dataOnLeaveToday.total_user_no_sal)}})
                                    </div>
                                </b-col>
                                <b-col sm="4" class="text-sm-right">
                                    <span class="font-title">
                                        <b-button  class="button-control" size="sm" variant="primary" @click="openModalListCheckin('leave-no-sal')">Chi tiết</b-button>
                                    </span>
                                </b-col>
                            </b-row>
                        </b-col>
                    </li>
                    <li class="row">
                        <b-col sm="6">
                            <span class="font-title">Nghỉ phép thường niên</span>
                        </b-col>
                        <b-col sm="6">
                            <b-row>
                                <b-col sm="8" class="text-sm-right">
                                    <div class="content-value">
                                        <LoadingFadeCircle v-if="isLoading.dataCheckin" class="loading-number"></LoadingFadeCircle><span v-else v-text="checkinStatistic.dataOnLeave.total_user_has_sal"></span> {{postfix(checkinStatistic.dataOnLeave.total_user_has_sal)}} (+
                                        <LoadingFadeCircle v-if="isLoading.dataCheckin" class="loading-number"></LoadingFadeCircle><span v-else v-text="checkinStatistic.dataOnLeaveToday.total_user_has_sal" class="text-success"></span> {{postfix(checkinStatistic.dataOnLeaveToday.total_user_has_sal)}})
                                    </div>
                                </b-col>
                                <b-col sm="4" class="text-sm-right">
                                    <span class="font-title">
                                        <b-button  class="button-control" size="sm" variant="primary" @click="openModalListCheckin('leave-has-sal')">Chi tiết</b-button>
                                    </span>
                                </b-col>
                            </b-row>
                        </b-col>
                    </li>
                    <li class="row last-row">
                        <b-col sm="6">
                            <span class="font-title">Nghỉ phép việc riêng</span>
                        </b-col>
                        <b-col sm="6">
                            <b-row>
                                <b-col sm="8" class="text-sm-right">
                                    <div class="content-value">
                                        <LoadingFadeCircle v-if="isLoading.dataCheckin" class="loading-number"></LoadingFadeCircle><span v-else v-text="checkinStatistic.dataOnLeave.total_user_other"></span> {{postfix(checkinStatistic.dataOnLeave.total_user_other)}} (+
                                        <LoadingFadeCircle v-if="isLoading.dataCheckin" class="loading-number"></LoadingFadeCircle><span v-else v-text="checkinStatistic.dataOnLeaveToday.total_user_other" class="text-success"></span> {{postfix(checkinStatistic.dataOnLeaveToday.total_user_other)}})
                                    </div>
                                </b-col>
                                <b-col sm="4" class="text-sm-right">
                                    <span class="font-title">
                                        <b-button  class="button-control" size="sm" variant="primary" @click="openModalListCheckin('leave-other')">Chi tiết</b-button>
                                    </span>
                                </b-col>
                            </b-row>
                        </b-col>
                    </li>
                  </ul>
                </b-col>
              </b-collapse>
              <li v-b-toggle.document class="row" @click="toggleContent('document')">
                <b-col>
                  <i :class="{'fas fa-angle-down': isShow.document, 'fas fa-angle-right': !isShow.document}"></i>
                  <span class="font-title">Cập nhật hồ sơ</span>
                </b-col>
              </li>
              <b-collapse id="document" accordion="" role="tabpanel">
                  <b-col class="child-list position-relative">
                    <ul class="list-group">
                      <li class="row">
                          <b-col sm="6">
                              <span class="font-title">Nhân viên thiếu hồ sơ nhận việc</span>
                          </b-col>
                          <b-col sm="6">
                              <b-row>
                                  <b-col sm="8" class="text-sm-right">
                                    <div class="content-value">
                                      <LoadingFadeCircle v-if="isLoading.employeeDocument" class="loading-number"></LoadingFadeCircle>
                                      <span v-else v-text="dataStatistic.totalEmployeeDocument.has_info + dataStatistic.totalEmployeeDocument.no_info"></span> {{postfix(dataStatistic.totalEmployeeDocument.has_info + dataStatistic.totalEmployeeDocument.no_info)}} (+
                                      <LoadingFadeCircle v-if="isLoading.employeeDocument" class="loading-number"></LoadingFadeCircle>
                                      <span v-else v-text="dataStatistic.todayEmployeeDocument.has_info + dataStatistic.todayEmployeeDocument.no_info" class="text-success"></span> {{postfix(dataStatistic.todayEmployeeDocument.has_info + dataStatistic.todayEmployeeDocument.no_info)}})
                                    </div>
                                  </b-col>
                                  <b-col sm="4" class="text-sm-right">
                                      <span class="font-title">
                                          <b-button  class="button-control" size="sm" variant="primary" @click="openModalListDetail('employee_document')">Chi tiết</b-button>
                                          <!-- <b-button  class="button-control" size="sm" variant="primary" @click="openLink($router.resolve({name:'manager-master-profile', query: {cnbConfirmStatus: 2, status: 'active'}}).href)">Chi tiết</b-button> -->
                                      </span>
                                  </b-col>
                              </b-row>
                          </b-col>
                      </li>
                      <li class="row">
                          <b-col sm="6">
                              <span class="font-title">Tài khoản chưa có hoặc (sắp) hết hạn hợp đồng</span>
                          </b-col>
                          <b-col sm="6">
                              <b-row>
                                  <b-col sm="8" class="text-sm-right">
                                    <div class="content-value">
                                      <LoadingFadeCircle v-if="isLoading.contract" class="loading-number"></LoadingFadeCircle>
                                      <span v-else v-text="dataStatistic.totalEmployeeContract.expired + dataStatistic.totalEmployeeContract.no_contract"></span> {{postfix(dataStatistic.totalEmployeeContract.expired + dataStatistic.totalEmployeeContract.no_contract)}} (+
                                      <LoadingFadeCircle v-if="isLoading.contract" class="loading-number"></LoadingFadeCircle>
                                      <span v-else v-text="dataStatistic.todayEmployeeContract.expired + dataStatistic.todayEmployeeContract.no_contract" class="text-success"></span> {{postfix(dataStatistic.todayEmployeeContract.expired + dataStatistic.todayEmployeeContract.no_contract)}})
                                    </div>
                                  </b-col>
                                  <b-col sm="4" class="text-sm-right">
                                      <span class="font-title">
                                          <b-button  class="button-control" size="sm" variant="primary" @click="openModalListDetail('employee_contract')">Chi tiết</b-button>
                                          <!-- <b-button  class="button-control" size="sm" variant="primary" @click="openLink($router.resolve({name:'manager-master-profile', query: {status: 'active'}}).href)">Chi tiết</b-button> -->
                                      </span>
                                  </b-col>
                              </b-row>
                          </b-col>
                      </li>
                      <li class="row">
                          <b-col sm="6" class="ali">
                              <span class="font-title">Người phụ thuộc (gia cảnh)</span>
                          </b-col>
                          <b-col sm="6">
                              <b-row>
                                  <b-col sm="8" class="text-sm-right">
                                    <div class="content-value">
                                      <LoadingFadeCircle v-if="isLoading.dependant" class="loading-number"></LoadingFadeCircle>
                                      <span v-else v-text="dataStatistic.totalEmployeeDependant.all.numEmployee"></span> {{postfix(dataStatistic.totalEmployeeDependant.all.numEmployee)}} (+
                                      <LoadingFadeCircle v-if="isLoading.dependant" class="loading-number"></LoadingFadeCircle>
                                      <span v-else v-text="dataStatistic.todayEmployeeDependant.all.numEmployee" class="text-success"></span> {{postfix(dataStatistic.todayEmployeeDependant.all.numEmployee)}})
                                    </div>
                                    <div class="content-value">
                                      <LoadingFadeCircle v-if="isLoading.dependant" class="loading-number"></LoadingFadeCircle>
                                      <span v-else v-text="dataStatistic.totalEmployeeDependant.all.numDependant"></span> {{postfix(dataStatistic.totalEmployeeDependant.all.numDependant, 'dependant')}} (+
                                      <LoadingFadeCircle v-if="isLoading.dependant" class="loading-number"></LoadingFadeCircle>
                                      <span v-else v-text="dataStatistic.todayEmployeeDependant.all.numDependant" class="text-success"></span> {{postfix(dataStatistic.todayEmployeeDependant.all.numDependant, 'dependant')}})
                                    </div>
                                  </b-col>
                                  <b-col sm="4" class="text-sm-right">
                                      <span class="font-title">
                                          <b-button  class="button-control" size="sm" variant="primary" @click="openModalListDetail('employee_dependant')">Chi tiết</b-button>
                                          <!-- <b-button  class="button-control" size="sm" variant="primary" @click="openLink($router.resolve({name:'manager-dependent-person', query: {status: 'incompleteFile'}}).href)">Chi tiết</b-button> -->
                                      </span>
                                  </b-col>
                              </b-row>
                          </b-col>
                      </li>
                      <li class="row last-row">
                          <b-col sm="6">
                              <span class="font-title">Ký quỹ</span>
                          </b-col>
                          <b-col sm="6">
                              <b-row>
                                  <b-col sm="8" class="text-sm-right">
                                      <div class="content-value">
                                          <LoadingFadeCircle v-if="isLoading.deposit" class="loading-number"></LoadingFadeCircle><span v-else>{{deposit.total}}</span> {{postfix(deposit.total)}} (+
                                          <LoadingFadeCircle v-if="isLoading.deposit" class="loading-number"></LoadingFadeCircle><span v-else class="text-success"> {{deposit.today}}</span> {{postfix(deposit.today)}})
                                      </div>
                                  </b-col>
                                  <b-col sm="4" class="text-sm-right">
                                      <span class="font-title">
                                          <b-link  class="btn btn-primary btn-sm" @click="openLink($router.resolve({name:'deposit-manager', query: {status: 1}}).href)">Chi tiết</b-link>
                                      </span>
                                  </b-col>
                              </b-row>
                          </b-col>
                      </li>
                    </ul>
                  </b-col>
              </b-collapse>
              <li class="row">
                <b-col sm="6">
                  <span class="font-title">Duyệt Profile/tài khoản điều phối tạo</span>
                </b-col>
                <b-col sm="6">
                    <b-row>
                        <b-col sm="8" class="text-sm-right">
                          <div class="content-value">
                            <LoadingFadeCircle v-if="isLoading.employeeStatus" class="loading-number"></LoadingFadeCircle><span v-else v-text="dataStatistic.totalEmployeeNotVerified"></span> {{postfix(dataStatistic.totalEmployeeNotVerified)}} (+
                            <LoadingFadeCircle v-if="isLoading.employeeStatus" class="loading-number"></LoadingFadeCircle><span v-else v-text="dataStatistic.numEmployeeNotVerifiedToday" class="text-success"></span> {{postfix(dataStatistic.numEmployeeNotVerifiedToday)}})
                          </div>
                        </b-col>
                        <b-col sm="4" class="text-sm-right">
                          <b-button  class="button-control" size="sm" variant="primary" @click="openModalListDetail('employee_status')">Chi tiết</b-button>
                        </b-col>
                    </b-row>
                </b-col>
              </li>
              <li class="row">
                <b-col sm="6">
                  <span class="font-title">Duyệt công</span>
                  <modal-list-checkin
                      :is-show="isShowModalListCheckin"
                      :type="typeModalListCheckin"
                      :title="titleModalListCheckin"
                      :filters="filterCheckin"
                      @toggleModal="toggleModalListCheckin"
                      :list-api-filter="listApiFilter">
                  </modal-list-checkin>
                </b-col>
                <b-col sm="6">
                    <b-row>
                        <b-col sm="8" class="text-sm-right">
                            <div class="content-value">
                                <LoadingFadeCircle v-if="isLoading.dataCheckin" class="loading-number"></LoadingFadeCircle><span v-else v-text="checkinStatistic.dataCheckin.total_user"></span> {{postfix(checkinStatistic.dataCheckin.total_user)}} -
                                <LoadingFadeCircle v-if="isLoading.dataCheckin" class="loading-number"></LoadingFadeCircle><span v-else v-text="checkinStatistic.dataCheckin.total_pending" class="text-success"></span> {{postfix(checkinStatistic.dataCheckin.total_pending, 'requirement')}}
                            </div>
                        </b-col>
                          <b-col sm="4" class="text-sm-right">
                              <b-button  class="button-control" size="sm" variant="primary" @click="openModalListCheckin('pending-checkin')">Chi tiết</b-button>
                        </b-col>
                    </b-row>
                </b-col>
              </li>
              <li class="row">
                  <b-col sm="6">
                      <span class="font-title">Thưởng/Phạt</span>
                  </b-col>
                  <b-col sm="6">
                      <b-row>
                          <b-col sm="8" class="text-sm-right">
                              <div class="content-value">
                                  <LoadingFadeCircle v-if="isLoading.recompense" class="loading-number"></LoadingFadeCircle><span v-else>{{recompense.rewardTotal}}</span> thưởng |
                                  <LoadingFadeCircle v-if="isLoading.recompense" class="loading-number"></LoadingFadeCircle><span v-else>{{recompense.penalizeTotal}}</span> phạt (+
                                  <LoadingFadeCircle v-if="isLoading.recompense" class="loading-number"></LoadingFadeCircle><span v-else class="text-success"> {{recompense.rewardToday}}</span> thưởng | +
                                  <LoadingFadeCircle v-if="isLoading.recompense" class="loading-number"></LoadingFadeCircle><span v-else class="text-success">{{recompense.penalizeToday}}</span> phạt)
                              </div>
                          </b-col>
                            <b-col sm="4" class="text-sm-right">
                                <b-link  class="btn btn-primary btn-sm" @click="openModalListUserNotEvaluated('approve-recompense')">Chi tiết</b-link>
                          </b-col>
                      </b-row>
                  </b-col>
              </li>
              <li class="row">
                  <b-col sm="6">
                      <span class="font-title">Fstar</span>
                      <modal-list-user-not-evaluated
                              :is-show="isShowModalListUserNotEvaluated"
                              :cycleEvaluation="cycleEvaluation"
                              :type="typeModalListUserEvaluation"
                              :title="titleModalListUserEvaluation"
                              @toggleModal="toggleModalListUserNotEvaluated">
                      </modal-list-user-not-evaluated>
                  </b-col>
                  <b-col sm="6">
                      <b-row>
                          <b-col sm="8" class="text-sm-right">
                              <div class="content-value">
                                  <LoadingFadeCircle v-if="isLoading.notEvaluation" class="loading-number"></LoadingFadeCircle><span v-else>{{fstar.notEvaluation}}</span> nv chưa đánh giá /
                                  <LoadingFadeCircle v-if="isLoading.notEvaluation" class="loading-number"></LoadingFadeCircle><span v-else class="text-success"> {{ratioEvaluated}} % đã đánh giá</span>
                              </div>
                          </b-col>
                          <b-col sm="4" class="text-sm-right">
                              <b-link  class="btn btn-primary btn-sm" @click="openModalListUserNotEvaluated('not-evaluation',currCycle)">Chi tiết</b-link>
                          </b-col>
                      </b-row>
                  </b-col>
              </li>
              <li class="row last-row">
                  <b-col sm="6">
                      <span class="font-title">SOS</span>
                  </b-col>
                  <b-col sm="6">
                    <b-row>
                      <b-col sm="8" class="text-sm-right">
                          <div class="content-value">
                              <LoadingFadeCircle v-if="isLoading.sosStatus" class="loading-number"></LoadingFadeCircle><span v-else v-text="sosTicket.totalSosTicket"></span> {{postfix(sosTicket.totalSosTicket, 'ticket')}} (+
                              <LoadingFadeCircle v-if="isLoading.sosStatus" class="loading-number"></LoadingFadeCircle><span v-else v-text="sosTicket.totalCurrentSoSticket" class="text-success"></span> {{postfix(sosTicket.totalCurrentSoSticket, 'ticket')}})
                          </div>
                      </b-col>
                        <b-col sm="4" class="text-sm-right">
                          <b-button @click="showSosModal(sosTicket.ticketDetail)" class="button-control" size="sm" variant="primary">Chi tiết</b-button>
                      </b-col>
                    </b-row>
                  </b-col>
              </li>
              <sos-ticket-details-modal
                  :data-sos-ticket="dataSosTicket"
                  :is-show="isShowSosModal"
                  @toggleModal="toggleSosModal">
              </sos-ticket-details-modal>
            </ul>
          </b-collapse>
          <b-row v-b-toggle.overview class="font-title content-type" @click="toggleContent('overview')">
              <b-col class="p-3">
                  <div>
                    <i :class="{'fas fa-angle-down': isShow.overview, 'fas fa-angle-right': !isShow.overview}"></i>
                    <b>OVERVIEW</b>
                  </div>
              </b-col>
          </b-row>
          <b-collapse id="overview" visible accordion="" role="tabpanel">
            <ul class="list-group position-relative">
              <li class="row">
                  <b-col sm="6">
                      <span class="font-title">Ứng tuyển</span>
                  </b-col>
                  <b-col sm="6">
                    <b-row>
                      <b-col sm="8" class="text-sm-right">
                        <div class="content-value">
                          <LoadingFadeCircle v-if="isLoading.candidate" class="loading-number"></LoadingFadeCircle>
                          <span v-else v-text="dataStatistic.totalCandidate.all"></span> {{postfix(dataStatistic.totalCandidate.all, 'candidate')}} (+
                          <LoadingFadeCircle v-if="isLoading.candidate" class="loading-number"></LoadingFadeCircle>
                          <span v-else v-text="dataStatistic.todayCandidate.all" class="text-success"></span> {{postfix(dataStatistic.todayCandidate.all, 'candidate')}})
                        </div>
                      </b-col>
                      <b-col sm="4" class="text-sm-right">
                        <!-- <b-button  class="button-control" size="sm" variant="primary" @click="openModalListDetail('candidate')">Chi tiết</b-button> -->
                        <b-button  class="button-control" size="sm" variant="primary" @click="openLink($router.resolve({name:'list-candidate'}).href)">Chi tiết</b-button>
                      </b-col>
                    </b-row>
                  </b-col>
              </li>
              <li class="row">
                  <b-col sm="6">
                      <span class="font-title">Đang làm việc</span>
                  </b-col>
                  <b-col sm="6">
                    <b-row>
                      <b-col sm="8" class="text-sm-right">
                        <div class="content-value">
                          <LoadingFadeCircle v-if="isLoading.employeeStatus" class="loading-number"></LoadingFadeCircle><span v-else v-text="dataStatistic.totalEmployeeWorking"></span> {{postfix(dataStatistic.totalEmployeeWorking)}} (+
                          <LoadingFadeCircle v-if="isLoading.employeeStatus" class="loading-number"></LoadingFadeCircle><span v-else v-text="dataStatistic.numEmployeeWorkingToday" class="text-success"></span> {{postfix(dataStatistic.numEmployeeWorkingToday)}})
                        </div>
                      </b-col>
                        <b-col sm="4" class="text-sm-right">
                          <!-- <b-button  class="button-control" size="sm" variant="primary" @click="openDefaultInfoModal('employeeWorking')">Chi tiết</b-button> -->
                          <b-button  class="button-control" size="sm" variant="primary" @click="openLink($router.resolve({name:'manager-master-profile', query: {status: 'active'}}).href)">Chi tiết</b-button>
                      </b-col>
                    </b-row>
                  </b-col>
              </li>
              <li class="row">
                  <b-col sm="6">
                      <span class="font-title">Rời bỏ</span>
                  </b-col>
                  <b-col sm="6">
                      <b-row>
                          <b-col sm="8" class="text-sm-right">
                            <div class="content-value">
                              <LoadingFadeCircle v-if="isLoading.employeeStatus" class="loading-number"></LoadingFadeCircle><span v-else v-text="dataStatistic.totalEmployeeResign"></span> {{postfix(dataStatistic.totalEmployeeResign)}} (+
                              <LoadingFadeCircle v-if="isLoading.employeeStatus" class="loading-number"></LoadingFadeCircle><span v-else v-text="dataStatistic.numEmployeeResignToday" class="text-success"></span> {{postfix(dataStatistic.numEmployeeResignToday)}})
                            </div>
                          </b-col>
                            <b-col sm="4" class="text-sm-right">
                              <!-- <b-button  class="button-control" size="sm" variant="primary" @click="openDefaultInfoModal('employeeResign')">Chi tiết</b-button> -->
                              <b-button  class="button-control" size="sm" variant="primary" @click="openLink($router.resolve({name:'manager-master-profile', query: {status: 'disable'}}).href)">Chi tiết</b-button>
                          </b-col>
                      </b-row>
                  </b-col>
              </li>
              <li class="row">
                  <b-col sm="4">
                      <span class="font-title">Fstar</span>
                  </b-col>
                  <b-col sm="8">
                      <b-row>
                          <b-col sm="9" class="text-sm-right">
                              <div class="content-value">
                                  <span>
                                      <LoadingFadeCircle v-if="isLoading.fstarOverView" class="loading-number"></LoadingFadeCircle><span v-else>{{fstarOverView.perfect}}</span> <i class="ion ion-md-thumbs-up" title="Tuyệt vời" style="font-size: 24px; color: #02BC77"></i> |
                                  </span>
                                  <span>
                                      <LoadingFadeCircle v-if="isLoading.fstarOverView" class="loading-number"></LoadingFadeCircle><span v-else> {{fstarOverView.commendable}}</span> <i class="ion ion-ios-happy" title="Đáng khen ngợi" style="font-size: 24px; color: orange"></i> |
                                  </span>
                                  <span>
                                      <LoadingFadeCircle v-if="isLoading.fstarOverView" class="loading-number"></LoadingFadeCircle><span v-else> {{fstarOverView.normal}}</span> <i class="ion ion-md-happy" title="Bình thường" style="font-size: 24px; color: orange"></i> |
                                  </span>
                                  <span>
                                      <LoadingFadeCircle v-if="isLoading.fstarOverView" class="loading-number"></LoadingFadeCircle><span v-else> {{fstarOverView.need_improve}}</span> <i class="ion ion-ios-sad" title="Cần cải thiện" style="font-size: 24px"></i> |
                                  </span>
                                  <span @click="openModalListUserNotEvaluated('not-evaluation',beforeCycle)">
                                      <LoadingFadeCircle v-if="isLoading.fstarOverView" class="loading-number"></LoadingFadeCircle><span v-else> {{fstarOverView.not_evaluated}}</span> <i class="ion ion-ios-sad cursor-pointer" title="Chưa đánh giá" style="font-size: 24px; color: darkmagenta;"></i>
                                  </span>
                              </div>
                          </b-col>
                            <b-col sm="3" class="text-sm-right">
                              <b-link  class="btn btn-primary btn-sm" @click="openLink($router.resolve({name:'manager-evaluation'}).href)" >Chi tiết</b-link>
                          </b-col>
                      </b-row>
                  </b-col>
              </li>
            </ul>
          </b-collapse>
        </b-card>
      </b-col>
    </b-row>
    <modal-list-detail-info
      :is-show="showModalListDetail"
      :type="typeModalListDetail"
      :title="titleModalListDetail"
      :filters="filterDetail"
      @toggleModal="toggleModalListDetail"
      :data-statistic="dataStatisticProp"
      :list-api-filter="listApiFilter"
      :tab="detailTab"
    ></modal-list-detail-info>
  </div>
</template>
<script>
import ModalDetailInfo from './ModalDetailInfo'
import HrStatisticService from 'domain/services/hr-statistic-service'
import ModalListDetailInfo from './ModalListDetailInfo'
import SosTicketDetailsModal from 'components/pages/HrTeam/Modal/SosTicketDetailsModal'
import LoadingFadeCircle from 'components/elements/loading/LoadingFadeCircle'
import ModalListCheckin from 'components/pages/HrTeam/ModalListCheckin'
import ModalListUserNotEvaluated from './Modal/ListUserNotEvaluated'
import MultiSelectFieldFilter from './MultiSelectFieldFilter'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'

export default {
  name: 'HrTeamWorkManagement',

  props: {},

  components: {
    MultiSelectFieldFilter,
    ModalListUserNotEvaluated,
    ModalDetailInfo,
    ModalListCheckin,
    LoadingFadeCircle,
    ModalListDetailInfo,
    SosTicketDetailsModal,
    SingleSelectStation,
    SingleSelectProvince,
    SingleSelectProfileRegion
  },

  created () {
    this.getStatisticCheckinData()
    this.getSOSTotalTicket()
    this.getStatisticCandidate()
    this.getStatisticDataDependant()
    this.getStatisticDataProfileStatus()
    this.getStatisticDataEmployeeDocument()
    // this.getStatisticDataInsurance()
    this.getAmountUserLackDeposit()
    this.getAmountUserRecompense()
    this.getAmountUserFstar()
    this.getAmountUserFstarOverView()
    this.getStatisticDataEmployeeContract()
    this.selectFieldFilters = [...this.fieldFilterNeedNow, ...this.fieldFilterOverviews]
  },

  data: () => ({
    showArrow: false,
    isShowModalListCheckin: false,
    isShowModalListUserNotEvaluated: false,
    currCycle: null,
    beforeCycle: null,
    cycleEvaluation: null,
    isShowSosModal: false,
    titleModalListCheckin: '',
    titleModalListUserEvaluation: '',
    typeModalListCheckin: '',
    typeModalListUserEvaluation: '',
    showModalListDetail: null,
    titleModalListDetail: null,
    typeModalListDetail: null,
    dataStatisticProp: {},
    detailTab: 0,
    dataSosTicket: null,
    dataType: null,
    dataStatistic: {
      totalCandidate: {
        all: null,
        contact: null
      },
      todayCandidate: {
        all: null,
        contact: null
      },
      totalEmployeeDependant: {
        all: {}
      },
      todayEmployeeDependant: {
        all: {}
      },
      totalEmployeeWorking: null,
      numEmployeeWorkingToday: null,
      totalEmployeeNotVerified: null,
      numEmployeeNotVerified: null,
      totalEmployeeResign: null,
      numEmployeeWorkingResign: null,
      totalEmployeeDocument: {},
      todayEmployeeDocument: {},
      numEmployeeHasNewInsuranceToday: null,
      totalEmployeeHasNewInsurance: null,
      totalEmployeeContract: {},
      todayEmployeeContract: {}
    },
    isLoading: {
      contract: false,
      dependant: false,
      employeeDocument: false,
      employeeStatus: false,
      candidate: false,
      insurance: false,
      dataCheckin: false,
      fstarOverView: false,
      notEvaluation: false,
      recompense: false,
      deposit: false,
      sosStatus: false
    },
    sosTicket: {
      totalSosTicket: 0,
      totalCurrentSoSticket: 0,
      ticketDetail: null
    },
    deposit: {
      total: 0,
      today: 0
    },
    recompense: {
      rewardTotal: 0,
      rewardToday: 0,
      penalizeTotal: 0,
      penalizeToday: 0
    },
    fstar: {
      notEvaluation: 0,
      amountUsers: 1
    },
    filterCheckin: {},
    checkinStatistic: {
      dataCheckin: {
        total_user: 0,
        total_pending: 0
      },
      dataOnLeave: {
        total_pending: 0,
        total_pending_no_sal: 0,
        total_pending_has_sal: 0,
        total_pending_other: 0,
        total_user: 0,
        total_user_no_sal: 0,
        total_user_has_sal: 0,
        total_user_other: 0
      },
      dataOnLeaveToday: {
        total_pending: 0,
        total_pending_no_sal: 0,
        total_pending_has_sal: 0,
        total_pending_other: 0,
        total_user: 0,
        total_user_no_sal: 0,
        total_user_has_sal: 0,
        total_user_other: 0
      }
    },
    fstarOverView: {
      need_improve: 0,
      normal: 0,
      commendable: 0,
      perfect: 0,
      not_evaluated: 0
    },
    dataDeposit: null,
    isShow: {
      overview: true,
      work_now: true,
      vacation: false,
      document: false,
      candidate: false
    },
    optionStatisticTypes: [
      { text: 'Cần làm ngay', value: 1 },
      { text: 'Overview', value: 2 }
    ],
    statisticTypeSelected: [],
    fieldFilterNeedNow: [
      { name: 'Ứng viên cần liên hệ', statisticApi: 'getStatisticCandidate', detailApi: 'getStatisticCandidate' },
      { name: 'Duyệt công', statisticApi: 'getStatisticCheckinData', detailApi: 'pending-checkin' },
      { name: 'Nghỉ không lương', statisticApi: 'getStatisticCheckinData', detailApi: 'leave-no-sal' },
      { name: 'Nghỉ phép thường niên', statisticApi: 'getStatisticCheckinData', detailApi: 'leave-has-sal' },
      { name: 'nghỉ phép việc riêng', statisticApi: 'getStatisticCheckinData', detailApi: 'leave-other' },
      { name: 'Nhân viên thiếu hồ sơ nhận việc', statisticApi: 'getStatisticDataEmployeeDocument', detailApi: 'getStatisticDataEmployeeDocument' },
      { name: 'Tài khoản chưa có, sắp hết hạn', statisticApi: 'getStatisticDataEmployeeContract', detailApi: 'getStatisticDataEmployeeContract' },
      { name: 'Profile/tài khoản điều phối tạo cần duyệt', statisticApi: 'getStatisticDataProfileStatus', detailApi: 'getStatisticDataProfileStatus' },
      { name: 'Người phụ thuộc', statisticApi: 'getStatisticDataDependant', detailApi: 'getStatisticDataDependant' },
      { name: 'Ký quỹ', statisticApi: 'getAmountUserLackDeposit', detailApi: null },
      { name: 'Thưởng phạt', statisticApi: 'getAmountUserRecompense', detailApi: 'getStatisticCandidate' },
      { name: 'Fstar', statisticApi: 'getAmountUserFstar', detailApi: 'getStatisticCandidate' },
      { name: 'SOS', statisticApi: 'getSOSTotalTicket', detailApi: 'getStatisticCandidate' }
    ],
    fieldFilterOverviews: [
      { name: 'Ứng tuyển', statisticApi: 'getStatisticCandidate' },
      { name: 'Đang làm việc', statisticApi: 'getStatisticDataProfileStatus' },
      { name: 'Rời bỏ', statisticApi: 'getStatisticDataProfileStatus' },
      { name: 'Fstar', statisticApi: 'getAmountUserFstarOverView' }
    ],
    filters: [
      { value: null, text: 'Thêm điều kiện lọc' },
      { value: 1, text: 'Loại thống kê' },
      { value: 2, text: 'Trường cần lọc' }
    ],
    selectFilter: null,
    selectFilterArray: [],
    selectFieldFilters: [],
    filterDetail: {
      region: null,
      province_id: null,
      station_id: null
    },
    showStatisticType: false,
    showFieldFilter: false,
    showAreaFilter: false
  }),

  computed: {
    ratioEvaluated () {
      return Number(((this.fstar.amountUsers - this.fstar.notEvaluation) / this.fstar.amountUsers * 100).toFixed(2))
    },
    fieldFilters () {
      if (this.selectFilterArray.includes(1)) {
        if (this.statisticTypeSelected.includes(1) && this.statisticTypeSelected.includes(2)) return [...this.fieldFilterNeedNow, ...this.fieldFilterOverviews]
        if (this.statisticTypeSelected.includes(1)) return this.fieldFilterNeedNow
        if (this.statisticTypeSelected.includes(2)) return this.fieldFilterOverviews
        if (this.statisticTypeSelected.length === 0) return []
      }
      if (this.selectFilterArray.includes(2) && !this.selectFilterArray.includes(1)) {
        return [...this.fieldFilterNeedNow, ...this.fieldFilterOverviews]
      }
    },

    listApiFilter () {
      return this.selectFieldFilters.map((el) => (el.detailApi)).filter(function (el, idx, self) {
        return el != null && self.indexOf(el) === idx // return unique element
      })
    }
  },

  watch: {
    selectFilterArray (newVal, oldVal) {
      if (newVal.includes(1)) {
        this.showStatisticType = true
      }
      if (newVal.includes(2)) {
        this.showFieldFilter = true
      }
      if (newVal.includes(1) && newVal.includes(2) && this.selectFieldFilters.length > 0) {
        if (this.selectFieldFilters.some(val => this.fieldFilterNeedNow.includes(val))) this.statisticTypeSelected.push(1)
        if (this.selectFieldFilters.some(val => this.fieldFilterOverviews.includes(val))) this.statisticTypeSelected.push(2)
      }
      if (newVal.includes(1) && !newVal.includes(2)) {
        this.selectFieldFilters = this.fieldFilters
      }
      if (newVal.length === 0) {
        this.selectFieldFilters = [...this.fieldFilterNeedNow, ...this.fieldFilterOverviews]
      }
    },
    statisticTypeSelected () {
      if (this.selectFilterArray.includes(1) && !this.selectFilterArray.includes(2)) {
        this.selectFieldFilters = this.fieldFilters
      }
    }
  },

  methods: {
    updateFilter (val) {
      if (val !== null) {
        if (!this.selectFilterArray.includes(val)) {
          this.selectFilterArray.push(val)
        }
        this.selectFilter = null
      }
    },

    selectedFieldFilter (option) {
      this.selectFieldFilters = option
    },
    removeFieldFilter (value) {
      if (value === 1) this.showStatisticType = false
      if (value === 2) this.showFieldFilter = false
      this.selectFilterArray = this.selectFilterArray.filter((item) => {
        return item !== value
      })
    },
    callApiByFilter () {
      let listAPI = this.selectFieldFilters.map((item) => {
        return item.statisticApi
      }).filter(function (el, idx, self) {
        return el != null && self.indexOf(el) === idx // return unique element
      })
      listAPI.forEach((item) => {
        this[item](this.filterDetail)
      })
    },
    toggleContent (nameContent) {
      this.isShow[nameContent] = !this.isShow[nameContent]
    },
    postfix (number, type) {
      // if (type === 'candidate') return number > 1 ? 'Candidates' : 'Candidate'
      // if (type === 'dependant') return number > 1 ? 'Dependants' : 'Dependant'
      // if (type === 'ticket') return number > 1 ? 'Tickets' : 'ticket'
      // if (type === 'requirement') return number > 1 ? 'Requirements' : 'Requirement'
      // return number > 1 ? 'Staffs' : 'Staff'

      if (type === 'candidate') return 'Ứng viên'
      if (type === 'dependant') return 'NPT'
      if (type === 'ticket') return number > 1 ? 'Tickets' : 'ticket'
      if (type === 'requirement') return 'Yêu cầu'
      return 'Nhân viên'
    },

    getAmountUserLackDeposit () {
      this.appLoading = true
      let params = {
        region: this.filterDetail.region,
        province: this.filterDetail.province_id,
        station: this.filterDetail.station_id
      }
      HrStatisticService.getAmountUserLackDeposit(params).then(res => {
        if (res.data.success) {
          this.deposit.total = res.data.data.total
          this.deposit.today = res.data.data.today
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.appLoading = false
      })
    },

    toggleSosModal (value) {
      this.isShowSosModal = value
    },

    showSosModal (item) {
      this.dataSosTicket = item
      this.toggleSosModal(true)
    },

    getAmountUserRecompense () {
      this.isLoading.recompense = true
      let params = {
        region: this.filterDetail.region,
        province: this.filterDetail.province_id,
        station: this.filterDetail.station_id
      }
      HrStatisticService.getAmountUserRecompense(params).then(res => {
        if (res.data.success) {
          this.recompense.rewardTotal = res.data.data.rewardTotal
          this.recompense.rewardToday = res.data.data.rewardToday
          this.recompense.penalizeTotal = res.data.data.penalizeTotal
          this.recompense.penalizeToday = res.data.data.penalizeToday
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.isLoading.recompense = false
      })
    },

    getAmountUserFstar () {
      this.isLoading.notEvaluation = true
      let params = {
        region: this.filterDetail.region,
        province: this.filterDetail.province_id,
        station: this.filterDetail.station_id
      }
      HrStatisticService.getAmountUserFstar(params).then(res => {
        if (res.data.success) {
          this.fstar.notEvaluation = res.data.data.notEvaluation
          this.fstar.amountUsers = res.data.data.amountUsers
          this.currCycle = res.data.cycleEvaluation
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.isLoading.notEvaluation = false
      })
    },

    getStatisticCandidate (params) {
      this.isLoading.candidate = true
      HrStatisticService.getStatisticCandidate(params).then(res => {
        if (res.data.success) {
          this.dataStatistic.totalCandidate = res.data.data.total ? res.data.data.total : {}
          this.dataStatistic.todayCandidate = res.data.data.today ? res.data.data.today : {}
        } else {
          this.dataStatistic.totalCandidate = { all: null, contact: null }
          this.dataStatistic.todayCandidate = { all: null, contact: null }
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.isLoading.candidate = false
      })
    },

    getStatisticDataDependant (params) {
      this.isLoading.dependant = true
      HrStatisticService.getStatisticDataDependant(params).then(res => {
        if (res.data.success) {
          this.dataStatistic.totalEmployeeDependant = res.data.data.total ? res.data.data.total : {}
          this.dataStatistic.todayEmployeeDependant = res.data.data.today ? res.data.data.today : {}
        } else {
          this.dataStatistic.totalEmployeeDependant = { all: {} }
          this.dataStatistic.todayEmployeeDependant = { all: {} }
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.isLoading.dependant = false
      })
    },

    getStatisticDataProfileStatus (params) {
      this.isLoading.employeeStatus = true
      HrStatisticService.getStatisticDataProfileStatus(params).then(res => {
        if (res.data.success) {
          this.dataStatistic.totalEmployeeWorking = res.data.data.total.active ? +res.data.data.total.active : 0
          this.dataStatistic.numEmployeeWorkingToday = res.data.data.today.active ? +res.data.data.today.active : 0
          this.dataStatistic.totalEmployeeResign = res.data.data.total.disable ? +res.data.data.total.disable : 0
          this.dataStatistic.numEmployeeResignToday = res.data.data.today.disable ? +res.data.data.today.disable : 0
          this.dataStatistic.totalEmployeeNotVerified = res.data.data.total.not_verified ? +res.data.data.total.not_verified : 0
          this.dataStatistic.numEmployeeNotVerifiedToday = res.data.data.today.not_verified ? +res.data.data.today.not_verified : 0
        } else {
          this.dataStatistic.totalEmployeeWorking = null
          this.dataStatistic.numEmployeeWorkingToday = null
          this.dataStatistic.totalEmployeeResign = null
          this.dataStatistic.numEmployeeResignToday = null
          this.dataStatistic.totalEmployeeNotVerified = null
          this.dataStatistic.numEmployeeNotVerifiedToday = null
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.isLoading.employeeStatus = false
      })
    },

    getStatisticDataEmployeeDocument (params) {
      this.isLoading.employeeDocument = true
      HrStatisticService.getStatisticDataEmployeeDocument(params).then(res => {
        if (res.data.success) {
          this.dataStatistic.totalEmployeeDocument = res.data.data.total ? res.data.data.total : {}
          this.dataStatistic.todayEmployeeDocument = res.data.data.today ? res.data.data.today : {}
        } else {
          this.dataStatistic.totalEmployeeDocument = {}
          this.dataStatistic.todayEmployeeDocument = {}
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.isLoading.employeeDocument = false
      })
    },

    getAmountUserFstarOverView () {
      this.isLoading.fstarOverView = true
      let params = {
        region: this.filterDetail.region,
        province: this.filterDetail.province_id,
        station: this.filterDetail.station_id
      }
      HrStatisticService.getAmountUserFstarOverView(params).then(res => {
        if (res.data.success) {
          this.fstarOverView.need_improve = res.data.data.need_improve
          this.fstarOverView.normal = res.data.data.normal
          this.fstarOverView.commendable = res.data.data.commendable
          this.fstarOverView.perfect = res.data.data.perfect
          this.fstarOverView.not_evaluated = res.data.data.not_evaluated
          this.beforeCycle = res.data.cycleEvaluation
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.isLoading.fstarOverView = false
      })
    },

    getStatisticDataInsurance (params) {
      this.isLoading.insurance = true
      HrStatisticService.getStatisticDataInsurance(params).then(res => {
        if (res.data.success) {
          this.dataStatistic.totalEmployeeHasNewInsurance = res.data.data.total.numEmployeeHasNewInsurance ? +res.data.data.total.numEmployeeHasNewInsurance : 0
          this.dataStatistic.numEmployeeHasNewInsuranceToday = res.data.data.today.numEmployeeHasNewInsurance ? +res.data.data.today.numEmployeeHasNewInsurance : 0
        } else {
          this.dataStatistic.totalEmployeeHasNewInsurance = null
          this.dataStatistic.numEmployeeHasNewInsuranceToday = null
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.isLoading.insurance = false
      })
    },

    getStatisticDataEmployeeContract (params) {
      this.isLoading.contract = true
      HrStatisticService.getStatisticDataEmployeeContract(params).then(res => {
        if (res.data.success) {
          this.dataStatistic.totalEmployeeContract = res.data.data.total ? res.data.data.total : {}
          this.dataStatistic.todayEmployeeContract = res.data.data.today ? res.data.data.today : {}
        } else {
          this.dataStatistic.totalEmployeeContract = {}
          this.dataStatistic.todayEmployeeContract = {}
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.isLoading.contract = false
      })
    },

    getSOSTotalTicket () {
      this.isLoading.sosStatus = true
      HrStatisticService.getSOSTotalTicket().then(res => {
        if (res.data.status) {
          this.sosTicket.totalSosTicket = res.data.data.total_sos_ticket
          this.sosTicket.totalCurrentSoSticket = res.data.data.current_sos_ticket
          this.sosTicket.ticketDetail = res.data.data
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.isLoading.sosStatus = false
      })
    },

    openDefaultInfoModal (dataType) {
      this.dataType = dataType
      this.$bvModal.show('modal-statistic-detail-info')
    },

    getStatisticCheckinData (params) {
      this.isLoading.dataCheckin = true
      HrStatisticService.getStatisticCheckinData(params).then((res) => {
        if (res.data.success) {
          this.checkinStatistic = res.data.data
          this.filterCheckin = res.data.data.filter
        } else {
          throw res.data.message
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.isLoading.dataCheckin = false
      })
    },

    openModalListUserNotEvaluated (type, cycleEvaluation) {
      this.cycleEvaluation = cycleEvaluation
      this.typeModalListUserEvaluation = type
      if (type === 'not-evaluation') {
        this.titleModalListUserEvaluation = 'Danh sách nhân viên chưa được đánh giá từ ' + this.cycleEvaluation.from + ' đến ' + this.cycleEvaluation.to
      } else if (type === 'approve-recompense') {
        this.titleModalListUserEvaluation = 'Danh sách nhân viên chưa duyệt thưởng phạt'
      }
      this.toggleModalListUserNotEvaluated(true, cycleEvaluation)
    },

    openModalListCheckin (type) {
      this.typeModalListCheckin = type
      if (type === 'pending-checkin') {
        this.titleModalListCheckin = 'Yêu cầu duyệt công'
      } else if (type === 'leave-no-sal') {
        this.titleModalListCheckin = 'Yêu cầu duyệt nghỉ không lương'
      } else if (type === 'leave-has-sal') {
        this.titleModalListCheckin = 'Yêu cầu duyệt nghỉ phép thường niên'
      } else if (type === 'leave-other') {
        this.titleModalListCheckin = 'Yêu cầu duyệt nghỉ phép việc riêng'
      }

      this.toggleModalListCheckin(true)
    },

    toggleModalListCheckin (value) {
      this.isShowModalListCheckin = value
    },

    toggleModalListUserNotEvaluated (value) {
      this.isShowModalListUserNotEvaluated = value
    },

    openModalListDetail (type, tab = 0) {
      this.typeModalListDetail = type
      this.detailTab = tab
      if (type === 'employee_document') {
        this.titleModalListDetail = 'Nhân viên thiếu hồ sơ'
        this.dataStatisticProp = this.dataStatistic.totalEmployeeDocument
      } else if (type === 'candidate') {
        this.titleModalListDetail = 'Ứng viên'
        this.dataStatisticProp = this.dataStatistic.totalCandidate
      } else if (type === 'employee_contract') {
        this.titleModalListDetail = 'Nhân viên chưa có hoặc hết hạn hợp đồng'
        this.dataStatisticProp = this.dataStatistic.totalEmployeeContract
      } else if (type === 'employee_dependant') {
        this.titleModalListDetail = 'Nhân viên có người phụ thuộc'
        this.dataStatisticProp = this.dataStatistic.totalEmployeeDependant
      } else if (type === 'employee_insurance') {
        this.titleModalListDetail = 'Nhân viên tham gia BHXH mới'
        this.dataStatisticProp = this.dataStatistic.totalEmployeeInsurance
      } else if (type === 'employee_status') {
        this.titleModalListDetail = 'Trạng thái Profile'
        this.dataStatisticProp = {
          not_verified: this.dataStatistic.totalEmployeeNotVerified,
          active: this.dataStatistic.totalEmployeeWorking,
          resign: this.dataStatistic.totalEmployeeResign
        }
      }

      this.toggleModalListDetail(true)
    },

    toggleModalListDetail (value) {
      this.showModalListDetail = value
    },

    openLink (link) {
      window.open(link, '_blank')
    },

    handleSelectedRegion (option) {
      this.filterDetail.region = option ? option.id : ''
    },

    handleSelectedProvince: function (option) {
      this.filterDetail.province_id = option ? option.id : ''
    },

    handleSelectedStation: function (option) {
      this.filterDetail.station_id = option ? option.id : ''
    }
  }
}
</script>

<style lang="scss" scoped>
    .content-type {
      background-color: rgba(24, 28, 33, 0.06);
    }
    .content-type:hover {
      background-color: darkgray;
    }
    .nested::before {
      position: absolute;
      display: block;
      height: 100%;
      content: "";
      border-left: 1px dashed grey;
      left: 5px;
    }
    li {
      border: 1px solid transparent;
      border-bottom: 1px solid rgba(24, 76, 33, 0.1);
      padding-bottom: 0.5rem;
      padding-top: 0.5rem;
      margin-left: 0.5rem;
      list-style-type: none;
    }
    li >>> div {
      display: inline-block;
    }

    li:hover {
      background-color: rgba(24, 28, 33, 0.06);
    }
    .loading-number {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin: 0 4px;
    }

    .user-select-none {
        user-select: none;
    }

    .content-form {
        text-align: right;
    }
    .font-title {
        font-size: 1rem;
    }
    .card-header {
        font-size: 30px;
        text-align: center;
        background: #02a065;
        color: white;
    }
    .cell-content {
        background: #e6e6e6;
    }
    .content-value {
       font-weight: 600;
    }
    .button-detail{
        color:white;
    }
    li.row.last-row {
      border: 1px solid transparent;
    }
    .child-list {
      margin-left: 0.7rem;
    }
    .center-middle {
        display: flex;
        align-items: center;
    }
    .icon-remove-field {
        font-size: 35px;
        margin-left: 20px;
        color: darkgray;
    }
    .icon-remove-field:hover {
        color: #8897AA;
    }
</style>
