import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/truck-monitor',
    component: LayoutAdmin,
    children: [
      {
        path: 'export-salary',
        component: () => import('components/pages/erp/TruckMonitor/ExportSalaryTruckMonitor')
      }
    ]
  }
]
