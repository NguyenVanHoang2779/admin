<template>
  <div>
  <b-modal v-model="showEditModal" hide-footer title="Cập nhập ticket con" ref="edit-subticket" @hide="resetForm" static>
    <b-form>
      <b-form-group>
        <span slot="label">Tên Ticket <span class="text-danger">(*)</span></span>
        <b-input
          v-model="formEdit.name"
          required
        ></b-input>
      </b-form-group>
      <b-form-group label="Hotline">
        <b-input
          v-model="formEdit.hotline"
        ></b-input>
      </b-form-group>
      <b-form-group label="Ghi chú">
        <b-textarea
          v-model="formEdit.note"
        ></b-textarea>
      </b-form-group>
      <b-form-group label="Hướng dẫn ban đầu">
        <b-textarea
          v-model="formEdit.initial_instruction"
        ></b-textarea>
      </b-form-group>
      <div class="text-center w-100"><b-button variant="primary" @click="updateTicket()">Cập nhập</b-button></div>
    </b-form>
  </b-modal>

  <b-modal static :id="'view-modal' + parent_id" :title="titleMessage">
    <div class="text-center">{{ message }}</div>
    <div class="text-center" slot="modal-footer"><b-button variant="primary" @click="$bvModal.hide('view-modal' + parent_id)">Đóng</b-button></div>
  </b-modal>

  <b-modal v-model="showRuleModal" static :id="'rule-modal' + parent_id" :title="ruleModelTitle">
    <div>
      <label>Vị trí có quyền</label>
      <MultiSelectGroupHandle
        @groupsHandleSelected="groupsHandleSelected"
        :data="currentGroups"
        :groupTicketType="groupTicketType"
      />
      <!-- <multi-select-group-type v-if="currentItem" type="group" :groupTicketType="groupTicketType" :idTkT="currentItem.id"></multi-select-group-type> -->
    </div>
    <div>
      <label>Nhân viên có quyền</label>
      <MultiSelectUserHandle
        @usersHandleSelected="usersHandleSelected"
        :data="currentUsers"
      />
    </div>
    <div class="text-center btn-update-config" slot="modal-footer"><b-button class="btn btn-ghtk" @click="updateConfig()">Cập nhật config quyền</b-button></div>
  </b-modal>

  <table class="table table-sm" >
    <thead>
      <tr>
        <th></th>
        <th class="text-center">ID</th>
        <th>Tên loại ticket</th>
        <th>Nhóm / Người xử lý</th>
        <th>Nhóm / Người xử lý khi mở lại</th>
        <th>Nhóm / Người theo dõi</th>
        <th class="text-center">Hướng dẫn ban đầu</th>
        <th class="text-center">Hotline</th>
        <th class="text-center">Ghi chú</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in childTickets" :key="item.id">
        <td class="text-center px-0">
          <b-btn variant="outline-success borderless btn-xs font-initial" @click.prevent="edit(item)"><i class="ion ion-md-create"></i></b-btn>
          <b-btn variant="outline-danger borderless btn-xs font-initial" @click.prevent="remove(item, index)"><i class="ion ion-md-close"></i></b-btn>
        </td>
        <td class="text-center">{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td class="td-rule">
          <span :class="{'tab-rule': true, 'user': rule.type === 'user'}" v-for="(rule, index) in item.rules.filter((rule) => { return (rule.type === 'group' || rule.type === 'user') && rule.rule_name !== null })" :key="'handle'+index">{{ rule.rule_name }}</span>
          <div class="edit-rule"><span @click="editRule(groupTicketType, item, 'group_user')" class="pen ion ion-md-create"></span></div>
        </td>
        <td class="td-rule">
          <span :class="{'tab-rule': true, 'user': rule.type === 'user_reopen'}" v-for="(rule, index) in item.rules.filter((rule) => { return (rule.type === 'group_reopen' || rule.type === 'user_reopen') && rule.rule_name !== null })" :key="'handle'+index">{{ rule.rule_name }}</span>
          <div class="edit-rule"><span @click="editRule(groupTicketType, item, 'group_user_reopen')" class="pen ion ion-md-create"></span></div>
        </td>
        <td class="td-rule">
          <span :class="{'tab-rule': true, 'user': rule.type === 'user_watch'}" v-for="(rule, index) in item.rules.filter((rule) => { return (rule.type === 'group_watch' || rule.type === 'user_watch') && rule.rule_name !== null })" :key="'handle'+index">{{ rule.rule_name }}</span>
          <div class="edit-rule"><span @click="editRule(groupTicketType, item, 'group_user_watch')" class="pen ion ion-md-create"></span></div>
        </td>
        <!-- <td><multi-select-group-type type="group" :groupTicketType="groupTicketType" :idTkT="item.id"></multi-select-group-type></td>
        <td><multi-select-group-type type="group_reopen" :groupTicketType="groupTicketType" :idTkT="item.id"></multi-select-group-type></td>
        <td><multi-select-group-type type="group_watch" :groupTicketType="groupTicketType" :idTkT="item.id"></multi-select-group-type></td> -->
        <td class="text-center px-0">
          <b-btn variant="outline-info borderless btn-xs font-initial" @click.prevent="viewMessage(item.initial_instruction, 'Hướng dẫn ban đầu')"><i class="ion ion-md-eye"></i></b-btn>
        </td>
        <td>{{ item.hotline }}</td>
        <td>{{ item.note }}</td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>
import ticketTypeServices from 'domain/services/ticket-type-services'
import MultiSelectUserType from './MultiSelectUserType'
import MultiSelectGroupType from './MultiSelectGroupType'
import MultiselectUser from './MultiselectUser.vue'
import Multiselect from 'vue-multiselect'
import MultiSelectUserHandle from './MultiSelectUserHandle.vue'
import MultiSelectGroupHandle from './MultiSelectGroupHandle.vue'

export default {
  name: 'child-ticket',

  props: ['parent_id', 'groupTicketType'],

  components: {
    MultiSelectUserType,
    MultiSelectGroupType,
    MultiselectUser,
    Multiselect,
    MultiSelectUserHandle,
    MultiSelectGroupHandle
  },

  data: () => ({
    childTickets: [],
    showEditModal: false,
    message: null,
    titleMessage: null,
    formEdit: {
      id: null,
      name: null,
      hotline: null,
      note: null,
      initial_instruction: null,
      parent_id: null,
      category: null
    },
    showRuleModal: false,
    currentItem: null,
    currentUsers: [],
    currentGroups: [],
    ruleModelTitle: '',
    groupTypes: {
      group_user: {
        title: 'Nhóm xử lý',
        group: 'group',
        user: 'user'
      },
      group_user_reopen: {
        title: 'Nhóm xử lý khi mở lại',
        group: 'group_reopen',
        user: 'user_reopen'
      },
      group_user_watch: {
        title: 'Nhóm theo dõi',
        group: 'group_watch',
        user: 'user_watch'
      }
    }
  }),

  created () {
    if (this.parent_id) this.getData()
  },

  methods: {
    getData () {
      ticketTypeServices.getChildTicketTypes({parent_id: this.parent_id})
        .then(res => {
          if (res.data.success) {
            this.childTickets = res.data.data || []
            // console.log(res)
            // console.log(res.data)
            // console.log(res.data.data)
            // console.log(res.data.data.rules)
            // this.groupData = res.data.data.rules.map((item) => {
            //   return {
            //     id: item.rule,
            //     name: item.rule_name
            //   }
            // })
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: res.data.message
            })
          }
        })
        .catch(e => {
          console.log(e)
          this.errors.push(e)
        })
    },

    resetForm () {
      for (const field in this.formEdit) {
        this.formEdit[field] = null
      }
    },

    edit (item) {
      if (!item || !item.id) return
      this.showEditModal = !this.showEditModal
      this.formEdit.id = item.id
      this.formEdit.name = item.name
      this.formEdit.hotline = item.hotline
      this.formEdit.note = item.note
      this.formEdit.initial_instruction = item.initial_instruction
      this.formEdit.parent_id = item.parent_id
      this.formEdit.category = item.category
    },

    viewMessage (msg, title) {
      this.message = msg
      this.titleMessage = title
      this.$bvModal.show('view-modal' + this.parent_id)
    },

    updateTicket () {
      ticketTypeServices.editTicketType(this.formEdit).then((response) => {
        if (response.data.success) {
          this.getData()
          this.$refs['edit-subticket'].hide()
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: response.data.message
          })
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).catch(e => {
        console.log(e)
      })
    },

    remove (item, index) {
      if (!item || !item.id) return
      if (confirm('Bạn có chắc chắn muốn xóa " ' + item.name + ' "??')) {
        ticketTypeServices.deleteTicketType({id: item.id}).then((response) => {
          if (response.data.success) {
            this.childTickets.splice(index, 1)
            this.$notify({
              group: 'default',
              type: 'bg-success text-white',
              title: 'Thông báo',
              text: response.data.message
            })
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: response.data.message
            })
          }
        })
      } else {
        // something
      }
    },
    editRule (groupTicketType, item, type) {
      console.log(groupTicketType)
      console.log(item)
      this.showRuleModal = true
      this.currentItem = item
      this.ruleModelTitle = this.groupTypes[type].title
      this.currentGroups = item.rules.filter((v) => { return v.type === this.groupTypes[type].group }).map((v) => {
        return {
          id: v.rule,
          name: v.rule_name
        }
      })
      this.currentUsers = item.rules.filter((v) => { return v.type === this.groupTypes[type].user }).map((v) => {
        return {
          id: +v.rule,
          name: v.rule_name
        }
      })
      this.currentGroupType = type
    },
    async updateConfig () {
      const groupIds = this.currentGroups.length ? this.currentGroups.map((group) => {
        return group.id
      }) : []
      const userIds = this.currentUsers.length ? this.currentUsers.map((user) => {
        return user.id
      }) : []

      if (groupIds.length === 0 && userIds.length === 0) {
        this.$notify({
          group: 'default',
          type: 'bg-warning text-dark',
          title: 'Thông báo',
          text: 'Chọn ít nhất một nhóm / người xử lý'
        })
        return false
      }

      const params = {
        ticket_type_id: this.currentItem.id,
        type: this.currentGroupType,
        groups: groupIds,
        users: userIds
      }

      try {
        const {data} = await ticketTypeServices.updateHandleTicketType(params)

        if (data.success) {
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: data.message
          })
          this.showRuleModal = false
          this.getData()
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: data.message
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    usersHandleSelected (users) {
      this.currentUsers = users
    },
    groupsHandleSelected (groups) {
      console.log('ss')
      console.log(groups)
      this.currentGroups = groups
    }
  }

}
</script>

<style lang="scss" scoped>
.td-rule{
  position: relative;
  &:hover .edit-rule{
    display: block
  }
}
.tab-rule{
    display: inline-block;
    padding: 3px 6px;
    background-color: #8897aa;
    color: #fff;
    margin: 5px;
    &.user{
      background-color: #32c3d7 !important;
    }
}
.edit-rule{
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: rgba(0, 0, 0, .2);
  top: 0;
  left: 0;
  .pen{
    top: 50%;
    left: 50%;
    text-align: center;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    position: absolute;
    cursor: pointer;
    padding: 20px;
    font-size: 18px;
    color: #02BC77;
  }
}
.btn-update-config{
  margin: 0 auto;
}
</style>
