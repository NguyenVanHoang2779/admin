<template>
  <div>
    <b-modal id="modal-gchat-cod" ref="modalGChatCod" @hidden="resetDefault">
          <template #modal-header="{ close }">
            <div style="display: flex;align-items: center; width: 100%;">
              <button type="button" class="btn btn-success" style="background: #00904A;" @click="hideModal()"><i
                class="fas fa-angle-left"></i></button>
              <div style="text-align: center; width: 85%;"><p style="margin: 0px;">Đánh giá</p></div>
            </div>
          </template>
          <div class="">
            <div><input type="radio" name="green_type_channel" id="rd-1" value="1" v-model="type_channel"
                   style="width: 15px; height: 15px;"/><label for="rd-1" class="radio-button">Chat với {{type_staff}}</label></div>
            <div>
            <input type="radio" name="green_type_channel" id="rd-2" value="2" v-model="type_channel"
                   style="width: 15px; height: 15px;"/><label for="rd-2" class="radio-button">Chat với Quản lý {{type_staff}}</label></div>
            <div>
            <input type="radio" name="green_type_channel" id="rd-3" value="3" v-model="type_channel"
                   style="width: 15px; height: 15px;"/><label for="rd-3" class="radio-button">Tạo nhóm chat với {{type_staff}} và Quản lý {{type_staff}}</label></div>
          </div>
          <div class="display-center" style="margin-top: 5px;" v-if="type_channel==3">
            <div style="margin-right: 15px;">Vấn đề: </div>
            <input type="radio" name="green_name_channel" id="rd-4" value="Sự vụ ĐH" v-model="name_channel"
                   style="width: 15px; height: 15px; margin-left: 5px;"/><label for="rd-4" class="radio-button">Sự vụ ĐH</label>
            <input type="radio" name="green_name_channel" id="rd-5" value="Sự vụ thái độ" v-model="name_channel"
                   style="width: 15px; height: 15px; margin-left: 5px;"/><label for="rd-5" class="radio-button">Sự vụ thái độ</label>
            <input type="radio" name="green_name_channel" id="rd-6" value="Năng suất" v-model="name_channel"
                   style="width: 15px; height: 15px; margin-left: 5px;"/><label for="rd-6" class="radio-button">Năng suất</label>
            <input type="radio" name="green_name_channel" id="rd-7" value="Đào tạo" v-model="name_channel"
                                 style="width: 15px; height: 15px; margin-left: 5px;"/><label for="rd-7" class="radio-button">Đào tạo</label>
          </div>
          <template #modal-footer="{ close }">
            <div style="display: flex;align-items: center; width: 100%;">
              <b-button variant="success" id="modal-gchat-cod-btn-confirm" name="modal-gchat-cod-btn-confirm" style="background: #00904A; width: 100%;" :disabled="disabled"
                      @click="getGChatChannel()">Xác nhận
              </b-button>
            </div>
          </template>
    </b-modal>
  </div>
</template>
<style src="@/assets/sass/components/kpi-cod-profile.scss" lang="scss"></style>
<style scoped >
input[name="green_type_channel"] {
  accent-color: #00904A;
}
input[name="green_name_channel"] {
  accent-color: #00904A;
}
.radio-button {
  font-size: 15px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 0px;
}

.display-center {
  display: flex;
  align-items: center;
  text-align: center;
}
.display-flex-wrap {
  display: flex;
  flex-wrap: wrap;
}
input[type=text] {
  border: 0px solid #fff;
  border-bottom: 1px solid #c1bebe;
  outline: none;
}
::placeholder {
  color: #888888;
  opacity: 1; /* Firefox */
}
input[type=text]:focus {
  border: 0px solid #fff;
  border-bottom: 1px solid #c1bebe;
}
</style>

<script>
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import kpiProfilesService from 'domain/services/kpi-profiles-service'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'modal-gchat-cod',

  components: {
    SweetModal,
    SweetModalTab,
    Moment,
    commonHelper,
    kpiProfilesService
  },

  props: [
    'user',
    'pkg_order',
    'trigger',
    'type'
  ],

  data: () => ({
    type_channel: 1,
    name_channel: '',
    disabled: false,
    type_staff: 'COD'
  }),

  created () {
  },

  watch: {
    trigger: function () {
      this.$refs['modalGChatCod'].show()
    },
    name_channel: function () {
      if (this.name_channel === '' && this.type_channel === '3') {
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    type_channel: function () {
      if (this.type_channel !== '3') {
        this.name_channel = ''
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    type: function () {
      if (this.type === 'COD') {
        this.type_staff = 'COD'
      } else if (this.type === 'XLHH') {
        this.type_staff = 'NV xử lý hàng'
      } else if (this.type === 'DRIVER') {
        this.type_staff = 'Tài xế'
      } else {
        this.type_staff = 'Staff'
      }
    }
  },

  methods: {
    hideModal () {
      this.$refs.modalGChatCod.hide()
    },
    resetDefault () {
      this.name_channel = ''
    },
    getGChatChannel () {
      let parmas = {
        user_id: this.user,
        type_channel: this.type_channel,
        name_channel: this.name_channel
      }
      kpiProfilesService.getGChatChannel(parmas)
        .then((res) => {
          if (res.data.success) {
            window.open(res.data.data, '_blank').focus()
            this.hideModal()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
