import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/manage-list-cod',
    component: LayoutAdmin,
    children: [
      {
        path: 'list',
        name: 'manage-list-cod/list',
        component: () => import('components/pages/ManageListCod/ManagetListCOD')
      },
      {
        path: 'edit/:id',
        name: 'manage-list-cod/edit',
        component: () => import('components/pages/ManageListCod/CodSettingsForm')
      }
    ]
  }
]
