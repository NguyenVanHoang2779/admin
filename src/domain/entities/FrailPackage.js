import BaseEntity from './BaseEntity'
export default class FrailPackage extends BaseEntity {
  static optionsReport = [
    { value: '6', text: 'Tất cả' },
    { value: '1', text: 'Báo xấu' },
    { value: '2', text: 'Duyệt' },
    { value: '3', text: 'Thẻ đỏ' },
    { value: '4', text: 'Thẻ vàng' },
    { value: '5', text: 'Chưa đánh giá' }
  ]
  static optionsPerpage = [
    { value: '25', text: '25' },
    { value: '50', text: '50' },
    { value: '75', text: '75' },
    { value: '100', text: '100' }
  ]
}
