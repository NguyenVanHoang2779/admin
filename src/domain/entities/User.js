import BaseEntity from './BaseEntity'

export default class User extends BaseEntity {
  static LOCK_STATUS = 1
  static DEACTIVATE_STATUS = 2
  static ACTIVE_STATUS = 3

  static statusOptions = {
    1: 'Dừng hoạt động',
    2: 'Khóa tạm thời',
    3: 'Đang hoạt động'
  }
  static statusVariant = {
    1: 'danger',
    2: 'warning',
    3: 'ghtk'
  }
  static defaultCriteriaFstar = [
    {id: 'honest', name: 'Trung thực', descrip: ''},
    {id: 'responsibility', name: 'Tinh thần trách nhiệm', descrip: ''},
    {id: 'disciplinary', name: 'Kỷ luật', descrip: ''},
    {id: 'effective', name: 'Hiệu quả công việc', descrip: ''},
    {id: 'core_values', name: 'Nhanh - giá trị cốt lõi', descrip: ''},
    {id: 'resolve_problem', name: 'Giải quyết vấn đề đến cùng', descrip: ''},
    {id: 'creation', name: 'Cải tiến, Sáng tạo', descrip: ''}
  ]

  static defaultManagerCriteriaFstar = [
    {id: 'work_assign', name: 'Sắp xếp, phân công công việc', descrip: ''},
    {id: 'evaluate_control', name: 'Đánh giá, kiểm soát', descrip: ''},
    {id: 'train_develop', name: 'Đào tạo, phát triển nhân viên', descrip: ''},
    {id: 'build_collectivity', name: 'Gắn kết, xây dựng tập thể', descrip: ''}
  ]

  static techCriteriaFstar = [
    {id: 'honest', name: 'Cẩn thận', descrip: 'Xem xét kỹ lưỡng task đảm nhận, kể cả sau khi đã golive, luôn có những biện pháp để review/check chéo nhằm đảm bảo tính đúng đắn chính xác'},
    {id: 'responsibility', name: 'Tinh thần Trách nhiệm', descrip: 'Biết nhận trách nhiệm và chịu trách nhiệm cho những task được giao, đảm bảo chất lượng sản phẩm của mình là tốt nhất trước khi đưa cho team khác. Luôn trong trạng thái sẵn sàng support 24/7'},
    {id: 'disciplinary', name: 'Kỷ luật', descrip: 'Tôn trọng và chấp hành kỷ luật của cty/tập thể, ko để việc cá nhân ảnh hưởng tới công việc chung'},
    {id: 'effective', name: 'Teamwork', descrip: 'Tinh thần tập thể hòa đồng, tôn trọng, phối hợp và hỗ trợ lẫn nhau, luôn làm rõ và cùng hướng đến việc đạt mục tiêu chung mỗi khi làm việc cùng nhau'},
    {id: 'core_values', name: 'Khả năng kiểm soát timeline', descrip: 'Estimate task chuẩn, tôn trọng deadline, chủ động phối hợp với các bên liên quan để đảm task hoàn thành đúng deadline. Ko đổ lỗi, ko né trách nhiệm.'},
    {id: 'resolve_problem', name: 'Chủ động', descrip: 'Tự chủ, trách nhiệm, đặt mục tiêu cao cho bản thân và team, mọi hành động đều hướng tới kết quả cụ thể, rõ ràng. Gặp khó khăn, vướng mắc cũng luôn chủ động tìm giải pháp hoặc tối thiểu là chủ động thông báo để các bên liên quan nắm được thông tin'},
    {id: 'creation', name: 'Kỹ năng giải quyết vấn đề linh hoạt', descrip: 'linh hoạt nhạy bén, ứng phó nhanh trong giải quyết tình huống. Luôn sẵn sàng các giải pháp tình thế/ giải pháp kỹ thuật thay thế khi gặp khó khăn, nhằm đạt yêu cầu của task'}
  ]

  static WH_STAFF_POSITIONS = [40, 41, 42, 79, 80, 124]
  static WH_STAFF_ONSITE_POSITIONS = 124
  static WH_STAFF_BIG_SIZE_POSITIONS = 174
  static WH_STAFF_GROUPS = [23, 26]

  static getStatusName (statusId) {
    let status = parseInt(statusId)
    return this.statusOptions[status] ? this.statusOptions[status] : 'Không xác định'
  }

  static whDefaultWork = [
    { text: 'Xuống tải', value: 'down_truck' },
    { text: 'Sorting bao', value: 'sorting_bag' },
    { text: 'Sorting đơn', value: 'sorting_package' },
    { text: 'Làm hàng', value: 'labeling' },
    { text: 'Lên tải', value: 'up_truck' },
    { text: 'Trung chuyển', value: 'transit' }
  ]

  static rankingOption = [
    { text: 'Chọn cấp bậc', value: '' },
    { text: 'F1', value: 'F1' },
    { text: 'F2', value: 'F2' },
    { text: 'F3', value: 'F3' },
    { text: 'J1', value: 'J1' },
    { text: 'J2', value: 'J2' },
    { text: 'J3', value: 'J3' },
    { text: 'J4', value: 'J4' },
    { text: 'J5', value: 'J5' },
    { text: 'S1', value: 'S1' },
    { text: 'S2', value: 'S2' },
    { text: 'S3', value: 'S3' },
    { text: 'S4', value: 'S4' },
    { text: 'S5', value: 'S5' },
    { text: 'Xóa cấp bậc', value: ' ' }
  ]

  static managerLevelOption = [
    { text: 'Chọn cấp quản lý', value: '' },
    { text: 'M1', value: 'M1' },
    { text: 'M2', value: 'M2' },
    { text: 'M3', value: 'M3' },
    { text: 'M4', value: 'M4' },
    { text: 'M5', value: 'M5' },
    { text: 'M6', value: 'M6' },
    { text: 'M7', value: 'M7' },
    { text: 'M8', value: 'M8' },
    { text: 'M9', value: 'M9' },
    { text: 'M10', value: 'M10' },
    { text: 'Xóa cấp quản lý', value: '' }
  ]

  static rankingByDuty = {
    1: [], // Ban giám đốc
    2: [], // BĐH cấp cao
    3: [ // Trưởng/ Phó trưởng
      { text: 'M2', value: 'Management-M2' },
      { text: 'M3', value: 'Management-M3' },
      { text: 'Xóa cấp quản lý', value: '' }
    ],
    4: [], // ban điều hành cấp trung
    5: [], // Trưởng nhóm (team leader)
    8: [ // trưởng nhóm
      { text: 'M1', value: 'Management-M1' },
      { text: 'Xóa cấp bậc nhân viên', value: '' }
    ],
    9: [ // Tech leader
      { text: 'Senior L8', value: 'Senior-L8' },
      { text: 'Senior L7', value: 'Senior-L7' },
      { text: 'Middle L7', value: 'Middle-L7' },
      { text: 'Middle L6', value: 'Middle-L6' },
      { text: 'Middle L5', value: 'Middle-L5' },
      { text: 'Junior L4', value: 'Junior-L4' },
      { text: 'Junior L3', value: 'Junior-L3' },
      { text: 'Junior L2', value: 'Junior-L2' },
      { text: 'Fresher L1', value: 'Fresher-L1' },
      { text: 'Xóa cấp bậc nhân viên', value: '' }
    ],
    10: [ // Chuyên gia
      { text: 'M2', value: 'Management-M2' },
      { text: 'M3', value: 'Management-M3' },
      { text: 'Xóa cấp quản lý', value: '' }
    ],
    6: [ // Nhân viên
      { text: 'Senior L8', value: 'Senior-L8' },
      { text: 'Senior L7', value: 'Senior-L7' },
      { text: 'Middle L7', value: 'Middle-L7' },
      { text: 'Middle L6', value: 'Middle-L6' },
      { text: 'Middle L5', value: 'Middle-L5' },
      { text: 'Junior L4', value: 'Junior-L4' },
      { text: 'Junior L3', value: 'Junior-L3' },
      { text: 'Junior L2', value: 'Junior-L2' },
      { text: 'Fresher L1', value: 'Fresher-L1' },
      { text: 'Xóa cấp bậc nhân viên', value: '' }
    ],
    7: [] // Thực tập sinh

  }
}
