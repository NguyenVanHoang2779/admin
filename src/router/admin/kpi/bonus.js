import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/kpi/bonus',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/erp/kpi/bonus/Index')
      }
    ]
  }
]
