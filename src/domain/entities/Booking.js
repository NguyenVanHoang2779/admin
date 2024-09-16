import BaseEntity from './BaseEntity'

export default class Booking extends BaseEntity {
  static reasonOther = 'Lí do khác'

  static optionsTypeRoute = [
    { value: null, text: 'Chọn loại lộ trình' },
    { value: '1', text: 'Liên miền' },
    { value: '2', text: 'Nội miền' },
    { value: '3', text: 'Nội tỉnh' }
  ]

  static optionsTimeDay = [
    { value: '0', text: '0 ngày' },
    { value: '1', text: '1 ngày' },
    { value: '2', text: '2 ngày' },
    { value: '3', text: '3 ngày' },
    { value: '4', text: '4 ngày' },
    { value: '5', text: '5 ngày' },
    { value: '6', text: '6 ngày' },
    { value: '7', text: '7 ngày' },
    { value: '8', text: '8 ngày' },
    { value: '9', text: '9 ngày' },
    { value: '10', text: '10 ngày' },
    { value: '11', text: '11 ngày' },
    { value: '12', text: '12 ngày' },
    { value: '13', text: '13 ngày' },
    { value: '14', text: '14 ngày' },
    { value: '15', text: '15 ngày' }
  ]

  static optionsTemplate = [
    { item: 2, name: 'Lộ trình đã tạo' },
    { item: 1, name: 'Lộ trình tạo mới' }
  ]
}
