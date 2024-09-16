<template>
    <div>
        <b-modal ref="edit-modal" :title="title" size="lg" ok-only static centered>
            <b-row class="mb-3">
                <b-col md="6">
                  <b-form-group label="Phòng ban">
                    <single-select-department @handleSelectedDepartment="handleSelectedDepartment" :department-id="departmentId" :is-disabled='disable'></single-select-department>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Vị trí">
                    <single-select-position @handleSelectedPosition="handleSelectedPosition" :department-id="departmentId" :position-id ="positionId" :is-disabled='disable'></single-select-position>
                  </b-form-group>
                </b-col>
            </b-row>
            <b-row class="mb-3">
                <b-col md="12">
                  <b-form-group label="Leader">
                    <select-position-leader @handleLeaderSelected="handleLeaderSelected" :display-all="true" :leader-ids="leaderId" :limit-prop=99999 :auto-close="false" :hide-selected="true"></select-position-leader>
                  </b-form-group>
                </b-col>
            </b-row>
            <template slot="modal-footer">
            <b-button variant="primary" @click="updatePositionLeader()">
            Đồng ý
            </b-button>
        </template>
      </b-modal>
    </div>
</template>

<style scoped lang="scss">
    .sperator-right {
        border-right: 1px solid rgba(0, 0, 0, 0.2)
    }
</style>

<script>
import SingleSelectPosition from './SingleSelectPosition'
import SingleSelectDepartment from './SingleSelectDepartment'
import SelectPositionLeader from './SelectPositionLeader'

import positionService from 'domain/services/position-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-edit-position-leader',
  components: {
    SingleSelectPosition,
    SingleSelectDepartment,
    SelectPositionLeader
  },

  props: [
    'currEditing', 'trigger', 'type'
  ],

  data: () => ({
    title: '',
    dataSavePositionLeader: {
      position_id: null,
      leader_id: null
    },
    getPositionLeader: null,
    departmentId: null,
    positionId: null,
    leaderId: null,
    disable: false
  }),

  watch: {
    currEditing: function (newVal, oldVal) {
    },

    trigger: function (newVal, oldVal) {
      if (this.type === 'create') {
        this.resetForm()
      } else {
        if (!this.currEditing) return
        let param = {
          id: this.currEditing
        }
        positionService.getById(param).then(res => {
          if (res.data.success) {
            this.getPositionLeader = res.data.data
            this.departmentId = this.getPositionLeader.ErpEmpPosition.department_id
            let leaderId = ''
            this.getPositionLeader.ErpEmpPosition.leaders.forEach((item) => {
              leaderId += item.id + ','
            })
            this.leaderId = leaderId.slice(0, -1)
            this.positionId = this.getPositionLeader.ErpEmpPosition.id
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
          .catch(e => {
            console.log(e)
          })
          .then(() => {
            this.appLoading = false
          })
      }
      this.$refs['edit-modal'].show()
    },

    type: function (newVal, oldVal) {
      if (newVal === 'create') {
        this.disable = false
        this.title = 'Tạo config leader cho bộ phận'
      }
      if (newVal === 'edit') {
        this.title = 'Chỉnh sửa config leader cho bộ phận'
        this.disable = true
      }
    },

    positionId: function (newVal, oldVal) {
      if (this.type === 'edit') return
      if (this.positionId === '' || this.positionId == null) {
        this.leaderId = null
        return
      }
      if (this.type === 'create') {
        let param = {
          id: newVal
        }
        positionService.getById(param).then(res => {
          if (res.data.success) {
            this.getPositionLeader = res.data.data
            let leaderId = ''
            this.getPositionLeader.ErpEmpPosition.leaders.forEach((item) => {
              leaderId += item.id + ','
            })
            this.leaderId = leaderId.slice(0, -1)
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        }).catch(e => {
          console.log(e)
        }).then(() => {
          this.appLoading = false
        })
      }
    }
  },

  methods: {
    resetForm: function () {
      this.leaderId = null
      this.departmentId = null
      this.dataUpdatePositionLeader = null
      this.getPositionLeader = null
    },

    handleLeaderSelected: function (option) {
      this.leaderId = option ? option.map((item) => item.id).toString() : ''
    },

    handleSelectedDepartment: function (option) {
      this.departmentId = option ? option.id : ''
    },

    handleSelectedPosition: function (option) {
      this.positionId = option ? option.id : null
    },

    updatePositionLeader () {
      if (this.positionId) this.dataSavePositionLeader.position_id = this.positionId
      else this.dataSavePositionLeader.position_id = this.currEditing
      if (this.leaderId) this.dataSavePositionLeader.leader_id = this.leaderId
      else this.dataSavePositionLeader.leader_id = null

      let dataSend = new FormData()

      Object.keys(this.dataSavePositionLeader).forEach(key => {
        if (!this.dataSavePositionLeader[key]) dataSend.append(key, '')
        else dataSend.append(key, this.dataSavePositionLeader[key])
      })

      positionService.update(dataSend)
        .then(res => {
          if (res.data.success) {
            this.$emit('on-updated', res.data.success)
            this.$refs['edit-modal'].hide()
          } else {
            commonHelper.showMessage(res.data.message, 'fail')
          }
        })
    }
  }
}
</script>
