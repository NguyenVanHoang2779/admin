import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/emp-position',
    component: LayoutAdmin,
    children: [
      {
        name: 'EmpPositionManager',
        path: 'manage',
        component: () => import('components/pages/EmpPosition/EmpPositionManager.vue')
      }
    ]
  }
]
