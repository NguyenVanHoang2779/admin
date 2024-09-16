import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [{
  // Layout 2
  path: '/profile-statistic',
  component: LayoutAdmin,
  children: [
    {
      path: 'charts',
      name: 'profile-statistic-charts',
      component: () => import('components/pages/ProfileStatistic/ProfileStatistic')
    }
  ]
}]
