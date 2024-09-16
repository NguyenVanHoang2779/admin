import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/evaluation',
    component: LayoutAdmin,
    children: [
      {
        path: 'manage',
        name: 'manager-evaluation',
        component: () => import('components/pages/Evaluation/EvaluationManager')
      },
      {
        path: 'detail/:id',
        name: 'detail-evaluation',
        component: () => import('components/pages/Evaluation/DetailEvaluation')
      }
    ]
  }
]
