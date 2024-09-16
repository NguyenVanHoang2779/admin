import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/executive/manage',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/ExecutiveTeam/ExecutiveTeamManage')
      }
    ]
  }
]
