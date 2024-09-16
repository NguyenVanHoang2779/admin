import BaseEntity from './BaseEntity'

export default class CheckinLog extends BaseEntity {
  static shifts = [
    {text: 'Chưa xác định', value: 'draft'},
    {text: 'Đủ công', value: 'none'},
    {text: 'Nửa công', value: 'half_day'},
    {text: 'Buổi sáng', value: 'evening'},
    {text: 'Buổi chiều', value: 'afternoon'},
    {text: 'Buổi tối', value: 'evening'},
    {text: 'Ngày - Nhóm theo giờ', value: 'day'},
    {text: 'Đêm - Nhóm theo giờ', value: 'night'},
    {text: 'Tăng ca - 1/4 công', value: 'one_fourth'},
    {text: 'Tăng ca - 3/4 công', value: 'three_fourth'},
    {text: 'Chủ nhật(COD)', value: 'sunday'}
  ]

  static checkinTypes = [
    {text: 'Công thường', value: 'normal'},
    {text: 'Tăng ca', value: 'over_time'},
    {text: 'Xoay ca', value: 'round_robin'}
  ]

  static statuses = [
    {text: 'Đồng ý duyệt', value: 'approved'},
    {text: 'Từ chối duyệt', value: 'rejected'},
    {text: 'Đang chờ duyệt', value: 'pending', disabled: true},
    {text: 'Hệ thống từ chối', value: 'rejected_by_autojob', disabled: true}
  ]

  static shiftDetails = [
    {text: 'Chọn ca chi tiết', value: null},
    {text: 'Sáng - Chiều', value: 'morning_afternoon'},
    {text: 'Sáng - Tối', value: 'morning_evening'},
    {text: 'Chiều - Tối', value: 'afternoon_evening'},
    {text: 'Buổi Sáng', value: 'morning'},
    {text: 'Buổi Chiều', value: 'afternoon'},
    {text: 'Buổi Tối', value: 'evening'}
  ]

  static onLeaves = [
    {text: 'Chấm công', value: 'check_in'},
    {text: 'Xin nghỉ', value: 'on_leave'}
  ]

  static onLeavesEdit = [
    {text: 'Chấm công', value: 0},
    {text: 'Xin nghỉ', value: 1}
  ]

  static listStatus = {
    'pending': 'Đang chờ duyệt',
    'approved': 'Đã duyệt',
    'rejected': 'Từ chối',
    'rejected_by_autojob': 'Hệ thống từ chối'
  }

  static getCheckinStatus (status) {
    return CheckinLog.listStatus[status]
  }
}
