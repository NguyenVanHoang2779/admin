import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/insurance',
    component: LayoutAdmin,
    children: [
      {
        name: 'list',
        path: 'list:mp_id?',
        component: () => import('components/pages/erp/Insurance/InsuranceDash')
      }
    ]
  }
]
