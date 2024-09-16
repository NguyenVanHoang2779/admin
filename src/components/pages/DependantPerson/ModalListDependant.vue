<template>
  <div>
    <b-modal
      hide-footer
      static
      centered
      modal-class="modal-xxl"
      :title="'Danh sách người phụ thuộc ' + mpFullname"
      :id="id"
      @hide="checkDataChange"
      @shown="getDependantOfProfile()"
    >
      <div class="text-right" >
        <b-btn size="sm" variant="outline-ghtk" @click="$bvModal.show('modal-log-dependant')">
          <i class="ion ion-md-information-circle-outline"></i> Lịch sử
        </b-btn>
        <b-btn size="sm" variant="outline-ghtk" @click="$bvModal.show('modal-note-dependant')">
          <i class="ion ion-md-alert"></i> Ghi chú
        </b-btn>
      </div>
      <!-- list dependant -->
      <table class="table table-hover table-bordered table-sm">
        <thead class="thead-light">
          <tr>
            <th>STT</th>
            <th>Họ và tên</th>
            <th>Ngày sinh</th>
            <th>Mã số thuế</th>
            <th>Quốc tịch</th>
            <th>CMND</th>
            <th>Mối quan hệ</th>
            <th>Bắt đầu giảm trừ</th>
            <th>Kết thúc giảm trừ</th>
            <th>Hồ sơ</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody class="position-relative" v-loading="loading">
          <tr v-for="(de, index) in dependants" :key="de.id">
            <td>{{ index + 1 }}</td>
            <td>{{ de.fullname }}</td>
            <td>{{ formatDate(de.birthday, 'DD-MM-YYYY') }}</td>
            <td>{{ de.tax_iden_number }}</td>
            <td>{{ de.nationality }}</td>
            <td>{{ de.personal_id_number }}</td>
            <td>{{ relationship[de.relationship] }}</td>
            <td>{{ formatDate(de.from_reduce, 'MM-YYYY') }}</td>
            <td>{{ formatDate(de.to_reduce, 'MM-YYYY') }}</td>
            <td class="text-center">
              <b-btn variant="outline-secondary" @click="viewFile(de)" size="sm"><i class="icon ion-ios-document"></i></b-btn>
            </td>
            <td>
              <RadioChangeStatus
                :dependant="de"
                :disable="!canUpdateStatus"
                @dataChange="dataChange = true"
              />
            </td>
            <td class="text-center">
              <div >
                <b-btn @click="updateDependant(de)" variant="outline-ghtk mb-1" size="sm" title="Chỉnh sửa người phụ thuộc này">
                  <i class="ion ion-md-create"></i>
                </b-btn>
                <b-btn @click="deleteDependant(de)" variant="outline-danger mb-1" size="sm" title="Xóa người phụ thuộc này" :disabled="!canUpdateStatus">
                  <i class="ion ion-md-trash"></i>
                </b-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </b-modal>

    <!-- Note -->
    <NoteDependant :dependants="dependants" />
    <!-- log -->
    <LogDependant :profile="profile" />
    <!-- update -->
    <UpdateDependantPerson
      id="update-dependant-person-on-list"
      @updateOk="getDependantOfProfile"
      :curEdit="curDependant.id"
    />
    <!-- View file -->
    <FileDependant
      :dependant="curDependant"
      @dataChange="getDependantOfProfile"
    />
  </div>
</template>

<script>

// custom component
import NoteDependant from './ModalNoteDependant'
import LogDependant from './ModalLogDependant'
import RadioChangeStatus from './RadioChangeStatus'
import UpdateDependantPerson from './UpdateDependantPerson'
import FileDependant from './ModalFileDependant'

// service
import dependantService from 'domain/services/dependant-person-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// entities
import Dependant from 'domain/entities/Dependant'

export default {
  name: 'modal-list-dependant',

  components: {
    NoteDependant,
    LogDependant,
    RadioChangeStatus,
    UpdateDependantPerson,
    FileDependant
  },

  props: {
    profile: {
      default: null
    },

    mpFullname: {
      default: null
    },

    id: {
      default: 'modal-list-dependant'
    },

    filter: {
      default: _ => ({}),
      type: Object
    }
  },

  data: _ => ({
    dependants: [],
    canUpdateStatus: true,
    loading: false,
    dataChange: false,
    curDependant: {},
    relationship: Dependant.relationship
  }),

  watch: {},

  methods: {
    getDependantOfProfile (profile = null) {
      this.loading = true
      if (!profile) profile = this.profile
      if (!profile) {
        this.dependants.length = 0
        return
      }
      let param = {
        profile: profile,
        month: this.filter.month,
        status: this.filter.status
      }
      dependantService.getDependantOfProfile(param)
        .then(res => {
          if (res.data.success) this.dependants = res.data.data || []
          else helper.showMessage(res.data.message || 'Không lấy được danh sách người phụ thuộc !', 'warning')
        }).catch(e => {
          helper.showMessage('Không lấy được danh sách người phụ thuộc !', 'warning')
        }).then(_ => {
          this.loading = false
        })
    },

    deleteDependant (dependant) {
      if (!confirm('Bạn có chắc chắn muốn xóa người phụ thuộc ' + dependant.fullname + ' không ?')) {
        return
      }
      this.$startLoading()
      dependantService.deleteDependant({ dependantId: dependant.id })
        .then(res => {
          if (res.data.success) {
            this.getDependantOfProfile()
            helper.showMessage(res.data.message, 'success')
          } else {
            if (res.data.success === false) helper.showMessage(res.data.message || 'Không xóa được người phụ thuộc !', 'warning')
            if (res.data.type === 'permission') this.canUpdateStatus = false
          }
        })
        .catch(e => {
          helper.showMessage('Đã có lỗi xảy ra !', 'warning')
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    checkDataChange () {
      if (this.dataChange) this.$emit('dataChange')
    },

    updateDependant (dependant = null) {
      if (!dependant) return
      this.curDependant = dependant
      this.$bvModal.show('update-dependant-person-on-list')
    },

    viewFile (dependant) {
      if (!dependant) return
      this.curDependant = dependant
      this.$bvModal.show('modal-file-dependant')
    },

    formatDate (date, format = 'DD-MM-YYYY') {
      if (date) return helper.formatDate(date, format)
      return null
    }
  }
}
</script>
