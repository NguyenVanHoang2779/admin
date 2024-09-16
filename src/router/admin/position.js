import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/position',
    component: LayoutAdmin,
    children: [
      {
        name: 'list-position',
        path: 'manage',
        component: () => import('components/pages/Position/PositionManager.vue')
      }
    ]
  }
]
