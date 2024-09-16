import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/smart-locker',
    component: LayoutAdmin,
    children: [
      {
        path: '/',
        name: 'smart-locker-config-cart',
        component: () => import('components/pages/SmartLocker/ConfigCarts')
      }
    ]
  }
]
