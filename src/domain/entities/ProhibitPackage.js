import BaseEntity from './BaseEntity'

export default class ProhibitPackage extends BaseEntity {
  static optionsCensorshipStatus = [
    { value: 'CHUA_DUYET', text: 'Chưa duyệt' },
    { value: 'DA_DUYET', text: 'Đã duyệt' },
    { value: 'THE_VANG', text: 'Thẻ vàng' },
    { value: 'THE_DO', text: 'Thẻ đỏ' }
  ]

  static optionsAttributeProduct = [
    { value: 'DE_VO', text: 'Dễ vỡ' },
    { value: 'GIA_TRI_CAO', text: 'Giá trị cao' },
    { value: 'CONG_KENH', text: 'Cồng kềnh' }
  ]

  static optionsPropertySystem = [
    { value: 'HANG_FAKE', text: 'Hàng fake' },
    { value: 'HANG_LAU', text: 'Hàng lậu' },
    { value: 'HANG_TU_SAN_XUAT', text: 'Hàng tự sản xuất' },
    { value: 'HANG_CHINH_HANG', text: 'Hàng chính hãng có thương hiệu' }
  ]
}
