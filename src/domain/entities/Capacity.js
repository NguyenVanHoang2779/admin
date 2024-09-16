import BaseEntity from './BaseEntity'

export default class Capacity extends BaseEntity {
  static optionsType = [
    { value: '1', text: 'COD lấy' },
    { value: '2', text: 'COD giao' },
    { value: '3', text: 'COD trả' }
  ]
  static optionsPerPage = [
    { value: '25', text: '25' },
    { value: '50', text: '50' },
    { value: '100', text: '100' }
  ]
}
