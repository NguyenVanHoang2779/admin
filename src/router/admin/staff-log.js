import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/new-member',
    component: LayoutAdmin,
    children: [
      {
        path: 'list',
        name: 'list-new-members',
        component: () => import('components/pages/erp/StaffLog/List.vue')
      }
    ]
  }
]
