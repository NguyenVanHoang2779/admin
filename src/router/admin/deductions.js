import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/deduction-again',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/Deductions/DeductionAgain')
      }
    ]
  }
]
