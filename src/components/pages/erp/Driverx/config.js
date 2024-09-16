export const optionEdittor = {
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline'],
      [{'list': 'ordered'}, { 'list': 'bullet' }],
      [{'indent': '-1'}, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['image', 'link']
    ]
  },
  placeholder: 'Nhập...',
  theme: 'snow'
}

export const jobTypes = [
  { value: null, text: 'Chọn loại công việc' },
  { value: 'driver', text: 'COD' },
  { value: 'part_time', text: 'XLHH' },
  { value: 'xteam', text: 'Dxteam' },
  { value: 'truck_driver', text: 'Tài xế xe tải' }
]

export const candidateStatus = [
  { value: null, text: 'Chọn trạng thái' },
  { value: 'new', text: 'Đã ứng tuyển' },
  { value: 'taken', text: 'Đã nhận việc' },
  { value: 'save_info', text: 'Lưu thông tin' },
  { value: 'selected', text: 'Trúng tuyển' }
]

export const searchTimeOptions = [
  { value: null, text: 'Chọn thời gian' },
  { value: 'apply', text: 'Thời gian ứng tuyển' },
  { value: 'interview', text: 'Thời gian phỏng vấn' },
  { value: 'takeJob', text: 'Thời gian nhận việc' }
]

export const statuses = [
  { value: null, text: 'Chọn trạng thái tin đăng' },
  { value: 0, text: 'Đang hoạt động' },
  { value: 1, text: 'Đã xóa' }
]

export default {
  optionEdittor,
  jobTypes,
  statuses
}
