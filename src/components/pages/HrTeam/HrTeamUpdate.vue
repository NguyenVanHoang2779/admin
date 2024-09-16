<template>
  <div class="small-scrollbar">
    <div class="mb-3">
      <h3 class="d-inline-block align-middle">{{ title }}</h3>
      <div class="float-right d-inline-block">
        <b-btn variant="ghtk" @click="updateHrTeam">
          <span v-if="!isEdit"><i class="ion ion-ios-add"></i> Thêm nhóm</span>
          <span v-else><i class="icon ion-md-archive"></i> Cập nhật</span>
        </b-btn>
        <b-btn @click="$router.go(-1)" variant="outline-secondary"><i class="ion ion-ios-return-left"></i> Quay lại</b-btn>
      </div>
    </div>
    <!-- Config -->
    <div class="card">
      <div class="card-body">
        <!-- Team name -->
        <b-form-row>
            <b-form-group label="Tên nhóm" id="group-fullname" class="col-md-4">
              <b-form-input
                v-model="teamName"
                name="name"
                placeholder="Tên nhóm"
                :state="teamName === '' ? false : null"
              >
              </b-form-input>
            </b-form-group >
            <b-form-group label="Loại nhóm" id="group-type" class="col-md-3" :state="groupType === '' ? false : null">
              <select-group-type
                :group-type="groupType"
                @input="selectGroupType"
                :disabled="isEdit"
              ></select-group-type>
            </b-form-group >
            <b-form-group label="Nhân sự phụ trách" id="inChargeGroup" class="col-md-3" v-if="isShowSubGroupType">
              <SelectSubGroupType
                :sub-group-type="subGroupType"
                @input="selectSubGroupType"
              />
            </b-form-group >
            <b-form-group label="Tính KPI" id="has-kpi" class="col-md-2 text-center" v-show="isHrTeam">
              <b-form-checkbox
                v-model="hasKpi"
                :value="true"
                :unchecked-value="false"
                inline
                size="lg"
                class="p-0"
              >
              </b-form-checkbox>
            </b-form-group >
        </b-form-row>

        <!-- region HC,NV team -->
        <b-form-row v-show="isHrTeam">
          <div class="mb-2 col-md-12 col-form-label">
            <div class="font-weight-bold" v-if="subGroupType === 'hr_care'">Bộ phận/vị trí quản lý</div>
            <div class="font-weight-bold" v-if="subGroupType === 'hr_recruitment'">Vị trí tuyển dụng quản lý <span class='red-text'>(*)</span></div>
          </div>
          <template v-if="subGroupType === 'hr_care'">
            <b-form-group class="col-md-12">
              <div class="row">
                <div class="col col-md-auto" style="width: 100px;">
                  Bộ phận <span class='red-text'>(*)</span>
                </div>
                <div class="col">
                  <multi-select-department
                    :department-ids="departmentIds" @handleDepartmentSelected="handleDepartmentSelected"
                  />
                </div>
              </div>
            </b-form-group>
            <b-form-group class="col-md-12">
              <div class="row">
                <div class="col col-md-auto" style="width: 100px;">
                  Vị trí <span class='red-text'>(*)</span>
                </div>
                <div class="col">
                  <multi-select-position-by-group
                    :department-ids="departmentIds"
                    :show-by-department="true"
                    :position-ids="positionIds"
                    @handlePositionSelected="handlePositionSelected"
                    :multiple="true"
                  />
                </div>
              </div>
            </b-form-group>
          </template>
          <b-form-group class="col-md-12" v-if="subGroupType === 'hr_recruitment'">
            <multi-select-recruitment-job
              :job-ids="recruitmentJobIds"
              @handleJobSelected="handleJobSelected"
            >
            </multi-select-recruitment-job>
          </b-form-group>
        </b-form-row>

        <!-- Leader -->
        <table class="table table-sm table-hover table-bordered">
          <caption><b>Danh sách trưởng nhóm</b></caption>
          <thead>
            <tr>
              <th class="text-center w-5">STT</th>
              <th class="text-center w-50">Trưởng nhóm</th>
              <th class="text-center w-10" v-b-popover.hover="'Nhân sự đi hỗ trợ sẽ không được tính KPI trong nhóm'">Đi hỗ trợ <i class="fas fa-info-circle"></i></th>
              <th class="text-center">Ngày bắt đầu vào team</th>
              <th class="text-center">Ngày rời khỏi team</th>
              <th class="text-center w-5"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(leader, idx) in leaders" :key="idx">
              <td class="text-center">{{ idx + 1 }}</td>
              <td>
                <div v-if="leader.id">
                  <router-link
                      v-if="leader.master_profile_id"
                      :to="{name: 'edit-master-profile', params: { id: leader.master_profile_id }}"
                    >
                      {{ leader.fullname }} ( {{ leader.username }} )
                    </router-link>
                  <span v-else>{{ leader.fullname }} ( {{ leader.username }} )</span>
                </div>
                <div v-else-if="isHrTeam">
                  <b-form-group :state="leader.member_id ? null : false" class="m-0">
                    <select-hr-member
                      :member-ids="leader.member_id"
                      :multiple="false"
                      @select="selectUser(leader, ...arguments, true)"
                      @remove="removeUser(leader, ...arguments, true)"
                    >
                    </select-hr-member>
                  </b-form-group>
                </div>
                <div v-else>
                  <b-form-group :state="leader.member_id ? null : false" class="m-0">
                    <single-select-user
                      @select="selectUser(leader, ...arguments, true)"
                      @remove="removeUser(leader, ...arguments, true)"
                      :reset="resetUser"
                    >
                    </single-select-user>
                  </b-form-group>
                </div>
              </td>
              <td class="text-center">
                <b-form-checkbox
                  v-model="leader.support"
                  :value="true"
                  :unchecked-value="null"
                  inline
                  size="lg"
                  class="p-0"
                >
                </b-form-checkbox>
              </td>
              <td class="text-center">
                <input type="date" class="form-control form-control-sm" v-model="leader.from" :class="{ 'is-invalid': !leader.from }" />
              </td>
              <td class="text-center">
                <input type="date" class="form-control form-control-sm" v-model="leader.to" />
              </td>
              <td class="text-center">
                <b-btn size="sm" variant="outline-danger" v-if="!leader.id" @click="deleteUser(leaders, idx)">
                  <i class="fas fa-times" title="Xóa trưởng nhóm"></i>
                </b-btn>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <b-alert :show="!!checkTeamUserLeader.length" variant="warning" class="mb-1">
                  <div>
                    <b>Lưu ý:</b>
                    <div v-for="(user, idx) in checkTeamUserLeader" :key="idx">
                      - {{ groupType !== 'cod_star' ? 'Nhân sự' : 'Nhân viên' }}
                      <b v-show="groupType !== 'cod_star'">{{ user.user.fullname }} ({{ user.user.username }} - {{ user.user.stationname }})</b>
                      <b v-show="groupType === 'cod_star'">{{ user.user.name }}</b> là thành viên team
                      <span v-for="(team, idxTeam) in (user.team || [])" :key="idxTeam">
                        <router-link :to="{name: 'edit-hrteam', params: {id: team.id}}" target="_blank">{{ team.name || '' }}</router-link>,
                      </span>
                    </div>
                  </div>
                </b-alert>
                <b-btn size="sm" variant="outline-ghtk" @click="addUser(leaders)" :disabled="!canAddUser(leaders)">
                  <i class="fas fa-plus"></i> Thêm trưởng nhóm
                </b-btn>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- station, module operator team -->
        <b-form-row v-if="groupType === 'cod_star'">
          <!-- <b-alert :show="!isEdit" variant="info" class="col-md-12">
            LƯU Ý: Team <b>{{ groupTeamDesc[groupType] }}</b> quản lý kho, module chỉ cần nhập kho, module không cần nhập thành viên
          </b-alert> -->
          <b-form-group label="Kho" class="col-md-6">
            <multi-select-station
              :station-ids="stationIds"
              @handleStationSelected="selectStationForCod"
              :limit-prop="999"
            >
            </multi-select-station>
          </b-form-group>
          <b-form-group label="Module quản lý" class="col-md-6">
            <multi-select-module
              :station-ids="stationIds"
              @handleModuleSelected="handleSelectedField('moduleIds', ...arguments)"
              :module-ids="moduleIds"
              :auto-close="true"
              :hide-selected="true"
              placeholder=""
            ></multi-select-module>
          </b-form-group>
        </b-form-row>
        <!-- member -->
        <table class="table table-sm table-hover table-bordered">
          <caption><b>Danh sách thành viên</b></caption>
          <thead>
            <tr>
              <th class="text-center w-5">STT</th>
              <th class="text-center w-50">Thành viên</th>
              <th class="text-center w-10" v-b-popover.hover="'Nhân sự đi hỗ trợ sẽ không được tính KPI trong nhóm'">Đi hỗ trợ <i class="fas fa-info-circle"></i></th>
              <th class="text-center">Ngày bắt đầu vào team</th>
              <th class="text-center">Ngày rời khỏi team</th>
              <th class="text-center w-5"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, idx) in members" :key="idx">
              <td class="text-center">{{ idx + 1 }}</td>
              <td>
                <div v-if="member.id">
                  <router-link
                      v-if="member.master_profile_id"
                      :to="{name: 'edit-master-profile', params: { id: member.master_profile_id }}"
                    >
                      {{ member.fullname }} ( {{ member.username }} )
                    </router-link>
                  <span v-else>{{ member.fullname }} ( {{ member.username }} )</span>
                </div>
                <div v-else-if="isHrTeam">
                  <b-form-group :state="member.member_id ? null : false" class="m-0">
                    <select-hr-member
                      :member-ids="member.member_id"
                      :multiple="false"
                      @select="selectUser(member, ...arguments)"
                      @remove="removeUser(member, ...arguments)"
                    >
                    </select-hr-member>
                  </b-form-group>
                </div>
                <div v-else>
                  <b-form-group :state="member.member_id ? null : false" class="m-0">
                    <single-select-user
                      class="m-0"
                      @select="selectUser(member, ...arguments)"
                      @remove="removeUser(member, ...arguments)"
                      :reset="resetUser"
                    >
                    </single-select-user>
                  </b-form-group>
                </div>
              </td>
              <td class="text-center">
                <b-form-checkbox
                  v-model="member.support"
                  :value="true"
                  :unchecked-value="null"
                  inline
                  size="lg"
                  class="p-0"
                >
                </b-form-checkbox>
              </td>
              <td class="text-center">
                <input type="date" class="form-control form-control-sm" v-model="member.from" :class="{ 'is-invalid': !member.from }" />
              </td>
              <td class="text-center">
                <input type="date" class="form-control form-control-sm" v-model="member.to"/>
              </td>
              <td class="text-center">
                <b-btn size="sm" variant="outline-danger" @click="deleteUser(members, idx)">
                  <i class="fas fa-times" title="Xóa thành viên"></i>
                </b-btn>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <b-alert :show="!!checkTeamUserMember.length" variant="warning" class="mb-1">
                  <div>
                    <b>Lưu ý:</b>
                    <div v-for="(user, idx) in checkTeamUserMember" :key="idx">
                      - {{ groupType !== 'cod_star' ? 'Nhân sự' : 'Nhân viên' }}
                      <b v-show="groupType !== 'cod_star'">{{ user.user.fullname }} ({{ user.user.username }} - {{ user.user.stationname }})</b>
                      <b v-show="groupType === 'cod_star'">{{ user.user.name }}</b> là thành viên team
                      <span v-for="(team, idxTeam) in (user.team || [])" :key="idxTeam">
                        <router-link :to="{name: 'edit-hrteam', params: {id: team.id}}" target="_blank">{{ team.name || '' }}</router-link>,
                      </span>
                    </div>
                  </div>
                </b-alert>
                <b-btn size="sm" variant="outline-ghtk" @click="addUser(members)" :disabled="!canAddUser(members)">
                  <i class="fas fa-plus"></i> Thêm thành viên
                </b-btn>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- region HC,NV team -->
        <b-form-row v-show="isHrTeam">
            <b-form-group label="Miền quản lý" id="input-group-region" class="col-md-12">
              <select-profile-region
                :region="regions"
                @handleSelectedRegion="handleSelectedRegion"
                :multiple="true"
                :all="true"
              >
              </select-profile-region>
            </b-form-group>
        </b-form-row>
        <!-- Province HC, NS team -->
        <table v-show="isHrTeam || isBusinessDevelopment" class="table table-sm table-hover table-bordered">
          <caption><b>Danh sách tỉnh quản lý</b></caption>
          <thead>
            <tr>
              <th class="text-center w-5">STT</th>
              <th class="text-center w-60">Tỉnh</th>
              <th class="text-center">Ngày bắt đầu quản lý</th>
              <th class="text-center">Ngày kết thúc quản lý</th>
              <th class="text-center w-5"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(province, idx) in provinces" :key="idx">
              <td class="text-center">{{ idx + 1 }}</td>
              <td>
                <div v-if="province.id">
                  <span>{{ province.name }}</span>
                </div>
                <div v-else>
                  <b-form-group :state="province.area_id ? null : false" class="m-0">
                    <single-select-province
                      custom-class=''
                      :region-name="regions"
                      :province-id="province.area_id"
                      @select="selectArea(province, ...arguments, 'province')"
                      @remove="removeArea(province, ...arguments, 'province')"
                    >
                    </single-select-province>
                  </b-form-group>
                </div>
              </td>
              <td class="text-center">
                <input type="date" class="form-control form-control-sm" v-model="province.from" :class="{ 'is-invalid': !province.from }" />
              </td>
              <td class="text-center">
                <input type="date" class="form-control form-control-sm" v-model="province.to" />
              </td>
              <td class="text-center">
                <b-btn size="sm" variant="outline-danger" @click="deleteArea(provinces, idx, 'province')">
                  <i class="fas fa-times" title="Xóa tỉnh"></i>
                </b-btn>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <b-alert :show="!!(checkTeam['province'] && checkTeam['province'].length && hasKpi)" variant="warning">
                  <div>
                    <b>Lưu ý:</b> <span class="text-danger">Các Tỉnh đã được quản lý bởi các team nhân sự khác sẽ không được ghi nhận khi cập nhật</span>
                    <div v-for="(proviceCheck, idxCheckProvince) in checkTeam['province']" :key="idxCheckProvince">
                      <span v-if="areaConflic(proviceCheck.teams)">
                        - Tỉnh <b>{{ proviceCheck.province.name }}</b> đã được quản lý bởi team
                        <span v-for="(team, idxTeam) in (proviceCheck.teams || [])" :key="idxTeam">
                          <router-link v-if="teamConflic(team)" :to="{name: 'edit-hrteam', params: {id: team.id}}" target="_blank">{{ team.name + ', ' || '' }}</router-link>
                        </span>
                      </span>
                    </div>
                  </div>
                </b-alert>
                <b-btn size="sm" variant="outline-ghtk" @click="addArea(provinces, 'province')" :disabled="!canAddArea(provinces)">
                  <i class="fas fa-plus"></i> Thêm Tỉnh
                </b-btn>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Quận/ huyện quản lý -->
        <table v-show="isBusinessDevelopment" class="table table-sm table-hover table-bordered">
          <caption><b>Danh sách huyện quản lý</b></caption>
          <thead>
          <tr>
            <th class="text-center w-5">STT</th>
            <th class="text-center w-60">Huyện</th>
            <th class="text-center">Ngày bắt đầu quản lý</th>
            <th class="text-center">Ngày kết thúc quản lý</th>
            <th class="text-center w-5"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, idx) in districts" :key="idx">
            <td class="text-center">{{ idx + 1 }}</td>
            <td>
              <div v-if="item.id">
                <span>{{ item.name }}</span>
              </div>
              <div v-else class="group-address-select-box">
                <single-select-province
                  custom-class=''
                  @select="selectAreaParent(item, ...arguments, 'province')">
                </single-select-province>
                <single-select-district-address
                  custom-class=''
                  :province-id="item.parent_id"
                  @select="selectArea(item, ...arguments, 'district')"
                  @remove="removeArea(item, ...arguments, 'district')">
                </single-select-district-address>
              </div>
            </td>
            <td class="text-center">
              <input type="date" class="form-control form-control-sm" v-model="item.from" :class="{ 'is-invalid': !item.from }" />
            </td>
            <td class="text-center">
              <input type="date" class="form-control form-control-sm" v-model="item.to" />
            </td>
            <td class="text-center">
              <b-btn size="sm" variant="outline-danger" v-if="!item.id" @click="deleteArea(districts, idx, 'district')">
                <i class="fas fa-times" title="Xóa huyện"></i>
              </b-btn>
            </td>
          </tr>
          <tr>
            <td colspan="5">
              <b-btn size="sm" variant="outline-ghtk" @click="addArea(districts, 'district')" :disabled="!canAddArea(districts)">
                <i class="fas fa-plus"></i> Thêm Huyện
              </b-btn>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Phường/ Xã quản lý -->
        <table v-show="isBusinessDevelopment" class="table table-sm table-hover table-bordered">
          <caption><b>Danh sách phường/xã quản lý</b></caption>
          <thead>
          <tr>
            <th class="text-center w-5">STT</th>
            <th class="text-center w-60">Phường/Xã</th>
            <th class="text-center">Ngày bắt đầu quản lý</th>
            <th class="text-center">Ngày kết thúc quản lý</th>
            <th class="text-center w-5"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, idx) in sub_districts" :key="idx">
            <td class="text-center">{{ idx + 1 }}</td>
            <td>
              <div v-if="item.id">
                <span>{{ item.name }}</span>
              </div>
              <div v-else class="group-address-select-box">
                <single-select-district-address
                  custom-class=''
                  :is-get-all="true"
                  @select="selectAreaParent(item, ...arguments, 'district')">
                </single-select-district-address>
                <single-select-sub-district-address
                  custom-class=''
                  :district-id="item.parent_id"
                  @select="selectArea(item, ...arguments, 'sub_district')"
                  @remove="removeArea(item, ...arguments, 'sub_district')">
                </single-select-sub-district-address>
              </div>
            </td>
            <td class="text-center">
              <input type="date" class="form-control form-control-sm" v-model="item.from" :class="{ 'is-invalid': !item.from }" />
            </td>
            <td class="text-center">
              <input type="date" class="form-control form-control-sm" v-model="item.to" />
            </td>
            <td class="text-center">
              <b-btn size="sm" variant="outline-danger" @click="deleteArea(sub_districts, idx, 'sub_district')">
                <i class="fas fa-times" title="Xóa "></i>
              </b-btn>
            </td>
          </tr>
          <tr>
            <td colspan="5">
              <b-btn size="sm" variant="outline-ghtk" @click="addArea(sub_districts, 'sub_district')" :disabled="!canAddArea(sub_districts)">
                <i class="fas fa-plus"></i> Thêm Phường/xã
              </b-btn>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- station HC, NS team -->
        <table v-show="isHrTeam || groupType === 'operator'" class="table table-sm table-hover table-bordered">
          <caption><b>Danh sách kho quản lý</b></caption>
          <thead>
            <tr>
              <th class="text-center w-5">STT</th>
              <th class="text-center w-60">Kho</th>
              <th class="text-center">Ngày bắt đầu quản lý</th>
              <th class="text-center">Ngày kết thúc quản lý</th>
              <th class="text-center w-5"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(station, idx) in stations" :key="idx" :class="{'is-invalid-rows': station.isValidData === false }">
              <td class="text-center">{{ idx + 1 }}</td>
              <td>
                <div v-if="station.id">
                  <span>{{ station.name }} ({{ station.code }})</span>
                </div>
                <div v-else>
                  <b-form-group :state="station.area_id ? null : false" class="m-0">
                    <single-select-station
                      custom-class=''
                      :station-id="station.area_id"
                      @select="selectArea(station, ...arguments)"
                      @remove="removeArea(station, ...arguments)"
                    >
                    </single-select-station>
                  </b-form-group>
                </div>
              </td>
              <td class="text-center">
                <input type="date" class="form-control form-control-sm" @change="validateConfig(station, 'station')" v-model="station.from" :class="{ 'is-invalid': !station.from }" />
              </td>
              <td class="text-center">
                <input type="date" class="form-control form-control-sm" @change="validateConfig(station, 'station')" v-model="station.to" />
              </td>
              <td class="text-center">
                <b-btn size="sm" variant="outline-danger" @click="deleteArea(stations, idx)">
                  <i class="fas fa-times" title="Xóa kho"></i>
                </b-btn>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <b-alert :show="!!(checkTeam['station'] && checkTeam['station'].length && hasKpi)" variant="warning">
                  <div>
                    <b>Lưu ý:</b> <span class="text-danger">Các kho đã được quản lý bởi các team nhân sự khác sẽ không được ghi nhận khi cập nhật</span>
                    <div v-for="(stationCheck, idxCheckStation) in checkTeam['station']" :key="idxCheckStation">
                      <span v-if="areaConflic(stationCheck.teams)">
                        - Kho <b>{{ stationCheck.station.name }}</b> đã được quản lý bởi team
                        <span v-for="(team, idxTeam) in (stationCheck.teams || [])" :key="idxTeam">
                          <router-link v-if="teamConflic(team)" :to="{name: 'edit-hrteam', params: {id: team.id}}" target="_blank">{{ team.name + ', ' || '' }}</router-link>
                        </span>
                      </span>
                    </div>
                  </div>
                </b-alert>
                <b-btn size="sm" variant="outline-ghtk" @click="addArea(stations)" :disabled="!canAddArea(stations)">
                  <i class="fas fa-plus"></i> Thêm kho
                </b-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Action -->
    <div class="text-center mt-3">
      <b-btn variant="ghtk" @click="updateHrTeam">
        <span v-if="!isEdit"><i class="ion ion-ios-add"></i> Thêm nhóm</span>
        <span v-else><i class="icon ion-md-archive"></i> Cập nhật</span>
      </b-btn>
      <router-link :to="{name: 'manager-hrteam'}" class="btn btn-default"><i class="ion ion-ios-return-left"></i> Quản lý</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "src/assets/sass/components/master-profile";
  caption {
    padding-bottom: 0.625rem;
    color: black;
    text-align: left;
    caption-side: top;
  }
  th, td {
    vertical-align: middle;
  }
  .group-address-select-box {
    display: flex;
    gap: 10px;
  }

  .is-invalid-rows {
    td {
      background-color: #f7ebeb;
      color: red;
    }
  }
</style>

<script>
// built-in component
import Multiselect from 'vue-multiselect'

// utility
import helper from 'infrastructures/helpers/common-helpers'
import dateHelper from 'infrastructures/helpers/date'

// service
import hrteamService from 'domain/services/hrteam-service'

// custom component
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import SelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import MultiSelectPositionByGroup from 'components/elements/common/MultiSelectPositionByGroup'
import MultiSelectRecruitmentJob from 'components/elements/common/MultiSelectRecruitmentJob'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectModule from 'components/elements/common/MultiSelectModule'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import SingleSelectSubDistrict from 'components/elements/common/SingleSelectSubDistrict'
import SingleSelectDistrictAddress from 'components/elements/common/SingleSelectDistrictAddress'
import SingleSelectSubDistrictAddress from 'components/elements/common/SingleSelectSubDistrictAddress'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import SelectHrMember from './SelectHrMember'
import SelectGroupType from './SelectGroupType'
import SelectSubGroupType from './SelectSubGroupType'
import SelectManagementTarget from './SelectManagementTarget'

// entities
import Hrteam from 'domain/entities/Hrteam'

export default {
  name: 'HrTeamUpdate',

  components: {
    Multiselect,
    MultiSelectProvince,
    MultiSelectStation,
    MultiSelectModule,
    SingleSelectDepartment,
    SingleSelectPosition,
    SelectHrMember,
    SelectProfileRegion,
    SingleSelectStation,
    SelectGroupType,
    SelectSubGroupType,
    SingleSelectUser,
    SelectManagementTarget,
    SingleSelectProvince,
    SingleSelectDistrict,
    SingleSelectSubDistrict,
    SingleSelectDistrictAddress,
    SingleSelectSubDistrictAddress,
    MultiSelectDepartment,
    MultiSelectPositionByGroup,
    MultiSelectRecruitmentJob
  },

  data: () => ({
    teamId: null,
    teamName: null,
    hasKpi: null,
    groupType: null,
    subGroupType: null,
    target: null,
    leaders: [],
    members: [],
    provinceIds: null,
    provinces: [],
    districtIds: null,
    districts: [],
    subDistrictIds: null,
    sub_districts: [],
    stations: [],
    stationIds: null,
    moduleIds: null,
    departmentIds: null,
    positionIds: null,
    recruitmentJobIds: null,
    departments: [],
    positions: [],
    regions: null,
    recruitmentJobs: [],
    //
    checkTeam: {
      station: [],
      province: [],
      district: [],
      sub_district: [],
      department: [],
      position: []
    },
    checkTeamUserLeader: [],
    checkTeamUserMember: [],
    listGroupType: Hrteam.groupType,
    groupTeamDesc: Hrteam.groupTeamDesc,
    resetUser: false
  }),

  computed: {
    isEdit () {
      return this.$route.params.id > 0
    },

    title () {
      return (this.isEdit ? 'Sửa nhóm ' : 'Thêm nhóm ') + (this.groupTeamDesc[this.groupType] || 'hành chính nhân sự, vận hành')
    },

    isOperatorTeam () {
      return ['cod_star', 'operator'].includes(this.groupType)
    },

    isHrTeam () {
      return ['ns', 'hc'].includes(this.groupType)
    },

    isBusinessDevelopment () {
      return this.groupType === this.listGroupType.business_development
    },

    isShowSubGroupType () {
      return ['ns'].includes(this.groupType)
    },

    canHasTarget () {
      return ['ns', 'operator'].includes(this.groupType)
    }
  },

  created () {
    if (!this.$route.params.id) return
    this.getHrTeam()
  },

  watch: {
    groupType (newVal, oldVal) {
      for (const leaderIdx in this.leaders) {
        if (!this.leaders[leaderIdx].id) this.deleteUser(this.leaders, leaderIdx)
      }
      for (const memberIdx in this.members) {
        if (!this.members[memberIdx].id) this.deleteUser(this.members, memberIdx)
      }
      if (newVal && oldVal && oldVal !== newVal && (oldVal === 'cod_star' || newVal === 'cod_star')) {
        this.stations = []
        this.checkTeam['station'] = []
        this.checkTeam['province'] = []
      }
      if (oldVal) this.stationIds = null
    }
  },

  methods: {
    setKpi () {
      if (this.groupType === 'cod_star' || (this.stations && this.stations.length && this.stations[0].area_id)) return true
      if (!this.provinceIds) return false
      let province = (this.provinceIds + '').split(',')
      return !(province.includes('1') || province.includes('126') || province.includes(1) || province.includes(126))
    },

    selectGroupType (op) {
      if (!op || !op.value) {
        this.groupType = ''
        return
      }
      this.groupType = op.value
    },

    selectSubGroupType (op) {
      if (!op || !op.value) {
        this.subGroupType = null
        return
      }
      this.subGroupType = op.value
    },

    selectTarget (op) {
      if (!op || !op.value) {
        this.target = ''
        return
      }
      this.target = op.value
    },

    areaConflic (teams) {
      if (!this.hasKpi) return false
      if (!this.groupType) return true
      if (!teams || !teams.length) return false
      return teams.filter(op => (this.teamConflic(op))).length
    },

    teamConflic (team) {
      if (!this.groupType || !team || !team.group_type || !team.id) return true
      return +team.id !== +this.teamId && (team.group_type === this.groupType)
    },

    canAddUser (listUser) {
      if (!listUser || !listUser.length) return true
      let lastEle = listUser[listUser.length - 1]
      if (!lastEle || (lastEle.member_id && lastEle.from)) return true
      return false
    },

    canAddArea (listArea) {
      if (!listArea || !listArea.length) return true
      if (listArea && listArea[0].type === 'station') {
        let existNotValidRow = listArea.findIndex((element) => element.isValidData === false)
        if (existNotValidRow !== -1) {
          return false
        }
      }
      let lastEle = listArea[listArea.length - 1]
      if (!lastEle || (lastEle.area_id && lastEle.from)) return true
      return false
    },

    addUser (listUser) {
      if (!listUser) listUser = []
      listUser.push({
        from: null,
        fullname: null,
        support: null,
        member_id: null,
        role: null,
        to: null,
        username: null
      })
    },

    addArea (listArea, type = 'station') {
      if (!listArea) listArea = []
      listArea.push({
        team_id: this.teamId,
        type: type,
        from: null,
        area_id: null,
        parent_id: null,
        name: null,
        to: null,
        isValidData: true
      })
    },

    deleteUser (listUser, idx) {
      let isLeader = listUser === this.leaders
      if (!listUser || !Array.isArray(listUser)) {
        listUser = []
        if (isLeader) this.checkTeamUserLeader = []
        else this.checkTeamUserMember = []
        return
      }

      if (listUser[idx].member_id) this.removeUserChecked(listUser[idx].member_id, isLeader)
      listUser.splice(idx, 1)
    },

    deleteArea (listArea, idx, type = 'station') {
      if (!listArea || !Array.isArray(listArea)) {
        listArea = []
        this.checkTeam[type] = []
        return
      }

      if (listArea[idx].area_id) this.removeTeamArea(listArea[idx].area_id, type)
      listArea.splice(idx, 1)
    },

    selectUser (user, op, isLeader = false) {
      if (op && op.id) {
        // Kiểm tra user chọn có trong team chưa
        let userIn = null
        let idx = this.leaders.findIndex(opt => (+opt.member_id === +op.id))
        if (idx !== -1 && this.leaders[idx] && !this.leaders[idx].to) userIn = 'leader'

        if (!userIn) {
          idx = this.members.findIndex(opt => (+opt.member_id === +op.id))
          if (idx !== -1 && this.members[idx] && !this.members[idx].to) userIn = 'member'
        }

        if (userIn) {
          let message = (this.groupTeamDesc[this.groupType] || 'Nhân viên') + ' ' +
            (op.fullname || op.name) +
            (op.username ? ` (${op.username} - ${op.stationname})` : '') + ' đã là ' +
            (userIn === 'leader' ? 'Leader' : 'thành viên') + ' rồi !'
          helper.showMessage(message, 'warning')
          if (user.member_id) {
            this.removeUserChecked(user.member_id, isLeader)
            user.member_id = null
          } else if (user.member_id === null) user.member_id = ''
          else user.member_id = null
          if (this.groupType === 'cod_star') this.resetUser = !this.resetUser
          user.fullname = null
          user.username = null
          return
        }
        // reset lại thành viên nhóm và thông tin user trùng team
        if (+op.id !== +user.member_id) {
          this.checkTeamByUser(op, isLeader)
          this.removeUserChecked(user.member_id, isLeader)
          user.member_id = op.id + ''
          user.fullname = op.fullname || op.name
          user.username = op.username || null
          user.role = isLeader ? 1 : null
        }
      }
    },

    selectAreaParent (area, op, type) {
      area.parent_id = op && op.id ? op.id : null
    },

    getNameByType (type) {
      switch (type) {
        case 'station':
          return 'Kho'
        case 'province':
          return 'Tỉnh'
        case 'district':
          return 'Quận/huyện'
        case 'department':
          return 'Bộ phận'
        case 'position':
          return 'Vị trí'
        default:
          return ''
      }
    },

    selectArea (area, op, type = 'station') {
      if (!this[type + 's']) return
      if (op && op.id) {
        // Kiểm tra area chọn có trong team chưa
        let idx = this[type + 's'].findIndex(opt => (+opt.area_id === +op.id))
        if (idx !== -1 && type !== 'station') {
          helper.showMessage(`${this.getNameByType(type)} ${op.name} đã được thêm rồi !`, 'warning')
          if (area.area_id) {
            this.removeTeamArea(area.area_id, type)
            area.area_id = null
          } else if (area.area_id === null) area.area_id = ''
          else area.area_id = null
          area.name = null
          return
        }
        // reset lại area và thông tin area trùng team
        if (+op.id !== +area.area_id) {
          this.checkTeamByArea(op, type)
          this.removeTeamArea(area.area_id, type)
          area.area_id = op.id
          area.name = op.name
        }
      } else {
        area.area_id = null
        area.name = null
      }
      if (type === 'station') {
        this.validateConfig(area, 'station')
      }
    },

    removeArea (area, op, type = 'station') {
      this.removeTeamArea(area.area_id, type)
      area.area_id = null
      area.name = null
    },

    removeUser (user, op, isLeader = false) {
      this.removeUserChecked(user.member_id, isLeader)
      user.member_id = null
      user.fullname = null
      user.username = null
      user.role = isLeader ? 1 : null
    },

    // remove thông tin kiểm tra user thuộc nhiều team
    removeUserChecked (userId, isLeader = false) {
      if (!userId) return
      if (isLeader) {
        let idx = this.checkTeamUserLeader.findIndex(op => (+op.user.id === +userId))
        if (idx !== -1) this.checkTeamUserLeader.splice(idx, 1)
      } else {
        let idx = this.checkTeamUserMember.findIndex(op => (+op.user.id === +userId))
        if (idx !== -1) this.checkTeamUserMember.splice(idx, 1)
      }
    },

    // remove thông tin kiểm tra trùng kho quản lý
    removeTeamArea (areaId, type = 'station') {
      if (!areaId) return

      let idx = this.checkTeam[type].findIndex(o => (+o[type].id === +areaId))
      if (idx !== -1) this.checkTeam[type].splice(idx, 1)
    },

    // formatDate (date, format) {
    //   return helper.formatDate(date, format || 'DD-MM-YYYY')
    // },

    handleSelectedField (field, option) {
      this[field] = option ? option.map((item) => item.id).toString() : ''
    },

    handleSelectedRegion (op) {
      let hasAll = op ? op.find(item => (+item.id === -1)) : false
      if (hasAll) {
        this.regions = 'MN,MT,MB,HN,HCM'
        return
      }
      this.regions = op ? op.filter(val => !+val.id).map(item => item.id).toString() : ''
    },

    checkTeamByUser (user, isLeader = false) {
      if (!user || !user.id) return
      hrteamService.checkTeamByUser({ user: user.id })
        .then(res => {
          if (res.data.success) {
            if (Array.isArray(res.data.data) && res.data.data.length) {
              if (isLeader) this.checkTeamUserLeader.push({ user: user, team: res.data.data })
              else this.checkTeamUserMember.push({ user: user, team: res.data.data })
            }
          }
        }).catch(e => {
          console.log(e)
        })
    },

    checkTeamByArea (area, type = 'station') {
      if (!area || !area.id) return
      hrteamService.checkTeamByArea({ area: area.id, type, has_kpi: 1, group_type: this.groupType })
        .then(res => {
          if (res.data.success) {
            if (Array.isArray(res.data.data) && res.data.data.length) {
              if (res.data.data.length) {
                this.checkTeam[type].push({ [type]: area, teams: res.data.data })
              }
            }
          }
        }).catch(e => {
          console.log(e)
        })
    },

    validateConfig (area, type = 'station') {
      let currentIndex = this[type + 's'].indexOf(area)
      this.$set(this[type + 's'][currentIndex], 'isValidData', true)
      if (!this[type + 's']) return
      if (!area || !area.area_id || (helper.isEmpty(area.from) && helper.isEmpty(area.to))) {
        area.isValidData = false
        return
      }
      if (helper.isEmpty(area.from)) {
        helper.showMessage('Ngày bắt đầu không được để trống', 'warning')
        area.isValidData = false
        return
      }
      if (!helper.isEmpty(area.to) && area.to < area.from) {
        helper.showMessage('Ngày kết thúc phải >= ngày bắt đầu', 'warning')
        area.isValidData = false
        return
      }

      let listSameAreas = this[type + 's'].filter((item, index) => index !== currentIndex && +item.area_id === +area.area_id)
      if (listSameAreas.length > 0 && type === 'station') {
        // Trường hợp trùng kho => check tiếp trùng khoảng thời gian hay không
        for (let i = 0; i < listSameAreas.length; i++) {
          const compareArea = listSameAreas[i]
          if (dateHelper.checkIsOverlapRangeTime([area.from, area.to], [compareArea.from, compareArea.to])) {
            const message = `${this.getNameByType(type)} ${area.name} đã được thêm trước đó trong khoảng thời gian ${compareArea.from} - ${compareArea.to}`
            helper.showMessage(message, 'warning')
            this.$set(this[type + 's'][currentIndex], 'isValidData', false)
            return
          } else {
            let compareAreaIndex = this[type + 's'].indexOf(compareArea)
            this.$set(this[type + 's'][compareAreaIndex], 'isValidData', true)
          }
        }
      }
    },

    getHrTeam () {
      this.$startLoading()
      hrteamService.getHrTeamById({id: this.$route.params.id})
        .then(res => {
          if (res.data.success) {
            this.setData(res.data.data)
          } else helper.showMessage(res.data.message || 'Không thể lấy thông tin team !', 'warning')
        }).catch(err => {
          helper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(err)
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    setData (data) {
      this.teamId = data.id
      this.teamName = data.name
      this.hasKpi = data.has_kpi
      this.groupType = data.group_type || ''
      this.subGroupType = data.sub_group_type || ''
      this.target = data.target || ''
      this.provinceIds = data.province_id
      this.stations = data.stations || []
      this.provinces = data.provinces || []
      this.regions = data.region
      this.stationIds = data.station_id || null
      this.districtIds = data.district_id
      this.districts = data.districts || []
      this.subDistrictIds = data.sub_district_id
      this.sub_districts = data.sub_districts || []
      this.moduleIds = data.module_id || null
      if (this.groupType === 'ns') {
        this.departmentIds = Array.isArray(data.departments) && data.departments.length > 0 ? data.departments.join(',') : ''
        this.departments = []
      } else {
        this.departmentIds = Array.isArray(data.departments) && data.departments.length > 0 ? data.departments.map(item => item.area_id).join(',') : ''
        this.departments = data.departments || []
      }

      this.positionIds = Array.isArray(data.positions) && data.positions.length > 0 ? data.positions.map(item => item.area_id).join(',') : ''
      this.positions = data.positions || []
      this.recruitmentJobIds = data.recruitment_jobs.join(',')
      this.leaders = data.leaders || []
      this.members = data.members || []
    },

    checkMissingField () {
      let missingField = ''
      if (!this.teamName) missingField += '- Tên nhóm \n'
      if (!this.groupType) missingField += '- Loại nhóm \n'
      if (!this.canAddUser(this.leaders)) missingField += '- Trưởng nhóm và ngày bắt đầu vào nhóm \n'
      if (!this.canAddUser(this.members)) missingField += '- Thành viên và ngày bắt đầu vào nhóm \n'
      if (!this.canAddArea(this.stations)) missingField += '- Kho và ngày bắt đầu quản lý ! \n'
      if (!this.canAddArea(this.provinces)) missingField += '- Tỉnh và ngày bắt đầu quản lý ! \n'
      if (!this.canAddArea(this.districts)) missingField += '- Quận/huyện và ngày bắt đầu quản lý ! \n'
      if (!this.canAddArea(this.sub_districts)) missingField += '- Phường/xã và ngày bắt đầu quản lý ! \n'

      return missingField || true
    },

    updateHrTeam () {
      let misingField = this.checkMissingField()
      if (typeof misingField === 'string') {
        alert('Vui lòng nhập đủ và đúng thông tin \n' + misingField)
        return
      }
      let dataSend = {
        name: this.teamName,
        hasKpi: this.hasKpi,
        groupType: this.groupType,
        subGroupType: this.subGroupType,
        target: this.target,
        leaders: this.leaders,
        members: this.members,
        regions: this.regions,
        provinceIds: this.provinceIds,
        provinces: this.provinces,
        districtIds: this.districtIds,
        districts: this.districts,
        subDistrictsIds: this.subDistrictsIds,
        sub_districts: this.sub_districts,
        stations: this.stations,
        moduleIds: this.moduleIds,
        stationIds: this.stationIds,
        departmentIds: this.departmentIds,
        positionIds: this.positionIds,
        recruitmentJobIds: this.recruitmentJobIds
      }
      // lọc bỏ các kho đã bị quản lý bởi team khác hoặc rỗng với các team tính KPI
      if (this.checkTeam['station'] && this.checkTeam['station'].length && dataSend.stations) {
        let stationConflic = [null, '', undefined, NaN]
        if (this.hasKpi) {
          this.checkTeam['station'].forEach(sta => {
            if (sta.station.id && this.areaConflic(sta.teams)) stationConflic.push(+sta.station.id)
          })
        }
        dataSend.stations = dataSend.stations.filter(op => (!stationConflic.includes(+op.area_id)))
      }
      // lọc bỏ các tỉnh đã bị quản lý bởi team khác hoặc rỗng với các team tính KPI
      if (this.checkTeam['province'] && this.checkTeam['province'].length && dataSend.provinces) {
        let provinceConflic = [null, '', undefined, NaN]
        if (this.hasKpi) {
          this.checkTeam['province'].forEach(pro => {
            if (pro.province.id && this.areaConflic(pro.teams)) provinceConflic.push(+pro.province.id)
          })
        }
        dataSend.provinces = dataSend.provinces.filter(op => (!provinceConflic.includes(+op.area_id)))
      }

      this.$startLoading()
      if (this.teamId) {
        dataSend.id = this.teamId
        hrteamService.updateHrTeam(dataSend)
          .then(res => {
            if (res.data.success) {
              this.getHrTeam()
              helper.showMessage(res.data.message || 'Update thông tin nhóm thành công', 'success')
              this.checkTeamUserLeader = []
              this.checkTeamUserMember = []
              this.checkTeam['station'] = []
              this.checkTeam['province'] = []
            } else helper.showMessage(res.data.message || 'Không thể update thông tin team !', 'warning')
          })
          .catch(e => {
            helper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
            console.log(e)
          })
          .finally(_ => {
            this.$stopLoading()
          })
      } else {
        hrteamService.addHrTeam(dataSend)
          .then(res => {
            if (res.data.success) {
              helper.showMessage(res.data.message || 'Thêm team nhân sự thành công', 'success')
              this.$router.push({name: 'manager-hrteam'})
            } else helper.showMessage(res.data.message || 'Không thể thêm team !', 'warning')
          })
          .catch(e => {
            helper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
            console.log(e)
          })
          .finally(_ => {
            this.$stopLoading()
          })
      }
    },

    selectStationForCod (op) {
      if (op) this.stationIds = op.map(o => (o.id)).toString()
      else this.stationIds = null
    },

    handleDepartmentSelected: function (option) {
      this.departmentIds = option ? option.map((item) => item.id).toString() : ''
    },

    handlePositionSelected: function (option) {
      this.positionIds = option ? option.map((item) => item.id).toString() : ''
    },
    handleJobSelected: function (option) {
      this.recruitmentJobIds = option ? option.map((item) => item.id).toString() : ''
    }
  }
}
</script>
