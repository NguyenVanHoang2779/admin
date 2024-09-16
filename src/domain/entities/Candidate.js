import BaseEntity from './BaseEntity'

export default class Candidate extends BaseEntity {
  static listStatus = {
    'contact': 'Cần liên hệ',
    'received': 'Đã tiếp nhận',
    'contact_fail': 'Liên hệ không thành công',
    'cancel_recruit': 'Hủy ứng tuyển',
    'interview': 'Đã hẹn phỏng vấn',
    'saveinfo': 'Lưu thông tin',
    'expect_join': 'Đã trúng tuyển',
    'take_job': 'Đã nhận việc',
    'rejected': 'Trượt phỏng vấn',
    'refused': 'Từ chối nhận việc',
    'noStatus': 'Chưa có trạng thái',
    'selected': 'Trúng tuyển',
    'new': 'Đã ứng tuyển',
    'save_info': 'Lưu thông tin',
    'taken': 'Nhận việc'
  }

  static referralEnums = {
    facebook: 'Facebook/internet',
    web: 'Jobsite tuyển dụng',
    workfes: 'Ngày hội việc làm',
    gtvlservice: 'Dịch vụ GTVL',
    ghtk: 'Nhân viên GHTK',
    employee: 'Giới thiệu nội bộ',
    friend: 'Bạn bè, người thân',
    collabor: 'CTV tuyển dụng',
    other: 'Khác',
    outdoor: 'Quảng cáo ngoài trời'
  }

  static sourceOptions = {
    outdoor: [
      {
        text: 'Poster/Banner/Tờ rơi',
        value: 'poster'
      },
      {
        text: 'Booth tuyển dụng',
        value: 'booth'
      }
    ],
    facebook: [
      {
        text: 'Ads',
        value: 'ads'
      },
      {
        text: 'Cá nhân',
        value: 'personal'
      }
    ],
    web: [
      {
        text: 'Ybox',
        value: 'ybox'
      },
      {
        text: 'Vieclam24h',
        value: 'vieclam24h'
      },
      {
        text: 'Timviecnhanh',
        value: 'timviecnhanh'
      },
      {
        text: 'JobsGO',
        value: 'jobsgo'
      },
      {
        text: 'Top CV',
        value: 'topcv'
      },
      {
        text: 'Career Builder',
        value: 'career_builder'
      },
      {
        text: 'Chợ tốt',
        value: 'cho_tot'
      },
      {
        text: 'Career Link',
        value: 'career_link'
      },
      {
        text: 'Khác',
        value: 'other'
      }
    ]
  }

  static sourceDesc = {
    outdoor: {
      poster: 'Poster/Banner/Tờ rơi',
      booth: 'Booth tuyển dụng'
    },
    facebook: {
      ads: 'Ads',
      personal: 'Cá nhân'
    },
    web: {
      ybox: 'Ybox',
      vieclam24h: 'Vieclam24h',
      timviecnhanh: 'Timviecnhanh',
      jobsgo: 'JobsGO',
      topcv: 'Top CV',
      career_builder: 'Career Builder',
      cho_tot: 'Chợ tốt',
      career_link: 'Career Link',
      other: 'Khác'
    }
  }

  static joinTimeOption = [
    { desc: 'Ngay sau phỏng vấn', value: 'after_interview' },
    { desc: 'Trong tuần này', value: 'in_week' },
    { desc: 'Trong tuần tới', value: 'next_week' },
    { desc: 'Trao đổi thêm khi phỏng vấn', value: 'unknown' }
  ]

  getStatusName (status) {
    return Candidate.listStatus[status]
  }

  getStatusClass (status) {
    switch (status) {
      case 'contact':
        return 'badge badge-default'
      case 'interview':
        return 'badge badge-primary'
      case 'take_job':
      case 'taken':
        return 'badge badge-success'
      case 'rejected':
        return 'badge badge-danger'
      case 'expect_join':
      case 'selected':
        return 'badge badge-info'
      case 'save_info':
        return 'badge badge-light'
      default:
        return 'badge badge-default'
    }
  }

  getStatusOptions () {
    let statusOptions = []
    let listStatus = Candidate.listStatus
    Object.keys(listStatus).forEach((status) => {
      statusOptions.push({
        value: status,
        name: listStatus[status]
      })
    })
    return statusOptions
  }

  static workTypeDesc = {
    fulltime: 'Full-time',
    parttime: 'Part-time',
    inprovince: 'Nội tỉnh',
    interprovince: 'Liên tỉnh',
    longdistance: 'Đường dài'
  }

  static workShiftDesc = {
    day: 'Ca ngày',
    night: 'Ca đêm',
    all: 'Cả 2 ca',
    morning: 'Ca sáng',
    afternoon: 'Ca chiều',
    befornight: 'Ca tối',
    sunday: 'Chuyên chủ nhật'
  }
}
