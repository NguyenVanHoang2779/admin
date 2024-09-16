import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/kpi',
    component: LayoutAdmin,
    children: [
      {
        path: 'shift-manage',
        component: () => import('components/pages/erp/shiftConfig/Index')
      }
    ]
  }
]
