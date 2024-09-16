<template>
  <div>
    <b-modal
      id="modal-add-work-transfer"
      v-model="show"
      static
      size="lg"
      @hidden="close"
    >
      <div slot="modal-title">Thêm nhanh ứng viên</div>
      <div class="col-md-12 form">
        <div class="form-group">
          <p class="form-title">
            Tên ứng viên <span class="highlight">*</span>
          </p>
          <b-form-input
            v-model="name"
            placeholder="Nguyễn Văn A"
          ></b-form-input>
        </div>
        <div class="form-group">
          <p class="form-title">Số điện thoại <span class="highlight">*</span></p>
          <b-form-input
            v-model="phone"
            placeholder="0936000000"
          ></b-form-input>
        </div>
        <div class="form-group">
          <p class="form-title">Chọn tỉnh<span class="highlight">*</span></p>
          <SingleSelectProvince
            @handleSelectedProvince="option => provinceId = option.id"
            placeholder="Chọn tỉnh"
          />
        </div>
        <div class="form-group">
          <p class="form-title">
            Nguồn tuyển dụng
          </p>
          <single-select-referral
            @on-select="handleSelectedRefferal"
            :reset="resetSelectRefferal"
          >
          </single-select-referral>
        </div>
      </div>
      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="close()">
          Hủy
        </button>
        <button type="button" class="btn btn-primary" @click="done">
          Đồng ý
        </button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import SingleSelectReferral from './SingleSelectReferral'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'

export default {
  components: {SingleSelectReferral, SingleSelectProvince},
  props: ['open'],
  data: () => ({
    show: false,
    name: '',
    phone: '',
    provinceId: null,
    referral: '',
    resetSelectRefferal: false
  }),

  watch: {
    open (status) {
      this.show = status
    }
  },

  methods: {
    done () {
      this.$emit('create', {
        name: this.name,
        phone: this.phone,
        referral: this.referral,
        provinceId: this.provinceId
      })
      this.resetSelectRefferal = !this.resetSelectRefferal
    },
    handleSelectedRefferal (referral) {
      if (referral) {
        this.referral = referral.value
      } else {
        this.referral = ''
      }
    },
    close () {
      this.name = ''
      this.phone = ''
      this.referral = ''
      this.resetSelectRefferal = !this.resetSelectRefferal
      this.$emit('toogle', false)
    }
  }
}
</script>

<style>
.highlight {
  color: red;
}
</style>
