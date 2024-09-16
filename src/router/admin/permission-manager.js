import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/permission',
    component: LayoutAdmin,
    children: [
      {
        name: 'manager',
        path: 'manage',
        component: () => import('components/pages/PermissionManagerment/PermissionManagermentDashboard.vue')
      }
    ]
  }
]
