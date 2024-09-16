// get from backend: /admin/AdMasterProfile/getDeadlineOpts
// export const deadlineOpts = [
//   { value: null, text: 'Chọn deadline' },
//   { value: 'not_apply', text: 'Không áp dụng deadline' },
//   { value: 'on_get_job', text: 'Khi nhận việc' },
//   { value: '7d_joined_company', text: '7 ngày kể từ ngày vào' },
//   { value: '7d_signed_contract', text: '7 ngày kể từ ngày kí HĐLĐ' },
//   { value: '7d_signed_contract_24m', text: '7 ngày kể từ ngày kí HĐLĐ 24 tháng' },
//   { value: '7d_signed_contract_unlimited', text: '7 ngày kể từ ngày kí HĐLĐ vô thời hạn' },
//   { value: '7d_signed_npt', text: '7 ngày kể từ ngày đăng kí NPT' },
//   { value: '30d_activated_contract', text: '30 ngày kể từ ngày active HĐ' },
//   { value: '30d_joined_company', text: '30 ngày kể từ ngày vào' },
//   { value: '30d_activated_pl', text: '30 ngày kể từ ngày active PL' },
//   { value: '30d_quit_job', text: '30 ngày kể từ ngày nghỉ việc' }
// ]

export const configOpts = [
  { value: null, text: 'Chọn phương thức ràng buộc' },
  { value: 'config', text: 'Config' },
  { value: 'auto', text: 'Tự động' }
]

export const subTypeOpts = [
  { value: null, text: 'Chọn loại hồ sơ' },
  { value: 'Lý lịch cá nhân', text: 'Lý lịch cá nhân' },
  { value: 'Hợp đồng', text: 'Hợp đồng' },
  { value: 'Cam kết / Tuân thủ', text: 'Cam kết / Tuân thủ' },
  { value: 'Hồ sơ công tác', text: 'Hồ sơ công tác' },
  { value: 'Hồ sơ thuế', text: 'Hồ sơ thuế' }
]
export const optionLevelCredit = [
  {id: 0, name: 'Không có thông tin'},
  {id: 1, name: '01'},
  {id: 2, name: '02'},
  {id: 3, name: '03'},
  {id: 4, name: '04'},
  {id: 5, name: '05'},
  {id: 6, name: '06'},
  {id: 7, name: '07'},
  {id: 8, name: '08'},
  {id: 9, name: '09'},
  {id: 10, name: '10'}
]

export const confirmedStampOpts = [
  { value: '', text: '-' },
  { value: 'anh_dau_do', text: 'Ảnh, dấu đỏ' },
  { value: 'dau_do', text: 'Dấu đỏ' }
]

export const approveBltndsOption = [
  { text: 'Đúng/đủ thông tin & dấu mộc đỏ + Đúng NBL + NBL đồng ý bảo lãnh', value: 'approved_license' },
  { text: 'Đủ thông tin & Có ảnh NBL và CCCD + Đúng NBL + NBL đồng ý bảo lãnh', value: 'approved_image' }
]

export const rejectBltndsOption = [
  { text: 'Mờ, mất góc', value: 'broken_license' },
  { text: 'Không có mộc đỏ', value: 'miss_license' },
  { text: 'Không có ảnh NBL và CCCD', value: 'miss_image' },
  { text: 'Sai mẫu giấy BL/ Thiếu thông tin', value: 'wrong_license_miss_info' },
  { text: 'NBL không đồng ý bảo lãnh', value: 'rejected_guarant' },
  { text: 'NBL không đủ năng lực bảo lãnh', value: 'pending_suspect miss_capacity' },
  { text: 'Không liên hệ được NBL', value: 'miss_contact' },
  { text: 'Sai thông tin NBL', value: 'wrong_info_guardian' }
]
