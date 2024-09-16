import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/kpi/config-cancel-penalties',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/erp/kpi/ConfigCancelPenalty/Index')
      }
    ]
  },
  {
    path: '/kpi/config-salary',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/erp/kpi/ConfigCancelPenalty/IndexConfigSalary')
      }
    ]
  }
]
