<template>
    <div>
        <div class="ui-block">
            <b-row>
                <b-col md="6"><h4 class="ui-block-heading" style="display: inline-flex">Quản lý Secret Key</h4></b-col>
                <b-col class="text-right">
                    <b-btn variant="outline-success" style="padding: 5px 20px" @click="showModalAdd()">Thêm mới</b-btn>
                </b-col>
            </b-row>
            <hr>
        </div>
        <div class="mb-3">
            <b-card>
                <table class="table table-striped">
                    <thead class="thead-light">
                    <tr v-if="listKey.length > 0">
                        <th>App_code</th>
                        <th>Client ID</th>
                        <th>Secret Key</th>
                        <th>Địa chỉ Ip</th>
                        <th>Trạng thái</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(key,index) in listKey">
                        <td>
                            <b-form-input
                                    v-model="key.app_code"
                                    placeholder="Nhập app code"
                                    class="only-bottom-border"
                            >
                            </b-form-input>
                        </td>
                        <td>
                          <b-col>
                            <b-form-input
                              v-model="key.client_id"
                              placeholder="Nhập client ID"
                              class="only-bottom-border"
                            >
                            </b-form-input>
                          </b-col>
                        </td>
                        <td>
                            <b-col>
                                <b-form-input
                                        v-model="key.key"
                                        placeholder="Nhập secret key"
                                        class="only-bottom-border"
                                >
                                </b-form-input>
                            </b-col>
                        </td>
                        <td>
                            <b-col>
                                <b-form-input
                                        v-model="key.ip_address"
                                        placeholder="Nhập Ip"
                                        class="only-bottom-border"
                                >
                                </b-form-input>
                            </b-col>
                        </td>
                        <td style="padding-top: 20px">
                            <b-badge :variant="statusVariant[key.status]" class="status-badge cursor-pointer" @click="changeStatus(index)">{{statusLocale[key.status]}}</b-badge>
                        </td>
                        <td>
                            <b-btn variant="outline-danger" @click="deleteKey(key.id)" title="Xóa Secret Key"><i class="ion ion-md-trash"></i></b-btn>
                            <b-btn variant="outline-info" @click="updateKey(key)" title="Update Secret Key"><i class="ion ion-md-save"></i></b-btn>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </b-card>
        </div>

        <modal-add-key @reloadListKey="getListKey()"></modal-add-key>
    </div>
</template>

<script>

import profileService from 'domain/services/profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import ModalAddKey from './ModalAddKey'

export default {
  name: 'ManageToken',
  components: {
    ModalAddKey
  },
  data: () => ({
    listKey: [],
    statusVariant: {
      'disable': 'secondary',
      'active': 'success'
    },
    statusLocale: {
      'disable': 'Disable',
      'active': 'Active'
    }
  }),

  created () {
    this.getListKey()
  },

  computed: {},

  watch: {},

  methods: {
    getListKey () {
      profileService.getListKey().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.listKey = response.data.data
          }
        } else {
          commonHelper.showMessage(response.data.message, 'success')
        }
      }).catch((error) => {
        console.log(error)
      }).then(() => {
        this.$stopLoading()
      })
    },

    changeStatus (index) {
      let key = this.listKey[index]
      if (key.status === 'disable') { this.listKey[index].status = 'active' } else { this.listKey[index].status = 'disable' }
    },

    showModalAdd () {
      this.$bvModal.show('modal-add-key')
    },

    updateKey (key) {
      let data = {
        id: key.id,
        app_code: key.app_code,
        client_id: key.client_id,
        key: key.key,
        ip_address: key.ip_address,
        status: key.status
      }
      profileService.updateKey(data).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.getListKey()
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
    },

    deleteKey (id) {
      if (!confirm(`Bạn có chắc chắn muốn config key này không?`)) {
        return
      }
      let data = {
        id: id
      }
      profileService.deleteKey(data).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.getListKey()
            commonHelper.showMessage(response.data.message, 'success')
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
  }
}
</script>

<style scoped>
    .only-bottom-border {
        border-top: none;
        border-left: none;
        border-right: none;
    }
    .status-badge {
        width: 130px;
        padding: 5px;
    }
</style>
