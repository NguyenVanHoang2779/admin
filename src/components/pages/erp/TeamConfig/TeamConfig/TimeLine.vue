<template>
  <div v-loading="loading">
    <div :class="{'timeline' : Object.keys(timeline).length > 0}">
      <ul v-if="Object.keys(timeline).length > 0">
        <li v-for="(day, index) in timeline" :key="index">
          <div class="left" :class="{'border-highlight' : typeof day.leave !== 'undefined' && day.leave.length > 0}">
            <p v-if="typeof day.leave !== 'undefined' && day.leave.length > 0">{{ helper.formatDate(index, 'YYYY-MM-DD') }}</p>
            <span class="info-change" v-if="typeof day.leave !== 'undefined' && day.leave.length > 0" v-for="(leave, indexLeave) in day.leave" :key="indexLeave"><b>{{leave.username}}</b> - <b>{{leave.fullname}}</b> - <b>{{leave.position_name}}</b> - <b>{{leave.duty_name}}</b> - Rời team với vị trí {{ leave.value === 'manager' ? 'Quản lý' : 'Thành viên' }}</span>
          </div>
          <div>
            <div class="point-left-line"></div>
            <div class="point"></div>
            <div class="point-right-line"></div>
          </div>
          <div class="right" :class="{'border-highlight' : typeof day.join !== 'undefined' && day.join.length > 0}">
            <p v-if="typeof day.join !== 'undefined' && day.join.length > 0">{{ helper.formatDate(index, 'YYYY-MM-DD') }}</p>
            <span class="info-change" v-if="typeof day.join !== 'undefined' && day.join.length > 0" v-for="(join, indexJoin) in day.join" :key="indexJoin"><b>{{join.username}}</b> - <b>{{join.fullname}}</b> - <b>{{join.position_name}}</b> - <b>{{join.duty_name}}</b> - Vào team với vị trí {{ join.value === 'manager' ? 'Quản lý' : 'Thành viên' }}</span>
          </div>
        </li>
      </ul>
      <div class="p-4 text-center" v-else>Không có dữ liệu</div>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import helper from 'infrastructures/helpers/common-helpers'
import teamConfigService from 'domain/services/team-config-service'
import VueMonthlyPicker from 'vue-monthly-picker'

export default {
  name: 'TimeLine',
  props: {
    team: {
      type: Object,
      required: true,
      sync: true
    }
  },
  components: {
    VueMonthlyPicker
  },
  data () {
    return {
      loading: false,
      timeline: []
    }
  },
  async created () {
    await this.getTimeLine()
  },
  computed: {
    helper: _ => helper
  },
  methods: {
    async getTimeLine () {
      this.loading = true
      await teamConfigService.getTimeLine({
        id: this.team.id
      })
        .then(response => {
          if (response.data.success) {
            this.timeline = response.data.data
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
        })
      this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
.timeline {
  position: relative;
  font-size: 0.8rem;
}
.timeline ul li {
  margin-bottom: 50px;
  list-style-type: none;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.timeline ul {
  padding-left: 0;
  padding-top: 60px;
}
.timeline ul li .left {
  width: 50%;
  padding: 10px ;
  text-align: right;
}
.left p, .right p {
  border-bottom: 1px #02a065 solid;
}
.timeline ul li .right {
  width: 50%;
  padding: 10px;
}
.border-highlight {
  border: 1px #02a065 solid;
  border-radius: 8px;
}
.timeline::before {
  content: "";
  position: absolute;
  width: 3px;
  left: 50%;
  background-color: #02a065;
  height: calc(100% + 50px + 1.5rem);
}
.point {
  min-width: 20px;
  height: 20px;
  background-color: #fff;
  border-radius: 100%;
  z-index: 2;
  border: 2px #02a065 solid;
  position: relative;
  left: -19px;
  margin-left: 40px;
}
.point-right-line{
  content: "";
  position: absolute;
  height: 2px;
  width: 10rem;
  background-color: #3dcc97;
  margin-top: 50%;
  margin-left: 100%;
}
.info-change {
  display: block;
}
.info-change::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #b9b6b6;
  margin-right: 5px;
  margin-top: 0;
  margin-bottom: 2px;
}
.text-month {
  margin: unset;
}
.up-btn, .down-btn, .search {
  color: #fff;
  background-color: #02a065;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
}
.down-btn {
  float: right;
}

@media (max-width: 800px) {
}
@media (max-width: 650px) {
}
@media (max-width: 450px) {
}
</style>
