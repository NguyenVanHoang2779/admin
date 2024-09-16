import BaseEntity from './BaseEntity'
export default class ManageListCod extends BaseEntity {
  static optionsReport = [
    { value: '10', text: 'Miền Bắc' },
    { value: '20', text: 'Miền Trung' },
    { value: '30', text: 'Miền Nam' }
  ]
  static optionsPerpage = [
    { value: '25', text: '25' },
    { value: '50', text: '50' },
    { value: '75', text: '75' },
    { value: '100', text: '100' }
  ]
  static codGroupIds = [12, 14, 17, 18]
  static profileUrl = '/adm/profile/staff/'
  static profileMasterUrl = '/adm/profile/master/edit/'
  static redirectProfile (groupId, userId = null, profileId = null) {
    if (this.codGroupIds.includes(+groupId) && userId) window.open(this.profileUrl + userId, '_blank')
    else if (profileId) window.open(this.profileMasterUrl + profileId, '_blank')
  }
  static pointTypes = {
    DCC5: { value: 1, text: 'Địa chỉ Cấp 5' },
    MP_SHOP: { value: 3, text: 'MP' },
    PICK_ADDRESS: { value: 2, text: 'Shop' }
  }
  static PICKING_CART = 1
  static DELIVERY_CART = 2
}
