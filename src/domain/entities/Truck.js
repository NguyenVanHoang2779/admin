import BaseEntity from './BaseEntity'

export default class Contract extends BaseEntity {
  static truckBarrelOptions = {
    1: 'Thùng bạt',
    2: 'Thùng kín'
  }
  static truckFloorOptions = {
    1: '1 sàn',
    2: '2 sàn'
  }
  static reasonRcTruck = {
    1: 'RC mất',
    2: 'RC hỏng',
    3: 'RC mất mã',
    4: 'Khác'
  }
  static getTruckBarrelName (barrelId) {
    let barrel = parseInt(barrelId)
    return this.truckBarrelOptions[barrel] ? this.truckBarrelOptions[barrel] : ''
  }
  static getTruckFloorName (floorId) {
    let floor = parseInt(floorId)
    return this.truckFloorOptions[floor] ? this.truckFloorOptions[floor] : ''
  }
  static getReasonRcTruck (reason) {
    let reasonDelete = parseInt(reason)
    return this.reasonRcTruck[reasonDelete] ? this.reasonRcTruck[reasonDelete] : ''
  }
}
