import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [{
  path: '/dashboard/external',
  component: LayoutAdmin,
  children: [
    {
      path: 'overview-external',
      component: () => import('components/pages/External/OverviewExternal.vue')
    }
  ]
}]
