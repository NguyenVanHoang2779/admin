import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/kpi/modules',
    component: LayoutAdmin,
    children: [
      {
        path: 'manage',
        component: () => import('components/pages/erp/kpi/modules/Index')
      },
      {
        path: 'edit/:id?',
        name: 'edit-module-user',
        component: () => import('components/pages/erp/kpi/modules/Edit'),
        props: true
      }
    ]
  }
]
