import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/xteam-route-new',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/erp/kpi/xteamRouteNew/index')
      }
    ]
  }
]
