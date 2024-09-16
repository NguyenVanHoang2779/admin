import BaseEntity from './BaseEntity'

export default class Union extends BaseEntity {
  static unionTypes = {
    type_member_died: 3,
    type_relatives_die: 4,
    type_marry: 5,
    type_birth_baby: 6,
    type_accident_member: 7,
    type_sick_relative: 8
  }

  static listTypeNumberInput= [
    Union.unionTypes.type_relatives_die,
    Union.unionTypes.type_birth_baby,
    Union.unionTypes.type_sick_relative
  ];

  static showNumberInput (type) {
    return Union.listTypeNumberInput.includes(parseInt(type))
  }

  static listTypeDie = [
    Union.unionTypes.type_member_died,
    Union.unionTypes.type_relatives_die
  ]

  static labelNumberInput (type) {
    switch (type) {
      case Union.unionTypes.type_relatives_die:
        return 'Số người mất'
      case Union.unionTypes.type_birth_baby:
        return 'Số con'
      case Union.unionTypes.type_sick_relative:
        return 'Số người ốm'
    }
  }

  static inListTypeDie (type) {
    return Union.listTypeDie.includes(type)
  }
}
