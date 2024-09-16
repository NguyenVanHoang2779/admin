import LayoutAdmin from 'components/layout/LayoutAdmin'
import authIam from '../middleware/auth-iam'

export default [
  {
    path: '/user',
    component: LayoutAdmin,
    children: [
      {
        path: 'add/:id?',
        name: 'add-user',
        component: () => import('components/pages/erp/profile/UpdateUser'),
        props: true
      },
      {
        path: 'edit/:id?',
        name: 'edit-user',
        component: () => import('components/pages/erp/profile/UpdateUser'),
        props: true,
        meta: {
          middleware: [authIam]
        }
      },
      {
        path: 'detail/:id?',
        name: 'detail-user',
        component: () => import('components/pages/erp/profile/DetailUser'),
        props: true
      }
    ]
  }
]
