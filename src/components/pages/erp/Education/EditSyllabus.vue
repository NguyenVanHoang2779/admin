<template>
  <div v-loading="loading" class="small-scrollbar">
    <div class="mr-2">
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">Master</label>
        <div class="col-sm-10 p-0">
          <checkbox-custom @model="isMaster = $event" :is-disabled="addOnly" ref="upChecked" id="tp-master"></checkbox-custom>
        </div>
      </div>
      <div class="d-flex mt-2">
        <div class="w-100">
          <div class="d-flex mt-2 mx-4">
            <label class="col-md-2 mt-2 text-left pl-0 text-black">Mã chương trình<span class="text-danger ml-1">*</span></label>
            <b-form-input
              class="rounded col-md-10 text-center input-syllabus"
              v-model="syllabus.code"
              size="xs"
              type="text"
              maxlength="5"
              :disabled="!isAdd && syllabus.has_class"
              :placeholder="isMaster ? 'Mã CT master' : 'Mã chương trình'"
            />
          </div>
          <div class="d-flex mt-2 mx-4">
            <label class="col-md-2 mt-2 text-left pl-0 text-black">{{isMaster ? 'Nội dung master' : 'Tên chương trình'}}<span class="text-danger ml-1">*</span></label>
            <b-form-input
              class="rounded col-md-10 text-center input-syllabus"
              :placeholder="isMaster ? 'Nội dung chương trình master' : 'Điền nội dung chính lớp học'"
              size="xs"
              type="text"
              :disabled="viewOnly"
              v-model="syllabus.content"
            />
          </div>
        </div>
        <div class="mt-2 ml-2 mr-4">
          <div
            class="cursor-pointer thumbnail__element"
            :class="syllabus.thumbnail !== null ? 'preview-active' : 'preview-disable'"
          >
            <img
              v-if="syllabus.thumbnail !== null"
              :src="previewImageRender(syllabus.thumbnail)"
              class="w-100 h-5rem"
              alt=""
            />
            <div v-if="syllabus.thumbnail !== null" class="thumbnail-extend mb-1">
              <span
                class="update-thumbnail cursor-pointer d-inline-flex text-ghtk"
                @click="$refs.inputThumbnail.click()"
              >
                  <i class="fas fa-pencil-alt cursor-pointer"></i>
                  <span>Sửa</span>
              </span>
            </div>
            <div v-else class="file-label-inner" @click="$refs.inputThumbnail.click()">
              <i class="fas fa-plus file-icon"></i>
              <b class="file-description">Thêm ảnh</b>
            </div>
            <input
              type="file"
              class="custom-file-input d-none"
              :multiple="false"
              :accept="accept"
              @input="addThumbnail"
              ref="inputThumbnail"
            />
          </div>
        </div>
      </div>
      <div class="d-flex mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">Mô tả<span class="text-danger ml-1">*</span></label>
        <b-form-input
          placeholder="Nhập mô tả chương trình"
          class="rounded col-md-10 text-center"
          size="xs"
          type="text"
          :disabled="viewOnly"
          v-model="syllabus.description"
        />
      </div>
      <div class="d-flex mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">Yêu cầu</label>
        <multi-select-syllabus
          :custom-class="'col-md-10 multiselect p-0 multiselect-ghtk multiselect-no-horizontal multiselect-center-placeholder'"
          :syllabus-ids="syllabus.required_tp"
          :auto-close="false"
          :is-disabled="viewOnly"
          :placeholder="'Chọn nội dung tiên quyết cần hoàn thành trước khi tham gia lớp này'"
          @handleSyllabusSelected="handleSyllabusSelected">
        </multi-select-syllabus>
      </div>
      <div class="d-flex mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">Ngày áp dụng<span class="text-danger ml-1">*</span></label>
        <div class="col-md-10 d-flex justify-content-between p-0" style="padding:0 !important;">
          <v-date-picker
            v-model="syllabus.time_start"
            :value="syllabus.time_start"
            style="width: 49%!important;"
            locale="vi"
            color="green"
            :input-props="{ placeholder: 'Ngày bắt đầu', style: 'font-size:14px; line-height: unset', class: 'z-3 form-control rounded' }"
            :popover="{visibility: 'focus'}"
            :available-dates="availableStartDate"
          />
          <v-date-picker
            v-model="syllabus.time_end"
            style="width: 49%!important;"
            locale="vi"
            color="green"
            :input-props="{ placeholder: 'Ngày kết thúc', style: 'font-size:14px; line-height: unset', class: 'z-3 form-control rounded' }"
            :popover="{visibility: 'focus'}"
            :available-dates="availableEndDate"
          />
        </div>
      </div>
    </div>
    <b-btn
      v-if="isMaster"
      @click="active_period_inf = !active_period_inf"
      class="font-weight-bold text-dark w-100 text-left my-2 d-flex justify-content-between text-black" v-b-toggle.programInfo
      style="background-color: #F7F7F7">
      Chọn danh sách chương trình
      <i class="fa mt-1" style="color: #a3a4a6; margin-right: 1.9rem" :class="active_period_inf ? 'fa-caret-down' : 'fa-caret-up'"></i>
    </b-btn>
    <b-collapse :visible="isMaster" class="mr-2" id="programInfo">
      <template v-if="!canEditChildTp">
        <div v-for="(p, idx) in list_program_choice" class="row mt-2 mx-4" :key="idx">
          <label class="col-md-2 mt-2 text-center pl-0 text-black">{{ idx+1 }}</label>
          <div class="d-flex col-md-10 p-0 justify-content-between">
            <div class="p-0 multiProgram" style="width: 100%; font-size: 14px !important;">
              <multiselect
                :custom-class="'multiselect-ghtk multiselect-no-horizontal multiselect-center-placeholder'"
                :id="idx"
                v-model="p.idProgram"
                label="content"
                placeholder="Chọn chương trình"
                track-by="id"
                selectedLabel="Chọn"
                deselectLabel="Bỏ chọn"
                selectLabel="Chọn"
                :options="listProgram"
                :searchable="true"
                :allow-empty="false"
                :disabled="true"
                :custom-label="customLabelProgram"
              >
              </multiselect>
            </div>
          </div>
        </div>
      </template>
      <draggable v-model="list_program_choice" @end="changeSelect()" v-else>
        <div v-for="(p, idx) in list_program_choice" class="row mt-2 mx-4" :key="idx">
          <label class="col-md-2 mt-2 text-center pl-0 text-black">{{ idx+1 }}</label>
          <div class="d-flex col-md-10 p-0 justify-content-between">
            <div class="p-0 multiProgram cusDrag" style="width: 100%; font-size: 14px !important;">
              <b-input-group style="width: 100%">
                <b-input-group-prepend style="width: 5%">
                  <b-input-group-text class="drag" style="border-right: none; border-color: #BDBDBD !important; cursor:move;"><i class="fa fa-bars" aria-hidden="true"></i> </b-input-group-text>
                </b-input-group-prepend>
                <multiselect
                  class="cusMul"
                  :custom-class="'multiselect-ghtk multiselect-no-horizontal multiselect-center-placeholder'"
                  :id="idx"
                  v-model="p.idProgram"
                  label="content"
                  placeholder="Chọn chương trình"
                  track-by="id"
                  selectedLabel="Chọn"
                  deselectLabel="Bỏ chọn"
                  selectLabel="Chọn"
                  :options="listProgram"
                  :searchable="true"
                  :allow-empty="false"
                  :disabled="viewOnly"
                  :custom-label="customLabelProgram"
                  @input="changeSelect()"
                >
                </multiselect>
              </b-input-group>
            </div>
            <div class="p-0 cusIcon">
              <i class='fas fa-times-circle' style='font-size: 16px;color: red;margin-top: 60%; cursor: pointer' @click="deletePro(idx)"></i>
            </div>
          </div>
        </div>
      </draggable>
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-center pl-0 text-black"></label>
        <div class="d-flex col-md-10 p-0 justify-content-between">
          <button
            v-if="canEditChildTp"
            class="btn btn-outline-ghtk rounded btn-sm"
            style="width: 100%;height: 37px;margin-top: 0.6%; font-size: 14px !important;"
            @click="numberReturn++"><span class=""
          >
            <i class="fas fa-plus"></i> Thêm chương trình</span>
          </button>
          <div class="p-0 cusIcon">
            <i class='fas fa-times-circle invisible' style='font-size: 16px;color: red;margin-top: 60%; cursor: pointer'></i>
          </div>
        </div>
      </div>
      <hr style="border-top: 1px solid #00904A; margin-top: 1rem;" class="mx-4">
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black" style="font-size: 14px !important;">Tài liệu</label>
        <div style="width: 80%;">
          <div class="scrollbar scrollbar-primary">
            <div class="force-overflow d-flex" >
              <template v-for="(syllabus) in subSyllabusData || []">
                <template v-for="(tpPeriod) in syllabus.tpPeriod || []">
                  <div>
                    <b-modal :id="'view-period-documents' + syllabus.id + tpPeriod.id" title-class="font-weight-bold w-100"
                             header-class="text-center" modal-class="modal-md" hide-footer>
                      <template #modal-title class="text-center">
                        Tài liệu học
                      </template>
                      <ViewDocSubSyllabus :lessons="tpPeriod.files"></ViewDocSubSyllabus>
                    </b-modal>
                  </div>
                  <div class="d-block  pr-2">
                    <div class="d-inline-block w-5re" :key="tpPeriod.id">
                      <div v-if="tpPeriod.files[0]" class="profile-document__element mr-1" @click="showImage('view-period-documents' + syllabus.id + tpPeriod.id)">
                        <div class="document-type-desc">
                          Buổi {{ tpPeriod.order_number }}
                        </div>
                        <div class="num-img-extend">
                          <i class="icon ion-md-eye cursor-pointer font-10 mr-1"></i> xem
                        </div>
                        <span >
                         <img
                           class="image-document"
                           :src="imageUrlRender(tpPeriod.files[0].thumbnail)"
                           :alt="'Tài liệu buổi '+ tpPeriod.id"
                         />
                        </span>
                      </div>
                      <div v-else class="profile-document__element mr-1">
                        <div class="document-type-desc">
                          Buổi {{ tpPeriod.order_number }}
                        </div>
                        <span>
                           <img
                             class="image-document"
                             src=""
                             alt=" Chưa có tài liệu"
                           />
                        </span>
                      </div>
                    </div>
                    <div class="text-center font-12 mt-1 font-weight-bold">
                      {{ syllabus.code }}
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
      <hr style="border-top: 1px solid #00904A; margin-top: 1rem;" class="mx-4">
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black" style="font-size: 14px !important;">Bài kiểm tra</label>
        <div style="width: 80%;">
          <div class="scrollbar scrollbar-primary">
            <div class="force-overflow d-flex" >
              <template v-for="(syllabus) in subSyllabusData || []">
                <template v-for="(tpPeriod) in syllabus.tpPeriod || []">
                  <div class="d-block pr-2">
                    <div class="d-inline-block w-5re" :key="tpPeriod.id">
                      <div  v-if="tpPeriod.files_test[0]" class="profile-document__element mr-1" @click="openLink(tpPeriod.files_test[0])">
                        <div class="document-type-desc">
                          Buổi {{ tpPeriod.order_number  }}
                        </div>
                        <div class="num-img-extend">
                          <i class="icon ion-md-eye cursor-pointer font-10 mr-1"></i> xem
                        </div>
                        <span>
                          <img
                            v-if="['pdf', 'video', 'image', 'doc'].includes(helper.getFileType(tpPeriod.files_test[0]))"
                            class="image-document"
                            :src="imageUrlRender(tpPeriod.files_test[0])"
                            :alt="'Tài liệu buổi '+ tpPeriod.id"
                          />
                        </span>
                      </div>
                      <div  v-else class="profile-document__element mr-1">
                        <div class="document-type-desc">
                          Buổi {{ tpPeriod.order_number  }}
                        </div>
                        <span>
                                        <img
                                          class="image-document"
                                          src=""
                                          alt=" Chưa có tài liệu"
                                        />
                                      </span>
                      </div>
                    </div>
                    <div class="text-center font-12 mt-1 font-weight-bold">
                      {{ syllabus.code }}
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </b-collapse>
    <b-btn
      @click="active_student_inf = !active_student_inf"
      class="font-weight-bold text-dark w-100 text-left my-2 d-flex justify-content-between text-black text-black" v-b-toggle.studentInfo
      style="background-color: #F7F7F7">
      Thông tin học viên
      <i class="fa mt-1" style="color: #a3a4a6; margin-right: 1.9rem" :class="active_student_inf ? 'fa-caret-down' : 'fa-caret-up'"></i>
    </b-btn>
    <b-collapse visible class="mr-2" id="studentInfo">
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">
          Khu vực
          <span class="text-danger ml-1" v-show="!!isMaster">*</span>
        </label>
        <div class="d-flex col-md-10 p-0 justify-content-between">
          <div class="p-0" style="width: 33%">
            <multi-select-region
              :custom-class="'multiselect-ghtk multiselect-no-horizontal multiselect-center-placeholder'"
              :regions="syllabus.regions"
              :is-disabled="viewOnly"
              @handleSelectedRegion="handleRegionSelected"></multi-select-region>
          </div>
          <div class="p-0" style="width: 33%">
            <multi-select-province
              :custom-class="'multiselect-ghtk multiselect-no-horizontal multiselect-center-placeholder'"
              :province-ids="syllabus.province_ids"
              :is-disabled="viewOnly"
              :triggerDuplicateChange="triggerMaster.region"
              @handleTriggerDuplicateChange="triggerMaster.region = false"
              :region="syllabus.regions"
              @handleProvinceSelected="handleProvinceSelected"></multi-select-province>
          </div>
          <div class="p-0" style="width: 33%">
            <multi-select-station
              :custom-class="'multiselect-ghtk multiselect-no-horizontal multiselect-center-placeholder'"
              :auto-close="false"
              :is-disabled="viewOnly"
              :triggerDuplicateChange="triggerMaster.province"
              :province-ids="syllabus.province_ids"
              :station-ids="syllabus.station_ids"
              @handleTriggerDuplicateChange="triggerMaster.province = false"
              @handleStationSelected="handleStationSelected"></multi-select-station>
          </div>
        </div>
      </div>
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">
          Bộ phận
          <span class="text-danger ml-1" v-show="!!isMaster">*</span>
        </label>
        <multi-select-department
          :custom-class="'col-md-10 p-0 multiselect-ghtk multiselect-no-horizontal multiselect-center-placeholder'"
          :auto-close="false"
          :disabled="viewOnly"
          :department-ids="syllabus.department_ids"
          @handleDepartmentSelected="handleDepartmentSelected"></multi-select-department>
      </div>
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">
          Vị trí
          <span class="text-danger ml-1" v-show="!!isMaster">*</span>
        </label>
        <multi-select-position
          class="col-md-10 p-0 multiselect-ghtk multiselect-no-horizontal multiselect-center-placeholder"
          :auto-close="false"
          :disabled="viewOnly"
          :position-ids="syllabus.position_ids" @handlePositionSelected="handlePositionSelected"
          :triggerDuplicateChange="triggerMaster.department"
          @handleTriggerDuplicateChange="triggerMaster.department = false"
          :department-ids="syllabus.department_ids">
        </multi-select-position>
      </div>
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">
          Kiểu nhân viên
          <span class="text-danger ml-1" v-show="!!isMaster">*</span>
        </label>
        <SelectWorkType
          class="col-md-10 p-0 multiselect-ghtk multiselect-no-horizontal multiselect-center-placeholder"
          ref="resetSelectWorkType"
          v-model="syllabus.work_type_ids"
          :position="syllabus.position_ids"
          :disabled="viewOnly"
          :auto-close="false"
          multiple
          append-group-type
        />
      </div>
      <div class="row mt-2 mx-4" v-show="!isMaster">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">
          Điểm đạt
          <span class="text-danger ml-1">*</span>
        </label>
        <b-form-input
          placeholder="Nhập mức điểm đạt"
          :disabled="viewOnly"
          class="rounded text-center fs-15 col-md-10"
          size="xs"
          step=".01"
          type="number"
          v-model="syllabus.benchmark"
        />
      </div>
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">
          Thâm niên (ngày)
          <span class="text-danger ml-1" v-show="!!isMaster">*</span>
        </label>
        <div class="col-md-10 d-flex justify-content-between p-0">
          <b-form-input
            placeholder="Từ"
            :disabled="viewOnly"
            class="rounded text-center fs-15"
            size="xs"
            style="width: 49%!important;"
            @keypress="helper.onlyNumber"
            type="number"
            v-model="syllabus.seniority_min"
          />
          <b-form-input
            placeholder="Đến"
            class="rounded text-center fs-15"
            :disabled="viewOnly"
            style="width: 49%!important;"
            @keypress="helper.onlyNumber"
            size="xs"
            type="number"
            v-model="syllabus.seniority_max"
          />
        </div>
      </div>
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">
          Số lượng
          <span class="text-danger ml-1" v-show="!!isMaster">*</span>
        </label>
        <div class="col-md-10 d-flex justify-content-between p-0">
          <b-form-input
            placeholder="Từ"
            class="rounded text-center fs-15"
            style="width: 49%!important;"
            :disabled="viewOnly"
            @keypress="helper.onlyNumber"
            size="xs"
            type="number"
            v-model="syllabus.amount_min"
          />
          <b-form-input
            placeholder="Đến"
            class="rounded text-center fs-15"
            style="width: 49%!important;"
            :disabled="viewOnly"
            @keypress="helper.onlyNumber"
            size="xs"
            type="number"
            v-model="syllabus.amount_max"
          />
        </div>
      </div>
      <div class="row mt-2 mx-4" v-if="!isMaster">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">
          Gom học viên
          <span class="text-danger ml-1" v-show="!!isMaster">*</span>
        </label>
        <div class="col-md-10 d-flex justify-content-between p-0 flex-column">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="gender" value="kpi" v-model="selectedGatherType" @click.stop="toggleRadioGather">
            <label class="form-check-label">Cơ cấu team tính KPI</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="gender" value="no_kpi" v-model="selectedGatherType" @click.stop="toggleRadioGather">
            <label class="form-check-label">Cơ cấu team không tính KPI</label>
          </div>
          <div class="form-check" style="display: flex">
            <div style="width: 25%">
              <input class="form-check-input" type="radio" name="gender" value="manager" v-model="syllabus.student_gather_type" @click.stop="toggleRadioGather">
              <label class="form-check-label">Theo quản lý</label>
            </div>
            <div style="width: 75%">
              <multi-select-position
                v-if="syllabus.student_gather_type === 'manager'"
                :disabled="viewOnly"
                :id="'student_gather_type'"
                class="col-md-10 p-0 multiselect-ghtk multiselect-no-horizontal multiselect-center-placeholder"
                :auto-close="true"
                :position-ids="syllabus.student_gather_positions" @handlePositionSelected="handleStudentGatherSelected"
                :notInGroup="[1]"
              >
              </multi-select-position>
            </div>
          </div>
        </div>
      </div>
    </b-collapse>
    <b-btn
      v-if="!isMaster"
      @click="active_period_inf = !active_period_inf"
      class="font-weight-bold text-dark w-100 text-left my-2 d-flex justify-content-between text-black" v-b-toggle.lectureInfo
      style="background-color: #F7F7F7"
    >
      Thông tin buổi học
      <i class="fa mt-1" style="color: #a3a4a6; margin-right: 1.9rem" :class="active_period_inf ? 'fa-caret-down' : 'fa-caret-up'"></i>
    </b-btn>
    <b-collapse :visible="!isMaster" class="mr-2" id="lectureInfo">
      <period-manage :type="type" :syllabus="syllabus" :lectures="syllabus.lectures" @disableSubmit="disableSubmitChange"></period-manage>
      <button
        v-if="type !== 'view'"
        class="btn btn-outline-ghtk rounded btn-sm ml-4 mt-4"
        :disabled="!canEditPeriod"
        @click="insertLecture()"
      >
        <span><i class="fas fa-plus"></i> Thêm buổi học</span>
      </button>
    </b-collapse>

    <div class="text-center my-3">
      <button v-if="type !== 'view'" :disabled="disableSubmit" :class="disableSubmit ? 'disable-button' : ''" class="btn btn-ghtk btn-md rounded" @click="submitSyllabus">
        Xác nhận
      </button>
      <button v-if="type === 'view'" class="btn btn-ghtk btn-md rounded" @click="closeModal">
        Đóng
      </button>
    </div>
  </div>
</template>

<script>
// Custom components
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import SelectWorkType from 'components/elements/common/SelectWorkType'
import MultiSelectSyllabus from 'components/elements/common/MultiSelectSyllabus'
import EditPeriodDocuments from 'components/pages/erp/Education/edit-period-documents'
import PeriodManage from './PeriodManage'
import CheckboxGhtk from './CheckboxGhtk'
import Multiselect from 'vue-multiselect'
import Draggable from 'vuedraggable'
// services
import trainingService from 'domain/services/training-service'
import trainingUniService from 'domain/services/Erp/HrmUni/training-service'

// helpers
import helper from 'infrastructures/helpers/common-helpers'
import CheckboxCustom from './CheckboxCustom'
import ViewDocSubSyllabus from './ViewDocSubSyllabus.vue'

export default {
  name: 'edit-syllabus',
  components: {
    ViewDocSubSyllabus,
    MultiSelectRegion,
    MultiSelectProvince,
    MultiSelectStation,
    MultiSelectPosition,
    MultiSelectDepartment,
    MultiSelectSyllabus,
    SelectWorkType,
    PeriodManage,
    Multiselect,
    EditPeriodDocuments,
    CheckboxCustom,
    CheckboxGhtk,
    Draggable
  },

  data: _ => ({
    firstSelectWorkType: true,
    accept: 'image/*',
    selectedGatherType: null,
    loading: false,
    active_student_inf: false,
    active_period_inf: false,
    typeOrganize: [
      {text: 'Offline', value: 'offline'},
      {text: 'Online', value: 'online'}
    ],
    labelProgram: {
      type: String,
      default: 'content'
    },
    old_syllabus: null,
    syllabus: {
      code: null,
      content: null,
      thumbnail: null,
      description: null,
      has_class: false,
      required_tp: '',
      regions: '',
      province_ids: '',
      station_ids: '',
      department_ids: '',
      position_ids: '',
      work_type_ids: '',
      seniority_min: null,
      seniority_max: null,
      amount_min: null,
      student_gather_type: null,
      student_gather_positions: null,
      amount_max: null,
      benchmark: null,
      lectures: [
        {
          form: null,
          teacher_position: null,
          content: '',
          lessons: [],
          files: [],
          test: {
            name: '',
            questions: []
          },
          max_test_time: 0,
          max_retest_total: 0
        }
      ],
      time_end: null,
      time_start: new Date()
    },
    lecture: {
      form: null,
      teacher_position: null,
      content: '',
      lessons: [],
      files: [],
      test: {
        name: '',
        questions: []
      },
      max_test_time: 0,
      max_retest_total: 0
    },
    cur_lecture: {
      form: null,
      teacher_position: null,
      content: '',
      lessons: [],
      files: [],
      test: {
        name: '',
        questions: []
      },
      max_test_time: 0,
      max_retest_total: 0
    },
    list_program_choice: [],
    // listProgram: [],
    program: {},
    isMaster: false,
    numberReturn: 0,
    dataProgram: [],
    subSyllabusData: [],
    triggerMaster: {
      region: false,
      province: false,
      department: false,
      position: false
    },
    availableStartDate: [],
    availableEndDate: [],
    disableSubmit: false
  }),

  computed: {
    viewOnly () {
      return this.type === 'view'
    },
    helper () {
      return helper
    },
    addOnly () {
      return this.type !== 'add'
    },

    isAdd () {
      return this.type === 'add'
    },

    canEditPeriod () {
      return (this.syllabus.update_permission || this.type === 'add')
    },

    canEditChildTp () {
      return (this.syllabus.update_permission || this.type === 'add')
    },
    minTimeEnd () {
      let date = this.syllabus.time_start ? new Date(this.syllabus.time_start) : new Date()
      return date.setDate(date.getDate() + 1)
    },
    maxTimeStart () {
      if (this.syllabus.time_end) {
        let date = new Date(this.syllabus.time_end)
        return date.setDate(date.getDate() - 1)
      }
      return null
    }
  },
  mounted () {
    if (this.type !== 'add' && this.isMaster) {
      this.$refs.upChecked.checkedNow()
    }
  },

  props: {
    editSyllabusData: {},
    triggerSyllabus: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    listProgram: null
  },

  watch: {
    numberReturn: function (newVal, oldVal) {
      this.changeNumberReturn()
    },
    subSyllabusData: function (newVal, oldVal) {
      this.changeSubSyllabus()
    },
    triggerSyllabus: function () {
      this.firstSelectWorkType = true
      if (this.type === 'add') {
        this.isMaster = false
        this.$refs.upChecked.notCheck()
        this.initSyllabus()
      }
    },

    editSyllabusData (newVal) {
      if ((this.type === 'edit' || this.type === 'view') && !helper.isEmpty(newVal)) this.getDetailSyllbus(newVal)
    },
    'syllabus.time_end': function () {
      this.setAvailableStartDate()
    },
    'syllabus.time_start': function () {
      this.setAvailableEndDate()
    }
  },

  methods: {
    toggleRadioGather () {
      if (this.selectedGatherType !== event.target.value) {
        this.selectedGatherType = event.target.value
      } else {
        this.selectedGatherType = null
      }
      this.syllabus.student_gather_type = this.selectedGatherType
    },

    setAvailableStartDate () {
      let maxDate = null
      if (this.syllabus.time_end) {
        let date = new Date(this.syllabus.time_end)
        let today = new Date()
        if (date.getTime() < today.getTime()) {
          this.availableStartDate = [{start: new Date(this.syllabus.time_start), end: new Date(this.syllabus.time_start)}]
          return
        }
        maxDate = date.setDate(date.getDate() - 1)
      }
      this.availableStartDate = [{start: new Date(), end: maxDate}]
      if (this.syllabus.time_start) {
        this.availableStartDate.push({start: new Date(this.syllabus.time_start), end: new Date(this.syllabus.time_start)})
      }
    },

    setAvailableEndDate () {
      let minDate = new Date()
      if (new Date(this.syllabus.time_start) > new Date()) {
        minDate = new Date(this.syllabus.time_start)
      }
      this.availableEndDate = [{start: minDate, end: null}]
      if (this.syllabus.time_end) {
        this.availableEndDate.push({start: new Date(this.syllabus.time_end), end: new Date(this.syllabus.time_end)})
      }
    },

    initSyllabus (syllabus = null) {
      // tạo mới nếu không có syllabus
      if (helper.isEmpty(syllabus)) {
        this.list_program_choice = []
        this.numberReturn = 1
        this.syllabus = {
          code: null,
          content: null,
          thumbnail: null,
          description: null,
          required_tp: '',
          regions: '',
          province_ids: '',
          station_ids: '',
          department_ids: '',
          position_ids: '',
          work_type_ids: '',
          seniority_min: null,
          seniority_max: null,
          amount_min: null,
          amount_max: null,
          lectures: [
            {
              form: 'offline',
              teacher_position: null,
              content: '',
              lessons: [],
              files: [],
              test: {
                name: '',
                questions: []
              },
              max_test_time: 0,
              max_retest_total: 0
            }
          ],
          time_end: '',
          time_start: new Date()
        }
        this.selectedGatherType = null
        this.subSyllabusData = []
      } else { // khởi tạo từ syllabus truyền vào
        if (syllabus.hasOwnProperty('lectures')) {
          syllabus.lectures = syllabus.lectures.map(lecture => {
            return {
              id: lecture.id,
              order_number: lecture.order_number,
              form: lecture.form,
              content: lecture.content,
              max_test_time: lecture.max_test_time,
              max_retest_total: lecture.max_retest_total,
              teacher_position: lecture.teacher_position,
              test: lecture.test,
              lessons_delete: [],
              lessons: lecture.lessons.map(lesson => {
                return {
                  id: lesson.id,
                  order_number: lesson.order_number,
                  title: lesson.title,
                  fileId: lesson.file_id,
                  fileType: lesson.file_type,
                  fileUrl: lesson.links.gdrive || lesson.links.direct,
                  fileThumbnail: lesson.links.thumbnail,
                  isEdit: false,
                  uploading: false,
                  progress: 0,
                  quiz: {
                    isEdit: false,
                    delete_questions: [],
                    add_questions: [],
                    questions: lesson.add_questions
                  }
                }
              })
            }
          })
        }
        this.syllabus = {...syllabus, update_permission: this.editSyllabusData.update_permission}
        this.syllabus.time_end = syllabus.time_end ? new Date(syllabus.time_end) : ''
        this.syllabus.time_start = syllabus.time_start ? new Date(syllabus.time_start) : ''
        this.selectedGatherType = syllabus.student_gather_type
        // Chương trình master
        if (syllabus.child_syllabus) {
          this.isMaster = true
          this.$refs.upChecked.checkedNow()
          this.list_program_choice = []
          this.syllabus.child_syllabus.forEach((item, i) => {
            this.list_program_choice.push({
              idProgram: this.mapOptions(item)
            })
          })
          // this.mapOptionProgram()
          this.numberReturn = this.list_program_choice.length
          this.changeSelect()
        } else {
          this.$refs.upChecked.notCheck()
          this.isMaster = false
        }
        this.old_syllabus = JSON.parse(JSON.stringify(this.syllabus))
      }
      this.setAvailableStartDate()
      this.setAvailableEndDate()
    },

    closeModal () {
      this.$emit('action', {action: 'close-update-syllabus'})
    },
    mapOptions (option) {
      return this.listProgram.find((item) => (+item.id === option))
    },
    previewImageRender (file) {
      if (helper.isEmpty(file)) return ''
      let fileType = helper.getFileType(file)
      if (fileType === 'doc') return 'https://gs.giaohangtietkiem.vn/d/e24bec4ee88441bdb3e79466dd541152.png?height=250'
      if (typeof file === 'object') {
        if (fileType === 'pdf') return 'https://gs.giaohangtietkiem.vn/d/d7d5ef9e764e4227b7aef2c11dfd1371.pngheight=250'
        if (fileType === 'video') return 'https://ghtk.me/images/icon-file-video.png?height=250'
        if (fileType === 'image') return URL.createObjectURL(file)
      } else {
        // là file đã được uplaod lên server
        if (['pdf', 'video'].includes(fileType)) return file + '?extract=thumb'
      }

      return file
    },
    // show hình ảnh, nếu là file pdf, mp4 then open link, nếu là file docx then download
    showImage (id) {
      this.$bvModal.show(id)
    },
    openLink (link) {
      window.open(link, '_blank')
    },

    changeSelect () {
      this.dataProgram = []
      this.list_program_choice.forEach((p, i) => {
        if (p.idProgram) {
          this.dataProgram.push(p.idProgram.id)
        }
      })
      if (this.dataProgram.length > 0) {
        this.getListSubSyllabus()
      } else {
        this.subSyllabusData = []
        this.changeSubSyllabus()
      }
    },

    getListSubSyllabus () {
      let parmas = {
        syllabus: this.dataProgram
      }
      trainingService.getListSubSyllabus(parmas)
        .then((res) => {
          if (res.data.success) {
            this.subSyllabusData = res.data.data
            helper.showMessage(res.data.message, 'success')
          } else {
            helper.showMessage(res.data.message, 'false')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    changeSubSyllabus () {
      if (this.type !== 'add') {
        return true
      }
      let areaLevel = 3
      let regions = []
      let provinceIds = []
      let stationIds = []
      let groupLevel = 3
      let departmentIds = []
      let positionIds = []
      let workIds = []
      let benchmark = null
      let oldRegions = this.syllabus.regions
      let oldProvinces = this.syllabus.province_ids
      let oldDepartments = this.syllabus.department_ids
      let oldPositions = this.syllabus.position_ids
      this.syllabus.regions = ''
      this.syllabus.province_ids = ''
      this.syllabus.station_ids = ''
      this.syllabus.department_ids = ''
      this.syllabus.position_ids = ''
      this.syllabus.work_type_ids = ''
      this.syllabus.benchmark = null
      this.subSyllabusData.forEach((p, i) => {
        if (p.tp_config.region) {
          regions = regions.concat(p.tp_config.region)

          if (!p.tp_config.province_id) {
            areaLevel = Math.min(areaLevel, 1)
          }
          provinceIds = provinceIds.concat(p.tp_config.province_id)

          if (!p.tp_config.station_id) {
            areaLevel = Math.min(areaLevel, 2)
          }
          stationIds = stationIds.concat(p.tp_config.station_id)
        }
        if (p.tp_config.department_id) {
          departmentIds = departmentIds.concat(p.tp_config.department_id)

          if (!p.tp_config.position_id) {
            groupLevel = Math.min(groupLevel, 1)
          }
          positionIds = positionIds.concat(p.tp_config.position_id)
          if (!p.tp_config.work_type_id) {
            groupLevel = Math.min(groupLevel, 2)
          }
          workIds = workIds.concat(p.tp_config.work_type_id)
        }
      })

      if (areaLevel >= 1) {
        regions = regions.filter((v, i, a) => a.indexOf(v) === i)
        this.syllabus.regions = regions.toString()
      }
      this.triggerMaster.region = !(oldRegions === this.syllabus.regions)
      if (areaLevel >= 2) {
        provinceIds = provinceIds.filter((v, i, a) => a.indexOf(v) === i)
        this.syllabus.province_ids = provinceIds.toString()
      }
      this.triggerMaster.province = !(oldProvinces === this.syllabus.province_ids)
      if (areaLevel >= 3) {
        stationIds = stationIds.filter((v, i, a) => a.indexOf(v) === i)
        this.syllabus.station_ids = stationIds.toString()
      }

      if (groupLevel >= 1) {
        departmentIds = departmentIds.filter((v, i, a) => a.indexOf(v) === i)
        this.syllabus.department_ids = departmentIds.toString()
      }
      this.triggerMaster.department = !(oldDepartments === this.syllabus.department_ids)
      if (groupLevel >= 2) {
        positionIds = positionIds.filter((v, i, a) => a.indexOf(v) === i)
        this.syllabus.position_ids = positionIds.toString()
      }
      this.triggerMaster.position = !(oldPositions === this.syllabus.position_ids)
      if (groupLevel >= 3) {
        workIds = workIds.filter((v, i, a) => a.indexOf(v) === i)
        this.syllabus.work_type_ids = workIds.toString()
      }
      this.syllabus.benchmark = benchmark
    },
    imageUrlRender (link) {
      let fileType = helper.getFileType(link)
      link += ['pdf', 'video'].includes(fileType) ? '?extract=thumb' : ''
      if (fileType === 'doc') link = 'https://cache.giaohangtietkiem.vn/d/88896e53582a41399fae1c24d0324a86.jpg?width=450&height=359'
      return link
    },
    customLabelProgram ({code, content, countPeriod}) {
      if (typeof (code) === 'undefined' && typeof (content) === 'undefined' && typeof (countPeriod) === 'undefined') {
        return 'Chọn chương trình'
      }
      return `${code} - ${content} - ${countPeriod} buổi`
    },
    changeNumberReturn () {
      // if (this.numberReturn > 9) {
      //   this.numberReturn = 9
      //   return helper.showMessage('Giới hạn tối đa 9 lần', 'warning')
      // }
      let nR = Number(this.numberReturn)
      let nProgram = this.list_program_choice.length
      if (nR < nProgram) {
        this.list_program_choice.splice(nR, nProgram - nR)
        this.changeSelect()
      } else if (nR !== nProgram) {
        for (let i = nProgram; i < this.numberReturn; i++) {
          this.list_program_choice.push({
            idProgram: null
          })
        }
      }
    },
    action (action, data) {
      if (action.action === 'new-file') {
        this.cur_lecture.files.push(action.data.file)
      }
      if (action.action === 'delete-file') {
        this.cur_lecture.files.splice(action.data.idx, 1)
        if (!helper.isEmpty(this.cur_lecture.file_creators)) this.cur_lecture.file_creators.splice(action.data.idx, 1)
      }
      if (action.action === 'edit-test') {
        if (helper.isEmpty(data.test)) {
          data.test = {
            name: data.content,
            questions: []
          }
        } else data.test.name = data.content
        this.cur_lecture = data
        this.$bvModal.show('edit-period-test')
      }
      if (action.action === 'change-test') {
        this.cur_lecture.test = action.data
      }
    },
    disableSubmitChange (newValue) {
      this.disableSubmit = newValue
    },
    validationSyllabus () {
      if (!this.syllabus.code) {
        helper.showMessage('Mã chương trình không được để trống!')
        return false
      }

      if (!this.syllabus.content && !this.isMaster) {
        helper.showMessage('Tên chương trình không được để trống!')
        return false
      }

      if (!this.syllabus.description) {
        helper.showMessage('Mô tả chương trình không được để trống!')
        return false
      }
      if (!this.syllabus.thumbnail) {
        helper.showMessage('Ảnh chương trình không được để trống!')
        return false
      }

      if (!this.syllabus.time_start) {
        helper.showMessage('Ngày bắt đầu áp dụng không được để trống!')
        return false
      }

      if (!this.syllabus.benchmark && !this.isMaster) {
        helper.showMessage('Điểm đạt không được để trống!')
        return false
      }

      if (this.syllabus.hasOwnProperty('student_gather_type') && this.syllabus.student_gather_type === 'manager' &&
        (!this.syllabus.hasOwnProperty('student_gather_positions') || this.syllabus.student_gather_positions === '') && !this.isMaster) {
        helper.showMessage('Giá trị trường vị trí quản lý là bắt buộc')
        return false
      }

      // validation chương trình master
      if (this.isMaster) {
        if (!this.syllabus.content) {
          helper.showMessage('Nội dung master không được để trống!')
          return false
        }

        if (!this.syllabus.regions && !this.syllabus.province_ids && !this.syllabus.station_ids) {
          helper.showMessage('Khu vực không được để trống!')
          return false
        }

        if (!this.syllabus.department_ids) {
          helper.showMessage('Bộ phận không được để trống!')
          return false
        }

        if (!this.syllabus.position_ids) {
          helper.showMessage('Vị trí không được để trống!')
          return false
        }

        if (!this.syllabus.work_type_ids) {
          helper.showMessage('Kiểu nhân viên không được để trống!')
          return false
        }

        if (!this.syllabus.seniority_min && !this.syllabus.seniority_max) {
          helper.showMessage('Thâm niên (ngày) không được để trống!')
          return false
        }

        if (!this.syllabus.amount_min && !this.syllabus.amount_max) {
          helper.showMessage('Số lượng không được để trống!')
          return false
        }
      }
      return true
    },
    validationPeriod () {
      let indexPeriod = 0
      for (let lecture of this.syllabus.lectures) {
        indexPeriod++
        if (!lecture.content) {
          helper.showMessage(`Nội dung buổi ${indexPeriod} không được để trống!`)
          return false
        }
        if (!lecture.teacher_position) {
          helper.showMessage(`Giảng viên buổi ${indexPeriod} không được để trống!`)
          return false
        }
        if (!lecture.test.original_file && !lecture.hasOwnProperty('id')) {
          helper.showMessage(`Bài kiểm tra buổi ${indexPeriod} không được để trống!`)
          return false
        }
        if (Number(lecture.max_test_time) < 0) {
          helper.showMessage(`Thời gian làm bài (phút) buổi ${indexPeriod} không được để trống!`)
          return false
        }
        if (!helper.isEmpty(lecture.lessons)) {
          let isErrorLesson = this.validateLesson(lecture.lessons, indexPeriod)
          if (isErrorLesson) return false
        }
      }
      return true
    },
    validateLesson (lessons, orderPeriod) {
      for (let lesson of lessons) {
        if (lesson.title && !lesson.fileId) {
          helper.showMessage(`Tại buổi ${orderPeriod}: Khối tài liệu ${lesson.order_number} thiếu File đính kèm. Bạn vui lòng kiểm tra lại!`)
          return true
        }
        if (!lesson.title && lesson.fileId) {
          helper.showMessage(`Tại buổi ${orderPeriod}: Khối tài liệu ${lesson.order_number} thiếu Tiêu đề. Bạn vui lòng kiểm tra lại!`)
          return true
        }
      }
      return false
    },
    submitSyllabus () {
      if (!this.validationSyllabus()) return false
      if (this.type === 'add' && !helper.isEmpty(this.syllabus.id)) return this.editTrainingSyllabus()
      if (this.type === 'add' && helper.isEmpty(this.syllabus.id)) return this.createTrainingSyllabus()
      if (this.type === 'edit' || this.type === 'view') return this.editTrainingSyllabus()
    },

    formDataSyllabus () {
      let formData = new FormData()
      let fieldSpecial = ['thumbnail', 'lectures', 'time_start', 'time_end'] // các field cần check khác
      for (let key in this.syllabus) {
        if (this.syllabus[key] && !fieldSpecial.includes(key)) {
          formData.append(key, this.syllabus[key])
          continue
        }
        // thumbnail
        if (key === 'thumbnail' && (this.syllabus[key] instanceof File || this.syllabus[key] instanceof Blob)) {
          formData.append(key, this.syllabus[key])
          continue
        }
        // time_start time_end
        if ((key === 'time_start' || key === 'time_end') && this.syllabus[key]) {
          formData.append(key, helper.formatDate(this.syllabus[key], 'YYYY-MM-DD'))
          continue
        }
        // bỏ qua thông tin buổi học
        if (key === 'lectures') {
          continue
        }
      }
      // trường hợp CT là CT master
      if (this.isMaster) {
        for (let subSyllabuses of this.dataProgram) {
          formData.append('sub_syllabuses[]', subSyllabuses)
        }
      }
      return formData
    },

    createTrainingSyllabus () {
      try {
        this.disableSubmit = true
        this.loading = true

        let formData = new FormData()
        formData = this.formDataSyllabus()
        if (!this.isMaster) {
          if (!this.validationPeriod()) return false
          trainingUniService.createTrainingSyllabus(formData).then(response => {
            if (response.data.success) {
              this.syllabus.id = response.data.data.tp_id
              this.syllabus.thumbnail = response.data.data.thumbnail
              helper.showMessage(response.data.message, 'success')
              this.createTpPeriod()
            } else helper.showMessage(response.data.message, 'warning')
          }).catch(error => {
            helper.showMessage(error.response.data.message, 'error')
          })
        } else {
          trainingUniService.createMasterTrainingSyllabus(formData).then(response => {
            if (response.data.success) {
              this.syllabus.id = response.data.data.tp_id
              this.syllabus.thumbnail = response.data.data.thumbnail
              helper.showMessage(response.data.message, 'success')
              this.$emit('action', {action: 'update-syllabus-ok', data: {syllabus: this.syllabus}})
            } else helper.showMessage(response.data.message, 'warning')
          }).catch(error => {
            helper.showMessage(error.response.data.message, 'error')
          })
        }
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
        this.disableSubmit = false
        this.loading = false
      }
    },

    editTrainingSyllabus () {
      try {
        this.disableSubmit = true
        this.loading = true
        let formData = new FormData()
        formData = this.formDataSyllabus()
        formData.append('_method', 'put')
        if (!this.isMaster) {
          if (!this.validationPeriod()) return false
          trainingUniService.editSyllabus(formData).then(response => {
            if (response.data.success) {
              if (this.type === 'add') {
                this.createTpPeriod()
              } else {
                this.editTpPeriod()
              }
            } else helper.showMessage(response.data.message, 'warning')
          }).catch(error => {
            helper.showMessage(error.response.data.message, 'error')
          })
        } else {
          trainingUniService.editMasterTrainingSyllabus(formData).then(response => {
            if (response.data.success) {
              this.syllabus.id = response.data.data.tp_id
              this.syllabus.thumbnail = response.data.data.thumbnail
              helper.showMessage(response.data.message, 'success')
              this.$emit('action', {action: 'update-syllabus-ok', data: {syllabus: this.syllabus}})
            } else helper.showMessage(response.data.message, 'warning')
          }).catch(error => {
            helper.showMessage(error.response.data.message, 'error')
          })
        }
      } catch (e) {
        if (e.response && e.response.status === 413) return helper.showMessage('Dung lượng tài liệu tải lên quá lớn!', 'warning')
        helper.showMessage(e.message, 'warning')
      } finally {
        this.disableSubmit = false
        this.loading = false
      }
    },
    formatPeriodSend () {
      return this.syllabus.lectures.map(lecture => {
        return {
          id: lecture.id,
          form: lecture.form,
          teacher_position: lecture.teacher_position,
          content: lecture.content,
          max_test_time: lecture.max_test_time,
          max_retest_total: lecture.max_retest_total,
          lessons_delete: lecture.lessons_delete,
          lessons: lecture.lessons.map(lesson => {
            return {
              id: lesson.id,
              order_number: lesson.order_number,
              title: lesson.title,
              file_id: lesson.fileId,
              add_questions: lesson.quiz.add_questions,
              delete_questions: lesson.quiz.delete_questions
            }
          }),
          test: lecture.test.hasOwnProperty('original_file') ? {
            id: lecture.test.id,
            questions: lecture.test.questions,
            code: lecture.test.code,
            pdf: lecture.test.pdf,
            original_file: lecture.test.original_file,
            file: lecture.test.file
          } : {}
        }
      })
    },
    createTpPeriod () {
      let dataPeriod = {
        tp_id: parseInt(this.syllabus.id),
        lectures: this.formatPeriodSend()
      }
      trainingUniService.createTpPeriod(dataPeriod).then(responsePeriod => {
        if (responsePeriod.data.success) {
          helper.showMessage(responsePeriod.data.message, 'success')
          this.$emit('action', {action: 'update-syllabus-ok', data: {syllabus: this.syllabus}})
        } else helper.showMessage(responsePeriod.data.message, 'warning')
      }).catch(error => {
        helper.showMessage(error.response.data.message, 'error')
      })
    },
    editTpPeriod () {
      let dataPeriod = {
        tp_id: parseInt(this.syllabus.id),
        lectures: this.formatPeriodSend()
      }
      trainingUniService.editTpPeriod(dataPeriod).then(responsePeriod => {
        if (responsePeriod.data.success) {
          helper.showMessage(responsePeriod.data.message, 'success')
          this.$emit('action', {action: 'update-syllabus-ok', data: {syllabus: this.syllabus}})
        } else helper.showMessage(responsePeriod.data.message, 'warning')
      }).catch(error => {
        helper.showMessage(error.response.data.message, 'error')
      })
    },
    insertLecture () {
      let lecture = JSON.parse(JSON.stringify(this.lecture))
      lecture.form = 'offline'
      this.syllabus.lectures.push(lecture)
    },
    handleDepartmentSelected (ops) {
      this.syllabus.department_ids = ops ? ops.map(item => item.id).toString() : ''
    },
    handlePositionSelected (ops) {
      this.syllabus.position_ids = ops ? ops.map(item => item.id).toString() : ''
      if (this.firstSelectWorkType) {
        this.$refs.resetSelectWorkType.getListWorkType(this.syllabus.position_ids)
        this.firstSelectWorkType = false
      }
    },
    handleStudentGatherSelected (ops) {
      this.syllabus.student_gather_positions = ops ? ops.map(item => item.id).toString() : ''
    },
    handlePosition (ops) {
      this.syllabus.position_ids = ops ? ops.map(item => item.id).toString() : ''
    },
    handleRegionSelected (options) {
      this.syllabus.regions = options ? options.map(option => option.id).toString() : ''
    },
    handleProvinceSelected: function (provinceOptions) {
      this.syllabus.province_ids = provinceOptions ? provinceOptions.map((item) => item.id).toString() : ''
    },
    handleStationSelected: function (option) {
      this.syllabus.station_ids = option.length ? option.map((item) => item.id).toString() : ''
    },
    handleSyllabusSelected: function (option) {
      this.syllabus.required_tp = option ? option.map((item) => item.id).toString() : ''
    },
    handleSelectedWorkType (options) {
      this.syllabus.work_type_ids = options ? options.map(option => option.id).toString() : ''
    },
    handleProgramSelected (options) {
      this.syllabus.regions = options ? options.map(option => option.id).toString() : ''
    },
    deletePro (idx) {
      if (this.type !== 'view') {
        this.list_program_choice.splice(idx, 1)
        this.numberReturn--
        this.changeSelect()
      }
    },
    // add thumbnail
    addThumbnail (e) {
      this.syllabus.thumbnail = {}
      let file = e.target.files || e.dataTransfer.files
      if (file.size) file = [file]
      let listExtAllow = this.accept.split(', ')
      for (const f of file) {
        let typeFile = f.type.split('/')
        let ext = f.name.split('.').pop()
        if (!typeFile || typeFile.length < 1) return
        if (listExtAllow.includes(f.type) || listExtAllow.includes(typeFile[0] + '/*') || listExtAllow.includes('.' + ext)) {
          this.syllabus.thumbnail = f
        } else {
          helper.showMessage(`Định dạng file ${f.name}  không được hỗ trợ !`, 'warning')
        }
      }
      e.target.value = null
    },
    // get detail trainning syllabus
    async getDetailSyllbus (syllabus) {
      await trainingUniService.detailTrainingSyllabus({id: syllabus.id}).then(responseSyllabus => {
        if (responseSyllabus.data.success) {
          this.initSyllabus(responseSyllabus.data.data)
        } else helper.showMessage(responseSyllabus.data.message, 'warning')
      })
    }
  }
}
</script>
<style scoped lang="scss">
.preview-disable {
  width: 125px;
}
.input-syllabus {
  margin-left: 26px !important;
}
// css thumbnail
.file-label-inner {
  border: 2px dotted #069255;
  text-align: center;
  color: #069255;
  z-index: 1;
  width: 100%;
  height: 5rem;
  margin: 0 !important;
  padding-top: 1.8rem;
}

.thumbnail-extend {
  /*pointer-events: none;*/
  text-align: center;
  font-size: 11px;
  color: white;
  background-color: rgba(0, 0, 0, 0.47);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.thumbnail__element {
  overflow: hidden;
  position: relative;
  &:hover .thumbnail-extend {
    display: flex;
    flex-direction: column;
  }
  .update-thumbnail {
    display: block;
    width: 70px;
    height: 18px;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
    border-radius: 0.5rem;
    background: #F1F1F1;
  }
}
.file-icon {
  font-size: medium;
}
.file-description {
  font-weight: 500;
}
.button-remove {
  font-size: 162%;
  color: red;
  margin-top: 32%;
  cursor: pointer
}
.num-img-extend {
  /*pointer-events: none;*/
  text-align: center;
  font-size: 11px;
  color: white;
  background-color: rgba(0, 0, 0, 0.47);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.profile-document__element {
  overflow: hidden;
  position: relative;
  border: 1px solid #ddd;
  height: 6rem;
  &:hover .num-img-extend {
    display: flex;
  }
}

.scrollbar {
  float: left;
  width: 100%;
  overflow-x: scroll;
}
.force-overflow {
  //min-height: 150px;
}

.scrollbar-primary::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.scrollbar-primary::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #A4A4A4;
}

.scrollbar-primary {
  scrollbar-color: #A4A4A4 #F5F5F5;
}
.small-scrollbar ::-webkit-scrollbar-track {
  background: #ffffff !important;
}
.small-scrollbar ::-webkit-scrollbar-thumb {
  background: #A4A4A4 !important;
}
.small-scrollbar ::-webkit-scrollbar-thumb:hover {
  background: #A8A8A8 !important;
}
.text-center-y {
  display: flex !important;
  align-items: center;
  line-height: normal;
}
.checkbox-cus >>> .custom-control-label::before {
  width: 2.4rem !important;
  height: 2.34rem !important;
  border: 1px solid #BDBDBD !important;
}
.customRequire {
  width: 4rem;
  margin-left: -5rem;
}
.document-type-desc {
  text-align: center;
  font-size: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.64);
  width: 100%;
  position: absolute;
  bottom: 0;
  pointer-events: none;
  padding: 3px;
}
.image-document {
  width: 100%;
  height: 120px;
  display: inline-block;
  vertical-align: middle;
  object-fit: cover;
}
.flip-list-move {
  transition: transform 2s;
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
</style>
<style scoped>
.cusMul {
  width:95% !important;
}
.multiProgram >>> .multiselect__single{
  text-align: center;
  font-family: 'Roboto';
  font-weight: 500;
}
.cusDrag >>> .multiselect__tags {
  border-left: none;
  border-radius: 0px 4px 4px 0px !important;
}

.cusDrag .drag{
  width: 62px !important;
}
.cusIcon {
  margin-left:1.5%
}

.form-check {
  padding: 15px 20px;
}
.form-check-input {
  cursor: pointer;
  width: 18px;
  height: 18px;
  margin-top: 0;
}
input[type="radio"] {
  accent-color: #018e4a;
}

@media only screen and (max-width: 1280px) {
  .cusDrag .drag{
    width: 43px !important;
  }
  .cusMul {
    width:95% !important;
  }
}

</style>
