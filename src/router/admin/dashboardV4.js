import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [{
  path: '/dashboard/v4',
  component: LayoutAdmin,
  children: [
    {
      path: 'overview-shop',
      component: () => import('components/pages/home/OverviewShop.vue')
    },
    {
      path: 'overview-package',
      component: () => import('components/pages/home/OverviewPackage.vue')
    },
    {
      path: 'overview-operation',
      component: () => import('components/pages/home/OverviewOperation.vue')
    }
  ]
}]
