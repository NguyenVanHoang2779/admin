import LayoutBlank from 'components/layout/LayoutBlank'

export default [
  {
    path: '/profile',
    component: LayoutBlank,
    children: [
      {
        path: 'truck/:truck_order',
        component: () => import('components/pages/erp/kpi/profile/ProfileTruck')
      }
    ]
  }
]
