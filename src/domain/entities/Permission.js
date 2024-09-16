import BaseEntity from './BaseEntity'

export default class Permission extends BaseEntity {
  static typeDesc = {
    allow: {desc: 'Cho phép', variant: 'success'},
    deny: {desc: 'Không cho phép', variant: 'danger'},
    lock: {desc: 'Tạm khóa', variant: 'warning'}
  }

  static employeeDesc = {
    department: {desc: 'Phòng ban', variant: 'success'},
    group: {desc: 'Nhóm', variant: 'primary'},
    position: {desc: 'Vị trí', variant: 'secondary'},
    user: {desc: 'Nhân viên', variant: 'info'}
  }
}
