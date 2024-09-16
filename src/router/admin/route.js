import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [{
  path: '/route',
  component: LayoutAdmin,
  children: [
    {
      path: 'manage-difficult-route',
      name: 'manage-difficult-route',
      component: () => import('components/pages/Route/ManageDifficultRoute')
    },
    {
      path: 'manage-conf-min-wage-driver',
      name: 'manage-conf-min-wage-driver',
      component: () => import('components/pages/Route/ManageConfMinWageDriver')
    }
  ]
}]
