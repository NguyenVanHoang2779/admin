import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/kpi-config',
    component: LayoutAdmin,
    children: [
      {
        name: 'list-kpi-config',
        path: 'list',
        component: () => import('components/pages/erp/KpiConfig/ListKpiConfig')
      },
      {
        name: 'update-kpi-config',
        path: 'update/:config?',
        component: () => import('components/pages/erp/KpiConfig/UpdateKpiConfig')
      }
    ]
  }
]
