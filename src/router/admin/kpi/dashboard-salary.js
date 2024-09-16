import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/salary/dashboard',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/erp/kpi/DashboardSalary/Index')
      }
    ]
  }
]
