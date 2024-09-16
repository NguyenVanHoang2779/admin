import BaseEntity from './BaseEntity'

export default class StaffInfo extends BaseEntity {
  static yesNoOptions = [
    {value: 1, text: 'Có'},
    {value: 0, text: 'Không'}
  ]

  static workStateOptions = [
    {value: 'stable_job', text: 'Có việc làm ổn định'},
    {value: 'precarious_job', text: 'Có việc nhưng bấp bênh'},
    {value: 'unemployee', text: 'Thất nghiệp'},
    {value: 'age_over', text: 'Quá tuổi lao động'}
  ]

  static careerPathOptions = [
    {value: 'long_term', text: 'Sẽ gắn bó lâu dài'},
    {value: 'temporary', text: 'Chỉ làm tạm thời'},
    {value: 'about_to_quit', text: 'Đang có ý định nghỉ'}
  ]

  static familyEconomicOptions = [
    {value: 'rich', text: 'Khá giả'},
    {value: 'normal', text: 'Bình thường'},
    {value: 'poor', text: 'Khó khăn'},
    {value: 'very_poor', text: 'Rất khó khăn'}
  ]

  static infoTypeDesc = {
    staff_code: 'Mã MP',
    fullname: 'Họ và tên nhân viên',
    character_by_guardian: 'Tính cách nhân viên qua đánh giá của NBL',
    date_visit_home: 'Ngày thăm nhà',
    employee_career_path: 'Nhân viên chia sẻ gì về định hướng gắn bó?',
    employee_sharing: 'Nhân viên kể gì về công việc ở GHTK?',
    family_economic: 'Tình hình kinh tế gia đình',
    guardian_agree: 'NBL đồng ý bảo lãnh',
    guardian_know_responsibility: 'NLĐ hiểu về trách nhiệm bảo lãnh',
    guardian_work_state: 'Tình hình việc làm của NBL',
    is_breadwinner: 'Nhân viên có phải trụ cột kinh tế gia đình không?',
    note: 'Ghi chú',
    user_visit_home: 'Người đi thăm',
    file_visit: 'Ảnh check-in tại nhà NBL',
    locate_guardian_house: 'Định vị nhà của NBL'
  }
}
