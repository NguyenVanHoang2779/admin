import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/config-role',
    component: LayoutAdmin,
    children: [
      {
        path: 'manage',
        component: () => import('components/pages/erp/config-role/ConfigRoleManage')
      }
    ]
  }
]
