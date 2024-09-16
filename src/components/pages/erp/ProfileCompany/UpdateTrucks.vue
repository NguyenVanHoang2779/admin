<template>
  <div class="update-user">
    <div class="notification-truck">
      <b-alert
        :variant="notify_add_truck.type"
        dismissible
        fade
        :show="notify_add_truck.showDismissibleAlert"
        @dismissed="notify_add_truck.showDismissibleAlert = false"
      >
        {{notify_add_truck.message}}
      </b-alert>
    </div>
    <div class="row header">
      <div class="col-md-8">
        <h2 v-if="isAdd">Thêm xe liên kết</h2>
        <h2 v-else>Sửa thông tin xe</h2>
      </div>
      <div class="col-md-4">
        <b-row>
          <b-col md="12" class="text-right">
            <router-link v-if="isMoreInfo" :to="{name: 'manage-trucks'}" class="btn btn-outline-success ml-1"><i class="ion ion-ios-arrow-back"></i> Quản lý Xe</router-link>
            <router-link v-else :to="{name: 'manager-master-company-profile'}" class="btn btn-outline-success ml-1"><i class="ion ion-ios-arrow-back"></i> Quản lý Profile Công ty</router-link>
          </b-col>
        </b-row>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 create-user">
        <div class="card mb-3">
          <div class="row no-gutters row-bordered">
            <div class="col-md-4 find-master-profile" v-if="!isMoreInfo">
              <div class="col-md-12 col-lg-12 col-xl-12">
                <h6 class="card-header"><i class="ion  ion-ios-add-circle"></i>&nbsp;Thông tin profile công ty</h6>
                <div class="card-body" v-if="checkEmptyObject(masterInfo.id)">
                  <b-form-group v-if="isAdd" class="w-100" label="Tìm kiếm Profile">
                    <b-input-group>
                      <single-select-company-profile
                        v-model="masterInfo.id"
                        :show-info="true"
                        @handleChooseProfileCompany="handleChooseProfileCompany"
                        :master-id="masterInfo.id"
                      >
                      </single-select-company-profile>
                    </b-input-group>
                  </b-form-group>
                  <div class="row">
                    <div class="col-6 col-xl-5 text-muted mb-3">Loại công ty</div>
                    <div class="col-6 col-xl-7 mb-3">
                      <span class="text-big">{{masterInfo.organization_type}}</span>
                    </div>
                    <div class="col-6 col-xl-5 text-muted mb-3">Tên công ty</div>
                    <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{masterInfo.fullname}}</span> </div>
                    <div class="col-6 col-xl-5 text-muted mb-3">Mã số thuế</div>
                    <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{masterInfo.tax_iden_number}}</span> </div>
                    <div class="col-6 col-xl-5 text-muted mb-3">Điện thoại liên hệ</div>
                    <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{masterInfo.contact_tel}}</span> </div>
                    <div class="col-6 col-xl-5 text-muted mb-3">Email liên hệ</div>
                    <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{masterInfo.contact_email}}</span> </div>
                  </div>
                  <div>
                    <router-link :to="{name: 'edit-master-profile-company', params: { id: masterInfo.id }}" class="">Chi tiết profile công ty<i class="ion ion-ios-arrow-dropright"></i></router-link>
                  </div>
                </div>
                <div class="card-body" v-else>
                  Không thuộc công ty liên kết nào!
                </div>
              </div>
            </div>
            <div class="input-user-info" :class="{'col-md-12': isMoreInfo, 'col-md-8': !isMoreInfo}">
              <div class="row no-gutters">
                <div class="col-md-12 col-lg-12 col-xl-12">
                  <h6 class="card-header"><i class="ion  ion-ios-add-circle"></i> Thông tin xe liên kết</h6>
                  <div class="card-body">
                    <b-form-row>
                        <b-form-group :class="truckData.truck_type ===0 ? 'col-md-2 fs-avatar' : 'col-md-3 fs-avatar'">
                          <b-card-body class="col-md-12" >
                            <template>
                              <div class="text-left">
                                <div v-for="(file, index) in fileDocuments" :key="file.id">
                                  <div v-if="file.link_file" class="img-bounder mt-1 mb-4" :key="file.id">
                                    <span @click="deleteFile($event, index, true)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                                    <b-img
                                      v-if="getFileType(file.type) === 'image'"
                                      v-img="{group: `files`}" :src="file.link_file" :alt="file.name" class="rounded mt-2 mr-3" style="height: 150px; width: 128px;"
                                    ></b-img>
                                    <div v-else class="mt-2 mr-3">
                                      <b-link @click="openLink(file.link_file)" class="mr-3">
                                        <h4><b-badge variant="primary">{{file.name}}</b-badge></h4>
                                      </b-link>
                                    </div>
                                  </div>
                                </div>
                                <div v-for="(file, index) in fileAdded" class="img-bounder mt-1 mb-4" :key="index">
                                  <span @click="deleteFile($event, index, false)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                                  <a href="javascript:void(0)">
                                    <b-img
                                      v-if="getFileType(file.type) === 'image'"
                                      :src="getUrl(file)" :alt="file.name" class="rounded mt-2 mr-3" style="height: 150px; width: 128px;"
                                    >
                                    </b-img>
                                    <b-link v-else class="mr-3">
                                      <h4><b-badge variant="primary">{{file.name}}</b-badge></h4>
                                    </b-link>
                                  </a>
                                </div>
                                <div class="img-bounder mt-1 mb-4" v-if="(fileDeleted.length && fileAdded.length < 1) || (!fileDeleted.length && fileDocuments.length < 1 && fileAdded.length < 1)">
                                  <b-form-group class="dragdrop font-size">
                                    <b-form-file
                                      accept="image/*"
                                      v-model="fileAdded"
                                      multiple
                                      placeholder="+"
                                      drop-placeholder="Drop file"
                                      :file-name-formatter="formatNames"
                                    >
                                    </b-form-file>
                                    <div class="fs-avatar-txt">Avatar xe tải</div>
                                  </b-form-group>
                                </div>
                              </div>
                            </template>
                          </b-card-body>
                        </b-form-group>
                        <b-form-group :class="truckData.truck_type ===0 ? 'col-md-10' : 'col-md-9'">
                          <b-form-row>
                            <b-form-group class="col-md-4">
                              <template slot='label'>
                                Loại phương tiện
                              </template>
                              <b-form-select :disabled="isPermissionEngineer" v-model="truckData.truck_type" :options="optionTruckType" name="truck_type" v-validate="'required'" :class="{'is-danger': errors.has('truck_type')}">
                                <template v-slot:first>
                                  <option :value="null" disabled>-- Chọn loại xe --</option>
                                </template>
                              </b-form-select>
                              <span v-show="errors.firstRule('truck_type') == 'required'" class="help is-danger">Không để trống trường này </span>
                            </b-form-group>
                            <b-form-group class="col-md-4">
                              <template slot='label'>
                                Hình thức xe
                              </template>
                              <b-form-select :disabled="isPermissionEngineer" v-model="truckData.vehicle_type" :options="optionTruck" name="vehicle_type" v-validate="'required'" :class="{'is-danger': errors.has('vehicle_type')}">
                                <template v-slot:first>
                                  <option :value="null" disabled>-- Chọn hình thức xe --</option>
                                </template>
                              </b-form-select>
                              <span v-show="errors.firstRule('vehicle_type') == 'required'" class="help is-danger">Không để trống trường này </span>
                            </b-form-group>
                            <b-form-group class="col-md-4" v-if="truckData.truck_type ==1">
                              <template slot='label'>
                                Loại xe thuê
                              </template>
                              <b-form-select :disabled="isPermissionEngineer" v-model="truckData.lease_type" :options="optionTruckLeaseType" name="truck_lease_type" >
                                <template v-slot:first>
                                  <option :value="null" disabled>-- Chọn loại xe thuê--</option>
                                </template>
                              </b-form-select>
                            </b-form-group>
                            <b-form-group class="col-md-4" v-show="isMoreInfo">
                              <template slot='label'>
                                Kho
                              </template>
                              <single-select-station @handleSelectedStation="handleSelectedStation" :stationId="truckData && truckData.station_id" :isDisabled="isPermissionEngineer"></single-select-station>
                            </b-form-group>
                            <b-form-group class="col-md-4">
                              <template slot='label'>
                                Hãng xe
                              </template>
                              <b-form-select
                                :disabled="isPermissionEngineer"
                                v-model="truckMakerSelect"
                                :options="optionTrucksMakers"
                                @change="onChangeTruckMaker"
                              >
                              </b-form-select>
                              <b-form-input v-show="!truckMakerSelect"
                                            v-model="truckData.automaker"
                                            id="automaker"
                                            name="automaker"
                                            v-validate="{required: isTruck}"
                                            placeholder="Nhập tên hãng (Toyota, Nissan, ...)"
                                            :class="{'is-danger': errors.has('automaker')}"
                              >
                              </b-form-input>
                              <span v-show="errors.firstRule('automaker') == 'required'" class="help is-danger">Không để trống trường này </span>
                            </b-form-group>
                            <b-form-group class="col-md-4">
                              <template slot='label'>
                                Biển số xe
                              </template>
                              <b-form-input
                                v-model="truckData.code"
                                name="code"
                                v-validate="{required: isTruck, regex: isTruck ? /^\d{2}[A-Z]{1,2}\d?\-(\d{4}|\d{3}\.\d{2})$/ : ''}"
                                placeholder="Nhập biển số, ví dụ: 29H-229.79"
                                :class="{'is-danger': errors.has('code')}"
                                :disabled="!!filter.truck_id"
                              >
                              </b-form-input>
                              <span v-show="errors.firstRule('code') == 'required'" class="help is-danger">Không để trống trường này </span>
                              <span v-show="errors.firstRule('code') == 'regex'" class="help is-danger">Biển số không đúng định dạng  </span>
                            </b-form-group>
                            <b-form-group class="col-md-4" v-if="!isMoreInfo">
                              <template slot='label'>
                                Số đăng kí xe
                              </template>
                              <b-form-input
                                v-model="truckData.vehicle_reg_number"
                                id="vehicle_reg_number"
                                name="vehicle_reg_number"
                                key="vehicle_reg_number"
                                v-validate="{required: isTruck, numeric: true}"
                                placeholder="Nhập số đăng kí xe"
                                :class="{'is-danger': errors.has('vehicle_reg_number')}"
                                :disabled="isPermissionEngineer"
                              >
                              </b-form-input>
                              <span v-show="errors.firstRule('vehicle_reg_number') == 'required'" class="help is-danger">Không để trống trường này </span>
                              <span v-show="errors.firstRule('vehicle_reg_number') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                            </b-form-group>
                          </b-form-row>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                      <b-form-group class="col-md-4" v-if="!isMoreInfo">
                        <template slot='label'>
                          Số đăng kiểm
                        </template>
                        <b-form-input
                          v-model="truckData.registry_number"
                          id="registry_number"
                          name="registry_number"
                          key="registry_number"
                          v-validate="{required: isTruck, regex: /[A-Z]{2}\-(\d{7})/}"
                          placeholder="Nhập số đăng kiểm, ví dụ: KC-4003297"
                          :class="{'is-danger': errors.has('registry_number')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('registry_number') == 'required'" class="help is-danger">Không để trống trường này </span>
                        <span v-show="errors.firstRule('registry_number') == 'regex'" class="help is-danger">Số đăng kiểm không đúng định dạng</span>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Thể tích thùng xe
                        </template>
                        <b-form-input
                          v-model="truckData.trunk_volume"
                          id="trunk_volume"
                          name="trunk_volume"
                          key="trunk_volume"
                          placeholder="Nhập thể tích thùng xe (khối)"
                          v-validate="{required: isTruck, numeric: true, max_value: 100}"
                          :class="{'is-danger': errors.has('trunk_volume')}"
                          @change="onChangeVolume($event)"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('trunk_volume') == 'required'" class="help is-danger">Không để trống trường này </span>
                        <span v-show="errors.firstRule('trunk_volume') == 'numeric'" class="help is-danger">Vui lòng điền số </span>
                        <span v-show="errors.firstRule('trunk_volume') == 'max_value'" class="help is-danger">Thể tích khối không quá 100 khối </span>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Tải trọng thực tế
                        </template>
                        <b-form-input
                          v-model="truckData.weight"
                          id="weight"
                          name="weight"
                          key="weight"
                          placeholder="Nhập tải trọng thực tế"
                          v-validate="{required:true, decimal: true, max_value:30, min_value:0}"
                          :class="{'is-danger': errors.has('weight')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('weight') == 'required'" class="help is-danger">Không để trống trường này </span>
                        <span v-show="errors.firstRule('weight') == 'decimal' || errors.firstRule('weight') == 'min_value'" class="help is-danger">Tải trọng thực tế không hợp lệ</span>
                        <span v-show="errors.firstRule('weight') == 'max_value'" class="help is-danger">Tải trọng thực tế không quá 30 tấn </span>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Tải trọng tính cước
                        </template>
                        <b-form-select :disabled="isPermissionEngineer" v-model="truckData.weight_billing" v-on:change="changeWeightBilling" :options="optionWeight" name="weight_billing" v-validate="'required'" :class="{'is-danger': errors.has('weight_billing')}">
                          <template v-slot:first>
                            <option :value="null" disabled>-- Chọn tải trọng --</option>
                          </template>
                        </b-form-select>
                        <span v-show="errors.firstRule('weight_billing') == 'required'" class="help is-danger">Không để trống trường này </span>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Số lượng cửa xe
                        </template>
                        <b-form-input
                          v-model="truckData.amount_truck_door"
                          id="amount_truck_door"
                          name="amount_truck_door"
                          key="amount_truck_door"
                          placeholder="Nhập số lượng cửa xe"
                          type="number"
                          min="1"
                          max="10"
                          :formatter="convertInt"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Model xe
                        </template>
                        <b-form-select
                          v-model="truckData.model_car"
                          :options="optionTrucksModelCar"
                          placeholder="Chọn model xe"
                          v-if="!isShowInputModelTruck"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-select>
                        <b-form-input
                          v-model="truckData.model_car"
                          name="model_car"
                          id="model_car"
                          v-validate="{required:true, max:20}"
                          v-if="isShowInputModelTruck"
                          placeholder="Nhập model xe"
                          type="text"
                          :class="{'is-danger': errors.has('model_car')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('model_car') == 'required'" class="help is-danger">Không để trống trường này </span>
                        <span v-show="errors.firstRule('model_car') == 'max'" class="help is-danger">Số lượng kí tự nhập quá 20 kí tự</span>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="isMoreInfo">
                        <template slot='label'>
                          Số khung
                        </template>
                        <b-form-input
                          v-model="truckData.chassis_number"
                          id="chassis_number"
                          name="chassis_number"
                          key="chassis_number"
                          v-validate="'max:30|alpha_num'"
                          placeholder="Nhập số khung"
                          :class="{'is-danger': errors.has('chassis_number')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('chassis_number') == 'max'" class="help is-danger">Số lượng kí tự quá dài</span>
                        <span v-show="errors.firstRule('chassis_number') == 'alpha_num'" class="help is-danger">Vui lòng chỉ nhập chữ và số </span>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-show="isMoreInfo">
                        <template slot='label'>
                          Số máy
                        </template>
                        <b-form-input
                          v-model="truckData.engine_number"
                          id="engine_number"
                          name="engine_number"
                          v-validate="'max:30|alpha_num'"
                          placeholder="Nhập số khung"
                          :class="{'is-danger': errors.has('engine_number')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('engine_number') == 'max'" class="help is-danger">Số lượng kí tự quá dài</span>
                        <span v-show="errors.firstRule('engine_number') == 'alpha_num'" class="help is-danger">Vui lòng chỉ nhập chữ và số </span>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="isMoreInfo">
                        <template slot='label'>
                          Ngày mua xe
                        </template>
                        <b-form-input
                          v-if="isPermissionEngineer"
                          color="green"
                          id="buy_date"
                          name="buy_date"
                          v-model="getDateInput"
                          placeholder="Chon thoi gian"
                          :class="{'is-danger': errors.has('buy_date')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <v-date-picker v-else color="green" placeholder="Chon thoi gian" :popover="{visibility: 'focus'}"
                                       :max-date="getMaxDate" v-model="truckData.buy_date" locale="vi"/>
                      </b-form-group>
                      <b-form-group v-if="+truckData.truck_type === 0" class="col-md-4">
                        <template slot='label'>
                          Người được gán
                        </template>
                        <b-input-group>
                          <multi-select-truck-driver
                            @input="handleSelectedDriverOption"
                            company-type="1"
                            :maxSelectedMessage="'Bạn chỉ được gán tối đa 3 tài xế! vui lòng bỏ chọn nếu muốn thay đổi lựa chọn'"
                            :truckDrivers="truckDriverIds"
                            :multiple="true"
                            :maxSelected="3"
                            :disabled="isPermissionEngineer"
                          >
                          </multi-select-truck-driver>
                        </b-input-group>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row>
                      <b-form-group class="col-md-4">
                        <span slot="label">
                          Kỹ thuật xe
                        </span>
                        <multi-select-truck-engineer
                          :engineerId="truckData.vehicle_engineer"
                          @handleChooseEngineer="handleChooseEngineer"
                        >
                        </multi-select-truck-engineer>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <span slot='label'>
                          Màu xe
                        </span>
                        <multi-select-truck-color
                          :vehicleColor="truckData.vehicle_color"
                          @handleChooseTruckColor="handleChooseTruckColor"
                          v-if="!isShowInputModelTruck"
                        >
                        </multi-select-truck-color>
                        <b-form-input
                          v-model="truckData.vehicle_color"
                          id="vehicle_color"
                          name="vehicle_color"
                          v-if="isShowInputModelTruck"
                          v-validate="{required:true, max:20}"
                          placeholder="Nhập màu xe"
                          type="text"
                          :class="{'is-danger': errors.has('vehicle_color')}"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('vehicle_color') == 'required'" class="help is-danger">Không để trống trường này </span>
                        <span v-show="errors.firstRule('vehicle_color') == 'max'" class="help is-danger">Số lượng kí tự nhập quá 20 kí tự</span>
                      </b-form-group>
                      <b-form-group class="col-md-2">
                        <template slot='label'>
                          Khối lượng
                        </template>
                        <b-form-input
                            v-model="truckData.rule_weight"
                            id="rule_weight"
                            name="rule_weight"
                            key="rule_weight"
                            v-validate="{regex: /^\d+(\.\d{1,2})?$/}"
                            placeholder="Khối lượng"
                            :class="{'is-danger': errors.has('rule_weight')}"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('rule_weight') == 'regex'" class="help is-danger">Vui lòng đúng định dạng </span>
                      </b-form-group>
                      <b-form-group class="col-md-2">
                        <template slot='label'>
                          SL đơn
                        </template>
                        <b-form-input
                            v-model="truckData.rule_order"
                            id="rule_order"
                            name="rule_order"
                            key="rule_order"
                            v-validate="{numeric: true, max:11}"
                            placeholder="SL đơn"
                            :class="{'is-danger': errors.has('rule_order')}"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('rule_order') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('rule_order') == 'max'" class="help is-danger">Số lượng kí tự nhập quá 11 kí tự </span>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <span slot='label'>
                          Định mức dầu (lít/100km)
                        </span>
                        <b-form-input
                          v-model="truckData.oil_quota"
                          id="oil_quota"
                          name="oil_quota"
                          v-validate="{required:true, decimal: true, max_value:999999, min_value:0}"
                          placeholder="Nhập định mức dầu"
                          type="text"
                          :class="{'is-danger': errors.has('oil_quota')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('oil_quota') == 'required'" class="help is-danger">Không để trống trường này </span>
                        <span v-show="errors.firstRule('oil_quota') == 'decimal' || errors.firstRule('oil_quota') == 'min_value'" class="help is-danger">Định mức dầu không hợp lệ</span>
                        <span v-show="errors.firstRule('oil_quota') == 'max_value'" class="help is-danger">Số lượng kí tự nhập quá 999999 lít</span>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row v-if="[1, 4].includes(parseInt(truckData.truck_type))">
                      <b-form-group class="col-md-8" label="Tìm kiếm Profile">
                        <b-input-group>
                          <single-select-company-profile
                            v-model="masterInfo.id"
                            :show-info="true"
                            @handleChooseProfileCompany="handleChooseProfileCompany"
                            :master-id="masterInfo.id"
                            :disabled="isPermissionEngineer"
                          >
                          </single-select-company-profile>
                        </b-input-group>
                      </b-form-group>
                    </b-form-row>
                    <update-vehicle-property
                      v-if="isRentInfo"
                      :isAdd="isAdd"
                      :isEdit="isEdit"
                      :stationId="stId"
                      :orderTruck="orderTruck"
                      :isRentInfo="isRentInfo"
                      :assetCodeTruckRents="assetCodeTruckRent"
                      :lstCodeTruckRents="assetCode.lstRcCode"
                      :isPermissionEngineer="isPermissionEngineer"
                      @updateRcTruckRent="updateRcTruckRent"
                      @reloadRc="reloadRc"
                      @isReloadRC="isReloadRC"
                    >
                    </update-vehicle-property>
                    <b-form-row v-if="isMoreInfo">
                      <h6 style="padding: 12px 24px;"><i class="ion ion-ios-add-circle"></i> Thông tin tài sản xe</h6>
                    </b-form-row>
                    <!-- Add xe nhà, xe thuê khô -->
                    <b-form-row v-if="isAdd && isMoreInfo">
                      <b-form-group class="col-md-4">
                        <span slot="label">Bình chữa cháy</span>
                        <b-form-input
                          v-model="fireExtinguisherCode.code"
                          id="fire_extinguisher_code"
                          name="fire_extinguisher_code"
                          key="fire_extinguisher_code"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('fire_extinguisher_code')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('fire_extinguisher_code') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('fire_extinguisher_code') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Kích trợ lực to
                        </template>
                        <b-form-input
                          v-model="bigBoosterCode.code"
                          id="big_booster_code"
                          name="big_booster_code"
                          key="big_booster_code"
                          v-validate="{numeric: true}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('big_booster_code')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('big_booster_code') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Chìa khóa, giấy tờ</span>
                        <b-form-input
                          v-model="truckAsset.paper_key"
                          id="paper_key"
                          name="paper_key"
                          key="paper_key"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('paper_key')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('paper_key') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('paper_key') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row v-if="isAdd && isMoreInfo">
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Khóa cửa
                        </template>
                        <b-form-input
                          v-model="lockDoorCode.code"
                          id="lock_door_code"
                          name="lock_door_code"
                          key="lock_door_code"
                          v-validate="{numeric: true}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('lock_door_code')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('lock_door_code') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Kích trợ lực nhỏ
                        </template>
                        <b-form-input
                          v-model="smallBoosterCode.code"
                          id="small_booster_code"
                          name="small_booster_code"
                          key="small_booster_code"
                          v-validate="{numeric: true}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('small_booster_code')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('small_booster_code') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Bộ đồ theo xe</span>
                        <b-form-input
                          v-model="truckAsset.vehicle_outfit"
                          id="vehicle_outfit"
                          name="vehicle_outfit"
                          key="vehicle_outfit"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('vehicle_outfit')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('vehicle_outfit') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('vehicle_outfit') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row v-if="isAdd && isMoreInfo">
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Pallet
                        </template>
                        <b-input-group v-if="palletOptions.length > 0">
                          <multi-select-pallet-code
                            :isDisabled="isPermissionEngineer"
                            :placeholder="`Chọn pallet`"
                            :palletOptions="palletOptions"
                            :palletCodes.sync="palletCodes"
                          />
                        </b-input-group>
                        <b-input-group v-else>
                          <b-form-input :disabled="isPermissionEngineer" placeholder="Không tồn tại tài sản trong kho để chọn"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Cân
                        </template>
                        <b-input-group v-if="optionsWeight.length > 0">
                          <multi-select-weight-code
                            :isDisabled="isPermissionEngineer"
                            :weightCodes="weightCodes"
                            :optionsWeight="optionsWeight"
                            :multiple="false"
                            @handleChooseWeightCode="handleChooseWeightCode"
                          />
                        </b-input-group>
                        <b-input-group v-else>
                          <b-form-input :disabled="isPermissionEngineer" placeholder="Không tồn tại tài sản trong kho để chọn"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Búa thoát hiểm</span>
                        <b-form-input
                          v-model="truckAsset.escape_hammer"
                          id="escape_hammer"
                          name="escape_hammer"
                          key="escape_hammer"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('escape_hammer')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('escape_hammer') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('escape_hammer') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row v-if="isAdd && isMoreInfo">
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Dây đai chằng hàng xe tải
                        </template>
                        <b-form-input
                          v-model="strapCode.code"
                          id="strap_code"
                          name="strap_code"
                          key="strap_code"
                          v-validate="{numeric: true}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('strap_code')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('strap_code') === 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Lốp dự phòng</span>
                        <b-form-input
                          v-model="truckAsset.spare_tire"
                          id="spare_tire"
                          name="spare_tire"
                          key="spare_tire"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('spare_tire')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('spare_tire') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('spare_tire') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Vỏ xe</span>
                        <b-form-input
                          v-model="truckAsset.tires"
                          id="tires"
                          name="tires"
                          key="tires"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('tires')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('tires') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('tires') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row v-if="isAdd && isMoreInfo">
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Máy in</span>
                        <b-input-group v-if="optionsPrinter.length > 0">
                          <multi-select-printer
                            :isDisabled="isPermissionEngineer"
                            :printerCodes="printerCodes"
                            :options="optionsPrinter"
                            :multiple="false"
                            @handleChoosePrinterCode="handleChoosePrinterCode"
                          />
                        </b-input-group>
                        <b-input-group v-else>
                          <b-form-input :disabled="isPermissionEngineer" placeholder="Không tồn tại tài sản trong kho để chọn"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Máy quét</span>
                        <b-input-group v-if="optionsScanning.length > 0">
                          <multi-select-scanning-gun
                            :isDisabled="isPermissionEngineer"
                            :scanningCodes="scanningCodes"
                            :options="optionsScanning"
                            :multiple="false"
                            @handleChooseScanningCode="handleChooseScanningCode"
                          />
                        </b-input-group>
                        <b-input-group v-else>
                          <b-form-input :disabled="isPermissionEngineer" placeholder="Không tồn tại tài sản trong kho để chọn"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Nắp bình dầu</span>
                        <b-form-input
                          v-model="truckAsset.oil_cap"
                          id="oil_cap"
                          name="oil_cap"
                          key="oil_cap"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('oil_cap')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('oil_cap') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('oil_cap') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row v-if="isAdd && isMoreInfo">
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Ắc quy</span>
                        <b-form-input
                          v-model="truckAsset.battery"
                          id="battery"
                          name="battery"
                          key="battery"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('battery')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('battery') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('battery') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row v-if="isAdd && isMoreInfo">
                      <b-form-group class="col-md-6">
                        <truck-rc
                          :lstRcCodes="assetCode.lstRcCode"
                          :orderTruck="orderTruck"
                          :isRentInfo="isRentInfo"
                          :stationId="stId"
                          :isPermissionEngineer="isPermissionEngineer"
                          :isReloadRC="isReloadRC"
                          @updateRc="updateRc"
                          @reloadRc="reloadRc"
                        >
                        </truck-rc>
                      </b-form-group>
                    </b-form-row>
                    <!-- Edit xe nhà, xe thuê khô -->
                    <b-form-row v-if="isEdit && isMoreInfo">
                      <b-form-group class="col-md-4">
                        <span slot="label">Bình chữa cháy</span>
                        <b-form-input
                          v-model="fireExtinguisherCode.code"
                          id="fire_extinguisher_code"
                          name="fire_extinguisher_code"
                          key="fire_extinguisher_code"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('fire_extinguisher_code')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('fire_extinguisher_code') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('fire_extinguisher_code') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Kích trợ lực to
                        </template>
                        <b-form-input
                          v-model="bigBoosterCode.code"
                          id="big_booster_code"
                          name="big_booster_code"
                          key="big_booster_code"
                          v-validate="{numeric: true}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('big_booster_code')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('big_booster_code') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Chìa khóa, giấy tờ</span>
                        <b-form-input
                          v-model="truckAsset.paper_key"
                          id="paper_key"
                          name="paper_key"
                          key="paper_key"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('paper_key')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('paper_key') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('paper_key') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row v-if="isEdit && isMoreInfo">
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Khóa cửa
                        </template>
                        <b-form-input
                          v-model="lockDoorCode.code"
                          id="lock_door_code"
                          name="lock_door_code"
                          key="lock_door_code"
                          v-validate="{numeric: true}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('lock_door_code')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('lock_door_code') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Kích trợ lực nhỏ
                        </template>
                        <b-form-input
                          v-model="smallBoosterCode.code"
                          id="small_booster_code"
                          name="small_booster_code"
                          key="small_booster_code"
                          v-validate="{numeric: true}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('small_booster_code')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('small_booster_code') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Bộ đồ theo xe</span>
                        <b-form-input
                          v-model="truckAsset.vehicle_outfit"
                          id="vehicle_outfit"
                          name="vehicle_outfit"
                          key="vehicle_outfit"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('vehicle_outfit')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('vehicle_outfit') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('vehicle_outfit') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row v-if="isEdit && isMoreInfo">
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Pallet
                        </template>
                        <b-input-group v-if="palletOptions.length > 0">
                          <multi-select-pallet-code
                            :isDisabled="isPermissionEngineer"
                            :placeholder="`Chọn pallet`"
                            :palletOptions="palletOptions"
                            :palletCodes.sync="palletCodes"
                          />
                        </b-input-group>
                        <b-input-group v-else>
                          <b-form-input :disabled="isPermissionEngineer" placeholder="Không tồn tại tài sản trong kho để chọn"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Cân
                        </template>
                        <b-input-group v-if="optionsWeight.length > 0">
                          <multi-select-weight-code
                            :isDisabled="isPermissionEngineer"
                            :weightCodes="weightCodes"
                            :optionsWeight="optionsWeight"
                            :multiple="false"
                            @handleChooseWeightCode="handleChooseWeightCode"
                          />
                        </b-input-group>
                        <b-input-group v-else>
                          <b-form-input :disabled="isPermissionEngineer" placeholder="Không tồn tại tài sản trong kho để chọn"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Búa thoát hiểm</span>
                        <b-form-input
                          v-model="truckAsset.escape_hammer"
                          id="escape_hammer"
                          name="escape_hammer"
                          key="escape_hammer"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('escape_hammer')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('escape_hammer') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('escape_hammer') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row v-if="isEdit && isMoreInfo">
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Dây đai chằng hàng xe tải
                        </template>
                        <b-form-input
                          v-model="strapCode.code"
                          id="strap_code"
                          name="strap_code"
                          key="strap_code"
                          v-validate="{numeric: true}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('strap_code')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('strap_code') === 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Lốp dự phòng</span>
                        <b-form-input
                          v-model="truckAsset.spare_tire"
                          id="spare_tire"
                          name="spare_tire"
                          key="spare_tire"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('spare_tire')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('spare_tire') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('spare_tire') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Vỏ xe</span>
                        <b-form-input
                          v-model="truckAsset.tires"
                          id="tires"
                          name="tires"
                          key="tires"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('tires')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('tires') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('tires') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row v-if="isEdit && isMoreInfo">
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Máy in</span>
                        <b-input-group v-if="optionsPrinter.length > 0">
                          <multi-select-printer
                            :isDisabled="isPermissionEngineer"
                            :printerCodes="printerCodes"
                            :options="optionsPrinter"
                            :multiple="false"
                            @handleChoosePrinterCode="handleChoosePrinterCode"
                          />
                        </b-input-group>
                        <b-input-group v-else>
                          <b-form-input :disabled="isPermissionEngineer" placeholder="Không tồn tại tài sản trong kho để chọn"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Máy quét</span>
                        <b-input-group v-if="optionsScanning.length > 0">
                          <multi-select-scanning-gun
                            :isDisabled="isPermissionEngineer"
                            :scanningCodes="scanningCodes"
                            :options="optionsScanning"
                            :multiple="false"
                            @handleChooseScanningCode="handleChooseScanningCode"
                          />
                        </b-input-group>
                        <b-input-group v-else>
                          <b-form-input :disabled="isPermissionEngineer" placeholder="Không tồn tại tài sản trong kho để chọn"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Nắp bình dầu</span>
                        <b-form-input
                          v-model="truckAsset.oil_cap"
                          id="oil_cap"
                          name="oil_cap"
                          key="oil_cap"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('oil_cap')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('oil_cap') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('oil_cap') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row v-if="isEdit && isMoreInfo">
                      <b-form-group class="col-md-4" v-if="+truckData.truck_type === 0">
                        <span slot="label">Ắc quy</span>
                        <b-form-input
                          v-model="truckAsset.battery"
                          id="battery"
                          name="battery"
                          key="battery"
                          v-validate="{numeric: true, max_value: 99}"
                          placeholder="Nhập số lượng"
                          :class="{'is-danger': errors.has('battery')}"
                          :disabled="isPermissionEngineer"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('battery') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        <span v-show="errors.firstRule('battery') == 'max_value'" class="help is-danger">Số lượng lớn nhất không quá 99 </span>
                      </b-form-group>
                    </b-form-row>
                    <b-form-row v-if="isEdit && isMoreInfo">
                      <b-form-group class="col-md-6">
                        <truck-rc
                           :lstRcCodes="assetCode.lstRcCode"
                           :orderTruck="orderTruck"
                           :isRentInfo="isRentInfo"
                           :stationId="stId"
                           :isPermissionEngineer="isPermissionEngineer"
                           :isReloadRC="isReloadRC"
                           @updateRc="updateRc"
                           @reloadRc="reloadRc"
                        >
                        </truck-rc>
                      </b-form-group>
                    </b-form-row>
                  </div>
                  <div class="card-footer border-0 text-center py-3" v-if="!isViewManagerTruck">
                    <ladda-btn style="margin-top: 50px;" v-if="isEdit && !isMoreInfo && isBKS && !censorRentTruck.status_profile" @click.native="saveCensor(1)" data-style="expand-right" class="btn btn-outline-success mr-4">Duyệt</ladda-btn>
                    <ladda-btn style="margin-top: 50px;" v-if="isEdit && !isMoreInfo && parseInt(censorRentTruck.status_profile) === 2" data-style="expand-right" class="btn btn-success mr-4">Đã duyệt</ladda-btn>
                    <ladda-btn style="margin-top: 50px;" v-if="isAdd" :loading="isProcessingUpdate" @click.native="updateVehicle()" data-style="expand-right" class="btn btn-success">
                      <i class="ion ion-ios-add"></i> Thêm xe liên kết
                    </ladda-btn>
                    <ladda-btn style="margin-top: 50px;" v-if="isEdit && isMoreInfo" :loading="isProcessingUpdate" @click.native="updateVehicle()" data-style="expand-right" class="btn btn-success">
                      <i class="icon ion-md-archive"></i> Cập nhật
                    </ladda-btn>
                    <ladda-btn style="margin-top: 50px;" v-if="isEdit && !isMoreInfo && (isBKS || (isPermissionWhenNotApproved && parseInt(censorRentTruck.status_profile) !== 2))" :loading="isProcessingUpdate" @click.native="updateVehicle()" data-style="expand-right" class="btn btn-success">
                      <i class="icon ion-md-archive"></i> Cập nhật
                    </ladda-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <update-trucks-component v-if="isEdit && isMoreInfo" :truckData="truckData" :isViewManagerTruck="isViewManagerTruck" @updateOk="updateOk()"></update-trucks-component>
    <update-rent-trucks-component v-if="isEdit && isRentInfo" :isRentInfo="isRentInfo" :truckData="truckData" :isViewManagerTruck="isViewManagerTruck" :isBKS="isBKS" :isPermissionWhenNotApproved="isPermissionWhenNotApproved" :censorRentTruck="censorRentTruck" @updateOk="updateOk()"></update-rent-trucks-component>
    <notifications group='add-truck'></notifications>
    <b-card v-if="isEdit && isMoreInfo" class="mt-3">
      <b-card-header>
        <b-row align-v="center">
          <b-col md="6">
            <h6><i class="ion  ion-ios-add-circle"></i>Thông tin bảo dưỡng, sửa chữa xe</h6>
          </b-col>
          <b-col md="6" class="text-right" v-if="!isViewManagerTruck">
            <!-- <b-button size="sm" variant="success"><i class="ion ion-ios-add"></i> Thêm mới</b-button> -->
            <router-link :to="{name: 'add-trucks-maintenance', params: { id: truckData.id }}" class="btn btn-outline-success btn-sm"><i class="ion ion-ios-add"></i> Thêm mới</router-link>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-body>
        <b-row v-if="truckLastDistance.order">
          <span class="font-weight-bold">Số Km: {{convertMoney(truckLastDistance.number_distance)}} km.</span>
          <span class="font-italic"> Cập nhật lần cuối tại phiên bảo dưỡng {{truckLastDistance.order}} ngày {{truckLastDistance.maintenance_date}}</span>
        </b-row>
        <b-table-simple hover responsive outlined borderless class="mt-3">
          <b-thead>
            <b-tr>
              <b-th>ID</b-th>
              <b-th>Ngày bảo dưỡng</b-th>
              <b-th>Loại bảo dưỡng</b-th>
              <b-th>Thành tiền</b-th>
              <b-th>Người tạo</b-th>
              <b-th>Phiếu bảo dưỡng</b-th>
              <b-th>Cập nhật</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="(item ,index) in truckMaintenance.list" v-bind:key="`${index}-${item.id}`">
              <b-td>{{item.order}}</b-td>
              <b-td>{{item.maintenance_date}}</b-td>
              <b-td v-if="item.nameCombos && countComboMaintenance(item.nameCombos) > 1">
                <div v-for="(maintenanceNames, idx) in item.nameCombos" v-if="idx === 0">
                  <span v-if="!truckMaintenance.comboMore[index]">
                    {{maintenanceNames}} <i class="fas fa-angle-double-down" @click="showMoreCombo(index)" style="color: #3482DA; font-size: 13px;"></i>
                  </span>
                  <span v-else>
                    {{maintenanceNames}} <i class="fas fa-angle-double-up" @click="showMoreLess(index)" style="color: #3482DA; font-size: 13px;"></i>
                  </span>
                </div>
                <div v-if="truckMaintenance.comboMore[index]" class="combo-more">
                  <div v-for="(maintenanceNames, idx) in item.nameCombos" v-if="idx > 0">
                    <span>{{maintenanceNames}}</span>
                  </div>
                </div>
              </b-td>
              <b-td v-else-if="item.nameCombos && countComboMaintenance(item.nameCombos) === 1">
                <div v-for="(maintenanceNames, idx) in item.nameCombos" v-if="idx === 0">
                  <span>{{maintenanceNames}}</span>
                </div>
              </b-td>
              <b-td v-else>{{item.typeText && item.typeText.text}}</b-td>
              <b-td v-if="item.number_cost && item.number_cost > 0">{{convertMoney(item.number_cost - item.number_discount)}}đ</b-td>
              <b-td v-else>{{convertMoney(item.number_pay)}}đ</b-td>
              <b-td>{{item.username}}</b-td>
              <b-td><b-link @click="showMaintenanceDoc(item.id)">Xem ảnh</b-link></b-td>
              <b-td v-if="!isViewManagerTruck">
                <!--Cmt nút sửa thông tin bảo dưỡng, sửa chữa xe-->
                <router-link class="mr-2" :to="{name: 'edit-trucks-maintenance', params: { id: item.id }}">Sửa</router-link>
                <!--|-->
                <b-link class="ml-2" @click="removeMaintenance(item.id)">Xóa</b-link>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
        <div class="mt-3" v-if="pageData.totalPages > 1">
          <b-row>
            <b-col md="12">
              <b-pagination
                v-model="pageData.current"
                :total-rows="pageData.totalItems"
                :per-page="pageData.perPage"
                v-on:change="pageChanged"
                aria-controls="my-table"
                align="center"
              ></b-pagination>
            </b-col>
          </b-row>
        </div>
      </b-card-body>
    </b-card>
    <!-- Thông tin sự vụ xe tải -->
    <b-card v-if="isEdit && isMoreInfo" class="mt-3">
      <b-card-header>
        <b-row align-v="center">
          <b-col md="2">
            <h6><i class="ion  ion-ios-add-circle"></i>Thông tin sự vụ xe tải</h6>
          </b-col>
          <b-col md="10" class="text-right dv-date-incident">
            <v-date-picker
              mode="range"
              v-model="dateFilter"
              locale="vi"
              color="green"
              format="dd-MM-yyyy"
              :calendar-button="true"
              :clear-button="true"
              :input-props="{ placeholder: 'Chọn khoảng thời gian', style: 'font-size:14px; line-height: unset' }"
              :opens="'center'"
            >
            </v-date-picker>
            <b-btn type="button" class="btn-sm" variant="primary" @click="searchTruckIncident(null)"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
            <router-link v-if="!isViewManagerTruck" :to="{name: 'add-incident', params: { id: truckData.id }}" class="btn btn-outline-success btn-sm"><i class="ion ion-ios-add"></i>  </router-link>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-body>
        <b-table-simple hover responsive outlined borderless class="mt-3">
          <b-thead>
            <b-tr>
              <b-th>ID</b-th>
              <b-th>Ngày tai nạn</b-th>
              <b-th>Địa điểm tai nạn</b-th>
              <b-th>Username tài xế</b-th>
              <b-th>Số điện thoại tài xế</b-th>
              <b-th>Mức độ hư hỏng xe</b-th>
              <b-th>Tình trạng sửa chữa xe</b-th>
              <b-th>Phiếu sửa chữa</b-th>
              <b-th>Chi phí sửa chữa</b-th>
              <b-th>Cập nhật</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="(item ,index) in listIncidents" v-bind:key="`${index}-${item.id}`">
              <b-td>{{item.id}}</b-td>
              <b-td>{{formatDate(item.accident_day)}}</b-td>
              <b-td>{{item.accident_site}}</b-td>
              <b-td>{{item.username_driver}}</b-td>
              <b-td>{{item.tel}}</b-td>
              <b-td>{{checkLevelDamage(item.level_damage)}}</b-td>
              <b-td>{{checkStatusRepair(item.status_repair)}}</b-td>
              <b-td v-if="item.image" class="dv-action"><a @click="onViewImage(item, index)">Xem ảnh</a></b-td>
              <b-td v-else></b-td>
              <b-td>{{convertMoney(item.fee)}}đ</b-td>
              <b-td class="dv-action"  v-if="!isViewManagerTruck">
                <router-link class="mr-2" :to="{name: 'edit-incident', params: { id: item.id }}">Sửa</router-link>
                |
                <b-link class="ml-2" @click="deleteTruckIncident(item)">Xóa</b-link>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
        <div class="mt-3" v-if="totalPages > 1">
          <b-row>
            <b-col md="6">
              <b-pagination
                :total-rows="totalItems"
                v-model="currentPage"
                :per-page="perPage"
                v-on:input="getAllTruckIncident(filter)"
              />
            </b-col>
            <b-col md="6">
              <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
            </b-col>
          </b-row>
        </div>
      </b-card-body>
    </b-card>
    <modal-view-documents :notFound="viewDoc.notFound" :trigger="viewDoc.trigger" :files="viewDoc.files" :title="viewDoc.title"></modal-view-documents>
    <!-- popup xem ảnh sửa chữa -->
    <b-modal class="vertical-align-modal" ref="image-incident-modal" id="viewIncidentModal" static>
      <template slot="modal-title">
        <div><span>PHIẾU SỬA CHỮA</span></div>
      </template>
      <div class="position-relative">
        <div class="row">
          <div class="col-md-2" v-for="(item) in curImage.listImage">
            <a class="text-dark" :href="item"><img :src="item" alt="avatar" height="100" width="100" style="padding-right: 30px;"></a>
          </div>
        </div>
      </div>
      <br/>
      <span><b>Lưu ý:</b> Click vào từng ảnh để phóng to ảnh muốn xem</span>
      <div slot="modal-footer"  class="w-100 text-center">
      </div>
    </b-modal>
    <div class="text-center">
      <ladda-btn v-if="isEdit && !isMoreInfo && isBKS && parseInt(censorRentTruck.status_success) !==  3" @click.native="saveCensor(4)" class="btn btn-success-all">Hoàn thành</ladda-btn>
      <ladda-btn v-if="isEdit && !isMoreInfo && isBKS && parseInt(censorRentTruck.status_success) ===  3" data-style="expand-right" class="btn btn-success mr-4">Hoàn thành</ladda-btn>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import MultiSelectUser from 'components/elements/common/MultiSelectUser'
import CompanyProfileService from 'domain/services/company-profile-service'
import SingleSelectCompanyProfile from 'components/elements/common/SingleSelectCompanyProfile'
import SingleSelectRCTruck from 'components/elements/common/SingleSelectRCTruck'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import ModalViewDocuments from 'components/elements/common/ModalViewDocuments'
import UpdateTrucksComponent from './UpdateTrucksComponent'
import MultiSelectTruckDriver from 'components/elements/common/MultiSelectTruckDriver'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import MultiSelectRcCode from 'components/elements/common/MultiSelectRcCode'
import MultiSelectWeightCode from 'components/elements/common/MultiSelectWeightCode'
import MultiSelectPalletCode from 'components/elements/common/MultiSelectPalletCode'
import AssetService from 'domain/services/asset-service'
import FileViewUpload from 'components/elements/common/FileViewUpload'
import MultiSelectTruckEngineer from 'components/elements/common/MultiSelectTruckEngineer'
import MultiSelectTruckColor from 'components/elements/common/MultiSelectTruckColor'
import UpdateRentTrucksComponent from './UpdateRentTrucksComponent'
import UpdateVehicleProperty from './UpdateVehicleProperty'
import TruckRc from 'components/pages/erp/Truck/TruckRc'
import {eventBus} from '../../../../main'
import MultiSelectPrinter from 'components/elements/common/MultiSelectPrinter'
import MultiSelectScanningGun from 'components/elements/common/MultiSelectScanningGun'

Vue.use(VeeValidate)
export default {
  name: 'update-trucks',
  components: {
    LaddaBtn,
    Notification,
    Multiselect,
    MultiSelectUser,
    SingleSelectCompanyProfile,
    SingleSelectRCTruck,
    SingleSelectStation,
    UpdateTrucksComponent,
    MultiSelectTruckDriver,
    ModalViewDocuments,
    MultiSelectRcCode,
    MultiSelectWeightCode,
    MultiSelectPalletCode,
    FileViewUpload,
    MultiSelectTruckEngineer,
    MultiSelectTruckColor,
    UpdateRentTrucksComponent,
    UpdateVehicleProperty,
    TruckRc,
    MultiSelectPrinter,
    MultiSelectScanningGun
  },
  data: () => ({
    isMoreInfo: false,
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      totalRow: 0
    },
    viewDoc: {
      trigger: false,
      notFound: false,
      files: [],
      title: 'Chi tiết tài liệu'
    },
    isProcessingUpdate: false,
    truckData: {
      vehicle_type: '',
      automaker: '',
      weight_billing: '',
      weight: '',
      trunk_volume: '',
      registry_number: '',
      vehicle_reg_number: '',
      code: '',
      amount_truck_door: '',
      chassis_number: '',
      engine_number: '',
      buy_date: '',
      last_distance: '',
      rc_code: '',
      lst_rc_codes: [],
      lst_rc_rent_truck: [],
      lease_type: 'wet',
      truckDriver: [],
      documents: [],
      model_car: '',
      vehicle_engineer: null,
      vehicle_color: null,
      rule_order: '',
      rule_weight: '',
      oil_quota: ''
    },
    truckDriverIds: '',
    optionTruck: [
      { value: 'Xe tải', text: 'Xe tải' },
      { value: 'Container', text: 'Container' },
      { value: 'Tàu', text: 'Tàu' }
    ],
    optionTruckLeaseType: [
      { value: 'wet', text: 'Xe ướt' },
      { value: 'dry', text: 'Xe khô' }
    ],
    optionTrucksModelCar: [
      { value: 'K200', text: 'K200' },
      { value: 'FR125', text: 'FR125' },
      { value: 'K190', text: 'K190' },
      { value: 'K149', text: 'K149' },
      { value: 'FVR', text: 'FVR' },
      { value: 'NQR75 E2', text: 'NQR75 E2' },
      { value: 'NQR75 E4', text: 'NQR75 E4' },
      { value: 'QKR55', text: 'QKR55' },
      { value: 'QKR77', text: 'QKR77' },
      { value: 'QMR77 HE4A', text: 'QMR77 HE4A' },
      { value: 'XZU 650L', text: 'XZU 650L' },
      { value: 'XZU 650LN', text: 'XZU 650LN' },
      { value: 'DA21', text: 'DA21' },
      { value: 'F10A', text: 'F10A' },
      { value: 'PORTER 150', text: 'PORTER 150' }
    ],
    truckMakerSelect: null,
    optionTrucksMakers: [
      {
        value: 'THACO',
        text: 'THACO',
        model: [
          { value: 'K200', text: 'K200' },
          { value: 'FR125', text: 'FR125' },
          { value: 'K190', text: 'K190' },
          { value: 'K149', text: 'K149' }
        ]
      },
      {
        value: 'ISUZU',
        text: 'ISUZU',
        model: [
          { value: 'FVR', text: 'FVR' },
          { value: 'NQR75 E2', text: 'NQR75 E2' },
          { value: 'NQR75 E4', text: 'NQR75 E4' },
          { value: 'QKR55', text: 'QKR55' },
          { value: 'QKR77', text: 'QKR77' },
          { value: 'QMR77 HE4A', text: 'QMR77 HE4A' }
        ]
      },
      {
        value: 'HINO',
        text: 'HINO',
        model: [
          { value: 'XZU 650L', text: 'XZU 650L' },
          { value: 'XZU 650LN', text: 'XZU 650LN' }
        ]
      },
      {
        value: 'SUZUKI',
        text: 'SUZUKI',
        model: [
          { value: 'DA21', text: 'DA21' },
          { value: 'F10A', text: 'F10A' }
        ]
      },
      {
        value: 'HYUNDAI',
        text: 'HYUNDAI',
        model: [
          { value: 'PORTER 150', text: 'PORTER 150' }
        ]
      },
      {
        value: null,
        text: 'Khác',
        model: [
          { value: 'K200', text: 'K200' },
          { value: 'FR125', text: 'FR125' },
          { value: 'K190', text: 'K190' },
          { value: 'K149', text: 'K149' },
          { value: 'FVR', text: 'FVR' },
          { value: 'NQR75 E2', text: 'NQR75 E2' },
          { value: 'NQR75 E4', text: 'NQR75 E4' },
          { value: 'QKR55', text: 'QKR55' },
          { value: 'QKR77', text: 'QKR77' },
          { value: 'QMR77 HE4A', text: 'QMR77 HE4A' },
          { value: 'XZU 650L', text: 'XZU 650L' },
          { value: 'XZU 650LN', text: 'XZU 650LN' },
          { value: 'DA21', text: 'DA21' },
          { value: 'F10A', text: 'F10A' },
          { value: 'PORTER 150', text: 'PORTER 150' }
        ]
      }
    ],
    arrTrucksMaker: [
      'THACO',
      'ISUZU',
      'HINO',
      'SUZUKI',
      'HYUNDAI'
    ],
    optionTruckType: [
      { value: 0, text: 'Xe nhà' },
      { value: 1, text: 'Xe thuê' },
      { value: 2, text: 'Xe chành' },
      { value: 3, text: 'Xe đại lý' }
    ],
    optionWeight: [
      { value: '0.5', text: '0.5 Tấn' },
      { value: '1.05', text: '1.05 Tấn' },
      { value: '1.25', text: '1.25 Tấn' },
      { value: '1.9', text: '1.9 Tấn' },
      { value: '2.5', text: '2.5 Tấn' },
      { value: '3.5', text: '3.5 Tấn' },
      { value: '5', text: '5 Tấn' },
      { value: '8', text: '8 Tấn' },
      { value: '15', text: '15 Tấn' }
    ],
    masterProfile: {
      master_id: ''
    },
    truckLastDistance: {
      order: '',
      maintenance_date: '',
      number_distance: ''
    },
    masterInfo: {
      id: ''
    },
    assetCode: {
      code: [],
      lstRcCode: []
    },
    notify: {
      message: '',
      class: '',
      title: '',
      duration: ''
    },
    notify_add_truck: {
      showDismissibleAlert: false,
      message: '',
      type: ''
    },
    allow_edit_level: false,
    toogleLog: false,
    canCustomUserName: false,
    truckMaintenance: {
      list: [],
      maintenanceOptions: [
        {text: 'Lốp', value: 7},
        {text: 'Ắc quy', value: 8},
        {text: 'BD 60,000 km', value: 9},
        {text: 'BD 120,000 km', value: 10},
        {text: 'BD 5,000 km', value: 2},
        {text: 'BD 10,000 km', value: 3},
        {text: 'BD 20,000 km', value: 4},
        {text: 'BD 40,000 km', value: 5},
        {text: 'BD 80,000 km', value: 6},
        {text: 'Khác', value: 1}
      ],
      total: 0,
      page: 1,
      comboMore: {}
    },
    weightCodes: '',
    palletCodes: '',
    strapCode: {
      code: ''
    },
    stId: '',
    optionsRc: [],
    palletOptions: [],
    optionsWeight: [],
    orderTruck: '',
    fileDocuments: [],
    fileAdded: [],
    fileDeleted: [],
    avatar: [],
    editFile: true,
    listIncidents: [],
    filter: {
      truck_id: '',
      start_date: null,
      end_date: null,
      page: 1,
      limit: 10,
      is_search: 0
    },
    curImage: {
      idx: null,
      listImage: []
    },
    dateFilter: null,
    currentPage: 1,
    totalItems: 0,
    perPage: 10,
    comboMore: {},
    isRentInfo: false,
    isPermission: false,
    isViewManagerTruck: false,
    statusProfileTruck: false,
    censorRentTruck: {
      status_profile: null,
      status_paper: null,
      status_security: null,
      status_success: null
    },
    isBKS: false,
    isNCC: false,
    isShowInputModelTruck: false,
    isPermissionWhenNotApproved: false,
    isPermissionEngineer: false,
    bigBoosterCode: {
      code: ''
    },
    smallBoosterCode: {
      code: ''
    },
    lockDoorCode: {
      code: ''
    },
    fireExtinguisherCode: {
      code: ''
    },
    assetCodeTruckRent: '',
    ruleDefault: {
      '0.5': {order: 200, weight: 300},
      '1.25': {order: 700, weight: 900},
      '1.9': {order: 1000, weight: 1350},
      '5': {order: 2800, weight: 3500},
      '8': {order: 3500, weight: 4800},
      '15': {order: 5000, weight: 7500},
      '1.05': {order: 500, weight: 700},
      '2.5': {order: 1500, weight: 1900},
      '3.5': {order: 2200, weight: 2800}
    },
    isRcDuplicate: false,
    arrSelectedValidate: [],
    isReloadRC: false,
    truckAsset: {
      paper_key: '',
      vehicle_outfit: '',
      escape_hammer: '',
      printer: '',
      scanning_gun: '',
      spare_tire: '',
      tires: '',
      battery: '',
      oil_cap: ''
    },
    printerCodes: '',
    optionsPrinter: [],
    scanningCodes: '',
    optionsScanning: [],
    printerId: 75,
    scanningGunId: 77,
    qltsUrlPath: '/adm/truck/add-truck'
  }),

  created () {
    commonHelper.validateStatusEcomTruckFlow(this.qltsUrlPath)

    this.filter.truck_id = this.$route.params.id
    if (this.isAdd) {
      if (this.$route.params.id) {
        this.masterInfo.id = this.$route.params.id
        this.getCompanyProfile()
      }
    } else {
      if (!this.$route.params.id) {
        return
      }

      // load profile to edit
      if (this.$route.params.id) {
        this.getRecordCensor()
        this.getTruckDetail(true)
      }
    }
    this.getAllTruckIncident(this.filter)
    this.checkPermissionManagerTruck()
    this.checkPermission()
    eventBus.$on('reloadRc', this.reloadRc)
  },
  destroyed () {
    eventBus.$off('reloadRc', this.reloadRc)
  },

  computed: {
    isTruck: function () {
      return this.masterInfo.organization_type !== 'Vận tải Đường sắt'
    },
    isAdd: function () {
      return this.$route.name === 'add-vehicle-company'
    },

    isEdit: function () {
      return this.$route.name === 'edit-vehicle-company'
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    },
    getDateInput () {
      return this.truckData.buy_date ? moment(new Date(this.truckData.buy_date)).format('DD/MM/YYYY') : null
    },
    getMaxDate () {
      if (this.isPermissionEngineer) {
        let currentYear = new Date().getFullYear()
        let currentMonth = new Date().getMonth()
        let maxDate = new Date(currentYear, currentMonth - 1, 10)
        return maxDate.toISOString().slice(0, 0)
      } else {
        return new Date()
      }
    }
  },

  watch: {
    '$route.params.id': function () {
      this.getRecordCensor()
      this.getTruckDetail()
      this.checkPermissionManagerTruck()
      this.checkPermission()
    },
    'truckData.truck_type': function (newValue, oldValue) {
      if (+newValue === 0 || this.truckData.lease_type === 'dry') {
        this.isMoreInfo = true
        this.isShowInputModelTruck = false
      } else {
        this.isMoreInfo = false
        this.isShowInputModelTruck = true
      }
      if (+newValue === 1 && this.truckData.lease_type === 'wet') {
        this.isRentInfo = true
        this.isShowInputModelTruck = true
      } else {
        this.isRentInfo = false
        this.isShowInputModelTruck = false
      }
      this.clearValidate()
    },
    'truckData.lease_type': function (newValue, oldValue) {
      if (newValue === 'dry' || +this.truckData.truck_type === 0) {
        this.isMoreInfo = true
        this.isShowInputModelTruck = false
      } else {
        this.isMoreInfo = false
        this.isShowInputModelTruck = true
      }
      if (newValue === 'wet' && +this.truckData.truck_type === 1) {
        this.isRentInfo = true
        this.isShowInputModelTruck = true
      } else {
        this.isRentInfo = false
        this.isShowInputModelTruck = false
      }
      this.clearValidate()
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
    }
  },

  methods: {
    changeWeightBilling () {
      this.getDefaultRuleTruck(this.truckData.weight_billing)
    },
    getDefaultRuleTruck (weightBilling) {
      let defaultOrder = 0
      let defaultWeight = 0
      let defaultRule = this.ruleDefault[weightBilling]
      if (defaultRule) {
        this.truckData.rule_order = defaultRule.order
        this.truckData.rule_weight = defaultRule.weight
      } else {
        this.truckData.rule_order = defaultOrder
        this.truckData.rule_weight = defaultWeight
      }
    },
    clearValidate () {
      this.$validator.pause()
      this.$nextTick(() => {
        this.$validator.errors.clear()
        this.$validator.fields.items.forEach(field => field.reset())
        this.$validator.fields.items.forEach(field => this.errors.remove(field))
        this.$validator.resume()
      })
    },
    onChangeTruckMaker (val) {
      let automaker = val
      if (!this.arrTrucksMaker.includes(val)) {
        automaker = null
      }
      this.optionTrucksModelCar = this.optionTrucksMakers.find(item => item.value === automaker).model
      this.truckData.automaker = val
    },
    convertInt (val) {
      return val ? Math.abs(parseInt(val)) : 0
    },
    pageChanged (page) { // Event check pagination change
      this.getTruckMaintenanceInfo(page)
      this.pageData.current = page
    },
    convertMoney (money) {
      return commonHelper.formatMoney(money)
    },
    removeMaintenance (maintenanceId) {
      if (!confirm('Chắc chắc muốn xóa phiếu bảo dưỡng này?')) return
      this.$startLoading()
      CompanyProfileService.removeTruckMaintenance({id: maintenanceId}).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.getTruckDetail(false)
          this.getTruckMaintenanceInfo(this.pageData.current)
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).catch(e => {
        console.error(e)
      }).then(() => {
        this.$stopLoading()
      })
    },
    showMaintenanceDoc (maintenanceId) {
      this.viewDoc.files = []
      this.viewDoc.trigger = !this.viewDoc.trigger
      this.viewDoc.notFound = false
      this.$startLoading()
      CompanyProfileService.getTruckMaintenanceDocuments({id: maintenanceId}).then(response => {
        if (response.data.success) {
          this.viewDoc.files = response.data.data.documents || []
          this.viewDoc.notFound = true
        }
      }).catch(e => {
        console.error(e)
      }).then(() => {
        this.$stopLoading()
      })
    },
    updateOk () {
      this.checkPermissionManagerTruck()
      this.checkPermission()
      this.getTruckDetail()
    },
    handleSelectedStation (option) {
      if (this.isMoreInfo) {
        this.truckData.station_id = option ? option.id : null
        this.stId = this.truckData.station_id
        this.getIdentifierCodes(this.stId)
        this.getPalletCodes(this.stId)
        this.getWeightCodes(this.stId)
        this.getPrinterCodes(this.stId)
        this.getScanningCodes(this.stId)
      }
    },
    handleChooseRcCodeTruckRent (optionRc) {
      if (typeof optionRc !== 'undefined') {
        this.assetCodeTruckRent = optionRc
      }
    },
    onChangeVolume ($event) {
      switch (parseInt($event)) {
        case 9:
          this.truckData.weight_billing = 1.25
          break
        case 13:
          this.truckData.weight_billing = 1.9
          break
        case 20:
          this.truckData.weight_billing = 3.5
          break
        case 26:
          this.truckData.weight_billing = 5
          break
        case 44:
          this.truckData.weight_billing = 8
          break
      }
      if (parseInt($event) >= 55 && parseInt($event) <= 60) this.truckData.weight_billing = 15
    },
    showNotification (success) {
      let classNotify = 'bg-success text-white'
      if (!success) {
        classNotify = 'bg-warning text-dark'
      }
      this.$notify({
        group: 'add-truck',
        title: this.notify.title,
        text: this.notify.message,
        type: classNotify,
        duration: this.notify.duration
      })
    },
    updateVehicle () {
      let validate = null
      let isCreated = true
      let dataS = new FormData()
      if (!this.fileAdded) {
        commonHelper.showMessage('Vui lòng chọn file để upload !')
        this.$stopLoading()
        return
      }
      if (!this.truckData.model_car) {
        commonHelper.showMessage('Vui lòng chọn model xe!')
        this.$stopLoading()
        return
      }
      if ((this.fileAdded.length + this.fileDocuments.length - this.fileDeleted.length) > 1) return commonHelper.showMessage('Không được up quá 1 ảnh', 'warn')

      if (+this.truckData.truck_type === 0 || this.truckData.lease_type === 'dry') {
        validate = ['truck_type', 'vehicle_type', 'automaker', 'code', 'trunk_volume', 'weight', 'weight_billing',
          'chassis_number', 'engine_number', 'strap_code', 'big_booster_code', 'small_booster_code', 'lock_door_code', 'fire_extinguisher_code', 'rule_order', 'rule_weight', 'oil_quota',
          'paper_key', 'vehicle_outfit', 'escape_hammer', 'spare_tire', 'tires', 'oil_cap', 'battery']
      } else {
        validate = ['truck_type', 'vehicle_type', 'automaker', 'code', 'trunk_volume', 'weight', 'weight_billing', 'registry_number', 'vehicle_reg_number', 'strap_code',
          'vehicle_color', 'model_car', 'rule_order', 'rule_weight', 'oil_quota']
      }
      this.truckData.trunk_volume = +this.truckData.trunk_volume
      this.$validator.validateAll(validate).then((result) => {
        if (result) {
          let dataSend = {
            'company_id': this.masterInfo.id,
            'rc_code': this.isMoreInfo ? this.assetCode.code : this.assetCodeTruckRent,
            'lst_rc_codes': this.isMoreInfo ? this.lst_rc_codes : this.lst_rc_rent_truck,
            'weight_billing': this.truckData.weight_billing,
            'weight': this.truckData.weight,
            'automaker': this.truckData.automaker,
            'vehicle_type': this.truckData.vehicle_type,
            'trunk_volume': this.truckData.trunk_volume,
            'vehicle_reg_number': this.truckData.vehicle_reg_number,
            'registry_number': this.truckData.registry_number,
            'code': this.truckData.code,
            'amount_truck_door': this.truckData.amount_truck_door,
            'truck_type': this.truckData.truck_type,
            'station_id': this.truckData.station_id,
            'assignee': +this.truckData.truck_type === 0 ? this.truckData.truckDriver : null,
            'old_assignee': this.truckDriverIds,
            'lease_type': this.truckData.lease_type,
            'weight_code': this.weightCodes,
            'pallet_code': this.palletCodes,
            'strap_code': this.strapCode.code || '',
            'big_booster_code': this.bigBoosterCode.code || '',
            'small_booster_code': this.smallBoosterCode.code || '',
            'lock_door_code': this.lockDoorCode.code || '',
            'fire_extinguisher_code': this.fireExtinguisherCode.code || '',
            'model_car': this.truckData.model_car || '',
            'engineer_id': this.truckData.vehicle_engineer ? this.truckData.vehicle_engineer : null,
            'color': this.truckData.vehicle_color ? this.truckData.vehicle_color : null,
            'rule_order': this.truckData.rule_order || '',
            'rule_weight': this.truckData.rule_weight || '',
            'oil_quota': this.truckData.oil_quota ? this.truckData.oil_quota : '',
            'printer_code': this.printerCodes,
            'scanning_code': this.scanningCodes,
            'paper_key': this.truckAsset.paper_key || '',
            'vehicle_outfit': this.truckAsset.vehicle_outfit || '',
            'escape_hammer': this.truckAsset.escape_hammer || '',
            'oil_cap': this.truckAsset.oil_cap || '',
            'spare_tire': this.truckAsset.spare_tire || '',
            'tires': this.truckAsset.tires || '',
            'battery': this.truckAsset.battery || ''
          }
          if (this.isMoreInfo) {
            dataSend.chassis_number = this.truckData.chassis_number
            dataSend.engine_number = this.truckData.engine_number
            dataSend.buy_date = this.truckData.buy_date ? moment(new Date(this.truckData.buy_date)).format('YYYY-MM-DD') : null
          }
          if (this.isEdit) {
            let truckId = this.$route.params.id
            isCreated = false
            dataSend.id = truckId
            if (parseInt(dataSend.truck_type) !== 1) {
              delete dataSend.company_id
            }
          }
          if (parseInt(dataSend.truck_type) !== 1) {
            delete dataSend.company_id
          }
          if ((parseInt(dataSend.truck_type) === 0) && dataSend.model_car === '') return commonHelper.showMessage('Thiếu thông tin model xe', 'warn')
          if (this.fileAdded.length) {
            for (let i = 0; i < this.fileAdded.length; i++) {
              dataS.append('file[' + i + ']', this.fileAdded[i])
            }
          }
          if (this.fileDeleted.length) dataS.append('deleteDocs', JSON.stringify(this.fileDeleted))

          // Check trung xe RC khi cập nhật thông tin xe
          let counts = {}
          this.arrSelectedValidate.forEach((element, idx) => {
            this.isRcDuplicate = false
            let key = this.arrSelectedValidate[idx]
            counts[key] = (counts[key]) ? counts[key] + 1 : 1
            if (counts[key] > 1) {
              this.isRcDuplicate = true
              commonHelper.showMessage('Mã RC ' + key + ' đã được gán cho xe. Vui lòng kiểm tra lại', 'warn')
              this.$stopLoading()
              return 0
            }
          })

          if (!this.isRcDuplicate) {
            dataS.append('id', dataSend.id || '')
            dataS.append('company_id', dataSend.company_id || '')
            dataS.append('rc_code', dataSend.rc_code || '')
            dataS.append('lst_rc_codes', dataSend.lst_rc_codes || '')
            dataS.append('weight_billing', dataSend.weight_billing || '')
            dataS.append('weight', dataSend.weight || '')
            dataS.append('automaker', dataSend.automaker || '')
            dataS.append('vehicle_type', dataSend.vehicle_type || '')
            dataS.append('trunk_volume', dataSend.trunk_volume || '')
            dataS.append('vehicle_reg_number', dataSend.vehicle_reg_number || '')
            dataS.append('registry_number', dataSend.registry_number || '')
            dataS.append('code', dataSend.code || '')
            dataS.append('amount_truck_door', dataSend.amount_truck_door || '')
            dataS.append('truck_type', this.truckData.truck_type)
            dataS.append('station_id', dataSend.station_id || '')
            dataS.append('assignee', JSON.stringify(dataSend.assignee))
            dataS.append('old_assignee', dataSend.old_assignee)
            dataS.append('lease_type', dataSend.lease_type || '')
            dataS.append('weight_code', dataSend.weight_code || '')
            dataS.append('pallet_code', dataSend.pallet_code || '')
            dataS.append('strap_code', dataSend.strap_code || '')
            dataS.append('big_booster_code', dataSend.big_booster_code || '')
            dataS.append('small_booster_code', dataSend.small_booster_code || '')
            dataS.append('lock_door_code', dataSend.lock_door_code || '')
            dataS.append('fire_extinguisher_code', dataSend.fire_extinguisher_code || '')
            dataS.append('model_car', dataSend.model_car || '')
            dataS.append('engineer_id', dataSend.engineer_id || null)
            dataS.append('color', dataSend.color || '')
            dataS.append('is_not_check_engineer', this.isShowInputModelTruck ? 1 : 0)
            dataS.append('chassis_number', dataSend.chassis_number || '')
            dataS.append('engine_number', dataSend.engine_number || '')
            dataS.append('buy_date', dataSend.buy_date || '')
            dataS.append('rule_order', dataSend.rule_order || '')
            dataS.append('rule_weight', dataSend.rule_weight || '')
            dataS.append('oil_quota', dataSend.oil_quota || '')
            dataS.append('printer_code', dataSend.printer_code || '')
            dataS.append('scanning_code', dataSend.scanning_code || '')
            dataS.append('paper_key', dataSend.paper_key)
            dataS.append('vehicle_outfit', dataSend.vehicle_outfit)
            dataS.append('escape_hammer', dataSend.escape_hammer)
            dataS.append('oil_cap', dataSend.oil_cap)
            dataS.append('spare_tire', dataSend.spare_tire)
            dataS.append('tires', dataSend.tires)
            dataS.append('battery', dataSend.battery)

            this.isProcessingUpdate = true
            CompanyProfileService.updateVehicle(dataS).then(response => {
              this.fileDeleted = []
              if (response.data.hasOwnProperty('success')) {
                if (response.data.success) {
                  this.fileAdded = []
                  let id = response.data.data.Truck.id
                  this.truckDriverIds = this.truckData.truckDriver
                  this.fileDocuments = response.data.data.avatars
                  commonHelper.showMessage(response.data.message, 'success')
                  this.isReloadRC = true
                  this.updateTruckDriverValue()
                  this.getTruckDetail(isCreated)
                  this.$router.push({name: 'edit-vehicle-company', params: {id: id}})
                } else {
                  commonHelper.showMessage(response.data.message, 'warn')
                }
              } else {
                this.notify.success = false
              }
            }).catch(e => {
              this.notify.success = false
              this.notify.message = 'Có lỗi xảy ra, liên hệ IT để được hỗ trợ'
              this.showNotification(false)
            }).then(() => {
              this.isProcessingUpdate = false
            })
          }
        } else {
          this.isProcessingUpdate = false
          this.notify.success = false
          this.notify.message = 'Vui lòng kiểm tra thông tin yêu cầu'
          this.showNotification(false)
        }
      }).catch(e => {
        commonHelper.showMessage('Có lỗi xảy ra', 'warn')
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },

    handleChooseProfileCompany (option) {
      this.masterInfo.id = option ? option.id : ''
      if (typeof option !== 'undefined') {
        this.getCompanyProfile(option.id)
      }
    },

    /* handleChooseRcCodeList (option) {
      this.assetCode.code = option ? option.code : ''
    }, */

    getCompanyProfile () {
      let dataSend = {
        'master_id': this.masterInfo.id
      }
      CompanyProfileService.getCompanyProfile(dataSend).then((response) => {
        if (response.data.success) {
          this.masterInfo = response.data.data.detail
        }
      })
    },
    addOptionMaker () {
      let automaker = this.truckData.automaker
      // Nếu hãng xe không có trong các hãng định nghĩa thì gán automaker null -> để lấy ra danh sách model của hãng xe khác các hãng định nghĩa
      if (!this.arrTrucksMaker.includes(this.truckData.automaker)) {
        automaker = null
      }
      let existed = this.optionTrucksMakers.find(e => e.value === automaker)
      if (!existed && this.truckData.automaker) {
        this.optionTrucksMakers.unshift({value: this.truckData.automaker, text: this.truckData.automaker})
      }

      // Nếu hãng xe có trong các hãng định nghĩa thì truckMakerSelect gán bằng this.truckData.automaker
      this.truckMakerSelect = (this.arrTrucksMaker.includes(this.truckData.automaker) ? this.truckData.automaker : null) || null
    },
    getTruckDetail (isCreated = false) {
      let dataRequest = {
        truck_id: this.$route.params.id
      }
      CompanyProfileService.getTruckDetail(dataRequest).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let info = response.data.data
            this.masterInfo = info.OrganizationProfile
            this.truckData = info.Truck
            let automaker = info.Truck.automaker
            if (!this.arrTrucksMaker.includes(info.Truck.automaker)) {
              automaker = null
            }
            this.optionTrucksModelCar = this.optionTrucksMakers.find(item => item.value === automaker).model
            this.truckData.vehicle_engineer = info.Truck.engineer_id
            if (info.Truck.color) {
              this.truckData.vehicle_color = info.Truck.color
              if (info.Truck.color === 'Trắng') this.truckData.vehicle_color = '1'
              if (info.Truck.color === 'Xanh lá cây') this.truckData.vehicle_color = '2'
            } else {
              this.truckData.vehicle_color = null
            }
            this.truckDriverIds = this.truckData.truckDriver
            this.truckData.truckDriver = []
            this.orderTruck = info.Truck.order
            this.assetCode.code = response.data.assets.rcCode ? response.data.assets.rcCode.toString() : ''
            this.assetCode.lstRcCode = response.data.assets.lstRcCode ? response.data.assets.lstRcCode : []
            this.assetCodeTruckRent = response.data.assets.rcCode ? response.data.assets.rcCode.toString() : ''
            this.weightCodes = response.data.assets.weightCode ? response.data.assets.weightCode.toString() : ''
            this.palletCodes = response.data.assets.palletCode || []
            this.strapCode.code = response.data.assets.strapCode ? response.data.assets.strapCode.toString() : ''
            this.bigBoosterCode.code = response.data.assets.bigBoosterCode ? response.data.assets.bigBoosterCode.toString() : ''
            this.smallBoosterCode.code = response.data.assets.smallBoosterCode ? response.data.assets.smallBoosterCode.toString() : ''
            this.lockDoorCode.code = response.data.assets.lockDoorCode ? response.data.assets.lockDoorCode.toString() : ''
            this.fireExtinguisherCode.code = response.data.assets.fireExtinguisherCode ? response.data.assets.fireExtinguisherCode.toString() : ''
            this.printerCodes = response.data.assets.printerCode ? response.data.assets.printerCode.toString() : ''
            this.scanningCodes = response.data.assets.scanningCode ? response.data.assets.scanningCode.toString() : ''
            this.truckAsset.paper_key = response.data.assets.paperKey ? response.data.assets.paperKey.toString() : ''
            this.truckAsset.vehicle_outfit = response.data.assets.vehicleOutfit ? response.data.assets.vehicleOutfit.toString() : ''
            this.truckAsset.escape_hammer = response.data.assets.escapeHammer ? response.data.assets.escapeHammer.toString() : ''
            this.truckAsset.oil_cap = response.data.assets.oilCap ? response.data.assets.oilCap.toString() : ''
            this.truckAsset.spare_tire = response.data.assets.spareTire ? response.data.assets.spareTire.toString() : ''
            this.truckAsset.tires = response.data.assets.tires ? response.data.assets.tires.toString() : ''
            this.truckAsset.battery = response.data.assets.battery ? response.data.assets.battery.toString() : ''
            this.truckLastDistance = info.TruckMaintenance
            if (this.truckData.buy_date) this.truckData.buy_date = new Date(this.truckData.buy_date)
            this.truckData.trunk_volume = +this.truckData.trunk_volume
            this.addOptionMaker()
            if (!+this.truckData.truck_type ||
              (+this.truckData.truck_type && this.truckData.lease_type === 'dry')) {
              this.isMoreInfo = true
            } else {
              this.isMoreInfo = false
            }
            if (+this.truckData.truck_type && this.truckData.lease_type === 'wet') {
              this.isRentInfo = true
            } else {
              this.isRentInfo = false
            }
            if (isCreated && this.isMoreInfo) {
              // get mantaince info
              this.getTruckMaintenanceInfo()
            }
            this.fileDocuments = info.avatars

            if (this.truckData.avatar != null) {
              this.avatar = this.truckData.avatar.split(',').map(s => s.trim())
              var links = []
              this.avatar.map(function (item, i) {
                links.push({link: item})
              })
              this.files = links
            }
          } else {
            this.notify.success = false
            this.notify.message = response.data.message
            this.showNotification(false)
          }
        } else {
          this.notify.message = 'Có lỗi xảy ra, không load được thông tin tài khoản'
          this.showNotification(false)
          // this.$router.push({ name: 'manager-master-profile' })
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },

    getTruckMaintenanceInfo (page = 1) {
      let dataRequest = {
        truck_id: this.$route.params.id,
        page
      }
      CompanyProfileService.getTruckMaintenanceInfo(dataRequest).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let info = response.data.data
            this.pageData = info.pagination

            // this.pageData.totalItems = response.data.pagination.count
            // this.pageData.perPage = response.data.pagination.limit
            // this.pageData.totalPages = response.data.pagination.pageCount
            // this.pageData.totalRow = response.data.pagination.totalRow
            // this.pageData.current = response.data.pagination.current

            this.truckMaintenance.list = []
            info.data && info.data.forEach(element => {
              this.truckMaintenance.list.push({...element, typeText: this.truckMaintenance.maintenanceOptions.find(e => +element.type === e.value)})
            })
          } else {
            this.notify.success = false
            this.notify.message = response.data.message
            this.showNotification(false)
          }
        } else {
          this.notify.message = 'Có lỗi xảy ra, không load được thông tin tài khoản'
          this.showNotification(false)
          // this.$router.push({ name: 'manager-master-profile' })
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },

    checkEmptyObject: function (obj) {
      return obj !== null && obj !== ''
    },

    handleSelectedDriverOption (option) {
      this.truckData.truckDriver = option
    },

    updateTruckDriverValue () {
      this.truckDriverIds = ''
      if (this.truckData.truckDriver) {
        this.truckData.truckDriver.forEach((element) => {
          this.truckDriverIds += `${element.id},`
        })
      }
    },

    handleChooseRcCode (optionRc) {
      this.assetCode.code = optionRc ? optionRc.name : ''
    },

    handleChooseWeightCode (optionWeight) {
      this.weightCodes = optionWeight ? optionWeight.name : ''
    },

    handleChoosePrinterCode (option) {
      this.printerCodes = option ? option.name : ''
    },

    handleChooseScanningCode (option) {
      this.scanningCodes = option ? option.name : ''
    },

    getIdentifierCodes (stationId) {
      let params = {
        order: this.orderTruck || '',
        asset_id: 1089,
        station_id: stationId || '',
        count: 0
      }
      AssetService.getIdentifierCode(params)
        .then(res => {
          if (res.data.success) {
            this.optionsRc = res.data.data
          } else {
            this.optionsRc = ''
          }
        }).catch((e) => {
          console.log(e)
        })
    },

    getPalletCodes (stationId) {
      let params = {
        order: this.orderTruck || '',
        asset_id: 225,
        station_id: stationId || '',
        count: 0
      }
      AssetService.getIdentifierCode(params)
        .then(res => {
          if (res.data.success) {
            this.palletOptions = res.data.data
          }
        }).catch((e) => {
          console.log(e)
        })
    },

    getWeightCodes (stationId) {
      let params = {
        order: this.orderTruck || '',
        asset_id: 456,
        station_id: stationId || '',
        count: 0
      }
      AssetService.getIdentifierCode(params)
        .then(res => {
          if (res.data.success) {
            this.optionsWeight = res.data.data
          }
        }).catch((e) => {
          console.log(e)
        })
    },
    getPrinterCodes (stationId) {
      let params = {
        order: this.orderTruck || '',
        asset_id: this.printerId,
        station_id: stationId || '',
        count: 0
      }
      AssetService.getIdentifierCode(params)
        .then(res => {
          if (res.data.success) {
            this.optionsPrinter = res.data.data
          }
        }).catch((e) => {
          console.log(e)
        })
    },
    getScanningCodes (stationId) {
      let params = {
        order: this.orderTruck || '',
        asset_id: this.scanningGunId,
        station_id: stationId || '',
        count: 0
      }
      AssetService.getIdentifierCode(params)
        .then(res => {
          if (res.data.success) {
            this.optionsScanning = res.data.data
          }
        }).catch((e) => {
          console.log(e)
        })
    },
    openLink (linkFile) {
      if (linkFile) {
        window.open(linkFile, '_blank')
      } else {
        commonHelper.showMessage('Chưa có tài liệu', 'warn')
      }
    },
    formatNames (files) {
      if (files) return `${files.length} files selected`
      return ''
    },
    getUrl (file) {
      return URL.createObjectURL(file)
    },
    getFileType (file) {
      if (!file) return null
      let ext = ''
      if (typeof file === 'string') { // là link
        ext = file.split('?').shift().split('.').pop().toLowerCase()
      } else ext = file.name.split('.').pop().toLowerCase() // là File

      if (file.indexOf('image') === 0) {
        if (['image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/svg'].includes(ext)) return 'image'// là ảnh
      }

      if (['jpeg', 'png', 'gif', 'tiff', 'psd', 'jpg', 'eps', 'ai', 'indd', 'raw', 'bmp', 'svg'].includes(ext)) return 'image'// là ảnh
      if (['pdf'].includes(ext)) return 'pdf' // là pdf
      if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) return 'doc' // là doc
      if (['xls', 'xlsx', 'xlsb'].includes(ext)) return 'excel' // là excel
      if (['txt', 'csv'].includes(ext)) return 'text' // là text
      if (['mpeg', 'mp4', 'avi', 'ts', 'webm', '3gp', '3g2'].includes(ext)) return 'video' // là video
      if (['mp3', 'aac', 'ogg', 'opus', 'wav'].includes(ext)) return 'audio' // là audio
      if (['zip', 'rar', '7z', 'tar'].includes(ext)) return 'zip' // là file nén
      return 'other'
    },
    deleteFile (event, indexFile, uploaded) {
      if (uploaded) {
        if (event.target.classList.contains('ion-md-close-circle')) {
          this.fileDeleted.push(this.fileDocuments[indexFile].id)
          event.target.setAttribute('title', 'Lấy lại')
          this.fileDocuments[indexFile] = []
        } else {
          let index = this.fileDeleted.indexOf(this.fileDocuments[indexFile].id)
          if (index >= 0) {
            this.fileDeleted.splice(index, 1)
            event.target.setAttribute('title', 'Xóa')
            this.fileDocuments[index] = []
          }
        }
        event.target.classList.toggle('ion-md-close-circle')
        event.target.classList.toggle('ion-md-refresh-circle')
        event.target.nextElementSibling.classList.toggle('file-deleted')
      } else {
        this.fileAdded.splice(indexFile, 1)
      }
    },
    searchTruckIncident (resetStatus = null) {
      this.currentPage = 1
      this.filter.is_search = 1
      this.getAllTruckIncident(this.filter)
    },
    getAllTruckIncident (reqParams) {
      reqParams.page = this.currentPage
      reqParams.limit = this.perPage
      if (this.filter.start_date) reqParams.start_date = this.filter.start_date
      if (this.filter.end_date) reqParams.end_date = this.filter.end_date
      this.$startLoading()
      CompanyProfileService.getAllTruckIncident(reqParams)
        .then(res => {
          if (res.data.success) {
            this.listIncidents = []
            this.totalItems = 0
            this.listIncidents = res.data.data
            this.totalItems = res.data.count
          } else {
            this.listIncidents = []
            this.totalItems = 0
            if (this.filter.is_search === 1) {
              commonHelper.showMessage('Không có sự vụ xe tải nào được tìm thấy', 'warn')
            }
          }
        })
        .catch(e => {
          commonHelper.showMessage('Có lỗi xảy ra hoặc bạn không có quyền thao tác', 'warn')
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },
    checkLevelDamage: function (val) {
      if (val === 'light') {
        return 'Nhẹ'
      }
      if (val === 'relatively') {
        return 'Tương đối'
      }
      if (val === 'heavy') {
        return 'Nặng'
      }
    },
    checkStatusRepair: function (val) {
      if (val === 'fixed') {
        return 'Đã sửa xong'
      }
      if (val === 'repairing') {
        return 'Đang sửa chữa'
      }
    },
    deleteTruckIncident: function (incident) {
      if (!confirm(`Bạn có chắc chắn muốn xóa sự vụ xe tải này ?`)) {
        return
      }
      let dataSend = {
        'incidentId': incident.id
      }
      CompanyProfileService.deleteTruckIncident(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.getAllTruckIncident(this.filter)
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình dừng hoạt động của xe.'
          })
        })
        .finally(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },
    reset: function () {
      this.dateFilter = null
      Object.keys(this.filter).forEach(key => {
        this.filter[key] = null
      })
      this.searchTruckIncident(this.filter)
    },
    onViewImage (item, index) {
      if (item.image !== null || item.image !== 'undefined') {
        this.curImage.idx = index
        this.curImage.listImage = item.image.split(',')
        this.$refs['image-incident-modal'].show()
      }
    },
    formatDate (date, format = 'YYYY-MM-DD') {
      return commonHelper.formatDate(date, format)
    },
    countComboMaintenance (combos) {
      return combos.length
    },
    showMoreCombo (index) {
      this.$set(this.truckMaintenance.comboMore, index, 1)
    },
    showMoreLess (index) {
      this.$set(this.truckMaintenance.comboMore, index, 0)
    },
    handleChooseEngineer (option) {
      if (option !== null) {
        this.truckData.vehicle_engineer = option.value
      } else {
        this.truckData.vehicle_engineer = null
      }
    },
    handleChooseTruckColor (option) {
      if (option !== null && option !== undefined) {
        this.truckData.vehicle_color = option.value
      } else {
        this.truckData.vehicle_color = null
      }
    },
    saveCensor (target) {
      this.$startLoading()
      let dataSend = []
      dataSend.push(
        {
          truck_id: this.$route.params.id,
          target: target
        }
      )
      CompanyProfileService.saveCensorTruck(dataSend)
        .then((response) => {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, 'success')
            if (response.data.data.company_id) {
              this.$router.push('/profile-company/master-company/edit/' + response.data.data.company_id)
            }
            this.getRecordCensor()
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          commonHelper.showMessage('Có lỗi xảy ra trong quá trình lưu thông tin kiểm duyệt!', 'warning')
        })
        .then(() => {
          this.$stopLoading()
        })
    },
    checkPermissionManagerTruck () {
      let params = {companyId: this.masterInfo.id}
      CompanyProfileService.checkPermissionManagerTruck(params)
        .then(res => {
          if (res.data.success) {
            this.isPermission = res.data.success
          }
          if (res.data.isViewManagerTruck) {
            this.isViewManagerTruck = true
          }
        })
        .catch(err => {
          console.log('Has error in check User Exception ', err)
        })
    },
    getRecordCensor () {
      this.$startLoading()
      CompanyProfileService.getRecordCensor({truck_id: this.$route.params.id})
        .then((response) => {
          if (response.data.success) {
            let censorData = response.data.data
            this.censorRentTruck.status_profile = censorData.status_profile ? censorData.status_profile : ''
            this.censorRentTruck.status_paper = censorData.status_paper ? censorData.status_paper : ''
            this.censorRentTruck.status_security = censorData.status_security ? censorData.status_security : ''
            this.censorRentTruck.status_success = censorData.status_success ? censorData.status_success : ''
            commonHelper.showMessage(response.data.message, 'success')
          }
        })
        .catch(e => {
          console.log(e)
          commonHelper.showMessage('Có lỗi xảy ra trong quá trình lưu thông tin kiểm duyệt!', 'warning')
        })
        .then(() => {
          this.$stopLoading()
        })
    },
    checkPermission () {
      let params = {provider_id: this.masterInfo.id}
      CompanyProfileService.checkPermission(params)
        .then(res => {
          // Quyền duyệt, cập nhật thông tin xe cả khi xe chưa duyệt v đã duyệt - BKS
          if (res.data.isPermissionRentTruck) {
            this.isBKS = true
          }
          // Quyền Cập nhật thông tin - nếu NCC, hoặc các position chỉ có quyền cập nhật khi chưa click nút Duyệt thì được phép cập nhật thông tin
          if (res.data.isNCC || res.data.isPermissionWhenNotApproved) {
            this.isPermissionWhenNotApproved = true
          }
          // Quyền kỹ thuật xe tải
          if (res.data.isPermissionEngineer) {
            this.isPermissionEngineer = true
          }
        })
        .catch(err => {
          console.log('Has error in check permission rent truck', err)
        })
    },
    updateRc (data) {
      const {arrSelectedValidate} = data
      this.lst_rc_codes = arrSelectedValidate
      this.arrSelectedValidate = arrSelectedValidate
    },
    updateRcTruckRent (data) {
      const {arrSelectedValidate} = data
      this.lst_rc_rent_truck = arrSelectedValidate
      this.arrSelectedValidate = arrSelectedValidate
    },
    reloadRc () {
      this.isReloadRC = true
      this.getTruckDetail(false)
    }
  }
}
</script>
<style>
  .dv-date-incident input, .dv-date-incident .vc-text-base {
    height: 28px !important;
    width: 25%;
  }
  .dv-date-incident button {
    height: 28px !important;
  }
</style>
<style scoped>
.card-body {
  padding: 12px;
}
.is-danger {
  border-color: #E0B4B4;
  color: #9F3A38;
  box-shadow: none;
}
.img-bounder {
  position: relative;
  display: inline-block;
}
.img-bounder:hover > .btn-disable-file {
  display: inline;
}
.file-deleted {
  opacity: 0.1;
}
.btn-disable-file {
  font-size: 20px;
  display: none;
  position: absolute;
  top: -10px;
  right: 6px;
}
.dragdrop {
  font-size: 70px;
  position: relative;
  width: 8rem;
}
.dragdrop >>> .custom-file-label {
  border: 2px dashed #b8b9bb !important;
  height: 143px;
  line-height: 128px;
  text-align: center;
  color: green;
  padding: 0;
  margin-top: 0.5rem;
}

.dragdrop .custom-file:hover >>> .custom-file-label {
  background: rgb(15, 182, 79);
  color: #fff;
}

.dragdrop >>> .custom-file-label::after {
  display: none;
}
.dv-action, .dv-action a {color: #26b4ff !important; cursor: pointer;}
.fs-avatar-txt {
  position: absolute;
  z-index: 999;
  top: 101px;
  font-size: 14px;
  text-align: center;
  left: 0;
  right: 0;
}
@media (max-width: 768px) {
  .fs-avatar {
    margin-bottom: 75px;
  }
}
.btn-success-all {
  padding: 9px 17px;
  background-color: white;
  border-radius: 8px;
  color: #219653;
  border-color: #219653;
}
.btn-success-all:hover {
  background-color: #219653;
  color: white;
  border-color: #219653;
}
button.ladda-button {
  min-width: 112px;
}
button.btn.btn-success-all.ladda-button {
  min-width: 138px;
  text-align: center;
}
.delete-asset-code {
  background-color: #069255;
  padding: 5px 0;
  width: 173px;
  height: 40px;
  font-size: 16px;
}
.pick-up {
  color: #ffffff !important;
  background-color: #219653 !important;
}
.item-reason {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 8px;
  gap: 10px;
  height: 29px;
  border: 1px solid #219653;
  border-radius: 100px;
  flex: none;
  order: 0;
  flex-grow: 0;
  color: #219653;
  margin-right: 10px;
}
</style>
