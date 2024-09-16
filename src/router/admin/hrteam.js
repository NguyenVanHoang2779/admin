import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/hrteam',
    component: LayoutAdmin,
    children: [
      {
        path: 'manage',
        name: 'manager-hrteam',
        component: () => import('components/pages/HrTeam/HrTeamManager')
      },
      {
        path: 'add/',
        name: 'add-hrteam',
        component: () => import('components/pages/HrTeam/HrTeamUpdate')
      },
      {
        path: 'edit/:id',
        name: 'edit-hrteam',
        component: () => import('components/pages/HrTeam/HrTeamUpdate')
      },
      {
        path: 'working-overtime',
        name: 'working-overtime',
        component: () => import('components/pages/HrTeam/ManagerWorkingOvertime')
      }
    ]
  }
]
