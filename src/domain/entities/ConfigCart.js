import BaseEntity from './BaseEntity'

export default class ConfigCart extends BaseEntity {
  static clearRouteOptions = [
    { text: 'Ca 1', value: '1' },
    { text: 'Ca 2', value: '2' },
    { text: 'Ca 3', value: '3' },
    { text: 'Ca 4', value: '4' }
  ]
  static cartTypeOptions = [
    { text: 'Lấy hàng', value: '1' },
    { text: 'Giao hàng', value: '2' },
    { text: 'Trả hàng', value: '3' }
  ]
  static workShiftOptions = [
    { text: 'Ca ngày', value: '0' },
    { text: 'Ca tối', value: '3' }
  ]
  static areaOptions = [
    { text: 'Chọn vùng', value: '0' },
    { text: 'Vùng 1', value: '1' },
    { text: 'Vùng 2', value: '2' },
    { text: 'Vùng 3', value: '3' },
    { text: 'Vùng 4', value: '4' },
    { text: 'Vùng 5', value: '5' },
    { text: 'Vùng 6', value: '6' },
    { text: 'Bỏ phạt tốc độ', value: '7' }
  ]

  static cartTypes = {
    picking: {
      text: 'Lấy hàng',
      value: 1
    },
    delivering: {
      text: 'Giao hàng',
      value: 2
    },
    returning: {
      text: 'Trả hàng',
      value: 3
    }
  }
}
