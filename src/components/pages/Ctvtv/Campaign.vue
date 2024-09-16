<template>
  <div>
    <b-row>
      <h3>Quản lí Campaign</h3>
    </b-row>
    <h3 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
      <div></div>
      <b-btn id="show-btn" @click="showModalCreateCampaign" variant="primary btn-round" class="d-block"><span class="ion ion-md-add"></span>&nbsp;Thêm Campaign</b-btn>
    </h3>
<!--    start modal create campaign -->
    <b-modal ref="modal-create-campaign" title="Thêm Campaign" hide-footer>
      <b-form>
        <b-form-group
          id="input-group-1"
          label="Tên Campaign: "
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            type="text"
            required
            placeholder="Nhập tên Campaign"
            v-model="formCreateCampaign.name"
          ></b-form-input>
        </b-form-group>

        <b-form-group
        id="input-group-2"
        label="Ngày bắt đầu Campaign: "
        label-for="input-2"
      >
          <datepicker
            v-model="formCreateCampaign.from"
            format='dd/MM/yyyy'
            :bootstrapStyling="true"
            :monday-first="true"
            :full-month-name="true"
            placeholder="Chọn ngày bắt đầu Campaign (dd/mm/yyyy)"
            :calendar-button="true"
            calendar-button-icon="ion ion-md-calendar"
            :clear-button="true"
          />
      </b-form-group>
        <b-form-group
          id="input-group-12"
          label="Ngày kết thúc Campaign: "
          label-for="input-3"
        >
          <datepicker
            v-model="formCreateCampaign.to"
            format='dd/MM/yyyy'
            :bootstrapStyling="true"
            :monday-first="true"
            :full-month-name="true"
            placeholder="Chọn ngày kết thúc Campaign (dd/mm/yyyy)"
            :calendar-button="true"
            calendar-button-icon="ion ion-md-calendar"
            :clear-button="true"
          />
        </b-form-group>
      </b-form>
<!--      <b-card class="mt-3" header="Form Data Result">-->
<!--        <pre class="m-0">{{formCreateCampaign}}</pre>-->
<!--      </b-card>-->
      <b-button class="mt-3" variant="primary" block @click="createCampaign" :disabled='isDisabled'>Thêm</b-button>
    </b-modal>
<!--      end modal create campaign-->
<!--    start modal edit campaign-->
    <b-modal title="Sửa Campaign" size="lg" ref="modal-edit-campaign" hide-footer>
<!--      <modal-config-campaign :row="row">-->
<!--      </modal-config-campaign>-->
      <b-form>
        <b-form-group
          id="input-group-1"
          label="Tên Campaign: "
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            type="text"
            required
            placeholder="Nhập tên Campaign"
            v-model="formEditCampaign.name"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-2"
          label="Ngày bắt đầu Campaign: "
          label-for="input-2"
        >
          <datepicker
            v-model="formEditCampaign.from"
            format='dd/MM/yyyy'
            :bootstrapStyling="true"
            :monday-first="true"
            :full-month-name="true"
            placeholder="Chọn ngày bắt đầu Campaign (dd/mm/yyyy)"
            :calendar-button="true"
            calendar-button-icon="ion ion-md-calendar"
            :clear-button="true"/>
        </b-form-group>
        <b-form-group
          id="input-group-2"
          label="Ngày kết thúc Campaign: "
          label-for="input-3"
        >
          <datepicker
            v-model="formEditCampaign.to"
            format='dd/MM/yyyy'
            :bootstrapStyling="true"
            :monday-first="true"
            :full-month-name="true"
            placeholder="Chọn ngày kết thúc Campaign (dd/mm/yyyy)"
            :calendar-button="true"
            calendar-button-icon="ion ion-md-calendar"
            :clear-button="true"
          />
        </b-form-group>
      </b-form>
      <b-button class="mt-3" variant="primary" block @click="updateCampaign">Cập nhập</b-button>
    </b-modal>
<!--    end modal edit campaign-->
    <b-card>
      <b-table
        id="my-table"
        small :fields="fields"
        :items="items"
        :per-page="perPage"
        :current-page="currentPage"
        responsive="sm">
        <!-- A virtual column -->
        <template v-slot:cell(stt)="data">
          {{data.index + 1}}
        </template>
        <template v-slot:cell(tencam)="data">
          {{data.item.name}}
        </template>
        <template v-slot:cell(ngaybd)="data">
          {{moment(data.item.activeTime).format('DD/MM/YYYY')}}
        </template>
        <template v-slot:cell(ngaykt)="data">
          {{moment(data.item.expireTime).format('DD/MM/YYYY')}}
        </template>
        <template v-slot:cell(btnedit)="data">
          <b-btn @click="cConfig(data)" variant="outline-success icon-btn" class="d-block btn-lg"><span class="ion ion-md-settings"></span></b-btn>
        </template>
        <template v-slot:cell(btneditcam)="data">
          <b-btn @click="cEdit(data)" variant="outline-info icon-btn" class="d-block btn-lg"><span class="ion ion-md-create"></span></b-btn>
        </template>
        <template v-slot:cell(btnremove)="data">
          <b-btn @click = "removeCampaign(data)" variant="outline-danger icon-btn" class="btn-lg"><i class="ion ion-md-close"></i></b-btn>
        </template>
      </b-table>
    </b-card>
    <br>
    <div class="overflow-auto">
      <b-pagination
        v-model="currentPage"
        :items="items"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        align="right"
      ></b-pagination>
    </div>
    <!--    start modal thông báo không tìm thấy dữ liệu-->
    <b-modal ref="modal-noti" hide-footer title="Thông báo">
      <div class="d-block text-center">
        <h3>Chưa có Campaign cho cộng tác viên thời vụ, đóng thông báo để tạo chúng</h3>
      </div>
      <b-button class="mt-3" variant="outline-danger" block @click="hideModal">Đóng</b-button>
    </b-modal>
    <!--    end modal thông báo không tìm thấy dữ liệu-->
  </div>
</template>

<script>
import ModalConfigCampaign from './ModalConfigCampaign'
import CtvtvService from 'domain/services/ctvtv-service'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'

export default {
  created () {
    this.viewListCampaign()
  },

  methods: {
    moment (data) {
      return moment(data)
    },

    hideModal () {
      this.$refs['modal-noti'].hide()
    },

    viewListCampaign () {
      this.$startLoading()
      CtvtvService.getListCampaign().then(response => {
        if (response.data.success) {
          this.items = response.data.data
          this.$stopLoading()
        } else {
          this.$refs['modal-noti'].show()
        }
      }).catch(e => {
        this.errors.push(e)
      })
    },

    showModalCreateCampaign () {
      this.$refs['modal-create-campaign'].show()
    },

    createCampaign () {
      this.isDisabled = true
      this.$startLoading()
      CtvtvService.createCampaign(this.formCreateCampaign).then(response => {
        if (response.data.success) {
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: response.data.message
          })
          this.$stopLoading()
          this.$refs['modal-create-campaign'].hide()
          this.formCreateCampaign.name = ''
          this.formCreateCampaign.from = ''
          this.formCreateCampaign.to = ''
          this.viewListCampaign()
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
        this.isDisabled = false
      }).catch(e => {
        this.errors.push(e)
      })
    },

    updateCampaign () {
      this.$startLoading()
      CtvtvService.updateCampaign(this.formEditCampaign).then(response => {
        if (response.data.success) {
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: response.data.message
          })
          this.formEditCampaign.name = ''
          this.formEditCampaign.from = ''
          this.formEditCampaign.to = ''
          this.$stopLoading()
          this.viewListCampaign()
          this.$refs['modal-edit-campaign'].hide()
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).catch(e => {
        this.errors.push(e)
      })
    },

    removeCampaign (row) {
      if (confirm('Bạn có chắc chắn muốn xóa "' + row.item.name + '"')) {
        this.$startLoading()
        CtvtvService.removeCampaign(row.item).then((response) => {
          if (response.data.success) {
            this.$notify({
              group: 'default',
              type: 'bg-success text-white',
              title: 'Thông báo',
              text: response.data.message
            })
            this.$stopLoading()
            this.viewListCampaign()
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: response.data.message
            })
          }
        }).catch(e => {
          this.errors.push(e)
        })
      } else {
        // something
      }
    },

    cEdit (row) {
      this.formEditCampaign.id = row.item.id
      this.formEditCampaign.name = row.item.name
      this.formEditCampaign.from = row.item.activeTime
      this.formEditCampaign.to = row.item.expireTime
      this.$refs['modal-edit-campaign'].show()
    },

    cConfig (row) {
      this.$router.push({name: 'config-campaign', query: { id: row.item.id }})
    }
  },

  components: {
    ModalConfigCampaign,
    Datepicker
  },

  computed: {
    rows () {
      return this.items.length
    }
  },

  data () {
    return {
      isDisabled: false,
      formCreateCampaign: {
        name: '',
        from: '',
        to: ''
      },
      formEditCampaign: {
        id: '',
        name: '',
        from: '',
        to: ''
      },
      fId: {
        id: ''
      },
      perPage: 6,
      currentPage: 1,
      fields: [
        'STT',
        { key: 'tencam', label: 'Tên Campaign' },
        { key: 'ngaybd', label: 'Ngày đắt đầu' },
        { key: 'ngaykt', label: 'Ngày kết thúc' },
        { key: 'btnedit', label: '' },
        { key: 'btneditcam', label: '' },
        { key: 'btnremove', label: '' }
      ],
      items: [],
      row: {}
    }
  }
}
</script>
