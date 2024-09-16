import BaseEntity from './BaseEntity'

export default class ErpDocument extends BaseEntity {
  static TYPE_GUARDIAN_LETTER = 10 // Hồ sơ là Giấy bảo lãnh trách nhiệm dân sự
  static TYPE_DRIVER_LICENSE = 13 // Hồ sơ Bằng lái xe
  static TYPE_CIC = 58 // Hồ sơ tín dụng
  static TYPE_VEHICLE_RC = 60 // Giấy chứng nhận đăng ký xe
}
