import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/driverx',
    component: LayoutAdmin,
    children: [
      {
        path: 'jobs',
        name: 'driverx-jobs',
        component: () => import('components/pages/erp/Driverx/ListJobs')
      },
      {
        path: 'create',
        name: 'driverx-create-job',
        component: () => import('components/pages/erp/Driverx/CreateJob')
      },
      {
        path: ':id/candidates',
        name: 'driverx-job-detail',
        component: () => import('components/pages/erp/Driverx/JobDetail')
      },
      {
        path: ':id/edit',
        name: 'driverx-edit-job',
        component: () => import('components/pages/erp/Driverx/EditJob')
      },
      {
        path: 'driver-penalties',
        name: 'driver-penalties',
        component: () => import('components/cods/ConfirmPenaltiesDriver')
      },
      {
        path: 'training',
        name: 'driverx-training',
        component: () => import('components/pages/erp/Driverx/Training')
      },
      {
        path: 'training/:id/builder',
        name: 'training-builder',
        component: () => import('components/pages/erp/Driverx/Builder')
      }
    ]
  }
]
