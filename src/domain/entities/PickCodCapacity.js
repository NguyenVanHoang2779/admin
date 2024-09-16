import BaseEntity from './BaseEntity'

export default class PickCodCapacity extends BaseEntity {
  static PickCodWorkShifts = [
    {value: 1, text: 'Ca sáng'},
    {value: 2, text: 'Ca chiều'},
    {value: 3, text: 'Ca tối'}
  ]
}
