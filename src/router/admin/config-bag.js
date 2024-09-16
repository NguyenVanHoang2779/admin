import LayoutAdmin from 'components/layout/LayoutAdmin'

export default [
  {
    path: '/config-bag/list',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('components/pages/ConfigBag/List')
      }
    ]
  }
]
