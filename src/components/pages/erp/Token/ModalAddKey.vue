<template>
    <div>
        <b-modal id="modal-add-key" hide-footer>
            <template v-slot:modal-title>
                Thêm mới Secret Key
            </template>
            <div>
                <b-form-row>
                    <b-form-group class="col-md-12">
                        <template slot='label'>
                            App code <span class='red-text'>(*)</span>
                        </template>
                        <b-form-input
                                v-model="app_code"
                                placeholder="Mã app"
                                name="app_code"
                                v-validate="'required'"
                                :class="{'is-danger': errors.has('app_code')}"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('app_code') == 'required'" class="help is-danger">Không để trống trường này </span>
                    </b-form-group>
<!--                    <b-form-group class="col-md-12">-->
<!--                        <template slot='label'>-->
<!--                            Secret Key <span class='red-text'>(*)</span>-->
<!--                        </template>-->
<!--                        <b-form-input-->
<!--                                v-model="key"-->
<!--                                placeholder="Private Key"-->
<!--                                name="private_key"-->
<!--                                v-validate="'required'"-->
<!--                                :class="{'is-danger': errors.has('private_key')}"-->
<!--                        >-->
<!--                        </b-form-input>-->
<!--                        <span v-show="errors.firstRule('private_key') == 'required'" class="help is-danger">Không để trống trường này </span>-->
<!--                    </b-form-group>-->
                    <b-form-group class="col-md-12">
                        <template slot='label'>
                            Địa chỉ Ip được truy cập <span class='red-text'>(*)</span>
                        </template>
                        <b-form-input
                                v-model="ip_address"
                                placeholder="Địa chỉ Ip được truy cập"
                                name="ip_address"
                                v-validate="'required'"
                                :class="{'is-danger': errors.has('ip_address')}"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('ip_address') == 'required'" class="help is-danger">Không để trống trường này </span>
                    </b-form-group>
                </b-form-row>
            </div>
            <div class="text-center">
                <b-btn variant="success" style="padding: 5px 20px" @click="addKey()">Lưu lại</b-btn>
            </div>
        </b-modal>
    </div>
</template>

<style lang="scss" scoped>
    .is-danger {
        border-color: #E0B4B4;
        color: #9F3A38;
        box-shadow: none;
    }
</style>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import profileService from 'domain/services/profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})
export default {
  name: 'modal-add-key',

  components: {
  },

  props: [
  ],

  data: () => ({
    app_code: null,
    key: null,
    ip_address: null
  }),

  watch: {
  },

  methods: {
    addKey () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let dataSend = {
            app_code: this.app_code,
            key: this.key,
            ip_address: this.ip_address
          }
          profileService.addKey(dataSend).then(response => {
            if (response.data.hasOwnProperty('success')) {
              if (response.data.success) {
                this.$bvModal.hide('modal-add-key')
                this.$emit('reloadListKey')
                commonHelper.showMessage(response.data.message, 'success')
              } else {
                commonHelper.showMessage(response.data.message, 'warning')
              }
            } else {
              commonHelper.showMessage(response.data.message, 'warning')
            }
          }).catch((error) => {
            console.log(error)
          }).then(() => {
            this.$stopLoading()
          })
        }
      })
    }
  }
}
</script>
