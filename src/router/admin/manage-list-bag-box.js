import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/manage-list-bag-box',
    component: LayoutAdmin,
    children: [
      {
        path: '/',
        name: 'manage-list-bag-box/list',
        component: () => import('components/pages/ManageListBagBox/ManageListBagBox')
      }
    ]
  }
]
