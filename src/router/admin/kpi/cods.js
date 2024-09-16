import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/kpi/cods',
    component: LayoutAdmin,
    children: [
      {
        path: 'cod-formula-config',
        component: () => import('components/pages/erp/kpi/cods/CodFormulaConfig')
      },
      {
        path: 'export-salary-cod-v2',
        component: () => import('components/pages/erp/kpi/cods/ExportSalaryCodV2')
      },
      {
        path: 'cod-ctv-config',
        component: () => import('components/pages/erp/kpi/cods/CodCtvConfig')
      },
      {
        path: 'payment',
        component: () => import('components/pages/erp/kpi/payment/Index')
      }
    ]
  }
]
