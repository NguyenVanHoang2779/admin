import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/area',
    component: LayoutAdmin,
    children: [
      {
        path: 'manager',
        component: () => import('components/area/AreasManager')
      },
      {
        path: 'reason',
        component: () => import('components/area/BlockReason')
      }
    ]
  }
]
