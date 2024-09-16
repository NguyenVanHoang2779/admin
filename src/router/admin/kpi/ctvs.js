import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/kpi/ctv',
    component: LayoutAdmin,
    children: [
      {
        path: 'configs',
        component: () => import('components/pages/erp/kpi/ctvs/configs/Index')
      },
      {
        path: 'configsV2',
        component: () => import('components/pages/erp/kpi/ctvs/configsV2/Index')
      }
    ]
  }
]
