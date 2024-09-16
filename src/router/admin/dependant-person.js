import LayoutAdmin from 'components/layout/LayoutAdmin'
import authIam from '../middleware/auth-iam'

export default [
  {
    path: '/dependant-person',
    component: LayoutAdmin,
    children: [
      {
        path: 'manager/:id?',
        name: 'manager-dependant-person',
        component: () => import('components/pages/DependantPerson/DependantPeopleDashboard'),
        meta: {
          middleware: [authIam]
        }
      }
    ]
  }
]
