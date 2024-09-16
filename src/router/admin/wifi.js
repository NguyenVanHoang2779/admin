import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/wifi',
    component: LayoutAdmin,
    children: [
      {
        path: 'manage',
        component: () => import('components/pages/Wifi/ManageWifi')
      }
    ]
  }
]
