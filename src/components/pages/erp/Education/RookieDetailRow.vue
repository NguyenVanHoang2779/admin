<template>
  <tr class="education-row" ref="infoBox">
    <td class="border-right leftTd">
      <div class="leftContent">
        <!--          info user-->
        <div class="d-flex infoUser">
          <div>
            <img :src="infoRookie.image_profile" alt="">
          </div>
          <div class="description">
            <div class="d-flex justify-content-between" style="margin-bottom: 5px !important;">
              <span>
                <b style="text-transform: capitalize">
                  {{ infoRookie.fullname.toLowerCase() }} ({{ infoRookie.username}})
                </b>
              </span>
            </div>
            <div>
              <span>{{ infoRookie.position_name }} - {{ convertNameStation(infoRookie.station_name) }}</span>
            </div>
          </div>
        </div>

        <div class="popupView">
          <!--          popup xem, gọi , ghi chú-->
          <button
            class="btn btn-sm btn-outline-ghtk btn-pill mb-2 font-unset"
            @click="openLink(`/adm/profile/staff/${infoRookie.id}`)">Xem</button>

          <button
            class="btn btn-sm btn-outline-ghtk btn-pill mb-2 font-unset"
            @click="onOpenModal('callModal', infoRookie, {title: 'Gọi học viên'})">Gọi</button>

          <button
            v-if="infoRookie.list_class.happening.length || infoRookie.list_class.completed.length"
            class="btn btn-sm btn-outline-ghtk btn-pill mb-2 font-unset"
            @click="onOpenModal('noteModal', infoRookie, {callback: getLogEduRookie})">Ghi chú</button>
        </div>
        <div class="class-log-document">
          <!--          Bài kiểm tra-->
          <b style="display: inline-block;margin-top: 0.4rem;">Bài kiểm tra</b>
          <div class="row mt-2 mx-4" style="margin-left: inherit !important; width: 30vw">
            <div class="documentParent">
              <div class="scrollbar scrollbar-primary"
                   :style="(infoRookie.file_test.length > 5) ? 'overflow-x: scroll;' : ''">
                <div class="force-overflow d-flex">
                  <template v-for="(test, idx) in infoRookie.file_test || []">
                    <div class="d-block docChild">
                      <div class="d-inline-block w-5re" :key="idx">
                        <div v-if="test.file" class="profile-document__element" @click="openLink(test.file)">
                          <div class="document-type-desc">
                            {{ Math.floor(test.score) }} / 10
                          </div>
                          <div class="num-img-extend">
                            <i class="icon ion-md-eye cursor-pointer font-10 mr-1"></i> Xem
                          </div>
                          <span>
                          <img
                            v-if="['pdf', 'video', 'image', 'doc'].includes(helper.getFileType(test.file))"
                            class="image-document"
                            :src="imageUrlRender(test.file)"
                            :alt="'Bài kiểm tra '"
                          />
                        </span>
                        </div>
                        <div v-else class="profile-document__element mr-1">
                          <div class="document-type-desc">
                            {{ Math.floor(test.score) }} / 10
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
                      <div class="text-center font-weight-bold testTitle">
                        <b-button :disabled="true" v-b-tooltip.hover.bottom :title="test.code" style="background-color: white !important;color: #000 !important;font-size: 0.9rem; font-weight: 800">
                            {{test.code.slice(0,4) + '...'}}
                        </b-button>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <!-- Gắn thẻ -->
          <div class="btn-tags mb-1 mt-1">
            <div class="d-flex mt-3 mb-3 content-tag">
              <div v-for="(tag, idx) in infoRookie.tags || []" :key="idx">
                <div class="d-inline-block mr-2 pr-2 pl-2 mb-1 tag-item font-14">
                  {{ tag.name }}
                </div>
              </div>
              <span class="d-inline-block pt-1 cursor-pointer text-ghtk ml-2 align-items-baseline font-14"
                    @click="onOpenModal('tagModal', infoRookie)">
                <i class="fas fa-plus"></i> Tag
              </span>
            </div>
          </div>
        </div>

        <div v-if="listLogOperate.length > 0" class="logOperation" :style="listLogOperate.length > 8 ? 'overflow-y: scroll;' : (listLogOperate.length === 0 ? 'height: 2vh !important' : '') " @scroll="onScrollLogOperation" ref="infoHeightLog" :id="infoRookie.id">
          <!--            log-->
          <b>Log Vận Hành</b>
          <i v-show="loadingLogOperation" class="fas fa-spinner fa-pulse cusSpinnerOpe"></i>
          <div class="detail-logs" v-show="!loadingLogOperation && listLogOperate.length > 0">
            <div class="content-detail-log">
              <ul class="log-timeline">
                <li class="log-timeline-item" v-for="(data, idxLog) in listLogOperate" :key="idxLog">
                  <div class="log-timeline-item-tail"
                       :style="(idxLog === (listLogOperate.length -1)) ? 'display:none;' : ''"></div>
                  <div class="log-timeline-item-head"
                       :style="data.bad ? ' background-color: #FD0101;' : ' background-color: #000000;'"></div>
                  <div class="log-timeline-item-content">
                    <span>{{ data.created_at }} {{ data.content }} </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </td>
    <td class="border-right rightTd">
      <div class="d-flex flex-column">
        <div class="comingSoon" style="margin-bottom: 2px;">
          <b-button class="class-title d-flex justify-content-between titleClass" @click="(infoRookie.list_class.coming_up.length > 0) ? showClassToggle('coming_up',infoRookie.id): ''">
            <div>
              Sắp học | {{infoRookie.list_class.coming_up.length}} lớp
            </div>
            <div v-if="infoRookie.list_class.coming_up.length > 0">
              <i class="fas fa-chevron-down" style="color: #AEAEAE;" v-if="showClass['coming_up'+infoRookie.id]"></i>
              <i class="fas fa-chevron-right" style="color: #AEAEAE;" v-else></i>
            </div>
          </b-button>
          <div class="contentClassComing" :style="styleComingClass" v-show="isChangeCms && (infoRookie.list_class.coming_up.length > 0) ? (typeof(showClass['coming_up'+infoRookie.id]) !== 'undefined' ? showClass['coming_up'+infoRookie.id] : true) : false">
            <p  v-for="(content, idxCs) in infoRookie.list_class.coming_up" :key="idxCs">
              {{content.code}} - {{content.content}} | {{content.count}} buổi
            </p>
          </div>
        </div>
        <div class="happening" style="margin-bottom: 2px;">
          <b-button class="class-title d-flex justify-content-between titleClass" @click="(infoRookie.list_class.happening.length > 0) ? showClassToggle('happening',infoRookie.id): ''">
            <div>
              Đang học | {{infoRookie.list_class.happening.length}} lớp
            </div>
            <div v-if="(infoRookie.list_class.happening.length > 0)">
              <i class="fas fa-chevron-down" style="color: #AEAEAE;" v-if="showClass['happening'+infoRookie.id]"></i>
              <i class="fas fa-chevron-right" style="color: #AEAEAE;" v-else></i>
            </div>
          </b-button>
          <div class="cusBox" :style="infoRookie.list_class.happening.length >= 2 ? heightMax : heightMin" v-show="isChangeHp && (infoRookie.list_class.happening.length > 0) ? (typeof(showClass['happening'+infoRookie.id]) !== 'undefined' ? showClass['happening'+infoRookie.id] : true) : false">
            <div class="contentHappening" v-for="(content, idxHp) in infoRookie.list_class.happening || []" :key="idxHp">
              <div class="titleHr" :style="(content.is_master ==='0') ? 'color: #000' : 'color: #00904A'">{{content.class_code}} - {{content.content}} - {{content.count}} buổi {{ content.is_master ==='1' ? (' | ' + content.periods_content) : ''}}</div>
              <div class="infoHr">
                <div class="infoDetailHr">
                  <div class="d-flex infoUser">
                    <div>
                      <img :src="content.teacher.image_profile" alt="">
                    </div>
                    <div class="description">
                      <div class="d-flex justify-content-between" style="margin-bottom: 5px !important;">
                        <span><b>{{ content.teacher.fullname }} ({{ content.teacher.username }})</b></span>
                      </div>
                      <div>
                        <span>{{  content.teacher.position_name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="actionHr">
                  <button class="btn btn-sm btn-outline-ghtk btnChat" style="border-radius: 100px !important;" @click="onClickChat(content.teacher.id)">Chat</button>
                  <button class="btn btn-sm btn-outline-ghtk btnCall" style="border-radius: 100px !important;"
                          @click="onOpenModal('callModal', content.teacher, {title: 'Gọi HR'})">Gọi</button>
                </div>
                <div class="stationHr">
                  {{ convertNameStation(content.station_name) }}
                </div>
              </div>
              <div class="logEdu">
                <b>Log đào tạo</b>
                <i v-show="loadingLogEdu" class="fas fa-spinner fa-pulse cusSpinnerEdu"></i>
                <div class="detail-logs" v-show="!loadingLogEdu">
                  <div class="content-detail-log">
                    <ul class="log-timeline" v-if="listLogEduRookie[infoRookie.id]">
                      <li class="log-timeline-item" v-for="(data, idxLog) in listLogEduRookie[infoRookie.id][content.id] || []" :key="idxLog">
                        <div class="log-timeline-item-tail"
                             :style="(idxLog === (listLogEduRookie[infoRookie.id][content.id].length -1)) ? 'display:none;' : ''"></div>
                        <div class="log-timeline-item-head"
                             style="background-color: #00904A;"></div>
                        <div class="log-timeline-item-content">
                          <span>{{ data.created }} {{data.message}} </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <hr v-show="infoRookie.list_class.happening.length >= 2" style="background-color: #00904A; width: 95%; margin-top: 1.2rem;">
            </div>
          </div>
        </div>
        <div class="happening completed" style="margin-bottom: 2px;">
          <b-button class="class-title d-flex justify-content-between titleClass" @click="(infoRookie.list_class.completed.length > 0) ? showClassToggle('completed',infoRookie.id): ''">
            <div>
              Hoàn thành | {{infoRookie.list_class.completed.length}} lớp
            </div>
            <div v-if="(infoRookie.list_class.completed.length > 0)">
              <i class="fas fa-chevron-down" style="color: #AEAEAE;" v-if="showClass['completed'+infoRookie.id]"></i>
              <i class="fas fa-chevron-right" style="color: #AEAEAE;" v-else></i>
            </div>
          </b-button>
          <div :style="infoRookie.list_class.completed.length >= 2 ? heightMax : heightMin" v-show="isChangeCp && (infoRookie.list_class.completed.length > 0) ? (typeof(showClass['completed'+infoRookie.id]) !== 'undefined' ? showClass['completed'+infoRookie.id] : true) : false">
            <div class="contentHappening" v-for="(content, idxHp) in infoRookie.list_class.completed || []" :key="idxHp">
              <div class="titleHr" :style="(content.is_master ==='0') ? 'color: #000' : 'color: #00904A'">{{content.class_code}} - {{content.content}} - {{content.count}} buổi {{ content.is_master ==='1' ? (' | ' + content.periods_content) : ''}}</div>
              <div class="infoHr">
                <div class="infoDetailHr">
                  <div class="d-flex infoUser">
                    <div>
                      <img :src="content.teacher.image_profile" alt="">
                    </div>
                    <div class="description">
                      <div class="d-flex justify-content-between" style="margin-bottom: 5px !important;">
                        <span><b>{{ content.teacher.fullname }} ({{ content.teacher.username }})</b></span>
                      </div>
                      <div>
                        <span>{{ content.teacher.position_name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="actionHr">
                  <button class="btn btn-sm btn-outline-ghtk btnChat" style="border-radius: 100px !important;" @click="onClickChat(content.teacher.id)">Chat</button>
                  <button class="btn btn-sm btn-outline-ghtk btnCall" style="border-radius: 100px !important;"
                          @click="onOpenModal('callModal', content.teacher, {title: 'Gọi HR'})">Gọi</button>
                </div>
                <div class="stationHr">
                  {{ convertNameStation(content.station_name) }}
                </div>
              </div>
              <div class="logEdu">
                <b>Log đào tạo</b>
                <i v-show="loadingLogEdu" class="fas fa-spinner fa-pulse cusSpinnerEdu"></i>
                <div class="detail-logs" v-show="!loadingLogEdu">
                  <div class="content-detail-log">
                    <ul class="log-timeline" v-if="listLogEduRookie[infoRookie.id]">
                      <li class="log-timeline-item" v-for="(data, idxLog) in listLogEduRookie[infoRookie.id][content.id] || []" :key="idxLog">
                        <div class="log-timeline-item-tail"
                             :style="(idxLog === (listLogEduRookie[infoRookie.id][content.id].length -1)) ? 'display:none;' : ''"></div>
                        <div class="log-timeline-item-head"
                             style="background-color: #00904A;"></div>
                        <div class="log-timeline-item-content">
                          <span>{{ data.created }} {{data.message}}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <hr v-show="infoRookie.list_class.completed.length >= 2" style="background-color: #00904A; width: 95%; margin-top: 1.2rem;">
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

import trainingService from 'domain/services/training-service'

// custom component
import PeriodLine from './PeriodLine'
import {eventBus} from '../../../../main'
import moment from 'moment'

export default {
  name: 'rookie-detail-row',
  components: {
    PeriodLine
  },
  props: {
    syllabus: {
      type: Object,
      default: () => ({})
    },
    permissionEdit: {
      type: Boolean,
      default: false
    },
    infoRookie: {
      type: Object,
      default: () => ({})
    },
    roleUserId: {},
    numberUserCalled: null
  },
  watch: {
    numberUserCalled (newVal, oldVal) {
      this.getLog('first')
      // this.getLogOperation('first')
      // this.getLogEduRookie('first')
    },
    infoRookie (newVal, oldVal) {
      this.getLog('first')
      // this.getLogOperation('first')
      // this.getLogEduRookie('first')
    }

  },
  computed: {
    helper: function () {
      return helper
    },
    statusMapper: function () {
      let desc = ''
      if (this.syllabus.status === 'closed') desc = 'Đóng'
      if (this.syllabus.status === 'open') return 'Mở'
      return desc
    }
  },
  created () {
    this.getTimeDefault()
    window.addEventListener('resize', this.handlerCollapse)
    eventBus.$on('changeCollapseWork', this.handlerCollapse)
    // if (screen.width < 1920) {
    //   this.styleComingClass = 'width: 79%;'
    // } else {
    //   this.styleComingClass = 'width: 100%;'
    // }
    this.styleComingClass = 'width: 100%;'
  },
  mounted () {
    this.getLog('first')
    // this.getLogOperation('first')
    // this.getLogEduRookie('first')
  },
  destroyed () {
    eventBus.$off('changeCollapseWork', this.handlerCollapse)
    window.removeEventListener('resize', this.handlerCollapse)
  },

  data: _ => ({
    styleComingClass: '',
    heightMax: 'height: 62vh; overflow-y: scroll;',
    heightMin: 'height: 31vh;',
    showClass: [],
    isChangeCms: true,
    isChangeHp: true,
    isChangeCp: true,
    listLogOperate: [],
    listLogEduRookie: [],
    loadingLogOperation: false,
    loadingLogEdu: false,
    limit: 15,
    startDate: null,
    endDate: null,
    maxTime: 0,
    maxId: 0,
    isLimit: false,
    limitHeightOperation: 0
  }),

  methods: {
    convertNameStation (nameStation) {
      if (nameStation.slice(0, 3) === 'Kho' || nameStation.slice(0, 3) === 'kho') {
        return nameStation
      }
      return 'Kho ' + nameStation
    },
    async onScrollLogOperation () {
      let idTag = '[id="' + this.roleUserId.userId + '"]'
      const logOperation = document.querySelector(idTag)
      if (!this.limitHeightOperation) {
        this.limitHeightOperation = this.$refs.infoHeightLog.clientHeight
      }
      if (this.limitHeightOperation + logOperation.scrollTop + 100 > logOperation.scrollHeight && !this.loadingLogOperation && !this.isLimit) {
        // Lấy thêm log vận hành của từng user khi cuộn
        this.getLogOperation('Add')
      }
    },
    getHeightTag () {
      return this.$refs.infoBox.clientHeight
    },
    getTimeDefault () {
      let d = new Date()
      let currentYear = d.getFullYear()
      let twoMonthBefore = d.getMonth()
      let from = new Date(currentYear, twoMonthBefore, 0)
      if (twoMonthBefore <= 0) {
        twoMonthBefore = 12 + twoMonthBefore
        from = new Date(currentYear - 1, twoMonthBefore, 0)
      }

      let a = moment(from).format(`01/MM/YYYY`)
      let b = moment().format('DD/MM/YYYY')
      this.startDate = a.split('/').reverse().join('-')
      this.endDate = b.split('/').reverse().join('-')
    },

    reverseFormatDate (date) {
      return date.split('/').reverse().join('-')
    },

    showClassToggle (type, userId) {
      let key = type + userId
      if (typeof (this.showClass[key]) === 'undefined') {
        this.showClass[key] = false
      } else {
        this.showClass[key] = !this.showClass[key]
      }

      if (type === 'coming_up') {
        this.isChangeCms = !this.isChangeCms
      } else if (type === 'happening') {
        this.isChangeHp = !this.isChangeHp
      } else if (type === 'completed') {
        this.isChangeCp = !this.isChangeCp
      }
    },

    handlerCollapse (isOpen) {
      if (screen.width < 1920) {
        // if (isOpen) {
        //   this.styleComingClass = 'width: 79%;'
        // } else {
        //   this.styleComingClass = 'width: 100%;'
        // }
        this.styleComingClass = 'width: 100%;'
      } else {
        this.styleComingClass = 'width: 100%;'
      }
    },

    openLink (link) {
      window.open(link, '_blank')
    },
    imageUrlRender (link) {
      let fileType = helper.getFileType(link)
      link += ['pdf', 'video'].includes(fileType) ? '?extract=thumb' : ''
      if (fileType === 'doc') link = 'https://gs.giaohangtietkiem.vn/d/e24bec4ee88441bdb3e79466dd541152.png?height=250'
      return link
    },

    onOpenModal (modal, user, options) {
      this.$emit('onOpenModal', {modal, user, options})
    },

    onClickChat (userId) {
      // truyền id của HR
      this.$emit('onClickChat', userId)
    },

    async getLog (type) {
      if (type === 'first') {
        if (!this.roleUserId.roleCall || typeof (this.roleUserId.userId) === 'undefined' || this.roleUserId.isCalled) {
          return true
        }
      }
      await Promise.all([
        this.getLogOperation('first'),
        this.getLogEduRookie()
      ])
      if (type === 'first') {
        let height = await this.getHeightTag()
        this.$emit('updateStatusCall', this.roleUserId.userId, height)
      }
    },

    async getLogOperation (type) {
      // if (type === 'first') {
      //   if (!this.roleUserId.roleCall || typeof (this.roleUserId.userId) === 'undefined' || this.roleUserId.isCalled) {
      //     return true
      //   }
      // }
      if (this.isLimit || this.loadingLogOperation) { return true }
      this.loadingLogOperation = true
      try {
        let params = {
          start_date: this.startDate,
          end_date: this.endDate,
          user_id: this.roleUserId.userId,
          limit: this.limit,
          max_time: this.maxTime,
          max_id: this.maxId
        }
        const res = await trainingService.getListLogOperate(params)
        if (res.data.success) {
          if (type === 'first') {
            this.listLogOperate = res.data.data
          } else {
            this.listLogOperate = this.listLogOperate.concat(res.data.data)
          }
          this.maxTime = res.data.data.max_time
          this.isLimit = res.data.data.is_limit
          this.maxId = res.data.data.max_id
          // cập nhật trạng thái isCalled (đã call) và chiều cao
          // if (type === 'first') {
          //   let height = await this.getHeightTag()
          //   this.$emit('updateStatusCall', this.roleUserId.userId, height)
          // }
        } else {
          if (type === 'first') {
            this.listLogOperate = []
          }
          helper.showMessage(res.data.message, 'warning')
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingLogOperation = false
      }
    },

    async getLogEduRookie () {
      // if (type === 'first') {
      //   if (!this.roleUserId.roleCall || typeof (this.roleUserId.userId) === 'undefined' || this.roleUserId.isCalled) {
      //     return true
      //   }
      // }
      if (this.loadingLogEdu) { return true }
      this.loadingLogEdu = true
      try {
        let params = {
          student_ids: [this.roleUserId.userId]
        }
        const res = await trainingService.getListLogRookie(params)
        if (res.data.success) {
          this.listLogEduRookie = res.data.data
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingLogEdu = false
      }
    }

  }
}
</script>

<style lang="scss" scoped>
  .tooltip{
    opacity: 1 !important;
  }
.organize-form {
  &-active, &-disable {
    border-radius: 100px;
    width: 16px;
    height: 16px;

    .checkmark {
      transform: rotate(45deg);
      height: 9px;
      width: 5px;
      margin-top: 0.12rem;
      margin-left: 37%;
      border-bottom: 1px solid #FFFFFF;
      border-right: 1px solid #FFFFFF;
    }
  }

  &-active {
    background-color: #14a05b;
    border-color: #14a05b;
  }

  &-disable {
    background-color: #BDBDBD;
    border-color: #BDBDBD;
  }
}

.logOperation {
  height: 38vh;
  position: relative;
}

.contentClassComing::-webkit-scrollbar {
  width: 0 !important
}

.cusBox::-webkit-scrollbar {
  width: 0 !important
}

.detail-logs::-webkit-scrollbar {
    width: 0 !important
}

.logOperation b, .class-log-document b {
  font-size: 0.9rem !important;
}

.description b {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem !important;
  line-height: 19px
}

.description span {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 0.9rem !important;
  line-height: 19px
}

.profile-document {
  position: relative;
  width: 100%;
  height: 100%;

  &-container {
    width: 5vw;
    height: 13vh;
  }
}

.education-row {
  color: #000;
}

.content-tag {
  max-width: 61%;
  flex-wrap: wrap;
}

.tag-item {
  height: 1.8rem;
  background-color: rgb(6, 146, 85);
  color: white;
  text-align: center;
  padding-top: 0.25rem;
}

.w-51 {
  width: 51% !important;
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

.documentParent {
  max-width: 96%;
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

.docChild {
  width: 66px;
  margin-right: 26px;
}

.profile-document__element {
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.3)) !important;
  overflow: hidden;
  position: relative;
  border: 1px solid #ddd;

  &:hover .num-img-extend {
    display: flex;
  }
}

.scrollbar {
  float: left;
  width: 100%;
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

  .documentParent {
    max-width: 102%;
  }

  .content-tag {
    max-width: 95%;
  }

}

.content-detail-log {
  ul.log-timeline {
    max-height: 154px;

    li:last-child {
      margin-bottom: -18px;
    }
  }

  .log-timeline {
    box-sizing: border-box;
    color: #000;
    font-variant: tabular-nums;
    line-height: 1.9;
    -webkit-font-feature-settings: "tnum", "tnum";
    font-feature-settings: "tnum", "tnum";
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .log-timeline-item {
    position: relative;
    margin: 0;
    padding: 0 4px 0;
    list-style: none;
    top: 11px;
  }

  .log-timeline-item-tail {
    position: absolute;
    top: 8px;
    left: 0.41rem;
    height: calc(100% - 4px);
    border-left: 2px solid #BDBDBD;
  }

  .log-timeline-item-head {
    width: 6px;
    height: 6px;
    border: 2px solid transparent;
    border-radius: 89%;
  }

  .log-timeline-item-content {
    position: relative;
    top: -15px;
    margin: 0 0 0 14px;
    word-break: break-word;

    span.btn {
      border-radius: 20px;
      border: 1px solid #00904A;
    }
  }
}

</style>
<style scoped>

.contentClassComing {
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  padding-left: 1rem;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 0.9rem !important;
  line-height: 19px;
  height: 8vh;
  overflow-y: scroll;
}

.contentClassComing p {
  margin: 5px 0px 0px 0px;
}

.titleClass {
  background-color: #00904A !important;
  width: 100%;
  border-radius: inherit;
  padding-left: 0.7em;
}

.titleClass div {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  font-size: 0.9rem !important;
}

.leftContent {
  margin-top: 2px;
}

.infoUser {
  display: flex;
}

.infoUser img {
  width: 59px;
  height: 59px;
  border-radius: 50%;
  object-fit: cover
}

.infoUser .description {
  margin-left: 8px;
}

.popupView {
  display: flex;
  margin-top: 11px;
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 0.75rem;
}

.popupView .btn {
  min-width: 3rem;
  margin-right: 0.5%;
}

.testTitle {
  font-weight: 500;
  font-size: 8px;
  font-family: "Roboto", sans-serif;
  line-height: 18px;
  margin-left: 8px;
  width: 100%;
}

.happening {

}

.infoHr {
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
}

.infoDetailHr {
  margin-left: 1rem;
}

.infoDetailHr img {
  width: 52px !important;
  height: 52px !important;
}

.happening .infoHr {
  display: flex;
  margin-right: 1rem;
}

.happening .description {
  padding-top: 0.2rem;
}

.happening .actionHr {
  padding-top: 0.6rem;
  margin-left: 5.5rem;
  margin-right: 5.5rem;
}

.happening .stationHr {
  padding-top: 0.7rem;
  font-size: 0.9rem !important;
}

.titleHr {
  margin-top: 2.5rem;
  margin-left: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.95rem !important;
}
.logEdu {
  margin-left: 1rem;
  position: relative;
}

.logEdu .detail-logs {
  height: 17vh;
  overflow-y: scroll;
}
.cusSpinnerOpe {
  position: absolute;
  top: 11rem;
  left: 16rem;
}
.cusSpinnerEdu {
  position: absolute;
  top: 5rem;
  left: 22rem;
}
.logEdu {
  height: 18vh;
}
.contentHappening {
  height: 30vh;
}

@media only screen and (max-width: 1280px) {
  .logEdu .detail-logs[data-v-d0950ee2] {
    height: 15vh;
    overflow-y: scroll;
  }
  .popupView .btn {
    min-width: 3rem;
    margin-right: 0.5%;
  }

  .contentClassComing {
    height: 16vh;
    overflow-y: scroll;
  }
  .contentHappening {
    height: 37vh;
  }
  .cusSpinnerEdu {
    position: absolute;
    top: 3rem;
    left: 16rem;
  }
  .cusSpinnerOpe {
    position: absolute;
    top: 10rem;
    left: 10rem;
  }
}
</style>
