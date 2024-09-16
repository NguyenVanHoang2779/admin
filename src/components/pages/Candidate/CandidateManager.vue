<template>
  <h3>
    Màn này hiện đã đóng, vui lòng vào màn Tuyển dụng, Đăng tin ở menu Quản lý công việc để tiếp tục thao tác hoặc liên hệ HR kho để được hỗ trợ!
  </h3>
<!--  <div class="small-scrollbar">-->
<!--      <div class="col-12 alert-message justify-content-center mb-3">-->
<!--        <b-alert variant="success" show v-if="isSuccessOrFails">{{ messageSuccessOrFails }}</b-alert>-->
<!--      </div>-->
<!--      <div>-->
<!--        <b-row class="align-items-center">-->
<!--          <b-col md="4">-->
<!--            <h4 class="m-0">Quản lý ứng viên</h4>-->
<!--          </b-col>-->
<!--          <b-col class="text-right" md="8">-->
<!--            <b-btn variant="ghtk" @click="search(true)"><i class="fas fa-search"></i> Tìm kiếm</b-btn>-->
<!--            <b-btn variant="ghtk" @click="reset"><i class="fas fa-eraser"></i> Xóa lọc</b-btn>-->
<!--            <span v-if="currUser.allowExport">-->
<!--              <b-btn variant="ghtk" title="Xuất Excel theo điều kiện" v-if="!exporting && !exported" @click="exportCandidates">-->
<!--                <i class="fas fa-file-excel"></i> Xuất dữ liệu-->
<!--              </b-btn>-->
<!--              <b-button variant="ghtk" disabled v-if="exporting">-->
<!--                <i class="fas fa-spinner fa-pulse"></i> Đang xuất dữ liệu-->
<!--              </b-button>-->
<!--              <a class="btn btn-ghtk" :href="URLExportedFile" download="" v-if="exported && !exporting" @click="exported = false">-->
<!--                <i class="fas fa-download"></i> Đã xuất xong, Tải file excel-->
<!--              </a>-->
<!--            </span>-->
<!--            <b-btn class="btn-ghtk" v-b-toggle.collapseUpload>-->
<!--              <span class="ladda-label"><i class="sidenav-icon ion ion-md-cloud-upload"></i>Nhập dữ liệu</span>-->
<!--            </b-btn>-->
<!--            <b-btn variant="ghtk" :to="'/candidate/add'"><i class="fas fa-plus"></i> Thêm ứng viên</b-btn>-->
<!--            <b-btn variant="ghtk" @click="openQuickAdd = true"><i class="fas fa-plus"></i> Thêm nhanh ứng viên</b-btn>-->
<!--            <b-btn variant="ghtk" v-b-modal.modal-tag-manager><i class="ion ion-md-pricetag"></i> Quản lý Tags</b-btn>-->
<!--          </b-col>-->
<!--        </b-row>-->

<!--        <div class="seperate-xs my-1"></div>-->

<!--        &lt;!&ndash;   Import file data     &ndash;&gt;-->
<!--        <b-form-file-->
<!--          v-model="fileExcelCandidateDisabled"-->
<!--          style="display: none"-->
<!--          ref="fileInputDataDisabled"-->
<!--        ></b-form-file>-->
<!--        <div class="mt-2">-->
<!--          <b-collapse id="collapseUpload">-->
<!--            <b-btn variant="ghtk">-->
<!--              <i class="ion ion-md-arrow-down" aria-hidden="true"></i>-->
<!--              <a :href="'/admin/files/templates/Candidate/template_candidates.xlsx'"-->
<!--                 class="text-white" target="_blank">File mẫu</a>-->
<!--            </b-btn>-->
<!--            <b-btn v-b-toggle.collapse-candidate variant="danger">Quy ước File upload</b-btn>-->
<!--            <b-collapse id="collapse-candidate" class="mt-2">-->
<!--              <b-card>-->
<!--                <p class="card-text">-->
<!--                  - Chỉ cho phép upload file excel. <br/>-->
<!--                  - Không được để trống các trường sau: STT, Họ tên, số điện thoại, ngày ứng tuyển, trạng thái.<br/>-->
<!--                  - Nội dung các cột trạng thái, Vị trí, nguồn giới thiệu, kênh giới thiệu chỉ được chọn theo file mẫu. <br/>-->
<!--                  - Ngày Ứng tuyển không được lớn hơn ngày hiện tại và không được có chữ. <br/>-->
<!--                  - Thời gian để ở định dạng DD-MM-YYYY hoặc YYYY-MM-DD, ví dụ: 03-03-2022. <br/>-->
<!--                  - Nếu có nhiều sheet, Hệ thống sẽ nhận sheet đầu tiền của file excel. <br/>-->
<!--                  - Các trạng thái của lưu thông tin: Hủy ứng tuyển, đã nghỉ việc, Không trúng tuyển, từ chối nhận việc..-->
<!--               </p>-->
<!--              </b-card>-->
<!--            </b-collapse>-->
<!--            <div class="table-responsive">-->
<!--              <table class="table">-->
<!--                <tbody>-->
<!--                <tr>-->
<!--                  <td colspan="12">-->
<!--                    <div class="text-center p-3">-->
<!--                      <h4>Kéo thả file để upload-->
<!--                        <div class="text-muted small my-3">hoặc</div>-->
<!--                      </h4>-->
<!--                      <b-btn v-if="isUploading" variant="outline-ghtk" class="exporting-btn">-->
<!--                                          <span>-->
<!--                                            <div class="sk-folding-cube sk-primary">-->
<!--                                              <div class="sk-cube1 sk-cube"></div>-->
<!--                                              <div class="sk-cube2 sk-cube"></div>-->
<!--                                              <div class="sk-cube4 sk-cube"></div>-->
<!--                                              <div class="sk-cube3 sk-cube"></div>-->
<!--                                            </div>-->
<!--                                            Đang xử lý...</span>-->
<!--                      </b-btn>-->
<!--                      <b-button class="btn btn-outline-ghtk" @click="triggerInputFileDataDisabled"-->
<!--                                v-if="!isUploading">-->
<!--                                            <span class="ladda-label"><i-->
<!--                                              class="sidenav-icon ion ion-md-cloud-upload"></i>Chọn file</span>-->
<!--                      </b-button>-->
<!--                    </div>-->
<!--                  </td>-->
<!--                </tr>-->
<!--                </tbody>-->
<!--              </table>-->
<!--            </div>-->
<!--          </b-collapse>-->
<!--        </div>-->
<!--        &lt;!&ndash;   End import     &ndash;&gt;-->

<!--        <b-row class="text-size">-->
<!--            <b-col lg="2" md="3" sm="4" class="mb-1">-->
<!--                <b-form-input v-model="filter.name_cmnd_phone_mail" placeholder="Họ tên, CMND, SĐT, Email"></b-form-input>-->
<!--            </b-col>-->
<!--            <b-col lg="2" md="3" sm="4" class="mb-1">-->
<!--              <single-select-candidate-position :job-id="filter.job_id" @handleChoosePosition="setJob" :hrview="true"></single-select-candidate-position>-->
<!--            </b-col>-->
<!--            <b-col lg="2" md="3" sm="4" class="mb-1">-->
<!--                <single-select-profile-region :region="filter.region" @handleSelectedRegion="setRegion"></single-select-profile-region>-->
<!--            </b-col>-->
<!--            <b-col lg="2" md="3" sm="4" class="mb-1">-->
<!--              <single-select-province-->
<!--                :region-name="filter.region"-->
<!--                :province-id="filter.province_id"-->
<!--                @handleSelectedProvince="setProvince"-->
<!--                custom-class=""-->
<!--              ></single-select-province>-->
<!--            </b-col>-->
<!--            <b-col lg="2" md="3" sm="4" class="mb-1">-->
<!--              <single-select-district-->
<!--                :province-id="filter.province_id + ''"-->
<!--                :district-id="filter.district_id"-->
<!--                @handleSelectedDistrict="setDistrict"-->
<!--                custom-class=""-->
<!--              ></single-select-district>-->
<!--            </b-col>-->
<!--            <b-col lg="2" md="3" sm="4" class="mb-1">-->
<!--                <multi-select-tag @onChange="selectedSearchTag" :tag="this.searchTag"></multi-select-tag>-->
<!--            </b-col>-->
<!--            &lt;!&ndash; <b-col sm="2">-->
<!--              <single-select-referral :referral="filter['referral']" @on-select="setReferral"></single-select-referral>-->
<!--            </b-col> &ndash;&gt;-->
<!--            &lt;!&ndash; <b-col sm="2">-->
<!--              <single-select-candidate-referrer :referrer-id="filter['referrer_id']" @handleChooseRefferer="setReferrer" placeholder="Chọn người giới thiệu"></single-select-candidate-referrer>-->
<!--            </b-col> &ndash;&gt;-->
<!--            <b-col lg="2" md="3" sm="4" class="mb-1">-->
<!--              <multiselect-->
<!--                v-model="dateFilterTypeOp"-->
<!--                :options="dateFilterOptions"-->
<!--                label="name"-->
<!--                placeholder="Tìm theo thời gian"-->
<!--                select-label=""-->
<!--                deselect-label="X"-->
<!--              >-->
<!--                <span class="placeholder" slot="placeholder">Tìm theo thời gian</span>-->
<!--              </multiselect>-->
<!--            </b-col>-->
<!--            <b-col lg="2" md="3" sm="4" class="mb-1">-->
<!--              <v-date-picker-->
<!--                mode="range"-->
<!--                v-model="dateFilter"-->
<!--                locale="vi"-->
<!--                color="green"-->
<!--                :input-props="{ placeholder: 'Chọn khoảng thời gian', style: 'font-size:14px; line-height: unset' }"-->
<!--              />-->
<!--            </b-col>-->
<!--            &lt;!&ndash; <b-col sm="2">-->
<!--              <b-input type="text" v-model="filter.source" placeholder="Nguồn tuyển dụng"/>-->
<!--            </b-col> &ndash;&gt;-->
<!--            <b-col lg="2" md="3" sm="4" class="mb-1">-->
<!--              <multi-select-station-->
<!--                :hide-selected="true"-->
<!--                :auto-close="true"-->
<!--                placeholder="Chọn kho hẹn nhận việc"-->
<!--                @handleStationSelected="setStationJoin"-->
<!--                :station-ids="filter.stationJoin"-->
<!--              ></multi-select-station>-->
<!--            </b-col>-->
<!--            <b-col lg="2" md="3" sm="4" class="mb-1">-->
<!--              <multi-select-station-->
<!--                :hide-selected="true"-->
<!--                :auto-close="true"-->
<!--                placeholder="Chọn kho hẹn phỏng vấn"-->
<!--                @handleStationSelected="setStationInterview"-->
<!--                :station-ids="filter.stationInterview"-->
<!--              ></multi-select-station>-->
<!--            </b-col>-->
<!--            <b-col class="text-right mb-1" md="12" lg="4" sm="8">-->

<!--            </b-col>-->
<!--        </b-row>-->
<!--        <select-candidate-status-buttons-->
<!--          class="mt-2"-->
<!--          @on-change="chooseStatus"-->
<!--          :quantity="countStatus"-->
<!--          :cur-active="filter.status"-->
<!--        ></select-candidate-status-buttons>-->
<!--      </div>-->
<!--      <div class="row mb-1">-->
<!--                      <div class="col-sm text-sm-left text-center pt-2 ml-1">-->
<!--                        <span class="text-muted">Trang {{ page.currentPage }} trên {{ page.totalPages }}</span>-->
<!--                      </div>-->
<!--                      <div class="col-sm pt-1">-->
<!--                        <b-pagination class="justify-content-center justify-content-sm-end m-0"-->
<!--                              v-model="page.currentPage"-->
<!--                              :total-rows="page.totalItems"-->
<!--                              :per-page="page.perPage"-->
<!--                              @input="search()"-->
<!--                              size="sm"-->
<!--                        >-->
<!--                        </b-pagination>-->
<!--                      </div>-->
<!--      </div>-->
<!--      <section class="border">-->
<!--        <div class="text-size fixed-thead" v-loading="loading">-->
<!--                    <table class="table table-sm table-hover m-0">-->
<!--                        <tr>-->
<!--                            <th>-->
<!--                              <div class="text-center">ID</div>-->
<!--                            </th>-->
<!--                            <th>-->
<!--                              <div><span class="text-nowrap">Thông tin nhân sự</span></div>-->
<!--                            </th>-->
<!--                            <th>-->
<!--                              <div>-->
<!--                                <span class="text-nowrap cursor-pointer" @click="sortByField('status')">Trạng thái &nbsp;-->
<!--                                  <span>-->
<!--                                    <span v-if="filter.orderField !== 'status'"><i class="icon ion-md-arrow-dropdown"></i><i class="icon ion-md-arrow-dropup"></i></span>-->
<!--                                    <span v-else>-->
<!--                                      <i class="icon text-ghtk" :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>-->
<!--                                    </span>-->
<!--                                  </span>-->
<!--                                </span>-->
<!--                              </div>-->
<!--                            </th>-->
<!--                            <th>-->
<!--                              <div>-->
<!--                                <span class="text-nowrap cursor-pointer" @click="sortByField('position')">Vị trí làm việc &nbsp;-->
<!--                                  <span>-->
<!--                                    <span v-if="filter.orderField !== 'position'"><i class="icon ion-md-arrow-dropdown"></i><i class="icon ion-md-arrow-dropup"></i></span>-->
<!--                                    <span v-else class="">-->
<!--                                      <i class="icon text-ghtk" :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>-->
<!--                                    </span>-->
<!--                                  </span>-->
<!--                                </span>-->
<!--                              </div>-->
<!--                            </th>-->
<!--                            <th class="create-date">-->
<!--                              <div>-->
<!--                                <span class="text-nowrap cursor-pointer" @click="sortByField('create')">Ngày tạo hồ sơ &nbsp;-->
<!--                                  <span>-->
<!--                                    <span v-if="filter.orderField !== 'create'"><i class="icon ion-md-arrow-dropdown"></i><i class="icon ion-md-arrow-dropup"></i></span>-->
<!--                                    <span v-else class="">-->
<!--                                      <i class="icon text-ghtk" :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>-->
<!--                                    </span>-->
<!--                                  </span>-->
<!--                                </span>-->
<!--                              </div>-->
<!--                            </th>-->
<!--                            <th class="appointment-date">-->
<!--                              <div>-->
<!--                                <span class="text-nowrap cursor-pointer" @click="sortByField('appointment')">Ngày hẹn gặp &nbsp;-->
<!--                                  <span>-->
<!--                                    <span v-if="filter.orderField !== 'appointment'"><i class="icon ion-md-arrow-dropdown"></i><i class="icon ion-md-arrow-dropup"></i></span>-->
<!--                                    <span v-else class="">-->
<!--                                      <i class="icon text-ghtk" :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>-->
<!--                                    </span>-->
<!--                                  </span>-->
<!--                                </span>-->
<!--                              </div>-->
<!--                            </th>-->
<!--                            <th>-->
<!--                              <div><span class="text-nowrap">Tag được gán</span>-->
<!--                              </div>-->
<!--                            </th>-->
<!--                        </tr>-->
<!--                        <template v-for="(candidate, index) in listCandidates">-->
<!--                          <tr :key="index" class="pay-label">-->
<!--                              &lt;!&ndash; Action &ndash;&gt;-->
<!--                              <td style="text-align: center">-->
<!--                                <span>{{ candidate.id }}</span>-->
<!--                                <br/>-->
<!--                                <b-btn class="btn btn-outline-ghtk w-5re" size="sm" :to="'/candidate/edit/' + candidate.id" :target="blankMode && '_blank'">-->
<!--                                  <span class="font-10">Sửa thông tin</span>-->
<!--                                </b-btn>-->
<!--                                <br/>-->
<!--                                <div v-if="candidate.master_profile_id || (candidate.status !== 'expect_join' &&  candidate.status !== 'take_job')"></div>-->
<!--                                <b-button v-else size="sm" class="mt-2 btn-outline-ghtk w-5re" @click="createMasterProfile(candidate)">-->
<!--                                  <span class="font-10">Tạo profile</span>-->
<!--                                </b-button>-->
<!--                                <br/>-->
<!--                                <b-link :href="'/admin/manage-candidates/exportCvCandidate?id_candidate=' + candidate.id" download class="btn btn-outline-ghtk btn-sm mt-2 w-5re">-->
<!--                                  <span class="font-10">Xuất file CV</span>-->
<!--                                </b-link>-->
<!--                              </td>-->

<!--                        &lt;!&ndash; Detail &ndash;&gt;-->
<!--                        <td>-->
<!--                            <div class="row candidate-name" v-if="candidate.name">-->
<!--                              <div class="col-5"><div  class="mr-2">Họ tên: </div></div>-->
<!--                              <div class="col-7"><div>-->
<!--                                <b>-->
<!--                                  <router-link-->
<!--                                    class="m-0 mt-2"-->
<!--                                    v-if="!!+candidate.master_profile_id"-->
<!--                                    :to="{ name: 'edit-master-profile', params: { id: candidate.master_profile_id } }"-->
<!--                                  >-->
<!--                                    {{ candidate.name }}-->
<!--                                  </router-link>-->
<!--                                  <span v-else >{{ candidate.name }}</span>-->
<!--                                </b>-->
<!--                              <b-link v-if="candidate.cv_file" :href="candidate.cv_file" target="_blank"> ( Xem CV )</b-link>-->
<!--                              <br/>-->
<!--                              </div>-->
<!--                              </div>-->
<!--                            </div>-->
<!--                            <div class="row"  v-if="candidate.phone">-->
<!--                              <div class="col-5">-->
<!--                                <div class="mr-2">Số điện thoại: </div>-->
<!--                              </div>-->
<!--                              <div class="col-7">-->
<!--                                <div>-->
<!--                                  <span class="text-has-action" @click="showOriginTel(index)">{{ candidate.phone_display }}</span>-->
<!--                                  <b-link :to="{name: 'list-candidate', params: { name_cmnd_phone_mail: candidate.phone }}" target="_blank">-->
<!--                                    <b-badge variant="info" pill disabled>{{ candidate.num_register }}</b-badge>-->
<!--                                  </b-link>-->
<!--                                </div>-->
<!--                              </div>-->
<!--                            </div>-->
<!--                            <div class="row"  v-if="candidate.district_register_id || candidate.province_register_id">-->
<!--                              <div class="col-5"><div class="mr-2">Nơi đăng ký: </div></div>-->
<!--                              <div class="col-7"><div>-->
<!--                                <span v-if="candidate.district_register_id">-->
<!--                                  {{ Array.isArray(candidate.district_register_name) && candidate.district_register_name.join(', ')}}-->
<!--                                </span>-->
<!--                                <span v-if="candidate.province_register_id">- {{candidate.province_register_name}}</span>-->
<!--                              </div></div>-->
<!--                            </div>-->
<!--                            <template v-if="candidate.showDetail">-->
<!--                              <div class="row" v-if="candidate.birthday">-->
<!--                                <div class="col-5"><div class="mr-2">Ngày sinh: </div></div>-->
<!--                                <div class="col-7"><div><span>{{ moment(candidate.birthday).format('DD-MM-YYYY') }}</span><br/></div></div>-->
<!--                              </div>-->
<!--                              <div  v-if="candidate.gender" class="row">-->
<!--                                <div class="col-5"><div class="mr-2">Giới tính: </div></div>-->
<!--                                <div class="col-7"><div><span v-if="candidate.gender == 'male'"> Nam</span>-->
<!--                                <span v-else>Nữ</span><br/></div></div>-->
<!--                              </div>-->
<!--                              <div class="row" v-if="candidate.mail">-->
<!--                                <div class="col-5"><div class="mr-2">Email: </div></div>-->
<!--                                <div class="col-7"><div><b>{{ candidate.mail }}</b><br/></div></div>-->
<!--                              </div>-->
<!--                              <div class="row" v-if="candidate.identify_id">-->
<!--                                <div class="col-5"><div class="mr-2">Số CMND/CCCD: </div></div>-->
<!--                                <div class="col-7"><div><span> {{ candidate.identify_id }}</span></div></div>-->
<!--                              </div>-->
<!--                              <div class="row" v-if="candidate.degree">-->
<!--                                <div class="col-5"><div class="mr-2">Trình độ học vấn: </div></div>-->
<!--                                <div class="col-7"><div>{{ candidate.degree }}</div></div>-->
<!--                              </div>-->
<!--                              <div class="row" v-if="candidate.marital_status">-->
<!--                                <div class="col-5"><div class="mr-2">Tình trạng hôn nhân: </div></div>-->
<!--                                <div class="col-7"><div>-->
<!--                                  <span v-if="candidate.marital_status == 'married'">Đã kết hôn</span>-->
<!--                                  <span v-else>Độc thân</span>-->
<!--                                </div></div>-->
<!--                              </div>-->
<!--                              <div class="row" v-if="candidate.driver_license">-->
<!--                                <div class="col-5"><div class="mr-2">Bằng lái xe: </div></div>-->
<!--                                <div class="col-7"><div>{{ candidate.driver_license }}</div></div>-->
<!--                              </div>-->
<!--                              <div class="row" v-if="candidate.driver_license_date">-->
<!--                                <div class="col-5"><div class="mr-2">Ngày cấp bằng lái: </div></div>-->
<!--                                <div class="col-7"><div>{{ moment(candidate.driver_license_date).format('DD-MM-YYYY') }}</div></div>-->
<!--                              </div>-->
<!--                              <div class="row" v-if="candidate.work_type">-->
<!--                                <div class="col-5"><div class="mr-2">Hình thức: </div></div>-->
<!--                                <div class="col-7"><div>{{ workTypeDesc[candidate.work_type] || ''}}</div></div>-->
<!--                              </div>-->
<!--                              <div class="row" v-if="candidate.work_shift">-->
<!--                                <div class="col-5"><div class="mr-2">Ca làm việc: </div></div>-->
<!--                              <div class="col-7"><div>{{ workShiftDesc[candidate.work_shift] || ''}}</div></div>-->
<!--                              </div>-->
<!--                              <div class="row"  v-if="(candidate.detail_now || candidate.street_now_id || candidate.district_now_id || candidate.province_now_id)" >-->
<!--                                <div class="col-5"><div class="mr-2">Chỗ ở: </div></div>-->
<!--                                <div class="col-7">-->
<!--                                  <div>-->
<!--                                    <span v-if="candidate.detail_now">{{ candidate.detail_now }}</span>-->
<!--                                    <span v-if="candidate.street_now_id"> - {{ candidate.subdistrict_now_name }}</span>-->
<!--                                    <span v-if="candidate.district_now_id"> - {{ candidate.district_now_name }}</span>-->
<!--                                    <span v-if="candidate.province_now_id"> - {{ candidate.province_now_name }}</span>-->
<!--                                  </div>-->
<!--                                </div>-->
<!--                              </div>-->
<!--                              <div class="row" v-if="candidate.referral">-->
<!--                                <div class="col-5"><div class="mr-2">Nguồn giới thiệu: </div></div>-->
<!--                                <div class="col-7"><div>{{ referralEnums[candidate.referral] }}</div></div>-->
<!--                              </div>-->
<!--                              <div class="row"  v-if="candidate.referrer['id']">-->
<!--                                <div class="col-5"><div class="mr-2">Người giới thiệu: </div></div>-->
<!--                                <div class="col-7">-->
<!--                                  <div>-->
<!--                                    <router-link class="mt-2" :to="{name: 'edit-user', params: { id: candidate.referrer['id'] }}">{{ candidate.referrer['fullname']}} ({{ candidate.referrer.username }})</router-link>-->
<!--                                  </div>-->
<!--                                </div>-->
<!--                              </div>-->
<!--                              <div class="row"  v-if="candidate.referrer['id'] && candidate.ref_reward">-->
<!--                                <div class="col-5"><div class="mr-2">Mức thưởng: </div></div>-->
<!--                                <div class="col-7"><div><b>{{ candidate.ref_reward/1000}}K</b></div></div>-->
<!--                              </div>-->
<!--                              <div class="row"  v-if="candidate.created_by && candidate.created_by.id">-->
<!--                                <div class="col-5"><div class="mr-2">Người tạo: </div></div>-->
<!--                                <div class="col-7"><span class="text-muted">{{ candidate.created_by.fullname }} ({{ candidate.created_by.username }})</span></div>-->
<!--                              </div>-->
<!--                            </template>-->
<!--                            <template v-if="candidate.showResignInfo">-->
<!--                                <div class="row" v-if="candidate.resign_info.resign_date">-->
<!--                                    <div class="col-5"><div class="mr-2">Ngày nghỉ việc: </div></div>-->
<!--                                    <div class="col-7"><div><span>{{ moment(candidate.resign_info.resign_date).format('DD-MM-YYYY') }}</span><br/></div></div>-->
<!--                                </div>-->
<!--                                <div class="row" v-if="candidate.resign_info.resign_type">-->
<!--                                    <div class="col-5"><div class="mr-2">Loại nghỉ việc: </div></div>-->
<!--                                    <div class="col-7"><div><span>{{ candidate.resign_info.resign_type }}</span><br/></div></div>-->
<!--                                </div>-->
<!--                                <div class="row" v-if="candidate.resign_info.resign_date">-->
<!--                                    <div class="col-5"><div class="mr-2">Lí do nghỉ việc: </div></div>-->
<!--                                    <div class="col-7"><div><span>{{ candidate.resign_info.resign_reason }}</span><br/></div></div>-->
<!--                                </div>-->
<!--                            </template>-->
<!--                            <div class="row">-->
<!--                              <b-button variant="link" @click="toggleDetail(candidate)"><span>{{candidate.showDetail ? "Ẩn" : "Xem"}}</span> chi tiết</b-button>-->
<!--                              <b-button variant="link" @click="toggleResignInfo(candidate)" v-if="candidate.resign_info"><span>{{candidate.showResignInfo ? "Ẩn" : "Xem"}}</span> thông tin nghỉ việc</b-button>-->
<!--                              <router-link class="ml-2 mt-2" v-if="candidate.master_profile_id" :to="{name: 'edit-master-profile', params: { id: candidate.master_profile_id }}">Xem hồ sơ</router-link>-->
<!--                            </div>-->
<!--                        </td>-->

<!--                        &lt;!&ndash; Status &ndash;&gt;-->
<!--                        <td style="max-width: 400px">-->
<!--                          <div class="status-wrap">-->
<!--                            <b-badge v-if="candidate.source === 'driverx'" variant="secondary">Đã ứng tuyển Driverx</b-badge>-->
<!--                            <select v-else-->
<!--                              :class="getCandidateStatusClass(candidate.status)"-->
<!--                              @click="updateStageStatus(candidate)"-->
<!--                              @change="onStatusChanged(index)"-->
<!--                              class="form-control-sm border-0"-->
<!--                              v-model="candidate.status"-->
<!--                            >-->
<!--                              <option value="contact"><span>Cần liên hệ</span></option>-->
<!--                              &lt;!&ndash; <option value="received"><span>Đã tiếp nhận</span></option> &ndash;&gt;-->
<!--                              &lt;!&ndash; <option value="contact_fail"><span >Liên hệ không thành công</span></option> &ndash;&gt;-->
<!--                              &lt;!&ndash; <option value="cancel_recruit"><span >Hủy ứng tuyển</span></option> &ndash;&gt;-->
<!--                              <option value="interview"><span >Đã hẹn phỏng vấn</span></option>-->
<!--                              <option value="expect_join"><span >Đã trúng tuyển</span></option>-->
<!--                              <option value="take_job"><span >Đã nhận việc</span></option>-->
<!--                              <option value="saveinfo"><span >Lưu thông tin</span></option>-->
<!--                              &lt;!&ndash; <option value="rejected"><span>Trượt phỏng vấn</span></option> &ndash;&gt;-->
<!--                              &lt;!&ndash; <option value="refused"><span>Từ chối nhận việc</span></option> &ndash;&gt;-->
<!--                            </select>-->
<!--                            <button-->
<!--                              class="btn mt-2 btn-sm btn-outline-ghtk"-->
<!--                              v-if="canSendSms(candidate)"-->
<!--                              @click="showModalSmsContent(index)"-->
<!--                            >-->
<!--                              Cập nhật thời gian hẹn {{ candidate.status === 'expect_join' ? 'nhận việc' : 'phỏng vấn' }}-->
<!--                            </button>-->
<!--                          </div>-->
<!--                          <p v-if="candidate.logs.length && candidate.logs[candidate.logs.length -1].type !== 'status'">-->
<!--                              <b>{{moment(candidate.logs[candidate.logs.length - 1].time).format('DD-MM-YYYY')}}</b>-->
<!--                              <router-link :to="{name: 'edit-user', params: { id: candidate.logs[candidate.logs.length - 1].user.id }}">{{candidate.logs[candidate.logs.length - 1].user.fullname}}</router-link>-->
<!--                              {{candidate.logs[candidate.logs.length - 1].message}}-->
<!--                          </p>-->
<!--                          <p style="margin-bottom: 0px; margin-top: 8px" v-for="(log, index) in candidate.logs" :key="index">-->
<!--                              <template v-if="log.type === 'status'">-->
<!--                                  <b>{{ moment(log.time).format('DD-MM-YYYY HH:mm:ss') }}</b> <router-link :to="{name: 'edit-user', params: { id: log.user.id }}">{{log.user.fullname}}</router-link>-->
<!--                                  kho<strong> {{log.user.station}}</strong>-->
<!--                                    {{log.message}}-->
<!--                              </template>-->
<!--                          </p>-->
<!--                        </td>-->

<!--                        &lt;!&ndash; JOB &ndash;&gt;-->
<!--                        <td class="job-name">-->
<!--                          <span>{{ candidate.job_name }}</span>-->
<!--                          <div v-if="canQuickCreateAcc(candidate)">-->
<!--                            <b-button-->
<!--                              size="sm"-->
<!--                              class="mt-2 btn btn-outline-success"-->
<!--                              @click="showModalCreateUser(index)"-->
<!--                            >-->
<!--                              <span>Tạo nhanh User</span>-->
<!--                            </b-button>-->
<!--                          </div>-->
<!--                        </td>-->

<!--                        &lt;!&ndash; Created date &ndash;&gt;-->
<!--                        <td>{{ moment(candidate.created).format('DD-MM-YYYY') }}</td>-->

<!--                        &lt;!&ndash; ngày hẹn gặp nhận việc, phỏng vấn &ndash;&gt;-->
<!--                        <td class="appointment-date-input">-->
<!--                          <form action="" autocomplete="off">-->
<!--                            <datepicker-->
<!--                              class="dp-fixed-width"-->
<!--                              :input-class="overdate(candidate) ? 'invalid' : null"-->
<!--                              calendar-class="my-datepicker_calendar"-->
<!--                              :value="candidate.status === 'expect_join' ? candidate.expected_join_date : candidate.expected_interview_date"-->
<!--                              name="join-date"-->
<!--                              format="dd-MM-yyyy"-->
<!--                              :bootstrapStyling="true"-->
<!--                              :monday-first="true"-->
<!--                              :full-month-name="true"-->
<!--                              placeholder="&#45;&#45;/&#45;&#45;/&#45;&#45;&#45;&#45;"-->
<!--                              :calendar-button="true"-->
<!--                              calendar-button-icon="ion ion-md-calendar"-->
<!--                              :clear-button="canEditExpectJoin(candidate)"-->
<!--                              :disabled="!canEditExpectJoin(candidate)"-->
<!--                              :disabled-dates="{ to: expectJoinFrom(candidate.apply_date || candidate.created) }"-->
<!--                              @input="updateAppointmentDate(candidate, ...arguments)"-->
<!--                            />-->
<!--                          </form>-->
<!--                        </td>-->
<!--                              &lt;!&ndash; Tags &ndash;&gt;-->
<!--                              <td>-->
<!--                                  <div style="max-width: 200px; min-width: 70px">-->
<!--                                      <tag-->
<!--                                        :list-tag="candidate.tags"-->
<!--                                        :is-manage-tag="0"-->
<!--                                        :candidate-id="candidate.id"-->
<!--                                        @getTagsOfCandidate="getTagsOfCandidate(null, ...arguments)"-->
<!--                                        @getCandidate="getCandidateByTag"-->
<!--                                      ></tag>-->
<!--                                      <div style="width: 200px" v-if="isAddTag[index]"><i class="ion ion-md-add text-ghtk cursor-pointer" style="font-size: 26px;" title="Gán tag" @click="showChoiceTag(index)"></i></div>-->
<!--                                      <div v-else style="display: inline-block; margin-top: 5px">-->
<!--                                          <div style="width: 200px">-->
<!--                                              <multi-select-tag @onChange="selectedTag"></multi-select-tag>-->
<!--                                          </div>-->
<!--                                          <div>-->
<!--                                              <b-btn variant="outline-ghtk" size="sm" @click="attachTagCandidate(index, tag && tag.id)"><i class="fas fa-plus"></i> Thêm</b-btn>-->
<!--                                              <b-btn variant="outline-danger" size="sm" @click="showChoiceTag(index)"><i class="fas fa-times" ></i></b-btn>-->
<!--                                          </div>-->
<!--                                      </div>-->
<!--                                  </div>-->
<!--                              </td>-->
<!--                          </tr>-->
<!--                          <tr v-if="candidate.showDetail" :key="'comment#'+index">-->
<!--                              <td colspan="7">-->
<!--                                <log-comment :currUser="currUser" :list-comments="candidate.logs" :candidate-id="candidate.id" :master-profile-id="candidate.master_profile_id"></log-comment>-->
<!--                              </td>-->
<!--                          </tr>-->
<!--                        </template>-->
<!--                    </table>-->
<!--                    <div class="text-center mt-3" v-if="listCandidates.length === 0"><b>{{ noRecordNoti }}</b></div>-->
<!--        </div>-->
<!--      </section>-->
<!--    &lt;!&ndash; Popup Modal &ndash;&gt;-->
<!--    <div>-->
<!--      &lt;!&ndash; Change status &ndash;&gt;-->
<!--      <b-modal class="vertical-align-modal" ref="evaluate-modal" id="addToLogModal" static>-->
<!--        <template slot="modal-title">-->
<!--          <div><span>ĐÁNH GIÁ/GHI CHÚ ỨNG VIÊN</span></div>-->
<!--        </template>-->
<!--        <b-form-group label="Lý do lưu thông tin:" v-slot="{ ariaDescribedby }" v-show="curCandidate.status === 'saveinfo'">-->
<!--          <b-form-radio-group-->
<!--            id="radio-group-reason-save-info"-->
<!--            v-model="curCandidate.reason_saveinfo"-->
<!--            :options="reasonSaveinfOption"-->
<!--            :aria-describedby="ariaDescribedby"-->
<!--            name="radio-options"-->
<!--            stacked-->
<!--          ></b-form-radio-group>-->
<!--        </b-form-group>-->
<!--        <b-input-->
<!--          v-show="curCandidate.status !== 'saveinfo' || curCandidate.reason_saveinfo === 'other'"-->
<!--          v-model="curCandidate.evaluate"-->
<!--          class="border-0 border-bottom"-->
<!--          placeholder="Viết ghi chú/đánh giá"-->
<!--          @keyup.enter.native="changeStatus"-->
<!--        ></b-input>-->
<!--        <br/>-->
<!--        <span><b>Lưu ý:</b> Ghi chú/đánh giá này sẽ được hiển thị cho người giới thiệu xem</span>-->
<!--        <div slot="modal-footer"  class="w-100 text-center">-->
<!--          <b-button size="md" variant="primary" @click="changeStatus()">-->
<!--            Đồng ý-->
<!--          </b-button>-->
<!--        </div>-->
<!--      </b-modal>-->
<!--      &lt;!&ndash; link to master profile &ndash;&gt;-->
<!--      <b-modal ref="refLinkModal" title="Liên kết với Master Profile" modal-class="text-center" static>-->
<!--        <p><b>Đã tồn tại một Master Profile có cùng số CMND/CCCD</b><p>-->
<!--        <p><b>Chuyển trang để thực hiện thao tác liên kết?</b></p>-->
<!--        <div slot="modal-footer" class="w-100 text-right">-->
<!--          <b-btn variant="secondary" class="modal-btn" @click="$refs.refLinkModal.hide()">Bỏ qua</b-btn>-->
<!--          <b-btn variant="primary" class="modal-btn" @click="redirectToLinkMasterProfile">Đồng ý</b-btn>-->
<!--        </div>-->
<!--      </b-modal>-->
<!--      &lt;!&ndash; quick create user &ndash;&gt;-->
<!--      <quick-create-user-->
<!--        id="modal-quick-create-user"-->
<!--        :candidate="listCandidates[curCandidate.idx]"-->
<!--      ></quick-create-user>-->
<!--      &lt;!&ndash; send Sms to candidate &ndash;&gt;-->
<!--      <modal-send-sms-->
<!--        id="modal-send-sms"-->
<!--        :candidate="listCandidates[curCandidate.idx]"-->
<!--        :next-status="curCandidate.status"-->
<!--        @updateAppointmentOk="checkUpdateStatus"-->
<!--      ></modal-send-sms>-->
<!--      &lt;!&ndash; tag &ndash;&gt;-->
<!--      <modal-tag-manager>-->
<!--      </modal-tag-manager>-->
<!--    </div>-->
<!--    <QuickAddCandidate-->
<!--      :open="openQuickAdd"-->
<!--      @toogle="status => openQuickAdd = status"-->
<!--      @create="quickCreateCandidate"-->
<!--    />-->
<!--  </div>-->
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="scss" scoped>
    @media only screen and (min-width: 1401px) {
        .job-name {
          min-width: 160px;
        }
        .create-date {
          width: 160px;
        }
        .appointment-date {
          width: 180px;
        }
        .candidate-name {
          min-width: 400px;
        }
    }
    @media only screen and (max-width: 1400px) {
        .job-name {
          min-width: 110px;
        }
        .text-size {
          font-size: 11px!important;
        }
        .create-date {
          width: 145px;
        }
        .appointment-date {
          width: 160px;
        }
        .candidate-name {
          min-width: 220px;
        }
    }
  .exporting-btn {
    span {
      position: relative; padding-left: 20px
    }
    .sk-folding-cube.sk-primary{
      position: absolute; height: 12px; width: 12px; top: -37px; left: 0
    }
  }
  .cancel-attach-tag {
    height: 32px;
    line-height: 32px;
    width: 32px;
    color: #6b778c;
    font-size: 24px;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .cancel-attach-tag:hover {
    color: #172b4d;
  }
  .low-height {
    max-height: 40px!important;
    margin-bottom: 10px!important;
  }
  @media only screen and (max-width: 1400px) {
      .limit-height >>> .multiselect__tag {
          font-size: 12px!important;
      }
  }
  .dp-fixed-width >>> .my-datepicker_calendar{
    width: max-content
  }
  .limit-height >>> .multiselect__tags{
    max-height: 150px!important;
    overflow: auto!important;
  }
  section{
    position: relative;
    padding-top: 37px;
  }
  th {
    top: 0;
    border: 0;
    padding: 0;
    white-space: nowrap;
  }
  td {
    border-top: 1px solid #ddd;
  }
  th div {
    position: absolute;
    padding: 10px 5px;
    top: 0;
    min-width: 8%;
  }
  .fixed-thead{
    overflow-y: scroll;
    height: 700px;
    border-top: 1px solid #ddd;
  }
  .modal-btn {
    min-width: 80px;
  }
  span.fas.fa-file-excel {
    position: relative;
    top: -1px;
  }
  span.multiselect__single {
    color: darkgrey;
  }

</style>

<style lang="css" scoped>
  .appointment-date-input >>> .invalid {
    color:#e57373;
    border-color:#e57373;
  }
</style>

<script>
// entities
import Candidate from 'domain/entities/Candidate'
// custom component
import CandidateFilter from './CandidateFilter'
import LogComment from './LogComment'
import SelectCandidateStatusButtons from './SelectCandidateStatusButtons'
import SingleSelectDateRange from './SingleSelectDateRange'
import ModalEditCandidate from './ModalEditCandidate'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import MultiSelectTag from 'components/elements/common/MultiSelectTag'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import SingleSelectCandidateReferrer from './SingleSelectCandidateReferrer'
import SingleSelectReferral from './SingleSelectReferral'
import SingleSelectCandidatePosition from './SingleSelectCandidatePosition'
import ModalTagManager from './ModalTagManager'
import ModalSendSms from './ModalSendSms'
import QuickCreateUser from './ModalQuickCreateUser'
import Tag from 'components/elements/common/Tag'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import QuickAddCandidate from './QuickAddCandidate'
// library
import flatPickr from 'vue-flatpickr-component'
import Datepicker from 'vuejs-datepicker'
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import InputTag from 'vue-input-tag'
import Multiselect from 'vue-multiselect'
// service
import candidateService from 'domain/services/candidate-service'
import profileService from 'domain/services/profile-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'

export default {
  name: 'candidate-manager',

  components: {
    Multiselect,
    SingleSelectDateRange,
    ModalTagManager,
    LogComment,
    MultiSelectTag,
    SelectCandidateStatusButtons,
    CandidateFilter,
    ModalEditCandidate,
    Datepicker,
    flatPickr,
    InputTag,
    Tag,
    SingleSelectProfileRegion,
    SingleSelectCandidatePosition,
    SingleSelectReferral,
    SingleSelectCandidateReferrer,
    SingleSelectDistrict,
    SingleSelectProvince,
    ModalSendSms,
    QuickCreateUser,
    MultiSelectStation,
    QuickAddCandidate,
    LaddaBtn,
    LoadingMiniBottom
  },

  props: {
    name_cmnd_phone_mail: {},
    blankMode: {
      default: null
    }
  },

  data: () => ({
    noRecordNoti: '',
    idCandidateCv: null,
    ulrCvFile: '',
    exporting: false,
    exported: false,
    URLExportedFile: null,
    processorActive: false,
    currEditing: null,
    triggerEdit: false,
    typeEdit: '',
    currUser: {},
    referralEnums: {
      facebook: 'Facebook/internet',
      web: 'Jobsite tuyển dụng',
      workfes: 'Ngày hội việc làm',
      gtvlservice: 'Dịch vụ GTVL',
      ghtk: 'Nhân viên GHTK',
      employee: 'Giới thiệu nội bộ',
      friend: 'Bạn bè, người thân',
      collabor: 'CTV tuyển dụng',
      other: 'Khác',
      outdoor: 'Quảng cáo ngoài trời'
    },
    curCandidate: {
      idx: null,
      candidate_id: null,
      status: null,
      statusText: null,
      evaluate: null,
      reason_saveinfo: null,
      apply_date: null
    },
    stageStatus: {
      candidate_id: null,
      status: null
    },
    page: {
      currentPage: 1,
      totalPages: 1,
      perPage: 50,
      totalItems: 0
    },
    dateFilterOptions: [
      {value: 'created', name: 'Ngày tạo hồ sơ'},
      {value: 'expected_interview_date', name: 'Ngày hẹn phỏng vấn'},
      {value: 'expected_join_date', name: 'Ngày hẹn nhận việc'}
    ],
    reasonSaveinfOption: [
      { text: 'Không liên hệ được', value: 'contact_fail' },
      { text: 'Hủy ứng tuyển', value: 'cancel_recruit' },
      { text: 'Trượt phỏng vấn', value: 'rejected' },
      { text: 'Từ chối nhận việc', value: 'refused' },
      { text: 'khác', value: 'other' }
    ],
    listCandidates: [],
    countStatus: {},
    showReffererSelection: false,
    masterIdLinkable: null,
    cv_file: null,
    dateFilterTypeOp: null,
    dateFilter: null,

    filter: {
      dateFilterType: null,
      start_date: null,
      end_date: null,
      staff_code: null,
      region: null,
      province_id: null,
      district_id: null,
      referral: null,
      job_id: null,
      referrer_id: null,
      processor_id: null,
      name_cmnd_phone_mail: null,
      tag: null,
      source: null,
      status: null,
      stationInterview: null,
      stationJoin: null,
      // order
      orderField: null,
      orderType: null
    },
    searchTag: null,
    tag: null,
    isAddTag: [],
    workTypeDesc: Candidate.workTypeDesc,
    workShiftDesc: Candidate.workShiftDesc,
    loading: false,
    openQuickAdd: false,
    fileExcelCandidateDisabled: [],
    isUploading: false,
    isSuccessOrFails: false,
    messageSuccessOrFails: ''
  }),

  watch: {
    dateFilterTypeOp (newVal, oldVal) {
      if (newVal) this.filter.dateFilterType = newVal.value
      else this.filter.dateFilterType = null

      this.dateFilter = null
    },

    dateFilter (newVal, oldVal) {
      if (newVal) {
        if (newVal.start) {
          this.filter.start_date = moment(newVal.start).format('YYYY-MM-DD')
        } else this.filter.start_date = null
        if (newVal.end) {
          this.filter.end_date = moment(newVal.end).format('YYYY-MM-DD')
        } else this.filter.end_date = null
      } else {
        this.filter.start_date = null
        this.filter.end_date = null
      }
    },

    exporting: function (newVal, oldVal) {
      if (this.URLExportedFile) window.open(this.URLExportedFile, '_blank')
    },

    fileExcelCandidateDisabled: function (newVal, oldVal) {
      if (newVal) {
        this.importCandidates(newVal)
      }
    }
  },

  created () {
    // if (this.$route.query.status) this.filter.status = this.$route.query.status
    // if (this.name_cmnd_phone_mail) this.filter.name_cmnd_phone_mail = this.name_cmnd_phone_mail
    // this.getCurrUser()
    // this.getCandidates(this.filter)
  },

  methods: {
    async quickCreateCandidate (reqData) {
      try {
        const {data} = await candidateService.quickCreateCandidate(reqData)
        if (data.success) {
          this.getCandidates(this.filter)
          helper.showMessage('Thành công!', 'success')
          this.openQuickAdd = false
        } else helper.showMessage(data.message, 'warning')
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      }
    },
    canEditExpectJoin (candidate) {
      if (!candidate) return false
      return ['expect_join', 'interview'].includes(candidate.status)
    },

    selectedTag (option) {
      this.tag = option
    },

    getCandidateByTag (tag) {
      this.filter.tag = tag ? tag.id + '' : null
      this.getCandidates(this.filter)
    },

    selectedSearchTag (option) {
      this.searchTag = option
      this.filter.tag = option ? option.id + '' : null
    },

    showChoiceTag (index) {
      this.$set(this.isAddTag, index, !this.isAddTag[index])
    },

    attachTagCandidate (idxCandidate, tagId) {
      if (!tagId) {
        helper.showMessage('Vui lòng chọn tag !', 'warning')
        return
      }
      if (isNaN(idxCandidate) || !this.listCandidates[idxCandidate]) {
        helper.showMessage('Vui lòng chọn một ứng viên để gắn tag !', 'warning')
        return
      }
      let data = {
        tagId: tagId,
        candidateId: this.listCandidates[idxCandidate].id
      }
      candidateService.attachTagCandidate(data)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message, 'success')
            this.showChoiceTag(idxCandidate)
            this.getTagsOfCandidate(idxCandidate)
          } else {
            helper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    updateCandidate (updated) {
      for (let i = 0; i < this.listCandidates.length; i++) {
        if (this.listCandidates[i].id === updated.id) this.listCandidates[i] = updated
        this.$forceUpdate()
        return
      }
    },

    clearSource () {
      this.currEditing.source = null
    },

    toggleDetail (candidate) {
      candidate.showDetail = !candidate.showDetail
      candidate.showProcessor = candidate.showDetail
      this.$forceUpdate()
    },

    toggleResignInfo (candidate) {
      candidate.showResignInfo = !candidate.showResignInfo
      this.$forceUpdate()
    },

    resetExport () {
      this.exporting = false
      this.exported = false
      this.URLExportedFile = null
    },

    redirectToLinkMasterProfile () {
      if (this.masterIdLinkable !== undefined && this.masterIdLinkable !== null) {
        this.$router.push({name: 'edit-master-profile', params: {id: this.masterIdLinkable}})
      }
    },

    redirectToMasterProfile (candidate) {
      let dataCandidate = {}
      if (candidate.id) {
        dataCandidate['id'] = candidate.id
      }
      if (candidate.name) {
        dataCandidate['name'] = candidate.name
      }
      if (candidate.birthday) {
        dataCandidate['birthday'] = candidate.birthday
      }
      if (candidate.mail) {
        dataCandidate['mail'] = candidate.mail
      }
      if (candidate.phone) {
        dataCandidate['phone'] = candidate.phone
      }
      if (candidate.gender) {
        dataCandidate['gender'] = candidate.gender
      }
      if (candidate.identify_id) {
        dataCandidate['identify_id'] = candidate.identify_id
      }
      if (candidate.type_marriage_name) {
        dataCandidate['marital_status_name'] = candidate.type_marriage_name
      }
      if (candidate.province_now_id) {
        dataCandidate['province_now_id'] = candidate.province_now_id
      }
      if (candidate.district_now_id) {
        dataCandidate['district_now_id'] = candidate.district_now_id
      }
      if (candidate.subdistrict_now_id) {
        dataCandidate['subdistrict_now_id'] = candidate.subdistrict_now_id
      }
      if (candidate.detail_now) {
        dataCandidate['detail_now'] = candidate.detail_now
      }
      if (candidate.province_household_id) {
        dataCandidate['province_household_id'] = candidate.province_household_id
      }
      if (candidate.district_household_id) {
        dataCandidate['district_household_id'] = candidate.district_household_id
      }
      if (candidate.subdistrict_household_id) {
        dataCandidate['subdistrict_household_id'] = candidate.subdistrict_household_id
      }
      if (candidate.detail_household) {
        dataCandidate['detail_household'] = candidate.detail_household
      }
      if (candidate.province_register_id) {
        dataCandidate['province_register_id'] = candidate.province_register_id
      }
      if (candidate.district_register_id) {
        dataCandidate['district_register_id'] = candidate.district_register_id
      }
      if (candidate.province_grant_identify_id) {
        dataCandidate['province_grant_identify_id'] = candidate.province_grant_identify_id
      }
      if (candidate.date_grant_identify_id) {
        dataCandidate['date_grant_identify_id'] = candidate.date_grant_identify_id
      }
      if (candidate.academy_level) {
        dataCandidate['academy_level'] = candidate.academy_level
      }
      if (candidate.type_marriage_name) {
        dataCandidate['type_marriage_name'] = candidate.type_marriage_name
      }
      if (this.curCandidate) {
        dataCandidate['status'] = this.curCandidate.status || candidate.status
        dataCandidate['evaluate'] = this.curCandidate.evaluate
      }

      sessionStorage.setItem('candidate', JSON.stringify(dataCandidate))
      if (this.blankMode) {
        let routeData = this.$router.resolve({name: 'add-master-profile'})
        window.open(routeData.href, '_blank')
        return
      }

      this.$router.push({name: 'add-master-profile'})
    },

    createMasterProfile (candidate) {
      this.masterIdLinkable = null
      if (candidate.identify_id) {
        let dataSend = {
          'field': 'personal_id_number',
          'value': candidate.identify_id
        }
        profileService.existedFieldValue(dataSend)
          .then(response => {
            if (response.data.success) {
              if (response.data.exist) {
                this.masterIdLinkable = response.data.data

                let dataSend = {
                  'candidate_id': candidate.id,
                  'master_id': this.masterIdLinkable
                }

                candidateService.existedMasterProfile(dataSend)
                  .then(res => {
                    if (res.data.success) {
                      if (res.data.data) {
                        alert('Đã tồn tại ứng viên liên kết đến Master Profile có cùng số CMND/CCCD này')
                      } else {
                        this.$refs.refLinkModal.show()
                      }
                    }
                  })
              } else {
                this.redirectToMasterProfile(candidate)
              }
            } else {
              alert('Đã có lỗi xảy ra, vui lòng thử lại.')
            }
          })
      } else {
        this.redirectToMasterProfile(candidate)
      }
    },

    showHideProcessor (candidate) {
      candidate.showProcessor = !candidate.showProcessor
      this.$forceUpdate()
    },

    openModalCandidate (type, candidate) {
      this.$router.push({name: 'add-candidate'})
    },

    updateStageStatus (candidate) {
      if (this.stageStatus.candidate_id !== candidate.id) {
        this.stageStatus.candidate_id = candidate.id
        this.stageStatus.status = candidate.status
      }
    },

    moment: function (data) {
      return moment(data)
    },

    getCurrUser () {
      candidateService.getCurrUser()
        .then(res => {
          if (res.data.success) {
            this.currUser = res.data.data
          }
        }).catch(e => {
          console.log(e)
        })
    },

    overdate (candidate) {
      if (!candidate || !['interview', 'expect_join'].includes(candidate.status)) return false
      if (candidate.status === 'interview') return moment(candidate.expected_interview_date).add(1, 'days').isBefore()
      if (candidate.status === 'expect_join') return moment(candidate.expected_join_date).add(1, 'days').isBefore()
    },

    getCandidates (reqParams) {
      this.loading = true
      candidateService.getCandidateList(reqParams)
        .then(res => {
          if (res.data.success) {
            // paging
            this.page.totalItems = res.data.data['total-candidates']
            this.page.perPage = res.data.data['limit']
            this.page.totalPages = Math.ceil(this.page.totalItems / this.page.perPage)
            // list candidates
            this.listCandidates = res.data.data.candidates
            if (this.listCandidates.length === 0) this.noRecordNoti = 'Không có ứng viên thỏa mãn điều kiện lọc'
            this.listCandidates.forEach((candidate, index) => {
              this.listCandidates[index].showDetail = false
              this.listCandidates[index].showResignInfo = false
              this.listCandidates[index].showProcessor = false
              this.isAddTag[index] = true
            })
            // status count
            this.countStatus = res.data.data.countStatus
          } else {
            helper.showMessage(res.data.message || 'Không thuộc vùng quản lý !', 'warning')
          }
        }).catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.loading = false
        })
    },

    addLog (candidateIdx, log) {
      if (!log) return
      if (isNaN(candidateIdx) || candidateIdx < 0 || !this.listCandidates[candidateIdx].id) return
      this.listCandidates[candidateIdx].logs.push(log)
    },

    onStatusChanged (candidateIdx) {
      if (isNaN(candidateIdx) || candidateIdx < 0 || !this.listCandidates[candidateIdx].id) return
      this.curCandidate.idx = candidateIdx
      this.curCandidate.candidate_id = this.listCandidates[candidateIdx].id
      this.curCandidate.status = this.listCandidates[candidateIdx].status
      this.curCandidate.evaluate = null
      this.curCandidate.reason_saveinfo = null
      this.curCandidate.apply_date = this.listCandidates[candidateIdx].apply_date || this.listCandidates[candidateIdx].created

      if (['interview', 'expect_join'].includes(this.curCandidate.status)) this.showModalSmsContent()
      else this.$refs['evaluate-modal'].show()
      this.listCandidates[candidateIdx].status = this.stageStatus.status
    },

    checkUpdateStatus (data) {
      if (this.curCandidate.status === 'expect_join') {
        this.listCandidates[this.curCandidate.idx].expected_join_date = data.appointment_date
        this.listCandidates[this.curCandidate.idx].station_id = data.stationId
      }
      if (this.curCandidate.status === 'interview') {
        this.listCandidates[this.curCandidate.idx].expected_interview_date = data.appointment_date
        this.listCandidates[this.curCandidate.idx].interview_station_id = data.stationId
      }
      if (this.curCandidate.status && this.curCandidate.status !== this.listCandidates[this.curCandidate.idx].status) {
        this.updateStatus()
      }
    },

    changeStatus () {
      // không là thử việc(probation) thì mới update status và log
      // Còn nếu là thử việc cần có MP thì mới update status và log
      if (isNaN(this.curCandidate.idx) || this.curCandidate.idx < 0 || !this.listCandidates[this.curCandidate.idx] || !this.listCandidates[this.curCandidate.idx].id) return
      if (this.curCandidate.status === 'probation' || this.curCandidate.status === 'collaborators') {
        this.createMasterProfile(this.listCandidates[this.curCandidate.idx])
        return
      }
      this.updateStatus()
    },

    updateStatus () {
      if (isNaN(this.curCandidate.idx) || this.curCandidate.idx < 0 || !this.listCandidates[this.curCandidate.idx].id) return
      candidateService.updateStatus(this.curCandidate)
        .then(res => {
          if (res.data.success) {
            this.listCandidates[this.curCandidate.idx].status = this.curCandidate.status

            this.getTagsOfCandidate(this.curCandidate.idx)
            if (res.data.data) this.addLog(this.curCandidate.idx, res.data.data)
            helper.showMessage(res.data.message, 'success')
            this.$refs['evaluate-modal'].hide()
            if (
              ['contact_fail'].includes(this.listCandidates[this.curCandidate.idx].status) &&
              this.canSendSms(this.listCandidates[this.curCandidate.idx])
            ) this.showModalSmsContent()

            this.curCandidate.evaluate = null
            this.stageStatus.candidate_id = null
            this.stageStatus.status = null
          } else {
            helper.showMessage(res.data.message || 'Không cập nhật được trạng thái cho ứng viên !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    getTagsOfCandidate (idxCandidate, candidateId = null) {
      if (candidateId) idxCandidate = this.listCandidates.findIndex(ca => (+ca.id === +candidateId))
      if (isNaN(idxCandidate) || idxCandidate < 0 || !this.listCandidates[idxCandidate].id) return
      candidateService.getTagsOfCandidate({ candidateId: this.listCandidates[idxCandidate].id })
        .then(res => {
          if (res.data.success) {
            this.listCandidates[idxCandidate].tags = res.data.data
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    sortByField (field) {
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

      this.getCandidates(this.filter)
    },

    resetOrder () {
      this.filter.orderField = null
      this.filter.orderType = null
    },

    chooseStatus (status) {
      this.resetOrder()
      this.filter.status = status === 'all' ? null : status
      if (status !== 'take_job') {
        this.filter.station_id = null
        this.filter.module_id = null
        this.filter.department = null
        this.filter.position_id = null
      }
      if (status === 'interview') {
        if (this.filter.dateFilterType === 'expected_join_date') {
          this.dateFilterTypeOp = null
        }
        this.filter.orderField = 'appointment'
        this.filter.orderType = 'desc'
      }
      if (status === 'expect_join') {
        if (this.filter.dateFilterType === 'expected_interview_date') {
          this.dateFilterTypeOp = null
        }
        this.filter.orderField = 'appointment'
        this.filter.orderType = 'desc'
      }
      this.search()
    },

    handleChooseRefferer (referrerOption) {
      this.filter.referrer_id = referrerOption ? referrerOption.id : null
    },

    handleChooseprocessor (processorOption) {
      this.filter.processor_id = processorOption ? processorOption.id : null
    },

    search (resetStatus = null) {
      this.filter.page = this.page.currentPage
      if (resetStatus) this.filter.status = null
      this.resetOrder()
      this.getCandidates(this.filter)
    },

    exportCandidates () {
      this.URLExportedFile = null
      this.exporting = true
      candidateService.exportCandidateList(this.filter)
        .then(res => {
          if (res.data.success) {
            this.checkJobExportStatus(res.data.data.job_id)
          } else {
            helper.showMessage(res.data.message, 'warning')
            this.exporting = false
            this.exported = false
          }
        })
        .catch(e => {
          this.exporting = false
          this.exported = false
          console.log(e)
        })
    },

    importCandidates (file) {
      if (file) {
        let fileExtension = file.name.split('.').pop()
        if (fileExtension !== 'xlsx') {
          alert('Bạn phải upload file định dạng .xlsx!')
          return
        }
        this.isUploading = true
        let dataSend = new FormData()
        dataSend.append('file_upload', file)
        candidateService.importCandidateList(dataSend)
          .then(res => {
            if (res.data.success) {
              helper.showMessage(res.data.message, 'success')
              this.checkJobImportStatus(res.data.data.id_job)
            } else {
              this.isUploading = false
              helper.showMessage(res.data.message, 'warning')
            }
          })
          .catch(e => {
            this.isUploading = false
            console.log(e)
          })
      }
    },

    checkJobExportStatus (jobId) {
      if (!jobId) helper.showMessage('Đã có lỗi xảy ra', 'warning')
      let getJobStat = setInterval(() => {
        profileService.checkJobStatus({job_id: jobId})
          .then(response => {
            if (response.data.success) {
              if (response.data.data.job_status === 'closed') {
                clearInterval(getJobStat)
                this.URLExportedFile = response.data.data.path
                this.exported = true
                this.exporting = false
                helper.showMessage('Đã xuất xong file dữ liệu', 'success')
              }
            } else {
              helper.showMessage(response.data.message, 'warning')
              clearInterval(getJobStat)
              this.exporting = false
            }
          })
      }, 2000)
    },

    checkJobImportStatus (jobId) {
      if (!jobId) helper.showMessage('Đã có lỗi xảy ra', 'warning')
      let getJobStat = setInterval(() => {
        profileService.checkJobImportStatus({job_id: jobId})
          .then(response => {
            if (response.data.success) {
              var dataAll = response.data.data
              if (dataAll.job_status === 'closed') {
                clearInterval(getJobStat)
                helper.showMessage('Đã import xong file dữ liệu', 'success')
                this.isUploading = false
                this.isSuccessOrFails = true
                this.messageSuccessOrFails = dataAll.message
                this.fileExcelCandidateDisabled = null
              }
            } else {
              helper.showMessage(response.data.message, 'warning')
              clearInterval(getJobStat)
              this.isUploading = false
              this.fileExcelCandidateDisabled = null
            }
          })
      }, 2000)
    },

    resetDataMessage () {
      this.isSuccessOrFails = false
      this.messageSuccessOrFails = ''
    },

    getCandidateStatusName (status) {
      let candidate = new Candidate()
      return candidate.getStatusName(status)
    },

    getCandidateStatusClass (status) {
      let candidate = new Candidate()
      return candidate.getStatusClass(status)
    },

    async updateAppointmentDate (candidate, date) {
      if (date) date = moment(date).format('YYYY-MM-DD')
      let dateType = ''
      if (candidate.status === 'expect_join') dateType = 'ngày hẹn nhận việc'
      if (candidate.status === 'interview') dateType = 'ngày hẹn phỏng vấn'
      await candidateService.updateAppointmentDate({
        id: candidate.id,
        date: date || null
      })
        .then(res => {
          if (res.data.success) {
            if (candidate.status === 'expect_join') candidate.expected_join_date = date
            if (candidate.status === 'interview') candidate.expected_interview_date = date
            helper.showMessage(date ? `${dateType} mới: ${moment(date).format('DD-MM-YYYY')}` : `${dateType} đã xóa`, 'success', 'Cập nhật thành công')
          } else {
            helper.showMessage(`không cập nhật được ${dateType}`, 'warning', 'Lỗi')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
      this.$forceUpdate()
    },

    setRegion (region) {
      this.filter.province_id = null
      if (!region) this.filter.region = null
      else this.filter.region = region.id
    },

    setProvince (province) {
      this.filter.province_id = province ? province.id + '' : null
    },

    setDistrict (district) {
      this.filter.district_id = district ? district.id : null
    },

    setStationInterview (ops) {
      this.filter.stationInterview = ops ? ops.map(op => (op.id)).toString() : null
    },

    setStationJoin (ops) {
      this.filter.stationJoin = ops ? ops.map(op => (op.id)).toString() : null
    },

    setReferrer (referrer) {
      this.filter.referrer_id = referrer ? referrer.id : null
    },

    setReferral (referral) {
      this.filter.referral = referral ? referral.value : null
    },

    setJob (job) {
      this.filter.job_id = job ? job.id : null
    },

    reset () {
      this.dateFilterTypeOp = null
      this.dateFilter = null
      this.searchTag = null
      Object.keys(this.filter).forEach(key => {
        this.filter[key] = null
      })
      this.search(this.filter)
    },

    exportCvCandidate (idCandidate) {
      if (!idCandidate) {
        helper.showMessage('Không có ID ứng viên')
        return
      }
      this.idCandidateCv = idCandidate
      window.open('/admin/manage-candidates/exportCvCandidate?id_candidate=' + idCandidate, '_blank')
    },

    expectJoinFrom (applyDate) {
      if (!applyDate) return
      applyDate = new Date(applyDate)
      applyDate.setDate(applyDate.getDate() - 1)
      return applyDate
    },

    canSendSms (candidate) {
      return (['expect_join', 'contact_fail', 'interview'].includes(candidate.status)) &&
      (!candidate.sentSms || candidate.sentSms !== candidate.status) &&
      !+candidate.master_profile_id
    },

    showModalSmsContent (candidateIdx = -1) {
      if (!isNaN(candidateIdx) && candidateIdx > -1 && this.listCandidates[candidateIdx]) {
        this.curCandidate.idx = candidateIdx
        this.curCandidate.candidate_id = this.listCandidates[candidateIdx].id
        this.curCandidate.status = this.listCandidates[candidateIdx].status
        this.curCandidate.evaluate = null
        this.curCandidate.reason_saveinfo = null
        this.curCandidate.apply_date = this.listCandidates[candidateIdx].apply_date || this.listCandidates[candidateIdx].created
      }
      if (!this.listCandidates[this.curCandidate.idx] || !this.canSendSms(this.listCandidates[this.curCandidate.idx])) return
      this.$bvModal.show('modal-send-sms')
    },

    canQuickCreateAcc (candidate) {
      if ([1, 2, 3, 25].includes(parseInt(candidate.job_id))) return false
      if (!candidate) return false
      return (candidate.status === 'take_job' || candidate.status === 'expect_join') && !candidate.master_profile_id && +candidate.job_id === 1
    },

    showModalCreateUser (candidateIdx) {
      if (isNaN(candidateIdx) || !this.listCandidates[candidateIdx]) return
      this.curCandidate.idx = candidateIdx
      this.$bvModal.show('modal-quick-create-user')
    },

    showOriginTel (candidateIndex) {
      this.listCandidates[candidateIndex].phone_display = this.listCandidates[candidateIndex].phone_origin
    },

    triggerInputFileDataDisabled () {
      this.resetDataMessage()
      this.$refs.fileInputDataDisabled.$el.childNodes[0].click()
    }
  }
}
</script>
