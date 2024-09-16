export const pausWorkOptions = [
  { value: null, text: 'Chọn loại thay đổi' },
  { value: 'suspend', text: 'Đình chỉ' },
  { value: 'off_no_salary', text: 'Nghỉ không lương dài hạn' },
  { value: 'pause', text: 'Tạm hoãn hợp đồng' },
  { value: 'normal_quit', text: 'Nghỉ việc đúng quy trình' },
  { value: 'arbitrarily_quit', text: 'Nghỉ ngang' },
  { value: 'fired', text: 'Cho thôi việc' },
  { value: 'comeback', text: 'Đi làm lại' }
]

export const suspendOptions = [
  { value: null, text: 'Chọn lý do' },
  { value: 'Giải quyết sự vụ', text: 'Giải quyết sự vụ' },
  { value: 'Khác', text: 'Khác' }
]

export const unpaidLeaveOptions = [
  { value: null, text: 'Chọn lý do' },
  { value: 'Nghỉ ốm đau dài hạn', text: 'Nghỉ ốm đau dài hạn' },
  { value: 'Nghỉ thai sản', text: 'Nghỉ thai sản' },
  { value: 'Nghỉ việc riêng', text: 'Nghỉ việc riêng' },
  { value: 'Khác', text: 'Khác' }
]

export const pauseContract = [
  { value: null, text: 'Chọn lý do' },
  { value: 'Thực hiện nghĩa vụ quân sự, dân quân tự vệ', text: 'Thực hiện nghĩa vụ quân sự, dân quân tự vệ' },
  { value: 'Bị tạm giữ, tạm giam theo quy định pháp luật', text: 'Bị tạm giữ, tạm giam theo quy định pháp luật' },
  { value: 'Chấp hành biện pháp giáo dục, cai nghiện', text: 'Chấp hành biện pháp giáo dục, cai nghiện' },
  { value: 'Dưỡng thai theo chỉ định của bác sĩ', text: 'Dưỡng thai theo chỉ định của bác sĩ' },
  { value: 'Bổ nhiệm làm quản lý DN nhà nước', text: 'Bổ nhiệm làm quản lý DN nhà nước' },
  { value: 'Do dịch bệnh', text: 'Do dịch bệnh' }
]

export const normalLeaveOptions = [
  { value: null, text: 'Chọn lý do' },
  { value: 'Sức khỏe không đảm bảo', text: 'Sức khỏe không đảm bảo' },
  { value: 'Không đáp ứng được thời gian, địa điểm', text: 'Không đáp ứng được thời gian, địa điểm' },
  { value: 'Không phù hợp với tính chất công việc', text: 'Không phù hợp với tính chất công việc' },
  { value: 'Không phù hợp với môi trường, văn hóa', text: 'Không phù hợp với môi trường, văn hóa' },
  { value: 'Việc cá nhân/gia đình', text: 'Việc cá nhân/gia đình' },
  { value: 'Định hướng công việc mới', text: 'Định hướng công việc mới' },
  { value: 'Chế độ, thu nhập không đảm bảo', text: 'Chế độ, thu nhập không đảm bảo' },
  { value: 'Hết HĐ/Thời vụ', text: 'Hết HĐ/Thời vụ' },
  { value: 'Nghỉ sinh (vi phạm thỏa thuận)', text: 'Nghỉ sinh (vi phạm thỏa thuận)' },
  { value: 'Khác', text: 'Khác' }
]

export const firedOptions = [
  { value: null, text: 'Chọn lý do' },
  { value: 'Thái độ làm việc kém', text: 'Thái độ làm việc kém' },
  { value: 'Cho nghỉ gian lận', text: 'Cho nghỉ gian lận' },
  { value: 'Năng lực yếu kém', text: 'Năng lực yếu kém' },
  { value: 'Khác', text: 'Khác' }
]

export const reactivateOptions = [
  { value: null, text: 'Chọn lý do' },
  { value: 'Hết Hạn nghỉ không lương dài hạn', text: 'Hết hạn nghỉ không lương dài hạn' },
  { value: 'Hết hạn tạm hoãn hợp đồng', text: 'Hết hạn tạm hoãn hợp đồng' },
  { value: 'Nghỉ việc đi làm lại', text: 'Nghỉ việc đi làm lại' }
]

export const paidOptions = [
  { value: null, text: 'Chọn lý do' },
  { value: 'Trả lương đủ lương', text: 'Trả lương đủ lương' },
  { value: 'Không trả lương', text: 'Không trả lương' },
  { value: 'Phạt lương', text: 'Phạt lương' }
]

export const insuranceOptions = [
  { value: null, text: 'Chọn loại bảo hiểm' },
  { value: 'GH1', text: 'Giảm hẳn (đóng BHYT)' },
  { value: 'GH2', text: 'Giảm hẳn ( không đóng BHYT)' },
  { value: 'KL1', text: 'Nghỉ không lương (đóng BHYT)' },
  { value: 'KL2', text: 'Nghỉ không lương (không đóng BHYT)' },
  { value: 'OF1', text: 'Nghỉ do ốm đau (đóng BHYT)' },
  { value: 'OF2', text: 'Nghỉ do ốm đau (không đóng BHYT)' },
  { value: 'ON', text: 'Đi làm lại' },
  { value: 'TM', text: 'Tăng mới' },
  { value: 'TS1', text: 'Thai sản (đóng BHYT)' },
  { value: 'TS2', text: 'Thai sản (không đóng BHYT)' },
  { value: 'TL', text: 'Tăng tham gia TNLÐ, BNN' },
  { value: 'HD', text: 'Đóng đủ BHXH' },
  { value: 'NV', text: 'Đã ngừng đóng BHXH' },
  { value: 'CD1', text: 'Điều chỉnh chức danh đóng mức 32%' },
  { value: 'CD2', text: 'Điều chỉnh chức danh đóng mức 0,5%' },
  { value: 'DC1', text: 'Điều chỉnh lương đóng mức 32%' },
  { value: 'DC2', text: 'Điều chỉnh lương đóng mức 0,5%' }
]

export const immediatelyResign = [
  { value: null, text: 'Chọn lý do' },
  { value: 'Không có đơn xin nghỉ việc', text: 'Không có đơn xin nghỉ việc' },
  { value: 'Có đơn xin nghỉ trước thời hạn quy định, nhưng không được xét duyệt', text: 'Có đơn xin nghỉ trước thời hạn quy định, nhưng không được xét duyệt' }
]

export const cancelResignOptions = [
  { value: null, text: 'Chọn lý do' },
  { value: 'off_no_salary_expired', text: 'Hết hạn nghỉ không lương dài hạn' },
  { value: 'pause_contract_expired', text: 'Hết hạn tạm hoãn hợp đồng' },
  { value: 'comeback', text: 'Nghỉ việc đi làm lại' }
]

export default {
  pausWorkOptions,
  suspendOptions,
  unpaidLeaveOptions,
  pauseContract,
  normalLeaveOptions,
  firedOptions,
  reactivateOptions,
  paidOptions,
  insuranceOptions,
  immediatelyResign,
  cancelResignOptions
}
