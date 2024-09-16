import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/coupon',
    component: LayoutAdmin,
    children: [
      {
        path: 'manage',
        name: 'coupon-manage',
        component: () => import('components/pages/Coupon/CouponManage')
      },
      {
        path: 'add/',
        name: 'coupon-add',
        component: () => import('components/pages/Coupon/CouponEdit')
      },
      {
        path: 'edit/:id',
        name: 'coupon-edit',
        component: () => import('components/pages/Coupon/CouponEdit')
      }
    ]
  }
]
