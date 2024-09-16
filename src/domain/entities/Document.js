import BaseEntity from './BaseEntity'

export default class Document extends BaseEntity {
  static PER_PAGE = 10
  static statusEffectOptions = {
    0: 'Tình trạng hiệu lực',
    1: 'Hết hiệu lực',
    2: 'Đang hiệu lực'
  }
  static sourceOptions = {
    0: 'Nguồn văn bản',
    1: 'Văn bản nội bộ',
    2: 'Văn bản ngoài'
  }
  static securityLevelOptions = {
    0: 'Mức độ bảo mật',
    1: 'Công khai',
    2: 'Thông tin nội bộ',
    3: 'Thông tin mật'
  }
  static statusOptions = {
    1: 'Thêm mới',
    2: 'Cập nhật phiên bản mới'
  }
  static statusVariant = {
    1: 'danger',
    2: 'warning',
    3: 'success'
  }

  static getStatusEffectName (statusEffectId) {
    let statusEffect = parseInt(statusEffectId)
    if (statusEffect === 0) {
      return '-'
    } else {
      return this.statusEffectOptions[statusEffect] ? this.statusEffectOptions[statusEffect] : 'Không xác định'
    }
  }

  static getSourceName (sourceId) {
    let source = parseInt(sourceId)
    if (source === 0) {
      return '-'
    } else {
      return this.sourceOptions[source] ? this.sourceOptions[source] : 'Không xác định'
    }
  }

  static getSecurityLevel (securityLevelId) {
    let securityLevel = parseInt(securityLevelId)
    if (securityLevel === 0) {
      return '-'
    } else {
      return this.securityLevelOptions[securityLevel] ? this.securityLevelOptions[securityLevel] : 'Không xác định'
    }
  }
}
