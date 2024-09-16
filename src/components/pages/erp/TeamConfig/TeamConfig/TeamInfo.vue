<template>
  <div class="card" v-loading="loading" v-if="load">
    <div class="card-header d-flex align-items-center">
      <span class="back-button" v-if="tab !== 'all'" @click="tab = 'all'" title="Quay lại">
          <i class="fa fa-chevron-left" aria-hidden="true"></i>
        </span>
      <span class="text-uppercase">
        <b v-if="tab === 'all'">Thông tin team</b>
        <b v-if="tab === 'tech'">Công nghệ sử dụng</b>
        <b v-if="tab === 'add'">Thêm thành viên</b>
      </span>
      <div class="ml-auto text-center">
        <span class="action" @click="setTabTech" :class="{'add' : tab === 'tech'}">Công nghệ sử dụng</span>
        <span class="action" @click="setTabAdd" :class="{'add' : tab === 'add'}">Thêm thành viên</span>
      </div>
    </div>
    <div class="card-body">
      <TickKpi
        v-if="tab === 'all'"
        :team.sync="team"
        class="d-flex justify-content-end"
      />
      <CountPositionUser
        :team="team"
      />
      <div v-show="tab === 'all'" class="w-100">
        <ListUser
          :team.sync="team"
        />
      </div>
      <div v-show="tab === 'tech'">
        <TeamTech
          :team="team"
        />
      </div>
      <div v-show="tab === 'add'">
        <FormMember
          :team.sync="team"
          :tab="tab"
        />
      </div>
    </div>
  </div>
</template>

<script>
import helper from 'infrastructures/helpers/common-helpers'
import TeamTech from './TeamTech.vue'
import ListUser from './ListUser.vue'
import FormMember from './FormMember.vue'
import CountPositionUser from './CountPositionUser.vue'
import TickKpi from './TickKpi.vue'

export default {
  name: 'TeamInfo',
  components: {TickKpi, CountPositionUser, FormMember, ListUser, TeamTech},
  props: {
    team: {
      type: Object,
      required: true,
      sync: true
    }
  },
  data: () => ({
    tab: 'all',
    loading: false,
    load: false
  }),
  computed: {
    helper: _ => helper
  },
  created () {
    this.tab = 'all'
    this.reload()
  },
  methods: {
    reload () {
      this.load = false
      this.load = true
    },
    setTabTech () {
      this.tab = 'tech'
    },
    setTabAdd () {
      this.tab = 'add'
    }
  }
}
</script>

<style scoped lang="scss">
  .action {
    -webkit-box-align: center;
    align-items: center;
    appearance: none;
    cursor: pointer;
    display: inline-flex;
    user-select: none;
    background-image: none;
    border: none;
    border-radius: 5px;
    white-space: nowrap;
    outline: 0px;
    text-align: center;
    margin: 0px;
    transition: background-color 50ms ease-in-out 0s, border-color 50ms ease-in-out 0s;
    padding: 4px 12px !important;
    color: rgb(33, 33, 33);
    background-color: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 0px 0px 1px inset !important;
  }
  .add {
    color: rgb(255, 255, 255);
    background-color: #069255;
  }
  .back-button {
    cursor: pointer;
    font-size: 1rem;
    margin-right: 10px;
    color: #02a065;
  }
</style>
