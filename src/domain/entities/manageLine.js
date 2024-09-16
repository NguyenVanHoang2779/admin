import BaseEntity from './BaseEntity'

export default class manageLine extends BaseEntity {
  static optionsRegions = [
    { value: '10', text: 'Miền Bắc' },
    { value: '20', text: 'Miền Trung' },
    { value: '30', text: 'Miền Nam' }
  ]
  static optionsTypeLine = [
    { value: '1', text: 'Tuyến lấy' },
    { value: '2', text: 'Tuyến giao' },
    { value: '3', text: 'Tuyến trả' }
  ]
  static optionsActive = [
    { value: '0', text: 'Chưa kích hoạt' },
    { value: '1', text: 'Đã kích hoạt' }
  ]
  static optionsPerpage = [
    { value: '25', text: '25' },
    { value: '50', text: '50' },
    { value: '75', text: '75' },
    { value: '100', text: '100' }
  ]
}
