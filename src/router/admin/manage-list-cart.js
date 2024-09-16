import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/manage-list-cart',
    component: LayoutAdmin,
    children: [
      {
        path: 'list',
        name: 'manage-list-cart/list',
        component: () => import('components/pages/ManageListCart/ManageListCart'),
        props: true
      },
      {
        path: 'config-return-cart/edit/:id/:alias',
        name: 'manage-list-cart/config-return-cart',
        component: () => import('components/pages/ManageListCart/ConfigReturnCart'),
        props: true
      }
    ]
  },
  {
    path: '/manage-list-cart',
    component: LayoutAdmin,
    children: [
      {
        path: 'create',
        name: '/create-cart',
        component: () => import('components/pages/ManageListCart/CreateCart')
      }
    ]
  },
  {
    path: '/manage-list-cart',
    component: LayoutAdmin,
    children: [
      {
        path: 'edit/:id',
        name: '/edit-cart',
        component: () => import('components/pages/ManageListCart/EditCart')
      }
    ]
  }
]
