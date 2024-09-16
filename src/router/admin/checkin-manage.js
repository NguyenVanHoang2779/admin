import LayoutBlank from 'components/layout/LayoutBlank'

export default [
  {
    path: '/checkin',
    component: LayoutBlank,
    children: [
      {
        name: '',
        path: 'manage',
        component: () => import('../../components/pages/erp/CheckinManager/DetailWorkShift')
      }
    ]
  }
]
