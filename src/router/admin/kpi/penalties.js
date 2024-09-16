import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/kpi/penalties',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/erp/kpi/penalties/Index')
      },
      {
        path: 'approval-penalties',
        component: () => import('components/pages/erp/kpi/approvalPenalties/index')
      },
      {
        path: 'rent-truck',
        component: () => import('components/pages/erp/kpi/penalties/IndexPenaltyRentTruck')
      }
    ]
  }
]
