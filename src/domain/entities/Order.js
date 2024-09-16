import BaseEntity from './BaseEntity'

export default class Order extends BaseEntity {
  static CHO_DUYET_STATUS = 'cho_duyet'
  static PENDING_STATUS = 'cho_duyet'
  static statusDesc = {
    cho_duyet: { desc: 'Chờ duyệt', variant: 'dark' },
    tu_choi: { desc: 'Từ chối', variant: 'danger' },
    thieu_ho_so: { desc: 'Thiếu hồ sơ', variant: 'warning' },
    da_duyet_leader: { desc: 'Leader khu vực đã duyệt', variant: 'primary' },
    da_duyet: { desc: 'Đã hoàn thành', variant: 'ghtk' },
    co_ket_qua: { desc: 'Đã bàn giao/thanh toán', variant: 'info' },
    nhan_ket_qua: { desc: 'Đã nhận bàn giao/thanh toán', variant: 'secondary' },
    da_duyet_supervisor: { desc: 'Quản lý trực tiếp đã duyệt', variant: 'info' },
    hoan_thanh: { desc: 'Đã hoàn thành', variant: 'ghtk' },
    da_huy: { desc: 'Đã hủy', variant: 'dark' }
  }

  static statusOptions = [
    { value: 'cho_duyet', desc: 'Chờ duyệt' },
    { value: 'da_duyet', desc: 'Đã duyệt' },
    { value: 'hoan_thanh', desc: 'Đã Hoàn thành' },
    { value: 'tu_choi', desc: 'Từ chối' },
    { value: 'da_huy', desc: 'Đã hủy' },
    { value: 'chua_ky', desc: 'Chưa ký HĐ' },
    { value: 'da_duyet_supervisor', desc: 'Quản lý trực tiếp đã duyệt' },
    { value: 'da_duyet_leader', desc: 'Leader khu vực đã duyệt' },
    { value: 'thieu_ho_so', desc: 'Thiếu hồ sơ' },
    { value: 'co_ket_qua', desc: 'Đã bàn giao/thanh toán' },
    { value: 'nhan_ket_qua', desc: 'Đã nhận bàn giao/thanh toán' }
  ]

  static flowAction = {
    CnB: {
      cho_duyet: [
        { action: 'duyet', variant: 'outline-ghtk', text: 'Duyệt' },
        { action: 'tu_choi', variant: 'outline-danger' },
        { action: 'thieu_ho_so', variant: 'outline-warning', order_group: ['supply_bhxh', 'supply_bhyt', 'regime', 'stop_working', 'modify'] }
      ],
      tu_choi: [
        // { action: 'thieu_ho_so', variant: 'outline-warning', order_group: ['supply_bhxh', 'supply_bhyt', 'regime', 'stop_working', 'modify'] }
      ],
      thieu_ho_so: [
        { action: 'duyet', variant: 'outline-ghtk', text: 'Duyệt' },
        { action: 'tu_choi', variant: 'outline-danger' }
      ],
      da_duyet_leader: [
        { action: 'duyet', variant: 'outline-ghtk', text: 'Duyệt' },
        { action: 'thieu_ho_so', variant: 'outline-warning', order_group: ['supply_bhxh', 'supply_bhyt', 'regime', 'stop_working', 'modify'] },
        { action: 'tu_choi', variant: 'outline-danger' }
      ],
      da_duyet_supervisor: [
        { action: 'duyet', variant: 'outline-ghtk', text: 'Duyệt' },
        { action: 'thieu_ho_so', variant: 'outline-warning', order_group: ['supply_bhxh', 'supply_bhyt', 'regime', 'stop_working', 'modify'] },
        { action: 'tu_choi', variant: 'outline-danger' }
      ],
      da_duyet: [
        { action: 'ban_giao', variant: 'outline-ghtk', text: 'Đã bàn giao/thanh toán', order_group: ['supply_bhxh', 'supply_bhyt'] }
      ]
    },
    Leader: {
      cho_duyet: [
        { action: 'duyet', variant: 'outline-ghtk', text: 'Duyệt' },
        { action: 'tu_choi', variant: 'outline-danger' },
        { action: 'thieu_ho_so', variant: 'outline-warning', order_group: ['supply_bhxh', 'supply_bhyt', 'regime', 'stop_working', 'modify'] }
      ],
      tu_choi: [
        { action: 'thieu_ho_so', variant: 'outline-warning', order_group: ['supply_bhxh', 'supply_bhyt', 'regime', 'stop_working', 'modify'] }
      ],
      thieu_ho_so: [
        { action: 'duyet', variant: 'outline-ghtk', text: 'Duyệt' },
        { action: 'tu_choi', variant: 'outline-danger' }
      ],
      da_duyet_leader: [
        { action: 'duyet', variant: 'outline-ghtk', text: 'Duyệt', order_group: ['stop_working', 'user_info'] },
        { action: 'thieu_ho_so', variant: 'outline-warning', order_group: ['supply_bhxh', 'supply_bhyt', 'regime', 'stop_working', 'modify'] },
        { action: 'tu_choi', variant: 'outline-danger' }
      ],
      da_duyet_supervisor: [
        { action: 'duyet', variant: 'outline-ghtk', text: 'Duyệt', order_group: ['contract'] },
        { action: 'thieu_ho_so', variant: 'outline-warning', order_group: ['supply_bhxh', 'supply_bhyt', 'regime', 'stop_working', 'modify'] },
        { action: 'tu_choi', variant: 'outline-danger', order_group: ['contract'] }
      ],
      da_duyet: [
        { action: 'ban_giao', variant: 'outline-ghtk', text: 'Đã bàn giao/thanh toán', order_group: ['supply_bhxh', 'supply_bhyt'] }
      ]
    },
    Supervisor: {
      cho_duyet: [
        { action: 'duyet', variant: 'outline-ghtk', text: 'Duyệt', order_group: ['contract'] },
        { action: 'tu_choi', variant: 'outline-danger', order_group: ['contract'] }
      ],
      da_duyet_supervisor: [
        { action: 'tu_choi', variant: 'outline-danger', order_group: ['contract'] }
      ],
      tu_choi: [
        { action: 'duyet', variant: 'outline-ghtk', order_group: ['contract'], text: 'Duyệt lại đề xuất' }
      ]
    },
    Hr: {
      thieu_ho_so: [
        { action: 'de_xuat_lai', variant: 'outline-ghtk', text: 'Đề xuất lại', order_group: ['supply_bhxh', 'supply_bhyt', 'regime', 'stop_working', 'modify'] }
      ],
      cho_duyet: [
        { action: 'duyet', variant: 'outline-ghtk', text: 'Duyệt' },
        { action: 'tu_choi', variant: 'outline-ghtk' },
        { action: 'thieu_ho_so', variant: 'outline-ghtk', order_group: ['supply_bhxh', 'supply_bhyt', 'regime', 'stop_working', 'modify'] }
      ]
    },
    Staff: {
      cho_duyet: [
        { action: 'duyet', variant: 'outline-ghtk', text: 'Duyệt' },
        { action: 'tu_choi', variant: 'outline-danger' }
      ]
    }
  }

  static birthTypeOptions = [
    { value: null, text: '' },
    { value: 'normal', text: 'Sinh thông thường' },
    { value: 'have_surgery', text: 'Sinh con phải phẫu thuật' },
    { value: 'premature_birth', text: 'Sinh con dưới 32 tuần tuổi' }
  ]
  static birthdayStatusOptions = [
    { value: 'dd/mm/yyyy', text: 'Ngày/tháng/năm' },
    { value: 'mm/yyyy', text: 'Tháng/năm' },
    { value: 'yyyy', text: 'Năm' }
  ]
  static insuranceBookStatusOptions = [
    { value: null, text: '' },
    { value: 'first_time', text: '1. NLĐ lần đầu tham gia BHXH tại GHTK' },
    { value: 'employee', text: '2. NLĐ giữ sổ BHXH' },
    { value: 'lost', text: '3. NLĐ bị mất sổ BHXH' },
    { value: 'withdrawn', text: '4. NLĐ bị thu hồi sổ do hưởng TC 1 lần' },
    { value: 'unknown', text: '5. NLĐ không biết về tình trạng sổ BHXH' }
  ]
  static genderOptions = [
    { value: null, text: '' },
    { value: 'male', text: 'Nam' },
    { value: 'female', text: 'Nữ' },
    { value: 'other', text: 'Khác' }
  ]
  static nationalityOptions = [
    { value: 'Vietnam', text: 'Việt Nam' },
    { value: 'Cambodia', text: 'Campuchia' },
    { value: 'Laos', text: 'Lào' },
    { value: 'Thailand', text: 'Thái Lan' },
    { value: 'China', text: 'Trung Quốc' },
    { value: 'other', text: 'Khác' }
  ]
  static salaryAreaOptions = [
    { value: 1, text: 'I' },
    { value: 2, text: 'II' },
    { value: 3, text: 'III' },
    { value: 4, text: 'IV' }
  ]
  static fileTypeOptions = {
    // category => options licence
    insurance: [
      { value: null, text: '-- Chọn loại chứng từ/File --' },
      { value: 'tk1', text: 'TK1' },
      { value: 'other_company_contract', text: 'Hợp đồng lao động (công ty khác)' },
      { value: 'confirm_insurance', text: 'Giấy xác nhận tham gia BHXH' },
      { value: 'insurance_book', text: 'Hình ảnh sổ BHXH' },
      { value: 'medical_insurance', text: 'Hình ảnh thẻ BHYT' },
      { value: 'confirm_unemployment_benefit', text: 'Quyết định hưởng trợ cấp thất nghiệp' },
      { value: 'household_book', text: 'Hình ảnh sổ hộ khẩu' },
      { value: 'personal_id', text: 'Hình ảnh CMND' },
      { value: 'hospital_checkout', text: 'Giấy ra viện' },
      { value: 'confirm_resign_regime_benefit', text: 'Giấy xác nhận nghỉ việc hưởng chế độ BHXH' },
      { value: 'birth_certificate', text: 'Giấy khai sinh/chứng sinh' },
      { value: 'birth_certificate_extract', text: 'Trích lục khai sinh' },
      { value: 'other', text: 'Giấy tờ khác' }
    ],
    working_process: [
      { value: null, text: '-- Chọn loại File --' },
      { value: 'resignation', text: 'Đơn xin nghỉ việc' },
      { value: 'other', text: 'Giấy tờ khác' }
    ],
    contract: [

    ]
  }
  static categoryAlias = {
    insurance: 'BH',
    contract: 'HĐ',
    working_process: 'CT'
  }

  static orderType = {
    change_image_ekyc: {
      id: 39,
      alias: 'ekyc_image_changes'
    },

    report_lost_identity_card: {
      id: 40,
      alias: 'lost_identity_card'
    },

    confirm_staff_ekyc: {
      id: 41,
      alias: 'confirm_staff_ekyc'
    },

    update_identity_card_ekyc: {
      id: 42,
      alias: 'update_identity_card'
    }
  }

  static getTagByOrderType (orderType) {
    orderType = parseInt(orderType)
    switch (orderType) {
      case this.orderType.change_image_ekyc.id:
        return {
          value: this.orderType.change_image_ekyc.alias,
          name: 'Chưa duyệt ảnh chụp lại',
          style: {'background-color': '#DDC52F', 'color': 'white'}
        }
      case this.orderType.confirm_staff_ekyc.id:
        return {
          value: this.orderType.confirm_staff_ekyc.alias,
          name: 'Xác nhận nhân viên',
          style: {'background-color': '#DDC52F', 'color': 'white'}
        }
      case this.orderType.update_identity_card_ekyc.id:
        return {
          value: this.orderType.update_identity_card_ekyc.alias,
          name: 'Cập nhật CCCD',
          style: {'background-color': '#DDC52F', 'color': 'white'}
        }
      default:
        return null
    }
  }
}
