import LayoutBlank from 'components/layout/LayoutBlank'
export default [
  {
    path: '/profile/',
    component: LayoutBlank,
    children: [
      {
        path: 'cods/:id',
        redirect: 'staff/:id'
        // component: () => import('components/pages/erp/kpi/profile/Index')
      },
      {
        path: 'staff/:id',
        component: () => import('components/pages/erp/kpi/profile/Index')
      }
    ]
  }
]
