import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/XTeam',
    component: LayoutAdmin,
    children: [
      {
        path: 'manageCoupons',
        component: () => import('components/couponsXTeam/couponsXTeam')
      }
    ]
  }
]
