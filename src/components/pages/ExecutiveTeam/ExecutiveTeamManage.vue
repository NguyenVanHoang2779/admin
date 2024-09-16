<template>
  <div>
    <b-card>
      <h4 class="ui-block-heading" style="margin: 0px; display: inline-block">Cơ cấu keyperson</h4>
      <hr>
      <b-row class="mb-2">
        <b-col class="text-left">
          <b-row>
            <b-col><b-form-input v-model="filter.pattern" placeholder="Username thành viên"></b-form-input></b-col>
            <b-col><single-select-province @handleSelectedProvince="setProvince"></single-select-province></b-col>
            <b-col><single-select-station :province-id="filter.province_id" @handleSelectedStation="setStation"></single-select-station></b-col>
            <b-col><b-btn variant="ghtk" @click="getData"><i class="ion ion-ios-search"></i> Tìm kiếm</b-btn></b-col>
          </b-row>
        </b-col>
        <b-col class="text-right">
          <b-btn variant="ghtk" @click="openModalCreate">+ Tạo mới</b-btn>
        </b-col>
      </b-row>
      <b-table
        :fields="fields"
        :items="data"
        ref="f-table"
      >
        <template v-slot:cell(station)="data">
          {{data.item.station_name}}
        </template>
        <template v-slot:cell(province)="data">
          {{data.item.province_name}}
        </template>
        <template v-slot:cell(member)="data">
          <single-select-executive-team-member :member-id="data.item.member_id" @select="setNewMem(data.item, ...arguments)"></single-select-executive-team-member>
        </template>
        <template v-slot:cell(action)="data">
          <div class="text-right">
            <b-btn variant="primary" class="action-btn" v-show="data.item.new_mem_id !== data.item.member_id" @click="updateTeam(data.item)"> Lưu</b-btn>
            <b-btn variant="danger" class="action-btn" @click="deleteTeam(data.item)"> Xóa</b-btn>
          </div>
        </template>

        <template v-slot:table-caption>
            <b-pagination
              v-model="filter.currentPage"
              :per-page="filter.perPage"
              :total-rows="total"
              @input="getData"
              align='center'
            ></b-pagination>
        </template>
      </b-table>
    </b-card>

    <modal-create-executive-team :trigger="triggerCreateModal" @on-created="updateTable"></modal-create-executive-team>
    <sweet-modal ref="successModal" icon="success"><b>{{alertMessage}}</b></sweet-modal>
  </div>
</template>

<style lang="scss" scoped>
  .action-btn {
    min-width: 80px;
  }
</style>

<script>
import {SweetModal} from 'sweet-modal-vue'
import executiveService from 'domain/services/executive-service'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectExecutiveTeamMember from './SingleSelectExecutiveTeamMember'
import ModalCreateExecutiveTeam from './ModalCreateExecutiveTeam'

import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'executive-team-manage',

  components: {
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectExecutiveTeamMember,
    ModalCreateExecutiveTeam,
    SweetModal
  },

  data: () => ({
    alertMessage: '',

    triggerCreateModal: false,

    total: 0,

    data: [],

    filter: {
      province_id: null,
      station_id: null,
      pattern: null,
      currentPage: 1,
      perPage: 10
    },

    fields: [
      {
        key: 'id',
        label: 'ID Team'
      },
      {
        key: 'province',
        label: 'Tỉnh'
      },
      {
        key: 'station',
        label: 'Kho'
      },
      {
        key: 'member',
        label: 'Tên member'
      },
      {
        key: 'action',
        label: 'Chỉnh sửa',
        thStyle: 'width: 200px'
      }
    ]
  }),

  created () {
    this.getData()
  },

  methods: {
    setNewMem (team, member) {
      team.new_mem_id = member ? member.id : null
    },

    setProvince (province) {
      if (!province) this.filter.province_id = null
      else this.filter.province_id = province.id
    },

    setStation (station) {
      if (!station) this.filter.station_id = null
      else this.filter.station_id = station.id
    },

    updateTable () {
      this.$refs['f-table'].refresh()
    },

    getData () {
      this.$startLoading()
      executiveService.getAll({...this.filter, count: 1})
        .then(res => {
          if (res.data.success) {
            this.total = parseInt(res.data.total)
            let data = res.data.data
            if (!data) return []
            data.forEach(element => {
              element.new_mem_id = element.member_id
            })
            this.data = data
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi lấy đa data !')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi khi lấy đa data !')
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    openModalCreate () {
      this.triggerCreateModal = !this.triggerCreateModal
    },

    deleteTeam (team) {
      executiveService.deleteTeam({id: team.id, station_id: team.station_id})
        .then(response => {
          if (response.data.success) {
            this.updateTable()
            this.alertMessage = 'Xóa cơ cấu thành công'
            this.$refs['successModal'].open()
            setTimeout(() => { this.$refs['successModal'].close() }, 1200)
          }
        })
    },

    updateTeam (team) {
      let dataSend = {
        id: team.id,
        station_id: team.station_id,
        member_id: team.new_mem_id
      }
      executiveService.updateTeam(dataSend)
        .then(response => {
          if (response.data.success) {
            this.updateTable()
            this.alertMessage = 'Cập nhật thành công'
            this.$refs['successModal'].open()
            setTimeout(() => { this.$refs['successModal'].close() }, 1200)
          }
        })
    }
  }
}
</script>
