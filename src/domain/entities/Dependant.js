import BaseEntity from './BaseEntity'

export default class Dependant extends BaseEntity {
  static relationship = ['', 'Con', 'Vợ/chồng', 'Cha/mẹ', 'Khác']

  static optionRelationship = [
    { text: '-- Chọn mối quan hệ --', value: null },
    { text: 'Con', value: 1 },
    { text: 'Vợ/chồng', value: 2 },
    { text: 'Cha/mẹ', value: 3 },
    { text: 'Khác', value: 4 }
  ]

  static statusDesc = {
    wait: 'Chờ',
    success: 'Thành công',
    error: 'Lỗi',
    incompleteFile: 'Thiếu hồ sơ'
  }

  static optionStatus = [
    { text: '-- Chọn trạng thái đăng kí --', value: null },
    { text: 'Chờ', value: 'wait' },
    { text: 'Thành công', value: 'success' },
    { text: 'Lỗi', value: 'error' },
    { text: 'Thiếu hồ sơ', value: 'incompleteFile' }
  ]
}
