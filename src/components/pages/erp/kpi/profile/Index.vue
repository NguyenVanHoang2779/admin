<template>
  <body style="background-color: #EEEEEE; font-family:Roboto; font-size: 16px;">
    <div class="container-profile" id="container-profile" style="min-height: 900px;">
      <b-row style="background-color: #00904A; margin-right: 0px; margin-left: 0px;">
        <b-col style="margin-top: 20px; margin-bottom: 20px;">
          <p class="header-text">
          </p>
        </b-col>
        <b-col style="display: flex; align-items: center; text-align: center; margin-top: 20px; margin-bottom: 20px;" cols="11">
          <p class="header-text">
            THÔNG TIN NHÂN VIÊN
          </p>
        </b-col>
        <b-col style="margin-top: 20px; margin-bottom: 20px; text-align: right">
          <p class="header-text btn" @click="reload()">
            <i class="ion ion-md-sync"></i>
          </p>
        </b-col>
      </b-row>
      <b-row style=" margin-right: 0px; margin-left: 0px; width: 100%;" >
        <div style="width: 100%; display: flex;">
        <div style="margin-left: 15px;">
          <b-row>
            <div style="display: flex; align-items: center"> <img :src="infoProfile.ErpMasterProfile.image_profile" alt="Avatar" class="avatar">
              <div style="margin: 15px;">
                <b-row style="display: flex; align-items: center">
                  <p style="margin-top: 0.25rem;margin-bottom: 0.25rem" ><b> {{ infoProfile.ErpCod.alias }} | {{ infoProfile.ErpMasterProfile.fullname }} </b> </p>
                  <span class="dot" :style="dotStyle"></span></b-row>
                <b-row><p style="margin-top: 0.25rem;margin-bottom: 0.25rem" > <i style="color: #14a05b;" class="ion ion-ios-call"></i> {{ infoProfile.ErpMasterProfile.tel }}</p></b-row>
                <b-row><p style="margin-top: 0.25rem;margin-bottom: 0.25rem" > <i style="color: #14a05b;" class="ion ion-ios-briefcase"></i> {{ infoProfile.ErpEmpPosition.position_name }} |<span v-if="dataHeaderDriver.truck_code !== ''"> {{dataHeaderDriver.truck_code}} | </span> {{ infoProfile.ErpStation.name }}</p></b-row>
              </div>
            </div>
          </b-row>
          <b-row>
            <ul>
              <li>Hợp đồng: {{infoProfile.ErpEmpContract.name}} | Thâm niên: {{seniority}} tháng</li>
              <li><span>Cập nhật hồ sơ: {{document_percent}}% </span><span v-if="document_percent !== '100'"> | Thiếu: {{document_incomplete}}</span></li>
              <li>Tiến độ học tập: {{training_percent}}%</li>
              <li style="display: flex">Chuyên cần:<div style="display: block; margin-left: 10px; margin-right: 10px;"><p v-for="(data, index) in diligence" style="margin-bottom: 0px; width: 200px;" v-if="trigger_diligence || index === 0"> {{data[0]}} - Nghỉ không phép: {{data[1]['num_leave_without_salary']}}</p></div>
                <i style="color: #14a05b;margin-top: 3px;" :class="class_button_diligence" @click="trigger_diligence = !trigger_diligence"></i></li>
              <li v-if="strReceived !== '' || strNotReceived !== ''">Cấp phát: <span v-if="strReceived !== ''">Đã cấp: {{strReceived}}</span><span v-if="strNotReceived !== ''"> | Xin cấp: {{strNotReceived}}</span></li>
            </ul>
          </b-row>
        </div>
        <div style="margin-right: 25px; margin-left: auto; order: 2;" v-if="show_kpi">
          <b-row class="display-center">
            <div class="box-chat btn" name="user-profile-btn-review" id="user-profile-btn-review" @click="trigger_review ++" >
              <svg width="32" height="32" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-5283114c="">
                <path d="M17.6001 9.7501L20.0991 7.25239L13.1853 6.22822L10.0139 0L6.90342 6.25887L0 7.35045L4.99138 12.2428L3.89624 19.1457L9.61214 16.1608C10.316 18.384 12.3984 20 14.8514 20C17.8809 20 20.3456 17.5353 20.3456 14.5058C20.3456 12.477 19.2402 10.7017 17.6001 9.7501ZM10.6308 14.5058C10.6308 12.1785 12.5242 10.2851 14.8515 10.2851C17.1788 10.2851 19.0722 12.1785 19.0722 14.5058C19.0722 16.8332 17.1788 18.7265 14.8515 18.7265C12.5242 18.7265 10.6308 16.8332 10.6308 14.5058ZM5.55065 16.8451L6.35209 11.7933L2.69926 8.21298L7.75143 7.41413L10.0278 2.83365L12.3487 7.39167L17.4084 8.14115L16.334 9.21503C15.8621 9.08263 15.3649 9.01161 14.8514 9.01161C11.8219 9.01161 9.35724 11.4763 9.35724 14.5058C9.35724 14.6219 9.36127 14.737 9.3684 14.8513L5.55065 16.8451Z" fill="#FFFFFF"></path>
                <path d="M15.4876 11.8896H14.2142V13.8685H12.2354V15.1419H14.2142V17.1207H15.4876V15.1419H17.4664V13.8685H15.4876V11.8896Z" fill="#FFFFFF"></path></svg>
              <div>Đánh giá</div>
            </div>
          </b-row>
          <b-row class="display-center">
            <div class="box-chat btn" name="user-profile-btn-box-chat" id="user-profile-btn-box-chat" @click="trigger_gchat ++">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M32 21.6562C32 16.9919 28.8572 12.9167 24.4253 11.6887C24.1467 5.19629 18.7786 0 12.2188 0C5.4812 0 0 5.4812 0 12.2188C0 14.4146 0.584473 16.5525 1.69434 18.4294L0.0449219 24.3923L6.00806 22.7432C7.7334 23.7634 9.67969 24.3381 11.6885 24.4248C12.9163 28.8569 16.9917 32 21.6562 32C23.5181 32 25.3286 31.5042 26.9194 30.562L31.9548 31.9548L30.562 26.9194C31.5042 25.3286 32 23.5181 32 21.6562ZM6.30396 20.7158L2.73413 21.7034L3.72168 18.1335L3.49658 17.7815C2.43579 16.1218 1.875 14.1982 1.875 12.2188C1.875 6.51514 6.51514 1.875 12.2188 1.875C17.9224 1.875 22.5625 6.51514 22.5625 12.2188C22.5625 17.9224 17.9224 22.5625 12.2188 22.5625C10.2393 22.5625 8.31592 22.0017 6.65601 20.9409L6.30396 20.7158ZM29.2659 29.2659L26.6169 28.533L26.2632 28.7632C24.8918 29.6541 23.2986 30.125 21.6562 30.125C17.9902 30.125 14.7688 27.7546 13.6274 24.3557C19.2412 23.7085 23.7085 19.2412 24.356 13.6272C27.7546 14.7688 30.125 17.9902 30.125 21.6562C30.125 23.2986 29.6541 24.8918 28.7632 26.2632L28.533 26.6169L29.2659 29.2659Z" fill="#FFFFFF"></path><path d="M5.57204 9.74546C5.99854 9.74546 6.34476 9.39924 6.34476 8.97273C6.34476 8.54623 5.99854 8.20001 5.57204 8.20001C5.14553 8.20001 4.79932 8.54623 4.79932 8.97273C4.79932 9.39924 5.14553 9.74546 5.57204 9.74546Z" fill="#FFFFFF"></path><path d="M17.9146 8.19952H7.91157C7.47307 8.19952 7.11768 8.54544 7.11768 8.97225C7.11768 9.39905 7.47307 9.74497 7.91157 9.74497H17.9146C18.3531 9.74497 18.7085 9.39905 18.7085 8.97225C18.7085 8.54544 18.3531 8.19952 17.9146 8.19952Z" fill="#FFFFFF"></path><path d="M17.96 13.6085H5.54662C5.13358 13.6085 4.79883 13.9544 4.79883 14.3812C4.79883 14.8081 5.13358 15.154 5.54662 15.154H17.96C18.3731 15.154 18.7078 14.8081 18.7078 14.3812C18.7078 13.9544 18.3731 13.6085 17.96 13.6085Z" fill="#FFFFFF">
              </path></svg>
              <div>Chat</div>
            </div>
          </b-row>

        </div>
        </div>
      </b-row>
      <!--      Tích hợp tag vào màn nhân viên-->
      <b-row class="mr-0 ml-0 mt-3 mb-5">
        <staff-tag
          :user-id="users"
        >
        </staff-tag>
      </b-row>

      <b-row style="margin-right: 0px; margin-left: 0px;" v-if="show_kpi">
        <table class="table1" width="100%" v-if="type === 'DRIVER'">
          <tbody>
          <tr>
            <td style="width: 14%">
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderDriver.total_points | formatNumber}}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tổng điểm
                </div>
              </div>
            </td>
            <td  class="cell-table1" style="width: 22%">
              <div class="cell-table1_cennter">
                <div><b>{{ myFormatNumber(dataHeaderDriver.total_weight/1000) }} T</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Sản lượng
                </div>
              </div>
            </td>
            <td class="cell-table1" style="width: 24%">
              <div class="cell-table1_cennter">
                <div><b> {{dataHeaderDriver.speed_avg}} km/h</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tốc độ TB
                </div>
              </div>
            </td>
            <td class="cell-table1" style="width: 20%">
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderDriver.percent_wrong_time}}%</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tỉ lệ sai hẹn
                </div>
              </div>
            </td>
            <td  class="cell-table1" style="width: 20%">
              <div class="cell-table1_cennter">
                <div><b>{{ avg_evaluation }}/5</b>
                </div>
                <div style="color: rgb(130, 130, 130);">F-star
                </div>
              </div>
            </td>
          </tr>
          <tr style="height: 15px;"></tr>
          <tr style="margin-top: 10px;">
            <td>
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderDriver.total_km | formatNumber}}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tổng km
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderDriver.total_route_err | formatNumber}}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Lần lỗi lộ trình
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div ><b>{{ dataHeaderDriver.time_avg}} h/ngày</b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Thời gian làm việc TB
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderDriver.percent_wrong_import }}%</b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Tỉ lệ nhập sai
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderDriver.reward }} & {{ dataHeaderDriver.penalties }}</b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Thưởng & Thẻ phạt
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <table class="table1" width="100%" v-else-if="type === 'XLHH'">
          <tbody>
          <tr>
            <td style="width: 13%">
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderXLHH.total_pkg | formatNumber}}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tổng đơn
                </div>
              </div>
            </td>
            <td  class="cell-table1" style="width: 20%">
              <div class="cell-table1_cennter">
                <div><b>{{ myFormatNumber(dataHeaderXLHH.total_weight/1000)}} T</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Sản lượng
                </div>
              </div>
            </td>
            <td class="cell-table1" style="width: 23%">
              <div class="cell-table1_cennter">
                <div><b> {{dataHeaderXLHH.percent_export}}%</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Chất lượng xuất
                </div>
              </div>
            </td>
            <td class="cell-table1" style="width: 25%">
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderXLHH.percent_pallet}}%</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Chất lượng nhập chuồng
                </div>
              </div>
            </td>
            <td  class="cell-table1" style="width: 19%">
              <div class="cell-table1_cennter">
                <div><b>{{ avg_evaluation }}/5</b>
                </div>
                <div style="color: rgb(130, 130, 130);">F-star
                </div>
              </div>
            </td>
          </tr>
          <tr style="height: 15px;"></tr>
          <tr style="margin-top: 10px;">
            <td>
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderXLHH.total_bag | formatNumber}}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tổng bao
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderXLHH.percent_import}}%</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Chất lượng nhập
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div ><b>{{ dataHeaderXLHH.percent_sorting}}%</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Chất lượng sorting
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderXLHH.percent_p2b }}%</b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Chất lượng làm hàng
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderXLHH.reward }} & {{ dataHeaderXLHH.penalties }}</b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Thưởng & Thẻ phạt
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <table class="table1" width="100%" v-else>
          <tbody>
          <tr>
            <td style="width: 13%">
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderCod.total_pl | formatNumber}}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tổng điểm
                </div>
              </div>
            </td>
            <td  class="cell-table1" style="width: 18%">
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderCod.d_ss_percent}}%/{{dataHeaderCod.p_ss_percent}}%</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tỉ lệ giao/lấy TC
                </div>
              </div>
            </td>
            <td class="cell-table1" style="width: 24%">
              <div class="cell-table1_cennter">
                <div><b> {{dataSpeed.d_ss_speed}}p/{{dataSpeed.p_ss_speed}}p</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tốc độ giao/lấy hàng
                </div>
              </div>
            </td>
            <td class="cell-table1" style="width: 24%">
              <div class="cell-table1_cennter">
                <div><b>{{ shop_cus_review_good }}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Shop, KH hài lòng
                </div>
              </div>
            </td>
            <td  class="cell-table1" style="width: 21%">
              <div class="cell-table1_cennter">
                <div><b>{{ avg_evaluation }}/5</b>
                </div>
                <div style="color: rgb(130, 130, 130);">F-star
                </div>
              </div>
            </td>
          </tr>
          <tr style="height: 15px;"></tr>
          <tr style="margin-top: 10px;">
            <td>
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderCod.total_pkg | formatNumber}}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tổng ĐH
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{dataSpeed.clean_ss_percent}}%</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Sạch tuyến
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div v-if="shopReview.response_speed !== null"><b>{{ shopReview.response_speed }}p</b>
                </div>
                <div v-else><b> --</b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Tốc độ trả lời Shop, KH
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{ shop_cus_review_bad }}</b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Shop, KH không hài lòng
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderCod.reward }} & {{ dataHeaderCod.penalties }}</b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Thưởng & Thẻ phạt
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </b-row>
      <hr v-if="show_kpi" />
      <b-row style="margin: 0px;" v-if="show_kpi">
        <b-col class="p-0">
          <OverviewProfile style="padding-left: 25px; padding-right: 25px" :position="type"/>
        </b-col>
      </b-row>
      <modal-review-cod :user="users" :pkg_order="pkg_order" :trigger="trigger_review" :type="type"></modal-review-cod>
      <modal-gchat-cod :user="users" :pkg_order="pkg_order" :trigger="trigger_gchat" :type="type"></modal-gchat-cod>
    </div>

  </body>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/kpi-cod-profile.scss" lang="scss" scoped></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped>
.container-profile{
  width: 1445px;
  margin-right: auto;
  margin-left: auto;
  background-color: #FFFFFF;
}
@media screen and (max-width: 1445px) {
  .container-profile {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    background-color: #FFFFFF;
  }
}
.button-back {
  position: absolute;
  left: 2%;
  top: 1.5%;
  text-align: left;
}
.button-reload{
  position: absolute;
  right: 2%;
  top: 1.5%;
  text-align: right;
}
.header-text {
  font-style: normal;
  font-size: 18px;
  text-align: center;
  margin: auto;
  color: #FFFFFF;
}

.avatar {
  vertical-align: middle;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 10px;
}

.dot {
  margin-left: 10px;
  height: 10px;
  width: 10px;
  background-color: #eb5757;
  border-radius: 50%;
  display: inline-block;
}
ul {
  list-style: none;
}

ul li::before {
  content: "\2022";
  color: #14a05b;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}
.table1 {
  text-align: left;
  margin: 0px 25px 25px;
}

.box-chat {
  width: 100px;
  height: 80px;
  background-color: #00904A;
  color: #FFFFFF;
  display: block;
  align-items: center;
  text-align: center;
  margin: 10px;
  padding: 10px;
}

.display-center {
  display: flex;
  align-items: center;
  text-align: center;
}

.cell-table1 {
  border-left: 1px solid #DBDBDB;
}

.cell-table1_cennter {
  margin: auto;
  width: 65%;
  padding-left: 10px;
  padding-right: 10px;
}
@media screen and (max-width: 1400px) {
  .cell-table1_cennter {
    margin: auto;
    width: 70%;
    padding-left: 10px;
    padding-right: 10px;
  }
}
@media screen and (max-width: 1300px) {
  .cell-table1_cennter {
    margin: auto;
    width: 75%;
    padding-left: 10px;
    padding-right: 10px;
  }
}
@media screen and (max-width: 1200px) {
  .cell-table1_cennter {
    margin: auto;
    width: 80%;
    padding-left: 10px;
    padding-right: 10px;
  }
}
@media screen and (max-width: 1100px) {
  .cell-table1_cennter {
    margin: auto;
    width: 85%;
    padding-left: 10px;
    padding-right: 10px;
  }
}
@media screen and (max-width: 1030px) {
  .cell-table1_cennter {
    margin: auto;
    width: 90%;
    padding-left: 10px;
    padding-right: 10px;
  }
}

</style>

<script>
import kpiProfilesService from 'domain/services/kpi-profiles-service'
import Multiselect from 'vue-multiselect'
import OverviewProfile from './OverviewProfile'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import flatPickr from 'vue-flatpickr-component'
import vueNumeric from 'vue-numeric'
import Datepicker from 'vuejs-datepicker'
import Moment from 'moment'
import CustomButton from 'components/elements/common/CustomButton'
import cycleTime from 'infrastructures/helpers/date.js'
import ModalReviewCod from './ModalReviewCod'
import ModalGchatCod from './ModalGChatCod'
import staffTag from './staffTag/staffTag'
import Vue from 'vue'
import numeral from 'numeral'
Vue.filter('formatNumber', function (value) {
  return numeral(value).format('0,0') // displaying other groupings/separators is possible, look at the docs
})
export default {
  name: 'profile-cods',
  metaInfo: {
    title: 'Staff Profile'
  },
  components: {
    ModalGchatCod,
    Multiselect,
    SweetModal,
    SweetModalTab,
    commonHelper,
    flatPickr,
    vueNumeric,
    Datepicker,
    Moment,
    CustomButton,
    cycleTime,
    kpiProfilesService,
    OverviewProfile,
    ModalReviewCod,
    staffTag
  },
  data: () => ({
    type_show_kpi: ['COD', 'DRIVER', 'XLHH'],
    show_kpi: false,
    users: '',
    type: 'STAFF',
    profile_id: '',
    group_id: '',
    position_id: '',
    department_id: '',
    pkg_order: '',
    trigger_review: 0,
    trigger_gchat: 0,
    infoProfile: {
      ErpMasterProfile: {
        id: '',
        status: '',
        image_profile: '',
        staff_code: '',
        fullname: '',
        tel: ''
      },
      ErpEmpPosition: {
        position_name: ''
      },
      ErpStation: {
        name: ''
      },
      ErpUser: {
        status_id: '',
        group_id: ''
      },
      ErpCod: {
        alias: ''
      },
      ErpEmpContract: {
        type_contract: '',
        type_contract_name: ''
      }
    },
    diligence: [],
    trigger_diligence: false,
    class_button_diligence: 'fas fa-angle-double-down',
    training_percent: 0,
    document_percent: 0,
    document_incomplete: '',
    seniority: 0,
    avg_evaluation: 0,
    qlts_data: {
      dataReceived: [],
      dataNotReceived: []
    },
    strReceived: '',
    strNotReceived: '',
    shopReview: {
      shop_review_good: 0,
      shop_review_bad: 0,
      cus_review_good: 0,
      cus_review_bad: 0,
      response_speed: 0
    },
    shop_cus_review_good: 0,
    shop_cus_review_bad: 0,
    dataHeaderCod: {
      penalties: 0,
      reward: 0,
      total_pl: 0,
      total_pkg: 0,
      d_ss_percent: 0,
      p_ss_percent: 0
    },
    dataHeaderDriver: {
      total_points: 0,
      total_km: 0,
      total_weight: 0,
      total_route_err: 0,
      speed_avg: 0,
      time_avg: 0,
      percent_wrong_time: 0,
      percent_wrong_import: 0,
      reward: 0,
      penalties: 0,
      truck_code: ''
    },
    dataHeaderXLHH: {
      total_pkg: 0,
      total_bag: 0,
      total_weight: 0,
      percent_import: 0,
      percent_export: 0,
      percent_pallet: 0,
      percent_p2b: 0,
      percent_sorting: 0,
      reward: 0,
      penalties: 0
    },
    dataSpeed: {
      d_ss_speed: 0,
      p_ss_speed: 0,
      clean_ss_percent: 0
    },
    dotStyle: {
      backgroundColor: '#eb5757'
    }
  }),
  created () {
    this.users = this.$route.params.id
    this.getProfileInfo()
  },
  mounted () {
    commonHelper.importLibraryTracingLogs()
  },
  beforeDestroy () {
    commonHelper.removeLibraryTracingLogs()
  },
  watch: {
    trigger_diligence () {
      if (this.trigger_diligence) {
        this.class_button_diligence = 'fas fa-angle-double-up'
      } else {
        this.class_button_diligence = 'fas fa-angle-double-down'
      }
    },
    profile_id () {
      if (this.group_id === '12' || this.group_id === '14') {
        this.getShopReview()
        this.getDataSpeedDP()
        this.getDataHeaderProfileCod()
        this.type = 'COD'
      } else if (this.group_id === '16') {
        this.getDataHeaderProfileDriver()
        this.type = 'DRIVER'
      } else if (this.group_id === '23' || [125, 96, 117, 41, 42, 40, 123].find(e => e === Number(this.position_id))) {
        this.getDataHeaderProfileXLHH()
        this.type = 'XLHH'
      } else if ([2, 22].find(e => e === Number(this.department_id))) {
        this.type = 'TTCN'
      } else {
        this.type = 'STAFF'
      }
      this.show_kpi = this.type_show_kpi.includes(this.type)
      if (this.type !== '' && this.type !== 'STAFF') {
        this.getInfoAssetOrder()
        this.getDiligence()
        this.getTrainingProgress()
        this.getDocumentUploadProgress()
        this.getSeniority()
        this.getAvgEvaluation()
      }
    }
  },
  computed: {
  },
  methods: {
    myFormatNumber (num) {
      return (num).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    },
    reload () {
      this.getProfileInfo()
      if (this.type !== '' && this.type !== 'STAFF') {
        this.getInfoAssetOrder()
        this.getDiligence()
        this.getTrainingProgress()
        this.getDocumentUploadProgress()
        this.getSeniority()
        this.getAvgEvaluation()
      }
      if (this.type === 'COD') {
        this.getShopReview()
        this.getDataSpeedDP()
        this.getDataHeaderProfileCod()
      } else if (this.type === 'DRIVER') {
        this.getDataHeaderProfileDriver()
      } else if (this.type === 'XLHH') {
        this.getDataHeaderProfileXLHH()
      }
    },
    getProfileInfo () {
      let parmas = {
        user_id: this.users
      }
      kpiProfilesService.getProfileInfo(parmas)
        .then((res) => {
          if (res.data.success) {
            this.infoProfile = res.data.data
            this.profile_id = this.infoProfile.ErpMasterProfile.id
            this.group_id = this.infoProfile.ErpUser.group_id
            this.position_id = this.infoProfile.ErpEmpPosition.id
            this.department_id = this.infoProfile.ErpEmpPosition.department_id
            if (this.infoProfile.ErpUser.status_id === '3') {
              this.dotStyle.backgroundColor = '#14a05b'
            } else if (this.infoProfile.ErpUser.status_id === '1') {
              this.dotStyle.backgroundColor = '#eb5757'
            } else {
              this.dotStyle.backgroundColor = '#eebf5c'
            }
            switch (this.infoProfile.ErpEmpContract.type_contract) {
              case 'definite':
              case 'definite_24':
              case 'indefinite':
                this.infoProfile.ErpEmpContract.name = 'HĐLĐ'
                break
              case 'probation':
                this.infoProfile.ErpEmpContract.name = 'HĐTV'
                break
              case 'partnership':
                this.infoProfile.ErpEmpContract.name = 'HĐ HTKD'
                break
              case 'parttime':
                this.infoProfile.ErpEmpContract.name = 'CTV'
                break
              case 'service_contract':
                this.infoProfile.ErpEmpContract.name = 'HĐDV'
                break
              case 'apprenticeship':
                this.infoProfile.ErpEmpContract.name = 'HĐHV'
                break
              default:
                this.infoProfile.ErpEmpContract.name = 'Chưa ký'
            }
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getDiligence () {
      let parmas = {
        user_id: this.users
      }
      kpiProfilesService.getDiligence(parmas)
        .then((res) => {
          if (res.data.success) {
            this.diligence = []
            this.diligence = Object.keys(res.data.data).map((key) => [Number(key), res.data.data[key]])
            this.diligence.sort()
            this.diligence.reverse()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getTrainingProgress () {
      let parmas = {
        user_id: this.users
      }
      kpiProfilesService.getTrainingProgress(parmas)
        .then((res) => {
          if (res.data.success) {
            this.training_percent = parseFloat(res.data.data.complete_percent).toFixed(0)
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getDocumentUploadProgress () {
      let parmas = {
        user_id: this.users
      }
      kpiProfilesService.getDocumentUploadProgress(parmas)
        .then((res) => {
          if (res.data.success) {
            this.document_percent = parseFloat(res.data.data.complete_percent).toFixed(0)
            this.document_incomplete = res.data.data.incomplete.join(',')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getSeniority () {
      let parmas = {
        user_id: this.users
      }
      kpiProfilesService.getSeniority(parmas)
        .then((res) => {
          if (res.data.success) {
            this.seniority = res.data.data.seniority
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getAvgEvaluation () {
      let parmas = {
        user_id: this.users
      }
      kpiProfilesService.getAvgEvaluation(parmas)
        .then((res) => {
          if (res.data.success) {
            this.avg_evaluation = res.data.data.avg
            this.avg_evaluation = this.avg_evaluation.toFixed(1)
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getInfoAssetOrder () {
      let parmas = {
        master_profile_id: this.profile_id,
        user_id: this.users
      }
      kpiProfilesService.getInfoAssetOrder(parmas)
        .then((res) => {
          if (res.data.success) {
            this.qlts_data = res.data.data
            for (let key in res.data.data.dataReceived) {
              this.qlts_data.dataReceived[key] = (parseInt(res.data.data.dataReceived[key].amount) < 10 ? '0' : '') + res.data.data.dataReceived[key].amount + ' ' + res.data.data.dataReceived[key].asset_name
            }
            for (let key in res.data.data.dataNotReceived) {
              this.qlts_data.dataNotReceived[key] = (parseInt(res.data.data.dataNotReceived[key].amount) < 10 ? '0' : '') + res.data.data.dataNotReceived[key].amount + ' ' + res.data.data.dataNotReceived[key].asset_name
            }
            this.strReceived = this.qlts_data.dataReceived.toString()
            this.strReceived = this.strReceived.replaceAll(',', ', ')
            this.strNotReceived = this.qlts_data.dataNotReceived.toString()
            this.strNotReceived = this.strNotReceived.replaceAll(',', ', ')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getDataHeaderProfileCod () {
      let parmas = {
        user_id: this.users
      }
      kpiProfilesService.getDataHeaderProfileCod(parmas)
        .then((res) => {
          if (res.data.success) {
            this.dataHeaderCod = res.data.data
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getDataHeaderProfileDriver () {
      let parmas = {
        user_id: this.users
      }
      kpiProfilesService.getDataHeaderProfileDriver(parmas)
        .then((res) => {
          if (res.data.success) {
            this.dataHeaderDriver = res.data.data
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getDataHeaderProfileXLHH () {
      let parmas = {
        user_id: this.users
      }
      kpiProfilesService.getDataHeaderProfileXLHH(parmas)
        .then((res) => {
          if (res.data.success) {
            this.dataHeaderXLHH = res.data.data
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getShopReview () {
      let parmas = {
        user_id: this.users
      }
      kpiProfilesService.getShopReview(parmas)
        .then((res) => {
          if (res.data.success === 'SUCCESS') {
            this.shopReview = res.data.data
            this.shop_cus_review_good = res.data.data.cus_review_good + res.data.data.shop_review_good
            this.shop_cus_review_bad = res.data.data.cus_review_bad + res.data.data.shop_review_bad
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getDataSpeedDP () {
      let parmas = {
        user_id: this.users
      }
      kpiProfilesService.getDataSpeedDP(parmas)
        .then((res) => {
          if (res.data.success) {
            this.dataSpeed = res.data.data
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
