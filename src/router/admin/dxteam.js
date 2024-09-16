import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/dxteam',
    component: LayoutAdmin,
    children: [
      {
        path: 'manage',
        component: () => import('components/pages/erp/Dxteam/DxteamManager')
      }
    ]
  }
]
