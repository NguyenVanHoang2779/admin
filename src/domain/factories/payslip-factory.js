import Payslip from 'domain/entities/Payslip'
import commonHelper from 'infrastructures/helpers/common-helpers'

/**
 * @param {Object} data
 */
export default function (data) {
  let objectData = data

  if (objectData.other_allowances && commonHelper.isJsonString(objectData.other_allowances)) {
    objectData.other_allowances = JSON.parse(objectData.other_allowances)
  } else {
    objectData.other_allowances = [{
      amount: '',
      description: ''
    }]
  }

  if (objectData.deductions && commonHelper.isJsonString(objectData.deductions)) {
    objectData.deductions = JSON.parse(objectData.deductions)
  } else {
    objectData.deductions = [{
      type: '',
      amount: '',
      description: ''
    }]
  }

  if (objectData.adjustments && commonHelper.isJsonString(objectData.adjustments)) {
    objectData.adjustments = JSON.parse(objectData.adjustments)
  } else {
    objectData.adjustments = [{
      type: '',
      amount: '',
      description: ''
    }]
  }

  const attributes = Object.assign({}, objectData)

  return new Payslip(attributes)
}
