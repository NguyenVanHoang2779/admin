<template>
    <div class="d-none d-md-block main-content">
        <div class="mx-0 my-2 row">
            <div class="header-padding text-center-y col-4">
                <div class="d-flex" style="align-items: baseline">
                  <h4 class="m-0 font-weight-bold">Đào tạo</h4>
                  <router-link to="/staff-work/syllabus" class="m-0 header-setting" v-if="dutySyllabus === true">Cài đặt</router-link>
                </div>

                <div class="action-toggle ml-3">
                  <div class="action-toggle--active">Lớp Học</div>
                  <div class="action-toggle--not-active" v-if="!canAccessRookie">Học Viên</div>
                  <router-link
                      v-if="canAccessRookie"
                      :to="{path: '/staff-work/rookie', query: {dutySyllabus}}"
                      class="link action-toggle--not-active">Học Viên
                  </router-link>
                </div>
            </div>

            <b-col class="col-6">
                <div class="d-flex justify-content-end align-item-center">
                    <SlideTab
                      :options="classStatuses" :statistic="statistic"
                      :loading="loadingStatistic" @changeTab="changeTab"
                      :selected="filter.status"
                    >
                    </SlideTab>
                </div>
            </b-col>

            <div class="input-filter col-2" v-if="permissionHr || permissionIt">
              <b-btn variant="ghtk" @click="showModalActionClass('confirm', {})" class="rounded w-100 btn-header-class">+ Tạo lớp</b-btn>
            </div>
        </div>

        <!-- filter  -->
        <div class="mx-0 filter pb-1 row justify-content-between">
            <div class="mb-1 input-filter col-2">
              <multi-select-syllabus
                :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
                :syllabuse-ids="filter.syllabus_id"
                :auto-close="true"
                :placeholder="'Mã/Tên chương trình'"
                @handleSyllabusSelected="handleSyllabusSelected"
              ></multi-select-syllabus>
            </div>
            <div class="mb-1 input-filter col-2">
                <multi-select-class
                    :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
                    @onChange="selectedClassCode"
                    placeholder="Mã lớp">
                </multi-select-class>
            </div>
            <div class="mb-1 input-filter col-2">
                <multi-select-region
                    :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
                    :regions="filter.region"
                    :auto-close="true"
                    :placeholder="'Miền'"
                    @handleSelectedRegion="handleRegionSelected"
                ></multi-select-region>
            </div>
            <div class="mb-1 input-filter col-2">
                <multi-select-province
                    :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
                    :province-ids="filter.province"
                    :region="filter.region"
                    :auto-close="true"
                    :hide-select="true"
                    :placeholder="'Tỉnh'"
                    @handleProvinceSelected="handleProvinceSelected"
                ></multi-select-province>
            </div>
            <div class="mb-1 input-filter col-2">
                <multi-select-station
                  class="z-3 multiselect-ghtk multiselect-no-horizontal"
                  :province-ids="filter.province"
                  :station-ids="filter.station"
                  :auto-close="true"
                  :isActive="true"
                  :hide-select="true"
                  :placeholder="'Kho'"
                  @handleStationSelected="handleStationSelected"
                ></multi-select-station>
            </div>
            <div class="mb-1 input-filter col-2">
                <multi-select-department
                  :placeholder="'Bộ phận'"
                  :department-ids="filter.student_department.join()"
                  @handleDepartmentSelected="handleSelectField('student_department', ...arguments)"
                  :auto-close="true"
                ></multi-select-department>
            </div>
            <div class="mb-1 input-filter col-2">
                <MultiSelectPosition
                  class="z-3 multiselect-ghtk multiselect-no-horizontal"
                  :department-ids="filter.student_department"
                  :position-ids="filter.student_position"
                  :auto-close="true"
                  :hide-selected="true"
                  placeholder="Vị trí học viên"
                  :isSyllabus="true"
                  @handlePositionSelected="handleStudentPositionSelected"
                />
            </div>
            <div class="mb-1 input-filter col-2">
                <multi-select-user
                    :statusId="statusId"
                    :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
                    @onChange="selectedLecturers"
                    placeholder="Giảng viên"
                ></multi-select-user>
            </div>
            <div class="mb-1 input-filter col-2">
              <single-select-user
                :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
                :statusId="statusId"
                @select="op => {filter.pic = op ? op.id : null}"
                @remove="handleFilterUnSelected('pic')"
                placeholder="Người phụ trách"
                :roles="roleHr"
              ></single-select-user>
            </div>
            <div class="mb-1 input-filter col-2">
                <multi-select-user
                    :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
                    @onChange="selectedStudents"
                    placeholder="Học viên"
                    targetApi="hrm"
                ></multi-select-user>
            </div>
            <div class="mb-1 placeholder-contain input-filter col-2">
                <v-date-picker
                    v-model="range_created"
                    mode="range"
                    locale="vi"
                    color="green"
                    :input-props="{ placeholder: 'Ngày tạo lớp', style: 'font-size:14px; line-height: unset; border-radius: 0; border-color: #bdbdbd; border-radius: 0.25rem' }"
                    :popover="{visibility: 'focus'}"
                />
            </div>
            <div class="input-filter col-2">
              <b-btn variant="ghtk" @click="search()" class="filter-containter__btn-search btn-header-class"> Tìm kiếm</b-btn>
            </div>
        </div>

        <!-- thông tin lớp  -->
        <div class="class-container row mx-2 position-relative d-block" v-loading="loading">
          <div class="mb-2" v-for="(classDetail, idx) in listClass" :key="'class' + classDetail.class.id">
                  <b-button class="class-title d-flex justify-content-between" @click="showClassToggle(idx)">
                    <div>
                      Lớp học {{classDetail.class.syllabus}} - {{classDetail.class.code}} | {{classDetail.class.periods.length}} buổi học | {{classDetail.class.total_students}} học viên
                    </div>
                    <div>
                      <i class="fas fa-chevron-up" v-if="showClass['tab_'+idx]"></i>
                      <i class="fas fa-chevron-down" v-else></i>
                    </div>
                  </b-button>
                  <div v-show="showClass['tab_'+idx]">
                    <div class="class-global">
                        <div class="d-flex class-global-content">
                          <div class="class-info-wrap">
                            <div class="d-flex">
                              <div class="class-info">
                                <div class="class-info__item syllabus-name-wrap">
                                  <div class="syllabus-name">
                                    <b>{{classDetail.class.code}} - {{classDetail.class.syllabus}}</b>
                                  </div>
                                  <div class="syllabus-name-action" v-if="!['completed', 'cancel'].includes(classDetail.class.status)">
                                    <button class="btn btn-sm-custom btn-outline-ghtk float-right" @click="showModalActionClass('update', classDetail)">Sửa</button>
                                  </div>
                                </div>
                                <div class="class-info__item">
                                  <b>Tiến độ: </b>
                                  <span v-if="classDetail.class.status === 'pending'">Chờ xác nhận</span>
                                  <span v-else-if="classDetail.class.status === 'cancel'">Hủy</span>
                                  <span v-else-if="classDetail.class.status === 'completed'">Hoàn thành</span>
                                  <span v-else>{{getStatusPeriod(classDetail.period)}}</span>
                                </div>
                                <div class="class-info__item" v-if="isShowStartTime(classDetail)">
                                  <b>Thời gian: </b>
                                  <span>
                                    {{ formatDate(classDetail.period.start_appointment, 'DD/MM/YYYY') }}, {{ formatDate(classDetail.period.start_appointment, 'HH:mm') }}
                                    -
                                    {{ formatDate(classDetail.period.finish_appointment, 'DD/MM/YYYY') }}, {{ formatDate(classDetail.period.finish_appointment, 'HH:mm') }}
                                  </span>
                                </div>
                                <div v-if="classDetail.period.form === 'offline'" class="class-info__item">
                                  <b>Địa điểm: </b>
                                  <span v-if="classDetail.class.station">{{classDetail.class.station}}</span>
                                  <span v-else>Chưa có</span>
                                </div>
                                <div class="class-info__item">
                                  <b>Giảng viên: </b>
                                  <div v-if="classDetail.class.lecturers && classDetail.class.lecturers.length">
                                    <div v-for="(lecturer, idxLecturer) in classDetail.class.lecturers || []" :key="idxLecturer">
                                      {{ idxLecturer + 1 }}. {{lecturer.fullname}} ({{lecturer.username}}) - {{lecturer.position_name}}
                                    </div>
                                  </div>
                                  <span v-else>Chưa có</span>
                                </div>
                                <div class="class-info__item">
                                  <b>Phụ trách lớp: </b>
                                  <span v-if="classDetail.class.curator && classDetail.class.curator.fullname">{{classDetail.class.curator.fullname}} ({{classDetail.class.curator.username}}) - {{classDetail.class.curator.position_name}}</span>
                                  <span v-else>Chưa có</span>
                                </div>
                                <div class="content-log-class">
                                  <div class="tag-wrap">
                                    <div class="mr-1 default-tag text-center-y">
                                      {{ classDetail.class.nameTag }}
                                    </div>
                                    <template v-for="(tag,idx) in classDetail.class.tagClass">
                                      <div class="mr-1 cursor-pointer position-relative default-tag text-center-y"
                                           @mouseover="showIcon('iconDeleteTag' + tag.record_id + idx)"
                                           @mouseout="showIcon('iconDeleteTag' + tag.record_id + idx, 'none')"
                                           :key="idx"
                                           @click="onDeleteTag(tag)">
                                        <div class="d-inline-block">
                                          {{ tag.name }}
                                        </div>
                                        <i class="fa fa-times-circle deleteTag" :id="'iconDeleteTag' + tag.record_id + idx"></i>
                                      </div>
                                    </template>
                                    <span class="text-ghtk cursor-pointer create-tag text-center-y" @click="handleToggleModalHrTag(null, classDetail)">+ Tag</span>
                                  </div>
                                </div>
                              </div>
                              <div class="class-log-document">
                                  <div class="class-document">
                                    <ListPeriodFile
                                      :class="classDetail.class.tagClass.length <= 4 ? 'h-100' : 'h-100__30'"
                                      :periods="classDetail.class.periods"
                                    />
                                  </div>
                                  <b>Chi tiết log</b>
                                  <div class="detail-logs">
                                  <div class="content-detail-log">
                                    <ul class="log-timeline" v-if="classDetail.class.logClass">
                                      <li class="log-timeline-item" v-for="(data, idxLog) in classDetail.class.logClass" :key="idxLog">
                                        <div class="log-timeline-item-tail"></div>
                                        <div class="log-timeline-item-head ant-timeline-item-head-blue"></div>
                                        <div class="log-timeline-item-content">
                                          <span v-if="data.created">{{ formatDate(data.created, 'DD-MM-YYYY HH:mm:ss') }} </span>
                                          <span v-if="data.created_by">{{ data.created_by.username || '' }}
                                          <span v-if="data.created_by.position_name">- {{ data.created_by.position_name || '' }}</span></span>
                                          <span v-if="data.message" v-html="data.message"> </span>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                  <div class="note-class">
                                      <input type="text" class="no-outline" :id="'note-class-' + idx" v-on:keyup.enter="noteClass(classDetail.class.id, 'note-class-'+idx)" placeholder="Nhập ghi chú lớp học">
                                  </div>
                              </div>
                            </div>
                          </div>
                          <div class="class-action">
                              <div>
                                <b-btn
                                    variant="outline-ghtk"
                                    class="action-btn mb-2 btn-sm btn-font-defualt"
                                    v-if="isShowButtonChat(classDetail)"
                                    @click="openChat(classDetail.class.channel_id)"
                                >
                                  Chat
                                </b-btn>
                              </div>
                              <div>
                                  <b-btn
                                      variant="outline-ghtk"
                                      class="action-btn mb-2 btn-sm btn-font-defualt"
                                      v-if="isShowButtonSendTest(classDetail)"
                                      @click="showModalTest(classDetail)"
                                  >
                                      Gửi bài
                                  </b-btn>
                              </div>
                              <div>
                                <b-btn
                                  variant="outline-ghtk"
                                  class="action-btn mb-2 btn-sm btn-font-defualt"
                                  v-if="isShowButtonCreateAppointment(classDetail)"
                                  @click="showModalCreateAppointment(classDetail)"
                                >
                                  {{classDetail.period.start_appointment === null ? 'Hẹn lịch' : 'Sửa lịch hẹn'}}
                                </b-btn>
                              </div>
                              <div>
                                  <b-btn
                                      v-if="isShowButtonComplete(classDetail)"
                                      variant="outline-ghtk"
                                      class="action-btn mb-2 btn-sm btn-font-defualt"
                                      @click="showModalCompletePeriod(classDetail)"
                                  >
                                      Hoàn thành
                                  </b-btn>
                              </div>
                              <div>
                                  <b-btn
                                      v-if="classDetail.class.status === 'happening' || classDetail.class.status === 'pending'"
                                      variant="outline-danger"
                                      class="action-btn mb-2 btn-sm btn-font-defualt"
                                      @click="showModalCancelClass(classDetail.class.id)"
                                  >
                                      Hủy lớp
                                  </b-btn>
                              </div>
                          </div>
                        </div>
                      </div>
                    <list-academy
                        :classDetail="classDetail"
                        :duty="duty"
                        :triggerClickBtnSearch="triggerClickBtnSearch"
                        :triggerRollUpStudent="triggerRollUpStudent"
                        :triggerCancelRollupStudent="triggerCancelRollupStudent"
                        :dataAttendance="dataAttendance"
                        @action="actionTag"
                        @refreshPage="getClasses()"
                        @changeStudentOfClass="listStudents = $event"
                      ></list-academy>
                  </div>
                </div>
        </div>
        <div v-show="(!listClass || !listClass.length) && !loading"> Không tìm thấy lớp học</div>
      <!--   Các modal action   -->
      <div class="box-modal">
        <modal-complete-period
          :class-detail="detailClass"
          :class-period-id="classPeriodId"
          :order="periodOrder"
          @showModalReviewStudent="showModalReviewStudent"
          @refreshPage="getClasses()"
          @showModalConfirmCompletePeriod="showModalConfirmPeriod"
        ></modal-complete-period>
        <modal-create-appointment
          :class-detail="detailClass"
          :trigger-create-appointment="triggerCreateAppointment"
          @refreshPage="getClasses()"
        ></modal-create-appointment>
        <modal-student-no-mark
          :list-student-no-mark="listStudentNoMark"
        ></modal-student-no-mark>
        <ModalReviewStudent
          :student-id="studentId"
          :class-id="classId"
        >
        </ModalReviewStudent>
        <modal-send-test
            @refreshPage="getClasses()"
            :class-detail="detailClass"
            :trigger-search="triggerSearchSendTest"
        >
        </modal-send-test>
        <modal-cancel-class
            :class-id="classId"
            @refreshPage="getClasses()"
        >
        </modal-cancel-class>
        <modal-delete-academy
            :class-id="classId"
            :user-id="tmpUserId"
            :master-id="masterId"
            @refreshPage="getClasses()"
        ></modal-delete-academy>
        <ModalAddStudent
            :classId="classId"
            :class-period-id="periodId"
            :syllabus="tpId"
            @refreshPage="getClasses()"
        >
        </ModalAddStudent>
        <modal-attendance
            @refreshPage="getClasses()"
            @actionAttendance="actionAttendance"
            :class-detail="detailClass"
            :class-academy-info-id="classAcademyInfoId"
            :master-id="masterId"
            :checkin-status="checkinStatus"
        ></modal-attendance>
        <modal-confirm-training
            :stationId="stationId"
            @createClassSuccess="createClassSuccess"
        >
        </modal-confirm-training>
        <mark-modal
        :user-test-id="userTestId"
        :class-id="classIdStore"
        :name-modal="nameUserMarked"
        :username="userNameMark"
        :id-student="idStudent"
        :id-period="idPeriod"
        @resetUserTestId="userTestId=null"
        >
        </mark-modal>
        <modal-review-lesson
          :data-reviews="dataModalReviews"
          @refreshReview="refreshReview()"
        ></modal-review-lesson>
        <modal-confirm-complete-period
          :data-confirm="dataConfirm"
          @closeModal="closeModalConfirmComplete()"
          @refreshReview="refreshReview()"
          @showModalNotice="showModalNotice"
        ></modal-confirm-complete-period>
      </div>

       <div>
          <modal-create-class-v2
            @showModalCreateClass="showModalCreateClass"
            :title="modalClassData.title"
            :class-info="modalClassData.classInfo"
            :type="modalClassData.type"
            @updateOk="updateClassOk"
            :reloadClass="trigger.reloadPendingClass"
            :activeClass="trigger.activeClass"
            @removeAllStudentOfClass="removeAllStudentOfClass"
          ></modal-create-class-v2>
          <!--  HrTag  -->
          <HrTagModal
              :open="openModalHrTag" :attachPermission="curTagData.attach" :scope="'global'"
              :recordId="curTagData.record" :tableName="tableName" :tags="tags" @action="actionUpdateRecord"
          >
          </HrTagModal>
      </div>

      <!-- Phân trang -->
      <div class="paging d-flex">
            <div>
                <b class="float-left">Trang {{ page.currentPage }}/{{ Math.ceil(page.totalItems/page.perPage) }}</b>
            </div>
            <div class="z-0 d-inline-block paginator-ghtk ml-2">
                <b-pagination
                    class="mb-1"
                    size="sm"
                    align="left"
                    v-model="page.currentPage"
                    :total-rows="page.totalItems"
                    :per-page="page.perPage"
                    @input="getClasses()"
                >
                </b-pagination>
            </div>
        </div>
    </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="scss" scoped>
    .header-setting {
        color: #00904A;
        cursor: pointer;
        display: block;
        padding-left: 20px;
        font-size: 1.2rem;
    }

    .btn-sm-custom {
        font-size: 0.894rem;
        padding: 0 8px;
        line-height: 1.5;
    }
    .text-center-y {
        display: flex !important;
        align-items: center;
        line-height: normal;
    }
    .header-padding {
        padding-left: 0.25rem;
    }
    .btn-font-defualt {
        font-size: 0.894rem;
    }
    .icon-gear {
      margin-left: 0.3rem;
      width: 1.3rem;
      filter: invert(36%) sepia(66%) saturate(7499%) hue-rotate(148deg) brightness(98%) contrast(102%);
    }
    .syllabus-name-wrap {
      display: flex;
      justify-content: space-between;
      position: relative;
      margin-top: 2px;
      .syllabus-name {
        display: inline-block;
          max-width: 85%;
      }
      .syllabus-name-action {
        display: inline-block;
          position: absolute;
          right: 10px;
          top: 8px;
      }
    }

    @media only screen and (max-width: 1400px) {
        .syllabus-name-wrap {
            .syllabus-name {
                max-width: 80%;
            }
        }
    }

    .header-action-center {
      width: 71.429%;
    }
    .header-action-right {
      button {
        border-radius: 5px;
        width: 100%;
      }
    }
    .log-timeline .log-timeline-item:last-child .log-timeline-item-tail {
      height: calc(100% - 30px);
    }
    .main-content {
        color: #000000 !important;
    }
    .student-have-not-class {
      margin: -0.15rem 0.5rem 0.75rem;
      div {
        padding: 0 10px;
      }
    }
    .btn-radius {
        border-radius: 20px;
    }
    .w-80 {
        width: 80%;
    }
    .class-global {
        border: solid 1px #f1f1f2;
        .class-info-wrap {
          padding-left: 10px;
        }
    }
    .class-title {
      font-size: 14px;
      background: #dadada;
      padding: 10px;
      width: 100%;
      font-weight: 600;
      color: #000000;
    }
    ::placeholder {
        color: #828282;
    }
    .class-info-wrap {
        width: 90%;
        border-right: 1px solid #dfe1e3;
    }
    .class-info {
        width: 40%;
        border-right: 1px solid #dfe1e3;
    }
    .class-document {
        padding: 10px 0 10px 0;
        position: relative;
        overflow: auto;
    }
    .class-action {
        font-size: 0.9rem;
        width: 15%;
        text-align: center;
        padding-top: 10px;
    }
    .class-log-document {
        padding: 10px;
        border-left: solid 1px #f1f1f2;
    }
    .filter-select-container {
        flex: 1;
    }
    .filter-containter__btn-search {
        border-radius: 5px;
        width: 100%;
    }
    .btn-header-class {
        font-size: 18px;
        line-height: initial;
    }
    .search-button-container {
        padding-right: 12px;
    }
    .pd-5 {
        padding-bottom: 5px;
        padding-top: 5px;
    }
    .btn-user {
        padding: 0;
        border-radius: 15px;
        font-size: 0.83rem;
        width: 44%;
        text-align: center;
    }
    .action-btn {
        width: 110px;
        text-align: center;
        button {
          padding: 5px 30px;
        }
    }
    .check-style {
        color: white;
        background: #BDBDBD;
        border-radius: 10px;
    }
    .active {
        background: #069255;
    }
    .inactive {
        background: red;
    }
    .view-pdf {
        position: unset !important;
    }
    .default-tag {
      background: rgb(6, 146, 85);
      padding: 3px 5px;
      color: white;
      height: 25px;
      display: inline-block;
      margin: 2px 0px;
    }
    .create-tag {
      height: 25px;
      display: inline-block;
      margin: 2px 0px;
      line-height: 25px;

    }
    .deleteTag {
        position: absolute;
        top: -5px;
        right: -5px;
        color: black;
        display: none;
    }

    .tag {
      display: inline-block;
      padding: 0 0.25rem;
    }

    .detail-logs {
      ul.log-timeline {
        li:last-child {
          margin-bottom: -18px;
        }
      }
      .log-timeline{
        box-sizing: border-box;
        color: #000;
        font-variant: tabular-nums;
        line-height: 1rem;
        -webkit-font-feature-settings: "tnum","tnum";
        font-feature-settings: "tnum","tnum";
        padding: 0;
        list-style: none;
      }
      .log-timeline-item {
        position: relative;
        margin: 0;
        padding: 0 4px 0;
        list-style: none;
      }
      .log-timeline-item-tail {
        position: absolute;
        top: 8px;
        left: 6px !important;
        height: calc(100% - 4px);
        border-left: 1px solid #BDBDBD;
      }
      .log-timeline-item-head-blue {
        color: #14a05b;
        border-color: #14a05b !important;
      }
      .log-timeline-item-head {
        width: 6px;
        height: 6px;
        background-color: #000000;
        border: 2px solid transparent;
        border-radius: 89%;
      }
      .log-timeline-item-content {
        position: relative;
        top: -12px;
        margin: 0 0 0 14px;
        word-break: break-word;
        span.btn {
          border-radius: 20px;
          border: 1px solid #00904A;
        }
      }
      .time-log{
        color: #828282;
        font-size: 14px;
      }
      .content-detail-log {
        overflow-y: auto;
        padding-top: 10px;
        min-height: 3rem;
        max-height: 9rem;
      }
      .content-detail-log::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }
    }

    .note-class {
      padding: 6px 0;
        input.no-outline {
          width: 400px;
        }
    }

    .filter-select-container__input {
      border-radius: 0.25rem;
    }
    .class-info__item {
      padding: 5px 15px 0 0;
    }
    .tag-wrap {
      display: flex;
      flex-wrap: wrap;
      padding-top: 9px;
      padding-bottom: 10px;
      /*border-right: solid 1px #dfe1e3;*/
    }
    .btn-filter-tag {
      margin: 0 2px;
    }
    .h-100 {
        height: 100%;
    }
    .small-scrollbar ::-webkit-scrollbar-thumb {
      width: 0 !important;
      height: 0 !important;
    }
    .input-filter {
      width: 14.2857%;
      .my-1 {
        margin-top: 0!important;
      }
    }
    .paging {
      margin-top: 3rem;
    }

    @media only screen and (max-width: 1280px) {
      .class-document {
        //height: 90px;
        .image-document {
          font-size: 0.4em;
          width: 100%;
        }
        .document-type-desc {
          width: 100%;
          font-size: 0.4em;
        }
        .num-img-extend {
          width: 100%;
        }
      }
    }

    .action-toggle {
      --width: 200px;
      --height: 30px;
      width: var(--width);
      height: var(--height);
      box-shadow: 0 1px 3px #cfcfcf;
      border-radius: var(--height);
      cursor: pointer;
      margin-bottom: 0;
      display: flex;
      line-height: var(--height);
      font-weight: 700;
    }

    .action-toggle__left {
      width: calc(var(--width) / 2 + 20px);
      height: calc(var(--height));
      border-radius: calc(var(--height) / 2);
      background-color: #069255;
      box-shadow: 0 1px 3px #cfcfcf;
      color: white;
      text-align: center;
      line-height: var(--height);
    }

    .action-toggle__right {
      width: calc(var(--width) / 2 - 20px);
      text-align: center;
      color: #000000;
    }

    .action-toggle--active {
      width: calc(var(--width) / 2 + 20px);
      height: calc(var(--height));
      border-radius: calc(var(--height) / 2);
      background-color: #069255;
      box-shadow: 0 1px 3px #cfcfcf;
      color: white;
      text-align: center;
      line-height: var(--height);
    }

    .action-toggle--not-active {
      width: calc(var(--width) / 2 - 20px);
      text-align: center;
      color: #000000;
    }

    .cusBtn {
      width: 170px;
    }

</style>
<script>
// custom component
import TimeLine from '../StaffLog/TimeLine.vue'
import ModalCreateClassV2 from './ModalCreateClassV2.vue'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import ListAcademy from './ListAcademy'
import ModalRollUp from './ModalRollUp'
import ModalConfirmClass from './ModalConfirmClass'
import ModalCompletePeriod from './ModalCompletePeriod'
import Multiselect from 'vue-multiselect'
import ModalSendTest from './ModalSendTest'
import ModalCancelClass from './ModalCancelClass'
import HrTagModal from 'components/pages/erp/HrOrder/HrTagModal'
import PeriodTestBuilder from '../Education/PeriodTestBuilder'
import MultiSelectUser from 'components/elements/common/MultiSelectUser'
import MultiSelectClass from 'components/elements/common/MultiSelectClass'
import ModalDeleteAcademy from './ModalDeleteAcademy'
import ModalAddStudent from './ModalAddStudent'
import ModalAttendance from './ModalAttendance'
import MarkModal from './MarkModal'
import ListPeriodFile from './ListPeriodFile.vue'
import ModalStudentNoMark from './ModalStudentNoMark'
import ModalCreateAppointment from './ModalCreateAppointment.vue'
import MultiSelectSyllabus from '../../../elements/common/MultiSelectSyllabus.vue'
import ModalReviewLesson from './ModalReviewLesson.vue'
import ModalConfirmCompletePeriod from './ModalConfirmCompletePeriod.vue'
// import Datepicker from 'vuejs-datepicker'
// service

import trainingService from 'domain/services/training-service'
import newStaffService from 'domain/services/new-staff.service'

// helper
import helper from 'infrastructures/helpers/common-helpers'
// entities
import moment from 'moment'
import hrTagService from 'domain/services/hr-tag-service'
import ModalConfirmTraining from './ModalConfirmTraining'

import {mapGetters, mapActions} from 'vuex'
import ModalReviewStudent from './ModalReviewStudent'
import {eventBus} from '../../../../main'
import MultiSelectRegion from '../../../elements/common/MultiSelectRegion.vue'
import MultiSelectPosition from '../../../elements/common/MultiSelectPosition.vue'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import SlideTab from '../common/SlideTab.vue'
import MultiSelectDepartment from '../../../elements/common/MultiSelectDepartment.vue'
import config from 'config/app.base'

export default {
  name: 'class-manager',

  components: {
    ModalReviewStudent,
    ModalConfirmTraining,
    ModalAttendance,
    ModalAddStudent,
    ModalDeleteAcademy,
    HrTagModal,
    TimeLine,
    ModalConfirmClass,
    ModalCompletePeriod,
    ModalRollUp,
    ListAcademy,
    SingleSelectUser,
    Multiselect,
    ModalCancelClass,
    PeriodTestBuilder,
    ModalSendTest,
    MultiSelectUser,
    MultiSelectClass,
    ModalCreateClassV2,
    ListPeriodFile,
    MarkModal,
    ModalStudentNoMark,
    MultiSelectSyllabus,
    MultiSelectRegion,
    MultiSelectPosition,
    MultiSelectDepartment,
    MultiSelectStation,
    MultiSelectProvince,
    SlideTab,
    ModalCreateAppointment,
    ModalReviewLesson,
    ModalConfirmCompletePeriod
  },

  data: _ => ({
    loading: false,
    isActiveTab: 'all',
    status: null,
    trigger: {
      reloadPendingClass: false,
      activeClass: null
    },
    tabScroll: {
      leftShow: false,
      rightShow: false
    },
    classStatuses: [
      {
        alias: 'all',
        key: 'all',
        name: 'Tất cả'
      },
      {
        alias: 'happening',
        key: 'happening',
        name: 'Đang diễn ra'
      },
      {
        alias: 'pending',
        key: 'pending',
        name: 'Chờ xác nhận'
      },
      {
        alias: 'completed',
        key: 'completed',
        name: 'Hoàn thành'
      },
      {
        alias: 'cancel',
        key: 'cancel',
        name: 'Hủy'
      }
    ],
    loadingStatistic: false,
    statistic: {
      all: null,
      happening: null,
      completed: null,
      cancel: null
    },
    totalNotPlacedStudent: 0,
    listStudents: [],
    statusIdOptions: [
      {
        status: 'pending',
        name: 'Chờ xác nhận'
      },
      {
        status: 'happening',
        name: 'Đang diễn ra'
      },
      {
        status: 'completed',
        name: 'Hoàn thành'
      }
    ],
    range_created: null,
    statusId: 3,
    filter: {
      class_code: null,
      lecturers: null,
      student: null,
      pic: null,
      status: 'all',
      date_from: null,
      date_to: null,
      page: null,
      limit: null,
      class_id: null,
      syllabus_id: [],
      region: null,
      province: null,
      station: null,
      position: null,
      student_department: [],
      student_position: null
    },
    page: {
      currentPage: 1,
      totalPages: 1,
      perPage: 4,
      totalItems: 0
    },
    openModalHrTag: false,
    curr_files: {},
    order_number: {},
    cur_file_creators: {},
    curTagData: {
      record: {},
      attach: true
    },
    reloadTag: 0,
    tags: [],
    modalClassData: {
      title: 'Tạo lớp học',
      type: 'create',
      classInfo: {}
    },
    recordName: 'class_id',
    tableName: 'educate_class',
    duty: null,
    dutySyllabus: false,
    permissionConfirm: false,
    permissionHr: false,
    permissionVh: false,
    permissionIt: false,
    roleHr: [3],
    listClass: [],
    showClass: {
      tab_0: true,
      tab_1: true,
      tab_2: true,
      tab_3: true
    },
    classId: null,
    studentId: null,
    periodId: null,
    periodOrder: null,
    detailClass: null,
    tmpUserId: null,
    masterId: null,
    tpId: null,
    stationId: null,
    classAcademyInfoId: null,
    checkinStatus: null,
    listTraining: [],
    triggerSearchTestResult: false,
    triggerSearchSendTest: false,
    triggerCreateAppointment: false,
    triggerClickBtnSearch: false,
    canAccessRookie: false,
    userTestId: null,
    nameUserMarked: null,
    userNameMark: null,
    classIdStore: null,
    idStudent: null,
    idPeriod: null,
    listStudentNoMark: [],
    dataAttendance: [],
    triggerRollUpStudent: false,
    triggerCancelRollupStudent: false,
    dataModalReviews: null,
    dataConfirm: null,
    classPeriodId: null
  }),

  created () {
    newStaffService.canAccess().then(res => {
      this.canAccessRookie = (res.data && res.data.success)
    })

    if (!helper.isEmpty(this.$route.query.code)) {
      this.filter.class_code = this.$route.query.code
    }

    this.getStatisticClass()
    this.getClasses()

    eventBus.$on('reviewStudentSuccess', ({studentId, log}) => {
      if (this.detailClass && this.detailClass.class && this.detailClass.class.logClass) {
        this.detailClass.class.logClass.push({message: log})
      }
    })
  },
  mounted () {
  },

  computed: {
    helper: function () {
      return helper
    },
    ...mapGetters({
      permissions: 'education/getPermissions'
    })
  },

  watch: {
    status (newVal, oldVal) {
      this.filter.status = newVal ? newVal.map((item) => item.status).toString() : ''
    }
  },

  methods: {
    ...mapActions({
      setPermissions: 'education/setPermissions'
    }),
    isShowStartTime (classDetail) {
      if (classDetail.class.status === 'happening' && classDetail.period.start_appointment != null) {
        return true
      }
      return false
    },
    isShowButtonChat (classDetail) {
      return classDetail.class.status === 'happening' || classDetail.class.status === 'completed'
    },
    isShowButtonSendTest (classDetail) {
      let logs = classDetail.class.logClass
      let hasLogSendTest = false
      logs.forEach((log) => {
        if (log['action'] === 'sendTestEducate' && +log['ref_id'] === +classDetail.period.tp_period_id && +log['tp_class_id'] === +classDetail.period.class_id) {
          hasLogSendTest = true
        }
      })
      return classDetail.period.form !== 'self' && classDetail.class.status !== 'pending' &&
        classDetail.class.status !== 'cancel' && classDetail.period.status === 'happening' && !hasLogSendTest
    },

    isShowButtonCreateAppointment (classDetail) {
      return (classDetail.class.status === 'happening' && classDetail.period.status === 'happening')
    },

    isShowButtonComplete (classDetail) {
      return classDetail.class.status !== 'cancel' && classDetail.class.status !== 'pending' && classDetail.period.status === 'happening'
    },

    formatDate (date, format) {
      return moment(date || null).format(format || 'DD-MM-YYYY')
    },

    openChat (channelId) {
      window.open(config.gchatDomain + '/channel/training/' + channelId, '_blank')
    },
    showModalNotice (data) {
      if (data) {
        this.listStudentNoMark = data
      }
      this.$bvModal.show('modal-student-no-mark')
    },

    showModalActionClass (action = 'create', classInfo = null) {
      if (!this.permissionHr) {
        helper.showMessage('Bạn không có quyền thực hiện thao tác!')
        return
      }
      if (action === 'create') {
        this.modalClassData.title = 'Tạo lớp học'
        this.modalClassData.classInfo = classInfo
      }
      if (action === 'update') {
        this.modalClassData.title = 'Sửa lớp học'
        this.modalClassData.type = 'update'
        if (classInfo) this.modalClassData.classInfo = classInfo
      }
      if (action === 'confirm') {
        this.modalClassData.title = 'Tạo lớp học'
        this.modalClassData.type = 'confirm'
        if (classInfo && Object.keys(classInfo).length > 0 && classInfo.class.status === 'pending') {
          this.modalClassData.classInfo = classInfo
        } else {
          this.modalClassData.classInfo = {}
        }
      }
      this.$bvModal.show('modal-create-class')
    },

    updateClassOk () {
      this.search()
    },

    showModalCancelClass (id) {
      if (!this.permissionHr) {
        helper.showMessage('Bạn không có quyền thực hiện thao tác!')
        return
      }
      this.classId = id
      this.$bvModal.show('modal-cancel-class')
    },

    async noteClass (classId, id) {
      let note = document.getElementById(id).value
      let data = {
        classId: classId,
        note: note
      }

      try {
        const response = await trainingService.addClassNote(data)
        if (response.data.success) {
          helper.showMessage(response.data.message, 'success')
          this.getClasses()
          return
        }
        helper.showMessage(response.data.message || 'Gặp lỗi khi thêm ghi chú !', 'warning')
      } catch (e) {
        console.log(e)
      } finally {
        document.getElementById(id).value = ''
      }
    },

    showModalCompletePeriod (classDetail) {
      this.detailClass = classDetail
      if (classDetail && classDetail.period && classDetail.period.id) {
        this.classPeriodId = classDetail.period.id
      }

      this.$bvModal.show('modal-complete-period')
    },

    showModalCreateAppointment (classDetail) {
      this.detailClass = classDetail
      this.triggerCreateAppointment = !this.triggerCreateAppointment
      this.$bvModal.show('modal-create-appointment')
    },

    showModalTest (classDetail) {
      this.detailClass = classDetail
      this.triggerSearchSendTest = !this.triggerSearchSendTest
      this.$bvModal.show('modal-send-test')
    },

    search () {
      this.page.currentPage = 1
      this.page.perPage = 4
      this.triggerClickBtnSearch = !this.triggerClickBtnSearch
      this.getClasses()
      this.getStatisticClass()
    },

    searchByStatus (value, currentIndex) {
      this.filter.status = value
      this.isActiveTab = currentIndex
      this.getClasses()
    },

    searchAll () {
      this.filter.class_id = null
      this.filter.student = null
      this.filter.lecturers = null
      this.filter.date_from = null
      this.filter.date_to = null
      this.filter.status = 'all'
      this.isActiveTab = 'all'
      this.getClasses()
    },

    getClasses () {
      this.loading = true
      this.filter.date_from = this.range_created ? moment(this.range_created.start).format('YYYY-MM-DD') : null
      this.filter.date_to = this.range_created ? moment(this.range_created.end).format('YYYY-MM-DD') : null

      const params = {
        ...this.filter,
        page: this.page.currentPage,
        limit: this.page.perPage
      }

      trainingService.getClasses(params)
        .then((res) => {
          if (res.data.success) {
            // list classes
            this.listClass = res.data.data.data
            this.duty = res.data.data.duty.duty
            this.dutySyllabus = res.data.data.dutySyllabus
            this.allowPermission(this.duty)
            this.page.totalItems = res.data.data.count
          } else {
            helper.showMessage(res.data.message || 'Gặp lỗi khi lấy thông tin lớp học !', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.loading = false
          this.classPeriodId = null
        })
    },

    getStatisticClass () {
      this.loadingStatistic = true
      this.filter.date_from = this.range_created ? moment(this.range_created.start).format('YYYY-MM-DD') : null
      this.filter.date_to = this.range_created ? moment(this.range_created.end).format('YYYY-MM-DD') : null

      const params = {
        ...this.filter,
        page: this.page.currentPage,
        limit: this.page.perPage
      }
      trainingService.getStatisticClass(params)
        .then(res => {
          if (res.data.success) {
            for (const status in res.data.data) {
              this.statistic[status] = res.data.data[status] || 0
            }
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi lấy thồng kê lớp học !')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.loadingStatistic = false
        })
    },

    getStatusPeriod (period) {
      switch (period.status) {
        case 'coming_up':
          return 'Sắp diễn ra buổi ' + period.order
        case 'happening':
          return 'Đang diễn ra buổi ' + period.order
        case 'finished':
          return 'Hoàn thành buổi ' + period.order
        default:
          return 'N/A'
      }
    },

    getForm (form) {
      if (form === 'offline') return 'Offline'
      if (form === 'online') return 'Online'
      return ''
    },

    isDoc (file) {
      return helper.getFileType(file) === 'doc'
    },

    isImage (file) {
      return helper.getFileType(file) === 'image'
    },

    isPdf (file) {
      return helper.getFileType(file) === 'pdf'
    },
    handleToggleModalHrTag (data = null, classDetail) {
      if (helper.isEmpty(data)) {
        this.tableName = 'educate_class'
        this.curTagData.attach = true
        this.curTagData.record = classDetail.class.id
        this.openModalHrTag = true
        return
      }
      if (data) {
        this.tableName = 'educate_student'
        this.curTagData.attach = true
        this.curTagData.record = data
        this.openModalHrTag = true
      }
    },
    actionUpdateRecord (action) {
      if (action.action === 'attachTag') {
        this.reloadTag++
        if (this.curTagData.record.tags && action.data) {
          this.curTagData.record.tags.push(action.data)
        }
        this.getClasses()
      }
      if (action.action === 'refreshHrTag') {
        this.getClasses()
        this.reloadTag++
      }
      if (action.action === 'closeHrTag') {
        this.openModalHrTag = false
      }
    },
    actionTag (action) {
      if (action.action === 'tag') {
        this.handleToggleModalHrTag(action.data)
      }
      if (action.action === 'showModalDeleteAcademy') {
        this.showModalDeleteAcademy(action)
      }
      if (action.action === 'showModalAddStudent') {
        this.showModalAddStudent(action)
      }
      if (action.action === 'rollUpStudent') {
        this.showModalAttendance(action)
      }
      if (action.action === 'showModalMark') {
        this.showModalMark(action)
      }
      if (action.action === 'showModalReview') {
        this.showModalReview(action.dataModal)
      }
    },

    showModalConfirmPeriod (data) {
      if (data) {
        this.dataConfirm = data
      }

      this.$bvModal.show('id-modal-confirm-complete-period')
    },

    showIcon (id, display = 'inline-block') {
      document.getElementById(id).style.display = display
    },

    async onDeleteTag (tag) {
      try {
        if (confirm('Bạn có chắc muốn xóa tag ' + tag.name + ' ?')) {
          this.loading = true
          const data = await hrTagService.detach({
            record_id: +tag.record_id,
            table_name: tag.table_name,
            hr_tag_id: +tag.id
          })
          if (data.data.success) {
            this.actionUpdateRecord({action: 'refreshHrTag'})
            helper.showMessage(data.data.message || 'Bỏ gắn tag thành công!', 'success')
          } else {
            helper.showMessage(data.data.message, 'warning')
          }
        }
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    capitalizeFirstLetter (string) {
      if (!string) return ''
      string = string.toLowerCase()
      const words = string.split(' ')

      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1)
      }

      return words.join(' ')
    },
    actionRefreshData (action) {
      if (action.action === 'refreshNote') {
        this.getClasses()
      }
    },

    allowPermission (data) {
      let duty = [...data]
      if (duty.includes('IT')) {
        this.permissionHr = true
        this.permissionVh = true
        this.permissionConfirm = true
        this.permissionIt = true
        this.dutySyllabus = true
        this.setPermissions({'permissionIt': true})
      }

      if (duty.includes('HR')) {
        this.dutySyllabus = true
        this.permissionHr = true
      }

      if (duty.includes('VH')) {
        this.dutySyllabus = true
        this.permissionVh = true
      }

      if (duty.includes('curator-teacher')) {
        this.dutySyllabus = true
        this.permissionConfirm = true
      }
    },
    selectedLecturers (ops) {
      this.filter.lecturers = ops ? ops.map(item => item.id) : ''
    },
    selectedStudents (ops) {
      this.filter.student = ops ? ops.map(item => item.id).toString() : ''
    },
    selectedClassCode (ops) {
      this.filter.class_id = ops ? ops.map(item => item.id).toString() : ''
    },

    openSyllabus () {
      window.open('adm/staff-work/syllabus')
    },

    showClassToggle (idx) {
      this.showClass['tab_' + idx] = !this.showClass['tab_' + idx]
    },
    showModalDeleteAcademy (data) {
      this.tmpUserId = data.userId
      this.masterId = data.masterId
      this.classId = data.classId
      this.$bvModal.show('modal-delete-academy')
    },
    showModalAddStudent (data) {
      this.classId = data.classId
      this.periodId = data.periodId
      this.tpId = data.tpId
      this.$bvModal.show('modal-add-student')
    },
    showModalAttendance (data) {
      this.classAcademyInfoId = data.classId
      this.masterId = data.masterId
      this.checkinStatus = data.checkinStatus
      this.detailClass = data.classDetail
      this.$bvModal.show('modal-attendance')
    },

    showModalMark (data) {
      this.userTestId = data.userTestId
      let userClass = this.listClass.find((item) => +item.class.id === +data.idClass)
      this.classIdStore = +data.idClass
      this.nameUserMarked = 'Chấm điểm ' + data.fullName.toUpperCase() + ' | ' + userClass.class.code
      this.userNameMark = data.fullName
      this.idStudent = data.idStudent
      this.idPeriod = data.idPeriod
      this.$bvModal.show('modal-mark')
    },

    showModalCreateClass ({stationId}) {
      this.stationId = stationId
      this.$bvModal.show('modal-confirm-training')
    },
    getSyllabusesCreateClass () {
      trainingService.getSyllabusesCreateClass()
        .then((res) => {
          if (res.data.success) {
            this.listTraining = res.data.data
            helper.showMessage(res.data.message || 'Lấy dữ liệu thành công', 'success')
          } else {
            helper.showMessage(res.data.message || 'xảy ra lỗi!', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.loading = false
        })
    },

    showModalReviewStudent ({studentId, classId}) {
      this.studentId = studentId
      this.classId = classId
      this.$bvModal.show('modal-review-student')
    },

    createClassSuccess (createdClass) {
      this.trigger.reloadPendingClass = !this.trigger.reloadPendingClass
      this.trigger.activeClass = createdClass.id
    },

    handleSyllabusSelected: function (option) {
      this.filter.syllabus_id = option ? option.map((item) => item.id).toString() : ''
    },

    handleRegionSelected: function (option) {
      this.filter.region = option ? option.map((item) => item.id).toString() : ''
    },

    handleProvinceSelected (ops) {
      this.filter.province = ops ? ops.map((item) => item.id).toString() : ''
    },

    handleStationSelected (ops) {
      this.filter.station = ops ? ops.map(item => item.id).toString() : ''
    },

    handlePositionSelected (ops) {
      this.filter.position = ops ? ops.map(item => item.id).toString() : ''
    },

    handleStudentPositionSelected (ops) {
      this.filter.student_position = ops ? ops.map(item => item.id).toString() : ''
    },

    handleFilterUnSelected (filter) {
      this.filter[filter] = null
    },

    handleSelectField (field, value) {
      this.filter[field] = []
      if (value) value.map((el) => (this.filter[field].push(el.id)))
    },

    changeTab (status) {
      this.filter['status'] = status
      this.search()
    },

    removeAllStudentOfClass (classId) {
      this.listClass.forEach((item) => {
        if (item.class.id === classId) {
          item.listStudents = []
        }
      })
    },

    scroll (el, type) {
      el = document.getElementById(el)
      if (!el) return
      el.scroll({left: el.scrollLeft + (type === 'right' ? 150 : -150)})
    },

    actionAttendance (params) {
      this.dataAttendance = params
      if (params.action === 'rollUpStudent') {
        this.triggerRollUpStudent = !this.triggerRollUpStudent
      }
      if (params.action === 'cancelRollupStudent') {
        this.triggerCancelRollupStudent = !this.triggerCancelRollupStudent
      }
    },

    showModalReview (dataModal) {
      if (dataModal) {
        this.dataModalReviews = dataModal
      }
      this.$bvModal.show('id-modal-review-lesson')
    },

    closeModalConfirmComplete () {
      this.dataConfirm = null
    },
    refreshReview () {
      this.getClasses()
      this.classPeriodId = null
    }
  }
}
</script>
