import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/work-schedule',
    component: LayoutAdmin,
    children: [
      {
        path: 'config',
        component: () => import('components/pages/erp/WorkSchedule/Config')
      },
      {
        path: 'manage',
        component: () => import('components/pages/erp/WorkSchedule/WorkScheduleManage')
      }
    ]
  }
]
