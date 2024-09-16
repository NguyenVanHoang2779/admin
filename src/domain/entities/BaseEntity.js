export default class BaseEntity {
  constructor (attributes) {
    if (typeof attributes === 'object' && attributes !== null) {
      this.from(attributes)
    }
  }

  from (attributes) {
    Object.keys(attributes).forEach((key) => {
      this[key] = attributes[key]
    })
  }
}
