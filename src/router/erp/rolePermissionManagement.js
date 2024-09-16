import LayoutPermissionManagement from 'components/pages/erp/RolePermissionManagement/layout/LayoutPermissionManagement'

export default [
  {
    path: '/rbac',
    component: LayoutPermissionManagement,
    children: [
      {
        name: 'permission-dashboard',
        path: 'permission-dashboard',
        component: () => import('components/pages/erp/RolePermissionManagement/PermissionManagement/PermissionDashboard')
      },
      {
        name: 'permission-dashboard',
        path: 'permission-dashboard/:permission_name',
        component: () => import('components/pages/erp/RolePermissionManagement/PermissionManagement/PermissionDashboard')
      },
      {
        name: 'role-dashboard',
        path: 'role-dashboard',
        component: () => import('components/pages/erp/RolePermissionManagement/RoleManagement/RoleDashboard')
      },
      {
        name: 'role-dashboard',
        path: 'role-dashboard/:role_name',
        component: () => import('components/pages/erp/RolePermissionManagement/RoleManagement/RoleDashboard')
      },
      {
        name: 'user-dashboard',
        path: 'user-dashboard',
        component: () => import('components/pages/erp/RolePermissionManagement/UserPermissionManagement/UserDashboard')
      },
      {
        name: 'user-dashboard',
        path: 'user-dashboard/:user_id',
        component: () => import('components/pages/erp/RolePermissionManagement/UserPermissionManagement/UserDashboard')
      },
      {
        name: 'position-dashboard',
        path: 'position-dashboard',
        component: () => import('components/pages/erp/RolePermissionManagement/PositionManagement/PositionDashboard')
      },
      {
        name: 'position-dashboard',
        path: 'position-dashboard/:position_id',
        component: () => import('components/pages/erp/RolePermissionManagement/PositionManagement/PositionDashboard')
      },
      {
        name: 'document',
        path: 'document',
        component: () => import('components/pages/erp/RolePermissionManagement/Document')
      }
    ]
  }
]
