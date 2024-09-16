import BaseEntity from './BaseEntity'

export default class CartScript extends BaseEntity {
  static shopTypes = [
    {value: 1, alias: 'Shop C2C'},
    {value: 2, alias: 'Shop B2C'}
  ]
  static goodTypes = [
    {value: 1, alias: 'Giá trị cao'},
    {value: 2, alias: 'Dễ vỡ'},
    {value: 3, alias: 'Đơn nhỏ'},
    {value: 4, alias: 'Đơn thư tín'},
    {value: 5, alias: 'Đơn nguyên hộp'},
    {value: 6, alias: 'Đơn Xfast'}
  ]
  static packageTypes = [
    {value: 1, alias: 'Nội tỉnh'},
    {value: 2, alias: 'Nội miền'},
    {value: 3, alias: 'Liên miền'}
  ]
  static details = {
    shop_names: {id: 1, value: 'shop_names', text: 'Tên shop'},
    shop_types: {id: 2, value: 'shop_types', text: 'Loại shop'},
    good_types: {id: 3, value: 'good_types', text: 'Loại hàng'},
    package_types: {id: 4, value: 'package_types', text: 'Loại đơn'},
    package_type_need_checks: {id: 5, value: 'package_type_need_checks', text: 'Loại đơn cần kiểm tra'},
    priority_scripts: {id: 6, value: 'priority_scripts', text: 'Kb ưu tiên'},
    package_weights: {id: 21, value: 'package_weights', text: 'Cân nặng'},
    shop_tags: {id: 22, value: 'shop_tags', text: 'Shop Tag'}
  }
  static priorityScripts = [
    {value: 1, alias: 'Cho phép gửi hàng bưu cục'},
    {value: 2, alias: 'Lấy trong 3 ca'},
    {value: 3, alias: 'Lấy trong 4 ca'},
    {value: 4, alias: 'Lấy trong 5 ca'},
    {value: 5, alias: 'Lấy trong 6 ca'}
  ]
  static packageTypeNeedChecks = [
    {value: 1, alias: 'Ngành mới'},
    {value: 2, alias: 'Đơn GTV/dễ vỡ'},
    {value: 3, alias: 'Đơn thư tín'},
    {value: 4, alias: 'Đơn BBS'},
    {value: 5, alias: 'Toàn bộ đơn hàng'}
  ]
  static packageWeights = [
    {value: 1, alias: '< 3 kg'},
    {value: 2, alias: '3-5 kg'},
    {value: 3, alias: '5-10 kg'},
    {value: 4, alias: '10-15 kg'},
    {value: 5, alias: '15-20 kg'},
    {value: 6, alias: '> 20 kg'}
  ]

  static shopTags = [
    {value: 1, alias: 'Hàng order'},
    {value: 2, alias: 'CTV'}
  ]

  static getMasterTagData () {
    const shopTypes = {}
    CartScript.shopTypes.forEach(type => {
      shopTypes[type.value] = type.alias
    })
    const goodTypes = {}
    CartScript.goodTypes.forEach(type => {
      goodTypes[type.value] = type.alias
    })
    const packageTypes = {}
    CartScript.packageTypes.forEach(type => {
      packageTypes[type.value] = type.alias
    })
    const priorityScripts = {}
    CartScript.priorityScripts.forEach(type => {
      priorityScripts[type.value] = type.alias
    })
    const packageTypeNeedChecks = {}
    CartScript.packageTypeNeedChecks.forEach(type => {
      packageTypeNeedChecks[type.value] = type.alias
    })
    const packageWeights = {}
    CartScript.packageWeights.forEach(type => {
      packageWeights[type.value] = type.alias
    })
    const shopTags = {}
    CartScript.shopTags.forEach(type => {
      shopTags[type.value] = type.alias
    })
    return {
      shopTypes: shopTypes,
      goodTypes: goodTypes,
      packageTypes: packageTypes,
      priorityScripts: priorityScripts,
      packageTypeNeedChecks: packageTypeNeedChecks,
      packageWeights: packageWeights,
      shopTags: shopTags,
      details: CartScript.details
    }
  }
  static getOptions () {
    return {
      shopTypes: CartScript.shopTypes,
      goodTypes: CartScript.goodTypes,
      packageTypes: CartScript.packageTypes,
      priorityScripts: CartScript.priorityScripts,
      packageTypeNeedChecks: CartScript.packageTypeNeedChecks,
      packageWeights: CartScript.packageWeights,
      shopTags: CartScript.shopTags
    }
  }
  static allCheckPackage = 5
  static getShiftPriorityScripts = [2, 3, 4, 5]
}
