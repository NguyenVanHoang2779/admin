import LayoutAdmin from 'components/layout/LayoutAdmin'
import authIam from '../middleware/auth-iam'

export default [
  {
    path: '/income-tax',
    component: LayoutAdmin,
    children: [
      {
        path: '/',
        name: 'income-tax-certification-listing',
        component: () => import('components/pages/IncomeTax/IncomeTaxListing'),
        meta: {
          middleware: [authIam]
        }
      }
    ]
  }
]
