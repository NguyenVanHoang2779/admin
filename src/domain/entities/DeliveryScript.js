import BaseEntity from './BaseEntity'

export default class DeliveryScript extends BaseEntity {
  static clearRouteOptions = [
    {text: 'Ca 1', value: '1'},
    {text: 'Ca 2', value: '2'},
    {text: 'Ca 3', value: '3'},
    {text: 'Ca 4', value: '4'}
  ]
  static dayOfWeekOptions = [
    {text: 'Thứ hai', value: 2},
    {text: 'Thứ ba', value: 3},
    {text: 'Thứ tư', value: 4},
    {text: 'Thứ năm', value: 5},
    {text: 'Thứ sáu', value: 6},
    {text: 'Thứ bảy', value: 7},
    {text: 'Chủ nhật', value: 8}
  ]

  static workShiftOptions = [
    {
      text: 'Ca sáng',
      value: 1,
      frame_time: {
        start_time: '06:00',
        end_time: '13:30'
      }
    },
    {
      text: 'Ca chiều',
      value: 2,
      frame_time: {
        start_time: '13:30',
        end_time: '19:30'
      }
    },
    {
      text: 'Ca tối',
      value: 3,
      frame_time: {
        start_time: '19:00',
        end_time: '22:00'
      }
    }
  ]

  /**
   * Khung thời gian áp dụng có config capacity theo phiên
   *
   * @type {[{text: string, value: number, frame_time: {start_time: string, end_time: string}},{text: string, value: number, frame_time: {start_time: string, end_time: string}},{text: string, value: number, frame_time: {start_time: string, end_time: string}}]}
   * @since OSNV-5435
   */
  static workShiftOptionOfCapacity = [
    {
      text: 'Ca sáng',
      value: 1,
      frame_time: {
        start_time: '06:00',
        end_time: '11:59'
      }
    },
    {
      text: 'Ca chiều',
      value: 2,
      frame_time: {
        start_time: '12:00',
        end_time: '16:59'
      }
    },
    {
      text: 'Ca tối',
      value: 3,
      frame_time: {
        start_time: '17:00',
        end_time: '22:00'
      }
    }
  ]
  static customerTypes = {
    id: '1',
    label: 'Loại khách hàng',
    options: [
      {name: 'KH mới', id: 1},
      {name: 'KH tích xanh', id: 2},
      {name: 'KH bi xấu', id: 3},
      {name: 'KH bị SOS nội bộ', id: 4},
      {name: 'KH khó giao', id: 5}
    ]
  }

  static crossRegionPackageTypes = {
    id: '2',
    label: 'Loại đơn',
    options: [
      {name: 'Nội tỉnh', id: 1},
      {name: 'Liên miền', id: 3},
      {name: 'Nội miền', id: 4}
    ]
  }

  static weightTypes = {
    id: '3',
    label: 'Khối lượng',
    options: [
      {name: '< 3kg', id: 1},
      {name: '3 - 5kg', id: 2},
      {name: '5 - 10kg', id: 3},
      {name: '> 10kg', id: 4}
    ]
  }

  static specialTypes = {
    id: '4',
    label: 'Đơn đặc biệt',
    options: [
      {name: 'Đơn giá trị cao', id: 1},
      {name: 'Đơn nhỏ', id: 2},
      {name: 'Đơn dễ vỡ', id: 3},
      {name: 'Đơn 0đ', id: 4}
    ]
  }

  static groupTypes = {
    id: '5',
    label: 'Ngành hàng',
    options: [
      {name: 'Gia dụng', id: 1},
      {name: 'Mỹ phẩm', id: 2},
      {name: 'Thời trang', id: 3},
      {name: 'Phụ kiện thời trang', id: 4},
      {name: 'Mẹ và bé', id: 5},
      {name: 'Thuốc', id: 6},
      {name: 'Cây', id: 7},
      {name: 'Đồ điện tử', id: 8},
      {name: 'Thời trang trẻ em', id: 9},
      {name: 'Sách - văn phòng phẩm', id: 10},
      {name: 'Phong thủy', id: 11}
    ]
  }

  static successRateTypes = {
    id: '6',
    label: 'Tỉ lệ TC',
    options: [
      {name: '< 60%', id: 1},
      {name: '60 - 70%', id: 2},
      {name: '70 - 80%', id: 3},
      {name: '80 - 90%', id: 4},
      {name: '>= 90%', id: 5}
    ]
  }

  static successRateFirstWorkShiftTypes = {
    id: '7',
    label: 'Tỉ lệ TC ca đầu',
    options: [
      {name: '< 60%', id: 1},
      {name: '60 - 70%', id: 2},
      {name: '70 - 80%', id: 3},
      {name: '80 - 90%', id: 4},
      {name: '>= 90%', id: 5}
    ]
  }

  static averageOfDeliveryTimeProps = {
    id: '8',
    label: 'Số lần giao TB',
    placeholder: 'Chọn số lần',
    options: [
      {id: 1, name: 'Số lần giao TB: 1'},
      {id: 2, name: 'Số lần giao TB: 2'},
      {id: 3, name: 'Số lần giao TB: 3'},
      {id: 4, name: 'Số lần giao TB: 4'},
      {id: 5, name: 'Số lần giao TB: 5'},
      {id: 6, name: 'Số lần giao TB: 6'},
      {id: 7, name: 'Số lần giao TB: 7'},
      {id: 8, name: 'Số lần giao TB: 8'},
      {id: 9, name: 'Số lần giao TB: 9'},
      {id: 10, name: 'Số lần giao TB: 10'}
    ]
  }

  static pickProvinceProps = {
    id: '9',
    label: 'Tỉnh lấy của đơn',
    placeholder: 'Chọn tỉnh',
    options: []
  }

  static shopProps = {
    id: '10',
    label: 'Shop',
    placeholder: 'Chọn shop',
    options: []
  }
  static checkComingPackagePropsCheckboxList = [
    DeliveryScript.customerTypes,
    DeliveryScript.crossRegionPackageTypes,
    DeliveryScript.weightTypes,
    DeliveryScript.specialTypes,
    DeliveryScript.groupTypes,
    DeliveryScript.successRateTypes,
    DeliveryScript.successRateFirstWorkShiftTypes
  ];

  static checkComingPackagePropsSelectList = [
    DeliveryScript.averageOfDeliveryTimeProps,
    DeliveryScript.pickProvinceProps,
    DeliveryScript.shopProps
  ]
  static checkComingPackageTask = 1
  static updateCustomerInfoTask = 2
  static deliveryPriorityTask = 3
  static checkComingPackageAction = [
    {text: 'Chỉ được hẹn giao', id: 1},
    {text: 'Chỉ được sửa địa chỉ', id: 2},
    {text: 'Hẹn giao không cần NVBC xác nhận', id: 3}
  ]
  static taskDeliveryDetails = [
    {id: DeliveryScript.checkComingPackageTask, text: 'Check đơn coming', tags: [], actions: DeliveryScript.checkComingPackageAction}
  ]
  static categoryDeliver = 1
  static categories = [
    {id: 1, text: 'Giao hàng', tasks: DeliveryScript.taskDeliveryDetails}
  ]

  /**
   *
   * @returns {{masterActionOptions: {}, masterTaskOptions: {}, masterTagOptions: {}}}
   */
  static getMasterOptions () {
    const masterTaskOptions = {}
    const masterTagOptions = {}
    const masterActionOptions = {}

    DeliveryScript.categories.forEach((category) => {
      masterTaskOptions[category.id] = category.tasks.map(
        (task) => {
          return {
            id: task.id,
            text: task.text
          }
        })

      const tagOfTask = {}
      const actionsOfTask = {}
      category.tasks.forEach((task) => {
        tagOfTask[task.id] = task.tags.map(
          (tag) => {
            return {
              id: tag.id,
              text: tag.text
            }
          })
        actionsOfTask[task.id] = task.actions.map(
          (action) => {
            return {
              id: action.id,
              text: action.text
            }
          })
      })
      masterTagOptions[category.id] = tagOfTask
      masterActionOptions[category.id] = actionsOfTask
    })
    return {
      masterTaskOptions: masterTaskOptions,
      masterTagOptions: masterTagOptions,
      masterActionOptions: masterActionOptions
    }
  }

  static packageSpecialCapacity = [
    {
      text: 'Đơn nội thành',
      value: 1
    },
    {
      text: 'Đơn BBS',
      value: 2
    },
    {
      text: 'Đơn giá trị cao',
      value: 3
    },
    {
      text: 'Đơn nông sản',
      value: 4
    }
  ]
}
