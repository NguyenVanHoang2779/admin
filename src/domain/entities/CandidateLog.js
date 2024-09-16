import BaseEntity from './BaseEntity'

export default class CandidateLog extends BaseEntity {
  static listExplainAction = [
    'explain_not_contacted',
    'explain_not_interviewed',
    'explain_not_take_job'
  ]
}
