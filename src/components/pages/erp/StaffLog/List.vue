<template>
  <div>
    <!-- header  -->
    <b-row class="top align-items-center">
      <b-col md="4">
        <h4 class="m-0">Tân binh & NS cần quan tâm</h4>
      </b-col>
      <b-col md="8" class="text-right">
        <b-btn class="ml-1 custom-btn" variant="ghtk" @click="resetState">
          <i class="fas fa-sync-alt"></i> Xóa lọc
        </b-btn>
        <b-btn class="mr-1 btn-center" variant="ghtk" @click="search">
          <i class="fas fa-search"></i> Tìm kiếm
        </b-btn>
      </b-col>
    </b-row>
    <div class="seperate-xs my-1"></div>
    <!-- filter  -->
    <b-row class="search-bar-wrapper search-bar-top">
      <b-col class="col-no-padding">
        <label class="form-label">CMND/Mã MP/Mã COD</label>
        <input
          v-model="filter.code"
          type="text"
          placeholder="Nhập CMND/Mã MP/Mã COD"
          class="form-control"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Username/Họ tên</label>
        <input
          v-model="filter.name"
          type="text"
          placeholder="Nhập Username/Họ tên"
          class="form-control"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Miền</label>
        <MultiSelectRegion
          :regions="filter.region ? filter.region : ''"
          @handleSelectedRegion="handleSelectedRegion"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Tỉnh</label>
        <MultiSelectProvince
          :region="filter.region ? filter.region.split(',') : null"
          :province-ids="filter.province ? filter.province : null"
          :reset="filter.reset"
          @handleProvinceSelected="handleProvinceSelected"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Kho</label>
        <MultiSelectStation
          :province-ids="filter.province ? filter.province : null"
          :station-ids="filter.station ? filter.station : null"
          @handleStationSelected="handleStationSelected"
        />
      </b-col>
    </b-row>
    <b-row class="search-bar-wrapper">
      <b-col class="col-no-padding">
        <label class="form-label">Bộ phận</label>
        <MultiSelectDepartment
          :department-ids="filter.group"
          @handleDepartmentSelected="handleDepartmentSelected"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Vị trí</label>
        <MultiSelectPosition
          :position-ids="filter.position"
          :department-ids="filter.group"
          @handlePositionSelected="handlePositionSelected"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Hình thức làm việc</label>
        <MultiSelectWorkType
          @handleSelectedWorkType="handleSelectedWorkType"
          :positionCustom="filter.position"
          :multiple="true"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Trạng thái MP</label>
        <SelectProfileStatus
          @change="selectProfileStatus"
          :multiple="true"
          :status="filter.status"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Bồi hoàn</label>
        <b-form-select v-model="filter.sort" :options="sortOptions"></b-form-select>
      </b-col>
    </b-row>
    <b-row class="search-bar-wrapper">
      <b-col class="col-no-padding">
        <label class="form-label">Thâm niên</label>
        <b-form-select v-model="filter.seniority" :options="seniorityOptions"></b-form-select>
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Tag</label>
        <Multiselect
            v-model="filterTags"
            label="name"
            track-by="id"
            placeholder="chọn tag"
            :options="tags"
            :multiple="true"
            :searchable="true"
            :internal-search="false"
            :clear-on-select="true"
            :close-on-select="true"
            :hide-selected="false"
            select-label=""
            selected-label=""
            deselect-label=""
            @input="updateFilterTags"
          >
          <span slot="noResult">Không tìm thấy kết quả phù hợp</span>
          <span slot="noOptions">Không tìm thấy kết quả phù hợp</span>
          <span slot="placeholder" class="placeholder">chọn tag</span>
      </Multiselect>
      </b-col>
    </b-row>
    <!-- Content  -->
    <div class="border round">
      <!-- paging  -->
      <div class="mb-1 mt-3 pagination">
        <div class="z-0 d-inline-block">
          <b-pagination
            class="m-0"
            size="sm"
            align="left"
            :total-rows="pagination.total ? pagination.total : ''"
            :per-page="pagination.limit"
            v-model="pagination.currentPage"
            @change="pageChanged"
          >
          </b-pagination>
        </div>
        <b class="float-right"> {{ pagination.currentPage }} / {{ Math.ceil(pagination.total / pagination.limit) }}</b>
      </div>
      <!-- main content -->
      <div class="mb-1 mt-3" v-loading="loading">
        <div class="member-top-bar">
          <div class="bold">Nhân viên</div>
          <div class="bold">Công việc</div>
          <div class="bold">Thao tác</div>
        </div>
        <div class="member-wrapper" v-if="members.length > 0">
          <MemberItem
          v-for="(member, idx) in members"
          :idx="idx"
          :key="`member-${idx}`" :member="member"
          @togglePkgPopup="togglePkgPopup"
          @toggleNotePopup="toggleNotePopup"
          @toggleTicketPopup="toggleTicketPopup"
          @toggleTagManage="toggleTagManage"
          />
        </div>
        <div v-else class="member-empty">
          <p>Không tìm thấy nhân sự</p>
        </div>
      </div>
    </div>
    <PkgPopup
      :pkgOrder="pkgOrder"
      :open="pkgPopup"
      :loading="loading"
      @togglePkgPopup="togglePkgPopup"
    />
    <Note
      :open="openNote"
      :member="selectedMember"
      @toggleNotePopup="toggleNotePopup"
      @refreshMember="refreshMember"
    />
    <Ticket
      :open="openTicket"
      :ticketId="ticketId"
      @toggleTicketPopup="toggleTicketPopup"
    />
    <TagPopup
      :open="openTagManage"
      :tags="tags"
      :member="tagMember"
      @toggleTagManage="toggleTagManage"
      @refreshTags="refreshTags"
      @refreshMember="refreshMember"
    />
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import MemberItem from 'components/pages/erp/StaffLog/MemberItem'
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import SelectProfileStatus from 'components/elements/common/SelectProfileStatus'
import MultiSelectWorkType from 'components/elements/common/MultiSelectWorkType'
import List from './ListMixin'
import PkgPopup from './PkgPopup'
import Note from './Note'
import Ticket from './Ticket'
import TagPopup from './TagPopup'

export default {
  components: {
    MemberItem,
    MultiSelectRegion,
    MultiSelectProvince,
    MultiSelectStation,
    MultiSelectDepartment,
    MultiSelectPosition,
    SelectProfileStatus,
    MultiSelectWorkType,
    PkgPopup,
    Note,
    Ticket,
    TagPopup,
    Multiselect
  },
  mixins: [List]
}
</script>

<style scoped lang="scss">
.btn-outline-secondary:hover{
  background: unset;
}
.btn-sm{
  border-radius: 2.25rem;
  border-color: #219653 !important;
  color: #219653 !important;
}
.member-empty{
  display: flex;
  justify-content: center;
  padding-top: 10vh;
  padding-bottom: 10vh;
}
.member-wrapper{
  max-height: 63vh;
  overflow-y: scroll;
}
.member-top-bar {
  padding-left: 0.75rem;
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 5fr 1fr;
  padding-top: 10px;
  padding-bottom: 10px;
  box-shadow: rgba(24, 28, 33, 0.06);
}
.member-top-bar {
  border-bottom: 1px solid #ccc;
}
.pagination {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.bold {
  font-weight: bold;
}
.border {
  background-color: #fff;
}

.scroll-mode {
  max-height: 70vh;
  overflow: auto;
  &-small {
    max-height: 65vh;
    overflow: auto;
  }
}
.col-no-padding {
  padding-left: 0px;
  max-width: 350px;
}

.job:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-bar-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  align-items: flex-end;
  padding-left: 0.75rem;
  margin-bottom: 10px;
}

.pagination {
  margin-top: 20px;
}
.btn-group-search {
  display: flex;
  justify-content: flex-end;
}
.btn-center {
  margin-left: 5px;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-img {
  max-height: 150px !important;
  width: 100%;
  min-height: 150px !important;
}
.custom-btn {
  width: 92px;
}
</style>

<style>
.select-station > .mb-4 {
  margin-bottom: unset !important;
}
</style>
