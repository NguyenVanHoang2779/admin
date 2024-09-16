import BaseEntity from './BaseEntity'

export default class IdentifyBag extends BaseEntity {
  static Status = {
    Active: 1,
    Missing: 2,
    Using: 3
  }
  static IsDelete = {
    No: 0,
    Yes: 1
  }
  static Action = {
    ReportMissing: 1,
    ReportFound: 2,
    Note: 3
  }
}
