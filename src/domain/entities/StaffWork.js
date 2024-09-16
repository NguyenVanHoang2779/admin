import BaseEntity from './BaseEntity'

export default class StaffWork extends BaseEntity {
  static works = {
    lost_identity_card: {
      alias: 'lost_identity_card',
      dashboard_type: 'common',
      table_data_type: 'common',
      type: 'staff_identity',
      desc: 'Báo mất/báo làm lại CMND/CCCD',
      dom_id: 'wd-btn-statistics-report-lost-card'
    },
    ekyc_image_changes: {
      alias: 'ekyc_image_changes',
      dashboard_type: 'common',
      table_data_type: 'image_change',
      type: 'ekyc_image_changes',
      desc: 'Chụp lại ảnh xác thực',
      dom_id: 'wd-btn-statistics-ekyc-image-change'
    },
    sos_me: {
      alias: 'sos_me',
      dashboard_type: 'child_frame',
      path_name: '/sos',
      type: 'sos_me',
      desc: 'SOS.ME',
      dom_id: 'wd-btn-statistics-sos-me'
    },
    // checkin_not_approve: {
    //   alias: 'checkin_not_approve',
    //   dashboard_type: 'common',
    //   table_data_type: 'common',
    //   type: 'checkin',
    //   desc: 'Công chưa duyệt',
    //   dom_id: 'wd-btn-statistics-checkin-not-approve'
    // },
    user_info_order: {
      alias: 'user_info_order',
      dashboard_type: 'common',
      table_data_type: 'common',
      type: 'hr_order',
      desc: 'Cập nhật thông tin',
      dom_id: 'wd-btn-statistics-user-info-order'
    },
    new_contract_order: {
      alias: 'new_contract_order',
      dashboard_type: 'common',
      table_data_type: 'common',
      type: 'contract',
      desc: 'Ký mới',
      dom_id: 'wd-btn-statistics-new-contract-order'
    },
    continue_contract_order: {
      alias: 'continue_contract_order',
      dashboard_type: 'common',
      table_data_type: 'common',
      type: 'contract',
      desc: 'Tái ký',
      dom_id: 'wd-btn-statistics-continue-contract-order'
    },
    appendix_contract_order: {
      alias: 'appendix_contract_order',
      dashboard_type: 'common',
      table_data_type: 'common',
      type: 'contract',
      desc: 'Phụ lục HĐ',
      dom_id: 'wd-btn-statistics-appendix-contract-order'
    },
    need_active_wallet: {
      alias: 'need_active_wallet',
      dashboard_type: 'common',
      table_data_type: 'common',
      type: 'wallet',
      desc: 'Chưa kích hoạt ví',
      dom_id: 'wd-btn-statistics-need-active-wallet'
    },
    insurance_order: {
      alias: 'insurance_order',
      dashboard_type: 'common',
      table_data_type: 'common',
      type: 'hr_order',
      desc: 'Bảo hiểm',
      dom_id: 'wd-btn-statistics-insurance-order'
    },
    profile_documents: {
      alias: 'profile_documents',
      dashboard_type: 'profile_documents',
      table_data_type: 'profile_documents',
      type: 'profile_documents',
      desc: 'Hồ sơ',
      dom_id: 'wd-btn-statistics-profile-documents'
    },
    profile_car_driver: {
      alias: 'profile_car_driver',
      dashboard_type: 'profile_car_driver',
      table_data_type: 'profile_car_driver',
      type: 'profile_car_driver',
      desc: 'Hồ sơ tài xế xe thuê',
      dom_id: 'wd-btn-statistics-profile-documents',
      path_name: '/adm/iframe/profile-rent-driver/list'
    },
    rejected: {
      alias: 'rejected',
      type: 'rejected',
      desc: 'Từ chối',
      dashboard_type: 'common',
      table_data_type: 'common',
      dom_id: 'wd-btn-statistics-rejected'
    },
    tax: {
      alias: 'tax',
      type: 'tax',
      desc: 'Thuế',
      dashboard_type: 'tax',
      table_data_type: 'tax',
      dom_id: 'wd-btn-statistics-tax'
    },
    union: {
      alias: 'union',
      type: 'union',
      desc: 'Công đoàn',
      dashboard_type: 'union',
      table_data_type: 'union',
      dom_id: 'wd-btn-statistics-union'
    }
  }

  static tableDataHeader = {
    common: {
      header1: 'Nhân viên',
      header2: 'Chi tiết log',
      header3: 'Thao tác'
    },
    image_change: {
      header1: 'Nhân viên',
      header2: 'Thông tin xác thực ảnh chụp lại',
      header3: 'Thao tác'
    }
  }

  static workHasDeadline = ['staff_order_contract', 'staff_order', 'lost_identity_card']

  static workMapTable = {
    checkin_not_approve: 'checkin_logs',
    user_info_order: 'sgw_hr_orders',
    new_contract_order: 'sgw_hr_orders',
    continue_contract_order: 'sgw_hr_orders',
    appendix_contract_order: 'sgw_hr_orders',
    need_active_wallet: 'master_profile_extends',
    insurance_order: 'sgw_hr_orders',
    profile_documents: 'sgw_documents',
    ekyc_image_changes: 'sgw_hr_orders',
    lost_identity_card: 'sgw_hr_orders',
    rejected: '',
    tax: '',
    union: ''
  }

  static workMapCategory = {
    checkin_not_approve: 'checkin',
    user_info_order: 'staff_order',
    new_contract_order: 'staff_order_contract',
    continue_contract_order: 'staff_order_contract',
    appendix_contract_order: 'staff_order_contract',
    need_active_wallet: 'wallet',
    insurance_order: 'staff_order',
    profile_documents: '',
    ekyc_image_changes: 'staff_ekyc',
    lost_identity_card: 'staff_identity',
    rejected: 'staff_order,checkin',
    tax: '',
    union: ''
  }

  static workMapFilter = {
    checkin_not_approve: {
      checkin: {
        start_month: true,
        checkin_status: 'pending,rejected_by_autojob,cancel',
        checkin_type: 'normal,round_robin'
      }
    },
    user_info_order: {
      staff_order: {
        type: '37, 38',
        start_month: 0,
        censorLogin: 1
      }
    },
    new_contract_order: {
      staff_order_contract: {
        subType: 'new'
      }
    },
    continue_contract_order: {
      staff_order_contract: {
        subType: 'resign'
      }
    },
    appendix_contract_order: {
      staff_order_contract: {
        subType: 'appendix'
      }
    },
    staff_order_contract: {
      staff_order_contract: {
        subType: 'pending'
      }
    },
    need_active_wallet: {
      wallet: {
        is_force_wallet: 1,
        is_active_wallet: 0
      }
    },
    insurance_order: {
      staff_order: {
        category: 'insurance',
        start_month: 0,
        censorLogin: 1
      }
    },
    staff_order: {
      staff_order: {
        or_type: 'category,alias',
        category: 'insurance',
        alias: 'change_info',
        start_month: 0
      }
    },
    profile_documents: {},
    ekyc_image_changes: {},
    lost_identity_card: {
      staff_identity: {
        alias: 'lost_identity_card',
        start_month: 0
      }
    },
    lost_identity_card_hr: {
      staff_identity: {
        status: 'da_duyet_supervisor',
        alias: 'lost_identity_card',
        start_month: 0
      }
    },
    rejected: {
      staff_order: {
        or_type: 'category,alias',
        category: 'insurance',
        alias: 'new_contract,change_info,new_appendix',
        modified_from: 'start_month',
        status: 'tu_choi'
      }
      // checkin: {
      //   start_month: true,
      //   checkin_status: 'rejected',
      //   checkin_type: 'normal,round_robin'
      // }
    },
    tax: {

    },
    union: {

    }
  }
}
