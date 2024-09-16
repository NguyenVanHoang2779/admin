import BaseEntity from './BaseEntity'

export default class MasterCompanyProfile extends BaseEntity {
  static LOCK_STATUS = 'lock'
  static DISABLE_STATUS = 'disable'
  static ACTIVE_STATUS = 'active'

  static statusOptions = {
    'active': 'Đang hợp tác',
    'disable': 'Ngừng hợp tác',
    'pause': 'Tạm dừng hợp tác'
  }

  // Trạng thái hồ sơ (do C&B confirm)
  static briefStatus = {
    0: 'Chưa có thông tin',
    1: 'Đã xác nhận',
    2: 'Đã có thông tin'
  }

  static vehicleStatus = {
    1: 'Chưa kiểm duyệt',
    2: 'Đã kiểm duyệt'
  }

  static getStatusOptions () {
    let rs = [{ value: '', text: 'Trạng thái profile' }]
    Object.keys(MasterCompanyProfile.statusOptions).forEach((key) => {
      rs.push({
        text: MasterCompanyProfile.statusOptions[key],
        value: key
      })
    })
    return rs
  }

  static getBriefStatusName (status) {
    let statusVal = parseInt(status)
    if (isNaN(statusVal)) {
      return MasterCompanyProfile.briefStatus[0]
    }
    return MasterCompanyProfile.briefStatus[statusVal]
  }

  static getBriefStatusClass (status) {
    let statusVal = parseInt(status)
    switch (statusVal) {
      case 1:
        return 'badge badge-primary'
      case 2:
        return 'badge badge-info'
      default:
        return 'badge badge-secondary'
    }
  }

  static getStatusName (status) {
    if (typeof status !== 'string') {
      return MasterCompanyProfile.statusOptions['active']
    }
    return MasterCompanyProfile.statusOptions[status]
  }

  static getStatusClass (status) {
    switch (status) {
      case 'active':
        return 'badge badge-success'
      case 'disable':
        return 'badge badge-secondary'
      default:
        return 'badge badge-warning'
    }
  }

  static getVehicleStatusName (status) {
    let statusVal = parseInt(status)
    console.log(statusVal)
    if (isNaN(statusVal)) {
      return MasterCompanyProfile.vehicleStatus[0]
    }
    return MasterCompanyProfile.vehicleStatus[statusVal]
  }
}
