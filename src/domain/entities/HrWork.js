import BaseEntity from './BaseEntity'

export default class HrWork extends BaseEntity {
  static listWork = {
    master_profile: {
      desc: 'Thông tin nhân viên',
      num_need_action: 0,
      subwork: [],
      unit: 'NV'
    },
    new_member: {
      desc: 'Tân Binh & NS cần quan tâm',
      num_need_action: 0,
      subwork: [],
      unit: 'NV'
    },
    station_status: {
      desc: 'Tình hình kho',
      num_need_action: 0,
      subwork: [],
      unit: ''
    },
    driverx: {
      desc: 'Đăng tin',
      num_need_action: 0,
      subwork: [],
      unit: 'UV'
    },
    candidate: {
      desc: 'Tuyển dụng',
      num_need_action: 0,
      subwork: [],
      unit: 'UV'
    },
    deposit: {
      desc: 'Thu cọc',
      num_need_action: 0,
      subwork: [],
      unit: 'NV'
    },
    training: {
      desc: 'Đào tạo',
      num_need_action: 0,
      subwork: [],
      unit: 'BH'
    },
    working_process: {
      desc: 'Cập nhật thông tin',
      num_need_action: 0,
      subwork: [],
      unit: 'ĐX'
    },
    profile_document: {
      desc: 'Hồ sơ',
      num_need_action: 0,
      subwork: [],
      unit: 'HS'
    },
    contract: {
      desc: 'Hợp đồng',
      num_need_action: 0,
      subwork: [],
      unit: 'ĐX'
    },
    insurance: {
      desc: 'Bảo hiểm',
      num_need_action: 0,
      subwork: [],
      unit: 'ĐX'
    },
    tax: {
      desc: 'Thuế',
      num_need_action: 0,
      subwork: [],
      unit: 'ĐX'
    },
    union: {
      desc: 'Công đoàn',
      num_need_action: 0,
      subwork: [],
      unit: 'ĐX'
    },
    // work_day: {
    //   desc: 'Công phép'
    // },
    f_star: {
      desc: 'Đánh giá F-Star',
      num_need_action: 0,
      subwork: [],
      unit: 'NV'
    },
    stop_working: {
      desc: 'Nghỉ việc',
      num_need_action: 0,
      subwork: [],
      unit: 'ĐX'
    },
    hub_dashboard: {
      desc: 'Tổng quan vận hành',
      subwork: [],
      unit: 'VH'
    }
  }
}
