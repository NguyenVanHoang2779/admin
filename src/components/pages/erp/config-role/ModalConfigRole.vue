<template>
  <div>
    <b-modal
      :title=title
      id="id_modalConfig" >
      <b-form v-loading="loading">
        <b-row class="mb-3">
          <b-col>
            <b-form-group label="Alias loại config">
              <SingleSelectAlias :is-disabled="typeDisabled" :alias-config="config_alias" :type-role="alias" @handleSelectedOption="handleSelectedAlias"></SingleSelectAlias>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row v-if="typeDisabled && idEdit === 'update'" class="mb-3">
          <b-col>
            <b-form-group label="Kiểu update">
              <multiselect
                label="value"
                track-by="value"
                v-model="typeUpdate"
                :options="optionUpdate"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel="Chọn"
                :allow-empty="false"
                @select="setDisable"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row v-if="typeDisabled && idEdit === 'delete'" class="mb-3">
          <b-col>
            <b-form-group label="Kiểu xoá">
              <multiselect
                label="value"
                track-by="value"
                v-model="typeDelete"
                :options="optionDelete"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel="Chọn"
                :allow-empty="false"
                @select="setDisable"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row v-if="typeDisabled && typeUpdate.name === 'update2' || typeDelete.name === 'delete2'" class="mb-3">
          <b-col md="9">
            <label class="form-label">Nhập danh sách đối tượng</label>
            <b-form-input
              id="input-live"
              v-model="listObjectId"
              :state="checkUniqueListId"
              placeholder="Nhập định dạng 1,2,3,4,..."
              aria-describedby="input-live-help input-name-feedback"
            trim>
            </b-form-input>
          </b-col>
          <b-col class="col-md-1 mt-4">
            <b-btn @click="mapData" variant="primary">Thêm</b-btn>
          </b-col>
          <b-form-invalid-feedback id="input-live-feedback">
            Nhập trùng đối tượng = {{ duplicateObjectId }}
          </b-form-invalid-feedback>
        </b-row>
        <b-row v-if="typeDisabled" class="mb-3">
          <b-col>
            <b-form-group v-if="typeUpdate.name === 'update2' || typeDelete.name === 'delete2'" label="Chọn đối tượng">
              <multiselect
                class="custom-multiselect"
                v-model="objectIdSelected"
                label="objectId"
                track-by="id"
                placeholder=""
                :options="optionsObjectId"
                :multiple="true"
                :searchable="true"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel=""
                :internal-search="true"
                :clear-on-select="true"
                :close-on-select="false"
                :hide-selected="false"
                >
                <span slot="noResult">Không có kết quả phù hợp</span>
                <span slot="noOptions">Không có dữ liệu</span>
              </multiselect>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <b-form-group label="Phạm vi">
              <SingleSelectAlias :is-disabled="typeDisabled" :alias-config="object_type" :type-role="object" @handleSelectedOption="handleSelectedObject"></SingleSelectAlias>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Đối tượng">
              <b-form-input
                :disabled="isDisabled"
                v-model="object_id"
                placeholder="Nhập định dạng 1,2,3,4,..."
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <div class="lb_holiday lb_holiday_2">Thời gian áp dụng</div>
        <div class="css_holiday_custom">
          <b-row class="mb-3">
            <b-col>
              <b-form-group
                label="Ngày bắt đầu"
              >
                <datepicker
                  :disabled="isDisabledDelete"
                  v-model="date_from"
                  format="yyyy-MM-dd"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  :clear-button="true"
                  placeholder="Chọn ngày bắt đầu"
                />
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group
                label="Ngày kết thúc"
              >
                <datepicker
                  :disabled="isDisabledDelete"
                  v-model="date_to"
                  format="yyyy-MM-dd"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  :clear-button="true"
                  placeholder="Chọn ngày kết thúc"
                />
              </b-form-group>
            </b-col>
          </b-row>
        </div>
        <b-row class="mb-3">
          <b-col>
            <b-form-group
              label="Ghi chú"
            >
              <b-form-textarea
                :disabled="isDisabledDelete"
                v-model="note"
                placeholder="Nhập ghi chú..."
                required
              ></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <template slot="modal-footer">
        <button v-if="idEdit === null" type="button" class="btn btn-success" @click="create()" style="margin-right: 41%">Thêm mới</button>
        <button v-if="idEdit === 'update' " type="button" class="btn btn-success" @click="create()" style="margin-right: 41%; background-color: coral">Cập nhật</button>
        <button v-if="idEdit === 'delete' " type="button" class="btn btn-success" @click="deleteConfig()" style="margin-right: 41%; background-color: red">Xoá</button>
      </template>
    </b-modal>
  </div>
</template>

<script>

import ConfigRoleService from 'domain/services/config-role-service'
import multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SingleSelectAlias from 'components/elements/common/SingleSelectConfigAlias'

export default {
  name: 'ModalConfigRole',
  components: {
    ConfigRoleService,
    Datepicker,
    Moment,
    SingleSelectAlias,
    multiselect
  },
  props: {
    configModal: {},
    isDelete: false,
    isAdd: true,
    listAlias: null,
    listObject: null
  },

  data () {
    return {
      loading: false,
      config_alias: '',
      object_type: '',
      alias: '',
      object: '',
      object_id: '',
      date_from: '',
      date_to: '',
      note: '',
      title: 'Thêm config',
      idEdit: null,
      typeDisabled: false,
      isDisabled: false,
      isDisabledDelete: false,
      typeUpdate: {
        'name': 'update1',
        'value': 'Chỉnh sửa toàn bộ'
      },
      optionUpdate: [
        {
          'name': 'update1',
          'value': 'Chỉnh sửa toàn bộ'
        },
        {
          'name': 'update2',
          'value': 'Chỉnh sửa thời gian áp dụng cho các đối tượng nhất định'
        }
      ],
      typeDelete: {
        'name': 'delete1',
        'value': 'Xoá toàn bộ'
      },
      optionDelete: [
        {
          'name': 'delete1',
          'value': 'Xoá toàn bộ'
        },
        {
          'name': 'delete2',
          'value': 'Xoá một số đối tượng nhất định'
        }
      ],
      objectIdSelected: [],
      optionsObjectId: [],
      listObjectId: '',
      duplicateObjectId: null
    }
  },
  computed: {
    checkUniqueListId () {
      let data = this.listObjectId.split(',')
      let arrUnique = []
      for (let ObjectId of data) {
        if (!arrUnique.includes(ObjectId)) {
          if (ObjectId !== '') arrUnique.push(ObjectId)
        } else {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.duplicateObjectId = ObjectId
          return false
        }
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.duplicateObjectId = null
      return true
    }
  },
  watch: {
    configModal: function (newValue, oldValue) {
      if (newValue) {
        this.ModalConvert()
      } else {
        this.reset()
      }
    },
    listAlias: function (newValue, oldValue) {
      this.sendData(newValue, 'alias')
    },

    listObject: function (newValue, oldValue) {
      this.sendData(newValue, 'object')
    }
  },
  methods: {
    async create () {
      let formData = new FormData()
      let data
      let type = 'insert'
      if (this.duplicateObjectId !== null) {
        return commonHelper.showMessage('Trùng id = ' + this.duplicateObjectId, 'warning')
      }
      if (this.config_alias === '' || this.object_type === '' || this.object_id === null) {
        return commonHelper.showMessage('Nhập đầy đủ thông tin', 'warning')
      } else {
        formData.append('config_alias', this.config_alias)
        formData.append('object_type', this.object_type)
        formData.append('from', Moment(this.date_from).format('YYYY-MM-DD'))
        formData.append('to', Moment(this.date_to).format('YYYY-MM-DD'))
        formData.append('note', this.note)
        if (this.idEdit === 'update') {
          if (this.date_from === this.configModal.from && this.date_to === this.configModal.to && this.object_id === this.configModal.object_id && this.objectIdSelected.length === 0 && this.note === this.configModal.note) {
            return commonHelper.showMessage('Vui lòng nhập thay đổi', 'warning')
          }
          type = 'update'
          formData.append('id', this.configModal.id)
          formData.append('object_ids_before', this.configModal.object_id)
          if (this.typeUpdate.name === 'update2') {
            if (this.objectIdSelected.length > 0) {
              let arr = this.objectIdSelected.map((item) => item['objectId'])
              formData.append('object_ids', arr.join())
            }
            formData.append('typeUpdate', 'update')
          } else {
            formData.append('object_ids', this.object_id)
            formData.append('typeUpdate', 'updateAll')
          }
          data = await ConfigRoleService.apiConfig(formData)
        } else {
          formData.append('object_ids', this.object_id)
          data = await ConfigRoleService.apiConfig(formData)
        }
      }
      if (data.data.success) {
        let dataReload = {
          typeReload: type,
          config_alias: this.config_alias,
          object_type: this.object_type
        }
        await this.onClose()
        commonHelper.showMessage(data.data.message, 'success')
        this.$emit('loading', dataReload)
      } else {
        commonHelper.showMessage(data.data.message, 'warning')
        if (data.data.data === 'err' && type !== 'update') {
          commonHelper.showMessage('Vui lòng chọn chức năng cập nhật hoặc xoá bản ghi cũ trước khi thêm mới', 'warning')
        }
      }
    },
    async onClose () {
      await this.reset()
      this.$emit('close', false)
    },
    reset (close = true) {
      if (close) this.open = false
      this.config_alias = ''
      this.object_type = ''
      this.object_id = ''
      this.date_from = ''
      this.date_to = ''
      this.note = ''
      this.title = 'Thêm config'
      this.idEdit = null
      this.typeDisabled = false
      this.isDisabled = false
      this.isDisabledDelete = false
      this.objectIdSelected = []
      this.listObjectId = ''
      this.duplicateObjectId = null
    },
    ModalConvert () {
      if (this.configModal === null) return
      this.config_alias = this.configModal.config_alias
      this.object_type = this.configModal.object_type
      this.object_id = this.configModal.object_id
      this.date_from = this.configModal.from
      this.date_to = this.configModal.to
      this.note = this.configModal.note
      this.idEdit = this.configModal.typeModal
      this.typeDisabled = true
      this.isDisabledDelete = false
      this.objectIdSelected = []
      this.listObjectId = ''
      this.duplicateObjectId = null
      this.typeUpdate = {
        'name': 'update1',
        'value': 'Chỉnh sửa toàn bộ'
      }
      this.typeDelete = {
        'name': 'delete1',
        'value': 'Xoá toàn bộ'
      }
      if (this.configModal.typeModal === 'update') {
        this.title = 'Chỉnh sửa config'
        this.isDisabled = false
      } else {
        this.title = 'Xoá config'
        this.isDisabledDelete = true
        this.isDisabled = true
      }
      this.optionsObjectId = this.convertListOption(this.configModal.object_id, this.configModal.id)
    },

    sendData: function (data, type) {
      if (type === 'alias') {
        this.alias = [data, type]
      } else {
        this.object = [data, type]
      }
    },

    handleSelectedAlias: function (option) {
      this.config_alias = option ? option.name : ''
    },

    handleSelectedObject: function (option) {
      this.object_type = option ? option.name : ''
    },

    setDisable: function ({name, value}) {
      if (this.idEdit === 'update') {
        this.typeUpdate = {name, value}
        if (this.typeUpdate.name === 'update2') {
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      } else {
        this.typeDelete = {name, value}
        this.isDisabled = true
      }
    },
    convertListOption (listObjectId, listId) {
      let aDataListId = listId.split(',')
      let aDataListObjectId = listObjectId.split(',')
      let options = aDataListId.map(function (val, idx) {
        let option = {}
        option['id'] = val
        option['objectId'] = aDataListObjectId[idx]
        return option
      })
      return options
    },
    mapData () {
      if (this.listObjectId.length > 0) {
        if (this.duplicateObjectId !== null) {
          return commonHelper.showMessage('Trùng id = ' + this.duplicateObjectId, 'warning')
        }
        let data = this.listObjectId.split(',')
        let dataObjectId = []
        for (let objectId of data) {
          let optionObject = this.optionsObjectId.find((option) => option['objectId'] === objectId)
          if (optionObject) {
            dataObjectId = [...dataObjectId, optionObject]
          }
        }
        this.objectIdSelected = dataObjectId
      }
    },
    deleteConfig () {
      if (!confirm('Bạn có chắc chắn muốn xóa các bản ghi này không')) return 1
      let data = {}
      if (this.typeDelete.name === 'delete1') {
        data = {
          ids: this.configModal.id
        }
      } else {
        if (this.objectIdSelected.length > 0) {
          let arr = this.objectIdSelected.map((item) => item['id'])
          data = {
            ids: arr.join()
          }
        }
      }
      if (data.length !== 0) {
        ConfigRoleService.deleteConfig(data)
          .then(res => {
            if (res.data.success) {
              this.$emit('loadUpdate')
              this.$bvModal.hide('id_modalConfig')
              return commonHelper.showMessage(res.data.message, 'success')
            } else {
              return commonHelper.showMessage(res.data.message, 'warning')
            }
          })
          .catch(e => {
            console.log(e)
          })
          .then(() => {
            this.appLoading = false
          })
      } else {
        return commonHelper.showMessage('Đã xảy ra lỗi', 'warning')
      }
    }
  }
}
</script>

<style scoped>
.custom-file{
  margin-bottom: 10px;
}

.css_holiday_custom{
  border: 1px solid #e7e8e8;
  padding: 5px 22px;
  margin-bottom: 9px;
}
.lb_holiday{
  margin: -19px 5px 5px -5px;
  padding: 5px 5px 5px 5px;
  font-weight: 500;
  font-size: 13px;
}
.lb_holiday_2{
  margin-top: 10px;
}
</style>
