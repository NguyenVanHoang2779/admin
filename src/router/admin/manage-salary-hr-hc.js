import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/hr-hc',
    component: LayoutAdmin,
    children: [
      {
        path: 'manage-salary',
        component: () => import('components/hr-hc/manageSalary')
      }
    ]
  }
]
