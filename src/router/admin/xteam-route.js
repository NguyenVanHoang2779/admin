import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/xteam-route',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/erp/kpi/xteamRoute/index')
      }
    ]
  }
]
