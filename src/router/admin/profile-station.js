import LayoutBlank from 'components/layout/LayoutBlank'

export default [
  {
    path: '/profile',
    component: LayoutBlank,
    children: [
      {
        path: 'station/:nStationID',
        component: () => import('components/pages/erp/kpi/profile/ProfileStation')
      }
    ]
  }
]
