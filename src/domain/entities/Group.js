import BaseEntity from './BaseEntity'

export default class Group extends BaseEntity {
  static WH_STAFF = 23 // Phụ kho
  static WH_STAFF_ONSITE = 26 // Xử lý hàng onsite

  static checkGroupWHStaff (groupId) {
    let groupIdCheck = parseInt(groupId)
    return groupIdCheck === this.WH_STAFF || groupIdCheck === this.WH_STAFF_ONSITE
  }
}
