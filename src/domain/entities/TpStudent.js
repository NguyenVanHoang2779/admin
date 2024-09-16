import BaseEntity from './BaseEntity'

export default class TpStudent extends BaseEntity {
  static listStatuses = {
    not_assigned: 'Chưa xếp lớp',
    assigned: 'Đã xếp lớp',
    paused: 'Tạm hoãn xếp lớp',
    studying: 'Đang học',
    failed: 'Trượt',
    passed: 'Pass',
    canceled: 'Huỷ'
  }

  static getTag (studentStatus, classStatus) {
    if (['not_assigned', 'assigned'].includes(studentStatus)) {
      return 'Chưa học'
    }
    return 'Điểm kém'
  }
}
