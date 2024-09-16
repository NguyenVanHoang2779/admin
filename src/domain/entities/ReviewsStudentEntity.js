import BaseEntity from './BaseEntity'

export default class ReviewStudentEntity extends BaseEntity {
  static learningSpirits = [
    {
      id: 4,
      name: 'Tuyệt vời',
      tooltip: 'Tham gia học tập sôi nổi, chủ động đóng góp tích cực cho lớp học, chủ động chia sẻ'
    },
    {
      id: 3,
      name: 'Đáng khen',
      tooltip: 'Tham gia đóng góp, phát biểu khi giảng viên đặt câu hỏi'
    },
    {
      id: 2,
      name: 'Bình thường',
      tooltip: 'Không có gì cần lưu ý'
    },
    {
      id: 1,
      name: 'Cần cải thiện',
      tooltip: 'Không hợp tác, gây cản trở tới chất lượng lớp học, để treo máy không học'
    }
  ]

  static attitudes = [
    {
      id: 4,
      name: 'Tham gia đầy đủ'
    },
    {
      id: 2,
      name: 'Vào muộn'
    },
    {
      id: 3,
      name: 'Về sớm'
    },
    {
      id: 1,
      name: 'Vào muộn + Về sớm'
    }
  ]
}
