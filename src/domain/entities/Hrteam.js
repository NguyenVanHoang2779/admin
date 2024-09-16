import BaseEntity from './BaseEntity'

export default class Hrteam extends BaseEntity {
  static groupType = {
    hc: 'hc',
    ns: 'ns',
    cod_star: 'cod_star',
    operator: 'operator',
    business_development: 'business_development'
  }

  static groupTeamDesc = {
    hc: 'Hành chính',
    ns: 'Nhân sự',
    cod_star: 'COD Star',
    operator: 'Vận hành',
    business_development: 'Phát triển kinh doanh'
  }

  static TeamGroupType = [
    { value: 'ns', type: 'Nhân sự' },
    { value: 'hc', type: 'Hành chính' },
    { value: 'cod_star', type: 'COD Star' },
    { value: 'operator', type: 'Vận hành' },
    { value: 'business_development', type: 'Phát triển kinh doanh' }
  ]

  static TeamSubGroupType = [
    { value: 'hr_recruitment', type: 'Nhân sự tuyển dụng' },
    { value: 'hr_care', type: 'Nhân sự chăm sóc' }
  ]

  static ManagementTarget = [
    { value: 'xteam', desc: 'Xteam' },
    { value: 'cod', desc: 'COD (trừ Xteam)' },
    { value: 'xlhh', desc: 'Xử lý hàng hóa (trừ xlhh XTeam)' },
    { value: 'driver', desc: 'Tài xế' }
  ]
}
