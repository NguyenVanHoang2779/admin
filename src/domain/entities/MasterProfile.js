import BaseEntity from './BaseEntity'

export default class MasterProfile extends BaseEntity {
  static DISABLE_STATUS = 'disable'
  static ACTIVE_STATUS = 'active'
  static PAUSE_STATUS = 'pause'
  static NOT_VERIFIED_STATUS = 'not_verified'

  static statusOptions = {
    active: 'Đang làm việc',
    disable: 'Đã nghỉ việc',
    pause: 'Tạm dừng công việc',
    not_verified: 'Chờ nhận việc'
  }

  static profileStatusOps = [
    { value: 'active', desc: 'Đang làm việc' },
    { value: 'disable', desc: 'Đã nghỉ việc' },
    { value: 'pause', desc: 'Tạm dừng công việc' },
    { value: 'not_verified', desc: 'Chờ nhận việc' }
  ]

  // Trạng thái hồ sơ (do C&B confirm)
  static briefStatus = {
    0: 'Chưa có thông tin',
    1: 'Đã xác nhận',
    2: 'Đã có thông tin'
  }

  static statusCnBConfirm = {
    0: {desc: 'Chưa có thông tin', variant: 'secondary'},
    1: {desc: 'Đã xác nhận', variant: 'success'},
    2: {desc: 'Đã có thông tin', variant: 'info'}
  }

  static CnBConfirmOption = [
    { value: 0, desc: 'Chưa có thông tin' },
    { value: 1, desc: 'Đã xác nhận' },
    { value: 2, desc: 'Đã có thông tin' }
  ]

  static getStatusOptions () {
    let rs = []
    Object.keys(MasterProfile.statusOptions).forEach((key) => {
      rs.push({
        desc: MasterProfile.statusOptions[key],
        value: key
      })
    })
    return rs
  }

  static getStatusName (status) {
    switch (parseInt(status)) {
      case MasterProfile.DISABLE_STATUS:
        return 'Đã bị vô hiệu hóa'
      case MasterProfile.ACTIVE_STATUS:
        return 'Đang kích hoạt'
      default:
        return 'Không xác định'
    }
  }

  static getBriefStatusName (status) {
    let statusVal = parseInt(status)
    if (isNaN(statusVal)) {
      return MasterProfile.briefStatus[0]
    }

    return MasterProfile.briefStatus[statusVal]
  }

  static getBriefStatusClass (status) {
    let statusVal = parseInt(status)
    switch (statusVal) {
      case 1:
        return 'badge badge-success'
      case 2:
        return 'badge badge-info'
      default:
        return 'badge badge-secondary'
    }
  }

  static getBriefStatusProfileName (status) {
    if (typeof status !== 'string') {
      return MasterProfile.statusOptions['active']
    }
    return MasterProfile.statusOptions[status]
  }

  static getBriefStatusProfileClass (status) {
    switch (status) {
      case 'active':
        return 'badge badge-success'
      case 'disable':
        return 'badge badge-secondary'
      case 'not_verified':
        return 'badge badge-danger'
      default:
        return 'badge badge-warning'
    }
  }
}
