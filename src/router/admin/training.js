import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/training',
    component: LayoutAdmin,
    children: [
      {
        path: 'list',
        name: 'training-list',
        component: () => import('components/pages/erp/Training/List')
      },
      {
        path: 'add',
        name: 'add-training',
        component: () => import('components/pages/erp/Training/Add')
      },
      {
        path: ':id/builder',
        name: 'build-training',
        component: () => import('components/pages/erp/Training/TraningBuilder')
      },
      {
        path: ':id/edit',
        name: 'edit-training',
        component: () => import('components/pages/erp/Training/EditTrainingTest')
      }
    ]
  }
]
