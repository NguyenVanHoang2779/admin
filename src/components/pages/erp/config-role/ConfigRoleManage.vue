<template>
  <div class="wrapper">
    <b-row class="top topRowCustom align-items-center">
      <b-col md="4">
        <h4 class="m-0 h4">CONFIG PHÂN QUYỀN</h4>
      </b-col>
      <b-col md="8" class="text-right">
        <b-button variant="ghtk" @click="openAddModal">
          <i class="ion ion-md-add"></i> Thêm config
        </b-button>
      </b-col>
    </b-row>
    <b-row class="top topRowCustom align-items-center">
      <b-col md="4" style="z-index:2">
        <multiselect
          v-model="optionAlias"
          placeholder="Lọc theo Alias"
          label="value"
          track-by="value"
          selectedLabel="Chọn"
          deselectLabel="Bỏ chọn"
          selectLabel="Chọn"
          :options="listAlias"
          :searchable="true"
          deselect-label="Không thể bỏ chọn"
          :allow-empty="false"
        >
        </multiselect>
      </b-col>
      <b-col md="4">
        <multiselect
          v-model="optionObject"
          placeholder="Lọc theo loại phạm vi"
          label="value"
          track-by="value"
          selectedLabel="Chọn"
          deselectLabel="Bỏ chọn"
          selectLabel="Chọn"
          :options="listObject"
          :searchable="true"
          :allow-empty="false"
        >
        </multiselect>
      </b-col>
      <b-col md="4" class="text-right">
        <b-button class="btSearch" variant="ghtk" @click="getListConfig">
          <i class="ion ion-md-search"></i> Tìm kiếm
        </b-button>
      </b-col>
    </b-row>
    <div class="mb-3">
      <div class="wrapper-list-master">
        <b-card no-body>
          <table class="table table-hover table-bordered table-sm mb-0 mih-5re">
            <thead>
            <tr class="trCustom">
              <th hidden>ID</th>
              <th>Alias loại config</th>
              <th>Loại phạm vi</th>
              <th>Đối tượng</th>
              <th>Từ ngày</th>
              <th>Đến ngày</th>
              <th>Ghi chú</th>
              <th>Người chỉnh sửa</th>
              <th @click="sortModified('modified')">Thời gian chỉnh sửa</th>
              <th>Hành động</th>
            </tr>
            </thead>
            <tbody v-loading="appLoading" class="position-relative">
            <tr style="text-align: center;" v-for="(config, index) in sortedConfig" :key="index">
              <td hidden class="tdScroll"><div class="scrollable">{{config.id}}</div></td>
              <td >{{convertAlias(config.config_alias)}}</td>
              <td>{{convertObjectType(config.object_type)}}</td>
              <td>{{convertListObjectId(config.object_id)}}<span v-if="visibleListObjectId(config.object_id)" @click="openShowDetails(config.object_id)" style="cursor: pointer">...</span></td>
              <td>{{config.from}}</td>
              <td>{{config.to}}</td>
              <td>{{convertListObjectId(config.note)}}<span v-if="visibleListObjectId(config.note)" @click="openShowDetails(config.note)" style="cursor: pointer">...</span></td>
              <td>{{config.modified_by}}</td>
              <td>{{config.modified}}</td>
              <td>
                <b-button @click="sendDataModal(config, {'typeModal':'update'})" variant="ghtk" >
                  <i class="ion ion-md-create"></i>
                </b-button>
                <b-button @click="sendDataModal(config, {'typeModal':'delete'})" variant="ghtk" style="background-color: red" >
                  <i class="ion ion-md-trash"></i>
                </b-button>
              </td>
            </tr>
            </tbody>
          </table>
        </b-card>
      </div>
    </div>
    <ModalConfigRole
      v-show="isModalVisible"
      @close="closeModal"
      @loading ="reload"
      @loadUpdate="loadUpdate"
      :config-modal="configModal"
      :list-alias ="listAlias"
      :list-object ="listObject"
      />
    <showDetails
      :list-data="listData"
    />
  </div>
</template>
<style scoped lang="scss">
.wrapper .topRowCustom{
  margin-bottom: 20px;
}
.image-gallery {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  vertical-align: initial;
}
.wrapper-list-master {
  position: relative;
  min-height: 120px;
}
.h-col-50 .col-md-2 {
  max-height: 50px;
}

.table tbody tr td {
  word-break: break-all
}
.trCustom {
  background-color: #069255;
  color: white;
  height: 10%;
  font-weight: 700;
  text-align: center;
}
.trCustom th {
  padding-left: 10px;
  height: 52px;
  padding-bottom: 13px;
}

.btSearch {
  width: 22.6%;
}

.exporting-btn {
  span {
    position: relative; padding-left: 20px
  }
  .sk-folding-cube.sk-primary{
    position: absolute;
    height: 12px;
    width: 12px;
    top: -37px;
    left: 0
  }
}
</style>

<script>
// service
import ConfigRoleService from 'domain/services/config-role-service'
import ModalConfigRole from './ModalConfigRole'
import commonHelper from 'infrastructures/helpers/common-helpers'
import multiselect from 'vue-multiselect'
import showDetails from './showDetails'

export default {
  name: 'config-role',
  components: {
    ConfigRoleService,
    ModalConfigRole,
    commonHelper,
    multiselect,
    showDetails
  },
  data: () => ({
    ListConfig: [],
    listAlias: [],
    listObject: [],
    optionAlias: {name: 'bbs_same_customer', value: 'Đơn cùng khách BBS'},
    optionObject: {name: 'user', value: 'Theo người dùng'},
    configModal: {},
    appLoading: false,
    isModalVisible: false,
    currentSort: 'modified',
    currentSortType: 'asc',
    listData: ''
  }),

  watch: {
  },
  computed: {
    sortedConfig () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.ListConfig.sort((a, b) => {
        let modifier = 1
        let date1 = new Date(a[this.currentSort])
        let date2 = new Date(b[this.currentSort])
        if (this.currentSortType === 'desc') modifier = -1
        if (date1 < date2) return -1 * modifier
        if (date1 > date2) return 1 * modifier
        return 0
      })
    }
  },
  created () {
    this.getListAliasAndObject()
  },

  methods: {
    getListConfig (dataLoad) {
      this.appLoading = true
      let data = {}
      if (dataLoad.typeReload === 'insert' || dataLoad.typeReload === 'update') {
        data = {
          config_alias: dataLoad.config_alias,
          object_type: dataLoad.object_type
        }
      } else {
        data = {
          config_alias: this.optionAlias ? this.optionAlias.name : null,
          object_type: this.optionObject ? this.optionObject.name : null
        }
      }
      this.setOption(data)
      ConfigRoleService.getListConfig(data)
        .then(res => {
          if (res.data.success) {
            this.ListConfig = res.data.data
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    getListAliasAndObject () {
      ConfigRoleService.getListAliasAndObjectType()
        .then((response) => {
          if (response.data.success) {
            let rel1 = Object.entries(response.data.data.listAlias)
            let rel2 = Object.entries(response.data.data.listObjectType)
            this.listAlias = this.convertData(rel1)
            this.listObject = this.convertData(rel2)
            this.getListConfig({
              typeReload: null,
              config_alias: null,
              object_type: null
            })
          } else {
            this.listAlias = []
            this.listObject = []
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    setOption (data) {
      if (data.config_alias && this.listAlias && this.listAlias.length) {
        this.optionAlias = this.listAlias.find(option => {
          return option.name === data.config_alias
        })
      }
      if (data.object_type && this.listObject && this.listObject.length) {
        this.optionObject = this.listObject.find(option => {
          return option.name === data.object_type
        })
      }
    },

    visibleListObjectId (listObjectId) {
      if (listObjectId !== null) {
        if (listObjectId.length > 15) return true
      }
      return false
    },

    convertListObjectId (listObjectId) {
      if (listObjectId !== null) {
        let ObjectIds = listObjectId
        if (listObjectId.length > 50) {
          ObjectIds = listObjectId.slice(0, 50) + ''
        }
        return ObjectIds
      }
      return listObjectId
    },

    convertData (data) {
      data = data.map(function (item) {
        let obj = {}
        obj['name'] = item[0]
        obj['value'] = item[1]
        return obj
      })
      return data
    },

    convertAlias (Alias) {
      // eslint-disable-next-line no-return-assign
      let item = this.listAlias.find((option) => option.name === Alias)
      return (typeof (item.value) !== 'undefined') ? item.value : ''
    },

    convertObjectType (ObjectType) {
      // eslint-disable-next-line no-return-assign
      let item = this.listObject.find((option) => option.name === ObjectType)
      return (typeof (item.value) !== 'undefined') ? item.value : ''
    },
    sortModified (data) {
      if (data === this.currentSort) {
        this.currentSortType = this.currentSortType === 'asc' ? 'desc' : 'asc'
      }
      this.currentSort = data
    },
    openAddModal () {
      this.configModal = null
      this.$bvModal.show('id_modalConfig')
    },
    openShowDetails (data) {
      this.listData = data
      this.$bvModal.show('id_modalShowDetails')
    },
    closeModal () {
      this.optionAlias = null
      this.optionObject = null
      this.$bvModal.hide('id_modalConfig')
    },
    reload (data) {
      this.currentSortType = 'desc'
      this.getListConfig(data)
    },
    loadUpdate () {
      this.reload('update')
    },
    sendDataModal (config, type) {
      this.configModal = {...config, ...type}
      this.$bvModal.show('id_modalConfig')
    }
  }
}
</script>
