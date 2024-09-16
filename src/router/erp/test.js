import LayoutBlank from 'components/layout/LayoutBlank'

export default [
  {
    path: '/it',
    component: LayoutBlank,
    children: [
      {
        name: 'test',
        path: 'test',
        component: () => import('components/pages/Test/Test')
      }
    ]
  }
]
