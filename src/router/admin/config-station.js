import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/config-station/station',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/ConfigStation/ManageConfigStation')
      }
    ]
  }
]
