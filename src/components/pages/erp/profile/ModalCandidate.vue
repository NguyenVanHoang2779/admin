<template>
  <div>
    <b-modal size="lg" id="modal-candidate" ref="refCandidate" @hidden="resetDefault" @show="findCandidate" static>
      <div slot="modal-title">
          Liên kết ứng viên
      </div>
      <div>
          <div v-if="candidate">
              <b-table striped hover :items="candidate" :fields="showFields">
                <template v-slot:cell(referrer.fullname)="data">
                  <span v-if="!data.item.editReferrer">{{data.value}}</span>
                  <single-select-candidate-referrer
                    v-else
                    @handleChooseRefferer="assignReferrer(data.index, ...arguments)"
                    :referrerId="data.item.referrer_id"
                  >

                  </single-select-candidate-referrer>
                </template>
                <template v-slot:cell(created)="data">
                  {{moment(data.item.created).format('DD-MM-YYYY')}}
                </template>
                <template v-slot:cell(action)="data">
                  <div class="text-center">
                    <b-btn @click="data.item.editReferrer = true" variant="outline-primary" size="sm" title="Chỉnh sửa người giới thiệu" v-if="!data.item.editReferrer && data.item.referrer_id !== ''">
                      <i class="ion ion-md-create"></i>
                    </b-btn>
                    <b-btn variant="success" size="sm" title="Lưu người giới thiệu" @click="updateReferrer(data.index)" v-else><i class="fa fa-file"></i></b-btn>
                  </div>
                </template>
              </b-table>
          </div>
          <div v-else>
              <p>Không tìm thấy hồ sơ ứng viên (<b-btn variant="link" class="p-0" @click="findLinkableCandidate">Tìm hồ sơ ứng viên tương thích để liên kết</b-btn>)</p>
              <b-table v-if="linkableCandidates" striped hover :items=linkableCandidates :fields="showFieldsLinkable">
                <template v-slot:cell(created)="data">
                  {{moment(data.item.created).format('DD-MM-YYYY')}}
                </template>
                <template v-slot:cell(action)="data">
                  <b-btn size="sm" variant="outline-primary" @click="link(data.item.id)"><i class="ion ion-ios-link"></i> Liên kết</b-btn>
                </template>
              </b-table>
          </div>
      </div>
      <template slot="modal-footer">
        <button type="button" class="btn btn-primary pl-4 pr-4" @click="hideModal">Đóng</button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import candidateService from 'domain/services/candidate-service'
import SingleSelectCandidateReferrer from 'components/pages/Candidate/SingleSelectCandidateReferrer'
import moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'modal-candidate',

  components: {
    SingleSelectCandidateReferrer
  },

  props: [
    'masterId',
    'identifyId'
  ],

  data: () => ({
    candidate: null,
    linkableCandidates: null,
    showFields: [
      {
        key: 'id',
        label: 'ID'
      },
      {
        key: 'name',
        label: 'Họ Tên'
      },
      {
        key: 'referrer.fullname',
        label: 'Người giới thiệu'
      },
      {
        key: 'job_name',
        label: 'Vị trí'
      },
      {
        key: 'province_register_name',
        label: 'Tỉnh đăng ký'
      },
      {
        key: 'created',
        label: 'Ngày tạo hồ sơ'
      },
      {
        key: 'action',
        label: 'Thao tác'
      }
    ],
    showFieldsLinkable: [
      {
        key: 'id',
        label: 'ID'
      },
      {
        key: 'name',
        label: 'Họ Tên'
      },
      {
        key: 'referrer.fullname',
        label: 'Người giới thiệu'
      },
      {
        key: 'job_name',
        label: 'Vị trí'
      },
      {
        key: 'province_register_name',
        label: 'Tỉnh đăng ký'
      },
      {
        key: 'created',
        label: 'Ngày tạo hồ sơ'
      },
      {
        key: 'action',
        label: 'Action'
      }
    ]
  }),

  created () {
  },

  watch: {
  },

  methods: {
    link (candidateId) {
      let dataSend = {
        'candidate_id': candidateId,
        'master_id': this.masterId
      }
      candidateService.linkToMasterProfile(dataSend)
        .then(response => {
          if (response.data.success) {
            this.$notify({
              group: 'default',
              type: 'bg-primary text-white',
              title: 'Thông báo',
              text: response.data.message
            })
            this.hideModal()
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-danger text-white',
              title: 'Thông báo',
              text: response.data.message
            })
          }
        })
    },

    moment (data) {
      return moment(data)
    },

    assignReferrer (index, value) {
      if (value && value.id) {
        this.candidate[index].referrer_id = value.id
        this.candidate[index].referrer = value
      }
    },

    updateReferrer (candidateIndex) {
      this.$startLoading()
      if (this.candidate[candidateIndex] && this.candidate[candidateIndex].referrer_id) {
        let params = {
          id: this.candidate[candidateIndex].id,
          referrer_id: this.candidate[candidateIndex].referrer_id
        }
        candidateService.updateReferrer(params).then((res) => {
          if (res.data.success) {
            this.candidate[candidateIndex].editReferrer = false
            commonHelper.showMessage(res.data.message, 'success')
          } else commonHelper.showMessage(res.data.message, 'warning')
        }).catch((e) => {
          console.log(e)
        })
      }
      this.$stopLoading()
    },

    findCandidate () {
      candidateService.getCandidateList({'master_profile_id': this.masterId})
        .then(response => {
          if (response.data.success) {
            if (response.data.data.count > 0) {
              response.data.data.candidates.forEach(element => {
                if (!(['rejected', 'refused', 'resigned'].includes('' + element.status))) {
                  if (!element.referrer_id) element.editReferrer = true
                  else element.editReferrer = false
                  this.candidate = [element]
                }
              })
            } else {
              this.candidate = null
            }
          }
        })
    },

    findLinkableCandidate () {
      candidateService.getCandidateList({'name_cmnd_phone_mail': this.identifyId})
        .then(response => {
          if (response.data.success) {
            if (response.data.data.count > 0) {
              this.linkableCandidates = response.data.data.candidates
            } else {
              this.linkableCandidates = null
              alert('Không tìm thấy ứng viên phù hợp để liên kết')
            }
          }
        })
    },

    hideModal () {
      this.$refs.refCandidate.hide()
    },

    resetDefault () {
      this.candidate = null
      this.linkableCandidates = null
    }
  }
}
</script>
